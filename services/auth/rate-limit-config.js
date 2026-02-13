/**
 * Rate Limiting Configuration
 * 
 * Defines all rate limiting layers, model-specific limits, and bypass rules.
 */

export const RATE_LIMIT_CONFIG = {
  // Layer 1: IP-based rate limiting (sliding window)
  ipLayer: {
    enabled: true,
    maxRequests: 100,
    windowSeconds: 60,
    algorithm: 'sliding_window',
    keyPrefix: 'ratelimit:ip:',
  },

  // Layer 2: API key-based rate limiting (token bucket)
  apiKeyLayer: {
    enabled: true,
    maxRequests: 60,
    windowSeconds: 60,
    algorithm: 'token_bucket',
    keyPrefix: 'ratelimit:apikey:',
    // Token bucket specific settings
    refillRate: 1, // tokens per second
    bucketSize: 60, // max tokens
  },

  // Layer 3: Model-specific rate limiting
  modelLayer: {
    enabled: true,
    keyPrefix: 'ratelimit:model:',
    models: {
      haiku: {
        name: 'claude-haiku-4-5',
        maxRequests: 60,
        maxTokens: 60000,
        windowSeconds: 60,
      },
      sonnet: {
        name: 'claude-sonnet-4-5',
        maxRequests: 30,
        maxTokens: 50000,
        windowSeconds: 60,
      },
      opus: {
        name: 'claude-opus-4-5',
        maxRequests: 10,
        maxTokens: 20000,
        windowSeconds: 60,
      },
    },
  },

  // Progressive blocking for repeated violations
  progressiveBlocking: {
    enabled: true,
    keyPrefix: 'ratelimit:violations:',
    thresholds: [
      {
        violations: 1,
        windowSeconds: 60,
        action: 'warn',
        blockSeconds: 0,
      },
      {
        violations: 10,
        windowSeconds: 300, // 5 minutes
        action: 'block',
        blockSeconds: 300, // 5 minutes
      },
      {
        violations: 50,
        windowSeconds: 900, // 15 minutes
        action: 'block_and_alert',
        blockSeconds: 3600, // 1 hour
      },
    ],
  },

  // Bypass rules
  bypass: {
    // Paths that bypass all rate limiting
    paths: [
      '/health',
      '/metrics',
      '/status',
    ],
    // IP addresses that bypass rate limiting (internal monitoring)
    ips: [
      '127.0.0.1',
      '::1',
      '::ffff:127.0.0.1',
    ],
    // Headers that indicate internal requests
    headers: {
      'x-internal-request': 'true',
      'x-monitoring': 'true',
    },
    // Paths that NEVER bypass (even for internal IPs)
    neverBypass: [
      '/admin',
      '/api/admin',
    ],
  },

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    connectionTimeout: 5000,
    commandTimeout: 3000,
    maxRetries: 3,
    retryDelay: 100,
    // Fail open (allow requests) if Redis is unavailable
    failOpen: true,
  },

  // Logging configuration
  logging: {
    enabled: true,
    logLevel: process.env.LOG_LEVEL || 'info',
    includeHeaders: false, // Set to true for debugging
    maskApiKey: true, // Only show last 4 characters
  },
};

/**
 * Get model configuration by model name
 * @param {string} modelName - The model name to look up
 * @returns {object|null} Model configuration or null if not found
 */
export function getModelConfig(modelName) {
  if (!modelName) return null;
  
  const normalized = modelName.toLowerCase();
  
  for (const [key, config] of Object.entries(RATE_LIMIT_CONFIG.modelLayer.models)) {
    if (normalized.includes(key) || normalized.includes(config.name)) {
      return { ...config, key };
    }
  }
  
  return null;
}

/**
 * Check if a path should bypass rate limiting
 * @param {string} path - Request path
 * @param {string} ip - Client IP address
 * @param {object} headers - Request headers
 * @returns {boolean} True if should bypass
 */
export function shouldBypass(path, ip, headers = {}) {
  // Never bypass admin routes
  if (RATE_LIMIT_CONFIG.bypass.neverBypass.some(p => path.startsWith(p))) {
    return false;
  }

  // Check bypass paths
  if (RATE_LIMIT_CONFIG.bypass.paths.some(p => path === p || path.startsWith(p))) {
    return true;
  }

  // Check bypass IPs
  if (RATE_LIMIT_CONFIG.bypass.ips.includes(ip)) {
    return true;
  }

  // Check bypass headers
  for (const [header, value] of Object.entries(RATE_LIMIT_CONFIG.bypass.headers)) {
    if (headers[header] === value || headers[header.toLowerCase()] === value) {
      return true;
    }
  }

  return false;
}

/**
 * Get the current progressive blocking level for a client
 * @param {number} violationCount - Number of violations in the window
 * @returns {object|null} Threshold configuration or null
 */
export function getProgressiveThreshold(violationCount) {
  const thresholds = RATE_LIMIT_CONFIG.progressiveBlocking.thresholds;
  
  // Find the highest threshold that applies
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (violationCount >= thresholds[i].violations) {
      return thresholds[i];
    }
  }
  
  return null;
}

export default RATE_LIMIT_CONFIG;
