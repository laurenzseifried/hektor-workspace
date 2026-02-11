# Lead Gen Workflow — Planning & Implementation

**Status:** DRAFT (Awaiting Laurenz input on target profile + data sources)  
**Created:** 2026-02-11 14:10 GMT+1  
**Owner:** Hektor + Scout  
**Phase:** 1 (Lead Gen only; Newsletter in Phase 2)

---

## 1. Executive Summary

**Objective:** Build an autonomous lead generation pipeline where Scout discovers qualified B2B leads and Hektor enriches + prepares outreach materials.

**Timeline:** Week 1-2 focused, ready for Phase 2 after stabilization.

**Success Metric:** 10+ qualified leads/week with complete contact data + personalization angles.

---

## 2. Workflow Architecture

### 2.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LEAD GEN WORKFLOW                         │
└─────────────────────────────────────────────────────────────┘

1. DEFINITION PHASE (Laurenz)
   ├─ Target Profile (ICP)
   ├─ Data Sources + API Keys
   └─ Outreach Goals

   ↓

2. RESEARCH PHASE (Scout)
   ├─ Query API/Data Sources
   ├─ Parse Results
   ├─ Dedup + Validate
   └─ Post to #lead-gen: "Found 15 raw leads"

   ↓

3. ENRICHMENT PHASE (Hektor)
   ├─ Validate Contact Data
   ├─ Add Firmographic Data
   ├─ Extract Pain Points
   └─ Score Leads (0-10)

   ↓

4. OUTREACH PREP PHASE (Hektor)
   ├─ Draft Email Subject
   ├─ Draft Email Body
   ├─ Identify Call Angles
   └─ Post to #lead-gen: "10 qualified + 5 outreach emails ready"

   ↓

5. REVIEW PHASE (Laurenz)
   ├─ Review Leads
   ├─ Review Email Drafts
   ├─ Approve / Request Changes
   └─ Decide: Send / Add to CRM / Discard

   ↓

6. HANDOFF PHASE (Manual or Future Automation)
   ├─ Send Emails (Hektor drafts them, you approve + send)
   ├─ Track Responses
   └─ Log to Activity
```

---

## 3. Roles & Responsibilities

### Scout (Research Agent)

**Task:** Find leads matching target profile

**Inputs:**
- Target ICP (Company size, industry, location, pain points)
- Data sources (LinkedIn, Apollo, Hunter, custom APIs)
- Search criteria (keywords, filters, boolean logic)

**Process:**
1. Query data source API
2. Parse + structure results (name, email, company, title, etc.)
3. Dedup against existing leads
4. Post raw findings to #lead-gen

**Output Format (JSON):**
```json
{
  "lead_id": "lead_001",
  "name": "John Smith",
  "title": "VP Sales",
  "company": "TechCorp GmbH",
  "email": "john@techcorp.de",
  "company_size": "50-200",
  "industry": "B2B SaaS",
  "location": "Berlin, Germany",
  "company_website": "techcorp.de",
  "source": "LinkedIn Sales Navigator",
  "discovered_at": "2026-02-11T14:00Z",
  "research_notes": "Active hiring, 3 sales roles open, uses HubSpot"
}
```

**Cadence:** Daily or on-demand (TBD with you)

---

### Hektor (Operations Agent)

**Task:** Enrich leads + prepare outreach

**Phase 1: Enrichment**
1. Validate email + contact accuracy
2. Add: Company revenue, employee count, recent news
3. Identify: Current tech stack, pain points, buying signals
4. Score lead (1-10 scale)
5. Flag: "Ready for outreach", "Needs more data", "Not qualified"

**Phase 2: Outreach Prep**
1. Research lead + company (via Brave Search, if needed)
2. Draft personalized email subject (3 variations)
3. Draft email body (mention: their pain point + solution fit)
4. Identify call angle (what outcome to suggest)
5. Post enriched leads + email drafts to #lead-gen

**Output Format (JSON):**
```json
{
  "lead_id": "lead_001",
  "enrichment": {
    "company_revenue": "$10M-50M ARR",
    "employee_count": "75",
    "tech_stack": ["HubSpot", "Salesforce", "Marketo"],
    "pain_points": ["Sales forecasting", "Pipeline transparency"],
    "recent_news": "Raised Series B, expanding EMEA",
    "quality_score": 9,
    "status": "READY_FOR_OUTREACH"
  },
  "outreach": {
    "subject_lines": [
      "John — Your sales team is guessing on forecasts",
      "Helping TechCorp Sales close 30% faster",
      "Sales forecasting without the spreadsheets"
    ],
    "email_body": "Hi John,\n\nSaw TechCorp is expanding...",
    "call_angle": "Schedule 15min discovery on sales forecasting automation",
    "confidence": 0.95
  }
}
```

**Cadence:** Daily after Scout findings posted

---

## 4. Telegram Integration

### Topics Created

```
#lead-gen
  ├─ Scout posts: "15 raw leads found"
  ├─ Hektor posts: "10 qualified + emails ready"
  └─ You review/approve

