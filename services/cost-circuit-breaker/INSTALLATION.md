# Cost Circuit Breaker — Installation Summary

## ✅ Status: INSTALLED & RUNNING

**Service:** `com.openclaw.cost-circuit-breaker`  
**Port:** 3003  
**PID:** Check with `launchctl list | grep cost-circuit-breaker`

---

## What Was Implemented

### 1. **Cost Tracking Module** (`tracker.js`)
- Calculates cost per request based on model and token count
- Pricing: Haiku ($0.25/$1.25), Sonnet ($3/$15), Opus ($15/$75)
- Tracks costs per API key, per user, and globally
- Stores running totals in `.costs.json` with 24-hour TTL

### 2. **Circuit Breaker** (`breaker.js`)
Progressive thresholds with automatic enforcement:

| Level | Daily Cost | Action |
|-------|-----------|---------|
| **WARNING** | $100 | Alert to #alerts, continue normally |
| **SOFT** | $250 | Opus → Sonnet auto-downgrade + alert |
| **HARD** | $500 | Block non-Haiku requests + alert |
| **EMERGENCY** | $1000 | Block ALL models + email + manual reset required |

### 3. **Notifications** (`notifier.js`)
- **Telegram**: Posts to #alerts (Topic 9) in HQ Group
- **Email**: Sent via AgentMail (hektor@agentmail.to) for HARD + EMERGENCY levels
- Includes cost breakdowns by model and user

### 4. **Admin API** (`server.js`)
HTTP endpoints on port 3003:

- `GET /health` — Health check
- `GET /dashboard` — HTML dashboard with visual indicators
- `GET /state` — Circuit breaker state (public)
- `POST /track` — Track a request (internal)
- `GET /admin/costs` — View current spend (requires auth)
- `POST /admin/costs/reset` — Reset costs (requires auth)
- `PUT /admin/costs/limits` — Update thresholds (requires auth)

### 5. **CLI Tool** (`check-costs.js`)
Quick status check:

```bash
cd services/cost-circuit-breaker
OPENCLAW_GATEWAY_TOKEN=<token> node check-costs.js
```

### 6. **Dashboard**
Visual cost monitoring at `http://127.0.0.1:3003/dashboard`

- Green/Yellow/Orange/Red indicator
- Progress bar showing current spend vs. thresholds
- Breakdown by model and user
- Auto-refreshes every 30 seconds

---

## Configuration

All settings in launchd plist (`~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist`):

```
CIRCUIT_BREAKER_WARNING=100
CIRCUIT_BREAKER_SOFT=250
CIRCUIT_BREAKER_HARD=500
CIRCUIT_BREAKER_EMERGENCY=1000
CIRCUIT_BREAKER_EMAIL=laurenz.seifried@gmail.com
CIRCUIT_BREAKER_TELEGRAM_TOPIC=9
CIRCUIT_BREAKER_TELEGRAM_CHAT=-1003808534190
```

---

## Testing

Service is live and tested:

1. ✅ Health check: `curl http://127.0.0.1:3003/health`
2. ✅ Track request: Tested with Sonnet request (1000 input + 500 output tokens = $0.0105)
3. ✅ Admin API: Tested with auth
4. ✅ Dashboard: Running at http://127.0.0.1:3003/dashboard
5. ✅ CLI tool: Tested and working

---

## Next Steps

### Integration with OpenClaw

To track costs automatically, add middleware after each model request:

```javascript
// After model API call
const usage = response.usage; // { input_tokens, output_tokens }

await fetch('http://127.0.0.1:3003/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4-5',
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    user: session.user || 'unknown',
    apiKey: apiKeyUsed || 'default',
  }),
});
```

### Testing Alerts

To test the alert system, simulate high costs:

```bash
# Track multiple expensive requests
for i in {1..50}; do
  curl -X POST http://127.0.0.1:3003/track \
    -H "Content-Type: application/json" \
    -d '{"model":"anthropic/claude-opus-4-6","inputTokens":10000,"outputTokens":5000,"user":"test"}'
done

# Check state
curl http://127.0.0.1:3003/state

# Reset after test
curl -X POST \
  -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  http://127.0.0.1:3003/admin/costs/reset
```

---

## Maintenance

**View logs:**
```bash
tail -f services/cost-circuit-breaker/stdout.log
tail -f services/cost-circuit-breaker/stderr.log
```

**Restart service:**
```bash
launchctl unload ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist
launchctl load ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist
```

**Update thresholds:**
```bash
curl -X PUT \
  -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"WARNING": 150, "SOFT": 300, "HARD": 600, "EMERGENCY": 1200}' \
  http://127.0.0.1:3003/admin/costs/limits
```

---

## Files Created

```
services/cost-circuit-breaker/
├── server.js                          — HTTP API server
├── tracker.js                         — Cost calculation & storage
├── breaker.js                         — Circuit breaker logic
├── notifier.js                        — Telegram + Email alerts
├── check-costs.js                     — CLI status tool
├── .costs.json                        — Persistent storage (created on first use)
├── com.openclaw.cost-circuit-breaker.plist — launchd config
├── README.md                          — Complete documentation
└── INSTALLATION.md                    — This file
```

Installed in:
- `~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist`

---

## Done! 🎉

Cost circuit breaker is live and monitoring your OpenClaw deployment.
