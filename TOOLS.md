# Tools — Lokale Notizen

## Telegram Topic IDs (HQ Group)

| Topic | ID | Zweck |
|-------|----|----|
| #general | 1 | General Channel |
| #research | 2 | Scout Research Output |
| #coordination | 5 | Agent Coordination |
| #logs | 7 | Activity Logs |
| #alerts | 9 | Critical Alerts & Blockers |
| #hektor | 26 | Hektor Exclusive (Laurenz nur) |
| #scout | 27 | Scout Exclusive |

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
