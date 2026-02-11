# Readiness Check — Appointment Setting Business

**Status:** IN PROGRESS  
**Ziel:** Alle internen Prozesse + Configs validieren BEVOR wir externe Services (Apollo, Hunter, Calendly) abonnieren  
**Created:** 2026-02-11 14:46 GMT+1  
**Owner:** Hektor + Scout

---

## Warum diese Prüfung?

**Problem:** Geld ausgeben während interner Prozess noch hakt = verschwendet Budget + Zeit  
**Lösung:** Alles intern validieren, Bugs fixen, Prozess stabilisieren → DANN externe Services

---

## Prüfpunkte (von Laurenz)

### 1. Dashboard Features für Lead Gen Business

**Frage:** Hat das Dashboard alle nötigen Features um als Grundlage für das AS Business zu dienen?

**Benötigte Features (aus Implementation Plan):**

| Feature | Status | Was fehlt? | Priorität |
|---------|--------|-----------|-----------|
| **AS Clients Page** | ❌ FEHLT | Liste aller Clients, ICP Management, Metrics | HOCH |
| **Lead Pipeline (Kanban)** | ❌ FEHLT | Raw → Enriched → Contacted → Replied → Booked → Completed | HOCH |
| **Outreach Metrics** | ❌ FEHLT | Charts: Emails sent, Reply rate, Booking rate | MITTEL |
| **Weekly Reports** | ❌ FEHLT | Auto-generierte PDFs für Clients | MITTEL |
| **Activity Logging** | ✅ VORHANDEN | Bereits da, aber: Log AS-spezifische Activities? | NIEDRIG |
| **Tasks** | ✅ VORHANDEN | Können für AS-Tasks genutzt werden | OK |
| **Projects** | ✅ VORHANDEN | Können für Clients genutzt werden (Workaround) | OK |

**Fehlende Features:**
1. AS Clients Page (API + UI)
2. Lead Pipeline (Kanban board)
3. Outreach Metrics (Charts)
4. Weekly Reports (PDF export)

**Kann Claude Code bauen?** JA (2-3 Tage)

**Alternative (kurzfristig):**
- Clients in Projects verwalten (Workaround)
- Leads in Tasks tracken (Workaround)
- Metrics manuell in Google Sheets (Workaround)

**Empfehlung:**
- **Option A:** Claude Code baut Features JETZT (2-3 Tage), dann starten
- **Option B:** Starten mit Workarounds (Projects + Tasks), Features parallel bauen

**Entscheidung benötigt:** Option A oder B?

---

### 2. Aufgabensplit Scout/Hektor für AS Business

**Frage:** Ist der Job Split zwischen Hektor und Scout passend für Appointment Setting?

**Aktueller Split (aus Implementation Plan):**

| Phase | Scout | Hektor | Passend? |
|-------|-------|--------|----------|
| Client Onboarding | ❌ | ✅ | ✅ JA |
| Lead Research | ✅ | ❌ | ✅ JA |
| Lead Enrichment | ❌ (pre-enrichment) | ✅ (scoring) | ✅ JA |
| Outreach Drafting | ❌ | ✅ | ✅ JA |
| Outreach Execution | ❌ | ✅ | ✅ JA |
| Meeting Booking | ❌ | ✅ | ✅ JA |
| Reporting | ❌ (data aggregation) | ✅ (insights) | ✅ JA |

**Optimierung vorgeschlagen:**
- Scout macht **Pre-Enrichment** (Basic Company Research während Lead Finding)
- Hektor fokussiert auf **Scoring + Qualification**
- Scout generiert **Weekly Report Draft** (Hektor fügt Insights hinzu)

**Status:** ✅ Split ist passend

**Weitere Optimierungen nötig?**
- ⚠️ Scout könnte **Email Response Monitoring** übernehmen (Inbox Triage)
- ⚠️ Hektor könnte **A/B Test Analyse** automatisieren (welche Templates gewinnen?)

**Test benötigt:** 1-2 Wochen Praxis → dann optimieren

---

### 3. Configs passend für AS Business

**Frage:** Spiegeln eure Configs das AS Business passend wieder?

**Zu prüfen:**

#### 3.1 AGENTS.md

**Aktueller Stand:**
- Model Routing Framework: ✅ Definiert
- Autonomie-Regeln: ✅ Definiert
- Fehlerbehandlung: ✅ Self-Heal Protocol
- Task-Disziplin: ✅ Dashboard-Kanban
- Memory: ✅ Daily Logs + Langzeit

