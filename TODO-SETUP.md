# TODO: Setup & Klarung — Hektor + Scout

**Last Updated:** 2026-02-10 00:08 GMT+1  
**Status:** Post-Bootstrap, ready for operations

---

## CLARITY NEEDED (Laurenz-Entscheidungen)

### 🔴 Critical Path

1. **Business-Modell wählen**
   - [ ] Welches Modell startet als erstes? (CI / Newsletter / Data Enrichment / Lead Gen)
   - [ ] ICP definieren für das gewählte Modell
   - [ ] Konkrete Zielgruppe benennen (DACH, Branche, Firmengröße, Pain Point)
   - **Blocker for:** Alles weitere

2. **Telegram Topic-Routing Fixen**
   - [ ] Separate Bots pro Topic (cleanest) ODER Workaround akzeptieren?
   - Problem: Aktuell antworten Hektor + Scout beide in #scout-Topic
   - Option A: Scout-Bot nur in #scout, Hektor-Bot nur in #hektor (separate Gruppen?)
   - Option B: System-Prompts mit Topic-Hints (hacky aber funktioniert)
   - **Blocker for:** Smooth group chat workflow

3. **Scout onboarden**
   - [ ] Scout-Workspace setup? (~/.openclaw/workspace-scout existiert, aber nicht getestet)
   - [ ] Scout SOUL.md / AGENTS.md / USER.md schreiben (oder clone von Hektor?)
   - [ ] Scout daily heartbeat + reporting Setup
   - **Blocker for:** Multi-agent research workflows

### 🟡 Clarifications (Nice-to-have für Start)

4. **Dashboard Priorität**
   - [ ] Welche Tabs sind MVP? (Tasks + Activity reichen für jetzt?)
   - [ ] Braucht ihr Memory-Tab live oder kann das später kommen?
   - [ ] Docs-Tab: Brauchst du das täglich oder nur ad-hoc?

5. **Newsletter Details (wenn das Modell gewählt wird)**
   - [ ] Welche Nische/Branche für Newsletter?
   - [ ] Automation-Level: Voll automated oder Human-in-Loop nach jedem Draft?
   - [ ] Publishing-Tool: Beehiiv / Substack / Custom?

6. **Skill-Installation-Reihenfolge**
   - [ ] Braucht ihr lieber native Skills (Gmail, Calendar, GitHub) ODER ClawHub Skills?
   - [ ] Welche Integrationen sind MVP? (Git, Email, Webhooks?)

---

## IMMEDIATE TODO (Hektor kann ohne Laurenz machen)

### ✅ Abgeschlossen
- [x] OpenClaw Gateway running (port 18789)
- [x] Dashboard Production (pm2, localhost:3000)
- [x] Hektor Agent configured + heartbeats active
- [x] Telegram dual-bot setup (hektor + scout tokens)
- [x] Self-improving-agent + proactive-agent systems implemented
- [x] Dashboard API: POST/GET working, DELETE fixed
- [x] Memory: local embeddings active, .learnings/ structure ready
- [x] Daily logs + Working Buffer active
- [x] Smoke tests: all systems operational

### 🔄 In Progress (Hektor verantwortlich)

7. **Scout Onboarding**
   - [ ] Read scout workspace directory structure
   - [ ] Create Scout SOUL.md (Research Analyst, proactive, detail-focused)
   - [ ] Create Scout USER.md (Laurenz profile)
   - [ ] Create Scout AGENTS.md (Operational rules)
   - [ ] Setup Scout heartbeat + daily logs
   - [ ] Verify scout can respond in #scout topic

8. **Skills Installation & Docs Review**
   - [ ] Review hektor-setup.md Block 6 (Skills) für nötige Skills
   - [ ] Determine priority: Native (GitHub, Gmail, Webhooks) vs ClawHub
   - [ ] Install Skills in order:
     1. `github` skill (for commits, issues, repo management)
     2. `gmail` skill (for email routing)
     3. `calendar` skill (for scheduling)
     4. Business-specific skills (TBD by Laurenz)
   - [ ] Verify each skill with test run
   - [ ] Document skill usage in workspace/SKILLS-ACTIVE.md

9. **Groq Whisper Setup (Deferred)**
   - [ ] Get exact OpenClaw config structure for Whisper from docs
   - [ ] Test with voice message once config correct
   - [ ] (Can defer until group operations are smooth)

