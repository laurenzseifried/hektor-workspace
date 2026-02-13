/**
 * Session Store
 * 
 * Manages user sessions with:
 * - Max 3 concurrent sessions per user
 * - 24-hour absolute timeout
 * - 15-minute sliding window
 * - Session tracking (IP, user agent, geo)
 * - Automatic invalidation of oldest session when limit exceeded
 */

import crypto from 'node:crypto';

// In-memory session store (upgrade to database in production)
const sessions = new Map(); // sessionId -> sessionData
const userSessions = new Map(); // userId -> [sessionIds...]
const geoCache = new Map(); // ip -> { country, city, timestamp }

// Configuration
const MAX_CONCURRENT_SESSIONS = 3;
const ABSOLUTE_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
const SLIDING_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const GEO_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Session data structure
function createSession(userId, ipAddress, userAgent) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  const session = {
    sessionId,
    userId,
    ipAddress,
    userAgent,
    createdAt: now,
    lastActivityAt: now,
    geoLocation: null,
    ipChanges: [], // Track IP changes
  };

  sessions.set(sessionId, session);

  // Track session per user
  if (!userSessions.has(userId)) {
    userSessions.set(userId, []);
  }
  userSessions.get(userId).push(sessionId);

  // Check if user exceeded max concurrent sessions
  const userSessionList = userSessions.get(userId);
  if (userSessionList.length > MAX_CONCURRENT_SESSIONS) {
    // Find oldest session and invalidate it
    let oldestSessionId = userSessionList[0];
    let oldestTime = sessions.get(oldestSessionId).createdAt;

    for (const sid of userSessionList) {
      const session = sessions.get(sid);
      if (session && session.createdAt < oldestTime) {
        oldestTime = session.createdAt;
        oldestSessionId = sid;
      }
    }

    console.log(`[session] Max concurrent sessions exceeded for user ${userId}. Invalidating oldest session: ${oldestSessionId}`);
    invalidateSession(oldestSessionId);
  }

  return session;
}

/**
 * Get session by ID
 */
function getSession(sessionId) {
  return sessions.get(sessionId);
}

/**
 * Validate session (check timeouts)
 * @returns { valid: boolean, reason: string }
 */
function validateSession(sessionId) {
  const session = getSession(sessionId);

  if (!session) {
    return { valid: false, reason: 'session_not_found' };
  }

  const now = Date.now();

  // Check absolute timeout (24 hours)
  if (now - session.createdAt > ABSOLUTE_TIMEOUT_MS) {
    invalidateSession(sessionId);
    return { valid: false, reason: 'absolute_timeout_exceeded' };
  }

  // Check sliding window (15 minutes inactivity)
  if (now - session.lastActivityAt > SLIDING_WINDOW_MS) {
    invalidateSession(sessionId);
    return { valid: false, reason: 'inactivity_timeout' };
  }

  return { valid: true, reason: 'ok' };
}

/**
 * Update session activity (sliding window)
 */
function updateSessionActivity(sessionId, newIpAddress = null) {
  const session = getSession(sessionId);
  if (!session) return false;

  const now = Date.now();
  session.lastActivityAt = now;

  // Check for IP change (geo-alert)
  if (newIpAddress && newIpAddress !== session.ipAddress) {
    console.warn(`[session] IP change detected for session ${sessionId}: ${session.ipAddress} → ${newIpAddress}`);
    session.ipChanges.push({
      timestamp: now,
      oldIp: session.ipAddress,
      newIp: newIpAddress,
    });
    session.ipAddress = newIpAddress;
    session.geoLocation = null; // Reset geo, will fetch on next request
  }

  return true;
}

/**
 * Invalidate a single session
 */
function invalidateSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return false;

  const userId = session.userId;
  sessions.delete(sessionId);

  // Remove from user's session list
  const userSessionList = userSessions.get(userId);
  if (userSessionList) {
    const index = userSessionList.indexOf(sessionId);
    if (index > -1) {
      userSessionList.splice(index, 1);
    }
    // Clean up empty user sessions
    if (userSessionList.length === 0) {
      userSessions.delete(userId);
    }
  }

  console.log(`[session] Session invalidated: ${sessionId}`);
  return true;
}

