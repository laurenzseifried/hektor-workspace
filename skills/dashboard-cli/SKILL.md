---
name: dashboard-cli
description: OpenClaw Dashboard CLI — ergonomic workflow tool for tasks, research, pipeline, activity logging, briefings, and cost tracking. Use when interacting with the Dashboard (localhost:3000) for task management, research coordination, pipeline workflows, or activity logging. Triggers include checking dashboard status, creating or updating tasks, logging activity, morning briefings, research queue management, pipeline workflows, and cost tracking.
---

# Dashboard CLI

Command-line interface for the OpenClaw Dashboard API. Provides ergonomic commands for task management, research coordination, pipeline workflows, activity logging, briefings, insights, and cost tracking.

**Binary:** `dashboard` (installed globally via `npm link`)

**Dashboard URL:** Defaults to `http://localhost:3000` (configurable via `DASHBOARD_URL` env var)

---

## Quick Reference

### Core Workflows

**Morning Briefing:**
```bash
dashboard briefing
```

**Task Workflow:**
```bash
# List next priority task
dashboard task list --status=backlog --priority=high --format=ids | head -1

# Start task
dashboard task update HEKTOR-003 --status=in-progress --assignee=hektor
dashboard activity log --type=task --agent=hektor --title="Started: HEKTOR-003"

# Complete task
dashboard task update HEKTOR-003 --status=done --actual-hours=3
dashboard activity log --type=task --agent=hektor --title="Completed: HEKTOR-003"
```

**Research Workflow (Scout):**
```bash
# Check queue
dashboard research list --status=pending --assignee=scout

# Start research
dashboard research update RES-001 --status=in-progress
dashboard activity log --type=research --agent=scout --title="Started: RES-001"

# Complete research
dashboard research complete RES-001 --findings-file=findings.md
dashboard activity log --type=research --agent=scout --title="Completed: RES-001"
```

---

## Commands

### Tasks

**List tasks:**
```bash
dashboard task list [--status=STATUS] [--priority=PRIORITY] [--project=PROJECT] [--assignee=ASSIGNEE] [--format=FORMAT]
```

Formats: `table` (default), `json`, `yaml`, `ids`

**Get task details:**
```bash
dashboard task get <taskId> [--format=FORMAT]
```

**Create task:**
```bash
dashboard task create --title="Task title" --project=PROJECT [--status=STATUS] [--priority=PRIORITY] [--assignee=ASSIGNEE] [--description=TEXT] [--deadline=ISO-DATE] [--estimated-hours=NUMBER]
```

**Update task:**
```bash
dashboard task update <taskId> [--status=STATUS] [--priority=PRIORITY] [--assignee=ASSIGNEE] [--deadline=ISO-DATE] [--actual-hours=NUMBER] [--blocked-by=TASK_ID] [--blocks=TASK_ID]
```

**Delete task:**
```bash
dashboard task delete <taskId>
```

---

### Research

**List research requests:**
```bash
dashboard research list [--status=STATUS] [--priority=PRIORITY] [--assignee=ASSIGNEE] [--format=FORMAT]
```

**Get research details:**
```bash
dashboard research get <researchId> [--format=FORMAT]
```

**Create research request:**
```bash
dashboard research create --question="Question text" [--context=TEXT] [--priority=PRIORITY] [--assignee=ASSIGNEE] [--deadline=ISO-DATE]
```

**Update research:**
```bash
dashboard research update <researchId> [--status=STATUS] [--priority=PRIORITY] [--findings=TEXT] [--findings-file=PATH] [--linked-docs=PATH]
```

**Complete research (shortcut):**
```bash
dashboard research complete <researchId> --findings=TEXT|--findings-file=PATH
```

---

### Pipeline

**List pipeline items:**
```bash
dashboard pipeline list [--type=TYPE] [--status=STATUS] [--project=PROJECT] [--assignee=ASSIGNEE] [--format=FORMAT]
```

Types: `lead`, `competitor`, `opportunity`  
Status: `research`, `qualified`, `approved`, `delivered`

**Get pipeline item:**
```bash
dashboard pipeline get <pipelineId> [--format=FORMAT]
```

**Create pipeline item:**
```bash
dashboard pipeline create --name="Item name" --type=TYPE --project=PROJECT [--status=STATUS] [--assignee=ASSIGNEE] [--data=JSON]
```

**Update pipeline item:**
```bash
dashboard pipeline update <pipelineId> [--status=STATUS] [--assignee=ASSIGNEE] [--data=JSON] [--name=NAME]
```

**Delete pipeline item:**
```bash
dashboard pipeline delete <pipelineId>
```

---

### Activity

**Log activity:**
```bash
dashboard activity log --type=TYPE --agent=AGENT --title="Title text" [--details=TEXT|JSON] [--details-file=PATH] [--project=PROJECT]
```

Types: `task`, `research`, `system`, `model`, `error`, `blocked`, `external`, `cost`, `pipeline`, `briefing`

**List activity:**
```bash
dashboard activity list [--type=TYPE] [--agent=AGENT] [--project=PROJECT] [--limit=NUMBER] [--format=FORMAT]
```

---

### Projects

**List projects:**
```bash
dashboard project list [--status=STATUS] [--all] [--format=FORMAT]
```

**Get project:**
```bash
dashboard project get <projectId> [--format=FORMAT]
```

