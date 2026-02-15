  
**THE COMPLETE OPENCLAW**

**COLD OUTREACH PLAYBOOK**

From Signal Detection to Closed Deals

End-to-End Agent Prompts, Service Breakdowns & Dashboard Setup

By Matt Ganzak  |  ScaleUP Media  |  THE SPRINT Training Series

Live Training \#1  |  February 2026

# **TABLE OF CONTENTS**

Phase 1: Signal Detection \- Finding Opportunities

Phase 2: Data Scraping \- Multi-Agent Setup

Phase 3: Finding Decision Makers \- Email Discovery

Phase 4: Email Validation \- Cleaning Your List

Phase 5: Domain Setup \- Buying & Configuring

Phase 6: Cold Email Infrastructure \- Instantly.ai & Alternatives

Phase 7: Writing Personalized Cold Emails

Phase 8: Data Management \- CSV & Google Sheets

Phase 9: Performance Dashboard

Appendix A: Complete Prompt Library

Appendix B: Troubleshooting Guide

Appendix C: Cost Calculator

# **PHASE 1: SIGNAL DETECTION**

*Finding Opportunities Your Competition Misses*

## **What Are Signals?**

Signals are real-time indicators that a business has a specific pain point your product or service can solve. Instead of blasting cold emails to random companies, you use your OpenClaw agent to continuously monitor the internet for these buying signals, so you only reach out to companies that are actively experiencing the problem you fix.

## **Types of Signals to Monitor**

| Signal Type | What to Look For | Real-World Example |
| :---- | :---- | :---- |
| Hiring Signals | Job postings for roles related to your solution | Restaurant posts 'Operations Manager' \= scaling \= YesChefOS opportunity |
| Tech Stack Changes | Companies adopting or dropping tools | Company ditches HubSpot \= needs new CRM \= your SaaS opportunity |
| Funding Signals | Recent Series A/B/C raises | Startup raises $5M \= has budget, needs to scale fast |
| Pain Point Signals | Negative reviews, complaints | Bad Yelp reviews about wait times \= YesChefOS opportunity |
| Growth Signals | New locations, expansions, press | Chain opens 3 new locations \= needs operational software |
| Compliance Signals | Regulatory changes, new laws | New tax law \= TaxSmartAI opportunity for every CPA firm |
| Content Signals | Blog/social posts about problems | CEO posts about 'scaling challenges' \= venture studio opportunity |
| Competitor Signals | Competitor outages or price hikes | Major outage \= steal their customers immediately |

## **Setting Up Your Signal Detection Agent**

Your OpenClaw agent will continuously scan multiple sources and compile a daily signal report.

**Step 1: Define Your Ideal Customer Profile (ICP)**

Before your agent can find signals, it needs to know exactly who you are looking for.

**PROMPT: ICP Definition Agent**

You are an ICP analysis agent. Help me define the perfect target customer.

Product: \[YOUR PRODUCT NAME\]

Description: \[WHAT IT DOES\]

Price: \[MONTHLY PRICE\]

Pain Points Solved: \[LIST 3-5\]

Create a detailed ICP with:

1\. Company size (employee count range)

2\. Industry verticals (be specific)

3\. Annual revenue range

4\. Geographic targets

5\. Technology they likely use

6\. Job titles of decision makers

7\. Job titles of champions/influencers

8\. Common pain points they experience

9\. Trigger events indicating buying readiness

10\. Keywords they use discussing these pain points

Format as structured JSON so other agents can reference this.

**Real-World Example: YesChefOS ICP**

{ "product": "YesChefOS",

  "icp": {

    "company\_size": "5-1200 locations",

    "industries": \["restaurants","fast-casual","QSR","ghost kitchens"\],

    "revenue": "$1M-$500M annual",

    "decision\_makers": \["CEO","COO","VP Operations","Director of IT"\],

    "champions": \["General Manager","Regional Manager","Head Chef"\],

    "buying\_triggers": \[

      "Opening new locations", "Hiring operations roles",

      "Bad reviews mentioning consistency", "Switching POS systems"

    \]

  }

}

**Step 2: Signal Scanner Agent**

**PROMPT: Signal Scanner Agent**

You are a Signal Detection Agent. Scan the internet for buying signals

matching my ICP.

\#\# YOUR ICP: \[PASTE ICP JSON\]

\#\# SOURCES TO SCAN:

1\. Job boards: Indeed, LinkedIn Jobs, Glassdoor

2\. News: Google News, TechCrunch, local business journals

3\. Review sites: Yelp, G2, Capterra, Google Reviews

4\. Social: LinkedIn posts, Twitter/X

5\. Government filings: New business registrations, permits

\#\# FOR EACH SIGNAL RETURN:

\- company\_name, website, signal\_type

\- signal\_source (URL), signal\_description (2-3 sentences)

\- signal\_strength (hot|warm|cold)

\- estimated\_company\_size, industry, location

\- date\_detected, recommended\_approach

\#\# OUTPUT: JSON array sorted by signal\_strength (hot first).

Only signals from last 7 days. Target 20-50 per scan.

**Step 3: Signal Enrichment Agent**

**PROMPT: Signal Enrichment Agent**

You are a Signal Enrichment Agent. Enrich each raw signal with context.

\#\# INPUT: \[RAW SIGNAL JSON FROM SCANNER\]

\#\# FOR EACH SIGNAL ADD:

\- company\_website, company\_linkedin

\- estimated\_employees, estimated\_revenue

\- tech\_stack\_indicators, recent\_news

\- competitors\_they\_use, social\_proof

\- pain\_point\_evidence (direct quotes/evidence)

\- urgency\_score: 1-10 rating

\- personalization\_hooks: 3-5 specific things for outreach

\#\# SCORING: 8-10=Active pain, 5-7=Growth mode, 1-4=General fit

\#\# OUTPUT: Enriched JSON sorted by urgency\_score descending.

## **Real-World Signal Detection Examples**

**Example 1: YesChefOS \- Restaurant Chain Signal**

Signal: A regional chain with 47 locations posts 3 'Regional Operations Manager' listings, and their CEO posts on LinkedIn about 'challenges of maintaining quality as we scale to 100 locations.' This is a 9/10 urgency signal.

**Example 2: TaxSmartAI \- Compliance Signal**

Signal: IRS announces new crypto reporting requirements. Your agent finds 200+ CPA firms blogging about it but none mention automated tools. Regulatory deadline creates urgency \+ they have the problem but no solution.

**Example 3: Social Agent \- Competitor Pain Signal**

Signal: Major social media tool has a 6-hour outage. 150+ businesses publicly complaining on Twitter/X saying 'looking for alternatives.' Contact within 24 hours while pain is fresh.

# **PHASE 2: DATA SCRAPING WITH MULTI-AGENT SETUP**

*Turning Signals Into Actionable Lead Data*

## **Multi-Agent Architecture**

Your scraping operation uses a coordinator that delegates to specialized sub-agents. Each agent has one job.

| Agent | Role | Input | Output |
| :---- | :---- | :---- | :---- |
| Coordinator | Orchestrates pipeline | Signal list | Final enriched CSV |
| Website Scraper | Company info from sites | Company URLs | Company data JSON |
| LinkedIn Scraper | Team members & titles | Company names | People data JSON |
| Review Scraper | Pain point data | Company names | Review summaries |
| News Scraper | Recent mentions | Company names | News summaries |
| Data Compiler | Merge into clean CSV | All outputs | Master lead CSV |

**PROMPT: Coordinator Agent**

You are the Lead Research Coordinator managing specialized sub-agents.

\#\# WORKFLOW:

1\. Receive enriched signal list from Phase 1

2\. For each signal, delegate to sub-agents:

   a. Company URL \-\> Website Scraper

   b. Company name \-\> LinkedIn Research Agent

   c. Company name \-\> Review Scraper

   d. Company name \-\> News Scraper

3\. Collect all results

4\. Pass to Data Compiler Agent

5\. Quality check final output

\#\# RULES: Process in batches of 10\. Retry failures once.

Prioritize hot \> warm \> cold signals.

Track: {signal\_id, status, agents\_completed, data\_completeness\_score}

**PROMPT: Website Scraper Agent**

You are a Website Research Agent. Given a company URL, extract:

\- company\_name, tagline, industry, products\_services

\- locations (number and where), leadership\_team (names \+ titles)

\- contact\_info, tech\_indicators, blog\_topics (last 5 posts)

\- careers\_page (open positions), social\_links

\- company\_size\_indicators, pain\_point\_clues

OUTPUT: Structured JSON. If a field cannot be found, set null.

Never fabricate data.

**PROMPT: LinkedIn Research Agent**

You are a LinkedIn Research Agent using publicly available data.

Use Google: '\[company\] site:linkedin.com/in' and '\[company\] \[title\] site:linkedin.com/in'

\#\# FIND THE DECISION-MAKING HIERARCHY:

\- C-Suite (CEO, COO, CTO, CFO)

\- VP level (VP Ops, VP Engineering, VP Marketing)

\- Director level, Manager level

\#\# FOR EACH PERSON:

\- full\_name, job\_title, linkedin\_url

\- decision\_authority (final\_decision|strong\_influence|champion|gatekeeper)

\- tenure, recent\_activity (personalization fodder)

\- email\_pattern\_guess (validated later)

