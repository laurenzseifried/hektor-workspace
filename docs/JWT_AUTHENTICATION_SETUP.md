# JWT Authentication Setup — OpenClaw Deployment

**Version:** 1.0  
**Date:** 2026-02-12  
**Status:** Ready for Implementation  

---

## Quick Start (5 minutes)

### 1. Generate RSA Keys

```bash
cd /Users/laurenz/.openclaw/workspace

# Generate 2048-bit RSA key pair
node services/auth/generate-keys.js

# Output:
# ✅ RSA key pair generated successfully!
# 
# Environment Variables (add to .env):
# 
# OPENCLAW_JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
# OPENCLAW_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
```

### 2. Update `.env`

Copy the environment variables from the key generation output:

```bash
# .env (add these)

# RSA Keys for JWT signing
OPENCLAW_JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
OPENCLAW_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."

# Auth configuration
OPENCLAW_AUTH_MODE="jwt"
OPENCLAW_ACCESS_TOKEN_EXPIRY=900
OPENCLAW_REFRESH_TOKEN_EXPIRY=604800
OPENCLAW_JWT_ISSUER="openclaw-deployment"
OPENCLAW_JWT_AUDIENCE="openclaw-api"

# User credentials (for login endpoint)
OPENCLAW_ADMIN_USERNAME="admin"
OPENCLAW_ADMIN_PASSWORD="changeme"  # ⚠️ Change this!
```

### 3. Install Dependencies

```bash
npm install jsonwebtoken

# Or in workspace:
npm install --save jsonwebtoken
```

### 4. Update Webhook Server

```javascript
// services/subagent-webhook/server.js

import { jwtMiddleware } from '../auth/jwt-middleware.js';
import { handleLogin, handleRefresh } from '../auth/endpoints.js';
import { initializeTokenStore } from '../auth/index.js';

// Initialize token store on startup
initializeTokenStore();

// In handleWebhook function:

function handleWebhook(req, res) {
  // ... existing code ...

  // Add auth endpoints
  if (req.method === 'POST' && req.url === '/auth/login') {
    return handleAuthLogin(req, res);
  }
  
  if (req.method === 'POST' && req.url === '/auth/refresh') {
    return handleAuthRefresh(req, res);
  }

  // Apply JWT middleware to protected routes
  if (isProtectedRoute(req)) {
    const auth = jwtMiddleware(req);
    if (auth.error) {
      res.writeHead(auth.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: auth.errorMessage }));
    }
    req.auth = auth;
  }

  // ... rest of handler ...
}
```

### 5. Test Authentication

```bash
# 1. Login and get tokens
curl -X POST http://127.0.0.1:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "changeme"}'

# Response:
# {
#   "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expiresIn": 900,
#   "user": {"id": "admin-001", "role": "admin"}
# }

# 2. Use access token on protected route
curl -X POST http://127.0.0.1:3001/webhooks/subagent-complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"taskId": "task-001", "status": "ok"}'

# 3. Refresh token (after 15 minutes)
curl -X POST http://127.0.0.1:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."}'

# Response: New access + refresh tokens
```

---

## Detailed Implementation

### Architecture

```
┌─────────────────────────────────────────────────────┐
│ Client Application                                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ├── POST /auth/login
                     │   (username, password)
                     │
                     ├─► 200 OK
                     │   {accessToken, refreshToken}
                     │
                     ├── GET /protected
                     │   Authorization: Bearer ${accessToken}
                     │
                     └─► 200 OK (with req.auth populated)
                     
                     ├── POST /auth/refresh
                     │   {refreshToken}
                     │
                     └─► 200 OK
                         {new accessToken, new refreshToken}

Security Layers:
1. RS256 signature verification (asymmetric)
2. Token expiration validation
3. Issuer (iss) claim validation
4. Audience (aud) claim validation
5. Refresh token one-time use (rotation)
6. User account enabled check
7. Failed attempt logging
```

### File Structure

```
services/auth/
├── index.js                    # Main export (all modules)
├── generate-keys.js            # RSA key generation utility
├── jwt-middleware.js           # JWT validation middleware
├── token-generator.js          # Token creation (access + refresh)
├── token-store.js              # Token invalidation + rotation tracking
├── endpoints.js                # /auth/login, /auth/refresh, /auth/logout
└── .keys/
    ├── private.pem             # RSA private key (server-side only)
    └── public.pem              # RSA public key

services/subagent-webhook/
├── server.js                   # Updated with auth middleware
├── secrets-validator.js        # Secrets validation (unchanged)
└── client.js                   # Sub-agent client (add token support)
```

### JWT Token Structure

**Access Token (RS256, 15-minute expiry):**

```json
{
  "iss": "openclaw-deployment",
  "aud": "openclaw-api",
  "sub": "admin-001",
  "role": "admin",
  "permissions": ["*"],
  "iat": 1707750000,
  "exp": 1707750900,
  "jti": "a1b2c3d4e5f6..."
}
```

