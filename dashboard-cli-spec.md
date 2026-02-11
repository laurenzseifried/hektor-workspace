# Dashboard CLI Tool — Implementation Spec

**Goal:** Build a Node.js CLI tool (`dashboard`) that wraps the OpenClaw Dashboard API for ergonomic agent workflows.

**Why:** Agents (Hektor & Scout) need to interact with the Dashboard as their central control system. `curl` commands are verbose and error-prone. A CLI tool is more natural and maintainable.

---

## Requirements

### 1. Installation & Setup

**Package Name:** `@openclaw/dashboard-cli` (or just `dashboard-cli`)

**Installation:**
```bash
cd ~/openclaw-dashboard
npm install -g .
# or: npm link
```

**Binary:** `dashboard` (accessible system-wide)

**Config:**
- Dashboard URL: `DASHBOARD_URL` env var or default `http://localhost:3000`
- No auth required (localhost-only API)

---

## 2. Command Structure

**Pattern:** `dashboard <resource> <action> [options]`

**Example:**
```bash
dashboard task list --status=backlog --priority=high
dashboard task get HEKTOR-002
dashboard task create --title="New task" --project=hektor-setup
dashboard task update HEKTOR-002 --status=done --actual-hours=3
dashboard task delete HEKTOR-002
```

---

## 3. Commands — Tasks

### `dashboard task list`

**Options:**
- `--status=<status>` (backlog | in-progress | recurring | done)
- `--priority=<priority>` (low | medium | high)
- `--project=<projectId>`
- `--assignee=<assignee>` (hektor | scout | laurenz)
- `--format=<format>` (table | json | ids) — default: table

**Output (table format):**
```
ID            Title                          Status        Priority  Assignee  Project
────────────────────────────────────────────────────────────────────────────────────────
HEKTOR-001    Review Model Routing Framework backlog       high      hektor    hektor-setup
HEKTOR-002    Dashboard Workflow Integration done          high      hektor    hektor-setup
```

**Output (ids format):**
```
HEKTOR-001
HEKTOR-002
```

**API:** `GET /api/tasks?status=...&priority=...`

---

### `dashboard task get <taskId>`

**Options:**
- `--format=<format>` (yaml | json | text) — default: yaml

**Output (yaml format):**
```yaml
id: HEKTOR-002
taskId: HEKTOR-002
title: Dashboard Workflow Integration
status: done
priority: high
assignee: hektor
projectId: hektor-setup
deadline: 2026-02-12T18:00:00Z
estimatedHours: 4
actualHours: 5
description: |
  Design and implement systematic dashboard integration...
linkedDocs:
  - docs/processes/dashboard-workflow.md
createdAt: 2026-02-10T19:17:35.240Z
updatedAt: 2026-02-11T06:12:04.553Z
```

**API:** `GET /api/tasks` (filter by taskId)

---

### `dashboard task create`

**Options:**
- `--title=<title>` (required)
- `--project=<projectId>` (required)
- `--status=<status>` (default: backlog)
- `--priority=<priority>` (default: medium)
- `--assignee=<assignee>`
- `--description=<description>`
- `--deadline=<ISO-date>`
- `--estimated-hours=<number>`

**Output:**
```
Created task HEKTOR-003
```

**API:** `POST /api/tasks`

---

### `dashboard task update <taskId>`

**Options:**
- `--title=<title>`
- `--status=<status>`
- `--priority=<priority>`
- `--assignee=<assignee>`
- `--description=<description>`
- `--deadline=<ISO-date>`
- `--estimated-hours=<number>`
- `--actual-hours=<number>`
- `--blocked-by=<taskId>` (can be repeated: `--blocked-by=A --blocked-by=B`)
- `--blocks=<taskId>` (can be repeated)

**Output:**
```
Updated task HEKTOR-002
```

**API:** `PATCH /api/tasks/<id>`

---

### `dashboard task delete <taskId>`

**Output:**
```
Deleted task HEKTOR-002
```

**API:** `DELETE /api/tasks/<id>`

---

## 4. Commands — Research

### `dashboard research list`

**Options:**
- `--status=<status>` (pending | in-progress | completed)
- `--priority=<priority>` (low | medium | high)
- `--assignee=<assignee>` (scout | hektor)
- `--format=<format>` (table | json | ids)

