# DAS KOMPLETTE OPENCLAW COLD OUTREACH PLAYBOOK

**Von Signal Detection bis zum Abschluss**
End-to-End Agent Prompts, Service-Übersicht & Dashboard Setup

Von Matt Ganzak | ScaleUP Media | THE SPRINT Training Series
Live Training #1 | Februar 2026

---

> **[LIVESTREAM INSIGHT — ÜBERBLICK]**
> - Matt nutzt **1 Agent mit Cron-basiertem Scheduling** — jede Stunde ist einem Task zugewiesen (Research, Outreach, Inbox etc.)
> - Alles läuft auf **einem System** (Mac Mini, ~$1.000)
> - War vorher bei **2 Mio Cold Emails/Monat über Instantly**, jetzt ~50.000 mit OpenClaw, Ziel: 2 Mio/Monat
> - Matt verdient **$100K/Monat Consulting** — Target: Distressed Businesses, Non-Technical Founders, 200-500 Mitarbeiter, Layoffs
> - Baut aktuell ein **Social Agent SaaS** (LinkedIn-fokussiert) mit Electron + eigenem Model
> - Nutzt **Haiku als Default-Model**, eskaliert zu Sonnet, dann Opus wenn nötig

---

> **⚖️ DACH-COMPLIANCE (Minimalprinzip)**
>
> Dieser Guide operiert als **persönliche Geschäftsanbahnung** — keine Massenwerbung. Damit gelten nur 3 Pflichten:
>
> 1. **Impressum in der Signatur** — Firma, Name, Adresse, Rechtsform, HRB-Nummer. Nicht verhandelbar (§5 DDG).
> 2. **Sofort löschen bei "nein"** — Wer ablehnt oder nicht antwortet nach Sequenz-Ende → DNC-Liste, nie wieder kontaktieren.
> 3. **Relevanz + niedriges Volumen** — Max 20-50 Emails/Tag. Jede Email muss individuell zum Empfänger passen. Massen-Blast = Werbung = §7 UWG Verstoß.
>
> **Kein Opt-Out-Link nötig.** Kein Abmelde-Button. Keine Datenschutzerklärung. Das wäre bei einer persönlichen 1:1 Email kontraproduktiv.
>
> **Risiko bei Verstoß:** Abmahnung €500-2.000. DSGVO-Bußgeld theoretisch möglich, praktisch bei kleinem B2B-Volumen irrelevant.

---

# INHALTSVERZEICHNIS

- Phase 1: Signal Detection — Opportunities finden
- Phase 2: Data Scraping — Multi-Agent Setup
- Phase 3: Decision Makers finden — Email Discovery
- Phase 4: Email Validation — Liste säubern
- Phase 5: Domain Setup — Kauf & Konfiguration
- Phase 6: Cold Email Infrastruktur — Instantly.ai & Alternativen
- Phase 7: Personalisierte Cold Emails schreiben
- Phase 8: Datenmanagement — CSV & Google Sheets
- Phase 9: Performance Dashboard
- Appendix A: Komplette Prompt-Bibliothek
- Appendix B: Troubleshooting Guide
- Appendix C: Kosten-Kalkulator
- **Appendix D: Livestream Q&A Highlights**

---

# PHASE 1: SIGNAL DETECTION

*Opportunities finden, die deine Konkurrenz übersieht*

## Was sind Signals?

Signals sind Echtzeit-Indikatoren, dass ein Unternehmen ein konkretes Problem hat, das dein Produkt oder Service lösen kann. Statt wahllos Cold Emails zu verschicken, nutzt du deinen OpenClaw Agent, um das Internet kontinuierlich nach diesen Buying Signals zu scannen — du kontaktierst nur Unternehmen, die gerade aktiv das Problem haben, das du löst.

## Signal-Typen zum Monitoren

| Signal-Typ | Wonach suchen | Praxisbeispiel |
|:---|:---|:---|
| Hiring Signals | Stellenanzeigen für Rollen, die mit deiner Lösung zusammenhängen | Restaurant sucht 'Operations Manager' = Wachstum = YesChefOS Opportunity |
| Tech Stack Changes | Unternehmen wechseln oder kündigen Tools | Firma schmeißt HubSpot = braucht neues CRM = deine SaaS Opportunity |
| Funding Signals | Aktuelle Series A/B/C Runden | Startup raised $5M = hat Budget, muss schnell skalieren |
| Pain Point Signals | Negative Bewertungen, Beschwerden | Schlechte Yelp-Reviews über Wartezeiten = YesChefOS Opportunity |
| Growth Signals | Neue Standorte, Expansion, Presse | Kette eröffnet 3 neue Standorte = braucht operative Software |
| Compliance Signals | Regulatorische Änderungen, neue Gesetze | Neues Steuergesetz = TaxSmartAI Opportunity für jede Steuerberatung |
| Content Signals | Blog/Social Posts über Probleme | CEO postet über 'Skalierungsprobleme' = Venture Studio Opportunity |
| Competitor Signals | Competitor Ausfälle oder Preiserhöhungen | Großer Ausfall = sofort deren Kunden abgreifen |

## Signal Detection Agent einrichten

Dein OpenClaw Agent scannt kontinuierlich mehrere Quellen und erstellt einen täglichen Signal Report.

### Schritt 1: Ideal Customer Profile (ICP) definieren

Bevor dein Agent Signals finden kann, muss er genau wissen, wen du suchst.

> **[LIVESTREAM INSIGHT]** ICP als JSON im Project Memory speichern als MD File. Folder Structure: `.openclaw/projects/[project]/tasks/outreach/`

**PROMPT: ICP Definition Agent**

```
Du bist ein ICP-Analyse-Agent. Hilf mir, den perfekten Zielkunden zu definieren.

Produkt: [DEIN PRODUKTNAME]
Beschreibung: [WAS ES MACHT]
Preis: [MONATLICHER PREIS]
Gelöste Pain Points: [LISTE 3-5]

Erstelle ein detailliertes ICP mit:
1. Unternehmensgröße (Mitarbeiterzahl-Range)
2. Branchen-Vertikalen (sei spezifisch)
3. Jahresumsatz-Range
4. Geografische Zielmärkte
5. Technologie, die sie wahrscheinlich nutzen
6. Job Titles der Entscheider
7. Job Titles der Champions/Influencer
8. Häufige Pain Points
9. Trigger Events, die Kaufbereitschaft signalisieren
10. Keywords, die sie verwenden, wenn sie über diese Pain Points sprechen

Formatiere als strukturiertes JSON, damit andere Agents darauf referenzieren können.
```

**Praxisbeispiel: YesChefOS ICP**