**AS-spezifische Ergänzungen nötig:**
- [ ] Lead Research Workflow (Scout's Prozess)
- [ ] Lead Enrichment Workflow (Hektor's Scoring)
- [ ] Outreach Workflow (Email Templates, Follow-ups)
- [ ] Meeting Booking Workflow (Calendly Integration)
- [ ] Client Onboarding Workflow (ICP Definition)

**Action:** Ergänze AGENTS.md mit AS-Workflows (Referenz: `/docs/appointment-setting-implementation.md`)

---

#### 3.2 HEARTBEAT.md

**Aktueller Stand (Hektor):**
```
1. Dashboard Check (dashboard briefing)
2. Decision Tree:
   - IF blockers > 0: Self-Heal
   - ELSE IF tasks in-progress: Continue
   - ELSE IF backlog high-priority: Pull task
   - ELSE: Check Scout, NO_REPLY if quiet
3. Response: Brief summary or HEARTBEAT_OK
```

**AS-spezifisch ergänzen:**
- [ ] Check: Neue Leads von Scout? → Enrichment starten
- [ ] Check: Outreach Responses? → Reply to positives, book meetings
- [ ] Check: No-shows gestern? → Replace meetings
- [ ] Check: Weekly Report fällig? → Generate + send

**Scout's HEARTBEAT.md:**
- Existiert in `/Users/laurenz/.openclaw/workspace-scout/HEARTBEAT.md`?
- Prüfen: Ist es AS-spezifisch?

**Action:** Ergänze HEARTBEAT.md (Hektor + Scout) mit AS-spezifischen Checks

---

#### 3.3 OpenClaw Gateway Config

**Aktueller Stand:** `openclaw.json`

**AS-spezifische Configs nötig:**
- [ ] SMTP Config (für Email Sending)
- [ ] Webhook Endpoints (für Calendly Integration)
- [ ] API Keys (Apollo, Hunter) in `.env`
- [ ] Message Templates (Outreach Emails) in `memory/templates/`

**Prüfung:**
```bash
# Check: Ist SMTP konfiguriert?
openclaw config get messaging.smtp

# Check: Sind Webhook Endpoints enabled?
openclaw config get webhooks.enabled

# Check: Sind API Keys gesetzt?
echo $APOLLO_API_KEY
echo $HUNTER_API_KEY
```

**Action:** Config-Ergänzungen vornehmen (nach Laurenz OK)

---

#### 3.4 TOOLS.md

**Aktueller Stand:**
- Telegram Topic IDs: ✅ Updated (lead-gen = 795)
- Model Routing: ✅ Referenziert
- Dashboard API: ✅ Dokumentiert

**AS-spezifisch ergänzen:**
- [ ] Apollo API Usage (Rate Limits, Queries)
- [ ] Hunter API Usage (Rate Limits)
- [ ] Calendly Webhook Format
- [ ] Email Templates Location

**Action:** Ergänze TOOLS.md mit AS-spezifischen Tool-Infos

---

### 4. HEARTBEAT.md autonom + Ollama-konform

**Frage:** Sind Heartbeats so konfiguriert, dass AS Business autonom läuft?

**Ollama Heartbeat Check (Hektor):**
- Model: `ollama/llama3.2:3b`
- Cadence: 30min
- Tools: `session_status`, `sessions_send` (minimal)

**Prüfung:**
- ✅ Hektor Heartbeat funktioniert (Ollama)
- ❓ Scout Heartbeat konfiguriert? (für AS)

**AS-spezifische Heartbeat-Logic:**

**Hektor (alle 30min):**
1. Check Dashboard: Neue Leads von Scout?
   - JA → Starte Enrichment (Haiku/Sonnet je nach Complexity)
   - NEIN → NO_REPLY
2. Check Inbox: Neue Responses?
   - JA → Kategorisiere (Positive → Book Meeting)
   - NEIN → NO_REPLY
3. Check Calendar: No-shows gestern?
   - JA → Replace Meetings
   - NEIN → NO_REPLY
4. Check: Weekly Report fällig?
   - JA → Generate Report (Sonnet)
   - NEIN → NO_REPLY

**Scout (alle 60min):**
1. Check Dashboard: Client braucht neue Leads?
   - JA → Query Apollo, Recherchiere, Poste Findings
   - NEIN → NO_REPLY

**Problem:** Ollama (3b) kann komplexe Entscheidungen NICHT treffen (zu schwach)

**Lösung:**
- Ollama Heartbeat = **Status Check only** ("Alles OK? Blockers?")
- Wenn Action nötig → Eskalation zu Haiku/Sonnet
- Oder: Heartbeat mit Haiku (nicht Ollama) für AS Business

**Entscheidung benötigt:** Ollama Heartbeat beibehalten (nur Status) oder wechseln zu Haiku (mit Action Logic)?

---

### 5. Model Routing für AS Business

**Frage:** Ist das Model Routing Decision Framework passend für AS-Aufgaben?

**Aktuelles Framework (4-Stufen):**
- Stufe 1: Irreversibel/Rechtlich? → Opus (5%)
- Stufe 2-4: Complex/High-Cost/Creative? → Haiku (85%) oder Sonnet (10%)

**AS-Aufgaben einordnen:**

| Aufgabe | Model | Rationale |
|---------|-------|-----------|
| **Lead Research (Scout)** | Haiku | Strukturiert, API Queries, kein Reasoning nötig |
| **Lead Enrichment (Hektor)** | Haiku → Sonnet | Haiku für Basic Research, Sonnet für Scoring wenn mehrdeutig |
| **Outreach Drafting (Hektor)** | Sonnet | Kreativ, Messaging, Customer-facing → High Cost of Failure |
| **Outreach Execution** | Haiku | Strukturiert, Sending + Tracking |
| **Meeting Booking** | Haiku | Strukturiert, Calendly Integration |
| **Response Handling** | Haiku → Sonnet | Haiku für Positive (Book Meeting), Sonnet für Questions/Objections |
| **Weekly Report** | Sonnet | Client-facing, Strategic Insights, Präsentation |
| **A/B Test Analyse** | Sonnet | Analyse, Optimierung, Business Impact |
| **Client Onboarding** | Sonnet | Strategy, ICP Definition, Customer-facing |

**Verteilung:**
- Haiku: 70% (Lead Research, Enrichment Basic, Execution, Booking)
- Sonnet: 30% (Outreach Drafting, Reports, Client Onboarding, Analyse)
- Opus: 0% (keine irreversiblen Entscheidungen im AS Workflow)

**Status:** ✅ Framework passt, aber Sonnet-Nutzung wird höher sein als 10% (eher 30%)

**Budget-Implikation:**
- Ursprünglich: €105-€165/Mo (bei 10% Sonnet)
- AS Business: €150-€250/Mo (bei 30% Sonnet)
- Immer noch vertretbar (99% Profit Margin)

**Action:** Budget-Erwartung adjustieren (30% Sonnet statt 10%)

---

## Zusätzliche Prüfpunkte (von Hektor)

### 6. Memory & Logging Struktur

**Frage:** Ist Memory-Struktur passend für AS Business?

**Aktuell:**
- `memory/YYYY-MM-DD.md` — Daily Logs
- `MEMORY.md` — Langzeit-Memory
- `memory/trusted/`, `memory/untrusted/`, `memory/conflicts/` — Externe Inhalte

**AS-spezifisch benötigt:**
- `memory/lead-gen/` — Lead Database
  - `raw-leads-[client]-[date].jsonl` — Scout's Findings
  - `enriched-leads-[client]-[date].jsonl` — Hektor's Qualified Leads
  - `outreach-log-[client]-[date].jsonl` — Sent Emails + Responses
  - `meetings-[client]-[date].jsonl` — Booked Meetings + Outcomes
- `memory/clients/` — Client Data
  - `[client-name]/` — Folder per Client
    - `icp.json` — Target ICP
    - `smtp.json` — Email Config (if using client domain)
    - `metrics.json` — Weekly Metrics
- `memory/templates/` — Email Templates
  - `outreach-template-a.md`
  - `outreach-template-b.md`
  - `outreach-template-c.md`
  - `follow-up-day3.md`
  - `follow-up-day7.md`
  - `follow-up-day14.md`

**Action:** Erstelle Memory-Struktur (Ordner + README)

---

### 7. Error Handling & Fallbacks

**Frage:** Haben wir robuste Fehlerbehandlung für AS Workflow?

**Kritische Failure Points:**

| Failure | Impact | Fallback | Implementiert? |
|---------|--------|----------|----------------|
| **Apollo API down** | Keine neuen Leads | Fallback: LinkedIn manual scraping, Brave Search | ❌ FEHLT |
| **Hunter API down** | Keine Email Verification | Fallback: Basic regex check, send anyway (with disclaimer) | ❌ FEHLT |
| **Calendly down** | Keine Meetings bookbar | Fallback: Manual booking link in email | ❌ FEHLT |
| **Email sending fails** | Keine Outreach | Fallback: Retry 3x, dann alert to #alerts | ❌ FEHLT |
| **Inbox monitoring fails** | Keine Responses gelesen | Fallback: Manual check, alert after 24h | ❌ FEHLT |
| **Dashboard down** | Keine Metrics tracking | Fallback: Log to memory/lead-gen/, manual aggregation later | ✅ VORHANDEN (Memory) |

**Action:** Implementiere Fallbacks für kritische APIs (Apollo, Hunter, Calendly)

---

### 8. Testing Infrastructure

**Frage:** Können wir AS Workflow testen OHNE echte Clients/APIs?

**Benötigt:**

1. **Mock Data**
   - 50 Test-Leads (fake Namen, Emails, Companies)
   - Für Testing: Lead Research → Enrichment → Outreach → Booking

2. **Sandbox Modus**
   - Flag: `AS_SANDBOX_MODE=true`
   - Apollo Query → Returns Mock Data (nicht echte API)
   - Hunter Verify → Returns Random Scores (nicht echte API)
   - Email Sending → Logs to file (nicht echte Emails)
   - Calendly Webhook → Simulate Booking (nicht echte Meetings)

3. **Test Clients**
   - 3 Fake Clients (Client A, B, C)
   - Unterschiedliche ICPs (SaaS, FinTech, B2B Services)
   - Test: Can Scout/Hektor handle 3 parallel clients without cross-contamination?

**Status:** ❌ Sandbox Mode NICHT implementiert

**Action:** Erstelle Sandbox Mode + Mock Data (für Testing ohne echte APIs)

---

### 9. Documentation Completeness

**Frage:** Haben wir alle nötigen Docs für AS Business?

**Vorhandene Docs:**
- ✅ `/docs/appointment-setting-dach-scenarios.md` (21KB) — Business Szenarien
- ✅ `/docs/appointment-setting-implementation.md` (34KB) — Implementation Plan
- ✅ `/docs/lead-gen-workflow.md` (12KB) — Original (obsolet, aber Referenz)
- ✅ `/docs/lead-gen-business-scenarios.md` (13KB) — Original (obsolet)

**Fehlende Docs:**
- [ ] **AS Playbook** — Step-by-Step für jeden Workflow-Schritt (Scout + Hektor)
- [ ] **Email Templates Collection** — Alle Templates mit Variationen
- [ ] **Client Onboarding Guide** — Was Laurenz bei Sales Call fragen muss
- [ ] **Quality Standards** — Was ist "qualified lead"? (Score-Kriterien)
- [ ] **Troubleshooting Guide** — Häufige Fehler + Lösungen

**Action:** Erstelle fehlende Docs (AS Playbook = Priority)

---

### 10. Cost & Budget Tracking

**Frage:** Können wir AS Business Kosten tracken?

**Kosten-Komponenten:**
- Apollo API: €49/Mo (1K leads)
- Hunter API: €49/Mo (1K verifications)
- Calendly: €8/Mo
- OpenClaw Tokens: ~€50-€150/Mo (je nach Sonnet-Usage)
- **Total:** €156-€256/Mo

**Revenue (konservativ, 3 Clients nach 3 Monaten):**
- 3 Clients × €2.800/Mo = €8.400/Mo

**Profit:** €8.400 - €256 = €8.144/Mo = **97% Margin**

**Tracking benötigt:**
- Dashboard: Cost per Client (API Calls + Tokens)
- Dashboard: Revenue per Client (MRR)
- Dashboard: Profit per Client

**Status:** ❌ Cost Tracking NICHT im Dashboard

**Action:** Ergänze Cost Tracking im Dashboard (oder manuell in Google Sheets)

---

### 11. Security & DSGVO Compliance

**Frage:** Sind wir DSGVO-compliant für AS Business?

**DSGVO-Anforderungen:**
1. **Datenminimierung:** Nur speichern was nötig (Name, Email, Company, Title, LinkedIn)
2. **Opt-Out:** Sofort entfernen wenn Lead "Remove me" sagt
3. **Zweckbindung:** Lead-Daten nur für AS nutzen (nicht weiterverkaufen)
4. **Transparenz:** Datenschutzerklärung auf Website (wenn wir eine haben)
5. **Sicherheit:** Lead-Daten verschlüsselt speichern (oder zumindest passwort-geschützt)

**Aktueller Stand:**
- ✅ Datenminimierung: Wir speichern nur nötiges (keine Tracking-Cookies)
- ✅ Opt-Out: Können manuell entfernen (aber: automatisiert?)
- ✅ Zweckbindung: Nur AS (keine anderen Zwecke)
- ❌ Datenschutzerklärung: Keine Website yet
- ⚠️ Sicherheit: Leads in `.jsonl` Files (nicht verschlüsselt, aber nur lokal)

**Action:** 
1. Opt-Out automatisieren (Hektor entfernt Lead sofort bei "Remove me")
2. Datenschutzerklärung schreiben (für Website/Email Footer später)
3. Lead-Daten verschlüsseln (optional, aber best practice)

---

### 12. Client Communication Templates

**Frage:** Haben wir alle Templates für Client Communication?

**Benötigt:**

1. **Onboarding Email** (nach Sales Call)
   ```
   Subject: Willkommen bei [Unser Service] — Nächste Schritte
   
   Hi [Client Name],
   
   Freut mich, dass du dabei bist!
   
   Nächste Schritte:
   1. Fülle dieses Formular aus: [Link] (ICP Definition)
   2. Integriere Calendly: [Anleitung]
   3. Optional: Email Domain Setup (für bessere Deliverability)
   
   Wir starten nächste Woche mit deinen ersten Leads.
   
   Fragen? Schreib mir einfach.
   
   Laurenz
   ```

2. **Weekly Report Email** (jeden Freitag)
   ```
   Subject: Deine AS Report — Woche vom [Date]
   
   Hi [Client Name],
   
   Hier deine wöchentliche Zusammenfassung:
   
   📊 Zahlen:
   - Leads kontaktiert: 50
   - Responses: 12 (24%)
   - Meetings gebucht: 4
   - Meetings completed: 3 (1 No-Show, ersetzt)
   - SQL Conversion: 2/3 (67%)
   
   🚀 Top Performer:
   Template B (Social Proof) hatte beste Reply Rate (20%)
   
   📅 Nächste Woche:
   - 50 neue Leads kontaktieren
   - Ziel: 5 Meetings buchen
   
   Fragen? Let me know.
   
   Best,
   Hektor
   ```

3. **Meeting Prep Email** (vor jedem Meeting)
   - Siehe Implementation Plan (bereits dokumentiert)

4. **No-Show Follow-Up** (nach verpasstem Meeting)
   ```
   Hi [Client Name],
   
   [Lead Name] hat gestern nicht teilgenommen.
   
   Ich habe bereits Ersatz gebucht: [New Lead Name] am [Date/Time].
   
   Prep Materials anbei.
   
   Hektor
   ```

**Status:** ⚠️ Templates existieren in Implementation Plan, aber nicht als separate Files

**Action:** Erstelle Templates als separate Files in `memory/templates/client-communication/`

---

## Zusammenfassung & Nächste Schritte

### Kritische Blocker (MUSS vor Services)

1. ❌ **Dashboard AS Features** — Option A (bauen) oder B (Workarounds)?
2. ❌ **AGENTS.md ergänzen** — AS Workflows dokumentieren
3. ❌ **HEARTBEAT.md ergänzen** — AS-spezifische Checks (Hektor + Scout)
4. ❌ **Sandbox Mode** — Testing ohne echte APIs
5. ❌ **Error Handling** — Fallbacks für Apollo/Hunter/Calendly
6. ❌ **Memory Struktur** — `memory/lead-gen/`, `memory/clients/`, `memory/templates/`

### Wichtig (sollte vor Services)

7. ⚠️ **Ollama Heartbeat Decision** — Beibehalten (nur Status) oder wechseln zu Haiku?
8. ⚠️ **AS Playbook** — Step-by-Step Workflow-Docs
9. ⚠️ **Client Communication Templates** — Separate Files
10. ⚠️ **DSGVO Opt-Out** — Automatisieren

### Nice-to-Have (kann parallel)

11. 🟢 **Cost Tracking** — Dashboard oder manuell
12. 🟢 **Dokumentation vervollständigen** — Troubleshooting Guide, etc.

---

## Entscheidungen benötigt (von Laurenz)

1. **Dashboard Features:** Option A (bauen, 2-3 Tage) oder Option B (Workarounds)?
2. **Ollama Heartbeat:** Beibehalten (nur Status) oder wechseln zu Haiku (mit Action Logic)?
3. **Testing Strategy:** Sandbox Mode bauen (1-2 Tage) oder direkt mit echten APIs testen?
4. **Reihenfolge:** Was priorisieren? (1-6 kritische Blocker zuerst?)

---

## Geschätzter Zeitaufwand

**Wenn ALLE Blocker (1-6) behoben:**
- Dashboard Features (Option A): 2-3 Tage (Claude Code)
- AGENTS.md + HEARTBEAT.md: 1-2 Stunden (Hektor)
- Sandbox Mode: 1-2 Tage (Hektor + Scout)
- Error Handling: 3-4 Stunden (Hektor)
- Memory Struktur: 30 Minuten (Hektor)

**Total:** 3-5 Tage (wenn parallel gearbeitet wird)

**Alternative (Fast Track mit Workarounds):**
- Dashboard Workarounds (Projects + Tasks): 30 Minuten
- AGENTS.md + HEARTBEAT.md: 1-2 Stunden
- Kein Sandbox (direkt mit echten APIs testen): 0 Tage
- Basic Error Handling (Retry only): 1 Stunde
- Memory Struktur: 30 Minuten

**Total Fast Track:** 3-4 Stunden (noch heute machbar)

---

## Empfehlung (Hektor)

**Fast Track Approach:**

**HEUTE (noch 2-3 Stunden):**
1. ✅ AGENTS.md ergänzen (AS Workflows)
2. ✅ HEARTBEAT.md ergänzen (AS Checks)
3. ✅ Memory Struktur erstellen
4. ✅ Basic Error Handling (Retry Logic)
5. ✅ Dashboard Workarounds (Projects für Clients, Tasks für Leads)

**MORGEN (2-3 Stunden):**
6. ✅ AS Playbook schreiben
7. ✅ Client Communication Templates
8. ✅ Test mit Mock Data (10 Fake Leads end-to-end)

**ÜBERMORGEN:**
9. ✅ Services abonnieren (Apollo, Hunter, Calendly)
10. ✅ Erster echter Test (10 echte DACH SaaS Leads)

**Dann:** Week 1 Plan starten (wie dokumentiert)

---

**Was sagst du? Fast Track oder Full Build?**

---

## 13. OpenClaw-Potenziale ausschöpfen

**Frage:** Welche OpenClaw-Features nutzen wir NICHT, die für AS Business relevant wären?

**Recherche:** OpenClaw Docs durchsucht (lobster, llm-task, subagents, exec-approvals, browser, plugins)

### 13.1 Lobster Workflows (SEHR RELEVANT)

**Was ist Lobster?**
- Deterministische Multi-Step Workflows mit Approval Gates
- One Tool Call statt viele (spart Tokens + LLM Orchestration)
- Resumable State (pause/resume ohne alles neu zu machen)
- Typed pipeline runtime für OpenClaw

**Wie hilft das AS Business?**

**Use Case 1: Lead Research → Enrichment → Outreach (End-to-End Pipeline)**

**Ohne Lobster (aktuell):**
```
Scout: Apollo query → posts to #lead-gen → Hektor reads
Hektor: Enrichment → scores → posts results
Hektor: Draft emails → posts drafts
Laurenz: Reviews emails → approves
Hektor: Sends emails → tracks responses
```
→ 5+ separate tool calls, LLM orchestriert jeden Schritt, keine Pause-Funktion

**Mit Lobster:**
```lobster
name: lead-pipeline
args:
  client:
    default: "Client-A"
steps:
  - id: research
    command: scout-research --client $client --limit 20 --json
  - id: enrich
    command: hektor-enrich --stdin json
    stdin: $research.stdout
  - id: draft
    command: hektor-draft-outreach --stdin json
    stdin: $enrich.stdout
  - id: approve
    command: approve --preview-from-stdin --limit 5 --prompt 'Send these emails?'
    stdin: $draft.stdout
    approval: required
  - id: send
    command: hektor-send-emails --stdin json
    stdin: $draft.stdout
    condition: $approve.approved
```

→ **1 Tool Call** (`lobster run lead-pipeline.lobster --args-json '{"client":"Client-A"}'`)
→ Pausiert bei Approval → Laurenz approves → resumes
→ Spart 50-70% Tokens (LLM muss nicht orchestrieren)

**Use Case 2: Weekly Report Generation**

**Ohne Lobster:**
```
Hektor: Query dashboard metrics → formats data → generates insights → posts to #lead-gen
Laurenz: Reviews report → approves
Hektor: Sends to client
```

**Mit Lobster:**
```lobster
name: weekly-report
args:
  client:
    default: "Client-A"
steps:
  - id: metrics
    command: dashboard-metrics --client $client --week current --json
  - id: insights
    command: llm-task --prompt 'Analyze metrics and generate insights' --input-from-stdin
    stdin: $metrics.stdout
  - id: draft
    command: report-template --stdin json
    stdin: $insights.stdout
  - id: approve
    command: approve --preview-from-stdin --prompt 'Send to client?'
    stdin: $draft.stdout
    approval: required
  - id: send
    command: hektor-send-report --client $client --stdin
    stdin: $draft.stdout
    condition: $approve.approved
```

**Vorteile:**
- Deterministic (gleiche Inputs = gleiche Outputs, reproduzierbar)
- Auditierbar (alle Schritte geloggt)
- Resumable (bei Fehler oder Approval pause → später weiter)
- Token-effizient (LLM sieht nur Approval Request, nicht jeden Schritt)

**Status:** ❌ Lobster NICHT installiert, NICHT im Workflow genutzt

**Installation:**
```bash
# Install Lobster CLI
npm install -g lobster
# oder: git clone https://github.com/openclaw/lobster && cd lobster && npm install && npm link

# Enable in OpenClaw config
openclaw config set tools.alsoAllow '["lobster"]'
```

**Aufwand:** 1-2 Stunden (Installation + erste .lobster Files schreiben)

**Empfehlung:** ✅ **SEHR SINNVOLL** — Sobald AS Workflow stabil ist (nach Week 2-3), migrieren zu Lobster

---

### 13.2 LLM-Task Plugin (ERGÄNZEND ZU LOBSTER)

**Was ist llm-task?**
- JSON-only LLM Steps für Workflows
- Schema-validierte LLM-Outputs (keine freie Text-Antworten)
- Ideal für Lobster-Pipelines

**Wie hilft das AS Business?**

**Use Case: Lead Enrichment mit LLM**

**Aktuell (Hektor macht das manuell):**
- Brave Search nach Company → Hektor liest Text → extrahiert Pain Points

**Mit llm-task (in Lobster Pipeline):**
```lobster
- id: company-research
  command: brave-search --query '$company_name funding news' --json
- id: extract-pain-points
  command: llm-task --prompt 'Extract pain points from company research' --input-from-stdin --schema '{
    "type": "object",
    "properties": {
      "pain_points": { "type": "array", "items": { "type": "string" } },
      "recent_news": { "type": "string" },
      "funding_stage": { "type": "string" }
    }
  }'
  stdin: $company-research.stdout
```

**Vorteile:**
- Strukturierter Output (JSON, kein freier Text)
- Schema-validiert (sicherstellt, dass pain_points ein Array ist)
- Wiederholbar (gleiche Inputs = gleiche Struktur)

**Status:** ❌ llm-task Plugin NICHT enabled

**Installation:**
```json
{
  "plugins": {
    "entries": {
      "llm-task": { "enabled": true }
    }
  },
  "agents": {
    "list": [
      {
        "id": "hektor",
        "tools": { "alsoAllow": ["llm-task"] }
      }
    ]
  }
}
```

**Aufwand:** 15 Minuten (Config ändern + testen)

**Empfehlung:** ⚠️ **OPTIONAL** — Erst wenn Lobster läuft, dann ergänzen

---

### 13.3 Sub-Agent Optimierungen (SCHON GENUTZT, ABER MEHR POTENZIAL)

**Was wir schon nutzen:**
- `sessions_spawn` für isolierte Tasks (z.B. Skill Installation)

**Was wir NICHT nutzen (aber könnten):**

**A) Sub-Agent Model Override**
```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5",
        "thinking": "off"
      }
    }
  }
}
```

**Warum sinnvoll für AS?**
- Sub-Agent Tasks (Lead Research, Enrichment) sind oft strukturiert → Haiku reicht
- Main Agent (Hektor) bleibt flexibel (Sonnet für Strategy)
- **Spart 50-80% Tokens** bei Sub-Agent Tasks

**B) Max Concurrent Sub-Agents**
```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxConcurrent": 3
      }
    }
  }
}
```

