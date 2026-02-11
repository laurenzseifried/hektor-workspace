# Dashboard Workflow Integration — Hektor & Scout

**Version:** 2.0 (CLI)  
**Datum:** 2026-02-11  
**Status:** Production Ready

---

## Überblick

Das Dashboard ist die **zentrale Steuerungs- und Organisationseinheit** für Hektor und Scout. Alle operativen Entscheidungen, Task-Priorisierung, Research-Anfragen und Status-Updates laufen über das Dashboard.

**Kernprinzip:** Dashboard-first. Keine manuelle Memory-Pflege für operative Dinge — das Dashboard ist die Single Source of Truth.

**Tool:** `dashboard` CLI (global verfügbar via `npm link`)

---

## 1. Hektor — Daily Operations

### 1.1 Morning Briefing (Cron: 07:00)

**Trigger:** Cron Job ruft Hektor auf

**Workflow:**

```bash
# 1. Snapshot holen
dashboard briefing

# 2. Analyse (in Antwort)
# - Blocker? → #alerts
# - High-priority tasks? → Pull next
# - Scout idle? → Check research queue

# 3. Activity loggen
dashboard activity log \
  --type=briefing \
  --agent=hektor \
  --title="Morning Briefing: X tasks, Y blockers" \
  --details='{"openTasks":3,"blockers":0}'

# 4. Nächsten Task ziehen (wenn kein Blocker)
NEXT=$(dashboard task list --status=backlog --priority=high --format=ids | head -1)
if [ -n "$NEXT" ]; then
  dashboard task update "$NEXT" --status=in-progress --assignee=hektor
  dashboard activity log --type=task --agent=hektor --title="Started: $NEXT"
fi
```

**Output:**
- Briefing YAML (Tasks, Blocker, Activity, Projects, Pipeline, Research)
- Activity Log (type: briefing)
- Optional: #alerts wenn Blocker

---

### 1.2 Task Execution Loop

**Start Task:**

```bash
TASK_ID="HEKTOR-003"

# 1. Task details holen
dashboard task get "$TASK_ID"

# 2. Status → in-progress
dashboard task update "$TASK_ID" --status=in-progress --assignee=hektor

# 3. Log start
dashboard activity log \
  --type=task \
  --agent=hektor \
  --title="Started: $TASK_ID" \
  --details='{"taskId":"'$TASK_ID'","action":"started"}'

# 4. Task ausführen (mit Model Routing)
```

**Complete Task:**

```bash
TASK_ID="HEKTOR-003"
HOURS=3

# 1. Status → done
dashboard task update "$TASK_ID" --status=done --actual-hours=$HOURS

# 2. Log completion
dashboard activity log \
  --type=task \
  --agent=hektor \
  --title="Completed: $TASK_ID" \
  --details='{"taskId":"'$TASK_ID'","action":"completed","outcome":"Implementation successful","actualHours":'$HOURS'}'
```

**Model Switch Logging:**

```bash
# Nach session_status(model="sonnet")
dashboard activity log \
  --type=model \
  --agent=hektor \
  --title="Model: Sonnet for HEKTOR-003" \
  --details='{"model":"sonnet","taskId":"HEKTOR-003","reason":"Complex architecture decisions","estimatedCost":0.0075}'
```

---

### 1.3 Blocker Detection & Escalation

**Automatisch:** Briefing API erkennt stuck tasks (>24h in-progress)

**Hektor Reaktion:**

```bash
# 1. Briefing checken
BRIEFING=$(dashboard briefing)
BLOCKERS=$(echo "$BRIEFING" | grep -A5 "blockers:" | grep "- " | wc -l)

if [ "$BLOCKERS" -gt 0 ]; then
  # 2. Self-Heal Protocol (5-10 Versuche)
  # ... attempts ...
  
  # 3. Nach Exhaustion: Log blocker
  dashboard activity log \
    --type=blocked \
    --agent=hektor \
    --title="Blocked: HEKTOR-003" \
    --details='{"taskId":"HEKTOR-003","reason":"Missing API key","attemptsCount":7,"needsLaurenz":true}'
  
  # 4. Escalate #alerts
  echo "🚨 Blocker: HEKTOR-003 — Missing API key. 7 attempts. Need input."
fi
```

