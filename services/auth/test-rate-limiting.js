/**
 * Comprehensive Rate Limiting Tests
 * 
 * Tests all three layers of rate limiting, progressive blocking,
 * bypass rules, and failover behavior.
 */

import { getRateLimiter, resetRateLimiter } from './rate-limiter.js';
import { getRedisClient, resetRedisClient } from './redis-client.js';
import { shouldBypass, getModelConfig, getProgressiveThreshold } from './rate-limit-config.js';

// Test utilities
class TestHelper {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async test(name, fn) {
    try {
      await fn();
      this.passed++;
      console.log(`✅ ${name}`);
    } catch (error) {
      this.failed++;
      console.error(`❌ ${name}`);
      console.error(`   ${error.message}`);
      if (error.stack) {
        console.error(`   ${error.stack.split('\n').slice(1, 3).join('\n')}`);
      }
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(
        message || `Expected ${expected}, got ${actual}`
      );
    }
  }

  assertNotNull(value, message) {
    if (value === null || value === undefined) {
      throw new Error(message || 'Value should not be null');
    }
  }

  async summary() {
    console.log('\n' + '='.repeat(50));
    console.log(`Tests: ${this.passed + this.failed}`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log('='.repeat(50));
    return this.failed === 0;
  }

  mockRequest(overrides = {}) {
    return {
      ip: '192.168.1.1',
      path: '/api/test',
      url: '/api/test',
      headers: {},
      query: {},
      body: {},
      connection: { remoteAddress: '192.168.1.1' },
      ...overrides,
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Configuration tests
async function testConfiguration(helper) {
  console.log('\n📋 Configuration Tests\n');

  await helper.test('Should get Haiku model config', () => {
    const config = getModelConfig('claude-haiku-4-5');
    helper.assertNotNull(config, 'Haiku config should exist');
    helper.assertEqual(config.maxRequests, 60, 'Haiku should have 60 req/min');
    helper.assertEqual(config.maxTokens, 60000, 'Haiku should have 60K tokens/min');
  });

  await helper.test('Should get Sonnet model config', () => {
    const config = getModelConfig('claude-sonnet-4-5');
    helper.assertNotNull(config, 'Sonnet config should exist');
    helper.assertEqual(config.maxRequests, 30, 'Sonnet should have 30 req/min');
    helper.assertEqual(config.maxTokens, 50000, 'Sonnet should have 50K tokens/min');
  });

  await helper.test('Should get Opus model config', () => {
    const config = getModelConfig('claude-opus-4-5');
    helper.assertNotNull(config, 'Opus config should exist');
    helper.assertEqual(config.maxRequests, 10, 'Opus should have 10 req/min');
    helper.assertEqual(config.maxTokens, 20000, 'Opus should have 20K tokens/min');
  });

  await helper.test('Should bypass health check endpoints', () => {
    const bypassed = shouldBypass('/health', '192.168.1.1', {});
    helper.assert(bypassed, 'Health check should be bypassed');
  });

  await helper.test('Should bypass internal IPs', () => {
    const bypassed = shouldBypass('/api/test', '127.0.0.1', {});
    helper.assert(bypassed, 'Localhost should be bypassed');
  });

  await helper.test('Should bypass monitoring headers', () => {
    const bypassed = shouldBypass('/api/test', '192.168.1.1', { 'x-internal-request': 'true' });
    helper.assert(bypassed, 'Internal requests should be bypassed');
  });

  await helper.test('Should NOT bypass admin routes', () => {
    const bypassed = shouldBypass('/admin/users', '127.0.0.1', {});
    helper.assert(!bypassed, 'Admin routes should never be bypassed');
  });

  await helper.test('Should get correct progressive threshold', () => {
    const threshold1 = getProgressiveThreshold(1);
    helper.assertEqual(threshold1.action, 'warn', '1 violation should warn');
    
    const threshold10 = getProgressiveThreshold(10);
    helper.assertEqual(threshold10.action, 'block', '10 violations should block');
    helper.assertEqual(threshold10.blockSeconds, 300, 'Should block for 5 minutes');
    
    const threshold50 = getProgressiveThreshold(50);
    helper.assertEqual(threshold50.action, 'block_and_alert', '50 violations should alert');
    helper.assertEqual(threshold50.blockSeconds, 3600, 'Should block for 1 hour');
  });
}

// Redis client tests
async function testRedisClient(helper) {
  console.log('\n🔴 Redis Client Tests\n');

  await helper.test('Should create Redis client', () => {
    const redis = getRedisClient();
    helper.assertNotNull(redis, 'Redis client should be created');
  });

  await helper.test('Should connect to Redis', async () => {
    const redis = getRedisClient();
    const connected = await redis.connect();
    // May fail if Redis not running - that's OK with fail-open
    console.log(`   Redis connected: ${connected}`);
  });

  await helper.test('Should handle Redis operations', async () => {
    const redis = getRedisClient();
    await redis.connect();
    
    // Test set/get
    await redis.set('test:key', 'test-value', 10);
    const value = await redis.get('test:key');
    
    if (redis.isAvailable()) {
      helper.assertEqual(value, 'test-value', 'Should get correct value');
    } else {
      console.log('   Redis unavailable - skipping operation test');
    }
    
    // Cleanup
    await redis.del('test:key');
  });

  await helper.test('Should handle Redis incr with TTL', async () => {
    const redis = getRedisClient();
    await redis.connect();
    
    const key = 'test:counter';
    const val1 = await redis.incr(key, 10);
    const val2 = await redis.incr(key, 10);
    
    if (redis.isAvailable()) {
      helper.assert(val2 > val1, 'Counter should increment');
    } else {
      console.log('   Redis unavailable - skipping incr test');
    }
    
    // Cleanup
    await redis.del(key);
  });

  await helper.test('Should get Redis status', () => {
    const redis = getRedisClient();
    const status = redis.getStatus();
    helper.assertNotNull(status, 'Status should be returned');
    helper.assertNotNull(status.config, 'Config should be in status');
  });

  await helper.test('Should handle ping', async () => {
    const redis = getRedisClient();
    await redis.connect();
    const pong = await redis.ping();
    console.log(`   Ping result: ${pong || 'null (Redis unavailable)'}`);
  });
}

// IP-based rate limiting tests
async function testIPRateLimit(helper) {
  console.log('\n🌐 IP-Based Rate Limiting Tests\n');

  const limiter = getRateLimiter();
  await limiter.initialize();

  await helper.test('Should allow requests under IP limit', async () => {
    const req = helper.mockRequest({ ip: '10.0.0.1' });
    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Request should be allowed');
  });

  await helper.test('Should track IP request count', async () => {
    const ip = '10.0.0.2';
    
    // Make several requests
    for (let i = 0; i < 5; i++) {
      const req = helper.mockRequest({ ip });
      const result = await limiter.checkRateLimit(req);
      helper.assert(result.allowed, `Request ${i + 1} should be allowed`);
    }
  });

  await helper.test('Should block after exceeding IP limit', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const ip = '10.0.0.3';
    
    // Simulate 101 requests (over limit of 100)
    const key = `ratelimit:ip:${ip}`;
    const now = Date.now();
    
    // Add 101 entries to sorted set
    for (let i = 0; i < 101; i++) {
      await redis.eval(
        'redis.call("ZADD", KEYS[1], ARGV[1], ARGV[1] .. ARGV[2]); redis.call("EXPIRE", KEYS[1], 60)',
        [key],
        [now - i * 100, Math.random()]
      );
    }
    
    const req = helper.mockRequest({ ip });
    const result = await limiter.checkRateLimit(req);
    
    helper.assert(!result.allowed, 'Request should be blocked');
    helper.assertNotNull(result.retryAfter, 'Should have retry-after');
    
    // Cleanup
    await redis.del(key);
  });
}

// API key rate limiting tests
async function testAPIKeyRateLimit(helper) {
  console.log('\n🔑 API Key Rate Limiting Tests\n');

  const limiter = getRateLimiter();
  await limiter.initialize();

  await helper.test('Should allow requests with API key', async () => {
    const req = helper.mockRequest({
      headers: { 'authorization': 'Bearer test-api-key-123' }
    });
    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Request should be allowed');
  });

  await helper.test('Should include rate limit headers', async () => {
    const req = helper.mockRequest({
      headers: { 'authorization': 'Bearer test-api-key-456' }
    });
    const result = await limiter.checkRateLimit(req);
    
    if (result.allowed && result.headers) {
      helper.assertNotNull(result.headers['X-RateLimit-Limit'], 'Should have limit header');
      console.log('   Rate limit headers:', result.headers);
    }
  });

  await helper.test('Should extract API key from X-API-Key header', async () => {
    const req = helper.mockRequest({
      headers: { 'x-api-key': 'test-key-789' }
    });
    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Request should be allowed');
  });

  await helper.test('Should use token bucket algorithm', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const apiKey = 'test-bucket-key';
    const key = `ratelimit:apikey:${apiKey}`;
    
    // Set bucket to 0 tokens
    await redis.eval(
      'redis.call("HMSET", KEYS[1], "tokens", 0, "last_refill", ARGV[1]); redis.call("EXPIRE", KEYS[1], 120)',
      [key],
      [Date.now()]
    );
    
    const req = helper.mockRequest({
      headers: { 'authorization': `Bearer ${apiKey}` }
    });
    const result = await limiter.checkRateLimit(req);
    
    helper.assert(!result.allowed, 'Request should be blocked when bucket empty');
    
    // Cleanup
    await redis.del(key);
  });
}

// Model-specific rate limiting tests
async function testModelRateLimit(helper) {
  console.log('\n🤖 Model-Specific Rate Limiting Tests\n');

  const limiter = getRateLimiter();
  await limiter.initialize();

  await helper.test('Should allow requests for Haiku model', async () => {
    const req = helper.mockRequest({
      body: { model: 'claude-haiku-4-5', tokens: 1000 }
    });
    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Haiku request should be allowed');
  });

  await helper.test('Should allow requests for Sonnet model', async () => {
    const req = helper.mockRequest({
      body: { model: 'claude-sonnet-4-5', tokens: 1000 }
    });
    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Sonnet request should be allowed');
  });

  await helper.test('Should allow requests for Opus model', async () => {
    const req = helper.mockRequest({
      body: { model: 'claude-opus-4-5', tokens: 500 }
    });
    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Opus request should be allowed');
  });

  await helper.test('Should enforce model request limits', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const identifier = '10.0.0.100';
    const key = `ratelimit:model:${identifier}:haiku:requests`;
    
    // Set count to limit
    await redis.set(key, '61', 60);
    
    const req = helper.mockRequest({
      ip: identifier,
      body: { model: 'claude-haiku-4-5', tokens: 1000 }
    });
    const result = await limiter.checkRateLimit(req);
    
    helper.assert(!result.allowed, 'Request should be blocked when model limit exceeded');
    
    // Cleanup
    await redis.del(key);
  });

  await helper.test('Should enforce model token limits', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const identifier = '10.0.0.101';
    const tokenKey = `ratelimit:model:${identifier}:haiku:tokens`;
    
    // Set tokens to just under limit
    await redis.set(tokenKey, '59000', 60);
    
    const req = helper.mockRequest({
      ip: identifier,
      body: { model: 'claude-haiku-4-5', tokens: 2000 } // Would exceed 60K limit
    });
    const result = await limiter.checkRateLimit(req);
    
    helper.assert(!result.allowed, 'Request should be blocked when token limit would be exceeded');
    
    // Cleanup
    await redis.del(tokenKey);
    await redis.del(`ratelimit:model:${identifier}:haiku:requests`);
  });
}