#logs
  └─ Auto activity logging

#alerts
  └─ Errors, blockers, API rate limits
```

### Message Flow

**Scout → #lead-gen:**
```
📊 LEAD RESEARCH — 15 Leads Found

Source: LinkedIn Sales Navigator
Query: "Startup CEO in DACH, B2B SaaS, 10-100 emp"

Leads:
1. John Smith (VP Sales, TechCorp GmbH, Berlin)
2. Anna Mueller (Head of Growth, SoftwareAG, Frankfurt)
... [full list in attached JSON]

Ready for enrichment. Posted to dashboard.
```

**Hektor → #lead-gen:**
```
✅ LEADS ENRICHED & OUTREACH READY

10 qualified leads:
- 8 scored 8+/10
- 2 scored 7/10

Quality Data: 95% have verified emails

Outreach:
- 10 draft emails prepared
- 3 subject lines per lead
- Call angles identified

Ready for your review. Awaiting approval to send.
```

---

## 5. Data Sources & Tools

### Option A: Manual Research (Scout uses Brave Search + tools)
- **Cost:** $0 (free tools)
- **Speed:** Slow (1-5 leads/day)
- **Quality:** High (personalized)
- **Setup:** 🟢 Ready

### Option B: Paid APIs (Recommended)
- **Apollo.io** — B2B database, email verification
- **Hunter.io** — Email finder + domain research
- **LinkedIn Sales Navigator** — Structured search + exports
- **Custom scripts** — If you have proprietary data

**Recommendation:** Start with Apollo.io (most comprehensive) + Brave Search fallback

---

## 6. Technical Implementation

### 6.1 Data Flow Architecture

```
Scout DM-Session
├─ Receives: "Find leads for TechCorp"
├─ Executes: API queries + parsing
├─ Posts to: #lead-gen (raw findings)
└─ Logs to: Activity + MEMORY

