# Gateway Proxy (Port 8000)

**Enhanced with Auto-Clear Session Management**

Transparent middleware that intercepts all OpenClaw API requests and routes model calls through the Orchestrator for security & cost enforcement.

## Architecture

```
Clients (Sub-Agents, Direct Calls)
    ↓
[Gateway Proxy - Port 8000]
    │
    ├─→ POST /api/messages → Orchestrator 3005 (Validated + Secured)
    │
    └─→ All other routes → Real Gateway 18789 (Passthrough)
    ↓
Protected Responses
```

## How It Works

1. **Proxy listens on Port 8000** (clients unchanged)
2. **Model requests** (`POST /api/messages`) → Route to **Orchestrator 3005**
   - Input validation (inject defense)
   - Canary injection
   - Model call via real gateway
   - Output filtering
   - Cost tracking
3. **All other requests** → Passthrough to **Real Gateway 18789** (unchanged)

## Installation

1. **Install launchd service:**

```bash
cp services/gateway-proxy/com.openclaw.gateway-proxy.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.openclaw.gateway-proxy.plist
```

2. **Verify:**

```bash
launchctl list | grep gateway-proxy
curl http://127.0.0.1:8000/health
```

3. **Clients now use port 8000** (where proxy listens)
   - Sub-Agents: Automatically (they use gateway)
   - Direct API calls: Point to http://127.0.0.1:8000

## Configuration

Environment variables (in launchd plist):

- `GATEWAY_PROXY_PORT` - Port to listen on (default: 8000)
- `REAL_GATEWAY_URL` - Real gateway address (default: http://127.0.0.1:18789)
- `ORCHESTRATOR_URL` - Orchestrator address (default: http://127.0.0.1:3005)

## Usage

### Before (direct to gateway)

```javascript
const response = await fetch('http://127.0.0.1:18789/api/messages', {
  method: 'POST',
  body: JSON.stringify({...})
});
```

### After (through proxy = automatic protection)

```javascript
// NO CHANGE NEEDED - proxy is transparent!
// Clients still use localhost:8000, which is now the proxy
const response = await fetch('http://127.0.0.1:8000/api/messages', {
  method: 'POST',
  body: JSON.stringify({...})
});
```

Or if pointing to 18789, update to:

```javascript
const response = await fetch('http://127.0.0.1:8000/api/messages', {
  method: 'POST',
  body: JSON.stringify({...})
});
```

## What's Protected

**All requests through `/api/messages` get:**
- ✅ Input validation (blocks jailbreaks, code execution, instruction overrides)
- ✅ Prompt injection defense (canary tokens)
- ✅ Cost tracking (budgets enforced)
- ✅ Output filtering (redacts secrets, PII, prompt leaks)
- ✅ Automatic API key quarantine (after repeated attempts)

**All other endpoints** pass through unchanged:
- Health checks
- Auth endpoints
- Admin endpoints
- Etc.

## Monitoring

**Logs:**

```bash
tail -f services/gateway-proxy/stdout.log
tail -f services/gateway-proxy/stderr.log
```

**Check routing:**

```bash
# See if model requests are routed to orchestrator
tail -f services/gateway-proxy/stdout.log | grep "Model request"

# See if other requests pass through
tail -f services/gateway-proxy/stdout.log | grep "Passthrough"
```

## Flow Example

**Client sends model request:**

```
1. Client: POST http://127.0.0.1:8000/api/messages
2. Proxy (8000): Detects /api/messages
3. Proxy → Orchestrator (3005)
   a. Validate input (3004)
   b. Inject canary (3004)
   c. Track cost (3003)
   d. Call real gateway (18789)
   e. Filter output (3004)
   f. Log cost (3003)
4. Orchestrator → Client: Safe response
```

**Client sends health check:**

```
1. Client: GET http://127.0.0.1:8000/health
2. Proxy (8000): Detects non-model route
3. Proxy → Real Gateway (18789)
4. Gateway → Client: Response
```

## Error Handling

**If Orchestrator is down:**
```json
{
  "error": "Orchestrator unavailable",
  "message": "..."
}
```

**If Real Gateway is down:**
```json
{
  "error": "Bad Gateway",
  "message": "Real gateway unavailable"
}
```

**If input is invalid:**
```json
{
  "error": "INPUT_VALIDATION_FAILED",
  "details": {...}
}
```

## Troubleshooting

**Proxy not responding:**
```bash
curl http://127.0.0.1:8000/health
launchctl list | grep gateway-proxy
```

**Model requests not reaching Orchestrator:**
```bash
tail -f services/gateway-proxy/stdout.log
# Should see: "[gateway-proxy] Model request → Orchestrator 3005"
```

**Passthrough requests failing:**
```bash
# Check if real gateway is running
curl http://127.0.0.1:18789/health
openclaw status
```

## Architecture Notes

- **Transparent**: Clients don't need to know about proxy
- **Fail-secure**: If orchestrator unavailable, model requests blocked (safety first)
- **Non-blocking cost**: Cost failures don't block responses (availability)
- **Zero-config clients**: Sub-Agents work as-is

---

## Auto-Clear Session Management (Token Optimization)

**NEW**: Gateway Proxy now tracks messages per session and auto-clears when token usage gets too high.

### How It Works

1. **Message Counter**: Tracks number of messages per session (in-memory)
2. **Warning Threshold (30 messages)**: Returns warning without processing
3. **Auto-Clear Threshold (50 messages)**: Auto-injects SESSION_CLEARED + resets counter

### Behavior

**At 30 messages:**
```json
{
  "type": "auto_clear_warning",
  "message": "[AUTO-SESSION WARNING] This session has 30+ messages. Token usage is high. Reply /clear to start fresh while keeping your project context.",
  "messageCount": 30,
  "action": "none"
}
```

**At 50+ messages:**
```json
{
  "response": "...",
  "auto_cleared": true,
  "notification": "[AUTO-CLEARED] Session reset to save tokens. Your project memory and tasks are preserved."
}
```

### What Gets Preserved After Auto-Clear

✅ System prompt (always loaded)  
✅ Persistent memory files (`/project/identity.md`, `context.md`, `tasks.md`, `log.md`)  
✅ Project state (tasks, context, decisions)

❌ Conversation history (>50 messages wipe incoming)  
❌ Old messages (not sent to model)

### Token Savings

- **Before**: 5,000+ tokens per message (full history)
- **After**: ~500 tokens per message (memory only)
- **Savings**: ~90% cost reduction

### Monitoring Auto-Clear

```bash
# Watch for auto-clear events
tail -f services/gateway-proxy/stdout.log | grep "AUTO-CLEAR"

# Example output:
# [gateway-proxy] ⚠️  AUTO-CLEAR WARNING: Session xxx-yyy-zzz reached 30 messages
# [gateway-proxy] 🔄 AUTO-CLEAR TRIGGERED: Session xxx-yyy-zzz reached 50 messages
```

### Configuration

To adjust thresholds, edit `server.js`:

```javascript
if (msgCount === 30) {  // Change to 40, 50, etc.
  // Send warning
}

if (msgCount >= 50) {   // Change to 100, 200, etc.
  // Auto-clear
}
```

Then restart:
```bash
launchctl stop com.openclaw.gateway-proxy
launchctl start com.openclaw.gateway-proxy
```

---

**Status**: Production Ready  
**Port**: 8000 (public-facing)  
**Auto-Clear**: Enabled (30 msg warning, 50 msg auto-reset)  
**Tested**: All routes verified
