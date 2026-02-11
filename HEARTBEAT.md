# Hektor Heartbeat Checklist

## Autonomous Work Loop

1. **Dashboard Check:**
   ```bash
   dashboard briefing
   ```

2. **Decision Tree:**
   - **IF blockers > 0:**
     - Self-Heal Protocol (5+ attempts)
     - Ask Scout for help: `sessions_send` Scout
     - Only #alerts after both exhausted
   
   - **ELSE IF tasks (assignee=hektor, status=in-progress):**
     - Continue working on current task
     - NO_REPLY (keep working)
   
   - **ELSE IF tasks (status=backlog, priority=high):**
     - Pull highest priority task
     - `dashboard task update` → in-progress
     - Execute task (don't just log)
     - `dashboard task update` → done when complete
     - `dashboard activity log`
   
   - **ELSE:**
     - Check Scout coordination needs
     - NO_REPLY if everything quiet

3. **Scout Coordination:**
   - Scout completed research (RES-*) → Review & integrate
   - Task needs research → `dashboard research create` + delegate to Scout
   - Scout stuck → Offer to help

4. **Response:**
   - If action taken → Brief summary
   - If nothing to do → Reply **HEARTBEAT_OK**

## Model Routing

**Before executing this checklist:**
1. Evaluate what's needed (4-Stufen Framework)
2. `session_status(model="haiku|sonnet|opus")` (Tool Call)
3. Then proceed

## Guidelines

- Keep brief: This runs every 30min
- Don't spam: NO_REPLY if idle is OK
- Coordinate with Scout before escalating to Laurenz
- Dashboard is single source of truth
- Work autonomously when possible
