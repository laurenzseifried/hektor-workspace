#!/usr/bin/env node
/**
 * JWT Authentication Middleware
 * 
 * Validates JWT tokens on protected routes using RS256 algorithm.
 * 
 * Features:
 * - Token signature verification (RS256)
 * - Expiration validation
 * - Issuer (iss) claim validation
 * - Audience (aud) claim validation
 * - User role + permissions extraction
 * - Failed attempt logging (IP, timestamp, reason)
 * - No detailed error info in 401 responses (security)
 */

import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'node:url';

// --- Config ---
const OPENCLAW_JWT_PUBLIC_KEY = process.env.OPENCLAW_JWT_PUBLIC_KEY;
const OPENCLAW_JWT_ISSUER = process.env.OPENCLAW_JWT_ISSUER || 'openclaw-deployment';
const OPENCLAW_JWT_AUDIENCE = process.env.OPENCLAW_JWT_AUDIENCE || 'openclaw-api';

// In-memory log of failed attempts (in production, use a database)
const failedAttempts = [];

/**
 * Log failed authentication attempt
 * @param {string} ip - Client IP address
 * @param {string} reason - Failure reason
 * @param {string} token - Token (for debugging, truncated)
 */
function logFailedAttempt(ip, reason, token = null) {
  const attempt = {
    timestamp: new Date().toISOString(),
    ip,
    reason,
    tokenPrefix: token ? token.substring(0, 20) + '...' : null,
  };

  failedAttempts.push(attempt);

  // Keep only last 1000 attempts
  if (failedAttempts.length > 1000) {
    failedAttempts.shift();
  }

  console.warn(`[auth] Failed auth attempt: IP=${ip}, reason=${reason}, time=${attempt.timestamp}`);
}

/**
 * Extract client IP from request
 */
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Extract Authorization header token
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Token or null if invalid
 */
function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}

/**
 * Validate JWT and extract claims
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token or null on failure
 */
function validateJWT(token) {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, OPENCLAW_JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: OPENCLAW_JWT_ISSUER,
      audience: OPENCLAW_JWT_AUDIENCE,
    });

    return decoded;
  } catch (err) {
    // Specific error handling
    if (err.name === 'TokenExpiredError') {
      return { error: 'token_expired', time: err.expiredAt };
    } else if (err.name === 'JsonWebTokenError') {
      return { error: 'invalid_token', message: err.message };
    } else if (err.name === 'NotBeforeError') {
      return { error: 'token_not_yet_valid', time: err.date };
    }
    return { error: 'verification_failed', message: err.message };
  }
}

/**
 * JWT Authentication Middleware
 * 
 * Usage in Express-like server:
 * 
 *   const { jwtMiddleware } = require('./jwt-middleware.js');
 *   app.use('/protected/*', jwtMiddleware);
 * 
 * Or in plain Node HTTP server:
 * 
 *   const { jwtMiddleware } = require('./jwt-middleware.js');
 *   
 *   function handleRequest(req, res) {
 *     if (isProtectedRoute(req)) {
 *       const result = jwtMiddleware(req);
 *       if (result.error) {
 *         res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
 *         res.end(JSON.stringify({ error: result.errorMessage }));
 *         return;
 *       }
 *       req.auth = result;
 *     }
 *     // ... continue with request handling
 *   }
 * 
 * @param {http.IncomingMessage} req - HTTP request object
 * @returns {object} - { error?: boolean, statusCode?: number, errorMessage?: string, ...decodedToken }
 */
function jwtMiddleware(req) {
  const ip = getClientIp(req);
  const authHeader = req.headers.authorization;

  // Missing authorization header
  if (!authHeader) {
    logFailedAttempt(ip, 'missing_authorization_header');
    return {
      error: true,
      statusCode: 401,
      errorMessage: 'Unauthorized',
    };
  }

  // Invalid format (must be "Bearer <token>")
  if (!authHeader.startsWith('Bearer ')) {
    logFailedAttempt(ip, 'invalid_authorization_format');
    return {
      error: true,
      statusCode: 401,
      errorMessage: 'Unauthorized',
    };
  }

  // Extract token
  const token = extractToken(authHeader);
  if (!token) {
    logFailedAttempt(ip, 'token_extraction_failed');
    return {
      error: true,
      statusCode: 401,
      errorMessage: 'Unauthorized',
    };
  }

  // Validate JWT
  const decoded = validateJWT(token);
  if (!decoded || decoded.error) {
    logFailedAttempt(ip, decoded?.error || 'unknown_error', token);
    return {
      error: true,
      statusCode: 401,
      errorMessage: 'Unauthorized',
    };
  }

  // Success: attach decoded token to request
  return {
    error: false,
    userId: decoded.sub,
    role: decoded.role,
    permissions: decoded.permissions || [],
    tokenId: decoded.jti,
    issuedAt: new Date(decoded.iat * 1000),
    expiresAt: new Date(decoded.exp * 1000),
    ...decoded,
  };
}

/**
 * Optional: Check if user has required permission
 * @param {object} auth - Auth object from jwtMiddleware
 * @param {string} permission - Required permission (e.g., "tasks:write")
 * @returns {boolean}
 */
function hasPermission(auth, permission) {
  if (!auth || !auth.permissions) return false;
  return auth.permissions.includes(permission);
}

/**
 * Optional: Check if user has required role
 * @param {object} auth - Auth object from jwtMiddleware
 * @param {string[]} allowedRoles - Allowed roles (e.g., ["admin", "operator"])
 * @returns {boolean}
 */
function hasRole(auth, allowedRoles) {
  if (!auth || !auth.role) return false;
  return allowedRoles.includes(auth.role);
}

/**
 * Export for use in other modules
 */
export {
  jwtMiddleware,
  hasPermission,
  hasRole,
  validateJWT,
  extractToken,
  getClientIp,
  logFailedAttempt,
  failedAttempts,
};

// Run validation if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('\n🔐 JWT Middleware Module\n');
  console.log('This module exports:');
  console.log('  - jwtMiddleware(req) — Main middleware function');
  console.log('  - hasPermission(auth, permission) — Check permission');
  console.log('  - hasRole(auth, allowedRoles) — Check role');
  console.log('  - validateJWT(token) — Validate token');
  console.log('  - failedAttempts — Log of failed authentication attempts\n');
}
