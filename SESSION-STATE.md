# SESSION-STATE.md — WAL Working Memory

**Purpose:** Write-Ahead Log für Korrektionen, Entscheidungen, Präferenzen während einer Session.

**Regel:** Dies ist flüchtig (Session-Scope). Nach jeder wichtigen Korrektur/Entscheidung von Laurenz → SOFORT hier notieren, DANN entsprechend handeln.

**Nicht löschen** — nur nach Session-Ende (dann → MEMORY.md migrieren).

---

## Current Task

**WORKSPACE FILE OPTIMIZATION:** Reduce bootstrap token burn by trimming + selective loading investigation

**Status:** Design phase — workspace-file-management skill needs P0 fixes before deployment

**Critical Blocker:** Files already 2.5-4x over limits (HEARTBEAT.md +891 chars, AGENTS.md +236 chars)

**Next Steps:**
1. **Research selective bootstrap loading** (can OpenClaw exclude files from auto-inject?)
2. **Create workspace-file-management Skill** with pre-commit hook code
3. **Trim current files** (AGENTS.md → 3.2K, HEARTBEAT.md → 600 chars)
4. **Deploy daily audit cron** to prevent future overages

---

## Open Decisions (2026-02-11 evening)

1. **Selective bootstrap loading** — Should we configure OpenClaw to NOT auto-inject certain files?
   - Option A: Load all 6 files on every message (current, 1.850 tokens)
   - Option B: Load only essential 3 (AGENTS.md, SOUL.md, USER.md) normally; HEARTBEAT.md only for Ollama heartbeats
   - Impact: Could reduce from 1.850 → 600-800 tokens per request
   
2. **MEMORY.md size limit** — What should the limit be?
   - Sub-agent suggested: 3.000 chars (on-demand, not auto-loaded)
   - Currently: 10.8KB (needs trimming)

3. **Workspace-file-management skill priority** — Phase 1 (now) or Phase 2 (after AS stabilized)?

---

## Blockers

1. **Selective bootstrap loading unclear** — Need OpenClaw config docs clarification
2. **Skill not enforced** — Pre-commit hook missing from workspace-file-management design
3. **Current files over limits** — HEARTBEAT.md +891, AGENTS.md +236 chars
4. **MEMORY.md undefined** — No size limit in hektor-setup.md

---

## Architecture Notes

**AS Workflow (7 Phases):**
1. Client Onboarding (Laurenz sales call + Hektor setup)
2. Lead Research (Scout: Apollo, 20-50 leads/week)
3. Enrichment (Hektor: Hunter + Brave Search, score 1-10, filter 8+)
4. Outreach Drafting (Hektor: 3 templates A/B/C)
5. Outreach Execution (Hektor: send + track)
6. Meeting Booking (Hektor: Calendly)
7. Reporting (Hektor: weekly reports)

**Dashboard Changes Needed:**
- AS Clients page (client list, ICP management, metrics)
- Lead Pipeline (Kanban: Raw → Enriched → Contacted → Replied → Booked → Completed)
- Outreach Metrics (charts: emails sent, reply rate, booking rate)
- Weekly Reports (auto-generated PDFs)

**Implementation Docs:**
- `/docs/appointment-setting-dach-scenarios.md` (3 scenarios, financial projections)
- `/docs/appointment-setting-implementation.md` (full workflow, tech setup, Week 1 plan)