---

### 1.4 Evening Summary (Cron: 21:00)

**Trigger:** Cron Job ruft Hektor auf

**Workflow:**

```bash
# 1. Data sammeln
BRIEFING=$(dashboard briefing)
ACTIVITY=$(dashboard activity list --limit=50)
COST=$(dashboard cost --from=$(date +%Y-%m-%d) --to=$(date +%Y-%m-%d))

# 2. Metrics extrahieren (via jq/yq)
TASKS_DONE=$(echo "$ACTIVITY" | grep -c "Completed:")
COST_TODAY=$(echo "$COST" | yq '.dailyCosts[0].cost')

# 3. Log summary
dashboard activity log \
  --type=briefing \
  --agent=hektor \
  --title="Evening Summary: $TASKS_DONE tasks done" \
  --details='{"tasksCompleted":'$TASKS_DONE',"costToday":'$COST_TODAY'}'

# 4. Daily log updaten
echo "## Evening Summary" >> memory/$(date +%Y-%m-%d).md
echo "- Tasks: $TASKS_DONE" >> memory/$(date +%Y-%m-%d).md
echo "- Cost: \$$COST_TODAY" >> memory/$(date +%Y-%m-%d).md
```

---

### 1.5 Heartbeat Integration (Ollama, 30min)

**Ollama checkt:**

```bash
# 1. session_status
# 2. dashboard briefing

BRIEFING=$(dashboard briefing)
BLOCKERS=$(echo "$BRIEFING" | yq '.blockers | length')

if [ "$BLOCKERS" -gt 0 ]; then
  # 3. Escalate via sessions_send
  sessions_send \
    --session-key="agent:hektor:telegram:group:-1003808534190:topic:26" \
    --message="⚠️ Heartbeat detected $BLOCKERS blockers. Check dashboard."
fi

# 4. Alles OK → HEARTBEAT_OK
```

---

## 2. Scout — Research Workflow

### 2.1 Research Request Intake

**Weg A: Laurenz erstellt im Dashboard UI**
- Research Tab → "New Research Request"
- SSE → Scout bekommt Notification

**Weg B: Hektor delegiert**

```bash
# Hektor erkennt: Research-Task
dashboard research create \
  --question="Top 5 AI appointment setting competitors?" \
  --context="Market entry evaluation. Need pricing + features." \
  --priority=high \
  --requested-by=hektor \
  --assignee=scout \
  --deadline=2026-02-12T18:00:00Z
```

---

### 2.2 Scout Research Execution

**Check Queue:**

```bash
# Daily Check-In (Cron: 08:00)
PENDING=$(dashboard research list --status=pending --assignee=scout --format=ids)
COUNT=$(echo "$PENDING" | wc -l | tr -d ' ')

if [ "$COUNT" -gt 5 ]; then
  echo "📋 Scout backlog at $COUNT items" # → #coordination
fi
```

**Start Research:**

```bash
RES_ID="RES-001"

# 1. Status → in-progress
dashboard research update "$RES_ID" --status=in-progress

# 2. Log start
dashboard activity log \
  --type=research \
  --agent=scout \
  --title="Started: $RES_ID"

# 3. Research durchführen
# - web_search, web_fetch
# - Findings in findings.md schreiben
```

**Complete Research:**

```bash
RES_ID="RES-001"

# 1. Complete mit findings
dashboard research complete "$RES_ID" --findings-file=findings.md

# 2. Log completion
dashboard activity log \
  --type=research \
  --agent=scout \
  --title="Completed: $RES_ID" \
  --details='{"researchId":"'$RES_ID'","findingsSummary":"5 competitors, pricing $200-500"}'

# 3. Telegram #research
echo "✅ Research complete: $(dashboard research get $RES_ID | yq '.question')"
```

---