**Output (table format):**
```
ID        Question                              Status        Priority  Assignee  Deadline
──────────────────────────────────────────────────────────────────────────────────────────
RES-001   Top 5 AI appointment setting tools    completed     high      scout     2026-02-12
RES-002   Competitor pricing analysis           in-progress   medium    scout     -
```

**API:** `GET /api/research?status=...`

---

### `dashboard research get <researchId>`

**Options:**
- `--format=<format>` (yaml | json | text)

**Output (yaml format):**
```yaml
id: RES-001
question: Who are the top 5 AI appointment setting competitors?
context: Market entry evaluation. Need pricing + features.
status: completed
priority: high
assignee: scout
requestedBy: hektor
findings: |
  ## Summary
  
  5 Competitors identified:
  1. Calendly AI ($200/appointment)
  ...
linkedDocs:
  - memory/untrusted/competitor-analysis.md
deadline: 2026-02-12T18:00:00Z
createdAt: 2026-02-10T10:00:00Z
updatedAt: 2026-02-11T08:00:00Z
```

**API:** `GET /api/research` (filter by id)

---

### `dashboard research create`

**Options:**
- `--question=<question>` (required)
- `--context=<context>`
- `--priority=<priority>` (default: medium)
- `--assignee=<assignee>` (default: scout)
- `--requested-by=<requestedBy>` (default: hektor)
- `--deadline=<ISO-date>`

**Output:**
```
Created research request RES-003
```

**API:** `POST /api/research`

---

### `dashboard research update <researchId>`

**Options:**
- `--status=<status>`
- `--priority=<priority>`
- `--findings=<markdown-text>` (or `--findings-file=<path>`)
- `--linked-docs=<path>` (can be repeated)

**Output:**
```
Updated research RES-001
```

**API:** `PATCH /api/research/<id>`

---

### `dashboard research complete <researchId>`

**Shortcut for:** `dashboard research update <researchId> --status=completed --findings="..."`

**Options:**
- `--findings=<markdown-text>` (required)
- `--findings-file=<path>` (alternative to --findings)

**Output:**
```
Completed research RES-001
```

**API:** `PATCH /api/research/<id>`

---

## 5. Commands — Pipeline

### `dashboard pipeline list`

**Options:**
- `--type=<type>` (lead | competitor | opportunity)
- `--status=<status>` (research | qualified | approved | delivered)
- `--project=<projectId>`
- `--assignee=<assignee>`
- `--format=<format>` (table | json | ids)

**Output (table format):**
```
ID          Name            Type          Status      Assignee  Project
───────────────────────────────────────────────────────────────────────
PIPE-001    Acme Corp       lead          qualified   scout     lead-gen
PIPE-002    Beta Inc        competitor    research    scout     ci
```

**API:** `GET /api/pipeline?type=...&status=...`

---

### `dashboard pipeline get <pipelineId>`

**Options:**
- `--format=<format>` (yaml | json | text)

**Output (yaml format):**
```yaml
id: PIPE-001
type: lead
name: Acme Corp
status: qualified
project: lead-gen
assignee: scout
data:
  website: https://acme.com
  industry: SaaS
  email: contact@acme.com
  notes: Fit confirmed, budget available
createdAt: 2026-02-10T14:00:00Z
updatedAt: 2026-02-11T09:00:00Z
movedToStatusAt: 2026-02-11T09:00:00Z
```

**API:** `GET /api/pipeline/<id>`

---

### `dashboard pipeline create`

**Options:**
- `--name=<name>` (required)
- `--type=<type>` (required)
- `--project=<projectId>` (required)
- `--status=<status>` (default: research)
- `--assignee=<assignee>` (default: scout)
- `--data=<json>` (flexible metadata)

**Example:**
```bash
dashboard pipeline create \
  --name="Acme Corp" \
  --type=lead \
  --project=lead-gen \
  --data='{"website":"https://acme.com","industry":"SaaS"}'
```

**Output:**
```
Created pipeline item PIPE-003
```

**API:** `POST /api/pipeline`

---

### `dashboard pipeline update <pipelineId>`

**Options:**
- `--status=<status>`
- `--assignee=<assignee>`
- `--data=<json>`
- `--name=<name>`

**Output:**
```
Updated pipeline item PIPE-001
```

**API:** `PATCH /api/pipeline/<id>`

---

### `dashboard pipeline delete <pipelineId>`

**Output:**
```
Deleted pipeline item PIPE-001
```

