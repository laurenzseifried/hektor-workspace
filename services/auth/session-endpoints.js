/**
 * Session Management Endpoints
 * 
 * - GET /auth/sessions — List active sessions for current user
 * - DELETE /auth/sessions/:id — Revoke a specific session
 * - DELETE /auth/sessions — Revoke all sessions (force re-login)
 */

import {
  getUserSessions,
  invalidateSession,
  invalidateAllUserSessions,
  checkSuspiciousActivity,
} from './session-store.js';

/**
 * Handle GET /auth/sessions
 * List all active sessions for the current user
 */
export function handleListSessions(req) {
  if (!req.auth || req.auth.error) {
    return {
      statusCode: 401,
      body: { error: 'Authentication required' },
    };
  }

  const userId = req.auth.userId;
  const sessions = getUserSessions(userId);

  // Add suspicious activity info
  const sessionsWithActivity = sessions.map(session => {
    const suspicious = checkSuspiciousActivity(session.sessionId);
    return {
      ...session,
      suspicious: suspicious?.suspicious || false,
      ipChanges: suspicious?.totalChanges || 0,
    };
  });

  return {
    statusCode: 200,
    body: {
      sessions: sessionsWithActivity,
      total: sessionsWithActivity.length,
      maxConcurrentSessions: 3,
    },
  };
}

/**
 * Handle DELETE /auth/sessions/:id
 * Revoke a specific session
 */
export function handleRevokeSession(req, sessionId) {
  if (!req.auth || req.auth.error) {
    return {
      statusCode: 401,
      body: { error: 'Authentication required' },
    };
  }

  const userId = req.auth.userId;
  const currentSessionId = req.sessionId; // Set by middleware

  // Prevent user from revoking their current session via this endpoint
  // (they should use logout instead)
  if (sessionId === currentSessionId) {
    return {
      statusCode: 400,
      body: {
        error: 'Cannot revoke current session. Use /auth/logout instead.',
      },
    };
  }

  // Verify session belongs to this user
  const userSessions = getUserSessions(userId);
  const sessionExists = userSessions.some(s => s.sessionId === sessionId);

  if (!sessionExists) {
    return {
      statusCode: 404,
      body: { error: 'Session not found' },
    };
  }

  // Revoke the session
  invalidateSession(sessionId);

  console.log(`[auth] Session revoked: ${sessionId} by user ${userId}`);

  return {
    statusCode: 200,
    body: {
      ok: true,
      message: 'Session revoked successfully',
    },
  };
}

/**
 * Handle DELETE /auth/sessions (all)
 * Revoke all sessions for current user (force re-login)
 */
export function handleRevokeAllSessions(req) {
  if (!req.auth || req.auth.error) {
    return {
      statusCode: 401,
      body: { error: 'Authentication required' },
    };
  }

  const userId = req.auth.userId;
  const count = invalidateAllUserSessions(userId);

  console.log(`[auth] All ${count} sessions revoked for user ${userId}`);

  return {
    statusCode: 200,
    body: {
      ok: true,
      message: `All ${count} sessions revoked. Please log in again.`,
      sessionsRevoked: count,
    },
  };
}

export default {
  handleListSessions,
  handleRevokeSession,
  handleRevokeAllSessions,
};
