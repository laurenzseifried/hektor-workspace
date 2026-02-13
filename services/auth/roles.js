/**
 * Role-Based Access Control (RBAC)
 * 
 * Defines roles, permissions, model access, and rate limits.
 */

// Role definitions with permissions
export const ROLES = {
  owner: {
    name: 'owner',
    description: 'Full access to everything',
    permissions: ['*'],
    modelAccess: ['*'],
    rateLimit: { requests: 100, window: 60000, costCap: null },
    canManageRoles: true,
    canRotateKeys: true,
    canAccessAllModels: true,
  },
  admin: {
    name: 'admin',
    description: 'All models, config access, can rotate keys',
    permissions: ['models:*', 'config:read', 'config:write', 'keys:rotate', 'webhooks:*', 'users:read'],
    modelAccess: ['*'],
    rateLimit: { requests: 60, window: 60000, costCap: 50000 }, // $500/day in cents
    canManageRoles: false,
    canRotateKeys: true,
    canAccessAllModels: true,
  },
  developer: {
    name: 'developer',
    description: 'Sonnet + Haiku only, read-only admin, own keys only',
    permissions: ['models:sonnet', 'models:haiku', 'config:read', 'keys:own', 'webhooks:own'],
    modelAccess: ['anthropic/claude-sonnet-4-5', 'anthropic/claude-haiku-4-5'],
    rateLimit: { requests: 30, window: 60000, costCap: 10000 }, // $100/day in cents
    canManageRoles: false,
    canRotateKeys: false,
    canAccessAllModels: false,
  },
  api_consumer: {
    name: 'api_consumer',
    description: 'Only models assigned to their API key',
    permissions: ['models:assigned'],
    modelAccess: [], // Determined per API key
    rateLimit: { requests: 20, window: 60000, costCap: 5000 }, // $50/day in cents (configurable)
    canManageRoles: false,
    canRotateKeys: false,
    canAccessAllModels: false,
  },
  viewer: {
    name: 'viewer',
    description: 'Read-only dashboard, no model access',
    permissions: ['dashboard:read'],
    modelAccess: [],
    rateLimit: { requests: 10, window: 60000, costCap: 0 },
    canManageRoles: false,
    canRotateKeys: false,
    canAccessAllModels: false,
  },
};

// Model tier access mapping
export const MODEL_ACCESS_TIERS = {
  'anthropic/claude-opus-4-6': ['owner', 'admin'],
  'anthropic/claude-sonnet-4-5': ['owner', 'admin', 'developer'],
  'anthropic/claude-haiku-4-5': ['owner', 'admin', 'developer'],
  'ollama/llama3.2:3b': ['owner', 'admin'],
  'google/gemini-3-pro-preview': ['owner', 'admin'],
};

// Permission hierarchy (allows parent permissions to include child)
export const PERMISSION_HIERARCHY = {
  '*': ['models:*', 'config:*', 'users:*', 'webhooks:*', 'keys:*'],
  'models:*': ['models:sonnet', 'models:haiku', 'models:opus', 'models:gpt', 'models:gemini'],
  'config:*': ['config:read', 'config:write'],
  'keys:*': ['keys:rotate', 'keys:own'],
  'webhooks:*': ['webhooks:own', 'webhooks:all'],
  'users:*': ['users:read', 'users:write'],
};

/**
 * Check if a role has a specific permission
 * @param {string} role - Role name
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;

  // Check direct permissions
  if (roleConfig.permissions.includes(permission)) {
    return true;
  }

  // Check wildcard permissions
  if (roleConfig.permissions.includes('*')) {
    return true;
  }

  // Check hierarchy
  for (const perm of roleConfig.permissions) {
    if (PERMISSION_HIERARCHY[perm]?.includes(permission)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a role can access a specific model
 * @param {string} role - Role name
 * @param {string} model - Model identifier
 * @returns {boolean}
 */
export function canAccessModel(role, model) {
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;

  // Owner and admin can access all models
  if (roleConfig.canAccessAllModels) {
    return true;
  }

  // Check model access list
  return roleConfig.modelAccess.includes(model) || roleConfig.modelAccess.includes('*');
}

/**
 * Get rate limit for a role
 * @param {string} role - Role name
 * @returns {object} - {requests, window}
 */
export function getRateLimit(role) {
  const roleConfig = ROLES[role];
  if (!roleConfig) {
    return { requests: 5, window: 60000 }; // Default restrictive limit
  }
  return {
    requests: roleConfig.rateLimit.requests,
    window: roleConfig.rateLimit.window,
  };
}

/**
 * Get cost cap for a role
 * @param {string} role - Role name
 * @returns {number|null} - Cost cap in cents, or null for unlimited
 */
export function getCostCap(role) {
  const roleConfig = ROLES[role];
  if (!roleConfig) return 0;
  return roleConfig.rateLimit.costCap;
}

/**
 * Get all roles (for admin endpoints)
 */
export function getAllRoles() {
  return Object.values(ROLES).map(role => ({
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    modelAccess: role.modelAccess,
    rateLimit: role.rateLimit,
  }));
}

/**
 * Validate role exists
 * @param {string} role - Role name
 * @returns {boolean}
 */
export function isValidRole(role) {
  return role in ROLES;
}

export default {
  ROLES,
  MODEL_ACCESS_TIERS,
  PERMISSION_HIERARCHY,
  hasPermission,
  canAccessModel,
  getRateLimit,
  getCostCap,
  getAllRoles,
  isValidRole,
};