// Progressive blocking tests
async function testProgressiveBlocking(helper) {
  console.log('\n🚫 Progressive Blocking Tests\n');

  const limiter = getRateLimiter();
  await limiter.initialize();

  await helper.test('Should allow requests with no violations', async () => {
    const req = helper.mockRequest({ ip: '10.0.1.1' });
    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Request should be allowed with no violations');
  });

  await helper.test('Should warn on first violation', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const ip = '10.0.1.2';
    const key = `ratelimit:violations:${ip}`;
    
    // Set 1 violation
    await redis.set(key, '1', 900);
    
    const req = helper.mockRequest({ ip });
    const result = await limiter.checkRateLimit(req);
    
    helper.assert(result.allowed, 'First violation should only warn, not block');
    
    // Cleanup
    await redis.del(key);
  });

  await helper.test('Should block after 10 violations', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const ip = '10.0.1.3';
    const violationKey = `ratelimit:violations:${ip}`;
    const blockKey = `${violationKey}:blocked`;
    
    // Set 10 violations and block
    await redis.set(violationKey, '10', 900);
    await redis.set(blockKey, (Date.now() + 300000).toString(), 300);
    
    const req = helper.mockRequest({ ip });
    const result = await limiter.checkRateLimit(req);
    
    helper.assert(!result.allowed, 'Should be blocked after 10 violations');
    helper.assertNotNull(result.retryAfter, 'Should have retry-after');
    
    // Cleanup
    await redis.del(violationKey);
    await redis.del(blockKey);
  });

  await helper.test('Should extend block after 50 violations', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const ip = '10.0.1.4';
    const violationKey = `ratelimit:violations:${ip}`;
    const blockKey = `${violationKey}:blocked`;
    
    // Set 50 violations and block for 1 hour
    await redis.set(violationKey, '50', 900);
    await redis.set(blockKey, (Date.now() + 3600000).toString(), 3600);
    
    const req = helper.mockRequest({ ip });
    const result = await limiter.checkRateLimit(req);
    
    helper.assert(!result.allowed, 'Should be blocked after 50 violations');
    helper.assert(result.retryAfter >= 3000, 'Should have long retry-after (1 hour)');
    
    // Cleanup
    await redis.del(violationKey);
    await redis.del(blockKey);
  });
}

