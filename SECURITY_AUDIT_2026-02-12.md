# OpenClaw Security Audit Report
**Date:** 2026-02-12  
**Scope:** Hektor/Scout deployment  
**Audit Type:** Full deployment scan — codebase, credentials, endpoints, misconfigurations

---

## Executive Summary

**Overall Risk Level: 🔴 HIGH**

The deployment has **5 critical findings** and **3 high-priority findings** primarily related to **secret storage and API exposure**. The core architecture (loopback-only gateway, file permissions on sensitive config) is sound, but secrets management practices create immediate risk.

**Immediate Actions Required:**
1. Rotate all API keys and bot tokens immediately
2. Move secrets to environment variables (not plaintext config)
3. Add authentication to webhook server
4. Fix CORS configuration
5. Implement rate limiting on webhook

---

## 1. CRITICAL FINDINGS (Fix Immediately)

### 🚨 C1: Plaintext API Keys in .env File

**Location:** `/Users/laurenz/.openclaw/.env`  
**Severity:** CRITICAL  
**Status:** ❌ VULNERABLE

**What:** The .env file contains unencrypted API keys and bot tokens:
- `GOOGLE_API_KEY=***REDACTED***`
- `BRAVE_API_KEY=***REDACTED***`
- `GITHUB_TOKEN=***REDACTED***`
- `GROQ_API_KEY=***REDACTED***`
- `HEKTOR_BOT_TOKEN=***REDACTED***` (Telegram)
- `SCOUT_BOT_TOKEN=***REDACTED***` (Telegram)
- `OPENCLAW_TOKEN=***REDACTED***`

**Risk:** If .env is committed to Git, exposed in backups, or accessed by unauthorized users, all services are compromised.

**File Permissions:** `-rw-------` (owner read/write only) ✅ GOOD  
**But:** Content is still plaintext and visible to anyone with shell access to the machine.

**Mitigation:**
- [ ] Rotate **all** API keys and tokens immediately
- [ ] Move secrets to **secure credential manager** (e.g., 1Password, HashiCorp Vault, AWS Secrets Manager)
- [ ] Store **only** the credential manager URL/reference in .env
- [ ] Add `.env` to `.gitignore` (prevent accidental commits)
- [ ] Audit Git history for any past commits containing secrets

---

### 🚨 C2: Telegram Bot Tokens in Plaintext Config

**Location:** `/Users/laurenz/.openclaw/openclaw.json`  
**Severity:** CRITICAL  
**Status:** ❌ VULNERABLE

**What:** Telegram bot tokens exposed in main config file:
```json
{
  "telegram": {
    "accounts": {
      "hektor": { "botToken": "***REDACTED***" },
      "scout": { "botToken": "***REDACTED***" }
    }
  }
}
```

**Risk:** Config files are often backed up, synced, or shared. Bot tokens allow:
- Sending messages as the bot
- Reading group/channel data
- Potential spam/abuse

**File Permissions:** `-rw-------` (owner only) ✅ GOOD  
**But:** Plaintext in config file is still a risk.

**Mitigation:**
- [ ] Rotate both Telegram bot tokens immediately
- [ ] Move `botToken` values to environment variables (reference via `$HEKTOR_BOT_TOKEN`, etc.)
- [ ] Update config to use `botToken: "${HEKTOR_BOT_TOKEN}"` or `botTokenRef: "env:HEKTOR_BOT_TOKEN"`
- [ ] Audit recent Telegram message logs for unauthorized activity

---

### 🚨 C3: Webhook Server CORS Set to Wildcard (*)

**Location:** `/Users/laurenz/.openclaw/workspace/services/subagent-webhook/server.js` (line ~55)  
**Severity:** CRITICAL  
**Status:** ❌ VULNERABLE

**What:**
```javascript
res.writeHead(204, { 'Access-Control-Allow-Origin': '*', ... });
```

**Risk:** 
- Allows any website/origin to make requests to the webhook
- Cross-site request forgery (CSRF) possible if webhook is network-accessible
- Bypasses browser same-origin policy

**Attack Scenario:**
1. Attacker hosts malicious website
2. Website makes cross-origin POST to `http://127.0.0.1:3001/webhooks/subagent-complete`
3. If webhook is exposed beyond localhost, attacker can inject false task results

