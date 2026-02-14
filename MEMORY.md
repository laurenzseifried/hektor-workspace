# Langzeit-Memory

## Stand

- **Bootstrap:** 2026-02-09 — Erster Start, Workspace eingerichtet
- **Business-Modell:** APPOINTMENT SETTING (DACH SaaS/B2B Scale-ups) — All-in seit 2026-02-11
- **Dashboard:** ACTIVE (localhost:3000, pm2) — Tasks, Projects, Activity, Memory APIs operational
- **Scout:** LIVE (2026-02-11) — workspace-scout repo, Heartbeat 60min, DM with Laurenz
- **Autonomous Workflow:** ACTIVE (2026-02-11) — Hektor/Scout HEARTBEAT.md, Dashboard-driven loops
- **Cron Jobs:** 8 active (Backup 1AM, Audit 9PM, Briefing 8AM, Weekly Mon 10AM)

## Laurenz

- Direkt, keine Floskeln
- Will AI-Business aufbauen, sucht hohe Automatisierung
- Timezone: Europe/Berlin
- **Wichtige Regel:** Bei OpenClaw-Fragen (Configs, Probleme, Architektur, Features) IMMER Docs durchsuchen (`/opt/homebrew/lib/node_modules/openclaw/docs/` oder docs.openclaw.ai) — dort steht alles dokumentiert

## Model Routing — ACTIVE DECISION MATRIX

**Kernregel:** Model Routing = Hektor wählt sein Model pro Task. NICHT Sub-Agent spawnen für Model-Wechsel.

| Model | Wann | Beispiele |
|-------|------|-----------|
| Ollama (3b) | Automatisierte Checks | Heartbeats, Status, Log-Parse, JSON-Validate |
| Haiku | Strukturiert & vorhersagbar (DEFAULT) | CRUD, Templates, Memory, Dashboard, Dateiops |
| Sonnet | Kreativität / Analyse / Config | Emails, Reports, Strategy, Code Review, Agent-Config, Charters |
| Opus | Irreversibel / `/opus` / Quality Audit | Verträge, Pricing, Strategie-Pivots, Weekly Audit |

**Sub-Agents:** NUR für parallele, isolierte Background-Arbeit (Research, Bulk-Processing). NIEMALS für Model-Switching oder Config-Tasks.

**Model Routing Framework v2:** 4-Stufen Decision Tree dokumentiert in `/docs/frameworks/model-routing.md` (2026-02-10). Stufe 1: Irreversibel/Rechtlich → Opus (5%). Stufe 2-4: Complex/High-Cost/Creative → Haiku (85%) oder Sonnet (10%). Budget: ~$105-165/Mo bei 150 Tasks/Woche. Compact version in AGENTS.md "Auto-Routing Protokoll".

## Ollama Heartbeat — GELÖST (2026-02-10)

**Root Cause:** `tools.byProvider` mit `profile: "minimal"` + `allow: ["sessions_send"]` ergab leere Tools-Liste (Schnittmenge). OpenClaw schickte `tools: []` an Ollama → Model konnte keine Tool-Calls machen, halluzinierte stattdessen.

**Fix:** `profile` entfernt, nur `allow: ["session_status", "sessions_send"]` gesetzt.

**Zusätzlich:** API von `openai-completions` auf `openai-responses` gewechselt. Beides funktioniert prinzipiell, aber `openai-responses` ist der Default.

**Config (final):**
```json
"tools.byProvider": { "ollama/llama3.2:3b": { "allow": ["session_status", "sessions_send"] } }
"models.providers.ollama.api": "openai-responses"
"agents.defaults.heartbeat": { "every": "60m", "model": "ollama/llama3.2:3b", "target": "telegram" }
```

**Key Learning:** `profile` + `allow` in `byProvider` ist eine INTERSECTION, kein UNION. Wenn profile nur Tool A erlaubt und allow nur Tool B listet → leere Menge.

## Audio Processing

- **Methode:** Groq Whisper API (`groq-sdk`) — NICHT lokal
- **Skill:** `skills/groq-whisper/transcribe.js`
- **Models:** `whisper-large-v3-turbo` (default, schnell), `whisper-large-v3` (Translation/Accuracy)
- **Env:** `GROQ_API_KEY` erforderlich
- **Vorteile:** Kein lokaler Model-Download (~3GB), deutlich schneller, kein Python/brew nötig
- **Ersetzt:** `skills/openai-whisper` (lokale CLI-Installation)
- **Max Dateigröße:** 25 MB

## Skills & Config

