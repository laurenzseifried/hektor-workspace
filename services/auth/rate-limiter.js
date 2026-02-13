/**
 * Multi-Layer Rate Limiting System
 * 
 * Implements three layers of rate limiting:
 * 1. IP-based (sliding window)
 * 2. API key-based (token bucket)
 * 3. Model-specific (request + token limits)
 * 
 * Includes progressive blocking and comprehensive logging.
 */

import { getRedisClient } from './redis-client.js';
import { 
  RATE_LIMIT_CONFIG, 
  shouldBypass, 
  getModelConfig,
  getProgressiveThreshold 
} from './rate-limit-config.js';

class RateLimiter {
  constructor() {
    this.redis = getRedisClient();
    this.config = RATE_LIMIT_CONFIG;
    this.logger = this._createLogger();
    this._initialized = false;
  }

  /**
   * Create logger
   */
  _createLogger() {
    const logLevel = this.config.logging.logLevel;
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = levels[logLevel] || 2;

    return {
      error: (...args) => currentLevel >= 0 && console.error('[RateLimiter ERROR]', ...args),
      warn: (...args) => currentLevel >= 1 && console.warn('[RateLimiter WARN]', ...args),
      info: (...args) => currentLevel >= 2 && console.info('[RateLimiter INFO]', ...args),
      debug: (...args) => currentLevel >= 3 && console.log('[RateLimiter DEBUG]', ...args),
    };
  }

  /**
   * Initialize the rate limiter
   */
  async initialize() {
    if (this._initialized) {
      return;
    }

    try {
      await this.redis.connect();
      this._initialized = true;
      this.logger.info('Rate limiter initialized');
    } catch (error) {
      this.logger.error('Failed to initialize rate limiter:', error.message);
      if (!this.config.redis.failOpen) {
        throw error;
      }
    }
  }

  /**
   * Check all rate limit layers for a request
   * @param {object} req - Request object
   * @returns {object} { allowed: boolean, reason?: string, retryAfter?: number, headers?: object }
   */
  async checkRateLimit(req) {
    await this.initialize();

    const ip = this._extractIP(req);
    const path = req.path || req.url || '/';
    const headers = req.headers || {};
    const apiKey = this._extractAPIKey(req);
    const model = this._extractModel(req);

    // Check bypass rules first
    if (shouldBypass(path, ip, headers)) {
      this.logger.debug(`Request bypassed rate limiting: ${path} from ${ip}`);
      return { allowed: true };
    }

    // Check progressive blocking first
    const blockCheck = await this._checkProgressiveBlocking(ip, apiKey);
    if (!blockCheck.allowed) {
      this._logRateLimit(ip, apiKey, path, 'BLOCKED', blockCheck.violationCount, 0);
      return blockCheck;
    }

    // Layer 1: IP-based rate limiting
    if (this.config.ipLayer.enabled) {
      const ipCheck = await this._checkIPRateLimit(ip);
      if (!ipCheck.allowed) {
        await this._recordViolation(ip, apiKey);
        this._logRateLimit(ip, apiKey, path, 'IP_LIMIT', ipCheck.count, ipCheck.limit);
        return ipCheck;
      }
    }

    // Layer 2: API key-based rate limiting
    if (this.config.apiKeyLayer.enabled && apiKey) {
      const apiKeyCheck = await this._checkAPIKeyRateLimit(apiKey);
      if (!apiKeyCheck.allowed) {
        await this._recordViolation(ip, apiKey);
        this._logRateLimit(ip, apiKey, path, 'API_KEY_LIMIT', apiKeyCheck.count, apiKeyCheck.limit);
        return apiKeyCheck;
      }
    }

    // Layer 3: Model-specific rate limiting
    if (this.config.modelLayer.enabled && model) {
      const modelConfig = getModelConfig(model);
      if (modelConfig) {
        const tokens = this._extractTokenCount(req);
        const modelCheck = await this._checkModelRateLimit(apiKey || ip, model, tokens, modelConfig);
        if (!modelCheck.allowed) {
          await this._recordViolation(ip, apiKey);
          this._logRateLimit(ip, apiKey, path, 'MODEL_LIMIT', modelCheck.count, modelCheck.limit);
          return modelCheck;
        }
      }
    }

    // All checks passed
    this.logger.debug(`Rate limit passed for ${ip} (${path})`);
    return {
      allowed: true,
      headers: this._buildRateLimitHeaders(ip, apiKey),
    };
  }

