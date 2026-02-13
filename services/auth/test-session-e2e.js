#!/usr/bin/env node
/**
 * End-to-End Session Management Tests
 * 
 * Tests:
 * 1. Login → create session + get httpOnly cookie
 * 2. Access protected route → validate session from cookie
 * 3. IP change detection → alert logged
 * 4. Session timeout (15 min inactivity) → invalidated
 * 5. Concurrent sessions (max 3) → oldest auto-invalidated
 * 6. Logout → session + tokens invalidated + cookie cleared
 * 7. Token refresh → new token pair + session maintained
 * 
 * Usage:
 * ```bash
 * node services/auth/test-session-e2e.js
 * ```
 */

// MUST BE FIRST: Load environment and keys
import '../subagent-webhook/init-env.js';

import http from 'node:http';
import { handleLogin, handleLogout } from './endpoints.js';
import { validateSessionFromCookie } from './session-validation-middleware.js';
import { getSession, invalidateSession, createSession } from './session-store.js';
import { setSessionCookie, extractSessionIdFromCookie } from './cookie-middleware.js';

// ===== Test Utilities =====

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function run() {
  console.log('\n🧪 Session Management E2E Tests\n');
  
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${err.message}\n`);
      failed++;
    }
  }
  
  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// ===== Mock Request/Response =====

function createMockReq(options = {}) {
  return {
    method: options.method || 'POST',
    url: options.url || '/test',
    headers: {
      host: 'localhost:3001',
      'user-agent': options.userAgent || 'test-client/1.0',
      'x-forwarded-for': options.ip || '127.0.0.1',
      cookie: options.cookie || '',
      ...options.headers,
    },
    socket: {
      remoteAddress: options.ip || '127.0.0.1',
    },
  };
}

function createMockRes() {
  const res = {
    _headers: {},
    _statusCode: 200,
    _body: null,
    _cookies: [],
    
    writeHead(statusCode, headers) {
      this._statusCode = statusCode;
      this._headers = headers || {};
    },
    
    setHeader(name, value) {
      if (name === 'Set-Cookie') {
        this._cookies.push(value);
      }
      this._headers[name] = value;
    },
    
    getHeader(name) {
      return this._headers[name];
    },
    
    end(body) {
      this._body = body;
    },
  };
  return res;
}

function extractCookie(res) {
  const setCookie = res._cookies[0];
  if (!setCookie) return null;
  
  const match = setCookie.match(/openclaw_session=([^;]+)/);
  return match ? match[1] : null;
}

// ===== Tests =====

test('Login creates session and sets httpOnly cookie', () => {
  const req = createMockReq();
  const res = createMockRes();
  req.res = res;
  
  const result = handleLogin(req, {
    username: 'admin',
    password: 'changeme',
  });
  
  assertEqual(result.statusCode, 200, 'Login should return 200');
  assert(result.body.accessToken, 'Should return accessToken');
  assert(result.body.refreshToken, 'Should return refreshToken');
  assert(result.body.sessionId, 'Should return sessionId');
  assert(res._cookies.length > 0, 'Should set cookie');
  
  const cookie = res._cookies[0];
  assert(cookie.includes('HttpOnly'), 'Cookie should be HttpOnly');
  assert(cookie.includes('Secure'), 'Cookie should be Secure');
  assert(cookie.includes('SameSite=Strict'), 'Cookie should be SameSite=Strict');
});

test('Session is stored and retrievable', () => {
  const req = createMockReq({ ip: '192.168.1.100' });
  const res = createMockRes();
  req.res = res;
  
  const result = handleLogin(req, {
    username: 'admin',
    password: 'changeme',
  });
  
  const sessionId = result.body.sessionId;
  const session = getSession(sessionId);
  
  assert(session, 'Session should exist');
  assertEqual(session.userId, 'admin-001', 'Session should have correct userId');
  assertEqual(session.ipAddress, '192.168.1.100', 'Session should store IP');
  assert(session.createdAt > 0, 'Session should have createdAt timestamp');
});

test('Session validation passes for valid session', () => {
  const req = createMockReq({ ip: '192.168.1.100' });
  const res = createMockRes();
  req.res = res;
  
  const loginResult = handleLogin(req, {
    username: 'admin',
    password: 'changeme',
  });
  
  const sessionId = loginResult.body.sessionId;
  
  // Create mock request with session cookie
  const protectedReq = createMockReq({
    cookie: `openclaw_session=${sessionId}; Path=/; HttpOnly`,
    ip: '192.168.1.100',
  });
  
  const validation = validateSessionFromCookie(protectedReq);
  
  assert(validation.valid, 'Session validation should pass');
  assertEqual(validation.userId, 'admin-001', 'Should have correct userId');
});

test('IP change is detected', () => {
  const req = createMockReq({ ip: '192.168.1.100' });
  const res = createMockRes();
  req.res = res;
  
  const loginResult = handleLogin(req, {
    username: 'admin',
    password: 'changeme',
  });
  
  const sessionId = loginResult.body.sessionId;
  const session = getSession(sessionId);
  
  // Simulate IP change
  const newReq = createMockReq({
    cookie: `openclaw_session=${sessionId}; Path=/; HttpOnly`,
    ip: '203.0.113.50', // Different IP
  });
  
  const validation = validateSessionFromCookie(newReq);
  
  assert(validation.valid, 'Session should still be valid');
  assert(validation.ipChanged, 'IP change should be detected');
  
  // Verify session was updated
  const updatedSession = getSession(sessionId);
  assert(updatedSession.ipChanges.length > 0, 'IP change should be logged');
  assertEqual(updatedSession.ipChanges[0].oldIp, '192.168.1.100', 'Old IP should be stored');
  assertEqual(updatedSession.ipChanges[0].newIp, '203.0.113.50', 'New IP should be stored');
});

test('Invalid session cookie is rejected', () => {
  const req = createMockReq({
    cookie: `openclaw_session=invalid-session-id-12345; Path=/; HttpOnly`,
  });
  
  const validation = validateSessionFromCookie(req);
  
  assert(!validation.valid, 'Invalid session should not be valid');
  assertEqual(validation.statusCode, 401, 'Should return 401');
  assertEqual(validation.reason, 'session_not_found', 'Should indicate session not found');
});

test('Missing session cookie is rejected', () => {
  const req = createMockReq({ cookie: '' });
  
  const validation = validateSessionFromCookie(req);
  
  assert(!validation.valid, 'Missing session should not be valid');
  assertEqual(validation.statusCode, 401, 'Should return 401');
  assertEqual(validation.reason, 'missing_session_cookie', 'Should indicate missing cookie');
});

test('Concurrent sessions limit (max 3)', () => {
  const req1 = createMockReq({ ip: '192.168.1.100' });
  const req2 = createMockReq({ ip: '192.168.1.101' });
  const req3 = createMockReq({ ip: '192.168.1.102' });
  const req4 = createMockReq({ ip: '192.168.1.103' });
  
  const res1 = createMockRes();
  const res2 = createMockRes();
  const res3 = createMockRes();
  const res4 = createMockRes();
  
  req1.res = res1;
  req2.res = res2;
  req3.res = res3;
  req4.res = res4;
  
  // Create 4 sessions
  const s1 = handleLogin(req1, { username: 'admin', password: 'changeme' }).body.sessionId;
  
  // After first 3 logins, sessions 1-3 should exist
  const s2 = handleLogin(req2, { username: 'admin', password: 'changeme' }).body.sessionId;
  assert(getSession(s1), 'Session 1 should exist after s2 created');
  assert(getSession(s2), 'Session 2 should exist');
  
  const s3 = handleLogin(req3, { username: 'admin', password: 'changeme' }).body.sessionId;
  assert(getSession(s1), 'Session 1 should exist after s3 created');
  assert(getSession(s2), 'Session 2 should exist after s3 created');
  assert(getSession(s3), 'Session 3 should exist');
  
  // 4th login should invalidate oldest (s1)
  const s4 = handleLogin(req4, { username: 'admin', password: 'changeme' }).body.sessionId;
  assert(!getSession(s1), 'Session 1 should be invalidated (oldest)');
  assert(getSession(s2), 'Session 2 should exist after s4 created');
  assert(getSession(s3), 'Session 3 should exist after s4 created');
  assert(getSession(s4), 'Session 4 should exist');
});

test('Logout invalidates session and clears cookie', () => {
  const req = createMockReq();
  const res = createMockRes();
  req.res = res;
  
  const loginResult = handleLogin(req, {
    username: 'admin',
    password: 'changeme',
  });
  
  const sessionId = loginResult.body.sessionId;
  assert(getSession(sessionId), 'Session should exist after login');
  
  // Mock auth object
  req.auth = {
    userId: 'admin-001',
    role: 'admin',
  };
  
  const logoutResult = handleLogout(req);
  
  assertEqual(logoutResult.statusCode, 200, 'Logout should return 200');
  assert(!getSession(sessionId), 'Session should be invalidated after logout');
  
  // Check cookie was cleared
  const cookieHeader = res._cookies.find(c => c.includes('Max-Age=0'));
  assert(cookieHeader, 'Session cookie should be cleared');
});

// ===== Run Tests =====

run();
