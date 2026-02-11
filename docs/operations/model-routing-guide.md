# Model Routing Guide — Hektor & Scout

**Version:** 2.0  
**Effective:** 2026-02-11  
**Status:** Production (enforced via HEARTBEAT.md)

---

## Overview

Model Routing is the decision framework for selecting the right model (Haiku, Sonnet, Opus) before each task. The goal is to:
- **Maximize cost efficiency** (85% Haiku: $0.03/$0.06 vs. Sonnet's $0.15/$0.60)
- **Ensure quality** (use Sonnet/Opus for complex/irreversible decisions)
- **Enable autonomous operations** (pattern-based, not per-task micromanagement)

**Current Budget:** ~$105-165/month for 150 tasks/week across both agents.

---

## 4-Stufen Decision Framework

**When:** Before every task (Laurenz message, Scout message, Cron job, sub-agent result, self-initiated)

**How:** Evaluate sequentially. STOP at first "YES".

### Stufe 1: Irreversibel oder Rechtlich?

**Questions:**
- Is this decision binding in 6+ months?
- Does it create a contract, SLA, or guarantee?
- Are lawyers involved?
- Is it a strategy pivot?

**Examples YES:**
- ✅ Pricing decisions, discount structures
- ✅ Legal/compliance outputs (DSGVO, Audit responses)
- ✅ Business model pivots, market exits
- ✅ Public commitments, customer guarantees
- ✅ Financial commitments, payment terms

**Decision:**
- **YES → OPUS** 🔴 (5% of tasks)
- **NO → Continue to Stufe 2-4**

### Stufe 2-4: Complex Reasoning, High Cost, Creativity

Count "YES" answers to these:

1. **Complex Reasoning?**
   - Multi-step logic, tradeoffs, incomplete info
   - Nuanced context interpretation
   - Examples: Architecture design, tech selection, security review

2. **High Cost of Failure?**
   - Customer-facing, production code
   - Strategic decisions, security implications
   - Examples: Production incidents, API design, business proposals

3. **Creativity / Nuance?**
   - Original content (not templated)
   - Sensitive tone or edge cases
   - Judgment calls in gray areas
   - Examples: Email drafts, negotiation strategy, exception handling

**Scoring:**
- **0 YES** → **HAIKU** ✅ (85% of tasks)
- **1-2 YES** → **SONNET** ⚠️ (8%)
- **3 YES** → **SONNET** ⚠️ (2%)
- **Laurenz override** → Use requested model

---

## Model Territories

### 🟢 HAIKU Territory (85% of Tasks)

**When:** Pattern-matching, structured, clear rules. **Cost: 1/10th of Sonnet.**

**Task Categories:**

**Dashboard Operations:**
- Task/Research/Pipeline CRUD (create, read, update, delete)
- Activity log entries (routine types)
- Project status updates
- Memory updates (daily logs, routine entries)

**Configuration & Setup:**
- Config patches (routine, known keys)
- Tool installation (standard, no security review)
- Status checks (session, heartbeat, network)
- Dashboard API calls (list, fetch, filter)

**Data Processing:**
- JSON → CSV transformations
- Schema validation against known structures
- Log parsing (extracting structured fields)
- Text summarization (factual, no interpretation)
- Entity extraction (names, dates, amounts)

**Code & Documentation:**
- Linting rule checks
- Boilerplate generation (CRUD scaffolding)
- Documentation of existing structure
- Code formatting consistency

**Research & Analysis:**
- Web fetch + extract (Brave API)
- URL parsing and categorization
- Competitor data compilation (data entry, no judgment)
- Finding aggregation into tables

**Examples:**
- ✅ "List all backlog tasks with priority=high"
- ✅ "Update task HEKTOR-003 to status=done, actualHours=3"
- ✅ "Create research request for market analysis"
- ✅ "Log activity: Model switched to Sonnet"
- ✅ "Parse JSON metrics, extract daily costs"

---

### 🟡 SONNET Territory (10% of Tasks)

**When:** Judgment calls, analysis, creativity — NOT pattern-matching. **Worth the 10x cost.**

**Task Categories:**

**Architecture & Strategy:**
- System architecture decisions (long-term tradeoffs)
- Technology selection (fit for needs)
- API design (usability vs. performance vs. extensibility)
- Security architecture (thinking like attacker)
- Business strategy (multi-factor evaluation)

**Critical Problems:**
- Production incident investigation (unclear causation, multi-system)
- Race conditions (timing-dependent, hard to reproduce)
- Memory leaks or performance degradation (subtle patterns)
- Security vulnerabilities (exploitable edge cases)

**Customer-Facing Content:**
- Email drafts (brand voice, context awareness)
- Proposal writing (persuasion, anticipating objections)
- Support escalations (empathy, complex problems)
- Public communication (reputation implications)
- Sensitive negotiations (reading between lines)

**Code & Configuration:**
- Complex code reviews (design patterns, unspoken assumptions)
- Multi-system config implications (potential side effects)
- Config changes with uncertain impact (needing rollback planning)
- New skill evaluation (behavioral analysis, trust assessment)

**Decision-Making:**
- When you're "unsure" between two options
- When failure has customer/product impact
- When the problem is partially known (missing context)
- When tone/nuance matters (not just facts)

**Examples:**
- ✅ "Evaluate these 3 competitive strategies, recommend one"
- ✅ "Review this architecture proposal, identify risks"
- ✅ "Draft email to client about delay, maintain relationship"
- ✅ "Investigate why Scout's last research took 2x longer than normal"
- ✅ "Design API schema for new pipeline system"

---

### 🔴 OPUS Territory (5% of Tasks)

**When:** Irreversible decisions, legal/business contracts, final commitments.

**ONLY for:**
- Pricing decisions, discount approvals (revenue impact)
- Legal/compliance outputs (DSGVO, audit responses, liability)
- Business model pivots, market strategy changes
- Customer SLAs, guarantees, warranty commitments
- Public statements with legal consequence
- Weekly Quality Audit (Opus reviews own outputs)

**Examples:**
- ✅ "Approve pricing structure for new product tier"
- ✅ "Draft compliance response for DSGVO audit"
- ✅ "Decide: market entry or exit for business model X"
- ✅ "Guarantee SLA uptime with penalty terms"

---

## Enforcement: HEARTBEAT.md Pattern

**The Right Way:** Logic lives in `HEARTBEAT.md`, not the prompt.

**Why?**
- Slash commands (`/model X`) are unreliable (chat-based)
- Tool calls (`session_status(model="X")`) are deterministic
- HEARTBEAT.md is read by the default prompt
- Scales to every heartbeat (30min for Hektor, 60min for Scout)

### HEARTBEAT.md Structure

```markdown
# Hektor Heartbeat Checklist

## Model Routing (BEFORE executing checklist)

1. Evaluate task (4-Stufen Framework)
2. Call: `session_status(model="haiku|sonnet|opus")`
3. Then proceed with task

## Decision Tree

- IF blockers → SONNET (judgment needed)
- ELSE IF in-progress → HAIKU (continue)
- ELSE IF backlog → HAIKU (pull + execute)
```

**Key Point:** `session_status` is a tool call, not a slash command.

```bash
# ✅ Reliable
session_status(model="sonnet")

# ❌ Unreliable
/model sonnet
```

---

## Model Switching: Tool Method

**Tool:** `session_status(model="...")`  
**Parameters:**
- `model="haiku"` → Switch to Haiku
- `model="sonnet"` → Switch to Sonnet
- `model="opus"` → Switch to Opus
- `model="default"` → Reset to default (clears override)

**Example:**
```bash
# Evaluate: This is a complex API design → 3 YES → Sonnet
session_status(model="sonnet")

# Do work...

# After task, reset to default
session_status(model="default")
```

**Why Not Slash Commands?**
- Slash commands are chat-based, can be lost in tool-call chains
- Tool calls are programmatic, always execute
- Tool calls return confirmation (visible in status)

---

## Monthly Budget Breakdown

**Assumptions:** 150 tasks/week, 85% Haiku / 10% Sonnet / 5% Opus

| Model | % Tasks | Tokens/Task | Monthly | Cost |
|-------|---------|-------------|---------|------|
| Haiku | 85% | ~500 (input 200, output 300) | ~850K | $50-80 |
| Sonnet | 10% | ~2000 (input 800, output 1200) | ~260K | $15-25 |
| Opus | 5% | ~3000 (input 1200, output 1800) | ~195K | $10-20 |
| **TOTAL** | 100% | avg ~700 | **~1.3M** | **$75-125** |

**Contingency buffer:** +20% = $105-165/month

**Cost per task:**
- Haiku: ~$0.06 avg (input $0.03, output $0.03)
- Sonnet: ~$0.58 avg (input $0.15, output $0.43)
- Opus: ~$1.54 avg (input $0.60, output $0.94)

---

## Common Patterns

### Morning Briefing (Haiku)
```
1. session_status(model="haiku")
2. dashboard briefing
3. IF blockers → SONNET for analysis
4. Else → HAIKU for execution
```

### Scout Research (Haiku + Sonnet)
```
1. session_status(model="haiku")
2. dashboard research list
3. IF simple lookup → HAIKU (web_fetch)
4. IF needs analysis → SONNET (evaluation + synthesis)
```

### Task Execution (Haiku)
```
1. session_status(model="haiku")
2. dashboard task get
3. Execute task
4. dashboard task update → done
```

### Blocked Task (Sonnet)
```
1. dashboard briefing (shows blockers)
2. session_status(model="sonnet")
3. Analyze blocker
4. Self-heal or escalate
5. session_status(model="default")
```

---

## Anti-Patterns (AVOID)

❌ **Defaulting to Sonnet for safety**
- Costs 10x more for zero quality gain
- Creates budget creep

❌ **Overthinking Haiku tasks**
- If it's pattern-matching → Haiku
- Decisiveness beats perfectionism

❌ **Using slash commands for model switching**
- Unreliable in tool chains
- Use `session_status(model="X")` instead

❌ **Switching models mid-task**
- Pick model BEFORE starting
- Switching fragments context

❌ **Ignoring the 4-Stufen framework**
- It's not a guideline, it's law
- Deviations = budget overruns

---

## Decision Checklist

**Every task, ask yourself:**

- [ ] Is this irreversible/legal? → YES = OPUS
- [ ] Does this need judgment? → YES = SONNET
- [ ] Is this pattern-matching? → YES = HAIKU
- [ ] Am I unsure? → When in doubt: SONNET (better safe than sorry, still cheaper than overoptimizing)

**Execution:**
- [ ] Call `session_status(model="...")` first
- [ ] Confirm model switch worked (read the status return)
- [ ] Do the task
- [ ] Reset: `session_status(model="default")` (optional, next task overwrites)

---

## Implementation Checklist

- [x] 4-Stufen Framework defined
- [x] Task territory catalogs created
- [x] session_status tool method documented
- [x] HEARTBEAT.md pattern established
- [x] Budget breakdown calculated
- [x] Anti-patterns documented
- [x] Common patterns with examples
- [x] AGENTS.md updated with enforcement rule
- [x] Model switching from slash commands → tool calls
- [ ] Scout implementation (AGENTS.md + HEARTBEAT.md)
- [ ] Weekly audit template (Opus quality check)
- [ ] Cost dashboard widget (if dashboard extended)

---

**Next:** Implement same framework for Scout (AGENTS.md + HEARTBEAT.md).

Source: AGENTS.md Auto-Routing Protokoll, frameworks/model-routing.md, 4-Stufen Decision Framework v2.0