/**
 * Invalidate all sessions for a user
 * (on password change or key rotation)
 */
function invalidateAllUserSessions(userId) {
  const userSessionList = userSessions.get(userId);
  if (!userSessionList) return 0;

  const count = userSessionList.length;

  // Invalidate each session
  for (const sessionId of [...userSessionList]) {
    invalidateSession(sessionId);
  }

  console.log(`[session] All sessions invalidated for user ${userId} (${count} sessions)`);
  return count;
}

/**
 * Get all active sessions for a user
 */
function getUserSessions(userId) {
  const sessionIds = userSessions.get(userId) || [];
  return sessionIds
    .map(sessionId => sessions.get(sessionId))
    .filter(session => session !== undefined)
    .map(session => ({
      sessionId: session.sessionId,
      createdAt: new Date(session.createdAt).toISOString(),
      lastActivityAt: new Date(session.lastActivityAt).toISOString(),
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      ipChanges: session.ipChanges.length,
      geoLocation: session.geoLocation,
    }));
}

/**
 * Get session duration (minutes)
 */
function getSessionDuration(sessionId) {
  const session = getSession(sessionId);
  if (!session) return null;
  return Math.floor((Date.now() - session.createdAt) / 60000);
}

/**
 * Check for suspicious IP changes (geo-jump)
 * Simple check: if IP changed, flag it
 */
function checkSuspiciousActivity(sessionId) {
  const session = getSession(sessionId);
  if (!session) return null;

  if (session.ipChanges.length > 0) {
    const lastChange = session.ipChanges[session.ipChanges.length - 1];
    return {
      suspicious: true,
      reason: 'ip_changed',
      lastChange,
      totalChanges: session.ipChanges.length,
    };
  }

  return { suspicious: false };
}

/**
 * Cleanup expired sessions (run periodically)
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [sessionId, session] of sessions.entries()) {
    // Check both absolute timeout and inactivity
    if (
      now - session.createdAt > ABSOLUTE_TIMEOUT_MS ||
      now - session.lastActivityAt > SLIDING_WINDOW_MS
    ) {
      invalidateSession(sessionId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`[session] Cleanup: ${cleanedCount} expired sessions removed`);
  }

  return cleanedCount;
}

/**
 * Initialize session store cleanup
 */
function initializeSessionCleanup(intervalMs = 60000) {
  console.log(`[session] Starting cleanup interval (${intervalMs}ms)`);
  setInterval(() => {
    cleanupExpiredSessions();
  }, intervalMs);
}

/**
 * Get all sessions (for monitoring)
 */
function getAllSessions() {
  return Array.from(sessions.values()).map(session => ({
    sessionId: session.sessionId,
    userId: session.userId,
    createdAt: new Date(session.createdAt).toISOString(),
    lastActivityAt: new Date(session.lastActivityAt).toISOString(),
    ipAddress: session.ipAddress,
    ipChanges: session.ipChanges.length,
  }));
}

export {
  createSession,
  getSession,
  validateSession,
  updateSessionActivity,
  invalidateSession,
  invalidateAllUserSessions,
  getUserSessions,
  getSessionDuration,
  checkSuspiciousActivity,
  cleanupExpiredSessions,
  initializeSessionCleanup,
  getAllSessions,
  MAX_CONCURRENT_SESSIONS,
  ABSOLUTE_TIMEOUT_MS,
  SLIDING_WINDOW_MS,
};

export default {
  createSession,
  getSession,
  validateSession,
  updateSessionActivity,
  invalidateSession,
  invalidateAllUserSessions,
  getUserSessions,
  getSessionDuration,
  checkSuspiciousActivity,
  cleanupExpiredSessions,
  initializeSessionCleanup,
  getAllSessions,
};