**Mitigation:**
- [ ] Change CORS header from `'*'` to specific origin (e.g., `'http://127.0.0.1'`)
- [ ] OR: Remove CORS entirely (server is localhost-only anyway)
- [ ] Recommended: `'Access-Control-Allow-Origin': 'http://127.0.0.1'`

---

### 🚨 C4: Webhook Endpoint Has No Authentication

**Location:** `/Users/laurenz/.openclaw/workspace/services/subagent-webhook/server.js`  
**Severity:** CRITICAL  
**Status:** ❌ VULNERABLE

**What:** The `/webhooks/subagent-complete` endpoint accepts POST requests with **no authentication check**:

```javascript
if (req.method !== 'POST' || req.url !== '/webhooks/subagent-complete') {
  // ... handle request
}
// No auth header validation
```

**Risk:**
- Any process with network access to localhost:3001 can inject fake task results
- Can modify sub-agent output, bypass approvals
- If ever exposed beyond localhost, becomes publicly injectable

**Mitigation:**
- [ ] Add authentication header validation
- [ ] Validate `Authorization: Bearer <token>` header (use strong random token)
- [ ] Store token in environment variable, not code
- [ ] Return 401 if token missing or invalid

**Recommended Fix:**
```javascript
const WH_TOKEN = process.env.WH_TOKEN; // redacted
if (!WH_TOKEN || req.headers.authorization !== `Bearer ${WH_TOKEN}`) {
  res.writeHead(401);
  return res.end('Unauthorized');
}
```

---

### 🚨 C5: Gateway Auth Token in Plaintext Config

**Location:** `/Users/laurenz/.openclaw/openclaw.json`  
**Severity:** CRITICAL  
**Status:** ⚠️ PARTIAL RISK

**What:**
```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "***REDACTED***"
    }
  }
}
```

**Risk:**
- Token grants full access to OpenClaw gateway
- If config is backed up or synced to insecure location, token is compromised
- No expiration date on token

**Mitigation:**
- [ ] Move gateway token to environment variable: `OPENCLAW_GATEWAY_TOKEN`
- [ ] Update config to reference: `"token": "${OPENCLAW_GATEWAY_TOKEN}"`
- [ ] Rotate current token
- [ ] Implement token expiration/rotation policy (e.g., 90-day rotation)

---

## 2. HIGH PRIORITY FINDINGS (Fix Within 24 Hours)

### ⚠️ H1: Webhook Has No Rate Limiting

**Location:** `/Users/laurenz/.openclaw/workspace/services/subagent-webhook/server.js`  
**Severity:** HIGH  
**Status:** ❌ VULNERABLE

**Risk:**
- Attackers can flood webhook with requests → DoS
- Results directory fills with spam files
- Legitimate sub-agent results get lost in noise

**Impact:** Moderate (localhost-only, but escalates if exposed)

**Mitigation:**
- [ ] Implement per-IP rate limiting (e.g., 100 req/min)
- [ ] Add request timeout
- [ ] Implement max file size check on incoming JSON
- [ ] Add request count metrics/logging

**Recommended Implementation:**
```javascript
const rateLimits = {}; // IP -> request count
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  if (!rateLimits[ip]) rateLimits[ip] = { count: 0, resetAt: Date.now() + RATE_WINDOW };
  if (Date.now() > rateLimits[ip].resetAt) {
    rateLimits[ip] = { count: 0, resetAt: Date.now() + RATE_WINDOW };
  }
  if (rateLimits[ip].count++ > RATE_LIMIT) return false;
  return true;
}
```

---

### ⚠️ H2: Webhook taskId Not Validated (Path Traversal Risk)

**Location:** `/Users/laurenz/.openclaw/workspace/services/subagent-webhook/server.js` (line ~90)  
**Severity:** HIGH  
**Status:** ⚠️ POTENTIAL RISK

**What:**
```javascript
const filename = `${payload.taskId}.json`;
const filepath = path.join(RESULTS_DIR, filename);
```

**Risk:** If `taskId` contains `../`, attacker can write files outside `RESULTS_DIR`:

```
POST /webhooks/subagent-complete
{ "taskId": "../../etc/passwd", "status": "ok" }
// Writes to: ../../etc/passwd.json
```

**Mitigation:**
- [ ] Validate taskId is alphanumeric + hyphens/underscores only
- [ ] Use `path.basename()` to strip any path traversal characters
- [ ] Add `taskId` format validation

