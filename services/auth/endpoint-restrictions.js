#!/usr/bin/env node
/**
 * Endpoint Restrictions
 * 
 * Blocks or restricts dangerous endpoints:
 * - /docs, /swagger, /api-docs (API documentation)
 * - /debug/*, /test/* (debug endpoints)
 * - Endpoints that expose system information
 * - Unauthenticated admin endpoints
 * 
 * Usage:
 * ```javascript
 * import { isRestrictedEndpoint, shouldBlockEndpoint } from './endpoint-restrictions.js';
 * 
 * if (shouldBlockEndpoint(req.url, req.method)) {
 *   res.writeHead(403, { 'Content-Type': 'application/json' });
 *   return res.end(JSON.stringify({ error: 'Endpoint not available' }));
 * }
 * ```
 */

/**
 * List of blocked endpoints (404 or 403 response)
 * These should never be accessible
 */
const BLOCKED_ENDPOINTS = [
  '/docs',
  '/swagger',
  '/api-docs',
  '/swagger.json',
  '/swagger.yaml',
  '/openapi.json',
  '/api-docs.json',
  '/graphql-playground',
  '/graphql-explorer',
  '/debug',
  '/metrics',
  '/healthz',
  '/.env',
  '/.git',
  '/.well-known',
  '/admin/config',
  '/admin/debug',
  '/admin/logs',
  '/status/detailed',
];

/**
 * List of debug paths that should be blocked in production
 */
const DEBUG_PATHS = [
  '/debug/',
  '/test/',
  '/dev/',
  '/tmp/',
  '/__',
];

/**
 * List of endpoints that expose sensitive system information
 * These require authentication
 */
const SENSITIVE_ENDPOINTS = [
  /^\/admin\//,
  /^\/api\/v1\/admin\//,
  /^\/users\//,
  /^\/logs\//,
  /^\/metrics\//,
];

/**
 * Check if endpoint is blocked
 * 
 * @param {string} path - Request path
 * @param {string} method - HTTP method (default: 'GET')
 * @returns {boolean}
 */
function isBlockedEndpoint(path, method = 'GET') {
  // Check exact matches
  if (BLOCKED_ENDPOINTS.includes(path)) {
    return true;
  }

  // Check path prefixes (debug/test endpoints)
  for (const prefix of DEBUG_PATHS) {
    if (path.startsWith(prefix)) {
      return true;
    }
  }

  // Common security scan endpoints
  const securityScanEndpoints = [
    '/shell',
    '/admin.php',
    '/wp-admin',
    '/administrator',
    '/.git/config',
    '/.htaccess',
    '/web.config',
  ];

  if (securityScanEndpoints.includes(path)) {
    return true;
  }

  return false;
}

/**
 * Check if endpoint is sensitive (requires auth)
 * 
 * @param {string} path
 * @returns {boolean}
 */
function isSensitiveEndpoint(path) {
  for (const pattern of SENSITIVE_ENDPOINTS) {
    if (pattern.test(path)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if endpoint should be blocked or restricted
 * 
 * @param {string} path
 * @param {string} method
 * @param {object} opts - { requireAuth, environment }
 * @returns {object} - { shouldBlock, reason, statusCode }
 */
function shouldBlockEndpoint(path, method = 'GET', opts = {}) {
  const { requireAuth = null, environment = process.env.NODE_ENV || 'development' } = opts;

  // Block if in blocked list
  if (isBlockedEndpoint(path, method)) {
    return {
      shouldBlock: true,
      reason: 'Endpoint blocked for security reasons',
      statusCode: 403,
    };
  }

  // Block debug endpoints in production
  if (environment === 'production') {
    for (const prefix of DEBUG_PATHS) {
      if (path.startsWith(prefix)) {
        return {
          shouldBlock: true,
          reason: 'Debug endpoints disabled in production',
          statusCode: 404,
        };
      }
    }
  }

  // Sensitive endpoints require authentication
  if (isSensitiveEndpoint(path)) {
    if (requireAuth === false) {
      return {
        shouldBlock: true,
        reason: 'Authentication required for this endpoint',
        statusCode: 401,
      };
    }
  }

  return {
    shouldBlock: false,
    reason: 'Endpoint allowed',
    statusCode: 200,
  };
}

/**
 * Endpoint restriction middleware
 * 
 * Usage:
 * ```javascript
 * function handleRequest(req, res) {
 *   const restriction = endpointRestrictionMiddleware(req, res, {
 *     requireAuth: req.auth !== undefined
 *   });
 *   
 *   if (restriction.blocked) {
 *     res.writeHead(restriction.statusCode, { 'Content-Type': 'application/json' });
 *     return res.end(JSON.stringify({ error: restriction.reason }));
 *   }
 * }
 * ```
 */
function endpointRestrictionMiddleware(req, res, opts = {}) {
  const { requireAuth = null, environment = process.env.NODE_ENV || 'development' } = opts;

  const check = shouldBlockEndpoint(req.url, req.method, {
    requireAuth,
    environment,
  });

  return {
    blocked: check.shouldBlock,
    reason: check.reason,
    statusCode: check.statusCode,
  };
}

/**
 * Get list of restricted endpoints (for documentation)
 * 
 * @returns {object} - { blocked, debug, sensitive }
 */
function getRestrictedEndpoints() {
  return {
    blocked: BLOCKED_ENDPOINTS,
    debug: DEBUG_PATHS,
    sensitive: SENSITIVE_ENDPOINTS.map(p => p.source || p.toString()),
  };
}

export {
  isBlockedEndpoint,
  isSensitiveEndpoint,
  shouldBlockEndpoint,
  endpointRestrictionMiddleware,
  getRestrictedEndpoints,
  BLOCKED_ENDPOINTS,
  DEBUG_PATHS,
  SENSITIVE_ENDPOINTS,
};