TARGET: 3-5 contacts per company. At least 1 C-suite \+ 1 manager.

**PROMPT: Review Scraper Agent**

You are a Review Analysis Agent. Find and analyze public reviews.

SOURCES: Google Reviews, Yelp, G2, Capterra, Glassdoor, BBB

EXTRACT:

\- overall\_rating, total\_reviews

\- common\_complaints (top 3-5 themes)

\- specific\_pain\_quotes: 3-5 direct quotes about problems

  our product solves (for use in cold emails\!)

\- competitor\_mentions, response\_pattern

\- recent\_negative\_trend (any spike in bad reviews)

**PROMPT: Data Compiler Agent**

You are the Data Compiler. Merge all sub-agent data into clean records.

1\. Merge into single lead record per company

2\. Resolve conflicts between sources

3\. Calculate lead\_score (1-100):

   Signal strength (40%) \+ Data completeness (20%)

   \+ Company fit to ICP (20%) \+ Urgency indicators (20%)

4\. Generate personalization\_brief (3-4 sentences for SDR)

5\. Flag data quality issues

OUTPUT FORMAT (CSV columns):

company\_name, website, industry, employee\_count, revenue,

location, signal\_type, signal\_description, signal\_strength,

contact\_1\_name, contact\_1\_title, contact\_1\_email\_guess,

contact\_1\_linkedin, \[repeat for contacts 2-3\],

review\_summary, news\_summary, personalization\_brief,

lead\_score, data\_quality\_flag

# **PHASE 3: FINDING DECISION MAKERS**

*Email Discovery, Guessing, and Enrichment*

## **Method 1: Email Pattern Guessing with OpenClaw**

**PROMPT: Email Pattern Guesser Agent**

You are an Email Pattern Detection Agent.

\#\# COMMON PATTERNS (frequency order):

1\. first.last@domain.com (\~36%)

2\. first@domain.com (\~25%)

3\. firstlast@domain.com (\~15%)

4\. flast@domain.com (\~10%)

5\. first\_last@domain.com (\~5%)

6\. firstl@domain.com (\~4%)

7\. f.last@domain.com (\~3%)

\#\# PROCESS:

1\. Take company domain

2\. Search for known emails (website, press, job postings, GitHub)

3\. If found, determine pattern and apply to all contacts

4\. If not found, generate top 4 pattern guesses

\#\# OUTPUT: { domain, detected\_pattern, confidence,

  evidence, guesses: \[{name, title, primary\_guess, alternates}\] }

## **Method 2: Email Finder Services \- Pricing Breakdown**

### **Hunter.io**

| Plan | Monthly | Annual | Credits/Mo | Accounts |
| :---- | :---- | :---- | :---- | :---- |
| Free | $0 | $0 | 25 searches \+ 50 verifications | 1 |
| Starter | $49/mo | $34/mo ($408/yr) | 500 searches \+ 1,000 verifications | 3 |
| Growth | $149/mo | $99/mo ($1,188/yr) | 2,500 searches \+ 5,000 verifications | 10 |
| Business | $349/mo | $244/mo ($2,928/yr) | 10,000 searches \+ 20,000 verifications | 20 |
| Enterprise | Custom | Custom | Custom | Unlimited |

**PROMPT: Hunter.io API Integration Agent**

You are an Email Finder Agent using the Hunter.io API.

API Key: \[YOUR\_HUNTER\_API\_KEY\]

Base URL: https://api.hunter.io/v2

\#\# ENDPOINTS:

Domain Search: GET /domain-search?domain={domain}\&api\_key={key}

Email Finder: GET /email-finder?domain={d}\&first\_name={f}\&last\_name={l}\&api\_key={key}

Email Verifier: GET /email-verifier?email={email}\&api\_key={key}

\#\# WORKFLOW:

1\. Domain Search first to see all known emails

2\. Check if target contacts appear in results

3\. For contacts not found, use Email Finder with name \+ domain

4\. Verify all found emails

5\. Log credits used for budget tracking

\#\# ERROR: 429=wait 10s retry. No result=fall back to guessing.

### **Alternative Email Finder Services**

| Service | Starting Price | Key Feature | Best For |
| :---- | :---- | :---- | :---- |
| Apollo.io | Free then $49/mo | 270M+ contacts database | Volume prospecting |
| Snov.io | Free then $39/mo | Email finder \+ drip campaigns | Budget all-in-one |
| Lusha | Free then $49/mo | Phone numbers \+ emails | Multi-channel outreach |
| RocketReach | $53/mo (80 lookups) | High accuracy verified data | Quality over quantity |
| Skrapp.io | Free then $49/mo | LinkedIn email extraction | LinkedIn prospecting |
| FullEnrich | $29/mo | Waterfall (15+ providers) | Maximum find rate, lower cost |
| ContactOut | $79/mo | Chrome extension \+ API | Recruiter workflows |

