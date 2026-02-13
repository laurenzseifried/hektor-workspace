#!/usr/bin/env node
/**
 * IP Whitelist Middleware
 * 
 * Implements IP-based access control for admin routes
 * - IPv4 and IPv6 support
 * - CIDR range matching
 * - X-Forwarded-For header support (proxies)
 * - Comprehensive access logging
 * 
 * Configuration via environment variables:
 * - ADMIN_ALLOWED_IPS=192.168.1.0/24,10.0.0.1,2001:db8::/32
 * - API_ADMIN_ALLOWED_IPS=192.168.1.0/24 (for /api/v1/admin/*)
 * 
 * Usage:
 * ```javascript
 * import { checkIPWhitelist } from './ip-whitelist-middleware.js';
 * 
 * const result = checkIPWhitelist(req, { path: '/admin/users' });
 * if (!result.allowed) {
 *   res.writeHead(403, { 'Content-Type': 'application/json' });
 *   return res.end(JSON.stringify({ error: 'Access denied' }));
 * }
 * ```
 */

import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Access log file
const ACCESS_LOG_PATH = path.resolve(__dirname, '../../logs/ip-access.log');
fs.mkdirSync(path.dirname(ACCESS_LOG_PATH), { recursive: true });

/**
 * Parse IP whitelist from environment variable
 * Format: "192.168.1.0/24,10.0.0.1,2001:db8::/32"
 * 
 * @param {string} ipList - Comma-separated IP/CIDR list
 * @returns {array} - Array of { ip, mask, version, isCIDR }
 */
function parseIPWhitelist(ipList) {
  if (!ipList) return [];

  return ipList
    .split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0)
    .map(ipEntry => {
      const isCIDR = ipEntry.includes('/');
      
      if (isCIDR) {
        const [ipPart, maskStr] = ipEntry.split('/');
        const mask = parseInt(maskStr, 10);
        const version = net.isIPv6(ipPart) ? 6 : 4;
        return {
          ip: ipPart,
          mask,
          version,
          isCIDR: true,
          original: ipEntry,
        };
      } else {
        const version = net.isIPv6(ipEntry) ? 6 : 4;
        return {
          ip: ipEntry,
          mask: version === 4 ? 32 : 128,
          version,
          isCIDR: false,
          original: ipEntry,
        };
      }
    });
}

/**
 * Check if IP matches a CIDR range (IPv4)
 * 
 * @param {string} ip - IP address
 * @param {string} cidr - CIDR range (e.g., "192.168.1.0/24")
 * @returns {boolean}
 */
function ipInCIDR4(ip, cidr) {
  const [cidrIp, maskBits] = cidr.split('/');
  const mask = parseInt(maskBits, 10);

  // Convert IP strings to 32-bit integers
  const ipNum = ip.split('.').reduce((acc, part) => (acc << 8) | parseInt(part, 10), 0);
  const cidrNum = cidrIp.split('.').reduce((acc, part) => (acc << 8) | parseInt(part, 10), 0);

  // Create mask
  const maskNum = (0xffffffff << (32 - mask)) >>> 0;

  return (ipNum & maskNum) === (cidrNum & maskNum);
}

/**
 * Check if IP matches a CIDR range (IPv6)
 * 
 * @param {string} ip - IPv6 address
 * @param {string} cidr - CIDR range (e.g., "2001:db8::/32")
 * @returns {boolean}
 */