```json
{
  "product": "YesChefOS",
  "icp": {
    "company_size": "5-1200 Standorte",
    "industries": ["Restaurants","Fast-Casual","QSR","Ghost Kitchens"],
    "revenue": "$1M-$500M Jahresumsatz",
    "decision_makers": ["CEO","COO","VP Operations","Director of IT"],
    "champions": ["General Manager","Regional Manager","Küchenchef"],
    "buying_triggers": [
      "Neue Standorte eröffnen", "Operations-Rollen ausschreiben",
      "Schlechte Bewertungen über Konsistenz", "POS-System wechseln"
    ]
  }
}
```

### Schritt 2: Signal Scanner Agent

**PROMPT: Signal Scanner Agent**

```
Du bist ein Signal Detection Agent. Scanne das Internet nach Buying Signals,
die zu meinem ICP passen.

## DEIN ICP: [ICP JSON EINFÜGEN]

## QUELLEN ZUM SCANNEN:
1. Jobbörsen: Indeed, LinkedIn Jobs, Glassdoor
2. News: Google News, TechCrunch, lokale Wirtschaftsmedien
3. Bewertungsseiten: Yelp, G2, Capterra, Google Reviews
4. Social: LinkedIn Posts, Twitter/X
5. Behördliche Einträge: Neue Firmengründungen, Genehmigungen

## FÜR JEDES SIGNAL ZURÜCKGEBEN:
- company_name, website, signal_type
- signal_source (URL), signal_description (2-3 Sätze)
- signal_strength (hot|warm|cold)
- estimated_company_size, industry, location
- date_detected, recommended_approach

## OUTPUT: JSON Array sortiert nach signal_strength (hot zuerst).
Nur Signals der letzten 7 Tage. Ziel: 20-50 pro Scan.
```

### Schritt 3: Signal Enrichment Agent

**PROMPT: Signal Enrichment Agent**

```
Du bist ein Signal Enrichment Agent. Reichere jedes Roh-Signal mit Kontext an.

## INPUT: [RAW SIGNAL JSON VOM SCANNER]

## FÜR JEDES SIGNAL ERGÄNZEN:
- company_website, company_linkedin
- estimated_employees, estimated_revenue
- tech_stack_indicators, recent_news
- competitors_they_use, social_proof
- pain_point_evidence (direkte Zitate/Belege)
- urgency_score: 1-10 Bewertung
- personalization_hooks: 3-5 spezifische Punkte für die Ansprache

## SCORING: 8-10=Aktiver Pain, 5-7=Wachstumsmodus, 1-4=Allgemeiner Fit

## OUTPUT: Angereichertes JSON sortiert nach urgency_score absteigend.
```

## Praxis-Beispiele für Signal Detection

**Beispiel 1: YesChefOS — Restaurant-Kette Signal**
Signal: Eine regionale Kette mit 47 Standorten schreibt 3 'Regional Operations Manager'-Stellen aus, und ihr CEO postet auf LinkedIn über 'Herausforderungen bei der Qualitätssicherung beim Wachstum auf 100 Standorte.' Das ist ein 9/10 Urgency Signal.

**Beispiel 2: TaxSmartAI — Compliance Signal**
Signal: Das Finanzamt kündigt neue Krypto-Meldepflichten an. Dein Agent findet 200+ Steuerberatungen, die darüber bloggen, aber keine erwähnt automatisierte Tools. Regulatorische Deadline erzeugt Dringlichkeit + sie haben das Problem, aber keine Lösung.

**Beispiel 3: Social Agent — Competitor Pain Signal**
Signal: Großes Social-Media-Tool hat einen 6-Stunden-Ausfall. 150+ Unternehmen beschweren sich öffentlich auf Twitter/X und sagen 'looking for alternatives.' Innerhalb von 24 Stunden kontaktieren, solange der Schmerz frisch ist.

---

# PHASE 2: DATA SCRAPING MIT MULTI-AGENT SETUP

*Signals in verwertbare Lead-Daten verwandeln*

> **[LIVESTREAM INSIGHT]**
> - Matt nutzt **~12 Haiku Agents gleichzeitig** für die gesamte Pipeline
> - **Brave Search API ist essentiell** (~$4/Monat für ~20 Mio Searches) — hilft gegen CAPTCHAs und Soft Blocks
> - **Lokale CSVs bevorzugt** statt Google Sheets API — weniger Komplexität, weniger Breakpoints
> - CSV pro Task im Projektordner: `projects/[project]/tasks/outreach/leads.csv`
> - Lokale LLMs (Ollama) funktionieren, aber Agents treffen mehr Blocks (CAPTCHAs) als bei API-Models

## Multi-Agent Architektur

Deine Scraping-Operation nutzt einen Coordinator, der an spezialisierte Sub-Agents delegiert. Jeder Agent hat eine Aufgabe.

| Agent | Rolle | Input | Output |
|:---|:---|:---|:---|
| Coordinator | Orchestriert die Pipeline | Signal-Liste | Finales angereichertes CSV |
| Website Scraper | Firmendaten von Websites | Company URLs | Company Data JSON |
| LinkedIn Scraper | Teammitglieder & Titel | Company Names | People Data JSON |
| Review Scraper | Pain Point Daten | Company Names | Review Summaries |
| News Scraper | Aktuelle Erwähnungen | Company Names | News Summaries |
| Data Compiler | Zusammenführung in sauberes CSV | Alle Outputs | Master Lead CSV |

**PROMPT: Coordinator Agent**

```
Du bist der Lead Research Coordinator und managst spezialisierte Sub-Agents.

## WORKFLOW:
1. Angereicherte Signal-Liste aus Phase 1 empfangen
2. Für jedes Signal an Sub-Agents delegieren:
   a. Company URL -> Website Scraper
   b. Company Name -> LinkedIn Research Agent
   c. Company Name -> Review Scraper
   d. Company Name -> News Scraper
3. Alle Ergebnisse sammeln
4. An Data Compiler Agent übergeben
5. Quality Check des finalen Outputs

## REGELN: In 10er-Batches verarbeiten. Fehler einmal wiederholen.
Priorisierung: hot > warm > cold Signals.
Tracking: {signal_id, status, agents_completed, data_completeness_score}
```

**PROMPT: Website Scraper Agent**

```
Du bist ein Website Research Agent. Extrahiere bei gegebener Company URL:
- company_name, tagline, industry, products_services
- locations (Anzahl und wo), leadership_team (Namen + Titel)
- contact_info, tech_indicators, blog_topics (letzte 5 Posts)
- careers_page (offene Stellen), social_links
- company_size_indicators, pain_point_clues

OUTPUT: Strukturiertes JSON. Wenn ein Feld nicht gefunden wird, setze null.
Niemals Daten erfinden.
```