**API:** `DELETE /api/pipeline/<id>`

---

## 6. Commands — Activity

### `dashboard activity log`

**Options:**
- `--type=<type>` (task | research | system | model | error | blocked | external | cost | pipeline | briefing)
- `--agent=<agent>` (hektor | scout | system)
- `--title=<title>` (required)
- `--details=<details>` (text or JSON)
- `--details-file=<path>` (alternative to --details)
- `--project=<projectId>`

**Example:**
```bash
dashboard activity log \
  --type=task \
  --agent=hektor \
  --title="Started: HEKTOR-003" \
  --details='{"taskId":"HEKTOR-003","action":"started"}' \
  --project=hektor-setup
```

**Output:**
```
Logged activity (ID: 1770790405123)
```

**API:** `POST /api/activity`

---

### `dashboard activity list`

**Options:**
- `--type=<type>`
- `--agent=<agent>`
- `--project=<projectId>`
- `--limit=<number>` (default: 20)
- `--format=<format>` (table | json)

**Output (table format):**
```
Timestamp              Agent     Type       Title
───────────────────────────────────────────────────────────────────
2026-02-11 07:12:00    hektor    task       Completed: HEKTOR-002
2026-02-11 07:00:00    hektor    briefing   Morning Briefing: 3 tasks
2026-02-10 21:00:00    hektor    briefing   Evening Summary: 2 tasks done
```

**API:** `GET /api/activity?type=...&agent=...`

---

## 7. Commands — Projects

### `dashboard project list`

**Options:**
- `--status=<status>` (active | paused | archived)
- `--all` (include archived)
- `--format=<format>` (table | json | ids)

**Output (table format):**
```
ID               Name              Status    Color      Emoji
─────────────────────────────────────────────────────────────
hektor-setup     Hektor Setup      active    #0ea5e9    ⚙️
business         Business Models   active    #8b5cf6    💼
dashboard        Dashboard         active    #10b981    📊
```

**API:** `GET /api/projects?all=true`

---

### `dashboard project get <projectId>`

**Options:**
- `--format=<format>` (yaml | json | text)

**Output (yaml format):**
```yaml
id: hektor-setup
name: Hektor Setup
status: active
color: "#0ea5e9"
emoji: ⚙️
charter: |
  Bootstrap Hektor as COO agent...
createdAt: 2026-02-09T10:00:00Z
updatedAt: 2026-02-11T07:00:00Z
```

**API:** `GET /api/projects` (filter by id)

---

### `dashboard project create`

**Options:**
- `--name=<name>` (required)
- `--emoji=<emoji>`
- `--color=<hex-color>`
- `--charter=<markdown-text>`
- `--charter-file=<path>`

**Output:**
```
Created project lead-gen
```

**API:** `POST /api/projects`

---

### `dashboard project update <projectId>`

**Options:**
- `--name=<name>`
- `--status=<status>`
- `--charter=<markdown-text>`
- `--charter-file=<path>`

**Output:**
```
Updated project hektor-setup
```

**API:** `PATCH /api/projects/<id>`

---

## 8. Commands — Briefing

### `dashboard briefing`

**Options:**
- `--format=<format>` (yaml | json | text) — default: yaml

**Output (yaml format):**
```yaml
openTasks:
  total: 3
  byPriority:
    high: 1
    medium: 2
    low: 0
inProgress:
  count: 1
  tasks:
    - HEKTOR-003
blockers:
  count: 0
  tasks: []
recentActivity:
  last24h: 12
  byType:
    task: 5
    research: 3
    briefing: 2
    model: 2
projects:
  active: 3
  paused: 0
pipelineItems:
  total: 5
  byStatus:
    research: 2
    qualified: 2
    approved: 1
    delivered: 0
researchQueue:
  pending: 2
  inProgress: 1
  completed: 5
```

**API:** `GET /api/briefing`

---

## 9. Commands — Insights

### `dashboard insights`

**Options:**
- `--format=<format>` (yaml | json | text) — default: yaml

**Output (yaml format):**
```yaml
leadGen:
  researched: 50
  qualified: 20
  delivered: 5
ci:
  competitorMoves: 5
  activeTracking: 12
research:
  pending: 2
  inProgress: 1
  completed: 15
tasks:
  total: 10
  backlog: 3
  inProgress: 1
  done: 6
recentActivity: 42
```

