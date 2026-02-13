# Firewall & IP Restrictions Integration Checklist

**Quick Start:** Copy-paste integration blocks into `server.js`

---

## Pre-Integration Setup

- [ ] Read `/docs/FIREWALL_RULES_DEPLOYMENT.md` (complete reference)
- [ ] Set environment variables in `.env`:
  ```bash
  ADMIN_ALLOWED_IPS="192.168.1.0/24,10.0.0.1"
  WEBHOOK_HMAC_SECRET="$(openssl rand -hex 32)"
  NODE_ENV="production"
  ```
- [ ] Run test suite: `node services/auth/test-firewall.js` (expect 21/21 ✅)

---

## Integration Steps

### 1. Add Imports to server.js

```javascript
// After other imports
import { 
  checkIPWhitelist,
  getClientIP as getIPClientIP 
} from '../auth/ip-whitelist-middleware.js';
import { 
  validateWebhookSignature 
} from '../auth/webhook-signature-validation.js';
import { 
  addSecurityHeaders 
} from '../auth/security-headers.js';
import { 
  shouldBlockEndpoint 
} from '../auth/endpoint-restrictions.js';
import { 
  handleHealthCheck 
} from '../auth/hardened-health-check.js';
```

### 2. Update handleWebhook() Function

**At the top of `handleWebhook()` (BEFORE any other logic):**

```javascript
function handleWebhook(req, res) {
  // 2a. Apply security headers to ALL responses
  addSecurityHeaders(res, { csp: true, hsts: false });

  // 2b. Check endpoint restrictions early
  const restriction = shouldBlockEndpoint(req.url, req.method, {
    requireAuth: req.auth !== undefined,
    environment: process.env.NODE_ENV || 'development'
  });
  
  if (restriction.blocked) {
    res.writeHead(restriction.statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://127.0.0.1'
    });
    return res.end(JSON.stringify({ error: restriction.reason }));
  }

  // 2c. CORS preflight (keep as-is)
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 
      'Access-Control-Allow-Origin': 'http://127.0.0.1',
      'Access-Control-Allow-Methods': 'POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // ... rest of handler continues below
}
```

### 3. Update /health Endpoint

**Replace existing health check with:**

```javascript
// Hardened health check (no version/uptime info)
if (req.method === 'GET' && req.url === '/health') {
  const result = handleHealthCheck(req);
  res.writeHead(result.statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1'
  });
  return res.end(JSON.stringify(result.body));
}
```

### 4. Protect /admin/* Routes

**Before any admin endpoint handler, add:**

```javascript
// Protect /admin/* with IP whitelist
if (req.url.startsWith('/admin/') && req.method === 'GET') {
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
      clientIP: ipCheck.clientIP 
    }));
  }
}
```

### 5. Validate Webhook Signatures

**In `/webhooks/subagent-complete` POST handler, add signature validation:**

```javascript
if (req.method === 'POST' && req.url === '/webhooks/subagent-complete') {
  // JWT validation (keep existing)
  const auth = jwtMiddleware(req);
  if (auth.error) {
    res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: auth.errorMessage }));
  }

  // NEW: Signature validation (after JWT, before processing)
  let body = '';
  req.on('data', chunk => { 
    if (body.length + chunk.length > 1024 * 100) { // 100KB limit
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload too large' }));
      return;
    }
    body += chunk; 
  });

  req.on('end', () => {
    // Validate signature
    const sigCheck = validateWebhookSignature(req, body, {
      secret: process.env.WEBHOOK_HMAC_SECRET,
      clientIP: getClientIP(req),
      log: true
    });

    if (!sigCheck.valid) {
      console.warn(`[webhook] Signature validation failed: ${sigCheck.reason}`);
      res.writeHead(401, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1'
      });
      return res.end(JSON.stringify({ error: sigCheck.reason }));
    }

    // Signature valid, continue with webhook processing
    try {
      const payload = JSON.parse(body);
      // ... rest of webhook handler
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
  
  return; // Important: don't fall through
}
```

---

## Verification Tests

### Test 1: IP Whitelist
```bash
# Should PASS
curl -H "X-Forwarded-For: 192.168.1.100" http://localhost:3001/admin/users
# Response: 200 (or 401 for auth, but NOT 403)

# Should FAIL
curl -H "X-Forwarded-For: 203.0.113.50" http://localhost:3001/admin/users
# Response: 403 Forbidden
```

