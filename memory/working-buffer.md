# Working Buffer (Danger Zone Log)

**Purpose:** Capture every exchange in the danger zone (60%+ context). Survives compaction. Provides recovery context when session truncates.

**Status:** ACTIVE
**Started:** 2026-02-09T23:05:00Z
**Context Threshold:** 60% of token budget
**Update Trigger:** Every message after threshold

---

## Protocol

1. **Monitor context** via `session_status` — when >60%: ACTIVATE
2. **Every message after 60%:** Append both human input + agent summary
3. **After compaction:** Read buffer FIRST before SESSION-STATE.md
4. **Extract & preserve:** Pull buffer entries into SESSION-STATE.md
5. **Keep buffer as-is:** Don't delete until next 60% threshold

---

## Log Format

```
## [timestamp] Human
[their exact message or summary]

## [timestamp] Agent (summary)
[1-2 sentence summary + key decisions/details]
```

---

## Active Exchanges

### [2026-02-09T23:05:00Z] Human
"Ich meine mit aktiv nutzen, dass du die skills dir aufmerksam durchliest und machst was darin steht. Das sollst du jetzt machen."

### [2026-02-09T23:05:30Z] Agent (summary)
Read both self-improving-agent and proactive-agent SKILL.md files in full. Understood core requirements: implement `.learnings/` structure, WAL Protocol (Write-Ahead Logging for corrections), Working Buffer Protocol (danger-zone context survival), and proactive-agent operating system. Now implementing both systems into workspace.

---
