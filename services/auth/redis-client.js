/**
 * Redis Client Wrapper with Graceful Failover
 * 
 * Provides a Redis client with automatic reconnection, failover handling,
 * and graceful degradation when Redis is unavailable.
 */

import { createClient } from 'redis';
import { RATE_LIMIT_CONFIG } from './rate-limit-config.js';

class RedisClientWrapper {
  constructor(config) {
    // Use provided config or fall back to RATE_LIMIT_CONFIG.redis
    this.config = config || RATE_LIMIT_CONFIG?.redis || {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      connectionTimeout: 5000,
      commandTimeout: 3000,
      maxRetries: 3,
      retryDelay: 100,
      failOpen: true,
    };
    
    this.client = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.connectionAttempts = 0;
    this.lastConnectionAttempt = 0;
    this.failOpen = this.config.failOpen !== false;
    this.logger = this._createLogger();
  }

  /**
   * Create a simple logger
   */
  _createLogger() {
    const logLevel = RATE_LIMIT_CONFIG.logging.logLevel;
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = levels[logLevel] || 2;

    return {
      error: (...args) => currentLevel >= 0 && console.error('[RedisClient ERROR]', ...args),
      warn: (...args) => currentLevel >= 1 && console.warn('[RedisClient WARN]', ...args),
      info: (...args) => currentLevel >= 2 && console.info('[RedisClient INFO]', ...args),
      debug: (...args) => currentLevel >= 3 && console.log('[RedisClient DEBUG]', ...args),
    };
  }

  /**
   * Initialize and connect to Redis
   */
  async connect() {
    if (this.isConnected) {
      return true;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      return this._waitForConnection();
    }

    this.isConnecting = true;
    this.connectionAttempts++;
    this.lastConnectionAttempt = Date.now();

    try {
      // Create Redis client
      const clientConfig = {
        socket: {
          host: this.config.host,
          port: this.config.port,
          connectTimeout: this.config.connectionTimeout,
          reconnectStrategy: (retries) => {
            if (retries > this.config.maxRetries) {
              this.logger.error(`Max retries (${this.config.maxRetries}) exceeded`);
              return false; // Stop reconnecting
            }
            return Math.min(retries * this.config.retryDelay, 3000);
          },
        },
        database: this.config.db,
      };

      if (this.config.password) {
        clientConfig.password = this.config.password;
      }

      this.client = createClient(clientConfig);

      // Set up event handlers
      this.client.on('error', (err) => {
        this.logger.error('Redis error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        this.logger.info('Redis connecting...');
      });

      this.client.on('ready', () => {
        this.logger.info('Redis connected and ready');
        this.isConnected = true;
        this.connectionAttempts = 0;
      });

      this.client.on('reconnecting', () => {
        this.logger.info('Redis reconnecting...');
        this.isConnected = false;
      });

      this.client.on('end', () => {
        this.logger.warn('Redis connection closed');
        this.isConnected = false;
      });

      // Connect
      await this.client.connect();
      this.isConnecting = false;
      return true;

    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error.message);
      this.isConnecting = false;
      this.isConnected = false;

      if (this.failOpen) {
        this.logger.warn('Fail-open enabled: Continuing without Redis');
        return false;
      } else {
        throw error;
      }
    }
  }

  /**
   * Wait for existing connection attempt to complete
   */
  async _waitForConnection(maxWait = 5000) {
    const start = Date.now();
    while (this.isConnecting && Date.now() - start < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.isConnected;
  }

  /**
   * Ensure client is connected before operation
   */
  async _ensureConnected() {
    if (!this.isConnected && !this.isConnecting) {
      // Throttle reconnection attempts (max 1 per 5 seconds)
      const timeSinceLastAttempt = Date.now() - this.lastConnectionAttempt;
      if (timeSinceLastAttempt > 5000) {
        await this.connect();
      }
    }
    return this.isConnected;
  }

  /**
   * Execute a Redis command with error handling
   */
  async _executeCommand(commandFn, fallbackValue = null) {
    try {
      await this._ensureConnected();
      
      if (!this.isConnected) {
        if (this.failOpen) {
          this.logger.debug('Redis unavailable, returning fallback value');
          return fallbackValue;
        }
        throw new Error('Redis not connected and fail-open disabled');
      }

      const result = await Promise.race([
        commandFn(this.client),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Command timeout')), this.config.commandTimeout)
        ),
      ]);

      return result;

    } catch (error) {
      this.logger.error('Redis command failed:', error.message);
      
      if (this.failOpen) {
        this.logger.debug('Fail-open: Returning fallback value');
        return fallbackValue;
      }
      throw error;
    }
  }

  /**
   * Get a value from Redis
   */
  async get(key) {
    return this._executeCommand(
      (client) => client.get(key),
      null
    );
  }

  /**
   * Set a value in Redis with optional TTL
   */
  async set(key, value, ttlSeconds = null) {
    return this._executeCommand(
      (client) => {
        if (ttlSeconds) {
          return client.setEx(key, ttlSeconds, value);
        }
        return client.set(key, value);
      },
      'OK'
    );
  }

  /**
   * Increment a counter with optional TTL
   */
  async incr(key, ttlSeconds = null) {
    return this._executeCommand(
      async (client) => {
        const value = await client.incr(key);
        if (ttlSeconds && value === 1) {
          // Set TTL only on first increment
          await client.expire(key, ttlSeconds);
        }
        return value;
      },
      null
    );
  }

  /**
   * Get multiple values at once
   */
  async mget(keys) {
    if (!keys || keys.length === 0) {
      return [];
    }
    return this._executeCommand(
      (client) => client.mGet(keys),
      new Array(keys.length).fill(null)
    );
  }

  /**
   * Get remaining TTL for a key
   */
  async ttl(key) {
    return this._executeCommand(
      (client) => client.ttl(key),
      -1
    );
  }

  /**
   * Delete a key
   */
  async del(key) {
    return this._executeCommand(
      (client) => client.del(key),
      0
    );
  }

  /**
   * Execute a Lua script (for atomic operations)
   */
  async eval(script, keys, args) {
    return this._executeCommand(
      (client) => client.eval(script, {
        keys,
        arguments: args,
      }),
      null
    );
  }

  /**
   * Check if Redis is available
   */
  isAvailable() {
    return this.isConnected;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      attempts: this.connectionAttempts,
      lastAttempt: this.lastConnectionAttempt,
      failOpen: this.failOpen,
      config: {
        host: this.config.host,
        port: this.config.port,
        db: this.config.db,
      },
    };
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (this.client) {
      try {
        await this.client.quit();
        this.logger.info('Redis disconnected cleanly');
      } catch (error) {
        this.logger.error('Error disconnecting from Redis:', error.message);
      }
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Health check
   */
  async ping() {
    return this._executeCommand(
      (client) => client.ping(),
      null
    );
  }
}

// Singleton instance
let redisInstance = null;

/**
 * Get the Redis client singleton
 */
export function getRedisClient(config = null) {
  if (!redisInstance) {
    redisInstance = new RedisClientWrapper(config);
  }
  return redisInstance;
}

/**
 * Reset the singleton (for testing)
 */
export function resetRedisClient() {
  if (redisInstance) {
    redisInstance.disconnect();
    redisInstance = null;
  }
}

export default RedisClientWrapper;