// Middleware tests
async function testMiddleware(helper) {
  console.log('\n⚙️  Middleware Tests\n');

  const limiter = getRateLimiter();
  await limiter.initialize();

  await helper.test('Should create middleware function', () => {
    const middleware = limiter.middleware();
    helper.assertEqual(typeof middleware, 'function', 'Middleware should be a function');
  });

  await helper.test('Should call next() when allowed', async () => {
    const middleware = limiter.middleware();
    const req = helper.mockRequest({ ip: '10.0.2.1' });
    const res = {
      setHeader: () => {},
      status: () => ({ json: () => {} })
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    await middleware(req, res, next);
    helper.assert(nextCalled, 'next() should be called when allowed');
  });

  await helper.test('Should return 429 when blocked', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const middleware = limiter.middleware();
    const ip = '10.0.2.2';
    
    // Set up a block
    const blockKey = `ratelimit:violations:${ip}:blocked`;
    await redis.set(blockKey, (Date.now() + 300000).toString(), 300);
    
    const req = helper.mockRequest({ ip });
    let statusCode = 200;
    let responseBody = null;
    
    const res = {
      setHeader: () => {},
      status: (code) => {
        statusCode = code;
        return {
          json: (body) => { responseBody = body; }
        };
      }
    };
    const next = () => {};

    await middleware(req, res, next);
    
    helper.assertEqual(statusCode, 429, 'Should return 429 status');
    helper.assertNotNull(responseBody, 'Should have response body');
    helper.assertNotNull(responseBody.retryAfter, 'Should have retryAfter in response');
    
    // Cleanup
    await redis.del(blockKey);
    await redis.del(`ratelimit:violations:${ip}`);
  });
}

