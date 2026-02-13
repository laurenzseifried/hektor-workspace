#!/usr/bin/env node
/**
 * Authentication Endpoints
 * 
 * Handles:
 * - POST /auth/login — Authenticate user, return access + refresh tokens + set session cookie
 * - POST /auth/refresh — Refresh access token using refresh token
 * - POST /auth/logout — Revoke session + tokens for user
 */

import jwt from 'jsonwebtoken';
import { generateTokenPair } from './token-generator.js';
import { 
  registerRefreshToken,
  getRefreshToken,
  invalidateToken,
  revokeUserTokens,
  isTokenInvalidated,
} from './token-store.js';
import {
  createSession,
  invalidateAllUserSessions,
} from './session-store.js';
import {
  setSessionCookie,
  clearSessionCookie,
  getClientIp,
  getUserAgent,
} from './cookie-middleware.js';

// --- Configuration ---
const ADMIN_USERNAME = process.env.OPENCLAW_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.OPENCLAW_ADMIN_PASSWORD || 'changeme';
const OPENCLAW_JWT_PUBLIC_KEY = process.env.OPENCLAW_JWT_PUBLIC_KEY;

/**
 * Simple user database (in production, use a real DB)
 * Format: { username, passwordHash, id, role, permissions }
 */
const users = {
  [ADMIN_USERNAME]: {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD, // In production, use bcrypt!
    id: 'admin-001',
    role: 'admin',
    permissions: ['*'], // All permissions
    enabled: true,
  },
  operator: {
    username: 'operator',
    password: 'operator123',
    id: 'user-001',
    role: 'operator',
    permissions: ['tasks:read', 'tasks:write', 'webhooks:read'],
    enabled: true,
  },
};

/**
 * Authenticate user (simple username/password)
 * @param {string} username
 * @param {string} password
 * @returns {object|null} - User object or null if invalid
 */
function authenticateUser(username, password) {
  const user = users[username];

  if (!user) {
    return null;
  }

  // In production, use bcrypt.compare()
  if (user.password !== password) {
    return null;
  }

  if (!user.enabled) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
  };
}

/**
 * Login Endpoint
 * 
 * Request:
 * ```json
 * {
 *   "username": "admin",
 *   "password": "changeme"
 * }
 * ```
 * 
 * Response (200):
 * ```json
 * {
 *   "accessToken": "eyJhbGc...",
 *   "refreshToken": "eyJhbGc...",
 *   "expiresIn": 900,
 *   "user": { "id": "admin-001", "role": "admin" },
 *   "sessionId": "abc123..."
 * }
 * ```
 * 
 * Sets httpOnly session cookie:
 * - httpOnly: true (prevents JavaScript access)
 * - secure: true (HTTPS only)
 * - sameSite: strict (CSRF prevention)
 * 
 * Error (401):
 * ```json
 * {
 *   "error": "invalid_credentials"
 * }
 * ```
 */
