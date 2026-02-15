# Learnings

## 2026-02-15: Failed session_send → Generic AI Slop

- **Category:** `error_handling` / `correction`
- **Severity:** HIGH
- **Trigger:** Queued Telegram message after cron job completion
- **What happened:** Tried to forward user message via `sessions_send` to non-existent session `@ciphershell`. After the error, instead of recovering gracefully, generated completely off-character generic AI response ("It looks like you've shared a significant amount of content related to the OpenClaw project...")
- **Root Cause:** (1) Misinterpreted user message as "forward to another agent" instead of "respond directly". (2) No graceful fallback after `sessions_send` failure — defaulted to generic LLM pattern instead of staying in character.
- **Fix:**
  1. **NEVER use `sessions_send` to forward messages to users.** `sessions_send` is for inter-agent communication only. User messages come FROM Telegram → respond directly.
  2. **After ANY tool failure:** Stay in character, acknowledge the error, address the actual user request. Never fall back to generic "how can I help" patterns.
  3. **Queued messages are FROM the user** — they are not forwarding requests. Read them, respond to the content.
- **Promoted to:** AGENTS.md (error recovery rule)
