# Dashboard CLI — Agent Workflow Examples

Complete workflow patterns for Hektor and Scout daily operations using the Dashboard CLI.

---

## Hektor Morning Briefing (Automated — 07:00)

**Trigger:** Cron job sends system event to Hektor

**Workflow:**

```bash
#!/bin/bash

# 1. Get dashboard snapshot
BRIEFING=$(dashboard briefing --format=yaml)

# 2. Extract key metrics
OPEN_TASKS=$(echo "$BRIEFING" | yq '.openTasks.total')
BLOCKERS=$(echo "$BRIEFING" | yq '.blockers.count')
IN_PROGRESS=$(echo "$BRIEFING" | yq '.inProgress.count')

# 3. Log briefing
dashboard activity log \
  --type=briefing \
  --agent=hektor \
  --title="Morning Briefing: $OPEN_TASKS tasks, $BLOCKERS blockers" \
  --details="{\"openTasks\":$OPEN_TASKS,\"blockers\":$BLOCKERS,\"inProgress\":$IN_PROGRESS}"

# 4. Check for blockers
if [ "$BLOCKERS" -gt 0 ]; then
  # Get blocker details
  BLOCKER_IDS=$(echo "$BRIEFING" | yq '.blockers.tasks[]')
  
  # Escalate to #alerts
  echo "🚨 Blockers detected: $BLOCKER_IDS"
  # → Telegram notification via message tool
fi

# 5. Pull next high-priority task
NEXT_TASK=$(dashboard task list --status=backlog --priority=high --format=ids | head -1)

if [ -n "$NEXT_TASK" ]; then
  echo "📋 Next task: $NEXT_TASK"
  # Optional: Auto-start if no blockers
  if [ "$BLOCKERS" -eq 0 ]; then
    dashboard task update "$NEXT_TASK" --status=in-progress --assignee=hektor
    dashboard activity log --type=task --agent=hektor --title="Started: $NEXT_TASK"
  fi
fi
```

---

## Hektor Task Execution Loop

### Start Task

```bash
TASK_ID="HEKTOR-003"

# 1. Update task status
dashboard task update "$TASK_ID" --status=in-progress --assignee=hektor

# 2. Log start
dashboard activity log \
  --type=task \
  --agent=hektor \
  --title="Started: $TASK_ID" \
  --details="{\"taskId\":\"$TASK_ID\",\"action\":\"started\"}"

# 3. Get task details
dashboard task get "$TASK_ID"
```

### Complete Task

```bash
TASK_ID="HEKTOR-003"
ACTUAL_HOURS=3

# 1. Update task status + hours
dashboard task update "$TASK_ID" \
  --status=done \
  --actual-hours="$ACTUAL_HOURS"

# 2. Log completion
dashboard activity log \
  --type=task \
  --agent=hektor \
  --title="Completed: $TASK_ID" \
  --details="{\"taskId\":\"$TASK_ID\",\"action\":\"completed\",\"outcome\":\"Implementation successful\",\"actualHours\":$ACTUAL_HOURS}"
```

### Block Task

```bash
TASK_ID="HEKTOR-003"
REASON="Missing API key"

# 1. Log blocker
dashboard activity log \
  --type=blocked \
  --agent=hektor \
  --title="Blocked: $TASK_ID" \
  --details="{\"taskId\":\"$TASK_ID\",\"reason\":\"$REASON\",\"attemptsCount\":7,\"needsLaurenz\":true}"

# 2. Escalate to #alerts
echo "🚨 Blocker: $TASK_ID — $REASON. 7 attempts. Need input."
# → Telegram notification via message tool
```

---

## Hektor Evening Summary (Automated — 21:00)

**Trigger:** Cron job sends system event to Hektor

**Workflow:**

```bash
#!/bin/bash

# 1. Get briefing
BRIEFING=$(dashboard briefing --format=yaml)

# 2. Get today's activity
TODAY=$(date +%Y-%m-%d)
ACTIVITY=$(dashboard activity list --limit=100 --format=json | jq "[.[] | select(.timestamp | startswith(\"$TODAY\"))]")

# 3. Extract metrics
TASKS_COMPLETED=$(echo "$ACTIVITY" | jq '[.[] | select(.type=="task" and (.title | contains("Completed")))] | length')
RESEARCH_COMPLETED=$(echo "$ACTIVITY" | jq '[.[] | select(.type=="research" and (.title | contains("Completed")))] | length')

# 4. Get cost data
COST=$(dashboard cost --from="$TODAY" --to="$TODAY" --format=yaml)
COST_TODAY=$(echo "$COST" | yq '.dailyCosts[0].cost')

# 5. Log evening summary
dashboard activity log \
  --type=briefing \
  --agent=hektor \
  --title="Evening Summary: $TASKS_COMPLETED tasks, $RESEARCH_COMPLETED research" \
  --details="{\"tasksCompleted\":$TASKS_COMPLETED,\"researchCompleted\":$RESEARCH_COMPLETED,\"costToday\":$COST_TODAY}"

# 6. Write to daily log
echo "## Evening Summary ($TODAY)" >> memory/$(date +%Y-%m-%d).md
echo "" >> memory/$(date +%Y-%m-%d).md
echo "- Tasks completed: $TASKS_COMPLETED" >> memory/$(date +%Y-%m-%d).md
echo "- Research completed: $RESEARCH_COMPLETED" >> memory/$(date +%Y-%m-%d).md
echo "- Cost today: \$$COST_TODAY" >> memory/$(date +%Y-%m-%d).md
```

