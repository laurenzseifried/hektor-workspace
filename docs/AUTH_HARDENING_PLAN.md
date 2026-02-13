# Authentication Hardening Implementation — OpenClaw Deployment

**Date:** 2026-02-12  
**Requestor:** Ciphershell  
**Status:** In Progress

---

## 1. API Route Audit

### Current Routes — Webhook Service (Port 3001)

| Route | Method | Current Auth | Protected | Notes |
|-------|--------|------|----------|-------|
| `/health` | GET | None | ❌ | Health check (no auth required) |
| `/webhooks/subagent-complete` | POST | Bearer Token | ✅ | Sub-agent task completion |
| `/` (404) | GET | None | ❌ | Default 404 |
| `OPTIONS *` | OPTIONS | CORS | ⚠️ | CORS preflight (no auth needed) |

**Current Status:** Webhook has Bearer token auth ✅ but NO JWT token refresh/expiration management.

### Gateway Service (Port 18789)

| Route | Method | Current Auth | Protected | Notes |
|-------|--------|------|----------|-------|
| `/ (root)` | GET | Token | ✅ | Gateway status (requires Bearer token) |
| `/api/*` | GET/POST | Token | ✅ | API routes (require Bearer token) |
| `/health` | GET | None | ❌ | Health check (no auth required) |

**Current Status:** Gateway uses shared Bearer token auth (symmetric) ✅ but NO JWT/refresh token support.

---

## 2. Proposed Auth Architecture

### JWT-Based Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENT                                                      │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      ├──── POST /auth/login ──────────────────────┐
                      │     (username/password)                    │
                      │                                             │
                      │<─ {accessToken, refreshToken} ◄────────────┤
                      │     (JWT, RS256 signed)                   │
                      │                                             │
                      ├──── GET /protected ──────────────────────┐ │
                      │     Authorization: Bearer ${accessToken} │ │
                      │                                          │ │
                      │<─ 200 OK ◄───────────────────────────────┤ │
                      │                                          │ │
                      │ (15 min later, token expires)           │ │
                      │                                          │ │
                      ├──── POST /auth/refresh ───────────────┐ │ │
                      │     {refreshToken}                     │ │ │
                      │                                        │ │ │
                      │<─ {accessToken, refreshToken} ◄────────┤ │ │
                      │     (new JWT, rotated refresh token)   │ │ │
                      └────────────────────────────────────────┘ │ │
                                                                 └─┘

RSA Keys:
- Private Key: Used for signing tokens (server-side)
- Public Key: Used for verification (server-side during request validation)
  Could be exposed to other services via JWKS endpoint
```

### Token Structure (RS256)

**Access Token (JWT):**
```json
{
  "iss": "openclaw-deployment",
  "aud": "openclaw-api",
  "sub": "user-id",
  "role": "admin|operator|viewer",
  "permissions": ["tasks:read", "tasks:write", ...],
  "iat": 1707750000,
  "exp": 1707750900,
  "jti": "unique-token-id"
}
```

**Refresh Token (JWT):**
```json
{
  "iss": "openclaw-deployment",
  "aud": "openclaw-refresh",
  "sub": "user-id",
  "iat": 1707750000,
  "exp": 1707836400,
  "jti": "unique-token-id",
  "rotation": 0
}
```

### Key Features

✅ RS256 (asymmetric) for better key separation  
✅ 15-minute access token expiry  
✅ 7-day refresh token expiry  
✅ Refresh token rotation (one-time use)  
✅ No sensitive data (email, name) in tokens  
✅ User role + permissions for authorization  
✅ Failed auth attempt logging (IP, timestamp, reason)  
✅ Token expiration validation  
✅ Issuer (iss) + Audience (aud) validation  

---

## 3. Implementation Components

### 3.1 RSA Key Generation

**File:** `services/auth/generate-keys.js`

- Generate 2048-bit RSA key pair if not present
- Store private key in `OPENCLAW_JWT_PRIVATE_KEY` (env var)
- Store public key in `OPENCLAW_JWT_PUBLIC_KEY` (env var)
- Output keys to `.auth/` directory with 600 permissions

### 3.2 JWT Middleware

**File:** `services/auth/jwt-middleware.js`

```javascript
// Exported function:
function jwtMiddleware(req, res, next)