function ipInCIDR6(ip, cidr) {
  try {
    const [cidrIp, maskBits] = cidr.split('/');
    const mask = parseInt(maskBits, 10);

    // Use Node's net module for IPv6 comparison
    const ipBuffer = Buffer.alloc(16);
    const cidrBuffer = Buffer.alloc(16);

    net.pton(ip, ipBuffer);
    net.pton(cidrIp, cidrBuffer);

    const maskBytes = Math.floor(mask / 8);
    const maskBitsRem = mask % 8;

    // Compare full bytes
    for (let i = 0; i < maskBytes; i++) {
      if (ipBuffer[i] !== cidrBuffer[i]) {
        return false;
      }
    }

    // Compare remaining bits
    if (maskBitsRem > 0) {
      const maskByte = (0xff << (8 - maskBitsRem)) & 0xff;
      if ((ipBuffer[maskBytes] & maskByte) !== (cidrBuffer[maskBytes] & maskByte)) {
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error(`[ip-whitelist] IPv6 CIDR check failed: ${err.message}`);
    return false;
  }
}

/**
 * Check if IP matches whitelist entry
 * 
 * @param {string} ip - Client IP
 * @param {object} entry - Whitelist entry { ip, mask, version, isCIDR }
 * @returns {boolean}
 */
function ipMatches(ip, entry) {
  if (entry.version === 4) {
    if (entry.isCIDR) {
      return ipInCIDR4(ip, `${entry.ip}/${entry.mask}`);
    } else {
      return ip === entry.ip;
    }
  } else if (entry.version === 6) {
    if (entry.isCIDR) {
      return ipInCIDR6(ip, `${entry.ip}/${entry.mask}`);
    } else {
      return ip === entry.ip;
    }
  }
  return false;
}

/**
 * Get client IP from request
 * Supports X-Forwarded-For header for proxied requests
 * 
 * @param {http.IncomingMessage} req
 * @returns {string} - Client IP address
 */
function getClientIP(req) {
  // Check X-Forwarded-For header first (for proxies)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // Take the first IP (original client)
    return forwarded.split(',')[0].trim();
  }

  // Fall back to socket address
  return req.socket.remoteAddress || 'unknown';
}

/**
 * Log access attempt (allowed or blocked)
 * 
 * @param {object} opts - { ip, path, allowed, reason, timestamp }
 */
function logAccessAttempt(opts) {
  const {
    ip,
    path: reqPath,
    allowed,
    reason,
    timestamp = new Date().toISOString(),
  } = opts;

  const status = allowed ? 'ALLOWED' : 'BLOCKED';
  const logEntry = `[${timestamp}] ${status} | IP: ${ip} | Path: ${reqPath} | Reason: ${reason}\n`;

  // Log to file
  fs.appendFile(ACCESS_LOG_PATH, logEntry, (err) => {
    if (err) {
      console.error(`[ip-whitelist] Failed to write access log: ${err.message}`);
    }
  });

  // Also log to console for visibility
  const level = allowed ? 'info' : 'warn';
  console.log(`[ip-whitelist] ${status}: ${ip} → ${reqPath} (${reason})`);
}

/**
 * Check IP whitelist for a request
 * 
 * @param {http.IncomingMessage} req
 * @param {object} opts - { path, whitelistEnvVar, pathPrefix }
 * @returns {object} - { allowed, reason, clientIP }
 */
function checkIPWhitelist(req, opts = {}) {
  const {
    path: reqPath = req.url,
    whitelistEnvVar = 'ADMIN_ALLOWED_IPS',
    pathPrefix = '/admin',
  } = opts;

  // Get client IP
  const clientIP = getClientIP(req);

  // Parse whitelist from environment
  const ipListStr = process.env[whitelistEnvVar];
  if (!ipListStr) {
    logAccessAttempt({
      ip: clientIP,
      path: reqPath,
      allowed: false,
      reason: `Whitelist not configured (${whitelistEnvVar})`,
    });
    return {
      allowed: false,
      reason: 'IP whitelist not configured',
      clientIP,
    };
  }

  const whitelist = parseIPWhitelist(ipListStr);
  if (whitelist.length === 0) {
    logAccessAttempt({
      ip: clientIP,
      path: reqPath,
      allowed: false,
      reason: `Whitelist empty (${whitelistEnvVar})`,
    });
    return {
      allowed: false,
      reason: 'IP whitelist is empty',
      clientIP,
    };
  }

  // Check if client IP matches any whitelist entry
  for (const entry of whitelist) {
    if (ipMatches(clientIP, entry)) {
      logAccessAttempt({
        ip: clientIP,
        path: reqPath,
        allowed: true,
        reason: `Matched whitelist entry: ${entry.original}`,
      });
      return {
        allowed: true,
        reason: 'IP matched whitelist',
        clientIP,
      };
    }
  }

  // No match
  logAccessAttempt({
    ip: clientIP,
    path: reqPath,
    allowed: false,
    reason: 'IP not in whitelist',
  });

  return {
    allowed: false,
    reason: 'IP not in whitelist',
    clientIP,
  };
}

/**
 * Middleware wrapper for IP whitelist checks
 * 
 * Usage:
 * ```javascript
 * if (req.url.startsWith('/admin/')) {
 *   const check = ipWhitelistMiddleware(req, res, {
 *     whitelistEnvVar: 'ADMIN_ALLOWED_IPS'
 *   });
 *   if (!check.allowed) {
 *     res.writeHead(403, { 'Content-Type': 'application/json' });
 *     return res.end(JSON.stringify({ error: 'Access denied' }));
 *   }
 * }
 * ```
 */
function ipWhitelistMiddleware(req, res, opts = {}) {
  return checkIPWhitelist(req, opts);
}

/**
 * Get access log summary (for debugging)
 * 
 * @param {number} lines - Number of lines to read (default: 100)
 * @returns {array} - Array of log entries
 */
function getAccessLogSummary(lines = 100) {
  try {
    if (!fs.existsSync(ACCESS_LOG_PATH)) {
      return [];
    }
    const content = fs.readFileSync(ACCESS_LOG_PATH, 'utf-8');
    return content.split('\n').filter(l => l.length > 0).slice(-lines);
  } catch (err) {
    console.error(`[ip-whitelist] Failed to read access log: ${err.message}`);
    return [];
  }
}

export {
  checkIPWhitelist,
  ipWhitelistMiddleware,
  parseIPWhitelist,
  getClientIP,
  getAccessLogSummary,
  logAccessAttempt,
};
