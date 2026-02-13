/**
 * Admin Endpoints for Role Management
 * 
 * All endpoints require OWNER role.
 * - POST /admin/users/:id/role — Update user role
 * - GET /admin/users — List all users and roles
 * - POST /admin/roles/:role/reset-costs — Reset user daily costs
 * - GET /admin/audit-log — View authorization failures
 */

import { isValidRole, getAllRoles } from './roles.js';
import { authorizationMiddleware, getUserCostTracking, resetUserDailyCost } from './authorization.js';

// In-memory user store (in production: use database)
const users = {
  'admin-001': { id: 'admin-001', username: 'admin', role: 'owner', createdAt: new Date().toISOString() },
  'user-001': { id: 'user-001', username: 'developer1', role: 'developer', createdAt: new Date().toISOString() },
  'user-002': { id: 'user-002', username: 'viewer1', role: 'viewer', createdAt: new Date().toISOString() },
};

// Authorization failure audit log
const auditLog = [];

/**
 * Handle GET /admin/users
 * List all users and their current roles
 */
export function handleListUsers(req) {
  const result = authorizationMiddleware(req.auth, {
    requiredPermission: 'users:read',
    action: 'admin:list_users',
  });

  if (!result.authorized) {
    return {
      statusCode: result.statusCode,
      body: { error: result.message },
    };
  }

  // Only owner can manage roles
  if (req.auth.role !== 'owner') {
    return {
      statusCode: 403,
      body: { error: 'Only owner role can access user management' },
    };
  }

  const usersList = Object.values(users).map(user => ({
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    costTracking: getUserCostTracking(user.id),
  }));

  return {
    statusCode: 200,
    body: {
      users: usersList,
      total: usersList.length,
    },
  };
}

/**
 * Handle POST /admin/users/:id/role
 * Update user role (owner only)
 */
export function handleUpdateUserRole(req, userId, body) {
  // Check ownership
  if (req.auth.role !== 'owner') {
    logAuditFailure(req.auth.userId, req.auth.role, `admin:update_role:${userId}`, 'not_owner');
    return {
      statusCode: 403,
      body: { error: 'Only owner role can manage user roles' },
    };
  }

  const { role } = body;

  if (!role || !isValidRole(role)) {
    return {
      statusCode: 422,
      body: { error: 'Invalid role specified' },
    };
  }

  if (!users[userId]) {
    return {
      statusCode: 404,
      body: { error: 'User not found' },
    };
  }

  // Update role
  const oldRole = users[userId].role;
  users[userId].role = role;
  users[userId].updatedAt = new Date().toISOString();

  console.log(`[admin] Role updated: userId=${userId}, oldRole=${oldRole}, newRole=${role}`);

  return {
    statusCode: 200,
    body: {
      ok: true,
      user: users[userId],
      message: `User role changed from ${oldRole} to ${role}`,
    },
  };
}

/**
 * Handle POST /admin/users/:id/reset-costs
 * Reset user's daily cost tracking
 */
export function handleResetUserCosts(req, userId) {
  // Check ownership
  if (req.auth.role !== 'owner') {
    logAuditFailure(req.auth.userId, req.auth.role, `admin:reset_costs:${userId}`, 'not_owner');
    return {
      statusCode: 403,
      body: { error: 'Only owner role can reset user costs' },
    };
  }

  if (!users[userId]) {
    return {
      statusCode: 404,
      body: { error: 'User not found' },
    };
  }

  resetUserDailyCost(userId);

  console.log(`[admin] Daily costs reset: userId=${userId}`);

  return {
    statusCode: 200,
    body: {
      ok: true,
      message: `Daily cost tracking reset for user ${userId}`,
    },
  };
}

/**
 * Handle GET /admin/roles
 * List all available roles
 */
export function handleListRoles(req) {
  // Any authenticated user can view roles (read-only)
  if (!req.auth || req.auth.error) {
    return {
      statusCode: 401,
      body: { error: 'Authentication required' },
    };
  }

  const roles = getAllRoles();

  return {
    statusCode: 200,
    body: {
      roles,
      total: roles.length,
    },
  };
}

/**
 * Handle GET /admin/audit-log
 * View recent authorization failures (owner only)
 */
export function handleGetAuditLog(req, options = {}) {
  // Check ownership
  if (req.auth.role !== 'owner') {
    logAuditFailure(req.auth.userId, req.auth.role, 'admin:view_audit_log', 'not_owner');
    return {
      statusCode: 403,
      body: { error: 'Only owner role can view audit logs' },
    };
  }

  const { limit = 100, offset = 0 } = options;
  const logs = auditLog.slice(offset, offset + limit);

  return {
    statusCode: 200,
    body: {
      logs,
      total: auditLog.length,
      offset,
      limit,
    },
  };
}

/**
 * Get all users (for internal use)
 */
export function getAllUsers() {
  return users;
}

/**
 * Add user (for internal use)
 */
export function addUser(userId, username, role = 'viewer') {
  users[userId] = {
    id: userId,
    username,
    role,
    createdAt: new Date().toISOString(),
  };
  return users[userId];
}

/**
 * Log audit failure
 */
function logAuditFailure(userId, role, action, reason) {
  const entry = {
    timestamp: new Date().toISOString(),
    userId,
    role,
    action,
    reason,
  };
  auditLog.push(entry);

  // Keep only last 1000 entries
  if (auditLog.length > 1000) {
    auditLog.shift();
  }

  console.warn(`[audit] ${JSON.stringify(entry)}`);
}

export default {
  handleListUsers,
  handleUpdateUserRole,
  handleResetUserCosts,
  handleListRoles,
  handleGetAuditLog,
  getAllUsers,
  addUser,
};