**Create project:**
```bash
dashboard project create --name="Project name" [--emoji=EMOJI] [--color=HEX] [--charter=TEXT] [--charter-file=PATH]
```

**Update project:**
```bash
dashboard project update <projectId> [--name=NAME] [--status=STATUS] [--charter=TEXT] [--charter-file=PATH]
```

---

### Briefing

Get aggregated dashboard snapshot (open tasks, blockers, activity, pipeline, research):

```bash
dashboard briefing [--format=FORMAT]
```

**Output includes:**
- Open tasks (by priority)
- In-progress tasks
- Blockers (>24h stuck)
- Recent activity (last 24h)
- Active projects
- Pipeline items (by status)
- Research queue (by status)

**Use for:** Morning briefing, evening summary, status checks

---

### Insights

Get business metrics (Lead Gen, CI, Research, Tasks):

```bash
dashboard insights [--format=FORMAT]
```

**Output includes:**
- Lead Gen: researched/qualified/delivered counts
- Competitive Intelligence: competitor moves, active tracking
- Research Queue: pending/in-progress/completed counts
- Tasks: total/backlog/in-progress/done counts
- Recent activity count

---

### Cost Tracking

Get model usage and cost data:

```bash
dashboard cost [--from=YYYY-MM-DD] [--to=YYYY-MM-DD] [--format=FORMAT]
```

**Output includes:**
- Total cost
- Budget status (monthly budget, used amount, percentage)
- Model split (Haiku/Sonnet/Opus counts + costs)
- Agent split (Hektor/Scout costs)
- Daily costs (time series)

---

## Global Options

All commands support:
- `--help` — Show command help
- `--json` — Force JSON output (overrides `--format`)
- `--quiet` — Suppress non-essential output
- `--verbose` — Show debug info (HTTP requests, etc.)

---

## Output Formats

**table** (default for list commands):
```
ID            Title                          Status        Priority
────────────────────────────────────────────────────────────────────
HEKTOR-001    Review Model Routing Framework backlog       high
HEKTOR-002    Dashboard Workflow Integration done          high
```

**yaml** (default for get/briefing/insights/cost):
```yaml
id: HEKTOR-002
title: Dashboard Workflow Integration
status: done
priority: high
assignee: hektor
projectId: hektor-setup
```

**json**:
```json
{
  "id": "HEKTOR-002",
  "title": "Dashboard Workflow Integration",
  "status": "done",
  "priority": "high"
}
```

**ids** (for piping):
```
HEKTOR-001
HEKTOR-002
```

---

## Integration Patterns

### Hektor Morning Briefing (Cron: 07:00)

```bash
# Get snapshot
dashboard briefing

# Check for blockers
BLOCKERS=$(dashboard task list --status=in-progress | grep "⚠️" | wc -l)
if [ "$BLOCKERS" -gt 0 ]; then
  echo "🚨 Blockers detected"
  # Escalate to #alerts
fi

# Pull next task
NEXT_TASK=$(dashboard task list --status=backlog --priority=high --format=ids | head -1)
if [ -n "$NEXT_TASK" ]; then
  dashboard task update "$NEXT_TASK" --status=in-progress --assignee=hektor
  dashboard activity log --type=task --agent=hektor --title="Started: $NEXT_TASK"
fi
```

### Scout Research Check-In (Cron: 08:00)

```bash
# Check pending queue
PENDING=$(dashboard research list --status=pending --assignee=scout --format=ids)
if [ -n "$PENDING" ]; then
  echo "📋 Scout has pending research requests"
  # Process next research
fi
```

### Task Completion with Activity Logging

```bash
TASK_ID="HEKTOR-003"

# Complete task
dashboard task update "$TASK_ID" --status=done --actual-hours=3

# Log completion
dashboard activity log \
  --type=task \
  --agent=hektor \
  --title="Completed: $TASK_ID" \
  --details='{"outcome":"Implementation successful","blockers":"none"}'
```

### Model Switch Logging

```bash
dashboard activity log \
  --type=model \
  --agent=hektor \
  --title="Model: Sonnet for HEKTOR-003" \
  --details='{"model":"sonnet","reason":"Complex architecture decisions","taskId":"HEKTOR-003","estimatedCost":0.0075}'
```

---

## Workflow Tiers

**Tier 1: Full Workflow (>30min tasks)**
- Morning/Evening Briefing
- Task Start + Done + Activity Log
- Model routing logged
- Example: Large implementations, architecture work

**Tier 2: Light Workflow (10-30min tasks)**
- Task Done + Activity Log (completion only)
- Example: Config patches, skill installations, bug fixes

**Tier 3: No Tracking (<10min routine)**
- No dashboard interaction unless blocked
- Example: File operations, quick checks, routine maintenance

---

## Error Handling

**Exit codes:**
- `0` — Success
- `1` — General error
- `2` — API error
- `3` — Invalid arguments

**HTTP errors:**
- `404` → "Error: Resource not found"
- `500` → "Error: API error: <message>"
- Network error → "Error: Cannot connect to Dashboard API at <url>"

---

## Installation

```bash
cd ~/openclaw-dashboard
npm link
```

**Verify:**
```bash
dashboard --help
```

---

## Resources

### references/workflow-examples.md

See `references/workflow-examples.md` for complete agent workflow patterns including:
- Hektor daily operations (Morning/Evening)
- Scout research workflows
- Cross-agent coordination (Pipeline handoffs)
- Cost tracking integration
- Blocker detection and escalation