**Recommended Fix:**
```javascript
const validTaskId = /^[a-zA-Z0-9_-]+$/.test(payload.taskId);
if (!validTaskId) {
  res.writeHead(400);
  return res.end(JSON.stringify({ error: 'Invalid taskId format' }));
}
```

---

### ⚠️ H3: No Secrets Rotation Policy

**Location:** N/A (operational finding)  
**Severity:** HIGH  
**Status:** ❌ NO POLICY

**What:** There is no documented or automated secrets rotation schedule.

**Risk:**
- Compromised keys can be used indefinitely
- No audit trail of who has access to old credentials
- Violates security best practices (CIS, SOC2, ISO27001)

**Mitigation:**
- [ ] Document secrets rotation policy (e.g., every 90 days)
- [ ] Create calendar reminders for manual rotation
- [ ] Implement automated rotation for API keys that support it (GitHub, Groq, etc.)
- [ ] Log all rotations with timestamps and who performed them

**Secrets Requiring Rotation:**
| Secret | Service | Current Status | Rotation Recommended |
|--------|---------|----------------|----------------------|
| GOOGLE_API_KEY | Google APIs | Active | Every 90 days |
| BRAVE_API_KEY | Brave Search | Active | Every 90 days |
| GITHUB_TOKEN | GitHub | Active | Every 90 days |
| GROQ_API_KEY | Groq Whisper | Active | Every 90 days |
| OPENCLAW_TOKEN | OpenClaw Gateway | Active | Every 30-60 days |
| HEKTOR_BOT_TOKEN | Telegram | Active | Every 180 days |
| SCOUT_BOT_TOKEN | Telegram | Active | Every 180 days |

---

## 3. MEDIUM PRIORITY FINDINGS (Fix Within 1 Week)

### 📌 M1: Telegram Group ID Visible in Config

**Location:** `/Users/laurenz/.openclaw/openclaw.json`  
**Severity:** MEDIUM  
**Status:** ⚠️ MINOR RISK

**What:** Group ID `-1003808534190` is hardcoded in config.

**Risk:** If config is exposed, attacker knows the exact Telegram group. Low risk alone, but combined with bot token compromise = immediate bot hijacking.

**Mitigation:**
- [ ] Move group ID to environment variable
- [ ] Reference: `"target": "${TELEGRAM_GROUP}"`

---

### 📌 M2: Browser Control Enabled in Config

**Location:** `/Users/laurenz/.openclaw/openclaw.json`  
**Severity:** MEDIUM  
**Status:** ⚠️ MINOR RISK

**What:**
```json
{
  "browser": {
    "enabled": true,
    "defaultProfile": "hektor"
  }
}
```

**Risk:** Browser control allows agents to:
- Screenshot your screen
- Capture input/clicks
- Interact with websites
- Potential for credential harvesting if misconfigured

**Mitigation:**
- [ ] Verify browser control is intentional and needed
- [ ] Consider disabling if not actively used
- [ ] Add browser command audit logging

---

### 📌 M3: Telegram User ID Whitelist Not Encrypted

**Location:** `/Users/laurenz/.openclaw/openclaw.json`  
**Severity:** MEDIUM  
**Status:** ⚠️ MINOR RISK

**What:**
```json
{
  "26": {
    "allowFrom": ["8226296598"]  // Your Telegram user ID is visible
  }
}
```

**Risk:** Your Telegram user ID is exposed. Combined with bot token compromise, attacker can impersonate you.

**Mitigation:**
- [ ] No immediate action needed (low priority alone)
- [ ] But combined with bot token rotation, this becomes moot

---

## 4. LOW PRIORITY FINDINGS (Fix in Next Maintenance Cycle)

### ℹ️ L1: No Secrets Backup/Recovery Plan

**Finding:** If .env or openclaw.json is deleted/corrupted, there's no recovery mechanism documented.

**Mitigation:**
- [ ] Document backup strategy (e.g., "secrets stored in 1Password, encrypted backups in S3")
- [ ] Test backup/restore process quarterly

---

### ℹ️ L2: No Audit Logging for Gateway Access

**Finding:** Gateway token usage is not logged. Can't detect who accessed what resources.

**Mitigation:**
- [ ] Enable gateway request logging with timestamp/token hash
- [ ] Review logs monthly for suspicious activity

---

## Environment Variables Summary

