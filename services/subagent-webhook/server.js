#!/usr/bin/env node
/**
 * Sub-Agent Webhook Server
 * 
 * Receives POST /webhooks/subagent-complete from sub-agents,
 * logs results to .subagent-results/, and optionally forwards to Telegram.
 * 
 * SECURITY: JWT authentication + RBAC authorization + rate limiting
 * 
 * Usage: node server.js [--port 3001] [--telegram] [--telegram-topic 7]
 */

// MUST BE FIRST: Initialize environment before other imports
import './init-env.js';

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateSecrets } from './secrets-validator.js';
import { jwtMiddleware } from '../auth/jwt-middleware.js';
import { handleLogin, handleRefresh, handleLogout } from '../auth/endpoints.js';
import { initialize as initializeTokenStore } from '../auth/token-store.js';
import { authorizationMiddleware, checkRateLimit, checkCostCap } from '../auth/authorization.js';
import { 
  handleListUsers, 
  handleUpdateUserRole, 
  handleResetUserCosts, 
  handleListRoles, 
  handleGetAuditLog 
} from '../auth/admin-endpoints.js';
import {
  handleListSessions,
  handleRevokeSession,
  handleRevokeAllSessions,
} from '../auth/session-endpoints.js';
import {
  validateSession,
  updateSessionActivity,
  initializeSessionCleanup,
} from '../auth/session-store.js';
import {
  extractSessionIdFromCookie,
  getClientIp,
} from '../auth/cookie-middleware.js';
import {
  sessionValidationMiddleware,
  validateSessionFromCookie,
} from '../auth/session-validation-middleware.js';
import {
  requireAuth,
  requireAdmin,
} from '../auth/session-auth-helper.js';
import {
  checkIPWhitelist,
  getClientIP as getIPClientIP,
} from '../auth/ip-whitelist-middleware.js';
import {
  validateWebhookSignature,
} from '../auth/webhook-signature-validation.js';
import {
  addSecurityHeaders,
} from '../auth/security-headers.js';
import {
  shouldBlockEndpoint,
} from '../auth/endpoint-restrictions.js';
import {
  handleHealthCheck,
} from '../auth/hardened-health-check.js';
import {
  getRateLimiter,
} from '../auth/rate-limiter.js';

// Environment and JWT keys loaded by init-env.js (imported first)

// --- STARTUP VALIDATION ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('\n[subagent-webhook] Starting validation...');
const validationResult = validateSecrets();
if (!validationResult.passed) {
  console.error('\n[subagent-webhook] FATAL: Secrets validation failed. Refusing to start.\n');
  process.exit(1);
}

// --- Initialize Token Store ---
console.log('[subagent-webhook] Initializing JWT token store...');
initializeTokenStore();

// --- Initialize Session Cleanup ---
console.log('[subagent-webhook] Initializing session cleanup (1-minute interval)...');
initializeSessionCleanup(60000); // Clean up expired sessions every minute

// --- Initialize Rate Limiter ---
console.log('[subagent-webhook] Initializing rate limiter...');
const rateLimiter = getRateLimiter();
await rateLimiter.initialize().catch(err => {
  console.warn('[subagent-webhook] Rate limiter initialization warning:', err.message);
  console.warn('[subagent-webhook] Continuing with degraded rate limiting (Redis unavailable)');
});

// --- Config ---
const PORT = parseInt(process.env.WEBHOOK_PORT || '3001', 10);
const RESULTS_DIR = process.env.RESULTS_DIR || path.resolve(
  new URL('.', import.meta.url).pathname, '../../.subagent-results'
);
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;
const TELEGRAM_ENABLED = process.argv.includes('--telegram') || process.env.TELEGRAM_NOTIFY === '1';
const TELEGRAM_TOPIC = process.env.TELEGRAM_TOPIC || '7'; // #logs default
const TELEGRAM_GROUP = process.env.TELEGRAM_GROUP || '-1003808534190';

// Ensure results dir
fs.mkdirSync(RESULTS_DIR, { recursive: true });