**Warum sinnvoll?**
- Scout kann 3 Clients parallel researchen (Client A, B, C gleichzeitig)
- Hektor kann 3 Enrichments parallel machen
- Schnellere Execution (aber: mehr RAM/Token-Usage)

**Status:** ⚠️ Nutzen Sub-Agents, aber OHNE Optimierungen

**Aufwand:** 5 Minuten (Config ändern)

**Empfehlung:** ✅ **JETZT MACHEN** — Sub-Agent Model Override spart sofort Tokens

---

### 13.4 Browser Tool (WENIG RELEVANT, ABER ERWÄHNENSWERT)

**Was ist browser?**
- Eingebaute Browser-Automation (Playwright-basiert)
- Snapshots (Accessibility Tree), Screenshots, PDFs
- Element Selection via refs

**Wie könnte das AS helfen?**

**Use Case: LinkedIn Lead Research (Fallback wenn Apollo down)**
```json
{
  "action": "open",
  "targetUrl": "https://linkedin.com/search/results/people/?keywords=VP%20Sales%20SaaS%20DACH"
}
```
→ Snapshot → Parse results → Extract Names/Titles/Companies

**Problem:**
- LinkedIn blockiert Scraping (Captcha, Rate Limits)
- Langsamer als Apollo API
- Compliance-Risiko (LinkedIn ToS)

