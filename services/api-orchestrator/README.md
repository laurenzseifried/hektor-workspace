# API Orchestrator

Central coordination point for all model inferences. Orchestrates Cost Tracking, Prompt Injection Defense, and OpenClaw Gateway in a single request/response cycle.

## Architecture

```
Client Request
    ↓
[API Orchestrator - Port 3005]
    ├─→ Input Validation (Port 3004)
    ├─→ Canary Injection (Port 3004)
    ├─→ Cost Track Start (Port 3003)
    ├─→ Model Inference (OpenClaw Gateway Port 8000)
    ├─→ Output Filtering (Port 3004)
    └─→ Cost Track End (Port 3003)
    ↓
Safe, Tracked, Secure Response
```

## Installation

1. **Install launchd service:**

```bash
cp services/api-orchestrator/com.openclaw.api-orchestrator.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.openclaw.api-orchestrator.plist
```

2. **Verify:**

```bash
launchctl list | grep api-orchestrator
curl http://127.0.0.1:3005/health
```

3. **Check all dependencies:**

```bash
curl http://127.0.0.1:3005/status
```

## Usage

### Simple inference request

```javascript
const response = await fetch('http://127.0.0.1:3005/infer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Hello, how are you?' }
    ],
    systemPrompt: 'You are a helpful assistant.',
    model: 'anthropic/claude-haiku-4-5',
    sessionId: 'user-session-123',
    apiKey: 'api-key-for-tracking',
  }),
});

const result = await response.json();
console.log(result.output); // Safe model response
console.log(result.metadata); // Cost, canary status, findings
```

### Response format

```json
{
  "success": true,
  "output": "Model response text...",
  "metadata": {
    "sanitized": false,
    "findings": [],
    "cost": {
      "thisCycle": 0.015,
      "total": 0.045,
      "state": "OK"
    },
    "canary": {
      "injected": true
    },
    "duration": 1234
  }
}
```

### Error responses

**Input validation failed:**
```json
{
  "error": "INPUT_VALIDATION_FAILED",
  "details": { "valid": false, "errors": [...] }
}
```

**API key quarantined:**
```json
{
  "error": "API_KEY_QUARANTINED",
  "quarantined": true,
  "type": "temporary",
  "remaining": 3600000,
  "remainingMinutes": 60
}
```

**Output security check failed:**
```json
{
  "error": "OUTPUT_SECURITY_CHECK_FAILED",
  "message": "Model output contains sensitive information and was blocked",
  "details": { "findings": [...] }
}
```

**Cost limit exceeded:**
```json
{
  "error": "COST_LIMIT_EXCEEDED",
  "level": "HARD",
  "total": 501.50,
  "threshold": 500
}
```

## Endpoints

### POST /infer
Main orchestration endpoint. Coordinates all security, cost, and inference operations.

**Request:**
- `messages` (array, required) - Chat history
- `systemPrompt` (string, required) - System instructions
- `model` (string, required) - Model identifier
- `sessionId` (string, optional) - Session ID for tracking
- `apiKey` (string, optional) - API key for cost/security tracking

**Response:**
- `output` - Safe model response
- `metadata` - Cost, canary, findings, duration

### GET /health
Simple health check.

### GET /status
Aggregated status of all dependent services:
- Injection Defense (3004)
- Cost Circuit Breaker (3003)
- OpenClaw Gateway (8000)

## Integration with OpenClaw

### Option 1: Replace gateway calls

If you're currently calling the OpenClaw Gateway directly:

```javascript
// Before (direct gateway call)
const resp = await fetch('http://127.0.0.1:8000/api/messages', {...});

// After (through orchestrator)
const resp = await fetch('http://127.0.0.1:3005/infer', {...});
```

### Option 2: Gateway middleware

Add to the OpenClaw Gateway to intercept all `/api/messages` calls:

```javascript
app.post('/api/messages', async (req, res) => {
  const orchestratorResp = await fetch('http://127.0.0.1:3005/infer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...req.body,
      sessionId: req.user?.id,
      apiKey: req.headers['authorization'],
    }),
  });
  
  res.json(await orchestratorResp.json());
});
```

### Option 3: Sub-agent integration

In subagent invocations, point to orchestrator:

```javascript
// In OpenClaw subagent calls
const response = await fetch('http://127.0.0.1:3005/infer', {
  method: 'POST',
  body: JSON.stringify({
    messages: conversationHistory,
    systemPrompt: systemPrompt,
    model: 'anthropic/claude-sonnet-4-5',
    sessionId: subagentId,
    apiKey: 'subagent-' + subagentId,
  }),
});
```

## How It Works

### Request Flow

1. **Input Validation** → Check for injection patterns, length limits
   - If blocked: Return 400 + details
   - If blocked pattern 3x: Quarantine API key

2. **Canary Injection** → Embed security token in system prompt
   - Used to detect if prompt was overridden

3. **Cost Tracking Start** → Record session start
   - Used for circuit breaker checks

4. **Model Inference** → Call OpenClaw Gateway
   - Uses validated input + canary-enhanced prompt
   - Returns model output + token usage

5. **Output Filtering** → Check for leaked secrets/PII/prompt content
   - Redacts API keys, SSN, credit cards
   - If canary token leaked → CRITICAL alert
   - If unsafe → Return 403, request blocked

6. **Cost Tracking End** → Log final costs
   - Updates circuit breaker state
   - Triggers alerts if thresholds exceeded

### Failure Handling

- If injection defense is down: Request blocked (fail-secure)
- If cost breaker is down: Request continues (non-critical)
- If model fails: Gateway error passed through
- If output filter fails: Request blocked (fail-secure)

## Performance

- Validation: ~1ms
- Canary injection: ~0.5ms
- Model inference: ~1000-5000ms (depends on model)
- Output filtering: ~2-5ms
- Cost tracking: ~1ms

**Total overhead: ~10-20ms per request**

## Monitoring

**Logs:**
```bash
tail -f services/api-orchestrator/stdout.log
tail -f services/api-orchestrator/stderr.log
```

**Check service status:**
```bash
curl http://127.0.0.1:3005/status | python3 -m json.tool
```

## Configuration

Environment variables (in launchd plist):

- `ORCHESTRATOR_PORT` - Port to listen on (default: 3005)
- `OPENCLAW_GATEWAY_URL` - Gateway address (default: http://127.0.0.1:8000)
- `OPENCLAW_GATEWAY_TOKEN` - Gateway authentication token

## Troubleshooting

**"Injection Defense unavailable"**
```bash
curl http://127.0.0.1:3004/health
launchctl list | grep prompt-injection-defense
```

**"Cost Circuit Breaker unavailable"**
```bash
curl http://127.0.0.1:3003/health
launchctl list | grep cost-circuit-breaker
```

**"Gateway unavailable"**
```bash
curl http://127.0.0.1:8000/health
openclaw status
```

## Architecture Decisions

- **Synchronous coordination**: Each request waits for validation → model → filtering
  - Benefit: Atomic, rollback-safe
  - Trade-off: Slightly slower (but overhead <20ms)

- **Fail-secure**: If security service fails, block request
  - Benefit: No bypass possible
  - Trade-off: Availability depends on security services

- **Non-blocking cost tracking**: Cost failures don't block responses
  - Benefit: Better availability
  - Trade-off: Costs might not be logged perfectly

---

**Status**: Production Ready  
**Tested**: All dependencies verified  
**Port**: 3005