**Pro Tip: Waterfall Enrichment Strategy**

Try Hunter.io first (highest accuracy), then Apollo.io (largest database), then Snov.io (budget backup). Your agent automates this cascade:

**PROMPT: Waterfall Email Finder Agent**

You are a Waterfall Email Finder. Try multiple services in sequence.

\#\# ORDER: (stop when found with \>80% confidence)

1\. Hunter.io Email Finder (highest accuracy)

2\. Apollo.io lookup (largest database)

3\. Snov.io Email Finder (good backup)

4\. Pattern guessing (free fallback)

\#\# COST TRACKING per batch:

\- Total contacts processed

\- Emails found per service (with %)

\- Credits consumed per service

\- Cost per found email

\- Overall find rate

# **PHASE 4: EMAIL VALIDATION**

*Cleaning Your List Before You Send a Single Email*

## **Why Validation is Non-Negotiable**

If you skip this step, you WILL destroy your sender reputation. Email providers track bounce rate. Over 2-3% bounces \= your domain gets flagged \= ALL emails go to spam. Every single email must be validated.

## **Validation Services Pricing**

| Service | Pricing | Accuracy | Best For |
| :---- | :---- | :---- | :---- |
| DeBounce | $10/5K; $15/10K; volume discounts | \~91% | Best value. Pay-as-you-go. API available. |
| ZeroBounce | $16/2K; $65/10K; $110/25K | \~96% | Highest accuracy \+ spam trap detection |
| NeverBounce | $8/1K; $40/5K; $80/10K | \~92% | Fast (10K in 1 minute) |
| Bouncer | $50/mo for 5,000 | \~95% | Real-time API \+ form verification |
| Emailable | $30/5K; $60/10K | \~93% | Good API, integrates with most ESPs |
| EmailListVerify | $4/1K; $15/5K; $25/10K | \~89% | Cheapest for large lists |
| Reoon | $9.90/5K | \~93% | Affordable with WordPress integration |

**Recommended:** DeBounce for bulk (best value) \+ ZeroBounce for final check on hot leads (highest accuracy).

**PROMPT: Email Validation Agent**

You are an Email Validation Agent using the DeBounce API.

API: https://api.debounce.io/v1/?api={key}\&email={email}

Bulk: POST https://api.debounce.io/v1/upload

\#\# CATEGORIZE RESULTS:

\- SAFE TO SEND: result='Safe to Send' or debounce\_code='5'

\- RISKY: result='Role' or 'Accept-All/Catch-All'

\- DO NOT SEND: result='Invalid' or 'Disposable' or 'Spam-Trap'

\#\# WORKFLOW:

1\. Take master lead CSV from Phase 2/3

2\. Extract all emails, run bulk verification

3\. Categorize: SAFE-\>outreach queue, RISKY-\>manual review,

   INVALID-\>remove and log

4\. Report stats: total, safe, risky, invalid, projected bounce rate

\#\# RULES: Never send unvalidated. Re-validate \>30 days old.

Accept-all: limit 10 sends/day to test. Keep bounce \<2%.

## **Validation Troubleshooting**

| Issue | Cause | Solution |
| :---- | :---- | :---- |
| High invalid rate (\>20%) | Bad data sources or stale data | Switch to better finder; reduce data age to 30 days |
| Many Accept-All results | Catch-all server | Send test first; if no bounce in 24h, cautiously add |
| API timeouts | Large batch \+ slow connection | Break into 1,000 batches; add retry with backoff |
| Credits depleting fast | Duplicates in list | Deduplicate before validating; filter obvious invalids |

# **PHASE 5: DOMAIN SETUP FOR OUTREACH**

*Buying and Configuring Your Cold Email Domain*

## **Why a Separate Domain**

NEVER send cold emails from your main domain. If outreach domain gets flagged, your business emails are unaffected. Non-negotiable.

## **Step 1: Buy Your Outreach Domain**

| Main Domain | Outreach Options | Why It Works |
| :---- | :---- | :---- |
| scaleupmedia.com | scaleupmedia.co, tryscaleup.com | Variation that looks legit but protects main |
| yeschefos.com | yeschef.io, tryyeschef.com | Recognizable brand \+ different TLD |
| taxsmartai.com | taxsmart.io, trytaxsmart.com | Professional variations |

**Where to Buy:** Namecheap ($8-12/yr), Cloudflare Registrar ($8-10/yr, cheapest renewals), GoDaddy ($12-20/yr). Use Namecheap or Cloudflare.

## **Step 2: Email Accounts**

