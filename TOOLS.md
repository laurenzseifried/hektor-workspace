# Tools — Lokale Notizen

## Model Routing

| Kategorie | Model |
|-----------|-------|
| Heartbeats, Status-Checks, Log-Parsing | Ollama (llama3.2:3b) |
| Routine: Tasks, Templates, Memory, Chat | Haiku (Default) |
| Kreativ/Analyse: Emails, Reports, Strategy | Sonnet |
| Irreversibel, explizit, Audit | Opus |

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
