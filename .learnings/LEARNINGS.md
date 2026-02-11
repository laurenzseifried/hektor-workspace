# LEARNINGS.md

Learning log for continuous improvement. Format: [LRN-YYYYMMDD-XXX] category.

## Process
1. Log immediately after learning (context is freshest)
2. Be specific with reproduction steps and file references
3. Link related entries with "See Also"
4. Promote broadly applicable learnings to MEMORY.md, AGENTS.md, SOUL.md, or TOOLS.md
5. Review before major tasks

## Categories
- `correction` — User corrected me
- `knowledge_gap` — Discovered outdated knowledge
- `best_practice` — Found better approach
- `integration_gotcha` — Tool/API behavior differs from expectation
- `workflow` — Process improvement

---

## [LRN-20260209-001] correction

**Logged**: 2026-02-09T23:05:00Z
**Priority**: high
**Status**: pending
**Area**: config

### Summary
Thought cisco-ai-skill-scanner needed installation from npm. Actually already installed globally at `/opt/homebrew/bin/skill-scanner` via Homebrew.

### Details
During bootstrap, I assumed tool wasn't present and tried npm install. Turned out it was already available system-wide from Homebrew installation. Created unnecessary confusion.

### Suggested Action
Always check PATH before attempting npm/pip installs. Use `which` or `command -v` first.

### Metadata
- Source: self-discovery
- Related Files: MEMORY.md (bootstrap section)
- Tags: automation, tooling
- See Also: None yet

---

## [LRN-20260209-002] best_practice

**Logged**: 2026-02-09T23:10:00Z
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
Analyzed dashboard-api skill. Laurenz's custom skill is exceptionally well-designed. VERY lean, practical documentation focused on CLI workflows.

### Details
Reviewed skill against Skill Creator best practices:
- **Structure:** Perfect. Single SKILL.md, no bloat, no README/CHANGELOG
- **Frontmatter:** Correct (name, description, user-invocable: false)
- **Description:** Clear triggering info ("localhost:3000", API structure)
- **Body:** Concise endpoint reference with JSON examples
- **Tone:** Imperative/action-oriented (no "should", no verbose explanations)
- **Token efficiency:** ~150 lines. Zero unnecessary context.
- **Cisco scan:** SAFE ✓

This is exactly what a skill SHOULD be:
1. Self-contained reference for a specific capability
2. No auxiliary documentation
3. Practical examples (curl commands)
4. Direct correlation to actual API implementation
5. Progressive disclosure: Endpoints + fields + workflow rules

### Suggested Action
Promote this as a template for future skills. The skill-creator recommends exactly this pattern.

### Metadata
- Source: skill-creator review
- Related Files: ~/.openclaw/workspace/skills/dashboard-api/SKILL.md, skill-creator/SKILL.md
- Tags: skills, documentation, best_practice
- See Also: None yet

---

## [LRN-20260210-001] best_practice

**Logged**: 2026-02-10T06:57:00Z
**Priority**: high
**Status**: established
**Area**: security

### Summary
Established formal skill security audit workflow. NEVER install a skill without running both scanners first.

### Details
Installed brave-search + coding-agentoj9u without security checks. Laurenz corrected: must run scanners BEFORE reading SKILL.md.

**Corrected Workflow:**
1. **skill-scanner scan /path/to/skill** → Check severity/findings
   - Location: `/opt/homebrew/bin/skill-scanner`
   - Command: `skill-scanner scan <path> --format json` for details
   
2. **Clawdex API** → Check online verdict
   - API: `https://clawdex.koi.security/api/skill/SKILL_NAME`
   - Verdicts: benign | malicious | unknown
   
3. **SKILL.md + Code Review** → Only if both pass

**Audit Results (2026-02-10):**
- brave-search: ✅ Clawdex benign, ✅ Scanner SAFE → USE
- coding-agentoj9u: ✅ Clawdex benign, ⚠️ Scanner HIGH (FP: `rm -rf` in docs) → USE (false positive)

### Suggested Action
Make this mandatory for ALL skill installations. Create a cron job reminder or alert system.