Hektor DM-Session
├─ Receives: Scout's raw findings (via memory or session_send)
├─ Executes: Enrichment + research
├─ Posts to: #lead-gen (enriched + outreach)
└─ Logs to: Activity + Dashboard
```

### 6.2 Session Management

**Hektor DM-Session (`agent:hektor:main`):**
- Long-running
- Receives your DM commands
- Posts enriched leads to #lead-gen
- Coordinates with Scout (via `sessions_send`)

**Scout DM-Session (`agent:scout:main`):**
- Long-running
- Receives research requests from Hektor (via `sessions_send`)
- Executes API queries
- Posts raw findings to #lead-gen

### 6.3 Memory & Tracking

**Dashboard Integration:**
- Task: `LEAD_GEN_BATCH_001` (Hektor)
- Activity Log: Each research query + enrichment
- Cost Tracking: API calls per day
- Metrics: Leads/day, quality score trend

**Memory Files:**
- `memory/lead-gen/discovered.jsonl` (raw leads + source)
- `memory/lead-gen/enriched.jsonl` (scored + qualified)
- `MEMORY.md` updates: Weekly summary

---

## 7. Configuration & Setup Tasks

### 7.1 Pre-Workflow Checklist (Laurenz Decision Required)

**You must provide:**
- [ ] **Target ICP:** 
  - Company size? (Employees, ARR)
  - Industry? (B2B SaaS, Healthcare, FinTech?)
  - Geography? (DACH, EU, US?)
  - Pain point? (Sales, Marketing, Ops?)

- [ ] **Data Sources:**
  - [ ] Apollo.io API key? (+ budget approved?)
  - [ ] LinkedIn Sales Navigator? (login ready?)
  - [ ] Custom database/CRM export?
  - [ ] Other sources?

- [ ] **Outreach Goals:**
  - What's the ask? (15min call, demo, free trial?)
  - What success looks like? (Response rate target?)

- [ ] **Cadence:**
  - Daily? Weekly? Batch size?

### 7.2 Technical Setup (Hektor)

```
[ ] Create #lead-gen topic in Telegram group
[ ] Update AGENTS.md with Lead Gen workflow
[ ] Update HEARTBEAT.md for Scout (research cadence)
[ ] Create dashboard tasks for lead batches
[ ] Setup memory structure (lead-gen/ folder)
[ ] Test Scout API integration (dummy query)
[ ] Test message posting (Hektor → #lead-gen)
[ ] Run 1st batch (5 leads) end-to-end
```

---

## 8. Workflow Details (Scout)

### 8.1 Research Query (Example)

**Command:** (You send to Hektor DM)
```
Scout: Find 20 B2B SaaS founders in DACH region, seed-stage, hiring for sales
```

**Scout's Actions:**
1. Build search filters (Apollo: "Founder", "B2B SaaS", "DACH", "Series A-B")
2. Execute API query
3. Parse results (name, email, company, ARR, etc.)
4. Dedup (check if in existing list)
5. Structure as JSON
6. Post summary to #lead-gen
7. Log to memory

**Error Handling:**
- API rate limit hit? → Log to #alerts + retry tomorrow
- No results? → Log to #alerts + suggest different query
- Low email validation rate? → Flag in post

---

## 9. Workflow Details (Hektor)

### 9.1 Enrichment Process (Example)

**Input:** Scout's 20 raw leads

**Hektor's Actions:**
1. **Validate:** Email verification, LinkedIn URL check
2. **Research:** Brave Search for company + lead
   - Recent funding news?
   - Current headcount?
   - Tech stack?
3. **Score:** 1-10 based on:
   - Email validation (3 pts)
   - Company growth signals (3 pts)
   - Pain point fit (4 pts)
4. **Enrich JSON** with fields: score, status, confidence, notes
5. **Filter:** Keep only 8+/10 for outreach prep

**Output:** 15 qualified leads + 15 draft emails

---

## 10. Message Format Standards

### Scout's Raw Lead Post

```
📊 LEAD RESEARCH BATCH #001
Date: 2026-02-11
Query: "B2B SaaS founders, DACH, Series A"
Results: 15 leads found, 12 unique (3 duplicates filtered)

Leads (full data attached):
- 14/15 with verified email
- 12/15 with LinkedIn profiles
- 8/15 currently hiring

Next: Awaiting enrichment
```

### Hektor's Enriched Lead Post

```
✅ ENRICHMENT COMPLETE — BATCH #001
15 Qualified Leads Ready

Quality Metrics:
- Avg Score: 8.2/10
- Email Validation: 100%
- Research Coverage: 100%

Top 3 Leads:
1. John Smith (TechCorp) — Score 9.5 — "VP Sales, 50 headcount, expanding"
2. Anna Mueller (SoftwareAG) — Score 9.2 — "Head of Growth, Series B funded"
3. Klaus Weber (StartupXY) — Score 8.8 — "Founder, actively hiring sales team"

Outreach Emails: Ready for review
Next: Awaiting your approval to send
```

---

## 11. Success Metrics (First Month)

| Metric | Target | How Measured |
|--------|--------|--------------|
| Leads/week | 15-20 | Activity log count |
| Email validation rate | >90% | API response validation |
| Quality score (avg) | >8.0/10 | Hektor enrichment |
| Research time/lead | <10 min | Task duration logging |
| Outreach ready rate | >80% | Approved emails / total |

---

## 12. Next Steps

### Immediate (Today)

1. **Laurenz fills out Section 7.1 checklist** (ICP, sources, goals)
2. **Hektor creates #lead-gen topic** in Telegram
3. **Hektor updates AGENTS.md** with this workflow

### Week 1

4. Scout runs 1st test batch (5 leads)
5. Hektor enriches + drafts emails
6. Laurenz reviews, feedback loop
7. Stabilize workflow, measure time/quality

### Week 2+

8. Scale to 10-15 leads/day
9. Measure response rates
10. Optimize queries based on success
11. Prepare for Phase 2 (Newsletter)

---

## 13. Known Constraints & Mitigations

| Constraint | Risk | Mitigation |
|-----------|------|-----------|
| API rate limits | Scout gets blocked | Monitor usage, stagger queries, fallback to manual search |
| Poor email match rate | Low response rate | Use multiple data sources, add verification step |
| Enrichment complexity | Takes too long per lead | Batch processing, template-based research |
| Outreach approval | Hektor can't send without your go-ahead | Dashboard notification + DM summary |
| Data privacy | GDPR compliance | Only store contact + company data, no tracking cookies |

---

## 14. Future Phases (Out of scope for now)

- **Phase 2:** Newsletter + Lead Gen parallel
- **Phase 3:** Separate Lead-Finder agent (parallel research at scale)
- **Phase 4:** Email automation (Send + track via email service)
- **Phase 5:** Response handling (AI reads replies, scores interest)

---

**READY TO IMPLEMENT** once Laurenz provides ICP + data source info.