---

## Scout Research Workflow

### Check Research Queue (Automated — 08:00)

```bash
#!/bin/bash

# 1. Get pending research
PENDING=$(dashboard research list --status=pending --assignee=scout --format=ids)
PENDING_COUNT=$(echo "$PENDING" | wc -l | tr -d ' ')

# 2. Get in-progress research
IN_PROGRESS=$(dashboard research list --status=in-progress --assignee=scout --format=ids)

# 3. Log check-in
dashboard activity log \
  --type=briefing \
  --agent=scout \
  --title="Scout Check-In: $PENDING_COUNT pending, $(echo "$IN_PROGRESS" | wc -l | tr -d ' ') in-progress" \
  --details="{\"pendingCount\":$PENDING_COUNT}"

# 4. Alert if backlog
if [ "$PENDING_COUNT" -gt 5 ]; then
  echo "📋 Scout backlog at $PENDING_COUNT items"
  # → Telegram #coordination notification
fi
```

### Start Research

```bash
RESEARCH_ID="RES-001"

# 1. Update status
dashboard research update "$RESEARCH_ID" --status=in-progress

# 2. Log start
dashboard activity log \
  --type=research \
  --agent=scout \
  --title="Started: $RESEARCH_ID" \
  --details="{\"researchId\":\"$RESEARCH_ID\",\"action\":\"started\"}"

# 3. Get research details
dashboard research get "$RESEARCH_ID"
```

### Complete Research

```bash
RESEARCH_ID="RES-001"
FINDINGS_FILE="memory/untrusted/competitor-analysis.md"

# 1. Complete with findings
dashboard research complete "$RESEARCH_ID" --findings-file="$FINDINGS_FILE"

# 2. Log completion
dashboard activity log \
  --type=research \
  --agent=scout \
  --title="Completed: $RESEARCH_ID" \
  --details="{\"researchId\":\"$RESEARCH_ID\",\"action\":\"completed\",\"findingsSummary\":\"5 competitors identified, pricing \$200-500\"}"

# 3. Telegram notification to #research
echo "✅ Research complete: $(dashboard research get "$RESEARCH_ID" --format=yaml | yq '.question')"
# → Telegram #research notification
```

---

## Cross-Agent Coordination — Pipeline

### Scout Finds Lead

```bash
LEAD_NAME="Acme Corp"
PROJECT="lead-gen"

# 1. Create pipeline item
PIPELINE_ID=$(dashboard pipeline create \
  --name="$LEAD_NAME" \
  --type=lead \
  --project="$PROJECT" \
  --status=research \
  --assignee=scout \
  --data='{"website":"https://acme.com","industry":"SaaS"}' \
  --format=ids)

# 2. Log creation
dashboard activity log \
  --type=pipeline \
  --agent=scout \
  --title="New Lead: $LEAD_NAME" \
  --details="{\"pipelineId\":\"$PIPELINE_ID\",\"action\":\"created\"}"
```

### Scout Qualifies Lead → Hektor

```bash
PIPELINE_ID="PIPE-001"

# 1. Update status + data
dashboard pipeline update "$PIPELINE_ID" \
  --status=qualified \
  --data='{"email":"contact@acme.com","decisionMaker":"Jane Smith, CTO","notes":"Fit confirmed, budget available"}'

# 2. Log handoff
dashboard activity log \
  --type=pipeline \
  --agent=scout \
  --title="Lead Qualified: $(dashboard pipeline get "$PIPELINE_ID" --format=yaml | yq '.name') → Hektor" \
  --details="{\"pipelineId\":\"$PIPELINE_ID\",\"action\":\"qualified\",\"handoff\":\"hektor\"}"

# 3. SSE event triggers Hektor notification (automatic)
```

### Hektor Takes Over Lead