// Steps:
1. Extract Authorization header
2. Validate format (Bearer <token>)
3. Verify JWT signature using public key
4. Check token expiration
5. Validate issuer (iss)
6. Validate audience (aud)
7. Extract user ID + role + permissions
8. Attach decoded token to req.auth
9. Log failed attempts (IP, reason, timestamp)
10. Return 401 on failure (no detailed error info)
```

### 3.3 Login Endpoint

**File:** `services/auth/login.js`

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "secret"
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

**Errors (401):**
```json
{
  "error": "invalid_credentials"
}
```

**Implementation:**
- Simple username/password validation (hardcoded for now, can be extended to DB)
- Generate access token (15 min expiry)
- Generate refresh token (7 day expiry, rotationCount = 0)
- Store refresh token in-memory cache (invalidation on rotation)
- Log successful login

### 3.4 Refresh Token Endpoint

**File:** `services/auth/refresh.js`

**Endpoint:** `POST /auth/refresh`

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
- 401: Invalid/expired/rotated refresh token
- 403: User account disabled
- 422: Missing refresh token

**Implementation:**
- Validate refresh token signature + expiration
- Check token hasn't been rotated (jti not in rotation blacklist)
- Verify user account is active
- Issue new access token (15 min expiry)
- Issue new refresh token (7 day expiry, rotationCount + 1)
- Invalidate old refresh token (add jti to blacklist)
- Log token rotation

### 3.5 Auth Middleware (Route Protection)

**File:** `services/auth/apply-middleware.js`

```javascript
// Applies JWT middleware to all routes except:
// - GET /health
// - GET /
// - POST /auth/login
// - POST /auth/refresh
// - OPTIONS * (CORS preflight)

// All other routes require valid JWT in Authorization header
```

### 3.6 Secrets + Environment Variables

**New .env entries:**

```bash
# RSA Keys for JWT signing
OPENCLAW_JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
OPENCLAW_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."

# Auth configuration
OPENCLAW_AUTH_MODE="jwt"  # or "bearer" for backward compat
OPENCLAW_ACCESS_TOKEN_EXPIRY=900  # 15 minutes in seconds
OPENCLAW_REFRESH_TOKEN_EXPIRY=604800  # 7 days in seconds
OPENCLAW_JWT_ISSUER="openclaw-deployment"
OPENCLAW_JWT_AUDIENCE="openclaw-api"

# User credentials (for login endpoint)
OPENCLAW_ADMIN_USERNAME="admin"
OPENCLAW_ADMIN_PASSWORD="changeme"  # Should be rotated!
```

---

## 4. Implementation Files to Create

| File | Size | Purpose |
|------|------|---------|
| `services/auth/generate-keys.js` | ~200 lines | RSA key generation |
| `services/auth/jwt-middleware.js` | ~300 lines | JWT validation + logging |
| `services/auth/login.js` | ~100 lines | Login endpoint |
| `services/auth/refresh.js` | ~150 lines | Refresh token endpoint |
| `services/auth/token-store.js` | ~100 lines | In-memory token invalidation |
| `services/auth/index.js` | ~50 lines | Export all auth functions |
| `services/auth/types.js` | ~50 lines | TypeScript definitions (optional) |
| `docs/JWT_IMPLEMENTATION.md` | ~300 lines | Implementation guide |
| `.github/workflows/auth-test.yml` | ~150 lines | CI/CD auth tests |

---

## 5. Testing Strategy

### Unit Tests

- [ ] RSA key generation (file creation, permissions, format)
- [ ] JWT signing + verification
- [ ] Token expiration validation
- [ ] Issuer/audience validation
- [ ] Refresh token rotation (old token invalidated)
- [ ] Login endpoint (valid/invalid credentials)
- [ ] Failed auth logging

### Integration Tests

- [ ] Full auth flow: login → protected request → token expiry → refresh → new protected request
- [ ] Unauthenticated request to protected route → 401
- [ ] Expired token → 401
- [ ] Invalid signature → 401
- [ ] Refresh with rotated token → 401
- [ ] Health endpoint without auth → 200

### Security Tests

- [ ] Token doesn't contain email/name
- [ ] Refresh token is one-time use
- [ ] Failed login attempt logged with IP
- [ ] No detailed error info on 401 response
- [ ] RSA private key not exposed in responses

---

## 6. Implementation Order

1. **Phase 1:** RSA key generation + storage
2. **Phase 2:** JWT middleware + token validation
3. **Phase 3:** Login endpoint
4. **Phase 4:** Refresh token endpoint + rotation logic
5. **Phase 5:** Apply middleware to webhook routes
6. **Phase 6:** Testing + documentation
7. **Phase 7:** Deploy + monitor

---

## 7. Backward Compatibility

**Current Bearer Token (symmetric):**
- Old clients still work during transition period
- Can run both JWT + Bearer token validation in middleware
- Eventually deprecate Bearer token (flag in config)

**Migration Path:**
```
Phase 1: JWT + Bearer token both valid
Phase 2: JWT preferred, Bearer deprecated (warning logs)
Phase 3: Bearer token only valid with X-Legacy-Auth header
Phase 4: Bearer token removed (all requests must use JWT)
```

---

## Next Steps

1. Generate RSA key pair
2. Implement JWT middleware
3. Add login + refresh endpoints
4. Update webhook server to use middleware
5. Test full flow
6. Document for team