// --- Telegram notification via openclaw CLI ---
function notifyTelegram(payload) {
  if (!TELEGRAM_ENABLED) return;
  const status = payload.status === 'ok' ? '✅' : '❌';
  const msg = [
    `${status} **Sub-Agent Complete**`,
    `Task: \`${payload.taskId}\``,
    payload.label ? `Label: ${payload.label}` : null,
    `Status: ${payload.status}`,
    payload.error ? `Error: ${payload.error}` : null,
    payload.result ? `Result: ${String(payload.result).slice(0, 200)}` : null,
  ].filter(Boolean).join('\n');

  execFile('openclaw', [
    'message', 'send',
    '--channel', 'telegram',
    '--target', TELEGRAM_GROUP,
    '--thread-id', TELEGRAM_TOPIC,
    '--message', msg,
  ], { timeout: 10000 }, (err) => {
    if (err) console.error('[telegram] notify failed:', err.message);
  });
}

// Old IP-based rate limiting and bearer token functions removed
// Now using role-based RBAC authorization and rate limiting

// --- Validate taskId format (prevent path traversal) ---
function isValidTaskId(taskId) {
  return /^[a-zA-Z0-9_-]+$/.test(taskId);
}

// --- Request handler ---
async function handleWebhook(req, res) {
  const clientIp = req.socket.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
  
  // Apply security headers to ALL responses (FIRST)
  addSecurityHeaders(res, { csp: true, hsts: false });

  // Check endpoint restrictions early
  const restriction = shouldBlockEndpoint(req.url, req.method, {
    requireAuth: req.auth !== undefined,
    environment: process.env.NODE_ENV || 'development'
  });
  
  if (restriction.shouldBlock) {
    res.writeHead(restriction.statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({ error: restriction.reason }));
  }
  
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 
      'Access-Control-Allow-Origin': 'http://127.0.0.1',
      'Access-Control-Allow-Methods': 'POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Rate limiting check (multi-layer)
  const ipForRate = clientIp;
  const mlRateLimitResult = await rateLimiter.checkRateLimit({
    ip: ipForRate,
    path: req.url,
    url: req.url,
    headers: req.headers,
    body: req.body || {},
    query: {},
    connection: { remoteAddress: ipForRate }
  });

  // Add rate limit headers if provided
  if (mlRateLimitResult.headers) {
    Object.entries(mlRateLimitResult.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  // Check if rate limited
  if (!mlRateLimitResult.allowed) {
    if (mlRateLimitResult.retryAfter) {
      res.setHeader('Retry-After', mlRateLimitResult.retryAfter.toString());
    }
    res.writeHead(429, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({
      error: 'Rate limit exceeded',
      message: mlRateLimitResult.reason || 'Too many requests',
      retryAfter: mlRateLimitResult.retryAfter,
    }));
  }

  // --- Auth Endpoints (No JWT required) ---
  
  // Hardened health check (no version/uptime info)
  if (req.method === 'GET' && req.url === '/health') {
    const result = handleHealthCheck(req);
    res.writeHead(result.statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify(result.body));
  }
  
  // Login endpoint (no auth)
  if (req.method === 'POST' && req.url === '/auth/login') {
    let body = '';
    req.on('data', chunk => { 
      body += chunk;
    });
    req.on('end', () => {
      try {
        if (!body) {
          res.writeHead(422, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://127.0.0.1'
          });
          return res.end(JSON.stringify({ error: 'Empty request body' }));
        }
        const payload = JSON.parse(body);
        
        // Attach res to req for cookie setting
        req.res = res;
        
        const result = handleLogin(req, payload);
        
        // Set cookie header (already set by handleLogin via setSessionCookie)
        res.writeHead(result.statusCode, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://127.0.0.1'
        });
        res.end(JSON.stringify(result.body));
      } catch (err) {
        console.error('[webhook] Login JSON parse error:', err.message, 'Body:', body);
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://127.0.0.1'
        });
        res.end(JSON.stringify({ error: 'Invalid JSON', details: err.message }));
      }
    });
    return;
  }
  
  // Refresh token endpoint (no auth)
  if (req.method === 'POST' && req.url === '/auth/refresh') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const result = handleRefresh(req, payload);
        res.writeHead(result.statusCode, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://127.0.0.1'
        });
        res.end(JSON.stringify(result.body));
      } catch (err) {
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://127.0.0.1'
        });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // Logout endpoint (requires auth)
  if (req.method === 'POST' && req.url === '/auth/logout') {
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    
    // Attach res for cookie clearing
    req.res = res;
    
    const result = handleLogout(req);
    
    // Cookie cleared by handleLogout via clearSessionCookie
    res.writeHead(result.statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    res.end(JSON.stringify(result.body));
    return;
  }

  // --- Admin Endpoints (JWT + RBAC required) ---
  
  // IP Whitelist protection for /admin/* routes
  if (req.url.startsWith('/admin/')) {
    const ipCheck = checkIPWhitelist(req, {
      path: req.url,
      whitelistEnvVar: 'ADMIN_ALLOWED_IPS'
    });
    
    if (!ipCheck.allowed) {
      res.writeHead(403, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1'
      });
      return res.end(JSON.stringify({ 
        error: 'Access denied', 
        clientIP: ipCheck.clientIP,
        reason: ipCheck.reason
      }));
    }
  }
  
  // Admin: List users
  if (req.method === 'GET' && req.url === '/admin/users') {
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    const result = handleListUsers(req);
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }
  
  // Admin: Update user role
  if (req.method === 'POST' && req.url.match(/^\/admin\/users\/([^\/]+)\/role$/)) {
    const userId = req.url.match(/^\/admin\/users\/([^\/]+)\/role$/)[1];
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const result = handleUpdateUserRole(req, userId, payload);
        res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.body));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // Admin: Reset user costs
  if (req.method === 'POST' && req.url.match(/^\/admin\/users\/([^\/]+)\/reset-costs$/)) {
    const userId = req.url.match(/^\/admin\/users\/([^\/]+)\/reset-costs$/)[1];
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    const result = handleResetUserCosts(req, userId);
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }
  
  // Admin: List roles
  if (req.method === 'GET' && req.url === '/admin/roles') {
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    const result = handleListRoles(req);
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }
  
  // Admin: Audit log
  if (req.method === 'GET' && req.url.startsWith('/admin/audit-log')) {
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    
    // Parse query params
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    const result = handleGetAuditLog(req, { limit, offset });
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }

  // --- Session Management Endpoints (JWT required) ---
  
  // Session: List sessions
  if (req.method === 'GET' && req.url === '/auth/sessions') {
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    
    // Extract session ID from cookie
    const sessionId = extractSessionIdFromCookie(req.headers.cookie);
    req.sessionId = sessionId;
    
    const result = handleListSessions(req);
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }
  
  // Session: Revoke specific session
  if (req.method === 'DELETE' && req.url.match(/^\/auth\/sessions\/([^\/]+)$/)) {
    const sessionId = req.url.match(/^\/auth\/sessions\/([^\/]+)$/)[1];
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    
    // Extract current session ID from cookie
    const currentSessionId = extractSessionIdFromCookie(req.headers.cookie);
    req.sessionId = currentSessionId;
    
    const result = handleRevokeSession(req, sessionId);
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }
  
  // Session: Revoke all sessions
  if (req.method === 'DELETE' && req.url === '/auth/sessions') {
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
    const result = handleRevokeAllSessions(req);
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }

  // --- Protected Endpoints (JWT + RBAC + Session required) ---
  
  if (req.method !== 'POST' || req.url !== '/webhooks/subagent-complete') {
    res.writeHead(404, { 'Access-Control-Allow-Origin': 'http://127.0.0.1' });
    return res.end('Not Found');
  }
  
  // Validate JWT token
  const auth = jwtMiddleware(req);
  if (auth.error) {
    res.writeHead(auth.statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({ error: auth.errorMessage }));
  }
  
  // Attach auth to request for downstream handlers
  req.auth = auth;
  
  // Session validation (extract from httpOnly cookie)
  const sessionId = extractSessionIdFromCookie(req.headers.cookie);
  if (!sessionId) {
    res.writeHead(401, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({ error: 'No session found. Please login.' }));
  }
  
  // Validate session (check timeouts)
  const sessionValidation = validateSession(sessionId);
  if (!sessionValidation.valid) {
    res.writeHead(401, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({ 
      error: 'Session expired',
      reason: sessionValidation.reason,
    }));
  }
  
  // Update session activity (sliding window) - use existing clientIp from line 114
  updateSessionActivity(sessionId, clientIp);
  
  // Authorization check (RBAC)
  const authzResult = authorizationMiddleware(auth, {
    requiredPermission: 'webhooks:own',
    action: 'webhook:subagent-complete',
  });
  
  if (!authzResult.authorized) {
    res.writeHead(authzResult.statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({ error: authzResult.message }));
  }
  
  // Role-based rate limiting
  const rateLimitResult = checkRateLimit(auth.userId, auth.role);
  if (!rateLimitResult.allowed) {
    console.warn(`[webhook] Rate limit exceeded: userId=${auth.userId}, role=${auth.role}`);
    res.writeHead(429, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1',
      'Retry-After': rateLimitResult.resetIn.toString(),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
    });
    return res.end(JSON.stringify({ 
      error: 'Rate limit exceeded', 
      resetIn: rateLimitResult.resetIn,
      remaining: 0,
    }));
  }
  
  // Cost cap check (estimate $0.001 per webhook call)
  const costResult = checkCostCap(auth.userId, auth.role, 0.1); // 0.1 cents
  if (!costResult.allowed) {
    console.warn(`[webhook] Cost cap exceeded: userId=${auth.userId}, daily=$${costResult.dailyUsed/100}`);
    res.writeHead(402, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({ 
      error: 'Daily cost limit exceeded',
      dailyUsed: `$${(costResult.dailyUsed / 100).toFixed(2)}`,
      dailyLimit: `$${(costResult.dailyLimit / 100).toFixed(2)}`,
    }));
  }

  let body = '';
  req.on('data', chunk => { 
    // Payload size limit (100KB)
    if (body.length + chunk.length > 1024 * 100) {
      res.writeHead(413, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1'
      });
      res.end(JSON.stringify({ error: 'Payload too large' }));
      req.destroy();
      return;
    }
    body += chunk; 
  });
  req.on('end', () => {
    // Validate webhook signature (HMAC-SHA256)
    if (process.env.WEBHOOK_HMAC_SECRET) {
      const sigCheck = validateWebhookSignature(req, body, {
        secret: process.env.WEBHOOK_HMAC_SECRET,
        clientIP: clientIp,
        log: true
      });

      if (!sigCheck.valid) {
        console.warn(`[webhook] Signature validation failed: ${sigCheck.reason} from ${clientIp}`);
        res.writeHead(401, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://127.0.0.1'
        });
        return res.end(JSON.stringify({ 
          error: 'Invalid signature',
          reason: sigCheck.reason 
        }));
      }
      console.log(`[webhook] Signature validated successfully for ${clientIp}`);
    } else {
      console.warn('[webhook] WEBHOOK_HMAC_SECRET not set - signature validation disabled');
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch (err) {
      console.warn(`[webhook] JSON parse error from ${clientIp}: ${err.message}`);
      res.writeHead(400, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1'
      });
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }

    // Validate required fields
    if (!payload.taskId || !payload.status) {
      res.writeHead(422, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1'
      });
      return res.end(JSON.stringify({ error: 'Missing taskId or status' }));
    }
    
    // Validate taskId format (prevent path traversal)
    if (!isValidTaskId(payload.taskId)) {
      console.warn(`[webhook] Invalid taskId format: ${payload.taskId}`);
      res.writeHead(400, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1'
      });
      return res.end(JSON.stringify({ error: 'Invalid taskId format: must be alphanumeric with hyphens/underscores only' }));
    }

    // Add server timestamp
    payload.receivedAt = new Date().toISOString();
    payload.timestamp = payload.timestamp || payload.receivedAt;

    // Write result file (use basename to prevent any path traversal)
    const filename = `${path.basename(payload.taskId)}.json`;
    const filepath = path.join(RESULTS_DIR, filename);
    try {
      fs.writeFileSync(filepath, JSON.stringify(payload, null, 2) + '\n');
      console.log(`[webhook] Saved ${filename} (status: ${payload.status}) from ${clientIp}`);
    } catch (err) {
      console.error(`[webhook] Write failed: ${err.message}`);
      res.writeHead(500, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1'
      });
      return res.end(JSON.stringify({ error: 'Write failed' }));
    }

    // Notify Telegram (async, non-blocking)
    notifyTelegram(payload);

    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    res.end(JSON.stringify({ ok: true, file: filename }));
  });
}