Use Google Workspace ($6/user/mo) or Microsoft 365 ($6/user/mo). Create 3-5 accounts per domain. Spread sending across accounts.

| Account | Purpose | Daily Limit |
| :---- | :---- | :---- |
| matt@tryscaleup.com | Primary \- CEO outreach | 30-50/day after warmup |
| hello@tryscaleup.com | General outreach | 30-50/day after warmup |
| partnerships@tryscaleup.com | Partnership angle | 30-50/day after warmup |
| team@tryscaleup.com | Team angle | 30-50/day after warmup |

## **Step 3: DNS Configuration (Critical)**

Without proper DNS, emails go to spam. Set up ALL THREE:

**SPF Record:**

TXT | Host: @ | v=spf1 include:\_spf.google.com \~all

**DKIM Record:**

Follow Google Workspace or M365 setup wizard to generate your DKIM key.

**DMARC Record:**

TXT | Host: \_dmarc | v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com

**Custom Tracking Domain:** CNAME: track.yourdomain.com pointing to your email platform tracking server.

## **Step 4: Domain Warmup (DO NOT SKIP)**

New domains have zero reputation. Warmup gradually over 2-4 weeks:

| Week | Daily Volume | Status |
| :---- | :---- | :---- |
| Week 1 (Days 1-7) | 5-10/day | Building initial reputation |
| Week 2 (Days 8-14) | 15-25/day | Positive patterns establishing |
| Week 3 (Days 15-21) | 30-40/day | Domain reputation solidifying |
| Week 4 (Days 22-28) | 40-50/day | Full production capacity |

**Instantly.ai includes unlimited warmup in all plans. Enable on Day 1, wait 14+ days before real sends.**

**PROMPT: Domain Verification Agent**

You verify cold email domain configuration before outreach.

\#\# CHECKS:

1\. SPF Record exists with correct 'include'

2\. DKIM key published and valid

3\. DMARC policy set

4\. MX records correct

5\. Domain age (flag if \<14 days)

6\. Warmup running 14+ days

7\. Blacklist check (Spamhaus, Barracuda)

\#\# TOOLS: MXToolbox, mail-tester.com, multirbl.valli.org

\#\# OUTPUT: {domain, spf, dkim, dmarc, mx, warmup\_days,

  blacklists\_clean, ready\_for\_outreach, issues\[\]}

# **PHASE 6: COLD EMAIL INFRASTRUCTURE**

*Instantly.ai and Alternatives*

## **Instantly.ai Pricing**

**Outreach Plans:**

| Plan | Monthly | Annual | Contacts | Emails/Mo |
| :---- | :---- | :---- | :---- | :---- |
| Growth | $37/mo | $30/mo | 1,000 | 5,000 |
| Hypergrowth | $97/mo | $77/mo | 25,000 | 125,000 |
| Light Speed | $358/mo | $286/mo | 100,000 | 500,000 |

All plans: unlimited email accounts \+ unlimited warmup.

**Lead Gen Plans:**

| Plan | Price | Leads/Mo |
| :---- | :---- | :---- |
| Growth Leads | $47/mo | 1,000 verified |
| Supersonic | $97/mo | 4,500 verified |
| Light Speed | $492/mo | 25,000 verified |

**Recommendation:** Start with Hypergrowth ($97/mo). Growth plan's 1,000 contacts is too restrictive. Add SuperSearch ($47/mo) if needed. Total: \~$144/mo.

## **Alternatives Comparison**

| Platform | Price | Key Advantage | Limitation |
| :---- | :---- | :---- | :---- |
| Instantly.ai | $37/mo | Unlimited accounts \+ warmup | Features gated by tier |
| Smartlead.ai | $39/mo | Unlimited warmup \+ AI warmup | Steeper learning curve |
| Saleshandy | $25/mo | Cheapest \+ unlimited emails | Less analytics |
| Lemlist | $59/mo | Best personalization (images) | More expensive |
| Woodpecker | $29/mo | Best for agencies | Lower limits |
| Reply.io | $59/mo | Multi-channel outreach | Complex setup |
| Mailshake | $59/mo | Simple UI \+ phone dialer | Limited automation |

**PROMPT: Instantly Campaign Agent**

You manage Instantly.ai campaigns via API.

API Key: \[YOUR\_KEY\] | Base: https://api.instantly.ai/api/v1

\#\# KEY ENDPOINTS:

Add Leads: POST /lead/add

  {campaign\_id, skip\_if\_in\_workspace: true,

   leads: \[{email, first\_name, last\_name, company\_name, personalization}\]}

Create Campaign: POST /campaign/create

  {name, email\_accounts: \['matt@tryscaleup.com'\]}

Analytics: GET /campaign/analytics?campaign\_id=xxx

