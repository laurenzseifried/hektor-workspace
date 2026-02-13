#!/usr/bin/env node
/**
 * Token Store
 * 
 * Manages token invalidation and rotation tracking.
 * Keeps track of:
 * - Invalidated tokens (blacklist)
 * - Refresh token rotations (one-time use enforcement)
 * - Active user sessions
 * 
 * In production, this should be backed by Redis or a database.
 * For now, using in-memory storage with optional persistence.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- In-Memory Storage ---
const tokenBlacklist = new Set(); // Invalidated tokens (jti)
const refreshTokens = new Map(); // Active refresh tokens (jti -> metadata)
const activeSessions = new Map(); // Active sessions (userId -> sessions)

// --- Configuration ---
const CLEANUP_INTERVAL = 3600000; // 1 hour
const PERSISTENCE_FILE = process.env.TOKEN_STORE_FILE 
  ? path.resolve(process.env.TOKEN_STORE_FILE)
  : path.join(__dirname, '.token-store.json');

/**
 * Initialize token store
 * Load persisted data if available
 */
function initialize() {
  console.log('[token-store] Initializing token store...');
  
  // Load persisted tokens
  if (fs.existsSync(PERSISTENCE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PERSISTENCE_FILE, 'utf8'));
      
      if (data.blacklist && Array.isArray(data.blacklist)) {
        data.blacklist.forEach(jti => tokenBlacklist.add(jti));
        console.log(`[token-store] Loaded ${data.blacklist.length} blacklisted tokens`);
      }
      
      if (data.refreshTokens && Array.isArray(data.refreshTokens)) {
        data.refreshTokens.forEach(entry => {
          refreshTokens.set(entry.jti, entry);
        });
        console.log(`[token-store] Loaded ${data.refreshTokens.length} refresh tokens`);
      }
    } catch (err) {
      console.warn(`[token-store] Failed to load persisted tokens: ${err.message}`);
    }
  }

  // Start cleanup interval
  setInterval(cleanup, CLEANUP_INTERVAL);
  console.log('[token-store] ✅ Initialized');
}

/**
 * Clean up expired entries
 */
function cleanup() {
  const now = Date.now() / 1000; // Current time in seconds
  let removed = 0;

  // Clean up expired refresh tokens
  for (const [jti, entry] of refreshTokens) {
    if (entry.expiresAt < now) {
      refreshTokens.delete(jti);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`[token-store] Cleanup: Removed ${removed} expired refresh tokens`);
  }

  persist();
}

/**
 * Persist token store to disk
 */
function persist() {
  try {
    const data = {
      timestamp: new Date().toISOString(),
      blacklist: Array.from(tokenBlacklist),
      refreshTokens: Array.from(refreshTokens.values()),
    };

    fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`[token-store] Failed to persist tokens: ${err.message}`);
  }
}

/**
 * Invalidate a token (add to blacklist)
 * @param {string} jti - Token ID
 * @param {string} reason - Reason for invalidation
 */
function invalidateToken(jti, reason = 'unknown') {
  tokenBlacklist.add(jti);
  console.log(`[token-store] Token invalidated: ${jti} (reason: ${reason})`);
  persist();
}

/**
 * Check if token is invalidated
 * @param {string} jti - Token ID
 * @returns {boolean}
 */
function isTokenInvalidated(jti) {
  return tokenBlacklist.has(jti);
}

/**
 * Register a new refresh token
 * @param {string} jti - Token ID
 * @param {string} userId - User ID
 * @param {number} expiresAt - Unix timestamp (seconds)
 * @param {number} rotationCount - Rotation count
 */
function registerRefreshToken(jti, userId, expiresAt, rotationCount = 0) {
  refreshTokens.set(jti, {
    jti,
    userId,
    expiresAt,
    rotationCount,
    createdAt: Math.floor(Date.now() / 1000),
  });

  console.log(`[token-store] Refresh token registered: ${jti} (user: ${userId})`);
  persist();
}

/**
 * Get refresh token metadata
 * @param {string} jti - Token ID
 * @returns {object|null}
 */
function getRefreshToken(jti) {
  return refreshTokens.get(jti) || null;
}

/**
 * Revoke all refresh tokens for a user (logout)
 * @param {string} userId - User ID
 */
function revokeUserTokens(userId) {
  let revoked = 0;

  for (const [jti, entry] of refreshTokens) {
    if (entry.userId === userId) {
      invalidateToken(jti, `user_revoke:${userId}`);
      refreshTokens.delete(jti);
      revoked++;
    }
  }

  console.log(`[token-store] Revoked ${revoked} tokens for user: ${userId}`);
  persist();
}

/**
 * Start a new session
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID (e.g., jti from access token)
 * @param {object} metadata - Additional metadata
 */
function createSession(userId, sessionId, metadata = {}) {
  if (!activeSessions.has(userId)) {
    activeSessions.set(userId, []);
  }

  const session = {
    sessionId,
    createdAt: new Date().toISOString(),
    ...metadata,
  };

  activeSessions.get(userId).push(session);
  console.log(`[token-store] Session created: ${sessionId} (user: ${userId})`);
}

/**
 * Get all active sessions for a user
 * @param {string} userId - User ID
 * @returns {array}
 */
function getUserSessions(userId) {
  return activeSessions.get(userId) || [];
}

/**
 * End a session
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 */
function endSession(userId, sessionId) {
  const sessions = activeSessions.get(userId);
  if (sessions) {
    const index = sessions.findIndex(s => s.sessionId === sessionId);
    if (index >= 0) {
      sessions.splice(index, 1);
      console.log(`[token-store] Session ended: ${sessionId} (user: ${userId})`);
    }
  }
}

/**
 * Get store statistics
 */
function getStats() {
  return {
    blacklistedTokens: tokenBlacklist.size,
    activeRefreshTokens: refreshTokens.size,
    activeSessions: activeSessions.size,
    persistenceFile: PERSISTENCE_FILE,
  };
}

/**
 * Export for use in other modules
 */
export {
  initialize,
  invalidateToken,
  isTokenInvalidated,
  registerRefreshToken,
  getRefreshToken,
  revokeUserTokens,
  createSession,
  getUserSessions,
  endSession,
  getStats,
  persist,
};

// Run if executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log('\n🗄️  Token Store\n');
  
  initialize();
  
  // Test operations
  console.log('\n--- Testing token operations ---\n');
  
  registerRefreshToken('token-001', 'user-123', Math.floor(Date.now() / 1000) + 604800);
  registerRefreshToken('token-002', 'user-123', Math.floor(Date.now() / 1000) + 604800);
  
  console.log('\nActive sessions:');
  createSession('user-123', 'session-1', { ip: '127.0.0.1', userAgent: 'Test' });
  createSession('user-123', 'session-2', { ip: '192.168.1.1', userAgent: 'Test' });
  
  const sessions = getUserSessions('user-123');
  console.log(`  User 123 has ${sessions.length} sessions`);
  
  console.log('\n--- Statistics ---');
  console.log(JSON.stringify(getStats(), null, 2));
}