**Refresh Token (RS256, 7-day expiry, one-time use):**

```json
{
  "iss": "openclaw-deployment",
  "aud": "openclaw-refresh",
  "sub": "admin-001",
  "rotation": 0,
  "iat": 1707750000,
  "exp": 1707836400,
  "jti": "f1e2d3c4b5a6..."
}
```

### Endpoint Reference

#### POST /auth/login

**Request:**
```json
{
  "username": "admin",
  "password": "changeme"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900,
  "user": {
    "id": "admin-001",
    "role": "admin"
  }
}
```

**Errors:**
- 422: Missing username/password
- 401: Invalid credentials

---

#### POST /auth/refresh

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900
}
```

**Errors:**
- 422: Missing refresh token
- 401: Invalid/expired/rotated refresh token
- 403: User account disabled

---

#### POST /auth/logout

**Request:**
```json
{
  "userId": "admin-001"
}
```

**Response (200):**
```json
{
  "ok": true,
  "message": "Logged out successfully"
}
```

**Errors:**
- 422: Missing user ID

---

#### Protected Route (e.g., POST /webhooks/subagent-complete)

**Request:**
```
POST /webhooks/subagent-complete
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "taskId": "task-001",
  "status": "ok"
}
```

**Response (200):**
```json
{
  "ok": true,
  "file": "task-001.json"
}
```

**Errors:**
- 401: Missing/invalid/expired access token
- 404: Route not found

---

### Protected Routes

All routes are protected **except:**
- `GET /health` — No authentication required
- `GET /` — Default 404
- `POST /auth/login` — Authentication endpoint
- `POST /auth/refresh` — Refresh endpoint
- `OPTIONS *` — CORS preflight

**Protected routes require:**
```
Authorization: Bearer <valid JWT access token>
```

---

## Configuration

### Environment Variables

```bash
# RSA Keys (required)
OPENCLAW_JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
OPENCLAW_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."

# Auth Settings (optional, defaults shown)
OPENCLAW_AUTH_MODE="jwt"                              # Auth mode
OPENCLAW_ACCESS_TOKEN_EXPIRY=900                      # 15 minutes
OPENCLAW_REFRESH_TOKEN_EXPIRY=604800                  # 7 days
OPENCLAW_JWT_ISSUER="openclaw-deployment"             # Issuer claim
OPENCLAW_JWT_AUDIENCE="openclaw-api"                  # Audience claim

# User Credentials (change in production!)
OPENCLAW_ADMIN_USERNAME="admin"
OPENCLAW_ADMIN_PASSWORD="changeme"

# Token Store (optional)
TOKEN_STORE_FILE="/path/to/.token-store.json"         # Persistence file
```

### Token Expiry Times

- **Access Token:** 15 minutes (900 seconds)
  - Short-lived, safer if leaked
  - User refreshes before expiry

- **Refresh Token:** 7 days (604800 seconds)
  - Longer-lived, stored securely on client
  - One-time use (rotated on every refresh)

### User Roles

```javascript
// In endpoints.js
const users = {
  admin: {
    role: 'admin',
    permissions: ['*'],  // All permissions
  },
  operator: {
    role: 'operator',
    permissions: ['tasks:read', 'tasks:write', 'webhooks:read'],
  },
  viewer: {
    role: 'viewer',
    permissions: ['tasks:read', 'webhooks:read'],
  },
};
```

---

## Security Considerations

### ✅ Best Practices Implemented

1. **RS256 (Asymmetric Signing)**
   - Private key signs tokens (server-side only)
   - Public key verifies tokens (can be shared)
   - Better than HS256 (symmetric, same key for sign/verify)

2. **Token Expiration**
   - Short-lived access tokens (15 min)
   - Longer-lived refresh tokens (7 days)
   - Automatic expiration validation

3. **Refresh Token Rotation**
   - One-time use enforcement
   - Old token invalidated immediately
   - Prevents token theft/replay attacks

4. **No Sensitive Data in Tokens**
   - Email, password, etc. NOT included
   - Only user ID, role, permissions included
   - JTI (token ID) for tracking/invalidation

5. **Failed Attempt Logging**
   - IP address, timestamp, reason recorded
   - Helps detect brute force / token theft attempts

6. **Claim Validation**
   - Issuer (iss) verified
   - Audience (aud) verified
   - Prevents token misuse across systems

7. **User Account Disabled Check**
   - Refresh endpoint validates user is still active
   - Immediate token revocation on account disable

### ⚠️ Future Improvements (Production)

- [ ] Use bcrypt for password hashing (don't store plaintext)
- [ ] Implement rate limiting on /auth/login (brute force protection)
- [ ] Move user database to real DB (not in-memory)
- [ ] Use Redis for token store (distributed systems)
- [ ] Add 2FA (two-factor authentication)
- [ ] Implement token signing certificates with rotation
- [ ] Add audit logging (syslog / ELK stack)
- [ ] Implement JTI blacklist cleanup (prevent unbounded growth)
- [ ] Add refresh token revocation on password change

---

## Testing

### Unit Tests

```javascript
// test/jwt-middleware.test.js

