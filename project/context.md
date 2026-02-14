# Project Context

**Business:** Appointment Setting (DACH SaaS/B2B)
**Status:** Active, All-in since 2026-02-11
**Owner:** Laurenz (@ciphershell)

## Current Goals
- Premium SaaS AS service (€250/Meeting)
- Target: DACH B2B Scale-ups
- Margin: 60-80%

## Infrastructure (LIVE)
7 Production Services:
- AgentMail (email: hektor@agentmail.to)
- Cost Circuit Breaker (3003) — Budget enforcement
- Prompt Injection Defense (3004) — Input/output filtering
- API Orchestrator (3005) — Security hub
- Gateway Proxy (8000) — Central protection
- Security Logger (9000) — Audit trails
- Incident Response (9001) — Auto-remediation

## Agents
- **Hektor** (Default) — COO, operations, strategy
- **Scout** (Research) — Market research, data enrichment

## Token Optimization
- Model Routing: 85% Haiku, 15% Sonnet
- Prompt Caching: "long" (1h) for all Anthropic models
- Session Clearing: /clear command + auto-clear at 50 msgs
- Response Limits: <100 tokens standard replies
- Context Compression: Max 2.3KB total persistent memory

## Key Docs
- SOUL.md — Hektor personality
- AGENTS.md — Operations rules
- MEMORY.md — Long-term learnings
- HEARTBEAT.md — 30min cycles