\#\# SETTINGS:

\- 30-50 sends per account per day

\- Mon-Fri, 8am-5pm recipient timezone

\- Stop on reply: Yes

\- Track opens \+ clicks (custom tracking domain)

\- Follow-up delay: 3-4 business days

## **Giving Your Agent an Email Box**

Give your OpenClaw agent IMAP/SMTP access to monitor replies and draft responses.

**PROMPT: Email Inbox Management Agent**

You monitor an email inbox for cold outreach replies.

IMAP: imap.gmail.com | SMTP: smtp.gmail.com

Email: matt@tryscaleup.com

Auth: \[APP\_PASSWORD\] (Google App Passwords, never main pw)

\#\# CHECK: Every 15 min during 8am-6pm EST

\#\# CATEGORIZE REPLIES:

1\. INTERESTED: Flag hot, draft calendar link response, alert Matt

2\. MAYBE LATER: Add to nurture, schedule 30/60/90 day follow-up

3\. NOT INTERESTED: Thank, remove from campaigns, add to DNC

4\. REFERRAL: Extract referral info, add to pipeline, draft warm intro

5\. OUT OF OFFICE: Note return date, follow up 2 days after

6\. UNSUBSCRIBE: Immediately remove from ALL campaigns \+ suppression

7\. ANGRY: Remove from all, permanent exclusion, DO NOT REPLY

\#\# DAILY 6PM REPORT:

Total replies, breakdown by category, hot leads needing action,

meetings booked, unsubscribes processed

# **PHASE 7: WRITING PERSONALIZED COLD EMAILS**

*The Emails That Actually Get Replies*

## **Cold Email Framework**

Under 120 words. Nobody reads novels from strangers. Goal: get a reply.

| Element | Purpose | Length |
| :---- | :---- | :---- |
| Subject Line | Get them to open (curiosity/relevance) | 3-7 words |
| Opening Line | Prove you are not a robot | 1 sentence |
| Pain Point | Show you understand their problem | 1-2 sentences |
| Value Prop | How you solve it (results not features) | 1-2 sentences |
| CTA | One simple, low-commitment ask | 1 sentence |
| Signature | Name, title (no links in first email) | 2-3 lines |

**PROMPT: Cold Email Writer Agent**

You write highly personalized cold emails that get replies.

\#\# RULES:

1\. UNDER 120 WORDS, no exceptions

2\. No jargon (leverage, synergize, cutting-edge)

3\. No fake urgency (limited time, act now)

4\. Conversational tone \- smart person texting, not marketer

5\. ONE CTA per email

6\. No attachments/images in first email

7\. Max 1 link (custom tracking domain)

8\. Reference something SPECIFIC about their company

\#\# INPUT: contact info, signal data, pain\_point\_evidence,

  personalization\_hooks, product\_value\_prop

\#\# STRUCTURE:

Subject: \[3-7 words, no spam words\]

Hi {first\_name},

\[Specific reference to their company \- proves research\]

\[Pain point with data/quotes from research\]

\[Value prop with specific result/metric\]

\[CTA: 'Worth a quick chat?' or similar\]

Best, {name}

\#\# FOLLOW-UPS:

Day 3-4: New angle, same pain. Add insight.

Day 7-8: Share case study result (1 sentence).

Day 12-14: Breakup email. Last check-in, no pressure.

## **Use Case Examples**

**Example 1: YesChefOS to Restaurant Chain (Hiring Signal)**

Subject: your 3 new ops manager postings

Hi Sarah, Noticed you are hiring 3 Regional Operations Managers \- congrats on the growth. Scaling from 47 to 100 locations is exciting but also where consistency usually breaks down. We helped a 62-location chain reduce food waste by 23% and cut new-location onboarding from 6 weeks to 11 days. Worth a 15-minute look?

**Why it works:** References specific job postings, names specific results, low-commitment CTA.

**Example 2: TaxSmartAI to CPA Firm (Compliance Signal)**

Subject: crypto reporting changes hitting Q2

Hi David, Read your blog post about preparing for new IRS crypto reporting requirements. We built an AI that automates crypto tax classification. One firm cut crypto tax prep time by 70% last filing season. Would a quick demo be useful before Q2?

**Example 3: Social Agent (Competitor Outage Signal)**

Subject: saw the \[Competitor\] outage hit you too

Hi Jennifer, Saw your post about losing 6 hours of scheduled content during the outage. We built our platform with redundancy to avoid single points of failure. Three customers switched from \[Competitor\] last month and haven't missed a post. Worth exploring as a backup?

**Example 4: Venture Studio (Funding Signal)**

Subject: congrats on the Series A

