# Tools — Lokale Notizen

## Telegram Topic IDs (HQ Group)

| Topic | ID | Zweck |
|-------|----|----|
| #general | 1 | General Channel |
| #research | 2 | Scout Research Output |
| #coordination | 5 | Agent Coordination |
| #logs | 7 | Activity Logs |
| #alerts | 9 | Critical Alerts & Blockers |

**Cross-Topic Posting:** `message action:send channel:telegram target:-1003808534190 threadId:9 message:"..."`

---

## Model Routing

→ Siehe AGENTS.md "Model Routing (Session-Model-Auswahl)" für vollständigen Decision Tree.

| Kategorie | Model |
|-----------|-------|
| Automatisierte Checks | Ollama (llama3.2:3b) |
| Strukturiert & vorhersagbar | Haiku (Default) |
| Kreativ/Analyse/Config | Sonnet |
| Irreversibel, explizit, Audit | Opus |

**Regel:** Model Routing ≠ Sub-Agent Spawning. Sub-Agents nur für parallele isolierte Arbeit.

## Dashboard API

```
Base: localhost:3000
Tasks:    GET/POST/PATCH/DELETE /api/tasks
Activity: POST /api/activity
Projects: GET/POST/PATCH/DELETE /api/projects
Memory:   GET /api/memory?agent=hektor
Docs:     GET /api/docs/list
```

## Verfügbare Skills (Built-in)

| Skill | Zweck | Braucht |
|-------|-------|---------|
| nano-banana-pro | Bildgenerierung/-edit (Gemini 3 Pro) | GOOGLE_API_KEY |
| nano-pdf | PDF-Verarbeitung | — |
| groq-whisper | Audio→Text (Groq API) | GROQ_API_KEY |
| brave-search | Web-Suche | BRAVE_API_KEY |
| coding-agent | Background Coding (CC/Codex) | — |
| github | gh CLI Integration | GITHUB_TOKEN |
| summarize | URL/Podcast/Video Zusammenfassung | — |
| video-frames | ffmpeg Frame-Extraktion | — |
| weather | Wetter (kein Key) | — |
| agentmail | Agent-Email-Inboxen | AGENTMAIL_API_KEY |
| linkedin | LinkedIn API (Maton) | MATON_API_KEY? |
| self-improvement | Learnings/Error-Tracking | — |
| proactive-agent | WAL Protocol, Working Buffer | — |

## API Keys (verfügbar, NICHT die Werte)

`GOOGLE_API_KEY` · `GROQ_API_KEY` · `BRAVE_API_KEY` · `GITHUB_TOKEN` · `AGENTMAIL_API_KEY` · `HUNTER_API_KEY` · `OLLAMA_API_KEY`

## Eskalation

- Stille Arbeit: Routine, kein Output
- #logs: Ergebnisse, Updates, Summaries
- #alerts: Freigabe, Fehler, Blocker, Anomalien

## Rate Limits

- Brave Search: 15 req/s (Free Tier)
- Anthropic: Standard Tier Limits beachten
- Ollama: Lokal, kein Limit

## Blocked Skills

Nie installieren: `crustafarian`, `ralph-evolver`, Crypto-Skills
