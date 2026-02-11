# Dashboard Phase 2: Business-Model Tabs & Extended Data Models

## Context

Phase 1 (Live Infrastructure) ist complete:
- ✅ SSE Event Bus + /api/events
- ✅ Frontend Live Updates (alle 5 Tabs)
- ✅ Agent Workflow (/api/briefing, Blocker-Detection)
- ✅ Doc Viewer Scroll Fix

Jetzt kommt Phase 2: Das Dashboard von einem Todo-Manager zu einem Business Operations Hub erweitern.

---

## Phase 2 Ziele

1. **Pipeline Tab** — Kanban-Board für Lead Gen + Competitive Intelligence
2. **Research Queue Tab** — Scout's Arbeitsqueue mit Status tracking
3. **Business Insights Tab** — Aggregated Dashboard Widgets
4. **Cost Tracking** — Model usage + monthly burn-rate (Metrics Tab Extension)
5. **Task Schema erweitern** — deadline, assignee, blockedBy, estimatedHours, actualHours
6. **Cleanup** — night_task, recurring status, hardcoded prefixes entfernen

---

## 1. Pipeline Tab

**Zweck:** Lead Gen & CI sind Pipeline-Businesses. Tasks sind zu granular — wir brauchen einen Kanban-Flow.

### UI Requirements

- Kanban-Board mit 4 Spalten:
  - **Research** (Scout findet Leads/Competitors)
  - **Qualified** (Hektor bewertet)
  - **Approved** (Laurenz sagt go)
  - **Delivered** (Output an Kunde)
- Drag & Drop zwischen Spalten
- Filter: `type` (lead | competitor | opportunity), `project`, `assignee`
- Click auf Item → Detail-View (editable)
- "Add Pipeline Item" Button (öffnet Modal)

### Data Model: Pipeline Items

```typescript
interface PipelineItem {
  id: string;                    // e.g. "PIPE-001"
  type: "lead" | "competitor" | "opportunity";
  name: string;                  // Company/Person name
  status: "research" | "qualified" | "approved" | "delivered";
  project: string;               // Which client/business-model?
  assignee: "hektor" | "scout";
  data: Record<string, any>;     // Flexible JSON (email, website, notes)
  createdAt: string;
  updatedAt: string;
  movedToStatusAt: string;       // Timestamp when status last changed
}
```

### API Routes

```typescript
GET    /api/pipeline              // List all pipeline items (query: type, project, status)
POST   /api/pipeline              // Create new pipeline item
GET    /api/pipeline/:id          // Get single item
PATCH  /api/pipeline/:id          // Update item (status, assignee, data)
DELETE /api/pipeline/:id          // Delete item
```

### SSE Events

- `pipeline:created` — New item added
- `pipeline:updated` — Item moved/edited
- `pipeline:deleted` — Item deleted

---

## 2. Research Queue Tab

**Zweck:** Scout braucht eine dedizierte Queue von Research-Anfragen mit Status tracking.

### UI Requirements

- 3 Listen-Sections:
  - **Pending** (Laurenz requested)
  - **In Progress** (Scout working)
  - **Completed** (Scout done, Hektor reviewing)
- Click auf Research Item → Detail-View mit findings (Markdown preview)
- "New Research Request" Button
- Priority badge (low/medium/high)
- Deadline indicator (red wenn overdue)

### Data Model: Research Requests

```typescript
interface ResearchRequest {
  id: string;                    // e.g. "RES-001"
  question: string;              // "Who are the top 5 competitors?"
  context: string;               // Background info
  priority: "low" | "medium" | "high";
  requestedBy: "hektor" | "laurenz";
  assignee: "scout";
  status: "pending" | "in-progress" | "completed";
  findings: string | null;       // Markdown output (null until completed)
  linkedDocs: string[];          // Related doc paths
  createdAt: string;
  updatedAt: string;
  deadline?: string;             // ISO timestamp
}
```

### API Routes

```typescript
GET    /api/research              // List all research requests (query: status, priority)
POST   /api/research              // Create new research request
GET    /api/research/:id          // Get single request
PATCH  /api/research/:id          // Update request (status, findings)
DELETE /api/research/:id          // Delete request
```

### SSE Events

- `research:created`
- `research:updated`
- `research:completed` — Special event when status → completed

---

## 3. Business Insights Tab

**Zweck:** High-level Dashboard mit aggregierten Widgets pro Business-Modell.

### UI Requirements

- Grid von Widgets (4 Spalten, responsive)
- Widgets (initial set):
  - **CI Widget**: "5 neue Competitor-Moves diese Woche"
  - **Newsletter Widget**: "3 Drafts ready, 2 pending approval"
  - **Data Enrichment Widget**: "200 Records enriched, 15 failed"
  - **Lead Gen Widget**: "50 Leads researched, 20 qualified"
- Click auf Widget → Filter entsprechendes Tab (z.B. Lead Gen → Pipeline Tab filtered)
- Auto-refresh via SSE (wenn neue Pipeline Items / Research / Tasks)

### Data Source

Aggregiert aus:
- `/api/pipeline` (count by status + type)
- `/api/research` (count by status)
- `/api/tasks` (count by project + status)
- `/api/activity` (recent activity, group by type)

### API Route

```typescript
GET /api/insights                // Returns aggregated stats for all business models
```

**Response Example:**
```json
{
  "leadGen": {
    "researched": 50,
    "qualified": 20,
    "delivered": 5
  },
  "ci": {
    "competitorMoves": 5,
    "activeTracking": 12
  },
  "newsletter": {
    "draftsReady": 3,
    "pendingApproval": 2
  },
  "dataEnrichment": {
    "recordsEnriched": 200,
    "failed": 15
  }
}
```

