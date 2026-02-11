# Model Routing Framework für Hektor

*Entscheidungsbaum für Model-Auswahl — vor jedem Task durcharbeiten.*

---

## The Decision Framework

Bevor du einen Task an ein Model sendest, antworte auf diese **drei Fragen**:

### Question 1: Does this task require complex reasoning?

**Complex reasoning includes:**
1. Multi-step logical deductions
2. Weighing tradeoffs between competing priorities
3. Understanding nuanced context or implications
4. Making judgment calls with incomplete information

**If YES** → Consider Sonnet  
**If NO** → Haiku handles it

---

### Question 2: Is there a high cost of failure?

**High-cost failures:**
5. Customer-facing content with Hektor's brand attached
6. Production code that could cause outages
7. Strategic decisions affecting business direction
8. Legal or compliance-sensitive outputs

**If YES** → Consider Sonnet  
**If NO** → Haiku handles it

---

### Question 3: Does the output require creativity or nuance?

**Creative/nuanced tasks:**
9. Original content creation (not templated)
10. Handling edge cases or exceptions
11. Adapting tone for sensitive situations

**If YES** → Consider Sonnet  
**If NO** → Haiku handles it

---

## Scoring the 3 Questions

After answering each question:
- **Count the YESes**
  - **0 YES** → Haiku ✅ (85% of tasks — pattern matching)
  - **1-2 YES** → Sonnet ⚠️ (10% of tasks — judgment calls)
  - **3 YES** → Sonnet ⚠️ (10% of tasks — complex + high-cost + creative)

- **Explicit `/opus` from Laurenz** → Opus 🔴 (override scoring)
- **Irreversible or Legal** → Opus 🔴 (contracts, pricing, compliance, strategy pivots)

---

## Use Haiku (85% of Tasks)

Pattern-matching, structured, or clear-rule tasks. **Haiku excels here and costs 1/10th of Sonnet.**

### Code Operations

| Task | Why Haiku Works |
|------|-----------------|
| Code reviews | Following linting rules, catching common issues |
| Refactoring | Applying known patterns (DRY, extract method, etc.) |
| Documentation | Describing existing code structure |
| Unit test generation | Creating tests from function signatures |
| Boilerplate generation | Scaffolding, CRUD operations |
| Code formatting | Syntax, style consistency |
| Error message parsing | Extracting structured data from logs |

### Data Processing

| Task | Why Haiku Works |
|------|-----------------|
| Data transformation | JSON to CSV, format conversions |
| Schema validation | Checking data against known structures |
| Content extraction | Pulling specific fields from documents |
| Summarization (factual) | Condensing without interpretation |
| Classification | Sorting into predefined categories |
| Entity extraction | Names, dates, amounts from text |

### Hektor Operations

| Task | Why Haiku Works |
|------|-----------------|
| Dashboard CRUD | Creating/updating tasks, projects, activity |
| Memory updates | Writing to MEMORY.md, daily logs |
| Config patches (routine) | Updating known config keys |
| Status checks | Querying session status, task lists |
| Web research | Fetching and extracting from URLs |
| Template filling | Mail merge, form completion |
| Log parsing | Extracting structured data from OpenClaw logs |

---

## Use Sonnet (15% of Tasks)

**Reserve Sonnet for judgment calls, not pattern matching.**

### Architecture & Strategy

| Task | Why Sonnet Matters |
|------|------------------|
| System architecture decisions | Weighing long-term tradeoffs |
| Technology selection | Evaluating fit for specific needs |
| API design | Balancing usability, performance, extensibility |
| Database schema design | Anticipating query patterns, growth |
| Security review | Thinking like an attacker |
| Business strategy | Multi-factor decisions, opportunity evaluation |

### Critical Bug Investigation

| Task | Why Sonnet Matters |
|------|------------------|
| Production incidents | Multiple systems, unclear causation |
| Race conditions | Timing-dependent, hard to reproduce |
| Memory leaks | Subtle accumulation over time |
| Security vulnerabilities | Exploitable edge cases |
| Performance degradation | Unexpected interaction patterns |

### Customer-Facing Content

| Task | Why Sonnet Matters |
|------|------------------|
| Email to customers | Brand voice, relationship context |
| Proposal writing | Persuasion, addressing unstated concerns |
| Support escalations | Empathy, complex problem solving |
| Public communication | Reputation implications |
| Sensitive negotiations | Nuance, reading between lines |
| Content review | Tone, context, impact assessment |

---

## Quick Reference Card

### ✅ HAIKU TERRITORY (Just Do It)