```bash
PIPELINE_ID="PIPE-001"

# 1. Assign to self
dashboard pipeline update "$PIPELINE_ID" --assignee=hektor

# 2. Log handoff acceptance
dashboard activity log \
  --type=pipeline \
  --agent=hektor \
  --title="Taking over: $(dashboard pipeline get "$PIPELINE_ID" --format=yaml | yq '.name')" \
  --details="{\"pipelineId\":\"$PIPELINE_ID\",\"action\":\"handoff_accepted\"}"

# 3. Create outreach task
LEAD_NAME=$(dashboard pipeline get "$PIPELINE_ID" --format=yaml | yq '.name')
TASK_ID=$(dashboard task create \
  --title="Outreach: $LEAD_NAME" \
  --project=lead-gen \
  --priority=high \
  --assignee=hektor \
  --format=ids)

echo "📋 Created task $TASK_ID for $LEAD_NAME outreach"
```

---

## Model Routing Integration

### Log Model Switch

```bash
TASK_ID="HEKTOR-003"
MODEL="sonnet"
REASON="Complex API design decisions"

dashboard activity log \
  --type=model \
  --agent=hektor \
  --title="Model: Sonnet for $TASK_ID" \
  --details="{\"model\":\"$MODEL\",\"taskId\":\"$TASK_ID\",\"reason\":\"$REASON\",\"inputTokens\":2000,\"outputTokens\":500,\"estimatedCost\":0.0075}"
```

### Check Budget Status

```bash
# Get current month cost
COST=$(dashboard cost --format=yaml)
USED=$(echo "$COST" | yq '.budget.used')
PERCENT=$(echo "$COST" | yq '.budget.percent')

echo "Budget: \$$USED / \$165 ($PERCENT%)"

# Alert if >80%
if (( $(echo "$PERCENT > 80" | bc -l) )); then
  echo "🚨 Budget at $PERCENT%. Optimize model usage."
  # → Telegram #alerts notification
fi
```

---

## Blocker Detection (Automated)

**Briefing API automatically detects tasks >24h in-progress without update.**

**Hektor's Response:**

```bash
# Get blockers from briefing
BLOCKERS=$(dashboard briefing --format=yaml | yq '.blockers.tasks[]')

for TASK_ID in $BLOCKERS; do
  echo "⚠️ Blocker detected: $TASK_ID"
  
  # Get task details
  TASK=$(dashboard task get "$TASK_ID" --format=yaml)
  
  # Self-Heal Protocol:
  # 1. Review task description
  # 2. Check MEMORY.md for context
  # 3. Try 5-10 approaches
  # 4. Document attempts
  
  # If exhausted:
  dashboard activity log \
    --type=blocked \
    --agent=hektor \
    --title="Blocked: $TASK_ID" \
    --details="{\"taskId\":\"$TASK_ID\",\"reason\":\"[REASON]\",\"attemptsCount\":7,\"needsLaurenz\":true}"
  
  # Escalate to #alerts
  echo "🚨 Blocker: $TASK_ID — [REASON]. 7 attempts. Need input."
done
```

---

## Cost Tracking Daily Check

```bash
# Get today's cost
TODAY=$(date +%Y-%m-%d)
COST_TODAY=$(dashboard cost --from="$TODAY" --to="$TODAY" --format=yaml | yq '.dailyCosts[0].cost')

# Get model split
MODEL_SPLIT=$(dashboard cost --format=yaml | yq '.modelSplit')

echo "Cost today: \$$COST_TODAY"
echo "Model split:"
echo "$MODEL_SPLIT" | yq -r '.[] | "  \(.model): $\(.cost) (\(.count) calls)"'
```

---

## Integration with AGENTS.md

**Add to Hektor's AGENTS.md:**

```markdown
## Dashboard-First Protocol

**Vor jedem Task:**
1. `dashboard task list --status=backlog` — Nächsten Task ziehen
2. `dashboard task update {id} --status=in-progress`
3. `dashboard activity log --type=task --action=started`

**Nach jedem Task:**
1. `dashboard task update {id} --status=done --actual-hours={hours}`
2. `dashboard activity log --type=task --action=completed --outcome="..."`

**Blocker:**
1. `dashboard activity log --type=blocked`
2. #alerts Telegram Message
```

**Add to Scout's AGENTS.md:**

```markdown
## Research Queue Protocol

**Check-In (täglich 08:00):**
1. `dashboard research list --status=pending --assignee=scout`
2. Prioritäten setzen

**Research Start:**
1. `dashboard research update {id} --status=in-progress`
2. `dashboard activity log --type=research --action=started`

**Research Complete:**
1. `dashboard research complete {id} --findings-file=findings.md`
2. `dashboard activity log --type=research --action=completed`
3. #research Telegram Notification
```