Hi Mike, Congrats on the $5M raise \- saw the TechCrunch piece. We run a venture studio that has taken 14 SaaS products from concept to revenue. We typically cut 3-4 months off launch by handling the entire build so founders can focus on growth. Worth seeing how we did it for \[similar company\]?

# **PHASE 8: DATA MANAGEMENT**

*CSV and Google Sheets Integration*

## **CSV vs Google Sheets**

| Factor | CSV Files | Google Sheets |
| :---- | :---- | :---- |
| Complexity | Simple, fewer connection points | More setup, more moving parts |
| Agent Reliability | Higher \- agents read/write easily | Lower \- API auth can break |
| Real-time Access | Manual updates | Live data, shareable |
| Best For | Agent processing, pipelines | Human review, team collaboration |
| Recommendation | USE FOR AGENT WORKFLOWS | USE FOR DASHBOARDS \+ TEAM |

**The Play:** CSV for agent work (fewer breakpoints), sync to Google Sheets for human review.

## **Master CSV Schema**

lead\_id, date\_detected, signal\_type, signal\_strength, signal\_source,

company\_name, website, industry, employee\_count, estimated\_revenue,

city, state, country,

contact\_1\_name, contact\_1\_title, contact\_1\_email, contact\_1\_verified,

contact\_1\_linkedin, \[repeat for contacts 2-3\],

review\_summary, news\_summary, personalization\_brief,

lead\_score, pipeline\_stage, last\_action, last\_action\_date,

email\_sent, email\_opened, email\_replied, reply\_sentiment,

meeting\_booked, meeting\_date, deal\_value, notes

## **Google Sheets API Setup (Step by Step)**

**Step 1:** 

Go to console.cloud.google.com \> New Project \> Name it 'OpenClaw-Sheets-Integration'

**Step 2:** 

APIs & Services \> Library \> Enable 'Google Sheets API' AND 'Google Drive API'

**Step 3:** 

APIs & Services \> Credentials \> Create Credentials \> Service Account \> Name 'openclaw-sheets' \> Editor role \> Keys tab \> Add Key \> JSON \> Download the key file

**Step 4:** 

Open JSON key, find client\_email. Create a Google Sheet. Share it with that email as Editor.

**Step 5: Install:** 

pip install gspread google-auth

\# or: npm install googleapis google-auth-library

**PROMPT: Google Sheets Sync Agent**

You sync CSV data to Google Sheets for human review.

\#\# PYTHON SETUP:

import gspread

from google.oauth2.service\_account import Credentials

SCOPES \= \['https://www.googleapis.com/auth/spreadsheets',

          'https://www.googleapis.com/auth/drive'\]

creds \= Credentials.from\_service\_account\_file('key.json', scopes=SCOPES)

client \= gspread.authorize(creds)

\#\# SHEET TABS: Signals, Leads, Validated, Campaigns, Replies, Dashboard

\#\# SYNC: Read CSV \> Open sheet \> Clear tab \> Write headers Row 1 \>

Write data Row 2+ \> Format headers bold \> Log timestamp \+ count

\#\# SCHEDULE: Every 4 hours \+ final sync at 6pm

\#\# ERRORS: 429=wait 60s retry. Empty CSV=warn, don't clear sheet.

# **PHASE 9: PERFORMANCE DASHBOARD**

*Tracking Everything from Signals to Closed Deals*

## **Dashboard Metrics**

| Metric | Source/Formula | Target |
| :---- | :---- | :---- |
| Signals Detected Today | COUNT today's rows in Signals | 20-50/day |
| Leads Enriched Today | COUNT today's Leads rows | 15-40/day |
| Emails Validated Today | COUNT validated added today | 30-100/day |
| Cold Emails Sent Today | SUM across campaigns | 100-200/day |
| Open Rate | Opened / Sent | Over 50% |
| Reply Rate | Replies / Sent | Over 5% |
| Positive Reply Rate | Interested / Total replies | Over 30% |
| Bounce Rate | Bounces / Sent | Under 2% |
| Meetings/Week | COUNT meetings from replies | 5-10/week |
| Cost Per Lead | Total spend / leads | Under $5 |
| Cost Per Meeting | Total spend / meetings | Under $50 |

**Option 1: CSV \+ Google Sheets Dashboard (Recommended)**

Fewest connection points, most reliable. Agents write CSV, sync to Sheets, formulas calculate metrics.

**Option 2: HTML Dashboard**

Single-file HTML with Chart.js for live display during trainings.

**Option 3: Metabase**

Free open-source BI. Install via Docker on your VPS. Connect to SQLite. Overkill for starting but great as you scale.

**PROMPT: Dashboard Data Agent**

You compile metrics from all CSV files into daily dashboard reports.

\#\# DATA SOURCES: signals.csv, leads.csv, validated.csv,