**API:** `GET /api/insights`

---

## 10. Commands — Cost Metrics

### `dashboard cost`

**Options:**
- `--from=<YYYY-MM-DD>`
- `--to=<YYYY-MM-DD>`
- `--format=<format>` (yaml | json | text) — default: yaml

**Output (yaml format):**
```yaml
totalCost: 42.50
budget:
  monthly: 165.00
  used: 42.50
  percent: 25.8
modelSplit:
  haiku:
    count: 850
    cost: 36.10
  sonnet:
    count: 100
    cost: 5.40
  opus:
    count: 50
    cost: 1.00
agentSplit:
  hektor: 30.50
  scout: 12.00
dailyCosts:
  - date: 2026-02-10
    cost: 1.20
  - date: 2026-02-11
    cost: 2.50
```

**API:** `GET /api/metrics/cost?from=...&to=...`

---

## 11. Global Options

**All commands support:**
- `--help` — Show help for command
- `--json` — Force JSON output (overrides --format)
- `--quiet` — Suppress non-essential output
- `--verbose` — Show debug info (HTTP requests, etc.)

---

## 12. Error Handling

**HTTP errors:**
- 404 → "Error: Resource not found"
- 500 → "Error: API error: <message>"
- Network error → "Error: Cannot connect to Dashboard API at <url>"

**Exit codes:**
- 0 = Success
- 1 = General error
- 2 = API error
- 3 = Invalid arguments

---

## 13. Implementation Notes

**Tech Stack:**
- Node.js CLI (use `commander` or `yargs` for arg parsing)
- `node-fetch` or native `fetch` for HTTP requests
- `chalk` for colored output (optional)
- `js-yaml` for YAML formatting
- `cli-table3` for table output

**File Structure:**
```
openclaw-dashboard/
├── cli/
│   ├── index.js           # Main entry point (#!/usr/bin/env node)
│   ├── commands/
│   │   ├── task.js        # Task commands
│   │   ├── research.js    # Research commands
│   │   ├── pipeline.js    # Pipeline commands
│   │   ├── activity.js    # Activity commands
│   │   ├── project.js     # Project commands
│   │   ├── briefing.js    # Briefing command
│   │   ├── insights.js    # Insights command
│   │   └── cost.js        # Cost command
│   ├── lib/
│   │   ├── api.js         # API client (fetch wrapper)
│   │   ├── format.js      # Output formatters (table, yaml, json)
│   │   └── config.js      # Config (DASHBOARD_URL)
│   └── package.json       # CLI package config
└── package.json           # Main package.json (add "bin" entry)
```

**package.json bin entry:**
```json
{
  "name": "openclaw-dashboard",
  "bin": {
    "dashboard": "./cli/index.js"
  }
}
```

---

## 14. Testing

**Manual test script:**
```bash
# Tasks
dashboard task list
dashboard task create --title="Test task" --project=hektor-setup
dashboard task update HEKTOR-003 --status=in-progress
dashboard task get HEKTOR-003
dashboard task delete HEKTOR-003

# Research
dashboard research list
dashboard research create --question="Test question" --priority=high
dashboard research update RES-001 --status=completed --findings="Done"

# Pipeline
dashboard pipeline list
dashboard pipeline create --name="Test Lead" --type=lead --project=lead-gen

# Activity
dashboard activity log --type=task --agent=hektor --title="Test"
dashboard activity list --limit=5

# Briefing
dashboard briefing

# Insights
dashboard insights

# Cost
dashboard cost
```

---

## 15. Documentation

**README.md (in cli/ folder):**
- Installation instructions
- Quick start examples
- Full command reference
- Agent workflow examples

**Agent Integration:**
Update AGENTS.md with CLI examples instead of curl commands.

---

## Acceptance Criteria

- [x] All 8 resource types implemented (task, research, pipeline, activity, project, briefing, insights, cost)
- [x] Table, JSON, YAML output formats
- [x] Error handling with meaningful messages
- [x] Global options (--help, --json, --quiet, --verbose)
- [x] Installable via npm link
- [x] Works with localhost:3000 Dashboard
- [x] README with examples

---

**Next Steps:**
1. Claude Code implements CLI tool
2. Test all commands
3. Update dashboard-workflow.md with CLI examples
4. Update AGENTS.md (Hektor + Scout)
5. Install CLI globally (`npm link`)
6. Start 7-day test run