### Test 2: Webhook Signature
```bash
SECRET=$(grep WEBHOOK_HMAC_SECRET .env | cut -d= -f2 | tr -d '"')
PAYLOAD='{"taskId":"test-001","status":"ok"}'
SIG=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.*= /sha256=/')

# Should PASS
curl -X POST http://localhost:3001/webhooks/subagent-complete \
  -H "Authorization: Bearer <token>" \
  -H "X-Webhook-Signature: $SIG" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
# Response: 200 OK

# Should FAIL (wrong signature)
curl -X POST http://localhost:3001/webhooks/subagent-complete \
  -H "Authorization: Bearer <token>" \
  -H "X-Webhook-Signature: sha256=0000000000000000000000000000000000000000000000000000000000000000" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
# Response: 401 Unauthorized
```

### Test 3: Blocked Endpoints
```bash
# Should all return 403 or 404
curl http://localhost:3001/docs
curl http://localhost:3001/swagger
curl http://localhost:3001/debug
curl http://localhost:3001/api-docs
```

### Test 4: Security Headers
```bash
curl -i http://localhost:3001/health | grep -E "^X-|^Content-Security|^Cache-Control"

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 0
# Content-Security-Policy: default-src 'self'
# Referrer-Policy: strict-origin-when-cross-origin
# Permissions-Policy: camera=(), ...
# Cache-Control: no-store, no-cache, ...
```

### Test 5: Health Check (Hardened)
```bash
curl http://localhost:3001/health

# Should return:
# { "status": "ok", "timestamp": "2026-02-12T21:35:00.000Z" }

# Should NOT include:
# - "uptime"
# - "version"
# - "memory"
# - "pid"
# - "hostname"
```

---

## Troubleshooting

### "IP whitelist not configured"
- [ ] Set `ADMIN_ALLOWED_IPS` in `.env`
- [ ] Restart server: `launchctl unload ... && launchctl load ...`
- [ ] Check: `echo $ADMIN_ALLOWED_IPS`

### "Invalid signature format"
- [ ] Header must start with `sha256=`
- [ ] Length must be exactly 71 chars (7 for "sha256=" + 64 for hex)
- [ ] Payload must be exact (no extra whitespace)

### "Access denied" but IP is allowed
- [ ] Check exact CIDR format: `192.168.1.0/24` (not `192.168.1.*`)
- [ ] Check X-Forwarded-For header is being sent
- [ ] Review logs: `tail -f logs/ip-access.log`

### Headers not appearing
- [ ] Verify `addSecurityHeaders()` is called FIRST
- [ ] Check response type is `application/json`
- [ ] Verify res.setHeader() not overridden after

---

## Files Deployed

| File | Size | Purpose |
|------|------|---------|
| `/services/auth/ip-whitelist-middleware.js` | 8.6 KB | IP-based access control |
| `/services/auth/webhook-signature-validation.js` | 6.4 KB | HMAC-SHA256 validation |
| `/services/auth/security-headers.js` | 5.3 KB | Security header injection |
| `/services/auth/endpoint-restrictions.js` | 5.0 KB | Endpoint filtering |
| `/services/auth/hardened-health-check.js` | 4.5 KB | Minimal health endpoint |
| `/services/auth/test-firewall.js` | 10.1 KB | Comprehensive tests |
| `/docs/FIREWALL_RULES_DEPLOYMENT.md` | 14.2 KB | Full documentation |

**Total:** 53.9 KB

---

## Next Steps

1. **Immediate:**
   - [ ] Integrate security headers (Step 2a) — no breaking changes
   - [ ] Integrate endpoint restrictions (Step 2b) — no breaking changes
   - [ ] Test: `curl http://localhost:3001/health`

2. **For Admin Routes:**
   - [ ] Set `ADMIN_ALLOWED_IPS` env var
   - [ ] Integrate IP whitelist (Step 4)
   - [ ] Test: `curl -H "X-Forwarded-For: YOUR_IP" http://localhost:3001/admin/users`

3. **For Webhooks:**
   - [ ] Generate `WEBHOOK_HMAC_SECRET`
   - [ ] Integrate signature validation (Step 5)
   - [ ] Share secret with webhook senders (out-of-band)
   - [ ] Test with test script above

4. **Production:**
   - [ ] Enable HSTS: `hsts: true` in `addSecurityHeaders()`
   - [ ] Set `NODE_ENV=production`
   - [ ] Monitor logs: `tail -f logs/ip-access.log logs/webhook-signatures.log`
   - [ ] Set up log rotation

---

**Status:** ✅ Ready to integrate
**Estimated Integration Time:** 30 minutes
**Testing Time:** 15 minutes
**Total:** ~45 minutes