function handleLogin(req, body) {
  const { username, password } = body;

  if (!username || !password) {
    return {
      statusCode: 422,
      body: { error: 'missing_credentials' },
    };
  }

  // Authenticate user
  const user = authenticateUser(username, password);
  if (!user) {
    console.warn(`[auth] Failed login attempt for user: ${username}`);
    return {
      statusCode: 401,
      body: { error: 'invalid_credentials' },
    };
  }

  // Generate tokens
  const tokens = generateTokenPair(user);

  // Register refresh token
  const refreshPayload = jwt.decode(tokens.refreshToken);
  registerRefreshToken(
    refreshPayload.jti,
    user.id,
    refreshPayload.exp,
    0
  );

  // Create session (will auto-invalidate oldest if > 3 sessions)
  const ipAddress = getClientIp(req);
  const userAgent = getUserAgent(req);
  const session = createSession(user.id, ipAddress, userAgent);

  // Set secure session cookie
  setSessionCookie(req.res, session.sessionId, {
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  console.log(`[auth] Login successful: user=${user.id}, role=${user.role}, sessionId=${session.sessionId}`);

  return {
    statusCode: 200,
    body: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      sessionId: session.sessionId,
      user: {
        id: user.id,
        role: user.role,
      },
    },
    // Note: Session cookie is set via setSessionCookie() above
  };
}

/**
 * Refresh Token Endpoint
 * 
 * Request:
 * ```json
 * {
 *   "refreshToken": "eyJhbGc..."
 * }
 * ```
 * 
 * Response (200):
 * ```json
 * {
 *   "accessToken": "eyJhbGc...",
 *   "refreshToken": "eyJhbGc...",
 *   "expiresIn": 900
 * }
 * ```
 * 
 * Errors:
 * - 401: Invalid/expired/rotated refresh token
 * - 403: User account disabled
 * - 422: Missing refresh token
 */
function handleRefresh(req, body) {
  const { refreshToken } = body;

  if (!refreshToken) {
    return {
      statusCode: 422,
      body: { error: 'missing_refresh_token' },
    };
  }

  // Decode and validate refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, OPENCLAW_JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: process.env.OPENCLAW_JWT_ISSUER || 'openclaw-deployment',
      audience: 'openclaw-refresh',
    });
  } catch (err) {
    console.warn(`[auth] Failed refresh attempt: ${err.message}`);
    return {
      statusCode: 401,
      body: { error: 'invalid_refresh_token' },
    };
  }

  const { jti, sub: userId, rotation } = decoded;

  // Check if token has been rotated (already used)
  if (isTokenInvalidated(jti)) {
    console.warn(`[auth] Attempted reuse of rotated token: jti=${jti}, user=${userId}`);
    // SECURITY: Revoke all tokens for this user (potential token theft)
    revokeUserTokens(userId);
    return {
      statusCode: 401,
      body: { error: 'invalid_refresh_token' },
    };
  }

  // Check if user still exists and is enabled
  let user = null;
  for (const u of Object.values(users)) {
    if (u.id === userId) {
      user = u;
      break;
    }
  }

  if (!user || !user.enabled) {
    console.warn(`[auth] User disabled or not found: ${userId}`);
    return {
      statusCode: 403,
      body: { error: 'user_disabled' },
    };
  }

  // Generate new token pair
  const userData = {
    id: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
  };

  const newTokens = generateTokenPair(userData, rotation + 1);

  // Invalidate old refresh token
  invalidateToken(jti, 'refresh_token_rotated');

  // Register new refresh token
  const newRefreshPayload = jwt.decode(newTokens.refreshToken);
  registerRefreshToken(
    newRefreshPayload.jti,
    user.id,
    newRefreshPayload.exp,
    rotation + 1
  );

  console.log(`[auth] Token refresh successful: user=${user.id}, rotation=${rotation + 1}`);

  return {
    statusCode: 200,
    body: {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresIn: newTokens.expiresIn,
    },
  };
}

/**
 * Logout Endpoint
 * 
 * Requires authentication (uses req.auth)
 * Invalidates:
 * - Current session
 * - All refresh tokens for user
 * - Clears session cookie
 * 
 * Response (200):
 * ```json
 * {
 *   "ok": true,
 *   "message": "Logged out successfully"
 * }
 * ```
 */
function handleLogout(req) {
  if (!req.auth || req.auth.error) {
    return {
      statusCode: 401,
      body: { error: 'Authentication required' },
    };
  }

  const userId = req.auth.userId;

  // Invalidate all sessions and tokens for user
  const sessionCount = invalidateAllUserSessions(userId);
  revokeUserTokens(userId);

  // Clear session cookie
  clearSessionCookie(req.res);

  console.log(`[auth] Logout successful: user=${userId}, sessions invalidated: ${sessionCount}`);

  return {
    statusCode: 200,
    body: {
      ok: true,
      message: 'Logged out successfully',
      sessionsInvalidated: sessionCount,
    },
  };
}

/**
 * Export for use in other modules
 */
export {
  handleLogin,
  handleRefresh,
  handleLogout,
  authenticateUser,
  users,
};

// Example usage
if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log('\n🔐 Authentication Endpoints\n');
  
  // Test login
  const loginResult = handleLogin({}, {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });

  console.log('Login result:');
  console.log(JSON.stringify(loginResult, null, 2));
}