**PROMPT: LinkedIn Research Agent**

```
Du bist ein LinkedIn Research Agent und nutzt öffentlich verfügbare Daten.
Nutze Google: '[company] site:linkedin.com/in' und '[company] [title] site:linkedin.com/in'

## FINDE DIE ENTSCHEIDUNGSHIERARCHIE:
- C-Suite (CEO, COO, CTO, CFO)
- VP Level (VP Ops, VP Engineering, VP Marketing)
- Director Level, Manager Level

## FÜR JEDE PERSON:
- full_name, job_title, linkedin_url
- decision_authority (final_decision|strong_influence|champion|gatekeeper)
- tenure, recent_activity (Personalisierungs-Material)
- email_pattern_guess (wird später validiert)

ZIEL: 3-5 Kontakte pro Unternehmen. Mindestens 1 C-Suite + 1 Manager.
```

**PROMPT: Review Scraper Agent**

```
Du bist ein Review-Analyse-Agent. Finde und analysiere öffentliche Bewertungen.

QUELLEN: Google Reviews, Yelp, G2, Capterra, Glassdoor, BBB

EXTRAHIERE:
- overall_rating, total_reviews
- common_complaints (Top 3-5 Themen)
- specific_pain_quotes: 3-5 direkte Zitate über Probleme,
  die unser Produkt löst (für Cold Emails!)
- competitor_mentions, response_pattern
- recent_negative_trend (plötzlicher Anstieg schlechter Bewertungen)
```

**PROMPT: Data Compiler Agent**

```
Du führst alle Sub-Agent-Daten in saubere Datensätze zusammen.

1. Zu einem Lead-Datensatz pro Firma zusammenführen
2. Konflikte zwischen Quellen auflösen
3. lead_score berechnen (1-100):
   Signal Strength (40%) + Data Completeness (20%)
   + Company Fit zum ICP (20%) + Urgency Indicators (20%)
4. personalization_brief generieren (3-4 Sätze für SDR)
5. Datenqualitätsprobleme flaggen

OUTPUT FORMAT (CSV Spalten):
company_name, website, industry, employee_count, revenue,
location, signal_type, signal_description, signal_strength,
contact_1_name, contact_1_title, contact_1_email_guess,
contact_1_linkedin, [wiederhole für Kontakte 2-3],
review_summary, news_summary, personalization_brief,
lead_score, data_quality_flag
```

---

# PHASE 3: DECISION MAKERS FINDEN

*Email Discovery, Guessing und Enrichment*

> **[LIVESTREAM INSIGHT]**
> - Matt bevorzugt **Guessing (kostenlos)** über bezahlte Services — skaliert besser bei hohem Volumen
> - Kann Guessing auf **Ollama (lokal, kostenlos)** laufen lassen
> - Max **5 Email-Boxen pro Domain** — mehr = Spam-Risiko

## Methode 1: Email Pattern Guessing mit OpenClaw

**PROMPT: Email Pattern Guesser Agent**

```
Du bist ein Email Pattern Detection Agent.

## GÄNGIGE MUSTER (nach Häufigkeit):
1. vorname.nachname@domain.com (~36%)
2. vorname@domain.com (~25%)
3. vornamenachname@domain.com (~15%)
4. vnachname@domain.com (~10%)
5. vorname_nachname@domain.com (~5%)
6. vornamev@domain.com (~4%)
7. v.nachname@domain.com (~3%)

## PROZESS:
1. Company Domain nehmen
2. Nach bekannten Emails suchen (Website, Presse, Stellenanzeigen, GitHub)
3. Wenn gefunden: Muster erkennen und auf alle Kontakte anwenden
4. Wenn nicht gefunden: Top 4 Pattern-Guesses generieren

## OUTPUT: { domain, detected_pattern, confidence,
  evidence, guesses: [{name, title, primary_guess, alternates}] }
```

## Methode 2: Email Finder Services — Preisübersicht

### Hunter.io

| Plan | Monatlich | Jährlich | Credits/Mo | Accounts |
|:---|:---|:---|:---|:---|
| Free | $0 | $0 | 25 Suchen + 50 Verifizierungen | 1 |
| Starter | $49/Mo | $34/Mo ($408/Jahr) | 500 Suchen + 1.000 Verifizierungen | 3 |
| Growth | $149/Mo | $99/Mo ($1.188/Jahr) | 2.500 Suchen + 5.000 Verifizierungen | 10 |
| Business | $349/Mo | $244/Mo ($2.928/Jahr) | 10.000 Suchen + 20.000 Verifizierungen | 20 |
| Enterprise | Custom | Custom | Custom | Unlimited |

**PROMPT: Hunter.io API Integration Agent**

```
Du bist ein Email Finder Agent und nutzt die Hunter.io API.
API Key: [DEIN_HUNTER_API_KEY]
Base URL: https://api.hunter.io/v2

## ENDPOINTS:
Domain Search: GET /domain-search?domain={domain}&api_key={key}
Email Finder: GET /email-finder?domain={d}&first_name={f}&last_name={l}&api_key={key}
Email Verifier: GET /email-verifier?email={email}&api_key={key}

## WORKFLOW:
1. Zuerst Domain Search um alle bekannten Emails zu sehen
2. Prüfen ob Zielkontakte in den Ergebnissen auftauchen
3. Für nicht gefundene Kontakte: Email Finder mit Name + Domain
4. Alle gefundenen Emails verifizieren
5. Verbrauchte Credits für Budget-Tracking loggen

## FEHLER: 429=10s warten und retry. Kein Ergebnis=Fallback auf Guessing.
```

### Alternative Email Finder Services

| Service | Einstiegspreis | Key Feature | Am besten für |
|:---|:---|:---|:---|
| Apollo.io | Free dann $49/Mo | 270M+ Kontakt-Datenbank | Volume Prospecting |
| Snov.io | Free dann $39/Mo | Email Finder + Drip Campaigns | Budget All-in-One |
| Lusha | Free dann $49/Mo | Telefonnummern + Emails | Multi-Channel Outreach |
| RocketReach | $53/Mo (80 Lookups) | Hohe Genauigkeit, verifizierte Daten | Qualität vor Quantität |
| Skrapp.io | Free dann $49/Mo | LinkedIn Email Extraction | LinkedIn Prospecting |
| FullEnrich | $29/Mo | Waterfall (15+ Provider) | Maximale Find Rate, niedrigere Kosten |
| ContactOut | $79/Mo | Chrome Extension + API | Recruiter Workflows |