## 3. Cross-Agent Coordination — Pipeline

### 3.1 Scout Finds Lead

```bash
# Scout identifiziert Lead
dashboard pipeline create \
  --name="Acme Corp" \
  --type=lead \
  --project=lead-gen \
  --status=research \
  --assignee=scout \
  --data='{"website":"https://acme.com","industry":"SaaS"}'

# Log
dashboard activity log \
  --type=pipeline \
  --agent=scout \
  --title="New Lead: Acme Corp"
```

---

### 3.2 Scout Qualifies → Hektor

```bash
PIPE_ID="PIPE-001"

# 1. Update status + data
dashboard pipeline update "$PIPE_ID" \
  --status=qualified \
  --data='{"email":"contact@acme.com","decisionMaker":"Jane Smith, CTO","fit":"High"}'

# 2. Log handoff
dashboard activity log \
  --type=pipeline \
  --agent=scout \
  --title="Lead Qualified: Acme Corp → Hektor" \
  --details='{"pipelineId":"'$PIPE_ID'","handoff":"hektor"}'

# 3. SSE → Hektor bekommt Notification
```

---

### 3.3 Hektor Takes Over

```bash
PIPE_ID="PIPE-001"

# 1. Assign to self
dashboard pipeline update "$PIPE_ID" --assignee=hektor

# 2. Log acceptance
dashboard activity log \
  --type=pipeline \
  --agent=hektor \
  --title="Taking over: Acme Corp"

# 3. Create task
LEAD_NAME=$(dashboard pipeline get "$PIPE_ID" | yq '.name')
dashboard task create \
  --title="Outreach: $LEAD_NAME" \
  --project=lead-gen \
  --priority=high \
  --assignee=hektor
```

---

## 4. Model Routing & Cost Tracking

### 4.1 Model Switch Logging

**Jedes Mal wenn Model gewechselt wird:**

```bash
# Nach session_status(model="sonnet")
dashboard activity log \
  --type=model \
  --agent=hektor \
  --title="Model: Sonnet for HEKTOR-003" \
  --details='{"model":"sonnet","taskId":"HEKTOR-003","reason":"Complex API design","inputTokens":2000,"outputTokens":500,"estimatedCost":0.0075}'
```

---

### 4.2 Budget Monitoring

```bash
# Daily check (Evening Summary)
COST=$(dashboard cost)
PERCENT=$(echo "$COST" | yq '.budget.percent')

if (( $(echo "$PERCENT > 80" | bc -l) )); then
  echo "🚨 Budget at $PERCENT%. Optimize model usage." # → #alerts
fi
```

---

## 5. Workflow Tiers

**Tier 1: Full Tracking (>30min tasks)**
- Morning/Evening Briefing
- Task Start + Done + Activity
- Model switches logged
- Example: HEKTOR-003 "Implement Dashboard CLI"

**Tier 2: Light Tracking (10-30min tasks)**
- Task Done + Activity (completion only)
- Example: Config patch, skill installation

**Tier 3: No Tracking (<10min routine)**
- Keine Dashboard-Interaktion
- Example: File ops, quick checks

---

## 6. Integration Points

### 6.1 AGENTS.md

**Hektor:**
```markdown
## Dashboard-First Protocol

**Vor jedem Task:**
1. `dashboard briefing` (Morning) oder `dashboard task list` (Task pull)
2. `dashboard task update {id} --status=in-progress`
3. `dashboard activity log --type=task --action=started`

**Nach jedem Task:**
1. `dashboard task update {id} --status=done --actual-hours={hours}`
2. `dashboard activity log --type=task --action=completed`

**Model Switch:**
1. `session_status(model="sonnet")` (oder opus)
2. `dashboard activity log --type=model`
```

**Scout:**
```markdown
## Research Queue Protocol

**Check-In (08:00):**
1. `dashboard research list --status=pending --assignee=scout`

**Research Start:**
1. `dashboard research update {id} --status=in-progress`
2. `dashboard activity log --type=research --action=started`

**Research Complete:**
1. `dashboard research complete {id} --findings-file=findings.md`
2. `dashboard activity log --type=research --action=completed`
```