- **coding-agentoj9u entfernt** (2026-02-10): Fehlerhafter Skill mit garbled Slug, war Duplikat des built-in `coding-agent`. In Trash verschoben. OpenClaw verwendet jetzt den korrekten built-in Skill unter `/opt/homebrew/lib/node_modules/openclaw/skills/coding-agent`.
- **openai-whisper entfernt** (2026-02-10): Deprecated, Groq Whisper ersetzt es. In Trash verschoben.
- **Installierte Workspace-Skills:** brave-search, clawdex, github, groq-whisper, proactive-agent, self-improving-agent
- **Security Audit (2026-02-10):** Alle 8 Skills gescannt mit skill-scanner (behavioral). LLM+Meta-Analyzer nicht verfügbar (API-Key fehlt). Ergebnis: 7/8 SAFE (nur INFO: missing license). clawdex: CRITICAL-Finding = **False Positive** (YARA triggered auf Doku-Text "Steal credentials", nicht echtem Code). Alle Skills nutzbar.
- **Skill-Installationen:** Ab 2026-02-10 **gesperrt** — kein Skill wird ohne Laurenz' ausdrückliches OK installiert.

## Lobster Workflows

- **Evaluiert:** 2026-02-10 — Lobster ist ein optionales Plugin Tool für deterministische Multi-Step-Pipelines mit Approval-Gates
- **Status:** CLI nicht installiert, Tool nicht in Config enabled
- **Brauchen wir das?** Ja, sehr wahrscheinlich für CI/Newsletter/Enrichment Workflows (Research → Approval → Publish)
- **Installation:** Pending nach Business-Modell-Wahl. Wenn Workflows definiert sind: (1) Lobster CLI von github.com/openclaw/lobster installieren, (2) `tools.alsoAllow: ["lobster"]` in Config, (3) eigene .lobster Workflow-Files schreiben
- **ClawHub Skills:** `lobster v1.0.1` und `lobster-jobs v1.0.0` evaluiert — NICHT installieren, wir schreiben eigene Workflows

## Proactive Agent Implementation

- **Skill:** proactive-agent v3.0.0 (Hal Stack) — vollständig implementiert 2026-02-10
- **SESSION-STATE.md:** Aktiv, WAL Protocol Target (aktuelle Task-Details, Blocker, Architecture)
- **memory/working-buffer.md:** Aktiv, Danger Zone Log ab 60% Context
- **AGENTS.md:** Erweitert um WAL Protocol, Working Buffer, Relentless Resourcefulness (10 Ansätze), VFM Scoring, Verify Before Done
- **notes/areas/proactive-tracker.md:** Reverse Prompting Queue, Recurring Patterns Log, Outcome Journal
- **Kernprinzipien:** Write before respond, buffer every exchange in danger zone, try 10 approaches, score improvements, verify outcomes

## Sub-Agent Webhook Architecture

- **Server:** `services/subagent-webhook/server.js` — Zero-dependency Node HTTP server
- **Endpoint:** `POST http://127.0.0.1:3001/webhooks/subagent-complete`
- **Payload:** `{ taskId, status, result?, error?, label?, timestamp }`
- **Results:** Logged to `.subagent-results/[taskId].json`
- **Client:** `services/subagent-webhook/client.js` — `reportComplete()` with 3x retry + exponential backoff
- **Telegram:** Forwards to #logs (topic 7) when `--telegram` flag or `TELEGRAM_NOTIFY=1`
- **Health:** `GET http://127.0.0.1:3001/health`
- **Autostart:** launchd plist at `services/subagent-webhook/com.openclaw.subagent-webhook.plist`
- **Install:** `cp plist ~/Library/LaunchAgents/ && launchctl load ~/Library/LaunchAgents/com.openclaw.subagent-webhook.plist`
- **Sub-Agent Integration:** Set `SUBAGENT_CALLBACK_URL` env or pass `callbackUrl` to `reportComplete()`
- **Status:** Installed as launchd service, active, tested (2026-02-10)

## Appointment Setting Business — LIVE (2026-02-11)

**Decision:** All-in auf Premium SaaS Appointment Setting (DACH)

**Why AS > Lead Gen:**
- Pricing: €250/Meeting vs €150/Lead
- Margin: 60-80% vs 40-50%
- Competition: KEINE großen AS-Agencies in DACH (Whitespace!)
- Scout Research: `/docs/appointment-setting-dach-scenarios.md` (DACH market analysis)

**Target ICP:**
- DACH SaaS/B2B Scale-ups (Series A+)
- 10-200 Mitarbeiter, €1M-€20M ARR
- Budget: €1K-€3K/Monat

