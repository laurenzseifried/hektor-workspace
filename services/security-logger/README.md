# Security Logger & Monitoring

Comprehensive structured logging + alert detection for OpenClaw security events.

## Quick Start

```bash
# Install
cp com.openclaw.security-logger.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.openclaw.security-logger.plist

# Check status
curl http://127.0.0.1:9000/health

# Query logs (admin only)
curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  http://127.0.0.1:9000/admin/logs?category=security&limit=50

# Check alerts
curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  http://127.0.0.1:9000/admin/alerts
```

## Features

- ✅ Structured JSON logging (no passwords/tokens logged)
- ✅ Separate security & general logs
- ✅ Alert rules (CRITICAL/HIGH/MEDIUM)
- ✅ Automatic daily log rotation
- ✅ Compression + retention (1yr security, 30d general)
- ✅ Admin query endpoint

## Alert Rules

**CRITICAL** (immediate):
- 10+ failed logins from same IP in 5 min
- Circuit breaker emergency
- Multiple canary token leaks

**HIGH** (15 min):
- 5+ prompt injection attempts from same key
- Error rate > 10% for 5+ min
- Cost spike > 3x hourly rate

**MEDIUM** (daily digest):
- Rate limit hits summary
- Failed auth summary
- Cost summary by model

## Admin Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /admin/logs?category=X&level=Y&limit=50` | Query logs |
| `GET /admin/alerts` | Check active alerts |
| `POST /admin/rotate` | Manually rotate logs |
| `GET /admin/stats` | Log size statistics |

## Integration

Import logger in your services:

```javascript
import { log, logFailedLogin, logPromptInjectionDetected } from './logger.js';

// Log events
await logFailedLogin('192.168.1.1', 'admin', 'Invalid password');
await logPromptInjectionDetected('api-key-xxx', 'ignore_instructions', true);
```

## Log Format

```json
{
  "timestamp": "2026-02-13T08:51:00.000Z",
  "level": "warn",
  "category": "security",
  "event": "rate_limit_exceeded",
  "request_id": "req_1739433060000_abcd1234",
  "metadata": {
    "ip": "192.1...1.1",
    "api_key": "sk-...1234",
    "endpoint": "/api/messages",
    "current_count": 101
  }
}
```

---

**Port**: 9000  
**Logs**: `.logs/` directory (rotated daily)
