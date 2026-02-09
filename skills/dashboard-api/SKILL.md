---
name: dashboard-api
description: OpenClaw Dashboard API on localhost:3000 — tasks, activity, projects, memory, docs
user-invocable: false
---

## Dashboard API — localhost:3000

No auth required (localhost only). Use `Content-Type: application/json` for POST/PATCH/PUT bodies.
Use `curl` for all API calls.

### Tasks

**GET /api/tasks** — all tasks (optional: `?project=<projectId>`)

**POST /api/tasks** — create task:
```json
{"title": "...", "status": "backlog", "projectId": "hektor-setup", "priority": "medium", "description": "..."}
```
- `status`: backlog | in-progress | recurring | done
- `priority`: low | medium | high
- `projectId`: must match an existing project id (e.g. "hektor-setup", "business", "dashboard")

**PUT /api/tasks?id=<id>** — update task:
```json
{"status": "in-progress"}
```

**DELETE /api/tasks?id=<id>** — delete task

### Activity Log

**POST /api/activity** — log activity:
```json
{"type": "task", "agent": "hektor", "title": "...", "details": "...", "project": "hektor-setup"}
```
- `type`: task | research | system | model | error | blocked | external | cost
- `agent`: hektor | scout | system
- `project`: optional, must match project id
- `details`: optional, longer description

**GET /api/activity** — all entries (optional filters: `?agent=hektor`, `?type=task`, `?project=...`)

### Projects

**GET /api/projects** — all active projects (`?all=true` includes archived)

**POST /api/projects** — create project:
```json
{"name": "...", "emoji": "...", "color": "#0ea5e9"}
```

**PATCH /api/projects/<id>** — update project:
```json
{"name": "...", "status": "active", "charter": "markdown text..."}
```
- `status`: active | paused | archived

**DELETE /api/projects/<id>** — archive project (soft delete, sets status to "archived")

### Memory (read-only)

**GET /api/memory?agent=hektor** — Hektor's memory files from workspace
**GET /api/memory?agent=scout** — Scout's memory files from workspace

Returns `{ files: [{ name, path, modified, content, type }] }`

### Docs

**GET /api/docs/list** — all business docs (returns `{ docs: ["path/file.md", ...] }`)
**GET /api/files?path=docs/charter.md** — read single doc content
**PUT /api/files** — write doc: `{"path": "docs/file.md", "content": "..."}`

### Metrics

**GET /api/metrics?range=day|week|month** — token usage, costs, agent activity, model routing

### Workflow Rules

Every significant action MUST be logged to the activity API:

1. **Start task**: PUT status `"in-progress"` + POST activity type `"task"`
2. **Complete task**: PUT status `"done"` + POST activity type `"task"`
3. **Blocker**: POST activity type `"blocked"` with details
4. **Research findings**: POST activity type `"research"`
5. **Errors**: POST activity type `"error"` with details
6. **Model/cost events**: POST activity type `"model"` or `"cost"`

Example — start a task:
```bash
curl -X PUT "http://localhost:3000/api/tasks?id=3" \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'

curl -X POST http://localhost:3000/api/activity \
  -H "Content-Type: application/json" \
  -d '{"type":"task","agent":"hektor","title":"Started: Gateway setup","project":"hektor-setup"}'
```

Example — log research:
```bash
curl -X POST http://localhost:3000/api/activity \
  -H "Content-Type: application/json" \
  -d '{"type":"research","agent":"scout","title":"Market analysis complete","details":"Found 3 competitors...","project":"business"}'
```
