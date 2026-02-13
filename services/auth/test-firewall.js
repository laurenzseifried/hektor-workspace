#!/usr/bin/env node
/**
 * Firewall Rules and IP Restrictions Tests
 * 
 * Tests for:
 * 1. IP whitelist (IPv4, IPv6, CIDR)
 * 2. Webhook signature validation
 * 3. Security headers
 * 4. Endpoint restrictions
 * 5. Hardened health check
 * 
 * Usage:
 * ```bash
 * node services/auth/test-firewall.js
 * ```
 */

import {
  checkIPWhitelist,
  parseIPWhitelist,
} from './ip-whitelist-middleware.js';
import {
  generateSignature,
  validateWebhookSignature,
} from './webhook-signature-validation.js';
import {
  validateSecurityHeaders,
  getSecurityHeaders,
} from './security-headers.js';
import {
  isBlockedEndpoint,
  isSensitiveEndpoint,
  shouldBlockEndpoint,
} from './endpoint-restrictions.js';
import {
  handleHealthCheck,
  validateHealthCheckHardening,
} from './hardened-health-check.js';

// ===== Test Infrastructure =====

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function run() {
  console.log('\n🔒 Firewall & IP Restrictions Tests\n');

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ ${name}`);
      console.log(`   ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// ===== Mock Objects =====

function createMockReq(opts = {}) {
  return {
    url: opts.url || '/test',
    method: opts.method || 'GET',
    headers: {
      'user-agent': opts.userAgent || 'test-client',
      'x-forwarded-for': opts.ip || '127.0.0.1',
      'x-webhook-signature': opts.signature || null,
      ...opts.headers,
    },
    socket: {
      remoteAddress: opts.ip || '127.0.0.1',
    },
  };
}

function createMockRes() {
  return {
    _headers: {},
    setHeader(name, value) {
      this._headers[name] = value;
    },
    getHeader(name) {
      return this._headers[name];
    },
  };
}

// ===== IP Whitelist Tests =====

test('Parse IPv4 addresses', () => {
  const whitelist = parseIPWhitelist('192.168.1.1,10.0.0.1');
  assert(whitelist.length === 2, 'Should parse 2 IPs');
  assertEqual(whitelist[0].ip, '192.168.1.1', 'First IP should match');
  assertEqual(whitelist[0].version, 4, 'Should be IPv4');
  assert(!whitelist[0].isCIDR, 'Should not be CIDR');
});

test('Parse IPv4 CIDR ranges', () => {
  const whitelist = parseIPWhitelist('192.168.1.0/24,10.0.0.0/8');
  assert(whitelist.length === 2, 'Should parse 2 CIDR ranges');
  assertEqual(whitelist[0].mask, 24, 'First mask should be 24');
  assert(whitelist[0].isCIDR, 'Should be CIDR');
});

test('IPv4 exact match allows access', () => {
  process.env.ADMIN_ALLOWED_IPS = '192.168.1.100';
  const req = createMockReq({ ip: '192.168.1.100' });
  const result = checkIPWhitelist(req, { path: '/admin/users' });
  assert(result.allowed, 'Should allow matching IP');
  delete process.env.ADMIN_ALLOWED_IPS;
});

test('IPv4 non-matching IP blocks access', () => {
  process.env.ADMIN_ALLOWED_IPS = '192.168.1.100';
  const req = createMockReq({ ip: '203.0.113.50' });
  const result = checkIPWhitelist(req, { path: '/admin/users' });
  assert(!result.allowed, 'Should block non-matching IP');
  delete process.env.ADMIN_ALLOWED_IPS;
});

test('IPv4 CIDR range matching', () => {
  process.env.ADMIN_ALLOWED_IPS = '192.168.1.0/24';
  
  const req1 = createMockReq({ ip: '192.168.1.1' });
  const result1 = checkIPWhitelist(req1, { path: '/admin/users' });
  assert(result1.allowed, 'Should allow IP in CIDR range');

  const req2 = createMockReq({ ip: '192.168.2.1' });
  const result2 = checkIPWhitelist(req2, { path: '/admin/users' });
  assert(!result2.allowed, 'Should block IP outside CIDR range');
  
  delete process.env.ADMIN_ALLOWED_IPS;
});

test('X-Forwarded-For header support', () => {
  process.env.ADMIN_ALLOWED_IPS = '10.0.0.1';
  const req = createMockReq({
    ip: '203.0.113.1', // Proxy IP (blocked)
    headers: {
      'x-forwarded-for': '10.0.0.1, 203.0.113.1', // Original client IP (allowed)
    },
  });
  const result = checkIPWhitelist(req, { path: '/admin/users' });
  assert(result.allowed, 'Should extract first IP from X-Forwarded-For');
  delete process.env.ADMIN_ALLOWED_IPS;
});

test('Missing whitelist config returns error', () => {
  delete process.env.ADMIN_ALLOWED_IPS;
  const req = createMockReq();
  const result = checkIPWhitelist(req);
  assert(!result.allowed, 'Should not allow when whitelist missing');
});

// ===== Webhook Signature Tests =====

test('Generate webhook signature', () => {
  const secret = 'test-secret-12345';
  const payload = '{"taskId":"test-001","status":"ok"}';
  const signature = generateSignature(payload, secret);
  assert(signature.startsWith('sha256='), 'Should use sha256 format');
  assertEqual(signature.length, 71, 'SHA256 hex should be 64 chars + "sha256="');
});

test('Valid webhook signature is accepted', () => {
  const secret = 'webhook-secret';
  const payload = '{"data":"test"}';
  const signature = generateSignature(payload, secret);

  const req = createMockReq({
    url: '/webhooks/subagent-complete',
    method: 'POST',
    headers: {
      'x-webhook-signature': signature,
    },
  });

  const result = validateWebhookSignature(req, payload, { secret, log: false });
  assert(result.valid, 'Should validate correct signature');
});

test('Invalid webhook signature is rejected', () => {
  const secret = 'webhook-secret';
  const payload = '{"data":"test"}';

  const req = createMockReq({
    url: '/webhooks/subagent-complete',
    method: 'POST',
    headers: {
      'x-webhook-signature': 'sha256=invalid000000000000000000000000000000000000000000000000000000',
    },
  });

  const result = validateWebhookSignature(req, payload, { secret, log: false });
  assert(!result.valid, 'Should reject incorrect signature');
});

test('Missing signature header is rejected', () => {
  const secret = 'webhook-secret';
  const payload = '{"data":"test"}';
  const req = createMockReq();

  const result = validateWebhookSignature(req, payload, { secret, log: false });
  assert(!result.valid, 'Should reject missing signature');
});

// ===== Security Headers Tests =====

test('Security headers are applied', () => {
  const headers = getSecurityHeaders();
  assert('X-Content-Type-Options' in headers, 'Should have X-Content-Type-Options');
  assert('X-Frame-Options' in headers, 'Should have X-Frame-Options');
  assert('X-XSS-Protection' in headers, 'Should have X-XSS-Protection');
  assert('Content-Security-Policy' in headers, 'Should have CSP');
  assert('Referrer-Policy' in headers, 'Should have Referrer-Policy');
  assert('Permissions-Policy' in headers, 'Should have Permissions-Policy');
});

test('Security headers have correct values', () => {
  const headers = getSecurityHeaders();
  assertEqual(headers['X-Content-Type-Options'], 'nosniff');
  assertEqual(headers['X-Frame-Options'], 'DENY');
  assertEqual(headers['X-XSS-Protection'], '0');
  assert(headers['Content-Security-Policy'].includes('default-src'), 'CSP should include default-src');
});

test('Validate security headers', () => {
  const headers = getSecurityHeaders();
  const validation = validateSecurityHeaders(headers);
  assert(validation.valid, 'Should validate hardened headers');
  assertEqual(validation.missing.length, 0, 'Should have no missing headers');
});

// ===== Endpoint Restrictions Tests =====

test('Blocked endpoints are identified', () => {
  assert(isBlockedEndpoint('/docs'), 'Should block /docs');
  assert(isBlockedEndpoint('/swagger'), 'Should block /swagger');
  assert(isBlockedEndpoint('/api-docs'), 'Should block /api-docs');
  assert(isBlockedEndpoint('/debug'), 'Should block /debug');
  assert(isBlockedEndpoint('/.env'), 'Should block /.env');
});

test('Sensitive endpoints are marked', () => {
  assert(isSensitiveEndpoint('/admin/users'), 'Should mark /admin/users as sensitive');
  assert(isSensitiveEndpoint('/api/v1/admin/config'), 'Should mark /api/v1/admin/config as sensitive');
  assert(!isSensitiveEndpoint('/webhooks/subagent-complete'), 'Should not mark webhook as sensitive');
});

test('Debug paths are blocked', () => {
  assert(isBlockedEndpoint('/debug/info'), 'Should block /debug/info');
  assert(isBlockedEndpoint('/test/endpoint'), 'Should block /test/endpoint');
  assert(isBlockedEndpoint('/dev/config'), 'Should block /dev/config');
});

test('Endpoint restriction logic works', () => {
  const blocked = shouldBlockEndpoint('/docs', 'GET', { requireAuth: true });
  assert(blocked.shouldBlock, 'Should block /docs');

  const allowed = shouldBlockEndpoint('/health', 'GET', { requireAuth: null });
  assert(!allowed.shouldBlock, 'Should allow /health');
});

// ===== Health Check Tests =====

test('Health check returns ok status', () => {
  const result = handleHealthCheck(createMockReq());
  assertEqual(result.statusCode, 200, 'Should return 200 for ok status');
  assert('status' in result.body, 'Should include status field');
  assert('timestamp' in result.body, 'Should include timestamp');
});

test('Health check does not expose sensitive info', () => {
  const result = handleHealthCheck(createMockReq());
  const validation = validateHealthCheckHardening(result.body);
  assert(validation.hardened, 'Health check should be hardened');
  assertEqual(validation.issues.length, 0, 'Should have no hardening issues');
});

test('Health check has no dangerous fields', () => {
  const result = handleHealthCheck(createMockReq());
  const body = result.body;

  const dangerousFields = ['uptime', 'version', 'memory', 'cpu', 'pid', 'hostname', 'config'];
  for (const field of dangerousFields) {
    assert(!(field in body), `Should not expose ${field}`);
  }
});

// ===== Run Tests =====

run();