  /**
   * Layer 1: Check IP-based rate limit (sliding window)
   */
  async _checkIPRateLimit(ip) {
    const key = `${this.config.ipLayer.keyPrefix}${ip}`;
    const now = Date.now();
    const windowMs = this.config.ipLayer.windowSeconds * 1000;
    const maxRequests = this.config.ipLayer.maxRequests;

    try {
      // Sliding window implementation using sorted set
      const script = `
        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])
        local max_requests = tonumber(ARGV[3])
        local window_start = now - window
        
        -- Remove old entries
        redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)
        
        -- Count current requests
        local count = redis.call('ZCARD', key)
        
        if count < max_requests then
          -- Add current request
          redis.call('ZADD', key, now, now .. math.random())
          redis.call('EXPIRE', key, math.ceil(window / 1000))
          return {1, count + 1}
        else
          return {0, count}
        end
      `;

      const result = await this.redis.eval(script, [key], [now, windowMs, maxRequests]);
      
      if (!result) {
        // Redis unavailable and fail-open
        return { allowed: true };
      }

      const [allowed, count] = result;
      
      if (allowed === 0) {
        const retryAfter = Math.ceil(this.config.ipLayer.windowSeconds);
        return {
          allowed: false,
          reason: 'IP rate limit exceeded',
          retryAfter,
          count,
          limit: maxRequests,
        };
      }

      return { allowed: true, count, limit: maxRequests };

    } catch (error) {
      this.logger.error('IP rate limit check failed:', error.message);
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Layer 2: Check API key rate limit (token bucket)
   */
  async _checkAPIKeyRateLimit(apiKey) {
    const key = `${this.config.apiKeyLayer.keyPrefix}${apiKey}`;
    const now = Date.now();
    const maxRequests = this.config.apiKeyLayer.maxRequests;
    const windowSeconds = this.config.apiKeyLayer.windowSeconds;
    const refillRate = this.config.apiKeyLayer.refillRate;
    const bucketSize = this.config.apiKeyLayer.bucketSize;

    try {
      // Token bucket implementation
      const script = `
        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local max_tokens = tonumber(ARGV[2])
        local refill_rate = tonumber(ARGV[3])
        
        local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
        local tokens = tonumber(bucket[1]) or max_tokens
        local last_refill = tonumber(bucket[2]) or now
        
        -- Calculate tokens to add based on time elapsed
        local elapsed = (now - last_refill) / 1000
        local tokens_to_add = elapsed * refill_rate
        tokens = math.min(max_tokens, tokens + tokens_to_add)
        
        if tokens >= 1 then
          tokens = tokens - 1
          redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
          redis.call('EXPIRE', key, 120)
          return {1, math.floor(max_tokens - tokens)}
        else
          redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
          redis.call('EXPIRE', key, 120)
          return {0, max_tokens}
        end
      `;

      const result = await this.redis.eval(
        script,
        [key],
        [now, bucketSize, refillRate]
      );

      if (!result) {
        // Redis unavailable and fail-open
        return { allowed: true };
      }

      const [allowed, consumed] = result;

      if (allowed === 0) {
        const retryAfter = Math.ceil(1 / refillRate); // Time to get 1 token
        return {
          allowed: false,
          reason: 'API key rate limit exceeded',
          retryAfter,
          count: consumed,
          limit: maxRequests,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil((now + retryAfter * 1000) / 1000).toString(),
          },
        };
      }

      return {
        allowed: true,
        count: consumed,
        limit: maxRequests,
        headers: {
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': Math.max(0, maxRequests - consumed).toString(),
        },
      };

    } catch (error) {
      this.logger.error('API key rate limit check failed:', error.message);
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Layer 3: Check model-specific rate limits
   */
  async _checkModelRateLimit(identifier, model, tokens, modelConfig) {
    const requestKey = `${this.config.modelLayer.keyPrefix}${identifier}:${modelConfig.key}:requests`;
    const tokenKey = `${this.config.modelLayer.keyPrefix}${identifier}:${modelConfig.key}:tokens`;
    const windowSeconds = modelConfig.windowSeconds;

    try {
      // Check request count
      const requestCount = await this.redis.incr(requestKey, windowSeconds);
      
      if (requestCount === null) {
        // Redis unavailable
        return { allowed: true };
      }

      if (requestCount > modelConfig.maxRequests) {
        return {
          allowed: false,
          reason: `${modelConfig.key} model request limit exceeded`,
          retryAfter: windowSeconds,
          count: requestCount,
          limit: modelConfig.maxRequests,
        };
      }

      // Check token count if tokens provided
      if (tokens > 0) {
        const script = `
          local key = KEYS[1]
          local tokens_to_add = tonumber(ARGV[1])
          local max_tokens = tonumber(ARGV[2])
          local ttl = tonumber(ARGV[3])
          
          local current = tonumber(redis.call('GET', key) or 0)
          local new_total = current + tokens_to_add
          
          if new_total > max_tokens then
            return {0, new_total}
          else
            redis.call('SET', key, new_total, 'EX', ttl)
            return {1, new_total}
          end
        `;

        const result = await this.redis.eval(
          script,
          [tokenKey],
          [tokens, modelConfig.maxTokens, windowSeconds]
        );

        if (result) {
          const [allowed, totalTokens] = result;
          if (allowed === 0) {
            return {
              allowed: false,
              reason: `${modelConfig.key} model token limit exceeded`,
              retryAfter: windowSeconds,
              count: totalTokens,
              limit: modelConfig.maxTokens,
            };
          }
        }
      }

      return { allowed: true };

    } catch (error) {
      this.logger.error('Model rate limit check failed:', error.message);
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Check for progressive blocking based on violation history
   */
  async _checkProgressiveBlocking(ip, apiKey) {
    if (!this.config.progressiveBlocking.enabled) {
      return { allowed: true };
    }

    const identifier = apiKey || ip;
    const key = `${this.config.progressiveBlocking.keyPrefix}${identifier}`;

    try {
      // Get violation count
      const violations = await this.redis.get(key);
      const violationCount = violations ? parseInt(violations, 10) : 0;

      if (violationCount === 0) {
        return { allowed: true };
      }

      // Check if blocked
      const blockKey = `${key}:blocked`;
      const blockedUntil = await this.redis.get(blockKey);
      
      if (blockedUntil) {
        const blockedUntilTime = parseInt(blockedUntil, 10);
        if (Date.now() < blockedUntilTime) {
          const retryAfter = Math.ceil((blockedUntilTime - Date.now()) / 1000);
          return {
            allowed: false,
            reason: 'Temporarily blocked due to repeated violations',
            retryAfter,
            violationCount,
          };
        }
      }

      return { allowed: true, violationCount };

    } catch (error) {
      this.logger.error('Progressive blocking check failed:', error.message);
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Record a rate limit violation
   */
  async _recordViolation(ip, apiKey) {
    if (!this.config.progressiveBlocking.enabled) {
      return;
    }

    const identifier = apiKey || ip;
    const key = `${this.config.progressiveBlocking.keyPrefix}${identifier}`;

    try {
      // Increment violation count
      const violations = await this.redis.incr(key, 900); // 15 minute window
      
      if (!violations) {
        return; // Redis unavailable
      }

      // Check thresholds
      const threshold = getProgressiveThreshold(violations);
      
      if (threshold) {
        if (threshold.action === 'block' || threshold.action === 'block_and_alert') {
          // Set block
          const blockKey = `${key}:blocked`;
          const blockedUntil = Date.now() + (threshold.blockSeconds * 1000);
          await this.redis.set(blockKey, blockedUntil.toString(), threshold.blockSeconds);
          
          this.logger.warn(
            `Progressive block activated: ${violations} violations for ${identifier}, ` +
            `blocked for ${threshold.blockSeconds}s`
          );

          // Alert admin if needed
          if (threshold.action === 'block_and_alert') {
            this._alertAdmin(identifier, violations, threshold.blockSeconds);
          }
        }
      }

    } catch (error) {
      this.logger.error('Failed to record violation:', error.message);
    }
  }

  /**
   * Alert admin about severe rate limit violations
   */
  _alertAdmin(identifier, violations, blockSeconds) {
    // This would integrate with your alerting system
    this.logger.error(
      `ADMIN ALERT: Severe rate limit violations detected!\n` +
      `Identifier: ${identifier}\n` +
      `Violations: ${violations}\n` +
      `Block duration: ${blockSeconds}s`
    );
    
    // TODO: Integrate with actual alerting system (email, Slack, PagerDuty, etc.)
  }

  /**
   * Build rate limit headers for response
   */
  async _buildRateLimitHeaders(ip, apiKey) {
    const headers = {};

    try {
      if (apiKey && this.config.apiKeyLayer.enabled) {
        const key = `${this.config.apiKeyLayer.keyPrefix}${apiKey}`;
        const bucket = await this.redis.eval(
          `return redis.call('HMGET', KEYS[1], 'tokens', 'last_refill')`,
          [key],
          []
        );

        if (bucket) {
          const tokens = parseFloat(bucket[0]) || this.config.apiKeyLayer.bucketSize;
          const remaining = Math.floor(tokens);
          headers['X-RateLimit-Limit'] = this.config.apiKeyLayer.maxRequests.toString();
          headers['X-RateLimit-Remaining'] = Math.max(0, remaining).toString();
        }
      }
    } catch (error) {
      this.logger.debug('Failed to build rate limit headers:', error.message);
    }

    return headers;
  }

  /**
   * Extract client IP from request
   */
  _extractIP(req) {
    // Check common headers for proxy/load balancer scenarios
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }

    const xRealIp = req.headers['x-real-ip'];
    if (xRealIp) {
      return xRealIp;
    }

    return req.ip || req.connection?.remoteAddress || 'unknown';
  }

  /**
   * Extract API key from request
   */
  _extractAPIKey(req) {
    // Check Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check X-API-Key header
    const apiKeyHeader = req.headers['x-api-key'];
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    // Check query parameter (less secure, but supported)
    if (req.query && req.query.api_key) {
      return req.query.api_key;
    }

    return null;
  }

  /**
   * Extract model from request body
   */
  _extractModel(req) {
    if (req.body && req.body.model) {
      return req.body.model;
    }
    return null;
  }

  /**
   * Extract token count from request
   */
  _extractTokenCount(req) {
    // This would be populated by your token counting middleware
    if (req.body && req.body.tokens) {
      return req.body.tokens;
    }
    
    // Rough estimation based on prompt length if not provided
    if (req.body && req.body.prompt) {
      return Math.ceil(req.body.prompt.length / 4); // ~4 chars per token
    }

    return 0;
  }

  /**
   * Log rate limit event
   */
  _logRateLimit(ip, apiKey, endpoint, reason, count, limit) {
    const maskedApiKey = apiKey 
      ? `...${apiKey.slice(-4)}` 
      : 'none';

    this.logger.info(
      `Rate limit ${reason}: IP=${ip}, ` +
      `ApiKey=${maskedApiKey}, ` +
      `Endpoint=${endpoint}, ` +
      `Count=${count}, ` +
      `Limit=${limit}, ` +
      `Timestamp=${new Date().toISOString()}`
    );
  }

  /**
   * Express/Connect middleware
   */
  middleware() {
    return async (req, res, next) => {
      try {
        const result = await this.checkRateLimit(req);

        // Add rate limit headers if provided
        if (result.headers) {
          Object.entries(result.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
          });
        }

        if (!result.allowed) {
          // Set Retry-After header
          if (result.retryAfter) {
            res.setHeader('Retry-After', result.retryAfter.toString());
          }

          // Return 429 Too Many Requests
          return res.status(429).json({
            error: 'Rate limit exceeded',
            message: result.reason || 'Too many requests',
            retryAfter: result.retryAfter,
          });
        }

        next();
      } catch (error) {
        this.logger.error('Rate limiter middleware error:', error.message);
        // Fail open - allow request to proceed
        next();
      }
    };
  }

  /**
   * Get rate limiter status
   */
  async getStatus() {
    return {
      initialized: this._initialized,
      redis: this.redis.getStatus(),
      config: {
        ipLayer: this.config.ipLayer.enabled,
        apiKeyLayer: this.config.apiKeyLayer.enabled,
        modelLayer: this.config.modelLayer.enabled,
        progressiveBlocking: this.config.progressiveBlocking.enabled,
      },
    };
  }

  /**
   * Reset rate limits for an identifier (for testing/admin)
   */
  async resetLimits(identifier) {
    const patterns = [
      `${this.config.ipLayer.keyPrefix}${identifier}`,
      `${this.config.apiKeyLayer.keyPrefix}${identifier}`,
      `${this.config.modelLayer.keyPrefix}${identifier}:*`,
      `${this.config.progressiveBlocking.keyPrefix}${identifier}*`,
    ];

    for (const pattern of patterns) {
      try {
        await this.redis.del(pattern);
      } catch (error) {
        this.logger.error(`Failed to reset limits for ${pattern}:`, error.message);
      }
    }
  }
}

// Singleton instance
let rateLimiterInstance = null;

/**
 * Get the rate limiter singleton
 */
export function getRateLimiter() {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter();
  }
  return rateLimiterInstance;
}

/**
 * Create rate limiter middleware
 */
export function rateLimitMiddleware() {
  const limiter = getRateLimiter();
  return limiter.middleware();
}

/**
 * Reset singleton (for testing)
 */
export function resetRateLimiter() {
  rateLimiterInstance = null;
}

export default RateLimiter;