---

## 4. Cost Tracking (Metrics Tab Extension)

**Zweck:** Model usage tracking für Haiku/Sonnet/Opus mit monatlichem Budget-Tracking.

### UI Requirements (add to Metrics Tab)

- **Model Split Chart** (Pie/Bar): 85% Haiku, 10% Sonnet, 5% Opus (actual usage)
- **Daily Cost Graph** (Line chart): Last 30 days
- **Cost per Agent** (Bar chart): Hektor vs. Scout
- **Monthly Burn-Rate** (Big number): "$42.50 / $165 budget" (progress bar)
- **Cost per Business-Model** (Table): CI, Newsletter, Lead Gen breakdown

### Data Model: Activity Entry Extension

Existing `activity` entries erweitern um `type: "model"`:

```typescript
{
  type: "model",
  title: "Model: Sonnet for HEKTOR-001",
  timestamp: "2026-02-10T22:00:00Z",
  agent: "hektor",
  details: {
    model: "sonnet" | "haiku" | "opus",
    taskId?: string,              // Optional: related task
    inputTokens: 2000,
    outputTokens: 500,
    estimatedCost: 0.0075         // USD
  }
}
```

### API Routes

```typescript
GET /api/metrics/cost             // Returns cost aggregations
  ?from=2026-02-01                // Optional: date range
  &to=2026-02-28
```

**Response Example:**
```json
{
  "totalCost": 42.50,
  "dailyCosts": [
    { "date": "2026-02-01", "cost": 1.20 },
    { "date": "2026-02-02", "cost": 2.50 }
  ],
  "modelSplit": {
    "haiku": { "count": 850, "cost": 36.10 },
    "sonnet": { "count": 100, "cost": 5.40 },
    "opus": { "count": 50, "cost": 1.00 }
  },
  "agentSplit": {
    "hektor": 30.50,
    "scout": 12.00
  },
  "projectSplit": {
    "hektor-setup": 10.00,
    "ci": 15.00,
    "lead-gen": 17.50
  }
}
```

---

## 5. Task Schema Extensions

**Add to existing Task interface:**

```typescript
interface Task {
  // ... existing fields ...
  deadline?: string;              // ISO timestamp (optional)
  assignee?: "hektor" | "scout" | "laurenz";
  blockedBy?: string[];           // Array of task IDs
  blocks?: string[];              // Array of task IDs
  estimatedHours?: number;
  actualHours?: number;
}
```

**Remove:**
- `night_task` field (meaningless for 24/7 agents)

**Fix:**
- Remove `status: "recurring"` (unclear meaning)
- Make `taskId` dynamic from `project.id` instead of hardcoded prefixes

### API Changes

- `PATCH /api/tasks/:id` — Support new fields
- `GET /api/tasks` — Add query param `?assignee=hektor`
- Blocker detection: If `blockedBy` IDs are not resolved → flag task as blocked

---

## 6. Database Schema (SQLite)

Create new tables:

```sql
-- Pipeline Items
CREATE TABLE pipeline_items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  project TEXT,
  assignee TEXT,
  data TEXT,                     -- JSON
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  moved_to_status_at TEXT NOT NULL
);

-- Research Requests
CREATE TABLE research_requests (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  context TEXT,
  priority TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  assignee TEXT NOT NULL,
  status TEXT NOT NULL,
  findings TEXT,
  linked_docs TEXT,              -- JSON array
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deadline TEXT
);

-- Extend tasks table
ALTER TABLE tasks ADD COLUMN deadline TEXT;
ALTER TABLE tasks ADD COLUMN assignee TEXT;
ALTER TABLE tasks ADD COLUMN blocked_by TEXT;  -- JSON array
ALTER TABLE tasks ADD COLUMN blocks TEXT;      -- JSON array
ALTER TABLE tasks ADD COLUMN estimated_hours REAL;
ALTER TABLE tasks ADD COLUMN actual_hours REAL;
```

---

## Priorität & Reihenfolge

**High Priority (Do First):**
1. Pipeline Tab (kritisch für Business-Modelle)
2. Task Schema Extensions (deadline, assignee, blockedBy)
3. Research Queue Tab (Scout braucht das)

**Medium Priority:**
4. Cost Tracking (Metrics Tab Extension)
5. Business Insights Tab

**Low Priority (Nice-to-have):**
6. Cleanup (night_task removal, dynamic taskId)

---

## Acceptance Criteria

- [ ] Pipeline Tab: Kanban-Board mit Drag & Drop funktioniert
- [ ] Pipeline API: CRUD + SSE Events working
- [ ] Research Queue Tab: 3 Listen-Sections mit Status tracking
- [ ] Research API: CRUD + SSE Events working
- [ ] Task Schema: deadline, assignee, blockedBy fields in DB + API
- [ ] Cost Tracking: Metrics Tab zeigt Model usage + burn-rate
- [ ] Business Insights Tab: Widgets aggregieren Daten korrekt
- [ ] Live Updates: Alle neuen Tabs haben SSE integration
- [ ] Database Migrations: Keine Datenverluste

---

## Technical Notes

- Alle neuen API Routes: **SSE Events emittieren** nach Mutation
- Frontend: **useSSE Hook wiederverwenden** für Live Updates
- DB Migrations: **Safe migrations** (ALTER TABLE, nicht DROP)
- Drag & Drop: Use `@dnd-kit/core` (if not already installed)
- Markdown Preview: Use `react-markdown` für Research findings

Estimate: **4-5 days** (Pipeline + Research + Extensions + Cost Tracking)