---

### 6.2 Cron Jobs

**Hektor Morning Briefing:**
```json
{
  "name": "Hektor Morning Briefing",
  "schedule": { "kind": "cron", "expr": "0 7 * * *", "tz": "Europe/Berlin" },
  "payload": {
    "kind": "systemEvent",
    "text": "Morning Briefing: Run `dashboard briefing` and analyze open tasks, blockers, priorities."
  },
  "sessionTarget": "main"
}
```

**Hektor Evening Summary:**
```json
{
  "name": "Hektor Evening Summary",
  "schedule": { "kind": "cron", "expr": "0 21 * * *", "tz": "Europe/Berlin" },
  "payload": {
    "kind": "systemEvent",
    "text": "Evening Summary: Run `dashboard briefing`, `dashboard activity list`, `dashboard cost` and create daily summary."
  },
  "sessionTarget": "main"
}
```

**Scout Check-In:**
```json
{
  "name": "Scout Research Check-In",
  "schedule": { "kind": "cron", "expr": "0 8 * * *", "tz": "Europe/Berlin" },
  "payload": {
    "kind": "systemEvent",
    "text": "Research Check-In: Run `dashboard research list --status=pending --assignee=scout` and report count."
  },
  "sessionTarget": "main"
}
```

---

## 7. Success Metrics (7-Tage Testlauf)

**Ziele:**
- 100% Tasks über Dashboard (nicht manuell in Memory)
- 100% Research über API
- 0 manuelle Memory-Updates für operative Dinge
- >80% Blocker automatisch erkannt
- Lückenloser Activity Log

**Messung:**
- Daily: `dashboard briefing` → Track open/completed
- Weekly: Activity log completeness review
- Cost: `dashboard cost` → Burn-rate vs. Budget

---

## 8. Neue Dashboard Features (Phase 2)

**Verfügbar ab 2026-02-11:**

**Pipeline Tab:**
- Kanban: Research → Qualified → Approved → Delivered
- Drag & Drop
- Filter: type, project, status, assignee

**Research Queue Tab:**
- 3 Sections: Pending → In Progress → Completed
- Priority badges, deadline indicators
- Markdown findings preview

**Insights Tab:**
- Lead Gen, CI, Research, Tasks Widgets
- Pipeline flow bar chart
- Recent activity counter

**Cost Tracking:**
- Model split (Haiku/Sonnet/Opus)
- Daily cost graph
- Agent split (Hektor/Scout)
- Budget percentage

---

## Acceptance Criteria

- [x] Dashboard Phase 2 deployed
- [x] CLI Tool verfügbar (`dashboard`)
- [x] dashboard-cli Skill dokumentiert
- [ ] Hektor nutzt Briefing für Morning/Evening
- [ ] Hektor updated Tasks via CLI
- [ ] Scout nutzt Research Queue
- [ ] Model switches werden geloggt
- [ ] Pipeline für Lead Gen/CI genutzt
- [ ] Cron Jobs konfiguriert
- [ ] 7-Tage Testlauf erfolgreich

---

**Nächste Schritte:**
1. Cron Jobs erstellen (Morning/Evening/Check-In)
2. Test all workflows (Task, Research, Pipeline)
3. 7-day monitoring
4. Review + Adjustments

---

**CLI Quick Reference:**

```bash
# Briefing
dashboard briefing

# Tasks
dashboard task list --status=backlog --priority=high
dashboard task get HEKTOR-003
dashboard task update HEKTOR-003 --status=done --actual-hours=3

# Research
dashboard research list --status=pending --assignee=scout
dashboard research complete RES-001 --findings-file=findings.md

# Pipeline
dashboard pipeline list --type=lead --status=qualified
dashboard pipeline update PIPE-001 --status=approved

# Activity
dashboard activity log --type=task --agent=hektor --title="..."

# Insights & Cost
dashboard insights
dashboard cost --from=2026-02-11 --to=2026-02-11
```