import { jwtMiddleware, validateJWT } from '../services/auth/jwt-middleware.js';

describe('JWT Middleware', () => {
  test('Valid token → 200', () => {
    const req = { 
      headers: { authorization: `Bearer ${validToken}` }
    };
    const result = jwtMiddleware(req);
    expect(result.error).toBe(false);
    expect(result.userId).toBe('admin-001');
  });

  test('Missing header → 401', () => {
    const req = { headers: {} };
    const result = jwtMiddleware(req);
    expect(result.error).toBe(true);
    expect(result.statusCode).toBe(401);
  });

  test('Invalid signature → 401', () => {
    const req = { 
      headers: { authorization: `Bearer ${invalidToken}` }
    };
    const result = jwtMiddleware(req);
    expect(result.error).toBe(true);
    expect(result.statusCode).toBe(401);
  });

  test('Expired token → 401', () => {
    const req = { 
      headers: { authorization: `Bearer ${expiredToken}` }
    };
    const result = jwtMiddleware(req);
    expect(result.error).toBe(true);
    expect(result.statusCode).toBe(401);
  });
});
```

### Integration Tests

```bash
# Test full flow
./test/integration/auth-flow.sh

# Expected output:
# [1/5] Login as admin... ✅
# [2/5] Access protected route... ✅
# [3/5] Wait 15 minutes (simulate)... ⏳
# [4/5] Refresh token... ✅
# [5/5] Access protected route with new token... ✅
```

### Security Tests

```bash
# Test unauthorized access
curl -X POST http://127.0.0.1:3001/webhooks/subagent-complete

# Expected: 401 Unauthorized

# Test invalid token
curl -X POST http://127.0.0.1:3001/webhooks/subagent-complete \
  -H "Authorization: Bearer invalid"

# Expected: 401 Unauthorized

# Test rotated token reuse
# (use old refresh token twice)

# Expected: 401 + all user tokens revoked
```

---

## Troubleshooting

### Issue: "OPENCLAW_JWT_PRIVATE_KEY not set"

**Solution:** Ensure keys are generated and added to `.env`:
```bash
node services/auth/generate-keys.js
# Copy output to .env
```

### Issue: "Token verification failed"

**Causes:**
1. Wrong public key in `OPENCLAW_JWT_PUBLIC_KEY`
2. Token signed with different private key
3. Token modified/corrupted

**Solution:**
```bash
# Regenerate keys with --force
node services/auth/generate-keys.js --force

# Update .env
# Restart webhook service
```

### Issue: "Refresh token rejected as rotated"

**This is expected security behavior!**

Refresh tokens are one-time use. If you try to use the same refresh token twice:
- First use: ✅ Accepted, returns new tokens
- Second use: ❌ Rejected (marked as rotated)
- Side effect: All user's tokens are revoked (potential theft detection)

**Solution:** Always use the new refresh token from the response.

### Issue: "User disabled" on refresh

**Cause:** User account was disabled after initial login.

**Solution:** User needs to login again with different credentials or administrator re-enables account.

---

## Deployment Checklist

- [ ] Generate RSA keys: `node services/auth/generate-keys.js`
- [ ] Update `.env` with keys + credentials
- [ ] Install dependencies: `npm install jsonwebtoken`
- [ ] Update webhook server to use middleware + endpoints
- [ ] Update token store `.gitignore` (don't commit persistent data)
- [ ] Test login endpoint: `curl -X POST /auth/login ...`
- [ ] Test protected route: `curl -X POST /webhooks/subagent-complete -H "Authorization: Bearer ..."`
- [ ] Test token refresh: `curl -X POST /auth/refresh ...`
- [ ] Test token expiration (wait or use backdated expiry for testing)
- [ ] Monitor failed auth attempts: Check logs for suspicious patterns
- [ ] Document admin password change procedure for team
- [ ] Set up automated key rotation reminder (90 days)

---

## Production Migration

### Phase 1: JWT + Bearer Token (Compatibility Mode)

```javascript
// Accept both JWT and Bearer token
const token = extractToken(authHeader);
const isJWT = token.includes('.');
const isBearer = token.length === 64; // Old bearer token

if (isJWT) {
  // Validate as JWT
  const auth = validateJWT(token);
} else if (isBearer) {
  // Validate as Bearer token (legacy)
  const auth = validateBearerToken(token);
}
```

### Phase 2: JWT Preferred (Deprecation Warning)

```javascript
if (isBearer) {
  console.warn('Bearer token auth deprecated. Use JWT instead.');
}
```

### Phase 3: JWT Only

Remove all Bearer token support after sufficient notice period.

---

## References

- JWT (RFC 7519): https://tools.ietf.org/html/rfc7519
- RS256 Signature: https://tools.ietf.org/html/rfc7518#section-3.1
- jsonwebtoken npm: https://github.com/auth0/node-jsonwebtoken
- Security Best Practices: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html