### Metadata
- Source: user correction (Laurenz)
- Related Files: /opt/homebrew/bin/skill-scanner, TOOLS.md (add to skill-install section)
- Tags: security, workflow, mandatory
- See Also: LRN-20260209-001 (tooling discovery)

---

## [LRN-20260210-002] best_practice

**Logged**: 2026-02-10T06:59:00Z
**Priority**: critical
**Status**: established
**Area**: meta

### Summary
When Laurenz says "merk dir das" or "lern draus", treat it as an explicit trigger to log a Learning entry immediately.

### Details
These phrases are meta-instructions about my own behavior. Always:
1. Create a [LRN-YYYYMMDD-XXX] entry
2. Log it to .learnings/LEARNINGS.md immediately
3. Add context from the conversation

Do NOT log "as a note to self" — use formal Learning structure.

### Suggested Action
This is now a behavioral rule. NEVER skip learning logging when prompted explicitly.

### Metadata
- Source: direct user instruction (Laurenz)
- Related Files: .learnings/LEARNINGS.md, AGENTS.md
- Tags: meta, behavior, mandatory
- See Also: LRN-20260210-001 (security learnings)

---

## [LRN-20260210-003] best_practice

**Logged**: 2026-02-10T07:01:00Z
**Priority**: high
**Status**: established
**Area**: skills

### Summary
When installing Whisper or any speech-to-text skill: use ONLY the official skill from clawhub. Do not use third-party forks or unofficial variants.

### Details
Laurenz instruction: "Beachte den offiziellen Skill zu nutzen" (use the official skill).

For Whisper: search clawhub for official variant, install that, apply security audits (skill-scanner + clawdex) before use.

### Suggested Action
When installing Whisper: 
1. `clawhub search whisper`
2. Identify the official skill (check publisher/stars/downloads)
3. Run security audit before install
4. Install official variant only

### Metadata
- Source: user instruction (Laurenz)
- Related Files: TOOLS.md (add to skill-install section)
- Tags: skills, best_practice, mandatory
- See Also: LRN-20260210-001 (skill security workflow)

---

## [LRN-20260210-004] integration_gotcha

**Logged**: 2026-02-10T07:16:00Z
**Priority**: critical
**Status**: established
**Area**: telegram