**Pro Tip: Waterfall Enrichment Strategie**

Erst Hunter.io (höchste Genauigkeit), dann Apollo.io (größte Datenbank), dann Snov.io (Budget Backup). Dein Agent automatisiert diese Kaskade:

**PROMPT: Waterfall Email Finder Agent**

```
Du bist ein Waterfall Email Finder. Probiere mehrere Services nacheinander.

## REIHENFOLGE: (stoppe wenn mit >80% Confidence gefunden)
1. Hunter.io Email Finder (höchste Genauigkeit)
2. Apollo.io Lookup (größte Datenbank)
3. Snov.io Email Finder (gutes Backup)
4. Pattern Guessing (kostenloser Fallback)

## KOSTEN-TRACKING pro Batch:
- Gesamt verarbeitete Kontakte
- Emails pro Service gefunden (mit %)
- Verbrauchte Credits pro Service
- Kosten pro gefundener Email
- Gesamt-Find-Rate
```

---

# PHASE 4: EMAIL VALIDATION

*Liste säubern bevor du eine einzige Email verschickst*

## Warum Validation nicht verhandelbar ist

Wenn du diesen Schritt überspringst, **zerstörst** du deine Sender Reputation. Email Provider tracken Bounce Rates. Über 2-3% Bounces = deine Domain wird geflaggt = ALLE Emails landen im Spam. Jede einzelne Email muss validiert werden.

## Validation Services Preise

| Service | Preis | Genauigkeit | Am besten für |
|:---|:---|:---|:---|
| DeBounce | $10/5K; $15/10K; Mengenrabatte | ~91% | Bestes Preis-Leistung. Pay-as-you-go. API verfügbar. |
| ZeroBounce | $16/2K; $65/10K; $110/25K | ~96% | Höchste Genauigkeit + Spam Trap Detection |
| NeverBounce | $8/1K; $40/5K; $80/10K | ~92% | Schnell (10K in 1 Minute) |
| Bouncer | $50/Mo für 5.000 | ~95% | Real-Time API + Formular-Verifizierung |
| Emailable | $30/5K; $60/10K | ~93% | Gute API, integriert mit den meisten ESPs |
| EmailListVerify | $4/1K; $15/5K; $25/10K | ~89% | Günstigste für große Listen |
| Reoon | $9,90/5K | ~93% | Erschwinglich mit WordPress-Integration |

**Empfehlung:** DeBounce für Bulk (bestes Preis-Leistung) + ZeroBounce für Final Check bei Hot Leads (höchste Genauigkeit).

**PROMPT: Email Validation Agent**

```
Du bist ein Email Validation Agent und nutzt die DeBounce API.
API: https://api.debounce.io/v1/?api={key}&email={email}
Bulk: POST https://api.debounce.io/v1/upload

## ERGEBNISSE KATEGORISIEREN:
- SICHER ZUM SENDEN: result='Safe to Send' oder debounce_code='5'
- RISKANT: result='Role' oder 'Accept-All/Catch-All'
- NICHT SENDEN: result='Invalid' oder 'Disposable' oder 'Spam-Trap'

## WORKFLOW:
1. Master Lead CSV aus Phase 2/3 nehmen
2. Alle Emails extrahieren, Bulk-Verifizierung starten
3. Kategorisieren: SAFE->Outreach Queue, RISKY->Manual Review,
   INVALID->entfernen und loggen
4. Stats reporten: Gesamt, Safe, Risky, Invalid, prognostizierte Bounce Rate

## REGELN: Niemals unvalidiert senden. >30 Tage alte Daten neu validieren.
Accept-All: max 10 Sends/Tag zum Testen. Bounce <2% halten.
```

## Validation Troubleshooting

| Problem | Ursache | Lösung |
|:---|:---|:---|
| Hohe Invalid Rate (>20%) | Schlechte Datenquellen oder veraltete Daten | Besseren Finder nutzen; Datenalter auf 30 Tage reduzieren |
| Viele Accept-All Ergebnisse | Catch-All Server | Erst Test senden; wenn kein Bounce in 24h, vorsichtig hinzufügen |
| API Timeouts | Großer Batch + langsame Verbindung | In 1.000er-Batches aufteilen; Retry mit Backoff |
| Credits gehen zu schnell | Duplikate in der Liste | Vor Validierung deduplizieren; offensichtlich ungültige rausfiltern |

---

# PHASE 5: DOMAIN SETUP FÜR OUTREACH

*Kauf und Konfiguration deiner Cold Email Domain*

> **[LIVESTREAM INSIGHT]**
> - Nur **Top-Level Domains**, keine Subdomains
> - Matt wärmt Domains jetzt **mit OpenClaw** auf statt Instantly-Warmup
> - Domain wird geflaggt? → Inboxes löschen, Domain laufen lassen, dann waschen und zur nächsten

## Warum eine separate Domain

Schicke **NIEMALS** Cold Emails von deiner Hauptdomain. Wenn die Outreach-Domain geflaggt wird, sind deine Business-Emails nicht betroffen. Nicht verhandelbar.

## Schritt 1: Outreach Domain kaufen

| Hauptdomain | Outreach-Optionen | Warum es funktioniert |
|:---|:---|:---|
| scaleupmedia.com | scaleupmedia.co, tryscaleup.com | Variante die seriös aussieht aber die Hauptdomain schützt |
| yeschefos.com | yeschef.io, tryyeschef.com | Erkennbare Marke + anderes TLD |
| taxsmartai.com | taxsmart.io, trytaxsmart.com | Professionelle Varianten |

**Wo kaufen:** Namecheap ($8-12/Jahr), Cloudflare Registrar ($8-10/Jahr, günstigste Renewals), GoDaddy ($12-20/Jahr). Nimm Namecheap oder Cloudflare.

## Schritt 2: Email Accounts

Google Workspace ($6/User/Mo) oder Microsoft 365 ($6/User/Mo). 3-5 Accounts pro Domain erstellen. Sendevolumen über Accounts verteilen.

| Account | Zweck | Tageslimit |
|:---|:---|:---|
| matt@tryscaleup.com | Primär — CEO Outreach | 30-50/Tag nach Warmup |
| hello@tryscaleup.com | General Outreach | 30-50/Tag nach Warmup |
| partnerships@tryscaleup.com | Partnership-Ansatz | 30-50/Tag nach Warmup |
| team@tryscaleup.com | Team-Ansatz | 30-50/Tag nach Warmup |

## Schritt 3: DNS Konfiguration (Kritisch)

Ohne korrektes DNS landen Emails im Spam. Alle DREI einrichten:

**SPF Record:**
`TXT | Host: @ | v=spf1 include:_spf.google.com ~all`

**DKIM Record:**
Dem Google Workspace oder M365 Setup-Wizard folgen um den DKIM Key zu generieren.

**DMARC Record:**
`TXT | Host: _dmarc | v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`

**Custom Tracking Domain:**
`CNAME: track.yourdomain.com` zeigt auf deinen Email-Plattform Tracking Server.

## Schritt 4: Domain Warmup (NICHT ÜBERSPRINGEN)

Neue Domains haben null Reputation. Schrittweise über 2-4 Wochen aufwärmen:

| Woche | Tagesvolumen | Status |
|:---|:---|:---|
| Woche 1 (Tage 1-7) | 5-10/Tag | Erste Reputation aufbauen |
| Woche 2 (Tage 8-14) | 15-25/Tag | Positive Muster etablieren sich |
| Woche 3 (Tage 15-21) | 30-40/Tag | Domain Reputation festigt sich |
| Woche 4 (Tage 22-28) | 40-50/Tag | Volle Produktionskapazität |

**Instantly.ai beinhaltet unbegrenztes Warmup in allen Plänen. Am Tag 1 aktivieren, 14+ Tage warten bevor echte Sends.**

**PROMPT: Domain Verification Agent**

```
Du verifizierst die Cold Email Domain Konfiguration vor dem Outreach.

## CHECKS:
1. SPF Record existiert mit korrektem 'include'
2. DKIM Key veröffentlicht und gültig
3. DMARC Policy gesetzt
4. MX Records korrekt
5. Domain-Alter (Flag wenn <14 Tage)
6. Warmup läuft seit 14+ Tagen
7. Blacklist Check (Spamhaus, Barracuda)

## TOOLS: MXToolbox, mail-tester.com, multirbl.valli.org

## OUTPUT: {domain, spf, dkim, dmarc, mx, warmup_days,
  blacklists_clean, ready_for_outreach, issues[]}
```

---

# PHASE 6: COLD EMAIL INFRASTRUKTUR

*Instantly.ai und Alternativen*

> **[LIVESTREAM INSIGHT]**
> - **Keine Hyperlinks im ersten Email** — nur Response anfordern ("antworte einfach ob das für dich interessant klingt")
> - Erst bei positiver Response: Demo/Calendly-Link senden
> - **OpenClaw managed die Inbox-Responses automatisch**
> - Matt zahlt kein Instantly mehr — macht Warmup + Sending alles über OpenClaw

## Instantly.ai Preise

**Outreach Pläne:**

| Plan | Monatlich | Jährlich | Kontakte | Emails/Mo |
|:---|:---|:---|:---|:---|
| Growth | $37/Mo | $30/Mo | 1.000 | 5.000 |
| Hypergrowth | $97/Mo | $77/Mo | 25.000 | 125.000 |
| Light Speed | $358/Mo | $286/Mo | 100.000 | 500.000 |

Alle Pläne: unlimited Email Accounts + unlimited Warmup.

**Lead Gen Pläne:**

| Plan | Preis | Leads/Mo |
|:---|:---|:---|
| Growth Leads | $47/Mo | 1.000 verifiziert |
| Supersonic | $97/Mo | 4.500 verifiziert |
| Light Speed | $492/Mo | 25.000 verifiziert |

**Empfehlung:** Start mit Hypergrowth ($97/Mo). Growth Plan mit 1.000 Kontakten ist zu restriktiv. SuperSearch ($47/Mo) dazu wenn nötig. Total: ~$144/Mo.

## Alternativen-Vergleich

| Plattform | Preis | Key Advantage | Limitation |
|:---|:---|:---|:---|
| Instantly.ai | $37/Mo | Unlimited Accounts + Warmup | Features hinter Tier-Gating |
| Smartlead.ai | $39/Mo | Unlimited Warmup + AI Warmup | Steilere Lernkurve |
| Saleshandy | $25/Mo | Günstigste + Unlimited Emails | Weniger Analytics |
| Lemlist | $59/Mo | Beste Personalisierung (Bilder) | Teurer |
| Woodpecker | $29/Mo | Beste für Agenturen | Niedrigere Limits |
| Reply.io | $59/Mo | Multi-Channel Outreach | Komplexes Setup |
| Mailshake | $59/Mo | Einfache UI + Phone Dialer | Eingeschränkte Automation |

**PROMPT: Instantly Campaign Agent**

```
Du managst Instantly.ai Campaigns via API.
API Key: [DEIN_KEY] | Base: https://api.instantly.ai/api/v1

## KEY ENDPOINTS:
Add Leads: POST /lead/add
  {campaign_id, skip_if_in_workspace: true,
   leads: [{email, first_name, last_name, company_name, personalization}]}

Create Campaign: POST /campaign/create
  {name, email_accounts: ['matt@tryscaleup.com']}

Analytics: GET /campaign/analytics?campaign_id=xxx

## EINSTELLUNGEN:
- 30-50 Sends pro Account pro Tag
- Mo-Fr, 8-17 Uhr Empfänger-Zeitzone
- Stop bei Reply: Ja
- Opens + Clicks tracken (Custom Tracking Domain)
- Follow-up Delay: 3-4 Werktage
```

## Deinem Agent eine Email Box geben

Gib deinem OpenClaw Agent IMAP/SMTP-Zugang um Replies zu monitoren und Antworten zu drafteen.

**PROMPT: Email Inbox Management Agent**

```
Du monitorst eine Email Inbox für Cold Outreach Replies.
IMAP: imap.gmail.com | SMTP: smtp.gmail.com
Email: matt@tryscaleup.com
Auth: [APP_PASSWORD] (Google App Passwords, niemals Hauptpasswort)

## CHECK: Alle 15 Min während 8-18 Uhr

## REPLIES KATEGORISIEREN:
1. INTERESSIERT: Als hot flaggen, Calendly-Link Response draften, Matt alerten
2. VIELLEICHT SPÄTER: In Nurture aufnehmen, 30/60/90 Tage Follow-up planen
3. NICHT INTERESSIERT: Bedanken, aus Campaigns entfernen, zur DNC-Liste
4. REFERRAL: Referral-Info extrahieren, zur Pipeline hinzufügen, Warm Intro draften
5. OUT OF OFFICE: Rückkehrdatum notieren, 2 Tage danach follow-uppen
6. UNSUBSCRIBE: Sofort aus ALLEN Campaigns + Suppression List entfernen
7. SAUER: Aus allem entfernen, permanenter Ausschluss, NICHT ANTWORTEN

## TÄGLICHER 18 UHR REPORT:
Gesamt Replies, Aufschlüsselung nach Kategorie, Hot Leads die Aktion brauchen,
gebuchte Meetings, verarbeitete Unsubscribes
```