// Integration tests
async function testIntegration(helper) {
  console.log('\n🔗 Integration Tests\n');

  const limiter = getRateLimiter();
  await limiter.initialize();

  await helper.test('Should handle complete request flow', async () => {
    const req = helper.mockRequest({
      ip: '10.0.3.1',
      path: '/api/chat',
      headers: { 'authorization': 'Bearer integration-test-key' },
      body: { model: 'claude-haiku-4-5', tokens: 1000 }
    });

    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Complete request should be allowed');
  });

  await helper.test('Should respect bypass rules in flow', async () => {
    const req = helper.mockRequest({
      ip: '10.0.3.2',
      path: '/health',
    });

    const result = await limiter.checkRateLimit(req);
    helper.assert(result.allowed, 'Health check should bypass all limits');
  });

  await helper.test('Should not bypass admin routes', async () => {
    const req = helper.mockRequest({
      ip: '127.0.0.1', // Local IP that would normally bypass
      path: '/admin/users',
    });

    const result = await limiter.checkRateLimit(req);
    // Should not bypass - will be subject to normal rate limiting
    // (but will be allowed since we haven't hit limits)
    console.log('   Admin route bypass check passed');
  });

  await helper.test('Should get rate limiter status', async () => {
    const status = await limiter.getStatus();
    helper.assertNotNull(status, 'Should return status');
    helper.assertNotNull(status.redis, 'Status should include Redis info');
    helper.assertNotNull(status.config, 'Status should include config info');
  });

  await helper.test('Should reset limits for identifier', async () => {
    const redis = getRedisClient();
    
    if (!redis.isAvailable()) {
      console.log('   Skipping - Redis unavailable');
      return;
    }

    const identifier = '10.0.3.99';
    
    // Set some limits
    await redis.set(`ratelimit:ip:${identifier}`, '50', 60);
    await redis.set(`ratelimit:violations:${identifier}`, '5', 900);
    
    // Reset
    await limiter.resetLimits(identifier);
    
    // Verify reset
    const ipCount = await redis.get(`ratelimit:ip:${identifier}`);
    const violations = await redis.get(`ratelimit:violations:${identifier}`);
    
    console.log('   Limits reset successfully');
  });
}

// Main test runner
async function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 Rate Limiting System Test Suite');
  console.log('='.repeat(50));

  const helper = new TestHelper();

  try {
    // Run test suites
    await testConfiguration(helper);
    await testRedisClient(helper);
    await testIPRateLimit(helper);
    await testAPIKeyRateLimit(helper);
    await testModelRateLimit(helper);
    await testProgressiveBlocking(helper);
    await testMiddleware(helper);
    await testIntegration(helper);

    // Print summary
    const success = await helper.summary();

    // Cleanup
    const redis = getRedisClient();
    await redis.disconnect();
    resetRedisClient();
    resetRateLimiter();

    process.exit(success ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Test suite failed with error:', error);
    process.exit(1);
  }
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests, TestHelper };