**Pricing Model (Hybrid):**
- €2.000 base retainer
- €200/Meeting über 8 Meetings
- Durchschnitt: €2.800/Monat pro Client (10-14 Meetings)

## KontaktManufaktur — Brand & Infra (2026-02-13)

**Brand:** KontaktManufaktur
**Outreach Domain:** hallo-kontakt-manufaktur.de (GoDaddy)
**Stack:** Google Workspace (3 Accounts) + Instantly.ai + Hunter.io + DeBounce/ZeroBounce
**Kosten:** ~125 EUR/Mo
**Conversion:** Calendly → AI Reply Agent (later)
**Dashboard:** Projekt + Task KONTAKTMANUFAKTUR-001 + 2 Docs (timeline, setup guide)
**Playbook:** Matt Ganzak Cold Outreach (9 Phasen, Signal Detection → Dashboard)
**Architecture:** Hektor als Router, Sub-Agents für Execution, Task-Folder-Struktur
**Status:** Woche 1 — Domain gekauft, Google Workspace + DNS + Instantly als nächstes
**Scout:** On hold (kein Heartbeat, reagiert nur auf direkte Ansprache)

**Financial Projections (Year 1):**
- Month 1: €2.4K MRR (1 client)
- Month 3: €8.4K MRR (3 clients)
- Month 6: €22.4K MRR (8 clients)
- Month 12: €33.6K MRR (12 clients) → €246K revenue, 99% margin

**Tech Stack:**
- Data: Apollo.io (€49/Mo), Hunter.io (€49/Mo)
- Calendar: Calendly (€8/Mo)
- Email: Client domains (SMTP) or own domain
- Total Cost: €106/Mo + OpenClaw €50/Mo

**Workflow (7 Phases):**
1. Client Onboarding (Laurenz + Hektor)
2. Lead Research (Scout: Apollo, 20-50 leads/week)
3. Enrichment (Hektor: Hunter + Brave Search, scoring 1-10, filter 8+)
4. Outreach Drafting (Hektor: 3 templates A/B/C)
5. Outreach Execution (Hektor: send + track)
6. Meeting Booking (Hektor: Calendly)
7. Reporting (Hektor: weekly reports)

**Scout/Hektor Split:**
- Scout: Lead research + pre-enrichment (basic company data)
- Hektor: Qualification (scoring), outreach, booking, reporting

**Implementation Docs:**
- `/docs/appointment-setting-dach-scenarios.md` (21KB, 3 scenarios)
- `/docs/appointment-setting-implementation.md` (34KB, full workflow + tech + Week 1 plan)

**Week 1 Timeline (Feb 12-16):**
- Mon: APIs setup (Apollo, Hunter, Calendly)
- Tue: Workflow implementation (Scout + Hektor)
- Wed: Outreach testing (10 test emails)
- Thu: Dashboard (AS Clients, Lead Pipeline, Outreach Metrics)
- Fri: Integration + 20-lead batch test

**Next Steps:**
- Subscribe APIs (pending Laurenz GO)
- Create #lead-gen topic in Telegram
- Dashboard: AS Clients page, Lead Pipeline, Outreach Metrics, Weekly Reports

## Telegram Architecture (2026-02-11)