---

# PHASE 7: PERSONALISIERTE COLD EMAILS SCHREIBEN

*Die Emails, die tatsächlich Antworten bekommen*

> **[LIVESTREAM INSIGHT]**
> - **Personalisierung ist der absolute Game-Changer** — Blog-Posts des Targets referenzieren, spezifische Artikel erwähnen
> - Matts Open Rates: **~40-45%**, Response Rate **"through the roof"**
> - PR Outreach Beispiel: Artikel des Targets finden → "Hey [Name], ich hab gerade deinen Artikel über [Thema] gelesen..."
> - Erster Email: **Kein Link, kein Attachment** — nur um Response bitten
> - Bei positiver Response erst Calendly/Demo-Link senden
> - "Low Commitment Ask": Einfach antworten ob Interesse besteht

## Cold Email Framework

> **⚖️ DACH:** Jede Email braucht eine professionelle Signatur mit Impressum (Name, Firma, Adresse, HRB). Das ist Standard und fällt nicht auf. Kein Opt-Out-Link, kein Abmelde-Button — das würde die "persönliche Email"-Illusion zerstören. Bei "kein Interesse" sofort und permanent aus der Liste nehmen.

Unter 120 Wörter. Niemand liest Romane von Fremden. Ziel: eine Antwort bekommen.

| Element | Zweck | Länge |
|:---|:---|:---|
| Betreffzeile | Öffnung provozieren (Neugier/Relevanz) | 3-7 Wörter |
| Eröffnungszeile | Beweisen dass du kein Robot bist | 1 Satz |
| Pain Point | Zeigen dass du ihr Problem verstehst | 1-2 Sätze |
| Value Prop | Wie du es löst (Ergebnisse, keine Features) | 1-2 Sätze |
| CTA | Ein einfacher, Low-Commitment Ask | 1 Satz |
| Signatur | Name, Titel (keine Links im ersten Email) | 2-3 Zeilen |

**PROMPT: Cold Email Writer Agent**

```
Du schreibst hochpersonalisierte Cold Emails die Antworten generieren.

## REGELN:
1. UNTER 120 WÖRTER, keine Ausnahmen
2. Kein Jargon (Synergien, Leveragen, Cutting-Edge)
3. Keine falsche Dringlichkeit (Zeitlich begrenzt, Jetzt handeln)
4. Lockerer Ton — wie eine smarte Person die textet, kein Marketer
5. EIN CTA pro Email
6. Keine Attachments/Bilder im ersten Email
7. Max 1 Link (Custom Tracking Domain)
8. Etwas SPEZIFISCHES über deren Firma referenzieren

## INPUT: Kontaktdaten, Signal Data, pain_point_evidence,
  personalization_hooks, product_value_prop

## STRUKTUR:
Betreff: [3-7 Wörter, keine Spam-Wörter]

Hi {vorname},

[Spezifische Referenz auf deren Firma — beweist Research]

[Pain Point mit Daten/Zitaten aus der Recherche]

[Value Prop mit konkretem Ergebnis/Metrik]

[CTA: 'Lohnt sich ein kurzes Gespräch?' oder ähnlich]

Beste Grüße, {name}
{firma} | {adresse} | {rechtsform} {hrb}

## FOLLOW-UPS (DACH: max 2 total):
Tag 3-4: Neuer Ansatz, gleicher Pain. Insight hinzufügen.
Tag 7-8: Breakup Email. Letzter Check-in, kein Druck. Danach → DNC.
⚠️ DACH: Kein dritter Follow-Up. Wer nach 2 Emails nicht antwortet → permanent raus.
```

## Praxis-Beispiele

**Beispiel 1: YesChefOS an Restaurant-Kette (Hiring Signal)**

> Betreff: eure 3 neuen Ops Manager Stellen
>
> Hi Sarah, mir ist aufgefallen, dass ihr 3 Regional Operations Manager sucht — Glückwunsch zum Wachstum. Von 47 auf 100 Standorte zu skalieren ist spannend, aber genau da bricht oft die Konsistenz ein. Wir haben einer 62-Standort-Kette geholfen, Food Waste um 23% zu senken und das Onboarding neuer Standorte von 6 Wochen auf 11 Tage zu verkürzen. Lohnt sich ein 15-Minuten-Blick?

**Warum es funktioniert:** Referenziert spezifische Stellenanzeigen, nennt konkrete Ergebnisse, Low-Commitment CTA.

**Beispiel 2: TaxSmartAI an Steuerberatung (Compliance Signal)**

> Betreff: Krypto-Meldepflichten treffen Q2
>
> Hi David, hab deinen Blogpost über die Vorbereitung auf die neuen Krypto-Meldepflichten gelesen. Wir haben eine KI gebaut die Krypto-Steuerklassifizierung automatisiert. Eine Kanzlei hat die Krypto-Steuerbearbeitungszeit in der letzten Saison um 70% gesenkt. Wäre eine kurze Demo nützlich vor Q2?

**Beispiel 3: Social Agent (Competitor Ausfall Signal)**

> Betreff: der [Competitor]-Ausfall hat euch auch erwischt
>
> Hi Jennifer, hab deinen Post gesehen — 6 Stunden geplanter Content verloren während des Ausfalls. Wir haben unsere Plattform mit Redundanz gebaut um Single Points of Failure zu vermeiden. Drei Kunden sind letzten Monat von [Competitor] gewechselt und haben keinen einzigen Post verpasst. Lohnt es sich, das als Backup anzuschauen?

**Beispiel 4: Venture Studio (Funding Signal)**

> Betreff: Glückwunsch zur Series A
>
> Hi Mike, Glückwunsch zur $5M Runde — hab den TechCrunch-Artikel gesehen. Wir betreiben ein Venture Studio das 14 SaaS-Produkte von der Idee zum Revenue gebracht hat. Wir kürzen typischerweise 3-4 Monate der Entwicklung ab, indem wir den kompletten Build übernehmen, damit Gründer sich auf Wachstum fokussieren können. Lohnt sich ein Blick wie wir das für [ähnliche Firma] gemacht haben?

---

# PHASE 8: DATENMANAGEMENT

*CSV und Google Sheets Integration*

> **[LIVESTREAM INSIGHT]**
> - **Alles lokal in CSVs** bauen, dann manuell zu Google Sheets pushen
> - Jede Outreach-Task hat eigene CSV im Task-Ordner
> - Wenn Client Zugang braucht → Google Sheets, sonst lokal bleiben
> - Read/Write Permissions für CSV explizit setzen

