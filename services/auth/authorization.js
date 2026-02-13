/**
 * Authorization Middleware
 * 
 * Enforces Role-Based Access Control (RBAC) after authentication.
 * Checks permissions, model access, and rate limits.
 */

import { hasPermission, canAccessModel, getRateLimit, getCostCap, ROLES } from './roles.js';

// In-memory storage for cost tracking per user (in production: use database)
const userCostTracking = new Map(); // userId -> { dailyTotal, lastReset, requests }

/**
 * Authorization middleware
 * 
 * Usage:
 *   const authResult = authorizationMiddleware(req.auth, {
 *     requiredPermission: 'models:sonnet',
 *     requiredModel: 'anthropic/claude-sonnet-4-5',
 *   });
 * 
 * @param {object} auth - Auth object from JWT middleware (contains userId, role)
 * @param {object} options - Authorization options
 * @param {string} options.requiredPermission - Permission to check
 * @param {string} options.requiredModel - Model to check access for
 * @param {string} options.action - Action description (for logging)
 * 
 * @returns {object} - {authorized: boolean, statusCode: number, message: string}
 */
export function authorizationMiddleware(auth, options = {}) {
  if (!auth || auth.error) {
    return {
      authorized: false,
      statusCode: 401,
      message: 'Authentication required',
    };
  }

  const { requiredPermission, requiredModel, action = 'unknown_action' } = options;
  const { userId, role } = auth;

  // Validate role exists
  if (!ROLES[role]) {
    logAuthorizationFailure(userId, role, action, 'invalid_role');
    return {
      authorized: false,
      statusCode: 403,
      message: 'Invalid user role',
    };
  }

  // Check permission if specified
  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    logAuthorizationFailure(userId, role, `${action}:${requiredPermission}`, 'permission_denied');
    return {
      authorized: false,
      statusCode: 403,
      message: `Your role (${role}) does not have permission for this action`,
    };
  }

  // Check model access if specified
  if (requiredModel && !canAccessModel(role, requiredModel)) {
    logAuthorizationFailure(userId, role, `${action}:model:${requiredModel}`, 'model_access_denied');
    return {
      authorized: false,
      statusCode: 403,
      message: `Your role does not have access to this model (${requiredModel})`,
    };
  }

  return {
    authorized: true,
    statusCode: 200,
    message: 'Authorized',
  };
}

/**
 * Rate limit middleware per role
 * 
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {object} - {allowed: boolean, remaining: number, resetIn: number}
 */
export function checkRateLimit(userId, role) {
  const limit = getRateLimit(role);
  const now = Date.now();

  // Get or initialize user tracking
  if (!userCostTracking.has(userId)) {
    userCostTracking.set(userId, {
      requests: [],
      dailyTotal: 0,
      lastReset: now,
    });
  }

  const tracking = userCostTracking.get(userId);

  // Reset daily counter if needed (24 hours)
  if (now - tracking.lastReset > 86400000) {
    tracking.dailyTotal = 0;
    tracking.lastReset = now;
    tracking.requests = [];
  }

  // Clean up old requests (outside the window)
  tracking.requests = tracking.requests.filter(time => now - time < limit.window);

  // Check if within limit
  if (tracking.requests.length >= limit.requests) {
    const oldestRequest = tracking.requests[0];
    const resetIn = limit.window - (now - oldestRequest);
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil(resetIn / 1000), // seconds
    };
  }

  // Add current request
  tracking.requests.push(now);
  const remaining = limit.requests - tracking.requests.length;

  return {
    allowed: true,
    remaining,
    resetIn: 0,
  };
}

/**
 * Cost cap middleware (tracks API call costs)
 * 
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {number} estimatedCost - Estimated cost in cents
 * @returns {object} - {allowed: boolean, dailyUsed: number, dailyLimit: number}
 */
export function checkCostCap(userId, role, estimatedCost) {
  const costCap = getCostCap(role);

  if (costCap === null) {
    // No cost cap for this role
    return {
      allowed: true,
      dailyUsed: 0,
      dailyLimit: null,
    };
  }

  const tracking = userCostTracking.get(userId) || {};
  const dailyUsed = tracking.dailyTotal || 0;

  if (dailyUsed + estimatedCost > costCap) {
    return {
      allowed: false,
      dailyUsed,
      dailyLimit: costCap,
    };
  }

  // Update tracking
  if (userCostTracking.has(userId)) {
    userCostTracking.get(userId).dailyTotal = dailyUsed + estimatedCost;
  }

  return {
    allowed: true,
    dailyUsed: dailyUsed + estimatedCost,
    dailyLimit: costCap,
  };
}

/**
 * Log authorization failure
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {string} action - Action attempted
 * @param {string} reason - Failure reason
 */
function logAuthorizationFailure(userId, role, action, reason) {
  const timestamp = new Date().toISOString();
  console.warn(`[auth] Authorization denied: userId=${userId}, role=${role}, action=${action}, reason=${reason}, time=${timestamp}`);
}

/**
 * Get user cost tracking (for admin endpoints)
 */
export function getUserCostTracking(userId) {
  const tracking = userCostTracking.get(userId);
  if (!tracking) {
    return { dailyTotal: 0, requestsToday: 0, lastReset: new Date().toISOString() };
  }

  return {
    dailyTotal: tracking.dailyTotal,
    requestsToday: tracking.requests.length,
    dailyReset: new Date(tracking.lastReset).toISOString(),
  };
}

/**
 * Reset user's daily cost (admin function)
 */
export function resetUserDailyCost(userId) {
  if (userCostTracking.has(userId)) {
    const tracking = userCostTracking.get(userId);
    tracking.dailyTotal = 0;
    tracking.lastReset = Date.now();
    tracking.requests = [];
  }
}

export default {
  authorizationMiddleware,
  checkRateLimit,
  checkCostCap,
  getUserCostTracking,
  resetUserDailyCost,
};
