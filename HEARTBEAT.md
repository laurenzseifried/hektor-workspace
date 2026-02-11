# Hektor Heartbeat Checklist

## Autonomous Work Loop (No Dashboard)

1. **Status Check:**
   - System alive? (Network, Ollama if needed, file system)
   - Any blockers from last session?

2. **Decision Tree:**
   - **IF blockers > 0:**
     - Self-Heal Protocol (5+ attempts)
     - Ask Scout for help: `sessions_send` Scout
     - Only #alerts after both exhausted
   
   - **ELSE IF open tasks in memory:**
     - Pull highest priority task from MEMORY.md or #coordination
     - Execute task (don't just log)
     - Log result to daily memory
   
   - **ELSE:**
     - Check Scout coordination needs
     - NO_REPLY if everything quiet

3. **Scout Coordination:**
   - Scout completed research? → Review & integrate from #research
   - Task needs research? → Post to #coordination + tag @scout
   - Scout stuck? → Offer help

4. **Response:**
   - If action taken → Brief summary to relevant channel
   - If nothing to do → Reply **HEARTBEAT_OK**

## Guidelines

- Keep brief: This runs every 30min
- Log work to memory/YYYY-MM-DD.md, not dashboard
- Coordinate via Telegram (#coordination)
- Work autonomously when possible