## CSV vs Google Sheets

| Faktor | CSV Dateien | Google Sheets |
|:---|:---|:---|
| Komplexität | Einfach, weniger Connection Points | Mehr Setup, mehr bewegliche Teile |
| Agent Zuverlässigkeit | Höher — Agents lesen/schreiben leicht | Niedriger — API Auth kann brechen |
| Echtzeit-Zugriff | Manuelle Updates | Live Daten, teilbar |
| Am besten für | Agent Processing, Pipelines | Human Review, Team-Zusammenarbeit |
| Empfehlung | FÜR AGENT WORKFLOWS NUTZEN | FÜR DASHBOARDS + TEAM NUTZEN |

**Der Move:** CSV für Agent-Arbeit (weniger Breakpoints), Sync zu Google Sheets für Human Review.

## Master CSV Schema

```
lead_id, date_detected, signal_type, signal_strength, signal_source,
company_name, website, industry, employee_count, estimated_revenue,
city, state, country,
contact_1_name, contact_1_title, contact_1_email, contact_1_verified,
contact_1_linkedin, [wiederhole für Kontakte 2-3],
review_summary, news_summary, personalization_brief,
lead_score, pipeline_stage, last_action, last_action_date,
email_sent, email_opened, email_replied, reply_sentiment,
meeting_booked, meeting_date, deal_value, notes
```

## Google Sheets API Setup (Schritt für Schritt)

**Schritt 1:** Gehe zu console.cloud.google.com > Neues Projekt > Nenne es 'OpenClaw-Sheets-Integration'

**Schritt 2:** APIs & Services > Bibliothek > 'Google Sheets API' UND 'Google Drive API' aktivieren

**Schritt 3:** APIs & Services > Anmeldedaten > Anmeldedaten erstellen > Service Account > Name 'openclaw-sheets' > Editor Rolle > Keys Tab > Key hinzufügen > JSON > Key-Datei herunterladen

**Schritt 4:** JSON Key öffnen, client_email finden. Ein Google Sheet erstellen. Mit dieser Email als Editor teilen.

**Schritt 5: Installieren:**
```
pip install gspread google-auth
# oder: npm install googleapis google-auth-library
```

**PROMPT: Google Sheets Sync Agent**

```
Du synchronisierst CSV-Daten mit Google Sheets für Human Review.

## PYTHON SETUP:
import gspread
from google.oauth2.service_account import Credentials

SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive']
creds = Credentials.from_service_account_file('key.json', scopes=SCOPES)
client = gspread.authorize(creds)

## SHEET TABS: Signals, Leads, Validated, Campaigns, Replies, Dashboard

## SYNC: CSV lesen > Sheet öffnen > Tab leeren > Header Zeile 1 >
Daten ab Zeile 2 > Header fett formatieren > Timestamp + Count loggen

## ZEITPLAN: Alle 4 Stunden + finaler Sync um 18 Uhr

## FEHLER: 429=60s warten und retry. Leeres CSV=warnen, Sheet nicht leeren.
```

---

# PHASE 9: PERFORMANCE DASHBOARD

*Alles tracken von Signals bis zum Abschluss*

## Dashboard Metriken

| Metrik | Quelle/Formel | Zielwert |
|:---|:---|:---|
| Signals erkannt heute | COUNT heutige Zeilen in Signals | 10-30/Tag (DACH) |
| Leads angereichert heute | COUNT heutige Leads Zeilen | 10-25/Tag (DACH) |
| Emails validiert heute | COUNT heute hinzugefügte validierte | 20-50/Tag (DACH) |
| Cold Emails gesendet heute | SUM über alle Campaigns | 20-50/Tag (DACH) |
| Open Rate | Geöffnet / Gesendet | Über 50% |
| Reply Rate | Antworten / Gesendet | Über 5% |
| Positive Reply Rate | Interessiert / Gesamt Replies | Über 30% |
| Bounce Rate | Bounces / Gesendet | Unter 2% |
| Meetings/Woche | COUNT Meetings aus Replies | 5-10/Woche |
| Cost Per Lead | Gesamtausgaben / Leads | Unter $5 |
| Cost Per Meeting | Gesamtausgaben / Meetings | Unter $50 |

**Option 1: CSV + Google Sheets Dashboard (Empfohlen)**
Wenigste Connection Points, zuverlässigste Variante. Agents schreiben CSV, Sync zu Sheets, Formeln berechnen Metriken.

**Option 2: HTML Dashboard**
Single-File HTML mit Chart.js für Live-Darstellung.

**Option 3: Metabase**
Kostenloses Open-Source BI. Per Docker auf VPS installieren. Mit SQLite verbinden. Overkill zum Start, aber großartig beim Skalieren.

**PROMPT: Dashboard Data Agent**

```
Du kompilierst Metriken aus allen CSV-Dateien in tägliche Dashboard Reports.

## DATENQUELLEN: signals.csv, leads.csv, validated.csv,
campaigns.csv, replies.csv, costs.csv

## TÄGLICHER REPORT SEKTIONEN:
1. PIPELINE: Neue Signals, Leads, Validierte heute. Gesamt in Pipeline.
   Stage Breakdown: new > contacted > replied > meeting > closed
2. OUTREACH HEUTE: Gesendet, Opens (%), Replies (%), Bounces (%)
3. LETZTE 7 TAGE: Gleiche Metriken, Trend-Richtung
4. CAMPAIGN BREAKDOWN: Stats pro Campaign
5. KOSTEN: Verbrauchte Credits pro Service, Tageskosten gesamt,
   Cost per Lead, Cost per Meeting
6. ACTION ITEMS: Hot Leads die Aufmerksamkeit brauchen,
   underperformende Campaigns, technische Probleme

OUTPUT: daily_report_YYYY-MM-DD.csv + Sync zum Dashboard Sheet
```

---

# APPENDIX A: KOMPLETTE PROMPT-BIBLIOTHEK