- Code reviews & refactoring
- Documentation generation
- Test writing
- Data transformation & validation
- Template filling
- Status updates
- Log parsing
- Schema validation
- Boilerplate generation
- Dashboard operations
- Memory updates (routine)
- Web research & extraction

### ⚠️ SONNET TERRITORY (Worth the Cost)

- Architecture decisions
- Critical bug investigation
- Customer-facing content
- Security reviews
- Strategic planning
- Complex negotiations
- Novel problem-solving
- Proposal writing
- Support escalations
- Config changes with implications

### 🚩 RED FLAGS (You're Over-Routing)

- Using Sonnet for CRUD operations
- Using Sonnet for formatting tasks
- Using Sonnet for simple Q&A
- Using Sonnet "just to be safe"
- No tasks going to Haiku
- Defaulting to expensive without thinking

---

## Decision Flow (for Hektor)

```
Task arrives
│
├─ Is it in the Haiku list? → YES → Use Haiku ✅
│
├─ Is it in the Sonnet list? → YES → Use Sonnet ⚠️
│
├─ Needs OpenClaw Docs research first? → YES → Research, THEN route
│
├─ Did Laurenz say /opus? → YES → Use Opus 🔴
│
└─ Unsure? → Use Sonnet (better safe + learning cost < risk)
```

---

## Use Opus (5% of Tasks — Irreversible & Legal)

**ONLY for tasks that cannot be undone or have legal consequences:**

**Business & Legal:**
- Contracts, SLAs, business agreements
- Pricing models (long-term revenue implications)
- Compliance outputs (DSGVO, audit responses)
- Strategy pivots (business model changes)
- Final commitments (guarantees, warranties, public promises)

**Quality Assurance:**
- Weekly quality audit (review own outputs for safety)
- Security approval (production changes)
- Financial decisions (budget, vendor contracts)

**Rule:** If the decision is still binding in 6 months or lawyers might be involved → Opus.

---

## Integration with Hektor's Auto-Routing

**ENFORCEMENT:** Every task (Laurenz message, Scout message, Cron job, Sub-Agent result, self-initiated) requires model evaluation:

1. **Evaluate before executing** (4-Stufen Framework)
2. **Ask the 3 questions** (complex reasoning? high cost of failure? creativity/nuance?)
3. **Count the YESes:**
   - 0 YES → Haiku ✅ (pattern matching, CRUD, data ops)
   - 1-2 YES → Sonnet ⚠️ (judgment calls, critical work)
   - 3 YES → Sonnet ⚠️ (complex + high-cost + creative)
   - Explicit `/opus` from Laurenz → Opus 🔴 (override)
   - Irreversible/Legal → Opus 🔴 (auto-escalate)

4. **Set model:** Use `session_status(model="haiku|sonnet|opus")` tool call (reliable, programmatic)
5. **Execute task** on selected model
6. **After Sonnet/Opus work → Reset:** `session_status(model="haiku")` to return to default

---

## Cost Model (Reference)

- **Haiku:** ~$0.00008 per 1K input tokens
- **Sonnet:** ~$0.003 per 1K input tokens
- **Opus:** ~$0.015 per 1K input tokens

**Rule of thumb:** 1 Sonnet task costs as much as ~37 Haiku tasks. So Sonnet better be worth it.

---

## Examples (Decision Applied)

| Task | Questions | Decision | Why |
|------|-----------|----------|-----|
| "Review this function" | Complex? No. High-cost? No. Creative? No. | **Haiku** | Pattern matching |
| "Design new API for auth" | Complex? Yes. High-cost? Yes. Creative? Yes. | **Sonnet** | Tradeoff weighing |
| "Extract user emails from CSV" | Complex? No. High-cost? No. Creative? No. | **Haiku** | Data transformation |
| "Write email to angry customer" | Complex? Yes. High-cost? Yes. Creative? Yes. | **Sonnet** | Brand, empathy |
| "Check if config syntax is valid" | Complex? No. High-cost? No. Creative? No. | **Haiku** | Schema validation |
| "Should we pivot to Newsletter?" | Complex? Yes. High-cost? Yes. Creative? Yes. | **Sonnet** | Strategic decision |

---

## Status & Next Steps

**✅ ACTIVE (2026-02-11)**
- Framework complete and integrated into AGENTS.md
- ENFORCEMENT rule implemented (evaluate before EVERY task)
- Model reset method updated (session_status tool, not slash commands)
- Opus territory documented
- Quick reference card included

**Next Steps:**
- Monitor actual routing patterns (log which model used + why)
- Collect feedback from Laurenz after week 1 execution
- Adjust categories/examples if needed based on learnings
- Consider token budget tracking (Haiku vs Sonnet cost efficiency)
