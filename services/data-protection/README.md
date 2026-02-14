# Data Protection & Encryption

Utilities for encrypting sensitive data, detecting PII, and enforcing retention policies.

## Quick Start

```bash
# Generate encryption key (ONCE)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add to .env: ENCRYPTION_KEY=<generated-key>

# Run data audit
node audit.js

# Test encryption
node -e "import('./encryption.js').then(e => console.log(e.encrypt('test')))"
```

## Modules

### 1. Encryption (`encryption.js`)

```javascript
import { encrypt, decrypt, hashPassword, verifyPassword } from './encryption.js';

// Encrypt sensitive data
const encrypted = encrypt('my-api-key');
const decrypted = decrypt(encrypted);

// Hash passwords
const hash = hashPassword('password123');
const valid = verifyPassword('password123', hash);
```

**Requirements:**
- Set `ENCRYPTION_KEY` in `.env` (64-char hex)
- Generate with: `openssl rand -hex 32`

### 2. PII Detection (`pii-detector.js`)

```javascript
import { detectPII, redactPII, containsSensitivePII } from './pii-detector.js';

const text = "My SSN is 123-45-6789";
const findings = detectPII(text);  // [{type: 'ssn', count: 1, samples: [...]}]
const redacted = redactPII(text);   // "My SSN is [REDACTED_SSN]"
const hasPII = containsSensitivePII(text);  // true
```

**Detects:**
- SSN: `\d{3}-\d{2}-\d{4}`
- Credit cards: 16 digits (with/without separators)
- Emails, phone numbers, IP addresses

### 3. Data Retention (`retention.js`)

```javascript
import { runRetentionPolicies, purgeOldLogs } from './retention.js';

// Run all policies
await runRetentionPolicies();

// Purge specific log directory
await purgeOldLogs('/path/to/logs', 30); // 30 days
```

**Policies:**
- Prompts/responses: 7 days
- Sessions: 1 day (expired only)
- Analytics: 90 days (then anonymize)
- General logs: 30 days
- Security logs: 365 days

### 4. Data Audit (`audit.js`)

```bash
node audit.js
```

Scans workspace for:
- Log files (`.log`, `.jsonl`)
- Session data
- Incident records
- Quarantine data

## Encrypted Database Connections

**PostgreSQL:**
```
postgresql://user:pass@host:5432/db?sslmode=require
```

**Redis:**
```
rediss://localhost:6379  # Note: double 's' = SSL
```

**Environment:**
```bash
DATABASE_URL="postgresql://...?sslmode=require"
REDIS_URL="rediss://localhost:6379"
REDIS_TLS_REJECT_UNAUTHORIZED=1  # Production only
```

## Cron Jobs for Auto-Purge

**Daily retention cleanup:**
```bash
0 2 * * * cd /Users/laurenz/.openclaw/workspace/services/data-protection && node -e "import('./retention.js').then(r => r.runRetentionPolicies())"
```

**Weekly data audit:**
```bash
0 3 * * 0 cd /Users/laurenz/.openclaw/workspace/services/data-protection && node audit.js > audit-report.txt
```

## Backup Encryption

**Database dump:**
```bash
pg_dump mydb | gpg --encrypt --recipient admin@example.com > backup.sql.gpg
```

**Config backup:**
```bash
tar czf config.tar.gz ~/.openclaw/*.json
gpg --encrypt --recipient admin@example.com config.tar.gz
```

**Restore:**
```bash
gpg --decrypt backup.sql.gpg | psql mydb
```

## Integration Examples

**Encrypt API keys before storing:**
```javascript
import { encrypt } from './encryption.js';

// Store
user.api_key_encrypted = encrypt(apiKey);

// Retrieve
const apiKey = decrypt(user.api_key_encrypted);
```

**Redact PII from logs:**
```javascript
import { redactPII } from './pii-detector.js';

await log('info', 'api', 'request', {
  body: redactPII(requestBody),
});
```

---

**Status:** Utilities ready  
**Requires:** `ENCRYPTION_KEY` in `.env`