| Agent | Phase | Zweck |
|:---|:---|:---|
| ICP Definition | 1 | Ideal Customer Profile definieren |
| Signal Scanner | 1 | Web nach Buying Signals scannen |
| Signal Enrichment | 1 | Signals mit Kontext anreichern |
| Coordinator | 2 | Multi-Agent Pipeline orchestrieren |
| Website Scraper | 2 | Firmendaten extrahieren |
| LinkedIn Research | 2 | Decision Makers finden |
| Review Scraper | 2 | Reviews auf Pain Points analysieren |
| Data Compiler | 2 | Daten in sauberes CSV zusammenführen |
| Email Pattern Guesser | 3 | Emails über Muster raten |
| Hunter.io API | 3 | Emails via Hunter API finden |
| Waterfall Finder | 3 | Multi-Service Email Kaskade |
| Email Validation | 4 | Emails vor dem Senden validieren |
| Domain Verification | 5 | DNS und Domain Config verifizieren |
| Instantly Campaign | 6 | Campaigns via API managen |
| Inbox Management | 6 | Replies monitoren und kategorisieren |
| Cold Email Writer | 7 | Personalisierte Emails schreiben |
| Sheets Sync | 8 | CSV zu Google Sheets synchronisieren |
| Dashboard Data | 9 | Metriken kompilieren |
| HTML Dashboard | 9 | Visuelles Dashboard generieren |

---

# APPENDIX B: TROUBLESHOOTING GUIDE

| Problem | Ursache | Lösung |
|:---|:---|:---|
| Emails im Spam | Fehlendes DNS, nicht aufgewärmt | SPF/DKIM/DMARC verifizieren, 2+ Wochen Warmup |
| Hoher Bounce (>2%) | Schlechte Daten, veraltete Listen | Neu validieren, besserer Finder, Alter reduzieren |
| Niedrige Opens (<30%) | Spammy Betreffzeilen | A/B testen, Neugier nutzen, Trigger Words vermeiden |
| Niedrige Replies (<2%) | Nicht personalisiert genug | Spezifischere Referenzen, CTA abschwächen |
| Schlechte Agent-Daten | Vage Prompts | Output Format Requirements + Validation Rules hinzufügen |
| Sheets API scheitert | Token abgelaufen, Quota erreicht | Creds erneuern, Quota Dashboard prüfen |
| Hunter Credits aufgebraucht | Zu viele Domain Searches | Email Finder für spezifische Kontakte nutzen |
| Instantly suspendiert | Zu schnell, Bounces, Spam | Volumen reduzieren, Listenqualität verbessern |
| CSV korrumpiert | Kommas in Feldern, Encoding | Felder in Quotes, UTF-8, nach Schreiben validieren |
| Rate Limits | Zu viele Requests | Exponential Backoff, Batching, Ergebnisse cachen |
| Leads konvertieren nicht | Falsches ICP, schwache Value Prop | ICP reviewen, Messaging testen, auf Hot Signals fokussieren |

---

# APPENDIX C: MONATLICHER KOSTEN-KALKULATOR

| Ausgabe | Starter (500/Mo) | Growth (2K/Mo) | Scale (10K/Mo) |
|:---|:---|:---|:---|
| Outreach Domain | $1/Mo | $1/Mo | $3/Mo (3 Domains) |
| Google Workspace | $6/Mo (1 Account) | $24/Mo (4 Accounts) | $72/Mo (12 Accounts) |
| Instantly.ai | $37/Mo | $97/Mo | $358/Mo |
| Hunter.io | $0 (Free) | $49/Mo | $149/Mo |
| DeBounce | $3/Mo | $10/Mo | $25/Mo |
| OpenClaw VPS | $10-20/Mo | $20-40/Mo | $40-80/Mo |
| AI Models (Haiku/Sonnet) | $50-100/Mo | $100-200/Mo | $200-400/Mo |
| **GESAMT** | **$107-167/Mo** | **$301-421/Mo** | **$847-1.087/Mo** |
| Cost Per Lead | $0,21-$0,33 | $0,15-$0,21 | $0,08-$0,11 |
| Cost Per Meeting | $7-11 | $5-7 | $3-4 |

**ROI Rechnung:** Durchschnittlicher Deal = $3K/Mo. 2 Deals aus Cold Outreach abschließen = $6K/Mo Revenue bei ~$300-400/Mo Ausgaben. Das ist ein **15-20x ROI**.

---

# APPENDIX D: LIVESTREAM Q&A HIGHLIGHTS

Die wichtigsten Fragen und Antworten aus Matts Live Training:

### Folder Structure
**F:** In welchen Ordner kommen die Projekte?
**A:** `.openclaw/projects/[projektname]/tasks/[taskname]/` — Jede Task hat eigenen Unterordner mit CSVs, Memory-Files etc.

### Model-Wahl
**F:** Welche Models nutzt du?
**A:** Haiku als Default für alles. Eskalation zu Sonnet wenn nötig, Opus nur wenn alles kaputt ist. Multi-Agent Setup mit Haiku hält die Kosten niedrig.

### Lokale LLMs
**F:** Kann man lokale LLMs nutzen?
**A:** Ja, Ollama funktioniert. Nachteil: Agents treffen mehr CAPTCHAs und Soft Blocks als bei API-Models.

### Memory-Probleme
**F:** Mein Bot vergisst alles / ist dumm?
**A:** Memory in Projekt-Files speichern. Agent anweisen: "Check memory on project before you run task." Keyword für Session-Reset einrichten (z.B. "newsession").

### Ein System vs. Mehrere
**F:** Läuft alles auf einer Instanz?
**A:** Ja. Ein Agent, Cron-basiert. Jede Stunde ein anderer Task. Matt plant evtl. zweites System in den kommenden Monaten.

### Session Management (Telegram/Slack)
**F:** Wie verhindert man Token-Explosion?
**A:** Keyword "new session" trainieren → Agent dumpt vorherige Session-History. Memory bleibt persistent in Projekt-Files.

### SMS Outreach
**F:** Kann man SMS über OpenClaw machen?
**A:** Ja, über Twilio. **Aber nur mit Opt-in!** Cold SMS ohne Opt-in = illegal in den USA (und erst recht in DACH/DSGVO).

### Facebook/Instagram
**F:** Kann ich FB Messenger nutzen?
**A:** Extrem vorsichtig. Ein Flag = Ban. Nicht auf Business Manager Account testen. Altes Wegwerf-Konto nutzen.

### Kimmy 2.5 / Alternative Models
**F:** Was ist mit Kimmy 2.5, Grok 4.1?
**A:** Matt testet. Kimmy hat ihm Free Credits angeboten. Benchmark gegen Haiku steht noch aus.

### Brave Search API
**F:** Welcher Search-Service?
**A:** Brave Search API — ~$4/Monat, hilft gegen CAPTCHAs. "Definitely install that."

### Chrome Extension
**F:** Wie kommt man durch Paywalls?
**A:** OpenClaw Chrome Extension installieren. Einloggen, Agent kann dann hinter Paywalls zugreifen.

---

**JETZT UMSETZEN.**

Jeder Prompt. Jedes Tool. Jeder Schritt. Das Einzige was fehlt ist die Umsetzung.

@mattganzak | ScaleUP Media | MattGanzak.com