### 📋 Documentation & Memory

10. **Session Recap → Daily Log**
    - [ ] Update memory/2026-02-10.md with:
      - Session progress: Bootstrap 100% done
      - Telegram Config Status: dual-bot routing issue identified
      - API Fixes: DELETE endpoint added + tested
      - Skills Pending: List what needs installing
      - Blocker List: What needs Laurenz input
    - [ ] Archive working-buffer.md to SESSION-STATE.md (for next compaction)

11. **Create STARTUP-CHECKLIST.md**
    - [ ] Checklist für Hektor jeden Tag (Morning Heartbeat):
      - Gateway health check
      - Dashboard responsive?
      - Latest daily log entry?
      - Any pending tasks in #alerts?
      - Token usage vs budget?

---

## SKILLS TO INSTALL (From hektor-setup.md Block 6)

**Priority Tier 1** (for Lead Gen):
- [ ] `github` — Commits, issues, repo ops
- [ ] `gmail` — Email routing, drafts reading
- [ ] `webhooks` — Incoming events
- [ ] `campaign-orchestrator` — Lead gen workflows

**Priority Tier 2** (Operational):
- [ ] `calendar` — Scheduling, meeting tracking
- [ ] `lobster` — Approval workflows (if ClawHub has it)

**Priority Tier 3** (Research):
- [ ] `apollo` or `hunter` — Lead data API (paid, TBD)
- [ ] `semrush` — SEO research (paid, TBD)

**Do NOT Install** (security):
- `crustafarian` (malware risk)
- `ralph-evolver` (experimental, unstable)
- Any crypto-related skills

---

## ARCHITECTURE NOTES

### Telegram Topic Routing (Issue #1)

**Current State:**
- Group ID: -1003808534190
- Topic 26 (#hektor): Hektor-Bot only (intent), but Scout also responds
- Topic 27 (#scout): Scout-Bot only (intent), but Hektor also responds
- General (#general): requireMention: true

**Root Cause:**
- Both bots in same group + Forum Mode = both receive all messages
- OpenClaw routes based on mention patterns, not bot identity
- `requireMention: false` = "@ not needed", NOT "only this agent answers"

**Solutions to Test (Priority Order):**
1. **Separate Groups** — Hektor in Group A, Scout in Group B (cleanest but split view)
2. **Topic-Specific Bots** — Add/remove bots from topics (limited by Telegram UI)
3. **System Prompts with Topic Hints** — Each agent: "in topic 27, don't answer unless @scout" (hacky)
4. **Privacy Mode per Bot** — Scout bot Privacy ON = only @scout mentions received (may break other UX)

### Multi-Agent Architecture (Phase 2)

From multi-agent-architektur.md: When Research becomes bottleneck:
- Spin up second Docker container with `lead-finder` + `lead-enricher` agents
- Keep Hektor as COO in Host gateway
- Same dashboard, same memory model, just parallel units

No action needed for now — document in memory, revisit when MVP is working.

---

## KNOWN ISSUES & WORKAROUNDS

| Issue | Status | Workaround |
|-------|--------|-----------|
| Telegram topic routing (both agents respond) | 🔴 Blocking UX | Decide on solution above |
| Groq Whisper config structure unclear | 🟡 Deferred | Test once group routing fixed |
| Dashboard Activity API logging (crons not yet integrated) | 🟡 Optional | Can add later when needed |
| Sub-agent reliability (per docs) | 🟡 Known | Always verify results, use timeout buffers |

---

## SUCCESS CRITERIA (EOD Tomorrow)

- [ ] Scout onboarded + responds in #scout (without Laurenz @mention)
- [ ] Telegram routing issue resolved (Laurenz decides on approach)
- [ ] 2-3 critical skills installed + tested
- [ ] Daily log complete + next steps documented
- [ ] Ready to pick business model + start Phase 1

---

## NEXT SESSION AGENDA

1. **Laurenz Input (10m):**
   - Business model pick
   - Telegram routing decision
   - Skills priority list

2. **Hektor Work (30-60m):**
   - Scout onboarding complete
   - Telegram routing implemented
   - Skills installed

3. **First Real Task (if time):**
   - Create CI demo report OR
   - Setup first Newsletter research run OR
   - Decide based on business model chosen

---

**Prepared by:** Hektor  
**For Review by:** Laurenz  
**Next Sync:** 2026-02-10 Morning Briefing
