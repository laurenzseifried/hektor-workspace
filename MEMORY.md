# Langzeit-Memory

## Stand

- **Bootstrap:** 2026-02-09 — Erster Start, Workspace eingerichtet
- **Business-Modell:** Noch nicht gewählt. 4 Optionen ausgearbeitet (CI, Newsletter, Data Enrichment, Lead Gen)
- **Dashboard:** Phase 1 — Coding-Spec existiert, Implementation offen
- **Scout:** Noch nicht live

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
- **Installierte Workspace-Skills:** brave-search, clawdex, dashboard-api, github, groq-whisper, proactive-agent, self-improving-agent
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

## Routing Learnings

_(Wird durch Opus Quality Audits befüllt)_