// --- Server ---
const server = http.createServer(handleWebhook);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n[subagent-webhook] ✅ Server started with JWT + RBAC + Session Hardening`);
  console.log(`[subagent-webhook] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[subagent-webhook] Results → ${RESULTS_DIR}`);
  console.log(`[subagent-webhook] Telegram: ${TELEGRAM_ENABLED ? 'ON' : 'OFF'}`);
  console.log(`[subagent-webhook] CORS: Restricted to http://127.0.0.1`);
  console.log(`[subagent-webhook] \n🔐 Security:`);
  console.log(`  - JWT (RS256) authentication required`);
  console.log(`  - RBAC with 5 roles (owner, admin, developer, api_consumer, viewer)`);
  console.log(`  - Per-role rate limiting + cost caps`);
  console.log(`  - HttpOnly cookies (XSS-proof, CSRF-protected)`);
  console.log(`  - Session management (max 3 concurrent, 24h timeout, 15m sliding window)`);
  console.log(`  - IP tracking + suspicious activity detection`);
  console.log(`  - Authorization checks on all protected routes`);
  console.log(`[subagent-webhook] \n🔑 Auth Endpoints:`);
  console.log(`  - POST /auth/login → {accessToken, refreshToken} + httpOnly session cookie`);
  console.log(`  - POST /auth/refresh → new tokens`);
  console.log(`  - POST /auth/logout → revoke session + tokens`);
  console.log(`[subagent-webhook] \n🛡️  Session Endpoints:`);
  console.log(`  - GET /auth/sessions → list active sessions`);
  console.log(`  - DELETE /auth/sessions/:id → revoke specific session`);
  console.log(`  - DELETE /auth/sessions → revoke all sessions`);
  console.log(`[subagent-webhook] \n⚙️  Admin Endpoints (owner only):`);
  console.log(`  - GET /admin/users → list users + cost tracking`);
  console.log(`  - POST /admin/users/:id/role → update role`);
  console.log(`  - POST /admin/users/:id/reset-costs → reset daily limits`);
  console.log(`  - GET /admin/roles → list all roles`);
  console.log(`  - GET /admin/audit-log → view auth failures`);
  console.log(`[subagent-webhook] \n📊 Rate Limits:`);
  console.log(`  - owner: 100 req/min (unlimited cost)`);
  console.log(`  - admin: 60 req/min ($500/day cap)`);
  console.log(`  - developer: 30 req/min ($100/day cap)`);
  console.log(`  - api_consumer: 20 req/min ($50/day cap)`);
  console.log(`  - viewer: 10 req/min (no API calls)`);
  console.log(`[subagent-webhook] \n⏱️  Session Controls:`);
  console.log(`  - Max 3 concurrent sessions per user`);
  console.log(`  - 24-hour absolute timeout`);
  console.log(`  - 15-minute inactivity timeout (sliding window)`);
  console.log(`  - Automatic cleanup every 1 minute`);
  console.log(`  - IP change detection + alerts\n`);
});
