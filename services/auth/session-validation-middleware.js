#!/usr/bin/env node
/**
 * Session Validation Middleware
 * 
 * For protected routes: validate session from httpOnly cookie,
 * check timeouts, update activity, detect IP changes with alerts
 * 
 * Usage in request handler:
 * ```javascript
 * const result = validateSessionFromCookie(req);
 * if (!result.valid) {
 *   res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
 *   return res.end(JSON.stringify({ error: result.error }));
 * }
 * // result.session, result.userId now available
 * // req.session = result.session;
 * ```
 */

import {
  validateSession,
  updateSessionActivity,
  getSession,
} from './session-store.js';
import {
  extractSessionIdFromCookie,
  getClientIp,
  getUserAgent,
} from './cookie-middleware.js';

/**
 * Validate session from httpOnly cookie
 * - Extract session ID from cookie
 * - Check if session still valid (timeouts)
 * - Detect IP changes (geo-alert)
 * - Update activity (sliding window)
 * 
 * @param {http.IncomingMessage} req
 * @returns {object} { valid, statusCode, error, session, userId }
 */
function validateSessionFromCookie(req) {
  const sessionId = extractSessionIdFromCookie(req.headers.cookie);
  
  if (!sessionId) {
    return {
      valid: false,
      statusCode: 401,
      error: 'No session cookie found',
      reason: 'missing_session_cookie',
    };
  }

  // Get session from store
  const session = getSession(sessionId);
  if (!session) {
    return {
      valid: false,
      statusCode: 401,
      error: 'Session not found',
      reason: 'session_not_found',
    };
  }

  // Validate timeouts (absolute + sliding window)
  const validation = validateSession(sessionId);
  if (!validation.valid) {
    return {
      valid: false,
      statusCode: 401,
      error: `Session invalid: ${validation.reason}`,
      reason: validation.reason,
    };
  }

  // Get current IP and user agent
  const currentIp = getClientIp(req);
  const currentUserAgent = getUserAgent(req);

  // Check for IP change (potential security issue)
  const ipChanged = currentIp !== session.ipAddress;
  if (ipChanged) {
    const change = {
      timestamp: Date.now(),
      oldIp: session.ipAddress,
      newIp: currentIp,
    };
    
    console.warn(`\n⚠️  [session] IP CHANGE DETECTED`);
    console.warn(`  Session ID: ${sessionId}`);
    console.warn(`  User ID: ${session.userId}`);
    console.warn(`  Old IP: ${session.ipAddress}`);
    console.warn(`  New IP: ${currentIp}`);
    console.warn(`  User-Agent: ${currentUserAgent}`);
    console.warn(`  Timestamp: ${new Date(change.timestamp).toISOString()}\n`);

    // Log to audit log (for compliance)
    logIpChangeAlert(session.userId, sessionId, change);
  }

  // Check for user agent change (less critical)
  const userAgentChanged = currentUserAgent !== session.userAgent;
  if (userAgentChanged) {
    console.log(`[session] User-Agent changed for session ${sessionId}: "${session.userAgent}" → "${currentUserAgent}"`);
  }

  // Update activity (sliding window)
  updateSessionActivity(sessionId, currentIp);

  return {
    valid: true,
    statusCode: 200,
    session,
    userId: session.userId,
    ipChanged,
    userAgentChanged,
  };
}

/**
 * Log IP change alert to audit log
 * Used for compliance + fraud detection
 * 
 * @param {string} userId
 * @param {string} sessionId
 * @param {object} change - { timestamp, oldIp, newIp }
 */
function logIpChangeAlert(userId, sessionId, change) {
  const auditEntry = {
    type: 'session.ip_change',
    timestamp: change.timestamp,
    userId,
    sessionId,
    oldIp: change.oldIp,
    newIp: change.newIp,
    severity: 'warning',
    description: `IP address changed during active session`,
  };

  // TODO: Write to audit log file or database
  // For now, log to console (already done above)
  
  // In production: write to audit log + send alert to admin
  // Example:
  // - Write to /logs/audit.log
  // - Send Telegram alert if configured
  // - Check if IP is from blacklist or suspicious region
  
  return auditEntry;
}

/**
 * Middleware wrapper for protected routes
 * 
 * Usage:
 * ```javascript
 * if (req.method === 'POST' && req.url === '/protected-route') {
 *   const sessionCheck = sessionValidationMiddleware(req, res);
 *   if (!sessionCheck.valid) {
 *     res.writeHead(sessionCheck.statusCode, { 'Content-Type': 'application/json' });
 *     return res.end(JSON.stringify({ error: sessionCheck.error }));
 *   }
 *   req.session = sessionCheck.session;
 *   req.userId = sessionCheck.userId;
 *   // continue processing
 * }
 * ```
 */
function sessionValidationMiddleware(req, res) {
  const result = validateSessionFromCookie(req);
  
  if (!result.valid) {
    console.warn(`[session-validation] Failed: ${result.reason} (session not provided or invalid)`);
    // Clear cookie on invalid session
    if (res && typeof res.writeHead === 'function') {
      res.setHeader('Set-Cookie', 'session_id=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    }
  }
  
  return result;
}

export {
  validateSessionFromCookie,
  sessionValidationMiddleware,
  logIpChangeAlert,
};