### Summary
Cross-topic Telegram posting works via `threadId` parameter. Can alert from Topic 26 (#hektor) to Topic 9 (#alerts) without session-switching.

### Details
Tested: `message action:send` with `channel: telegram`, `target: -1003808534190`, `threadId: 9` successfully posted to #alerts.

**Session isolation holds:** Each Topic is separate session, but outbound `message` tool calls can target ANY Topic in the group using `threadId`.

**Topic IDs (Telegram HQ group):**
- Topic 1: #general
- Topic 2: #research
- Topic 5: #coordination
- Topic 7: #logs
- Topic 9: #alerts
- Topic 26: #hektor (Hektor exclusive)
- Topic 27: #scout (Scout exclusive)

### Suggested Action
Store Topic IDs as constants in TOOLS.md or AGENTS.md for consistent alert routing.

**Alert workflow:**
```
message action:send
  channel: telegram
  target: -1003808534190
  threadId: 9  # #alerts
  message: "[ALERT] Problem description"
```

### Metadata
- Source: user test (Laurenz)
- Related Files: AGENTS.md (add Topic ID constants), TOOLS.md (update message tool reference)
- Tags: telegram, integration, alerting, critical
- See Also: None

---

## [LRN-20260210-005] best_practice

**Logged**: 2026-02-10T07:17:00Z
**Priority**: high
**Status**: established
**Area**: workflow

### Summary
Topic IDs are mandatory. Use them consistently for all cross-topic routing.

**Topic IDs to memorize and use:**
- #general (1) → For public announcements
- #research (2) → Scout's research output
- #coordination (5) → Inter-agent coordination
- #logs (7) → Activity logs (use for routine updates)
- #alerts (9) → ALWAYS use for critical issues, blockers, cost anomalies
- #hektor (26) → Hektor exclusive workspace (current session)
- #scout (27) → Scout exclusive workspace

### Suggested Action
1. Use `threadId: 9` for alerts (message tool)
2. Use `threadId: 7` for activity logs
3. Scout should use same Topic IDs in his routines

### Metadata
- Source: user instruction (Laurenz)
- Related Files: TOOLS.md (already updated), AGENTS.md
- Tags: workflow, mandatory, memory
- See Also: LRN-20260210-004 (cross-topic posting)

---

## [LRN-20260210-008] best_practice

**Logged**: 2026-02-10T12:11:00Z
**Priority**: critical
**Status**: established
**Area**: architecture, operations

### Summary
Before ANY Gateway-blocking config changes (provider changes, model redef, etc.), consult Scout FIRST, validate locally, THEN restart. Never restart blind.

### Details
Incident: Modified groq provider in models.providers, restarted Gateway without:
1. Validating the new config would pass schema
2. Consulting Scout about the change
3. Testing locally first

This could have blocked the Gateway startup again.

**Corrected Workflow (config changes that could break Gateway):**

1. **Consult Scout:** `@scout_recherche_bot Schema validation help: I'm about to change X in config. Will this work?`
2. **Validate locally:** `openclaw doctor --config` or `jq` schema check
3. **Test the change:** Apply to a test file first
4. **Then restart:** Only if validation passes
5. **Monitor:** Watch `openclaw logs --follow` for startup errors

**Safe changes** (no Scout needed):
- Topic-level settings
- Heartbeat intervals
- Message queuing settings
- Non-blocking cosmetic changes

**Blocking changes** (Scout consultation required):
- Provider registration/removal
- Model definitions
- Gateway core config
- Auth changes
- Sandbox/security rules

### Suggested Action
Add this to AGENTS.md as a mandatory pre-restart checklist.

### Metadata
- Source: user correction (Laurenz) after blocking incident
- Related Files: AGENTS.md (add checklist), TOOLS.md (add config-change protocol)
- Tags: operations, safety, critical
- See Also: LRN-20260210-007 (Groq Whisper ≠ Chat-Model)

---

## [LRN-20260210-009] correction

**Logged**: 2026-02-10T12:13:00Z
**Priority**: high
**Status**: established
**Area**: model-routing

### Summary
Config changes require Sonnet, not Haiku. I used Haiku for Groq Provider debugging — that was wrong.

### Details
**Why:** Config work = complexity + analysis + risk. Sonnet tier per AGENTS.md.

**Wrong:** Haiku for "let me just change the config and restart"
**Right:** Sonnet for "I need to validate this config change and prevent Gateway breakage"

This also contributed to missing the validation step — Haiku is for routine tasks, not high-stakes changes.

### Suggested Action
Before ANY config patch: `/model sonnet` first, THEN work on it.

### Metadata
- Source: user question (Laurenz)
- Related Files: AGENTS.md (model routing section)
- Tags: model-routing, config, correction
- See Also: LRN-20260210-008 (config-change protocol)

---

---

## [LRN-20260210-006] correction

**Logged**: 2026-02-10T07:23:00Z
**Priority**: high
**Status**: established
**Area**: architecture

### Summary
Agent-to-Agent communication via Telegram messages doesn't work — and that's intentional.

### Details
Tested: Hektor (Topic 26) sending via `message` tool to Scout (Topic 27). Scout didn't respond.

**Why:** Scout is configured to respond ONLY to user input from Laurenz, not to bot-generated messages from other agents. This is a security feature — agents can't directly control each other.

**Correct topology:**
- Topic 26 (#hektor): Hektor ↔ Laurenz (isolated session)
- Topic 27 (#scout): Scout ↔ Laurenz (isolated session)
- No direct agent-to-agent control via Telegram

If agents need to coordinate: Laurenz explicitly delegates in Topic 5 (#coordination) or agents use `sessions_send()` tool (internal agent bus, not Telegram).

### Suggested Action
Don't try to send Telegram messages to other agents. Use Laurenz as the coordinator, or use internal agent tools if available.

### Metadata
- Source: user test + correction (Laurenz)
- Related Files: AGENTS.md (document this architecture)
- Tags: security, architecture, design-decision
- See Also: LRN-20260210-004 (cross-topic posting)

---