campaigns.csv, replies.csv, costs.csv

\#\# DAILY REPORT SECTIONS:

1\. PIPELINE: New signals, leads, validated today. Total in pipeline.

   Stage breakdown: new \> contacted \> replied \> meeting \> closed

2\. OUTREACH TODAY: Sent, opens (%), replies (%), bounces (%)

3\. LAST 7 DAYS: Same metrics, trend direction

4\. CAMPAIGN BREAKDOWN: Per campaign stats

5\. COSTS: Credits used per service, total daily cost,

   cost per lead, cost per meeting

6\. ACTION ITEMS: Hot leads needing attention,

   underperforming campaigns, technical issues

OUTPUT: daily\_report\_YYYY-MM-DD.csv \+ sync to Dashboard sheet

# **APPENDIX A: COMPLETE PROMPT LIBRARY**

| Agent | Phase | Purpose |
| :---- | :---- | :---- |
| ICP Definition | 1 | Define ideal customer profile |
| Signal Scanner | 1 | Scan web for buying signals |
| Signal Enrichment | 1 | Enrich signals with context |
| Coordinator | 2 | Orchestrate multi-agent pipeline |
| Website Scraper | 2 | Extract company info |
| LinkedIn Research | 2 | Find decision makers |
| Review Scraper | 2 | Analyze reviews for pain points |
| Data Compiler | 2 | Merge data into clean CSV |
| Email Pattern Guesser | 3 | Guess emails from patterns |
| Hunter.io API | 3 | Find emails via Hunter API |
| Waterfall Finder | 3 | Multi-service email cascade |
| Email Validation | 4 | Validate emails before sending |
| Domain Verification | 5 | Verify DNS and domain config |
| Instantly Campaign | 6 | Manage campaigns via API |
| Inbox Management | 6 | Monitor and categorize replies |
| Cold Email Writer | 7 | Write personalized emails |
| Sheets Sync | 8 | Sync CSV to Google Sheets |
| Dashboard Data | 9 | Compile metrics |
| HTML Dashboard | 9 | Generate visual dashboard |

# **APPENDIX B: TROUBLESHOOTING GUIDE**

| Problem | Cause | Fix |
| :---- | :---- | :---- |
| Emails to spam | Missing DNS, not warmed up | Verify SPF/DKIM/DMARC, warmup 2+ weeks |
| High bounce (\>2%) | Bad data, stale lists | Re-validate, better finder, reduce age |
| Low opens (\<30%) | Spammy subject lines | A/B test, use curiosity, avoid trigger words |
| Low replies (\<2%) | Not personalized enough | More specific references, soften CTA |
| Bad agent data | Vague prompts | Add output format reqs, validation rules |
| Sheets API fails | Token expired, quota hit | Refresh creds, check quota dashboard |
| Hunter credits gone | Too many Domain Searches | Use Email Finder for specific contacts |
| Instantly suspended | Too fast, bounces, spam | Reduce volume, improve list quality |
| CSV corrupted | Commas in fields, encoding | Quote fields, UTF-8, validate after write |
| Rate limits | Too many requests | Exponential backoff, batch, cache results |
| Leads not converting | Wrong ICP, weak value prop | Review ICP, test messaging, focus hot signals |

# **APPENDIX C: MONTHLY COST CALCULATOR**

| Expense | Starter (500/mo) | Growth (2K/mo) | Scale (10K/mo) |
| :---- | :---- | :---- | :---- |
| Outreach Domain | $1/mo | $1/mo | $3/mo (3 domains) |
| Google Workspace | $6/mo (1 acct) | $24/mo (4 accts) | $72/mo (12 accts) |
| Instantly.ai | $37/mo | $97/mo | $358/mo |
| Hunter.io | $0 (Free) | $49/mo | $149/mo |
| DeBounce | $3/mo | $10/mo | $25/mo |
| OpenClaw VPS | $10-20/mo | $20-40/mo | $40-80/mo |
| AI Models (Haiku/Sonnet) | $50-100/mo | $100-200/mo | $200-400/mo |
| TOTAL | $107-167/mo | $301-421/mo | $847-1,087/mo |
| Cost Per Lead | $0.21-$0.33 | $0.15-$0.21 | $0.08-$0.11 |
| Cost Per Meeting | $7-11 | $5-7 | $3-4 |

**ROI Math:** Average deal \= $3K/mo. Close 2 deals from cold outreach \= $6K/mo revenue from \~$300-400/mo spend. That is a 15-20x ROI.

**NOW GO BUILD IT.**

Every prompt. Every tool. Every step. The only thing left is execution.

Join THE SPRINT for live implementation support.  
@mattganzak  |  ScaleUP Media  |  MattGanzak.com