# Appointment Setting — Implementation Plan & Workflow Design

**Status:** READY TO IMPLEMENT  
**Decision:** All-in auf Appointment Setting (DACH SaaS/B2B Scale-ups)  
**Created:** 2026-02-11 14:31 GMT+1  
**Owner:** Hektor + Scout

---

## 1. Executive Summary

**Goal:** Build a fully autonomous appointment setting system where Scout finds leads, Hektor qualifies + books meetings, and you (Laurenz) only do client acquisition + strategic decisions.

**Target Output:** 10-20 qualified meetings/month per client @ €2.000-€4.000/month retainer

**Timeline:**
- Week 1: Setup + Test (this week)
- Week 2-4: First pilot clients + validation
- Month 2-3: Scale to 3-5 clients
- Month 4-6: Scale to 6-10 clients

---

## 2. End-to-End Workflow (Detailed)

### Phase 1: Client Onboarding (Laurenz + Hektor)

**Who:** Laurenz (sales call) → Hektor (setup)

**Steps:**

1. **Sales Call** (Laurenz, 30min)
   - Qualify client: SaaS/B2B Scale-up? Series A+? DACH focus?
   - Define ICP: Who should we book meetings with?
     - Role: VP Sales, Head of Growth, Founder (CEO/COO)
     - Company size: 10-500 employees
     - Industry: SaaS, B2B Services, FinTech (client's target market)
     - Geography: DACH, EU, US (where does client sell?)
     - Pain point: What problem does client solve?
   - Set expectations: 10-15 meetings/month in Month 1, ramp to 15-20 by Month 3
   - Pricing agreed: €2.000 base + €200/extra meeting (Hybrid model)

2. **Onboarding Form** (Hektor sends after sales call)
   ```
   Client Name:
   Contact Person:
   Email Domain (for outreach):
   Calendar Link (Calendly/Cal.com):
   Target ICP:
     - Role:
     - Company Size:
     - Industry:
     - Geography:
     - Pain Point:
   Sample Email (what currently works for them, if any):
   What's a "qualified" meeting for you? (BANT criteria?)
   ```

3. **Technical Setup** (Hektor, 15min)
   - Create client folder in dashboard: `/clients/[client-name]/`
   - Add client to Apollo.io (tag: "Client-[name]")
   - Setup calendar integration (Calendly/Cal.com webhook)
   - Configure email domain (if using client's domain via SMTP relay)
   - Post to #lead-gen: "New client onboarded: [Name]"

---

### Phase 2: Lead Research (Scout)

**Who:** Scout (autonomous)

**Cadence:** Daily (Mon-Fri) or on-demand

**Steps:**

1. **Query Data Sources**
   - **Apollo.io:** Build search query based on client ICP
     - Example: "VP Sales at B2B SaaS, 10-200 employees, DACH region, Series A+"
   - **LinkedIn Sales Navigator:** (optional, if Apollo results insufficient)
     - Boolean search: "VP Sales AND (SaaS OR Software) AND (Germany OR Austria OR Switzerland)"
   - **Brave Search:** (fallback for company research)
     - Query: "[Company name] funding news revenue employees"

2. **Parse & Structure Results**
   - Extract: Name, Title, Email, Company, LinkedIn URL, Company Size, Industry, Location
   - Validate: Email format (basic regex check), LinkedIn URL reachable
   - Dedup: Check against existing database (memory/lead-gen/discovered.jsonl)
   - Output: JSON array of raw leads

   ```json
   {
     "lead_id": "lead_20260211_001",
     "source": "Apollo",
     "query_date": "2026-02-11",
     "client": "Client-A",
     "name": "Anna Müller",
     "title": "VP Sales",
     "email": "anna@example.de",
     "company": "TechStartup GmbH",
     "company_size": "50-200",
     "industry": "B2B SaaS",
     "location": "Berlin, Germany",
     "linkedin_url": "linkedin.com/in/annamueller",
     "company_website": "techstartup.de",
     "research_notes": ""
   }
   ```

3. **Post Findings**
   - Post summary to #lead-gen:
     ```
     📊 LEAD RESEARCH — Client: [Name]
     Date: 2026-02-11
     Query: "VP Sales, B2B SaaS, DACH, 10-200 emp"
     Results: 25 leads found, 22 unique (3 duplicates filtered)

     Quality:
     - 22/25 with verified email format
     - 20/25 with LinkedIn profiles
     - 15/25 match all ICP criteria

     Next: Awaiting Hektor enrichment
     ```
   - Save to memory: `memory/lead-gen/raw-leads-[client]-[date].jsonl`

**Output:** 20-50 raw leads per client per week

**Time:** 10-20 minutes/day (automated queries)

---

### Phase 3: Lead Enrichment & Qualification (Hektor)

**Who:** Hektor (autonomous)

**Cadence:** Daily (after Scout posts findings)

**Steps:**

1. **Email Validation**
   - Use Hunter.io API: Verify email deliverability
   - Score: 0-100 (Hunter's confidence score)
   - Filter: Keep only 70+ score (deliverable)

2. **Company Research** (Brave Search)
   - Query: "[Company name] funding news revenue employees tech stack"
   - Extract:
     - Recent funding (Series A, B, C? Amount?)
     - Revenue estimate (€1M-€10M ARR?)
     - Current employee count (LinkedIn "About" page)
     - Tech stack (BuiltWith, Crunchbase, company website)
     - Recent news (hiring? product launch? expansion?)

3. **Pain Point Analysis**
   - Read company website: What problem do they solve?
   - Read LinkedIn posts (lead's recent activity): What are they talking about?
   - Infer: What pain point does OUR client solve that MATCHES their need?
   - Example:
     - Their company: Project management tool for remote teams
     - Their pain point (inferred): "Need more qualified sales pipeline"
     - Our client: Appointment setting service
     - Angle: "We help SaaS companies like yours book 15 qualified meetings/month"

4. **Lead Scoring (1-10)**
   - **Email Validation** (3 pts): 70-80 = 1pt, 80-90 = 2pts, 90+ = 3pts
   - **Company Fit** (3 pts): Size, industry, stage match ICP
   - **Pain Point Fit** (4 pts): Does their problem match our solution?
   - **Total:** 8+/10 = "Ready for outreach", 6-7 = "Maybe", <6 = "Disqualify"

5. **Enriched Output**
   ```json
   {
     "lead_id": "lead_20260211_001",
     "enrichment_date": "2026-02-11",
     "email_validation": {
       "score": 95,
       "status": "deliverable"
     },
     "company_research": {
       "funding_stage": "Series A ($5M)",
       "revenue_estimate": "€2M-€5M ARR",
       "employee_count": 75,
       "tech_stack": ["HubSpot", "Salesforce", "Slack"],
       "recent_news": "Raised Series A, expanding EMEA sales team",
       "pain_points": ["Sales pipeline", "Outbound efficiency"]
     },
     "lead_score": 9,
     "status": "READY_FOR_OUTREACH",
     "confidence": 0.9
   }
   ```

6. **Post Summary to #lead-gen**
   ```
   ✅ ENRICHMENT COMPLETE — Client: [Name]
   Date: 2026-02-11
   Input: 25 raw leads
   Output: 18 qualified (7 disqualified: low email score, bad ICP fit)

   Quality Metrics:
   - Avg Score: 8.3/10
   - Email Validation: 100% deliverable
   - Research Coverage: 100%

   Top 5 Leads:
   1. Anna Müller (TechStartup) — Score 9.5 — "VP Sales, Series A, expanding EMEA"
   2. Klaus Weber (SoftwareAG) — Score 9.2 — "Head of Growth, hiring SDRs"
   ...

   Next: Draft outreach emails
   ```

**Output:** 15-20 qualified leads per client per week

**Time:** 30-60 minutes/day (research + scoring)

---

### Phase 4: Outreach Drafting (Hektor)

**Who:** Hektor (autonomous)

**Cadence:** After enrichment complete

**Steps:**

1. **Email Template Selection**
   - **Template A:** Pain Point Focus
     ```
     Subject: [Pain Point] at [Company]?
     
     Hi [Name],

     Saw [Company] is [recent news/hiring/funding]. Congrats!

     Quick question: Are you looking to book more qualified sales meetings without scaling your SDR team?

     We help DACH SaaS companies like [similar company] book 15+ qualified meetings/month with AI-powered outreach.

     Worth a 15min call?

     Best,
     [Client Name]
     ```

   - **Template B:** Social Proof
     ```
     Subject: How [Similar Company] books 20 meetings/month

     Hi [Name],

     We recently helped [Similar Company] book 20 qualified meetings/month without hiring a single SDR.

     Thought you might be interested (saw [Company] is scaling fast).

     Want to see how it works? 15min call?

     [Client Name]
     ```

   - **Template C:** Direct Value Prop
     ```
     Subject: 15 qualified meetings/month for [Company]?

     Hi [Name],

     We specialize in booking qualified sales meetings for DACH SaaS companies.

     Our clients typically see 15-20 meetings/month (qualified, show up, decision-makers).

     Interested? Let's talk: [Calendly link]

     [Client Name]
     ```

2. **Personalization (per lead)**
   - Insert: Name, Company, Recent News, Pain Point
   - A/B Test: Rotate templates (Template A for 1/3 leads, B for 1/3, C for 1/3)
   - Subject Line Variation: Test 2-3 subject lines per template

3. **Send Schedule**
   - Stagger sends: 5-10 emails/hour (not all at once, avoid spam filters)
   - Time: 9AM-5PM (recipient's timezone)
   - Days: Tue-Thu (best response rates, avoid Mon/Fri)

4. **Follow-Up Sequence**
   - **Day 3:** Bump (if no reply)
     ```
     Hi [Name], bumping this in case it got buried.

     Still interested in 15min call about booking more meetings?

     [Link]
     ```
   - **Day 7:** Different Angle
     ```
     Hi [Name],

     Not sure if appointment setting is a priority for you right now.

     But if pipeline is ever an issue, we're here: [Link]
     ```
   - **Day 14:** Final Touch
     ```
     Last one from me, [Name].

     If you ever need help booking qualified meetings, let me know.

     Otherwise, good luck with [Company]'s growth!
     ```

5. **Post Draft to #lead-gen**
   ```
   📧 OUTREACH READY — Client: [Name]
   Date: 2026-02-11
   Leads: 18 qualified
   Templates: 3 (A/B/C tested)
   Subject Lines: 9 variations (3 per template)
   Follow-ups: 3 rounds (Days 3, 7, 14)

   Send Schedule:
   - Tue 9AM: 6 emails (Template A)
   - Tue 2PM: 6 emails (Template B)
   - Wed 9AM: 6 emails (Template C)

   Awaiting approval to send.
   ```

**Output:** 18 outreach emails ready per client per week

**Time:** 20-30 minutes/day (drafting + scheduling)

---

### Phase 5: Outreach Execution (Hektor)

**Who:** Hektor (autonomous, after approval)

**Approval:** Laurenz reviews first batch (Week 1), then auto-approve (Week 2+)

**Steps:**

1. **Send Emails**
   - Method A: SMTP relay via client's email domain (if configured)
   - Method B: Via our domain (laurenz@[our-domain].com) on behalf of client
   - Track: Opens, clicks (via simple tracking pixel, GDPR-compliant)

2. **Monitor Responses**
   - Check inbox: Auto-forward replies to Hektor
   - Categorize:
     - **Positive:** "Yes, let's talk" → Route to Phase 6
     - **Question:** "Tell me more" → Hektor replies with value prop
     - **Not Now:** "Not interested right now" → Tag as "Nurture", follow up in 3 months
     - **Opt-Out:** "Remove me" → Immediately remove, log in CRM

3. **Log Activity**
   - Dashboard: Update "Sent", "Replied", "Positive", "Opt-Out" counts
   - Memory: Save to `memory/lead-gen/outreach-log-[client]-[date].jsonl`

4. **Post Updates to #lead-gen (Weekly)**
   ```
   📊 OUTREACH UPDATE — Client: [Name], Week 1
   Sent: 50 emails
   Opened: 22 (44% open rate)
   Replied: 8 (16% reply rate)
   Positive: 5 ("Let's talk")
   Negative: 2 ("Not interested")
   Opt-Outs: 1

   Next: Booking 5 meetings
   ```

**Output:** 5-10 positive replies per client per week

**Time:** 10-20 minutes/day (send + monitor)

---

### Phase 6: Meeting Booking (Hektor)

**Who:** Hektor (autonomous)

**Steps:**

1. **Reply to Positive Leads**
   - Template:
     ```
     Hi [Name],

     Great! Let's schedule 15min.

     Here's my calendar: [Calendly link]

     Pick a time that works for you.

     Looking forward to it!
     [Client Name]
     ```

2. **Confirm Meeting**
   - Calendly/Cal.com auto-books → sends calendar invite
   - Hektor monitors webhook: "Meeting booked with [Name] at [Date/Time]"
   - Post to #lead-gen:
     ```
     ✅ MEETING BOOKED — Client: [Name]
     Lead: Anna Müller (TechStartup)
     Date: Feb 15, 2026, 10:00 AM CET
     Type: Discovery Call (15min)
     Status: Confirmed

     Prep materials sent to client.
     ```

3. **Send Prep Materials (to Client)**
   - Email to client:
     ```
     Subject: Meeting Booked: Anna Müller (TechStartup) — Feb 15, 10:00 AM

     Hi [Client Name],

     You have a confirmed meeting with:

     Name: Anna Müller
     Title: VP Sales
     Company: TechStartup GmbH
     LinkedIn: [link]

     Background:
     - Series A funded ($5M), 75 employees
     - Expanding EMEA sales team
     - Current tech stack: HubSpot, Salesforce
     - Pain point: Need more qualified pipeline

     Suggested talk track:
     - Open: "Tell me about TechStartup's current sales process"
     - Qualify: "How many meetings/month does your team book? What's your close rate?"
     - Pitch: "We help companies like yours book 15-20 qualified meetings/month with AI-powered outreach"
     - Close: "Want to try a pilot? 3 meetings free, no strings attached"

     Meeting Link: [Zoom/Google Meet]

     Good luck!
     ```

4. **Reminder (Day Before)**
   - Send reminder to lead:
     ```
     Hi [Name],

     Quick reminder: We have a call tomorrow (Feb 15, 10:00 AM).

     Looking forward to it!

     [Calendly link to reschedule if needed]
     ```

5. **Post-Meeting Follow-Up**
   - Day after meeting: Hektor checks with client
     - Message to client: "Did [Name] show up? Was it qualified?"
     - Client replies: "Yes, great meeting" or "No-show" or "Not qualified"
   - If no-show or not qualified: Replace with another meeting (guarantee)
   - Log to dashboard: "Meeting completed", "SQL conversion: Yes/No"

**Output:** 10-20 booked meetings per client per month

**Time:** 10-15 minutes/day (booking + prep + follow-up)

---

### Phase 7: Reporting & Optimization (Hektor)

**Who:** Hektor (weekly)

**Steps:**

1. **Weekly Report to Client**
   - Email every Friday:
     ```
     Subject: Weekly AS Report — Week of Feb 10

     Hi [Client Name],

     Here's your weekly appointment setting summary:

     Leads Contacted: 50
     Responses: 12 (24% reply rate)
     Meetings Booked: 4
     Meetings Completed: 3 (1 no-show, replaced)
     SQL Conversion: 2/3 (67%)

     Top Performing Email: Template B (Social Proof)
     Open Rate: 45%
     Reply Rate: 20%

     Next Week Plan:
     - Contact 50 new leads
     - Target: 5 meetings booked

     Questions? Let me know.

     Best,
     Hektor
     ```

2. **Dashboard Update**
   - Live metrics: Leads contacted, responses, meetings, SQL conversion
   - Charts: Reply rate trend, meeting booking trend
   - Costs: API usage, email sends

3. **Optimization Loop**
   - Analyze: Which template/subject line has best reply rate?
   - Adjust: Use best-performing template for 80% of sends, test new ones for 20%
   - Feedback: If client says "meetings aren't qualified", adjust ICP criteria

**Output:** Continuous improvement, 10-20% increase in reply/booking rates over 3 months

**Time:** 30 minutes/week (report + analysis)

---

## 3. Scout vs Hektor Job Split (Optimized)

### Current Split

| Phase | Scout | Hektor | Rationale |
|-------|-------|--------|-----------|
| **Client Onboarding** | ❌ | ✅ | Hektor coordinates, Scout not needed |
| **Lead Research** | ✅ | ❌ | Scout's core strength (API queries, data gathering) |
| **Lead Enrichment** | ❌ | ✅ | Hektor's judgment (scoring, qualification) |
| **Outreach Drafting** | ❌ | ✅ | Hektor's creativity (messaging, personalization) |
| **Outreach Execution** | ❌ | ✅ | Hektor's operational (sending, tracking) |
| **Meeting Booking** | ❌ | ✅ | Hektor's client-facing (confirmation, prep) |
| **Reporting** | ❌ | ✅ | Hektor's strategic (analysis, optimization) |

### Potential Improvements

**Option A: Scout Does Pre-Enrichment**
- **Change:** Scout adds basic company research DURING lead research phase
  - Example: Scout queries "[Company] funding" via Brave Search, adds to JSON
  - Benefit: Hektor spends less time on basic research, focuses on scoring
  - Cost: Scout's research phase takes 20% longer (15min → 18min)
  - **Verdict:** ✅ IMPLEMENT — Saves Hektor time, marginal Scout cost

**Option B: Scout Monitors Responses**
- **Change:** Scout checks inbox, categorizes replies (Positive/Question/Not Now/Opt-Out)
  - Hektor only handles "Positive" replies (booking meetings)
  - Benefit: Hektor focuses on high-value tasks (booking, not inbox triage)
  - Cost: Scout needs email access, additional logic
  - **Verdict:** ⚠️ TEST LATER — Adds complexity, not MVP

**Option C: Scout Generates Weekly Report**
- **Change:** Scout pulls dashboard metrics, writes weekly summary
  - Hektor reviews + adds strategic insights
  - Benefit: Hektor spends less time on data aggregation
  - Cost: Scout needs dashboard API access
  - **Verdict:** ✅ IMPLEMENT (Month 2) — After dashboard metrics stable

---

### Optimized Split (Post-Implementation)

| Phase | Scout | Hektor | Change from Current |
|-------|-------|--------|---------------------|
| Lead Research | ✅ + Pre-Enrichment | ❌ | Scout adds basic company research |
| Enrichment | ❌ | ✅ (scoring only) | Hektor focuses on qualification, not basic research |
| Reporting | ✅ (data aggregation) | ✅ (insights) | Scout generates report draft, Hektor adds analysis |

**Result:** Hektor saves 10-15 mins/day, focuses on high-value tasks (scoring, booking, strategy)

---

## 4. Technical Setup Checklist

### 4.1 APIs & Data Sources

| Service | Purpose | Cost | Setup Steps |
|---------|---------|------|-------------|
| **Apollo.io** | Lead database (B2B contacts) | €49/Mo (1K leads) | 1. Sign up: apollo.io<br>2. Get API key: Settings → Integrations → API<br>3. Test query: `curl -H "Authorization: Bearer [key]" https://api.apollo.io/v1/people/search` |
| **Hunter.io** | Email verification | €49/Mo (1K verifications) | 1. Sign up: hunter.io<br>2. Get API key: Settings → API<br>3. Test: `curl https://api.hunter.io/v2/email-verifier?email=test@example.com&api_key=[key]` |
| **LinkedIn Sales Navigator** | Advanced filtering (optional) | €99/Mo | 1. Subscribe: linkedin.com/sales<br>2. Manual export (CSV) or scraping tool<br>3. NOT API-based (manual process) |
| **Brave Search API** | Company research | Free (built-in OpenClaw tool) | No setup needed |

**Total Cost:** €98/Mo (Apollo + Hunter), €197/Mo (+ LinkedIn, optional)

---

### 4.2 Email Sending

**Option A: Client's Email Domain (Recommended for credibility)**
- **Method:** SMTP relay via client's email server
- **Setup:**
  1. Client provides: Email address (e.g., sales@client.com), SMTP credentials
  2. Configure OpenClaw SMTP: `config.set messaging.smtp.host smtp.client.com`, `messaging.smtp.user sales@client.com`, `messaging.smtp.pass [password]`
  3. Test: Send 1 test email via `message action:send`
- **Pros:** Higher deliverability (sent from client's domain), looks more credible
- **Cons:** Requires client trust (access to their email), setup per client

**Option B: Our Domain (Easier, lower deliverability)**
- **Method:** Send from laurenz@[our-domain].com on behalf of client
- **Setup:**
  1. Register domain: appointment-setting.de (example)
  2. Configure SPF/DKIM: Add DNS records for email authentication
  3. Warm up domain: Send 10-20 emails/day for 2 weeks before scaling
- **Pros:** Easier setup, no client credentials needed
- **Cons:** Lower deliverability (new domain), less credible ("who is laurenz@...?")

**Recommendation:** Start with **Option B** (our domain) for pilot clients, migrate to **Option A** (client domain) after Month 1

---

### 4.3 Calendar Integration

| Tool | Cost | Setup | Pros | Cons |
|------|------|-------|------|------|
| **Calendly** | €8-€15/Mo | 1. Sign up: calendly.com<br>2. Create booking link<br>3. Webhook: Settings → Integrations → Webhook URL (point to OpenClaw endpoint) | Easy, professional, widely used | Paid, per-user pricing |
| **Cal.com** | Free (self-hosted) | 1. Deploy: cal.com (Docker)<br>2. Create booking link<br>3. Webhook: Same as Calendly | Free, open-source, customizable | Requires hosting, more setup |

**Recommendation:** **Calendly** for simplicity (€8/Mo = negligible cost vs time saved)

**Webhook Integration:**
- OpenClaw endpoint: `/webhooks/calendar-booking`
- Payload: `{ event: "meeting.booked", lead_id: "...", date: "...", time: "..." }`
- Action: Hektor posts to #lead-gen + sends prep materials to client

---

### 4.4 Dashboard Anpassungen

**Current Dashboard:** Tasks, Activity, Projects, Docs, Memory, Metrics

**New Requirements for Appointment Setting:**

1. **AS Clients Page** (new tab)
   - List all clients: Name, ICP, Start Date, Status (Active/Paused)
   - Metrics per client: Meetings booked, SQL conversion, MRR
   - Actions: Edit ICP, Pause/Resume, View Report

2. **Lead Pipeline** (new tab)
   - Kanban board:
     - Column 1: Raw Leads (Scout's output)
     - Column 2: Enriched (Hektor's qualified leads)
     - Column 3: Contacted (Outreach sent)
     - Column 4: Replied (Positive responses)
     - Column 5: Booked (Meetings confirmed)
     - Column 6: Completed (Meeting happened)
   - Drag-and-drop: Move leads between columns
   - Filters: By client, by score, by date

3. **Outreach Metrics** (new section in Metrics tab)
   - Charts:
     - Emails sent/week (line chart)
     - Reply rate trend (line chart)
     - Meeting booking rate (bar chart)
   - Table: Per-template performance (open rate, reply rate, booking rate)

4. **Weekly Reports** (new section in Activity tab)
   - Auto-generated every Friday
   - Downloadable PDF: Send to client via email

**API Endpoints (to build):**
- `GET /api/as-clients` — List all AS clients
- `POST /api/as-clients` — Create new AS client
- `GET /api/as-pipeline?client=[id]` — Get lead pipeline for client
- `PATCH /api/as-pipeline/[lead_id]` — Update lead status
- `GET /api/as-metrics?client=[id]&week=[date]` — Get metrics for client for specific week

**Timeline:** 2-3 days to implement (Claude Code can build this)

---

### 4.5 OpenClaw Config Changes

**Current Config:**
- Agents: Hektor (main), Scout (main)
- Heartbeats: Hektor (30min), Scout (60min)
- Tools: browser, web_search, web_fetch, etc.
- Message routing: Telegram (DM + group topics)

**New Config Additions:**

1. **Message Templates** (for outreach emails)
   - Store in: `memory/templates/outreach-[template-name].md`
   - Reference in Hektor's workflow: Load template, personalize, send

2. **Webhook Endpoints** (for Calendly integration)
   - Add to config: `webhooks.enabled: true`, `webhooks.port: 3001`
   - Endpoint: `/webhooks/calendar-booking` (handled by subagent-webhook server)

3. **SMTP Config** (for email sending)
   - Add: `messaging.smtp.host`, `messaging.smtp.port`, `messaging.smtp.user`, `messaging.smtp.pass`
   - Per-client: Store in `memory/clients/[client-name]/smtp.json` (if using client domains)

4. **API Keys** (Apollo, Hunter)
   - Add to `.env` file:
     ```
     APOLLO_API_KEY=your_key_here
     HUNTER_API_KEY=your_key_here
     ```
   - Reference in Hektor's scripts: `process.env.APOLLO_API_KEY`

**No gateway restart needed** (dynamic config, loaded at runtime)

---

## 5. Test Plan (Week 1)

### 5.1 Unit Tests (Component-Level)

**Test 1: Apollo API Query**
- **Action:** Scout runs query: "VP Sales at B2B SaaS, DACH, 10-100 employees"
- **Expected Output:** 10-20 raw leads (JSON format)
- **Validation:** Check: Name, Email, Company, LinkedIn URL present
- **Pass Criteria:** 80%+ of leads have all required fields

**Test 2: Hunter Email Verification**
- **Action:** Hektor verifies 10 emails from Apollo results
- **Expected Output:** 10 scores (0-100)
- **Validation:** Check: Score >70 for at least 7/10 emails
- **Pass Criteria:** 70%+ deliverable rate

**Test 3: Brave Search Company Research**
- **Action:** Hektor researches 5 companies (funding, revenue, employees)
- **Expected Output:** 5 research summaries (JSON)
- **Validation:** Check: Funding stage, revenue estimate, employee count present
- **Pass Criteria:** 80%+ coverage (4/5 companies have all data)

**Test 4: Email Drafting**
- **Action:** Hektor drafts 3 outreach emails (Templates A, B, C)
- **Expected Output:** 3 personalized emails
- **Validation:** Check: Placeholders replaced ([Name], [Company], [Recent News])
- **Pass Criteria:** 100% personalization (no placeholders left)

**Test 5: Email Sending (Test)**
- **Action:** Hektor sends 1 test email to laurenz@example.com
- **Expected Output:** Email received in inbox
- **Validation:** Check: Subject, body, tracking pixel (if enabled)
- **Pass Criteria:** Email delivered, looks professional

**Test 6: Calendar Booking (Mock)**
- **Action:** Simulate Calendly webhook: POST to `/webhooks/calendar-booking`
- **Expected Output:** Hektor posts to #lead-gen: "Meeting booked"
- **Validation:** Check: Message contains lead name, date, time
- **Pass Criteria:** Notification posted within 10 seconds

---

### 5.2 Integration Tests (End-to-End)

**Test 7: Full Workflow (1 Lead)**
- **Steps:**
  1. Scout finds 1 test lead (manual: use your own contact info)
  2. Hektor enriches (email verification, research)
  3. Hektor drafts outreach email
  4. Hektor sends email (to your inbox)
  5. You reply: "Yes, let's talk"
  6. Hektor books meeting (Calendly link sent)
  7. You book meeting
  8. Hektor sends prep materials
- **Expected Outcome:** Meeting booked, prep materials received
- **Pass Criteria:** All 8 steps complete, no errors, professional output

**Test 8: Batch Processing (10 Leads)**
- **Steps:**
  1. Scout finds 10 test leads
  2. Hektor enriches all 10
  3. Hektor drafts 10 outreach emails
  4. Hektor sends 10 emails (to test addresses)
- **Expected Outcome:** 10 emails sent, tracked in dashboard
- **Pass Criteria:** 100% send success, no spam/bounce

---

### 5.3 Load Tests (Scalability)

**Test 9: High Volume (50 Leads/Day)**
- **Action:** Scout finds 50 leads, Hektor processes all
- **Expected Outcome:** All 50 enriched + drafted within 2 hours
- **Pass Criteria:** No API rate limits hit, no errors

**Test 10: Multi-Client (3 Clients Parallel)**
- **Action:** Scout finds 20 leads for Client A, 20 for Client B, 20 for Client C (simultaneously)
- **Expected Outcome:** All 60 leads processed, no cross-contamination (Client A's leads don't go to Client B)
- **Pass Criteria:** 100% accuracy, clean separation

---

### 5.4 Quality Tests (Output Validation)

**Test 11: Lead Quality**
- **Action:** Hektor scores 20 leads
- **Expected Outcome:** 15+ leads scored 7+/10
- **Validation:** Manual review: Do scores match quality? (email deliverable, ICP fit, pain point clear)
- **Pass Criteria:** 80%+ agreement between Hektor's score and manual review

**Test 12: Email Quality**
- **Action:** Hektor drafts 10 outreach emails
- **Expected Outcome:** 10 professional, personalized emails
- **Validation:** Manual review: No spelling errors, placeholders replaced, tone appropriate
- **Pass Criteria:** 90%+ quality (9/10 emails look good)

---

### 5.5 Dashboard Tests

**Test 13: AS Clients Page**
- **Action:** Add 1 test client via dashboard
- **Expected Outcome:** Client appears in list, ICP editable
- **Pass Criteria:** CRUD operations work (Create, Read, Update, Delete)

**Test 14: Lead Pipeline**
- **Action:** Move 1 lead from "Raw" → "Enriched" → "Contacted" → "Booked"
- **Expected Outcome:** Lead status updates, visible in dashboard
- **Pass Criteria:** Drag-and-drop works, status persists

**Test 15: Metrics Dashboard**
- **Action:** Generate 1 week of fake data (50 emails sent, 10 replies, 3 bookings)
- **Expected Outcome:** Charts render correctly
- **Pass Criteria:** Data visualized, no errors

---

## 6. Week 1 Implementation Schedule

### Monday (Day 1): Foundation

**Morning:**
- [ ] Subscribe to Apollo.io + Hunter.io (€98/Mo)
- [ ] Get API keys (Apollo, Hunter)
- [ ] Add to `.env` file
- [ ] Test Apollo query (Scout): "VP Sales, B2B SaaS, DACH"
- [ ] Test Hunter verification (Hektor): Verify 10 emails

**Afternoon:**
- [ ] Sign up for Calendly (€8/Mo)
- [ ] Create test booking link
- [ ] Setup webhook endpoint (OpenClaw)
- [ ] Test webhook: Simulate booking, check Hektor receives notification

**Evening:**
- [ ] Create #lead-gen topic in Telegram group
- [ ] Post test message: "AS Implementation Week 1 — Kickoff"

---

### Tuesday (Day 2): Workflow Implementation

**Morning:**
- [ ] Scout: Implement lead research workflow (Apollo query + parse)
- [ ] Scout: Test with 10 real DACH SaaS leads
- [ ] Scout: Post findings to #lead-gen

**Afternoon:**
- [ ] Hektor: Implement enrichment workflow (Hunter + Brave Search)
- [ ] Hektor: Test with Scout's 10 leads
- [ ] Hektor: Post enriched results to #lead-gen

**Evening:**
- [ ] Hektor: Draft 3 outreach templates (A, B, C)
- [ ] Hektor: Personalize for 10 leads
- [ ] Hektor: Post drafts to #lead-gen (awaiting approval)

---

### Wednesday (Day 3): Outreach Testing

**Morning:**
- [ ] Laurenz: Review 10 draft emails (approve or feedback)
- [ ] Hektor: Adjust based on feedback
- [ ] Hektor: Send 10 test emails (to your own addresses or test contacts)

**Afternoon:**
- [ ] Monitor: Check inbox for delivery, opens, spam folder
- [ ] Hektor: Track responses (if any test replies)
- [ ] Hektor: Post tracking results to #lead-gen

**Evening:**
- [ ] Simulate positive reply: You reply to 1 test email "Yes, let's talk"
- [ ] Hektor: Book meeting (send Calendly link)
- [ ] You: Book meeting via Calendly
- [ ] Hektor: Send prep materials

---

### Thursday (Day 4): Dashboard Setup

**Morning:**
- [ ] Claude Code: Implement AS Clients page (API + UI)
- [ ] Claude Code: Implement Lead Pipeline (Kanban board)
- [ ] Test: Add 1 test client, move 1 lead through pipeline

**Afternoon:**
- [ ] Claude Code: Implement Outreach Metrics (charts)
- [ ] Test: Generate fake data, verify charts render
- [ ] Claude Code: Implement Weekly Report (PDF export)

**Evening:**
- [ ] Full test: End-to-end workflow (Scout → Hektor → Dashboard)
- [ ] Validate: All data flows correctly, no errors

---

### Friday (Day 5): Integration & Polish

**Morning:**
- [ ] Scout + Hektor: Run full workflow with 20 leads (batch test)
- [ ] Validate: All 20 enriched, drafted, tracked in dashboard

**Afternoon:**
- [ ] Hektor: Generate first weekly report (test data)
- [ ] Laurenz: Review report (does it look professional?)
- [ ] Adjust: Fix any formatting issues

**Evening:**
- [ ] Final test: Multi-client simulation (3 test clients, 10 leads each)
- [ ] Validate: Clean separation, no cross-contamination
- [ ] Post to #lead-gen: "Week 1 Implementation Complete ✅"

---

## 7. Go-Live Checklist (Week 2)

**Before First Real Client:**

- [ ] All Unit Tests passed (Tests 1-6)
- [ ] All Integration Tests passed (Tests 7-8)
- [ ] All Load Tests passed (Tests 9-10)
- [ ] All Quality Tests passed (Tests 11-12)
- [ ] All Dashboard Tests passed (Tests 13-15)
- [ ] Apollo + Hunter subscriptions active
- [ ] Calendly webhook operational
- [ ] Email domain warmed up (if using our domain)
- [ ] AGENTS.md updated with AS workflow
- [ ] Scout + Hektor coordination tested (no conflicts)
- [ ] #lead-gen topic ready for production use
- [ ] Laurenz trained on: Dashboard, approving emails, client onboarding

**Ready to onboard first pilot client!**

---

## 8. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Apollo API rate limit** | Medium | High | Stagger queries (10-20 leads/hour), monitor usage, upgrade plan if needed |
| **Email deliverability issues** | High | High | Warm up domain (2 weeks, 10-20 emails/day), use client's domain after pilot, monitor spam folder |
| **Low response rates** | Medium | Medium | A/B test templates, optimize subject lines, adjust ICP if <5% reply rate after 100 emails |
| **Calendly webhook failure** | Low | Medium | Fallback: Manual booking link in email if webhook down |
| **Scout/Hektor coordination errors** | Low | High | Clear handoff points (Scout posts → Hektor reads), log all steps, weekly review |
| **Client complaints (lead quality)** | Medium | High | Weekly QA reviews with Laurenz, adjust ICP criteria, replace bad leads for free |
| **Dashboard downtime** | Low | Medium | Fallback: Manual tracking in Google Sheets if dashboard down |
| **DSGVO non-compliance** | Medium | High | Only store contact + company data, honor opt-out requests immediately, no tracking cookies |

---

## 9. Success Metrics (Week 1-4)

| Metric | Week 1 Target | Week 2 Target | Week 4 Target | How Measured |
|--------|---------------|---------------|---------------|--------------|
| **Leads Researched** | 50 (test) | 100 (real) | 200 | Dashboard count |
| **Leads Enriched** | 40 (80%) | 80 (80%) | 160 (80%) | Dashboard count |
| **Emails Sent** | 10 (test) | 50 | 150 | SMTP logs |
| **Reply Rate** | N/A (test) | 10% (5 replies) | 15% (22 replies) | Inbox tracking |
| **Meetings Booked** | 1 (test) | 3 | 10 | Calendly webhook |
| **Clients Onboarded** | 0 (pilot prep) | 1 | 2-3 | Dashboard |
| **MRR** | €0 | €2.400 (1 client) | €7.200 (3 clients) | Manual tracking |

---

## 10. Next Steps (After Week 1)

**Week 2-4: Pilot Clients**
- Onboard 1-3 pilot clients (free 3-meeting offer)
- Deliver 10-15 meetings per client
- Gather feedback: What works? What doesn't?
- Iterate on ICP, messaging, workflow

**Month 2: Scale**
- Reach 3-5 paying clients (€2.000-€4.000/Mo each)
- Automate approval process (Hektor auto-sends after Week 1 QA)
- Optimize: Which templates/subject lines convert best?
- Dashboard metrics: Track everything, optimize continuously

**Month 3: Productize**
- Document full playbook (Step-by-step AS manual)
- Consider: White-label offering for other agencies?
- Consider: Hire VA to handle email sending (if volume justifies)
- Plan: Scale to 10 clients by Month 6

---

**Implementation ready. Let's execute Week 1 starting tomorrow (Tuesday, Feb 12).**

