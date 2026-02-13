#!/usr/bin/env node
/**
 * Hardened Health Check Endpoint
 * 
 * Returns minimal status information:
 * - status: "ok" or "degraded"
 * - timestamp: ISO timestamp
 * 
 * NO:
 * - Version numbers (information disclosure)
 * - Uptime (can be used for attack timing)
 * - System info (CPU, memory, etc.)
 * - Internal details (database status, etc.)
 * 
 * Usage:
 * ```javascript
 * import { handleHealthCheck } from './hardened-health-check.js';
 * 
 * if (req.url === '/health' && req.method === 'GET') {
 *   const result = handleHealthCheck(req);
 *   res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
 *   res.end(JSON.stringify(result.body));
 * }
 * ```
 */

/**
 * Health check status tracker
 * Can be used to set degraded state if internal services fail
 */
let globalHealthStatus = 'ok';
let lastHealthCheckTime = Date.now();

/**
 * Set global health status
 * 
 * @param {string} status - "ok" or "degraded"
 */
function setHealthStatus(status) {
  if (!['ok', 'degraded'].includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be 'ok' or 'degraded'`);
  }
  globalHealthStatus = status;
  console.log(`[health] Status changed to: ${status}`);
}

/**
 * Get current health status
 * 
 * @returns {string}
 */
function getHealthStatus() {
  return globalHealthStatus;
}

/**
 * Handle health check request
 * 
 * @param {http.IncomingMessage} req
 * @param {object} opts - { includeUptime, includeTimestamp }
 * @returns {object} - { statusCode, body }
 */
function handleHealthCheck(req, opts = {}) {
  const { includeUptime = false, includeTimestamp = true } = opts;

  const response = {
    status: globalHealthStatus,
  };

  // Add timestamp (ISO format, no version info)
  if (includeTimestamp) {
    response.timestamp = new Date().toISOString();
  }

  // Return 200 for ok, 503 for degraded
  const statusCode = globalHealthStatus === 'ok' ? 200 : 503;

  return {
    statusCode,
    body: response,
  };
}

/**
 * Handle liveness probe (Kubernetes-style)
 * Used to determine if pod should be restarted
 * Returns 200 if service is running, 500 if not
 * 
 * @returns {object} - { statusCode, body }
 */
function handleLiveness() {
  return {
    statusCode: 200,
    body: { status: 'alive' },
  };
}

/**
 * Handle readiness probe (Kubernetes-style)
 * Used to determine if pod should receive traffic
 * Returns 200 if ready to serve, 503 if not
 * 
 * @returns {object} - { statusCode, body }
 */
function handleReadiness() {
  const statusCode = globalHealthStatus === 'ok' ? 200 : 503;
  return {
    statusCode,
    body: { status: globalHealthStatus },
  };
}

/**
 * Middleware for health check endpoints
 * 
 * Usage:
 * ```javascript
 * if (req.url === '/health' && req.method === 'GET') {
 *   const health = healthCheckMiddleware(req, 'health');
 *   res.writeHead(health.statusCode, { 'Content-Type': 'application/json' });
 *   res.end(JSON.stringify(health.body));
 * }
 * ```
 */
function healthCheckMiddleware(req, endpoint = 'health') {
  switch (endpoint) {
    case 'health':
      return handleHealthCheck(req);
    case 'liveness':
      return handleLiveness();
    case 'readiness':
      return handleReadiness();
    default:
      return {
        statusCode: 404,
        body: { error: 'Unknown health endpoint' },
      };
  }
}

/**
 * Test if health check is properly hardened
 * Returns findings on information disclosure
 * 
 * @param {object} responseBody - Response from health endpoint
 * @returns {object} - { hardened: boolean, issues: array }
 */
function validateHealthCheckHardening(responseBody) {
  const issues = [];

  // Check for dangerous fields
  const dangerousFields = [
    'version',
    'uptime',
    'memory',
    'cpu',
    'database',
    'redis',
    'environment',
    'hostname',
    'pid',
    'dependencies',
    'config',
  ];

  for (const field of dangerousFields) {
    if (field in responseBody) {
      issues.push(`Dangerous field '${field}' exposed in health response`);
    }
  }

  // Check for required fields
  if (!('status' in responseBody)) {
    issues.push('Missing required field: status');
  }

  if (!('timestamp' in responseBody)) {
    issues.push('Missing recommended field: timestamp');
  }

  return {
    hardened: issues.length === 0,
    issues,
  };
}

export {
  handleHealthCheck,
  handleLiveness,
  handleReadiness,
  healthCheckMiddleware,
  setHealthStatus,
  getHealthStatus,
  validateHealthCheckHardening,
};
