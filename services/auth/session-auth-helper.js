#!/usr/bin/env node
/**
 * Session Authentication Helper
 * 
 * Combines JWT validation + Session validation + RBAC for protected endpoints
 * 
 * Usage:
 * ```javascript
 * const authResult = await requireSessionAuth(req, res, {
 *   requiredRole: 'admin',
 *   checkIPChange: true,
 * });
 * 
 * if (!authResult.authorized) {
 *   res.writeHead(authResult.statusCode, { 'Content-Type': 'application/json' });
 *   return res.end(JSON.stringify({ error: authResult.error }));
 * }
 * 
 * // authResult.auth, authResult.session, authResult.userId available
 * ```
 */

import { jwtMiddleware } from './jwt-middleware.js';
import { sessionValidationMiddleware, validateSessionFromCookie } from './session-validation-middleware.js';
import { authorizationMiddleware } from './authorization.js';

/**
 * Authenticate request with JWT + Session + RBAC
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {object} options - { requiredRole, checkIPChange }
 * @returns {object} - { authorized, statusCode, error, auth, session, userId, ipChanged }
 */
function requireSessionAuth(req, res, options = {}) {
  const { requiredRole = null, checkIPChange = true } = options;

  // Step 1: Validate JWT token
  const auth = jwtMiddleware(req);
  if (auth.error) {
    return {
      authorized: false,
      statusCode: auth.statusCode,
      error: auth.errorMessage,
      errorCode: 'jwt_invalid',
    };
  }

  // Step 2: Validate session from httpOnly cookie
  const sessionResult = validateSessionFromCookie(req);
  if (!sessionResult.valid) {
    // Clear cookie on invalid session
    res.setHeader('Set-Cookie', 'session_id=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    
    return {
      authorized: false,
      statusCode: sessionResult.statusCode,
      error: sessionResult.error,
      errorCode: sessionResult.reason,
    };
  }

  // Step 3: Check RBAC if required role specified
  if (requiredRole) {
    const rbacResult = authorizationMiddleware(req, { requiredRole });
    if (rbacResult.error) {
      return {
        authorized: false,
        statusCode: rbacResult.statusCode,
        error: rbacResult.errorMessage,
        errorCode: 'rbac_denied',
        userRole: auth.role,
      };
    }
  }

  // All checks passed
  return {
    authorized: true,
    statusCode: 200,
    auth,
    session: sessionResult.session,
    userId: sessionResult.userId,
    ipChanged: checkIPChange ? sessionResult.ipChanged : false,
    userAgentChanged: sessionResult.userAgentChanged,
  };
}

/**
 * Shorthand: Require authenticated session (any role)
 */
function requireAuth(req, res) {
  return requireSessionAuth(req, res, { requiredRole: null });
}

/**
 * Shorthand: Require admin role
 */
function requireAdmin(req, res) {
  return requireSessionAuth(req, res, { requiredRole: 'admin' });
}

/**
 * Shorthand: Require owner role
 */
function requireOwner(req, res) {
  return requireSessionAuth(req, res, { requiredRole: 'owner' });
}

/**
 * Shorthand: Require developer role
 */
function requireDeveloper(req, res) {
  return requireSessionAuth(req, res, { requiredRole: 'developer' });
}

export {
  requireSessionAuth,
  requireAuth,
  requireAdmin,
  requireOwner,
  requireDeveloper,
};