| Variable | Service | Current Status | Stored In | Has Expiration |
|----------|---------|----------------|-----------|---|
| GOOGLE_API_KEY | Google APIs | ✅ Present | .env (plaintext) | ❌ NO |
| BRAVE_API_KEY | Brave Search | ✅ Present | .env (plaintext) | ❌ NO |
| GITHUB_TOKEN | GitHub | ✅ Present | .env (plaintext) | ❌ NO |
| GROQ_API_KEY | Groq Whisper | ✅ Present | .env (plaintext) | ❌ NO |
| OPENCLAW_TOKEN | OpenClaw Gateway | ✅ Present | openclaw.json (plaintext) | ❌ NO |
| HEKTOR_BOT_TOKEN | Telegram Bot | ✅ Present | openclaw.json (plaintext) | ❌ NO |
| SCOUT_BOT_TOKEN | Telegram Bot | ✅ Present | openclaw.json (plaintext) | ❌ NO |
| OLLAMA_KEEP_ALIVE | Ollama | ✅ Present | .env (plaintext) | ✅ N/A |
| OLLAMA_API_KEY | Ollama | ✅ Present | .env (plaintext) | ✅ N/A (local) |

---

## API Endpoints Inventory

### 1. OpenClaw Gateway (Port 18789)

| Endpoint | Method | Auth Required | Rate Limiting | Notes |
|----------|--------|---------------|--------------|-------|
| `/` | GET | Bearer token | NO | Control UI (requires auth in practice) |
| `/api/*` | GET/POST | Bearer token | NO | OpenClaw API endpoints |
| `/health` | GET | NO | NO | Returns HTML UI (not JSON) |

**Binding:** `127.0.0.1:18789` (loopback only) ✅ GOOD  
**Auth Mode:** Token-based ✅ GOOD  
**Default Creds:** None ✅ GOOD

---

### 2. Sub-Agent Webhook (Port 3001)

| Endpoint | Method | Auth Required | Rate Limiting | CORS | Notes |
|----------|--------|---------------|--------------|------|-------|
| `/webhooks/subagent-complete` | POST | ❌ NO | ❌ NO | `*` | Critical vulnerabilities |
| `/health` | GET | ❌ NO | ❌ NO | `*` | Health check (public) |

**Binding:** `127.0.0.1:3001` (loopback only) ✅ GOOD  
**Auth:** None ❌ CRITICAL  
**CORS:** Wildcard `*` ❌ CRITICAL

---

## Recommendations Priority Matrix

| Priority | Count | Examples |
|----------|-------|----------|
| 🔴 CRITICAL | 5 | Rotate all secrets, add webhook auth, fix CORS |
| 🟠 HIGH | 3 | Rate limiting, path validation, rotation policy |
| 🟡 MEDIUM | 3 | Env vars for sensitive config, browser controls |
| 🔵 LOW | 2 | Logging, backup recovery documentation |

---

## Immediate Action Checklist (Next 2 Hours)

- [ ] **Rotate ALL API keys and tokens immediately**
  - Google API Key
  - Brave API Key
  - GitHub Token
  - Groq API Key
  - Both Telegram bot tokens
  - OpenClaw gateway token

- [ ] **Update `.env` format** (if rotation service doesn't auto-move to env vars)
  ```bash
  # Should NOT be in plaintext file
  # Instead, move to secure credential manager
  ```

- [ ] **Update `openclaw.json`** to use environment variable references
  ```json
  "botToken": "${HEKTOR_BOT_TOKEN}"
  ```

- [ ] **Fix webhook CORS**
  ```javascript
  'Access-Control-Allow-Origin': 'http://127.0.0.1'
  ```

- [ ] **Add webhook authentication**
  ```javascript
  if (req.headers.authorization !== `Bearer ${process.env.WH_TOKEN}`) {
    return res.end('Unauthorized');
  }
  ```

---

## Audit Metadata

- **Audit Date:** 2026-02-12
- **Audit Type:** Full deployment security scan
- **Auditor:** Hektor (automated)
- **Deployment:** Local macOS (Mac mini)
- **Scope:** Gateway, webhook services, config files, credentials
- **Next Audit:** Recommend in 30 days after fixes

---

**Report Status:** ✅ COMPLETE  
**Findings Severity:** 🔴 HIGH (5 critical, 3 high-priority)  
**Risk Level:** ACTION REQUIRED IMMEDIATELY
