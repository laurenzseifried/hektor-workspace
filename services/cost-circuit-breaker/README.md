# Cost Circuit Breaker

Automatically track OpenClaw API costs and enforce budget limits with progressive circuit breaker thresholds.

## Features

- **Real-time cost tracking** by model, user, and API key
- **Progressive thresholds**: WARNING → SOFT → HARD → EMERGENCY
- **Auto-downgrade**: Opus → Sonnet when soft limit hit
- **Block expensive models**: Only Haiku at hard limit
- **Emergency shutoff**: Block all models at emergency limit
- **Telegram + Email alerts** for threshold breaches
- **Admin API** for monitoring and control

## Architecture

```
services/cost-circuit-breaker/
├── server.js       — HTTP API (port 3003)
├── tracker.js      — Cost calculation and storage
├── breaker.js      — Circuit breaker logic
├── notifier.js     — Telegram + Email alerts
├── .costs.json     — Persistent storage (24h TTL)
└── *.plist         — launchd auto-start
```

## Installation

1. **Install as launchd service:**

```bash
cp com.openclaw.cost-circuit-breaker.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist
```

2. **Verify it's running:**

```bash
launchctl list | grep cost-circuit-breaker
curl http://127.0.0.1:3003/health
```

3. **Configure thresholds** (optional, defaults shown):

Add to `/Users/laurenz/.openclaw/.env`:

```bash
CIRCUIT_BREAKER_WARNING=100      # $100/day
CIRCUIT_BREAKER_SOFT=250         # $250/day
CIRCUIT_BREAKER_HARD=500         # $500/day
CIRCUIT_BREAKER_EMERGENCY=1000   # $1000/day
CIRCUIT_BREAKER_EMAIL=laurenz.seifried@gmail.com
CIRCUIT_BREAKER_TELEGRAM_TOPIC=9      # #alerts
CIRCUIT_BREAKER_TELEGRAM_CHAT=-1003808534190  # HQ Group
```

Then restart:

```bash
launchctl unload ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist
launchctl load ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist
```

## Usage

### Admin API

**View current costs:**

```bash
curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  http://127.0.0.1:3003/admin/costs
```

**Reset costs:**

```bash
curl -X POST \
  -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  http://127.0.0.1:3003/admin/costs/reset
```

**Update thresholds:**

```bash
curl -X PUT \
  -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"WARNING": 150, "SOFT": 300}' \
  http://127.0.0.1:3003/admin/costs/limits
```

### Track a request (internal)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4-5",
    "inputTokens": 1000,
    "outputTokens": 500,
    "user": "laurenz",
    "apiKey": "default"
  }' \
  http://127.0.0.1:3003/track
```

### Check circuit breaker state

```bash
curl http://127.0.0.1:3003/state
```

## Thresholds

| Level | Daily Cost | Action |
|-------|-----------|---------|
| **WARNING** | $100 | Alert to #alerts, continue normally |
| **SOFT** | $250 | Opus → Sonnet auto-downgrade |
| **HARD** | $500 | Block non-Haiku requests |
| **EMERGENCY** | $1000 | Block ALL model requests, manual reset required |

## Pricing

Per million tokens:

| Model | Input | Output |
|-------|-------|--------|
| Haiku | $0.25 | $1.25 |
| Sonnet | $3.00 | $15.00 |
| Opus | $15.00 | $75.00 |
| Ollama | $0.00 | $0.00 |

## Notifications

- **Telegram**: #alerts (Topic 9) in HQ Group
- **Email**: Sent via AgentMail for HARD + EMERGENCY levels

## Integration

To integrate with OpenClaw requests, add middleware to track costs after each model call:

```javascript
// After model response
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

## Logs

```bash
tail -f ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker/stdout.log
tail -f ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker/stderr.log
```

Or check workspace logs:

```bash
tail -f services/cost-circuit-breaker/stdout.log
tail -f services/cost-circuit-breaker/stderr.log
```

## Uninstall

```bash
launchctl unload ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist
rm ~/Library/LaunchAgents/com.openclaw.cost-circuit-breaker.plist
```