**Option 3 (Hybrid) — CHOSEN:**
- DM = Primary communication (Laurenz ↔ Hektor, Laurenz ↔ Scout)
- Group Topics = Business Results only (#lead-gen for AS results, #logs, #alerts)
- Agents post to topics from DM sessions via `message` tool

**Active Topics:**
- #general (1)
- #research (2) — Scout research output
- #coordination (5) — Agent coordination
- #logs (7) — Activity logs
- #alerts (9) — Critical alerts + blockers
- #lead-gen (TBD) — AS business results (leads, meetings, reports)

**Deleted Topics (2026-02-11):**
- #hektor (26), #scout (27) — redundant with DM architecture

## Skills Installed (2026-02-11)

**Original OpenClaw Skills (via Sub-Agent verification):**
- clawhub v4.3.1 (skill management)
- coding-agent v1.2.9 (background coding)
- github v5.0.7 (gh CLI integration)
- summarize v2.1.6 (transcripts, podcasts, URLs)
- blogwatcher v1.5.2 (RSS monitoring)

**Workspace Skills (pre-installed):**
- brave-search, clawdex, , groq-whisper, proactive-agent, self-improving-agent

**Skill Installation Protocol:**
- Sub-Agent spawning with Clawdex + skill-scanner verification BEFORE reading SKILL.md
- Security gate: NEVER read SKILL.md before verification

**Removed Skills:**
- agent-browser-clawdbot (redundant with built-in browser tool)
- coding-agentoj9u (garbled duplicate)
- openai-whisper (deprecated, replaced by groq-whisper)

## Workspace File Management Strategy (2026-02-11)

**Critical Discovery:** Config file size limits from hektor-setup.md (~/Hektor-Docs/hektor-setup.md Block 2):
- SOUL.md: max 1.200 chars (~300 tokens)
- IDENTITY.md: max 400 chars (~100 tokens)
- USER.md: max 800 chars (~200 tokens)
- AGENTS.md: max 3.200 chars (~800 tokens) ⚠️ Currently 12KB (4x over!)
- TOOLS.md: max 1.200 chars (~300 tokens) ⚠️ Currently 1.436 chars (over!)
- HEARTBEAT.md: max 600 chars (~150 tokens) ⚠️ Currently 1.491 chars (2.5x over!)
- **Total bootstrap budget: ~7.400 chars (~1.850 tokens)**
- MEMORY.md: Not defined, currently 10.8KB (on-demand load)

**Impact:** Every single API call injects these files. HEARTBEAT.md especially burns tokens on every request.

**Solutions under Investigation:**
1. Create workspace-file-management Skill (workflow + enforcement)
2. Research selective bootstrap loading (can we exclude files from auto-inject?)
3. Pre-commit hook to block commits if files exceed limits
4. Daily cron audit to flag over-limit files

**Current Status:** workspace-file-management skill reviewed by sub-agent. Three P0 blockers identified:
- Need pre-commit hook code
- Need MEMORY.md added to limits table
- Current files already violate the limits

**Key Question:** Can OpenClaw be configured to NOT load certain bootstrap files? (e.g., HEARTBEAT.md only for Ollama, not for normal chats). If yes, could reduce bootstrap tokens from 1.850 to ~600-800.

## Model Routing Rule Update (2026-02-11)

**New Rule — SILENT:** Model routing decisions (Haiku→Sonnet→Opus) must be made internally. Do NOT explain in chat ("Model Routing: Complex reasoning..."). Evaluate silently, then respond.

**Enforcement:** Added to AGENTS.md under Auto-Routing section.

## Documentation Workflow (2026-02-11)

**New Protocol — Task FIRST:**
1. Create task in Dashboard
2. Write doc in `/docs/` (NOT in workspace /docs/)
3. Commit + Push
4. Link doc in task (`linkedDocs`)
5. Mark task done

**Rationale:** Dashboard repo = where docs are stored and indexed. Workspace /docs/ files not visible in Dashboard.

## Hektor-Docs Access (2026-02-11)

**Problem Solved:** Permission issue accessing ~/Hektor-Docs resolved (timing issue).

**Files Found:**
- hektor-setup.md (64KB) — Original Hektor bootstrap + config guide
- hektor-bootstrap.md (29KB)
- hektor-docs structure available for consultation

**Key Content:**
- Config file size limits (referenced above)
- Token optimization strategies (Ollama, Model Routing, Session Management)
- Multi-agent architecture vision
- Security rules + autonomy levels

**Status:** HEKTOR-003 task created (Find & Review Hektor-Docs config limits). Can reference this now.

## Infrastructure & Operations (2026-02-13)

**Cron Jobs (Active):**
- Daily Backup (1AM): Git commit workspace
- Token Audit (9PM): Session token usage check
- Morning Briefing (8AM): Scout report to Telegram
- Weekly Maintenance (Mon 10AM): Health check

**Dashboard (localhost:3000, PM2):**
- Tasks API: Operational (12+ entries)
- Projects API: Operational (3 active)
- Activity API: Operational (logging events)
- Memory API: Ready (workspace paths pending config)
- PM2 Status: Running, auto-restart enabled
- Stability: Production migration complete (no crashes)

**Environment & Multi-Agent:**
- Hektor Workspace: ~/.openclaw/workspace
- Scout Workspace: ~/.openclaw/workspace-scout
- PM2 Note: Env vars require ecosystem.config.js (--env-file not supported)
- Ollama: Running (llama3.2:3b) for heartbeats + fallback

**Integration Stack:**
- Telegram: Heartbeat reports, alerts (topics #general, #research, #coordination, #logs, #alerts)
- GitHub: Workspace backups, dashboard source
- OpenClaw Gateway: Core orchestration (localhost:18789)

## Routing Learnings

_(Wird durch Opus Quality Audits befüllt)_