**Status:** ❌ Browser Tool NICHT für AS genutzt

**Empfehlung:** ❌ **NICHT PRIORISIEREN** — Apollo + Hunter reichen, Browser nur als letzter Fallback

---

### 13.5 Custom Plugins (ADVANCED, SPÄTER)

**Was ist plugin system?**
- Eigene Tools als Plugins bauen (Node.js/TypeScript)
- Registrieren in OpenClaw (`tools.plugin`)

**Wie könnte das helfen?**

**Use Case: Apollo/Hunter als Custom Plugin**
- Wrapper um Apollo/Hunter APIs (statt Shell-Scripts)
- Typsicher, bessere Error Handling
- Caching (gleiche Query mehrfach → cached Result)

**Beispiel:**
```typescript
// plugins/apollo-plugin.ts
export async function searchLeads(query: string, limit: number): Promise<Lead[]> {
  const response = await fetch(`https://api.apollo.io/v1/people/search`, {
    headers: { Authorization: `Bearer ${process.env.APOLLO_API_KEY}` },
    body: JSON.stringify({ q: query, per_page: limit })
  });
  return response.json();
}
```

**Status:** ❌ Keine Custom Plugins gebaut

**Aufwand:** 1-2 Tage (Plugin Architektur lernen + bauen)

**Empfehlung:** ❌ **NICHT JETZT** — Erst wenn AS Business läuft (Month 3+)

---

### 13.6 Exec Approvals (SICHERHEIT, WENIGER AS-RELEVANT)

**Was ist exec approvals?**
- Allowlists für `exec` Commands (Sandbox-Escape Schutz)
- User muss explizit erlauben (ähnlich wie Lobster approvals)

**Für AS Business relevant?**
- Nein, wir führen keine kritischen System-Commands aus
- Scout/Hektor nutzen APIs (Apollo, Hunter), nicht Shell-Commands

**Empfehlung:** ❌ **NICHT RELEVANT** für AS Business

---

## Zusammenfassung: OpenClaw-Potenziale

| Feature | Relevanz für AS | Aufwand | Empfehlung | Wann? |
|---------|----------------|---------|------------|-------|
| **Lobster Workflows** | ⭐⭐⭐⭐⭐ | 1-2 Std | **SEHR SINNVOLL** | Week 2-3 (nach Workflow stabilisiert) |
| **LLM-Task Plugin** | ⭐⭐⭐ | 15 Min | OPTIONAL | Nach Lobster |
| **Sub-Agent Model Override** | ⭐⭐⭐⭐ | 5 Min | **JETZT** | Sofort (spart Tokens) |
| **Sub-Agent Concurrency** | ⭐⭐ | 5 Min | OPTIONAL | Bei 3+ Clients parallel |
| **Browser Tool** | ⭐ | N/A | NICHT | Nur Fallback |
| **Custom Plugins** | ⭐⭐ | 1-2 Tage | NICHT | Month 3+ |
| **Exec Approvals** | ⭐ | N/A | NICHT | Nicht relevant |

---

## Konkrete Actions (OpenClaw-Potenziale)

**JETZT (sofort, 5 Min):**
1. ✅ Sub-Agent Model Override aktivieren (Haiku für Sub-Agents)
   ```bash
   openclaw config set agents.defaults.subagents.model "anthropic/claude-haiku-4-5"
   openclaw config set agents.defaults.subagents.thinking "off"
   openclaw gateway restart
   ```

**WEEK 2-3 (nach AS Workflow läuft):**
2. ⚠️ Lobster installieren + erste .lobster Files schreiben
   - `lead-pipeline.lobster` (Research → Enrichment → Outreach → Approval → Send)
   - `weekly-report.lobster` (Metrics → Insights → Draft → Approval → Send)
   - Test: 1 Client end-to-end mit Lobster

3. ⚠️ llm-task Plugin aktivieren (für strukturierte Enrichment-Steps)

**SPÄTER (Month 3+):**
4. 🟢 Custom Plugins (Apollo/Hunter Wrapper) wenn nötig
5. 🟢 Sub-Agent Concurrency erhöhen (wenn 5+ Clients parallel)

---

## Budget-Implikation (Sub-Agent Model Override)

**Aktuell (kein Override):**
- Sub-Agent nutzt Main Model (Sonnet)
- Beispiel: Skill Installation Task = 4K Tokens × Sonnet = €0.06

**Mit Override (Haiku):**
- Sub-Agent nutzt Haiku
- Gleiche Task = 4K Tokens × Haiku = €0.002
- **Ersparnis: 97%** (€0.058/Task)

**Bei 20 Sub-Agent Tasks/Monat:**
- Vorher: €1.20/Mo
- Nachher: €0.04/Mo
- **Ersparnis: €1.16/Mo** (klein, aber adds up)

---

**Was sagst du? Fast Track oder Full Build?**
