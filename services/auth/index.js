/**
 * Authentication Module
 * 
 * Unified export of all auth components.
 * 
 * Usage:
 * ```javascript
 * import {
 *   jwtMiddleware,
 *   generateAccessToken,
 *   generateRefreshToken,
 *   generateTokenPair,
 *   handleLogin,
 *   handleRefresh,
 *   handleLogout,
 * } from './services/auth/index.js';
 * ```
 */

export {
  // JWT Middleware
  jwtMiddleware,
  hasPermission,
  hasRole,
  validateJWT,
  extractToken,
  failedAttempts,
} from './jwt-middleware.js';

export {
  // Token Generation
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  generateTokenId,
} from './token-generator.js';

export {
  // Token Store
  initialize as initializeTokenStore,
  invalidateToken,
  isTokenInvalidated,
  registerRefreshToken,
  getRefreshToken,
  revokeUserTokens,
  createSession,
  getUserSessions,
  endSession,
  getStats as getTokenStoreStats,
} from './token-store.js';

export {
  // Endpoints
  handleLogin,
  handleRefresh,
  handleLogout,
  authenticateUser,
  users as authUsers,
} from './endpoints.js';

console.log('[auth] Module loaded');
