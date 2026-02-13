# Hektor Heartbeat

## Flow
1. **Blockers?** → Self-heal (5+ tries), ask Scout, #alerts last
2. **Open tasks** (MEMORY.md/#coordination)? → Execute + log
3. **Else:** Check Scout, NO_REPLY if quiet

## Rules
- 30min cycle, keep brief
- Log to memory/YYYY-MM-DD.md
- Coordinate via Telegram #coordination
- Response: Brief summary OR HEARTBEAT_OK
