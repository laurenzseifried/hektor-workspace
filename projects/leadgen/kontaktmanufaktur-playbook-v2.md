# KONTAKTMANUFAKTUR — COLD OUTREACH PLAYBOOK v2

**Appointment Setting für den DACH-Markt**
Personalisierte Geschäftsanbahnung mit OpenClaw

Laurenz Seifried | KontaktManufaktur | 2026

---

> **⚖️ DACH-COMPLIANCE (Minimalprinzip)**
>
> Wir operieren als **persönliche Geschäftsanbahnung** — keine Massenwerbung.
>
> 1. **Impressum in der Signatur** — Laurenz Seifried, Auf dem Horn 12, 38315 Hornburg (§5 DDG)
> 2. **Sofort löschen bei "nein"** — DNC-Liste, nie wieder kontaktieren
> 3. **Relevanz + niedriges Volumen** — Max 50 Emails/Tag gesamt. Jede Email individuell.
>
> Kein Opt-Out-Link. Kein Abmelde-Button. Keine Datenschutzerklärung.

---

# INHALTSVERZEICHNIS

1. Unsere 5 ICPs — Wen wir targeten
2. Lead Scoring Matrix — Freshness First
3. Signal Detection — ICP-spezifische Quellen
4. Data Scraping — Multi-Agent Pipeline
5. Email Discovery — Hunter.io + Guessing
6. Email Validation — DeBounce
7. Domain & Infrastruktur — Instantly Setup
8. Cold Emails — Templates pro ICP
9. Inbox Management — Reply Handling
10. Datenmanagement — CSV Workflow
11. Performance Dashboard
12. Der "Erste 3 Meetings gratis" Pitch
13. Pricing Matrix

Appendix A: Prompt Library
Appendix B: Troubleshooting Guide

---

# 1. UNSERE 5 ICPs

Nach systematischem Testing von 20 ICPs mit standardisierter Scoring-Matrix haben wir die Top 5 identifiziert.

**Alte ICPs:** Coaches (ENTFERNT — nur 11% Hot-Rate, kaum frische Signals <90 Tage)
**Neue ICPs:** MedTech, Logistik, Franchise hinzugefügt

---

## ICP 1: MedTech / HealthTech Startups ⭐⭐⭐⭐⭐

```json
{
  "icp": "medtech_healthtech",
  "company_size": "5-80 Mitarbeiter",
  "stage": "Seed bis Series B (frisch finanziert)",
  "industries": ["MedTech", "HealthTech", "Digital Health"],
  "business_model": "B2B — verkaufen an Kliniken, Praxen, Versicherungen, Pharma",
  "geographic": "DACH",
  "decision_makers": ["CEO/Founder", "VP Sales", "Head of Business Development"],
  "pricing": "€400-€600/Meeting",
  "deal_value": "€20-100K+",
  "NOT_THIS": ["Biotech/Pharma (zu lange Sales Cycles)", "reine B2C Health Apps"],
  "buying_triggers": [
    "Frisches Funding (Seed, Series A/B) — stärkstes Signal",
    "Sales/BD Job Posting — sie bauen Vertrieb auf",
    "CE-Zertifizierung / MDR-Zulassung erhalten — jetzt müssen sie verkaufen",
    "Accelerator-Batch abgeschlossen (4C, UnternehmerTUM, Calm/Storm)",
    "Expansion in neuen Markt (DACH → EU, oder neues Kundensegment)",
    "Partnerschaft mit Klinik/Versicherer — validiert Produkt, braucht mehr Pipeline"
  ],
  "pain_points": [
    "Wir haben Funding, jetzt müssen wir Kunden gewinnen",
    "Technical/Medical Founder, null Sales-Erfahrung",
    "Regulatorische Hürden gemeistert, jetzt geht's ums Verkaufen",
    "Sales Cycles 3-6 Monate, brauchen qualifizierte Pipeline"
  ],
  "performance": "67% Hot-Rate, höchster ACV, CEO-Emails häufig öffentlich"
}
```

**Personalisierungs-Ansätze:**
- "Glückwunsch zur [Funding-Runde] — wie plant ihr die Go-to-Market Strategie?"
- "Eure [CE-Zertifizierung/MDR-Zulassung] ist ein Meilenstein — habt ihr schon eine Outbound-Pipeline?"
- "Ich habe gesehen, dass [Investor] bei euch eingestiegen ist — [Investor] Portfolio-Companies nutzen oft [Ansatz]"

---

## ICP 2: B2B SaaS Startups (Seed-Series A) ⭐⭐⭐⭐⭐

```json
{
  "icp": "saas_startups",
  "company_size": "5-50 Mitarbeiter",
  "stage": "Seed bis Series A (€500K - €20M Funding)",
  "industries": ["SaaS", "B2B Software", "Tech Startups"],
  "verticals": ["FinTech", "RegTech", "LegalTech", "HRTech", "DevTools"],
  "revenue": "€200K-€5M ARR",
  "geographic": "DACH",
  "decision_makers": ["CEO/Founder", "CRO", "VP Sales", "Head of Growth"],
  "pricing": "€250-€400/Meeting",
  "deal_value": "€5-50K+",
  "NOT_THIS": ["B2C SaaS", "Marktplätze", "Hardware-lastig"],
  "buying_triggers": [
    "Frisches Funding — #1 Signal, immer",
    "Erste Sales-Hire (SDR, BDR, AE Posting) — sie investieren in Outbound",
    "Product Launch / neues Feature — brauchen Pipeline für neue Capability",
    "Founder postet über 'Product-Market Fit' — bereit zu skalieren",
    "Expansion DACH → EU/US — neuer Markt, brauchen lokale Leads"
  ],
  "pain_points": [
    "Technical Founder, null Sales-Erfahrung",
    "Nach Funding: schnell Traction zeigen (Investor-Druck)",
    "Paid Ads zu teuer, organisch zu langsam",
    "Kein Sales-Prozess, Founder macht alles selbst"
  ],
  "performance": "83% Hot-Rate, universell skalierbar, schnelle Sales Cycles (1-3 Monate)"
}
```

**Personalisierungs-Ansätze:**
- "Eure [Series A] von [Investor] zeigt starkes Momentum — wie sieht eure Outbound-Strategie aus?"
- "Ich sehe ihr sucht einen [SDR/AE] — was wenn ihr die Pipeline bekommt bevor der Hire steht?"
- "Euer [Produkt] löst genau das Problem das [Zielkunde-Typ] hat — habt ihr die schon auf dem Radar?"

---

## ICP 3: Logistik-Software / SupplyChain Tech ⭐⭐⭐⭐

```json
{
  "icp": "logistik_supplychain",
  "company_size": "5-80 Mitarbeiter",
  "stage": "Seed bis Series B",
  "industries": ["Logistik-Software", "SupplyChain Tech", "WMS", "TMS", "Last-Mile"],
  "business_model": "B2B SaaS oder Plattform für Logistik/Transport/Warehousing",
  "geographic": "DACH (Hub: Hamburg, Berlin, München)",
  "decision_makers": ["CEO/Founder", "VP Sales", "Head of Partnerships"],
  "pricing": "€300-€450/Meeting",
  "deal_value": "€10-50K",
  "NOT_THIS": ["Klassische Speditionen", "reine Beratung"],
  "buying_triggers": [
    "Frisches Funding — Rail-Flow (€12.5M), Flowfox (€7M), pyck (€2.6M)",
    "Enterprise-Deal gewonnen (z.B. Logistikbude → Nagel-Group)",
    "Nachhaltigkeits/CSRD-Positionierung — Treiber für neue Kundensegmente",
    "Expansion neuer Markt (DACH → EU, oder neues Segment)",
    "Award/Ranking (BVL, LogiMAT)",
    "Partnership mit Logistik-Konzern"
  ],
  "pain_points": [
    "Nachhaltigkeit als Verkaufsargument aber keine Pipeline",
    "Enterprise-Vertrieb langsam, brauchen qualifizierte Leads",
    "Hamburg-Cluster aber alle kämpfen um die gleichen Kunden",
    "Sales Cycles 3-6 Monate, müssen früher ansetzen"
  ],
  "performance": "Meiste Leads absolut (18 in v2), Hamburg als konzentrierter Hub, wenig Outbound-Wettbewerb"
}
```

**Personalisierungs-Ansätze:**
- "Eure [Funding-Runde] zeigt dass der Markt reif ist — wie baut ihr die Sales-Pipeline?"
- "Euer [CSRD/Nachhaltigkeit]-Ansatz trifft genau den Nerv — die Nachfrage bei [Zielkunden] explodiert gerade"
- "Glückwunsch zum [Enterprise-Deal/Award] — wie skaliert ihr das jetzt?"

---

## ICP 4: Marketing/Design/IT-Agenturen ⭐⭐⭐⭐

```json
{
  "icp": "agenturen",
  "company_size": "5-30 Mitarbeiter",
  "industries": ["Digital-Marketing", "Kreativ/Design", "Performance", "SEO", "Social Media", "Web-Entwicklung"],
  "revenue": "€200K-€5M Jahresumsatz",
  "geographic": "Deutschland",
  "decision_makers": ["Geschäftsführer/Inhaber", "Managing Partner", "Head of New Business"],
  "pricing": "€200-€350/Meeting",
  "deal_value": "€1-5K/Monat (Retainer-Modell möglich)",
  "NOT_THIS": ["PR-Agenturen (anderer Sales Cycle)", "Unternehmensberatungen", "Freelancer"],
  "buying_triggers": [
    "Job Posting 'New Business Manager' — #1 Signal, sie haben ein Akquise-Problem",
    "Pitch-Gewinn / großer Neukunde — Kapazität wird knapp, brauchen mehr",
    "Award gewonnen (ADC, Annual Multimedia, German Brand Award) — Momentum nutzen",
    "Neuer Standort / Expansion — Wachstum = mehr Pipeline nötig",
    "Neue Service-Linie (z.B. AI-Integration) — neues Angebot braucht neue Kunden",
    "GF-Wechsel / neuer Partner — strategische Neuausrichtung"
  ],
  "pain_points": [
    "Feast-or-Famine Projektgeschäft",
    "Founder gefangen in Akquise statt strategischer Arbeit",
    "Empfehlungen funktionieren aber skalieren nicht",
    "Ohne Pipeline: müssen jeden Kunden nehmen (auch schlechte Deals)"
  ],
  "performance": "6 Hot Leads in v2, Awards als zuverlässige Signal-Quelle, Agenturen verstehen Marketing-Wert"
}
```

**Personalisierungs-Ansätze:**
- "Ich sehe ihr sucht einen New Business Manager — was wenn wir die Pipeline füllen bevor der Hire steht?"
- "Glückwunsch zum [Award/Pitch-Gewinn] — wie stellt ihr sicher dass das Momentum nicht abreißt?"
- "Euer neuer [AI/Service]-Bereich klingt spannend — habt ihr schon die passenden Leads dafür?"

---

## ICP 5: Franchise-Geber ⭐⭐⭐⭐⭐

```json
{
  "icp": "franchise_geber",
  "company_size": "Franchise-Zentrale 5-50 MA, System insgesamt beliebig",
  "stage": "Etabliert mit Expansionsplan (5+ bestehende Standorte)",
  "industries": ["Food", "Fitness", "Dienstleistung", "Retail", "Handwerk"],
  "geographic": "Deutschland",
  "decision_makers": ["Franchise-Direktor", "Head of Franchise Development", "Geschäftsführer"],
  "pricing": "€350-€500/Meeting",
  "deal_value": "€50-500K LTV (ein Franchise-Nehmer über Laufzeit)",
  "NOT_THIS": ["Einzel-Franchise-Nehmer", "MLM/Network Marketing"],
  "buying_triggers": [
    "Neue Standort-Eröffnung — aktiv in Expansion, brauchen mehr Franchise-Nehmer",
    "Franchise-Award gewonnen (DFV Award) — Momentum + Validierung",
    "Neuer Investor / Funding — Kapital für Expansion da",
    "'X Standorte bis [Jahr]' Ankündigung — explizites Wachstumsziel",
    "Neues Land / neue Region — geografische Expansion",
    "Franchise-Messe Teilnahme — aktiv auf der Suche"
  ],
  "pain_points": [
    "Wir wollen wachsen, brauchen qualifizierte Franchise-Nehmer",
    "Zu viele Tire-Kickers, zu wenig seriöse Interessenten",
    "Offline-Events teuer und zeitaufwändig",
    "Franchise-Portale liefern Masse aber keine Qualität"
  ],
  "performance": "6 Hot Leads, Signals extrem frisch (<30 Tage), höchster LTV, DFV Verband als Hub"
}
```

**Personalisierungs-Ansätze:**
- "Glückwunsch zur Eröffnung in [Stadt] — wie findet ihr eure nächsten Franchise-Partner?"
- "Euer Ziel von [X Standorten bis 2027] ist ambitioniert — wie sieht die Rekrutierungs-Pipeline aus?"
- "Der [DFV Award] zeigt dass euer System funktioniert — jetzt müssen es nur noch mehr Leute wissen"

---

# 2. LEAD SCORING MATRIX

**Neu in v2:** Standardisierte Scoring-Matrix, die für alle 20 getesteten ICPs verwendet wurde.

## Signal Freshness Score (max 25 Punkte)

- Signal < 14 Tage alt: **25**
- Signal 15-30 Tage alt: **20**
- Signal 31-60 Tage alt: **15**
- Signal 61-90 Tage alt: **10**
- Signal > 90 Tage oder undatiert: **0** (NICHT aufnehmen)

**REGEL:** Wir nehmen NUR Signals < 90 Tage auf.

---

## Signal Strength Score (max 25 Punkte)

- **Tier 1 (25):** Frisches Funding, aktive Job-Ausschreibung Sales/BD, explizite Aussage "suchen Kunden/Partner"
- **Tier 2 (20):** Teamwachstum, neue GF/Partner, Expansion neuer Standort, Award/Ranking
- **Tier 3 (15):** Content Marketing Aktivität (Blog, Podcast, LinkedIn Posts), Event-Teilnahme als Speaker
- **Tier 4 (10):** Verzeichnis-Eintrag mit aktuellem Profil, aktive Social Media Präsenz
- **Tier 5 (5):** Nur Website gefunden, kein aktives Signal

---

## ICP Fit Score (max 20 Punkte)

- Exakt im Ziel-MA-Range + B2B + DACH: **20**
- Leicht außerhalb MA-Range (±20%): **15**
- Richtige Branche, aber MA unklar: **10**
- Grenzfall (Branche passt teilweise): **5**

---

## Personalisierbarkeit Score (max 15 Punkte)

- GF/Entscheider Name + persönlicher Hook (Artikel, Post, Interview): **15**
- GF/Entscheider Name + generischer Hook (Case Study, Referenz): **10**
- Nur Firmenname, kein persönlicher Kontakt: **5**

---

## Email-Findbarkeit Score (max 15 Punkte)

- Email öffentlich auf Website: **15**
- Email-Pattern erkennbar (vorname@firma.de): **10**
- Nur Kontaktformular / LinkedIn: **5**
- Keine Kontaktmöglichkeit gefunden: **0**

---

## Gesamtscore: max 100 Punkte

| Kategorie | Punkte | Aktion |
|:---|:---|:---|
| 80-100 | 🔥 HOT | Sofort kontaktieren |
| 60-79 | 🟡 WARM | In Pipeline, Enrichment nötig |
| 40-59 | ❄️ COLD | Nur bei ICP-Match, niedrige Prio |
| < 40 | ❌ DROP | Nicht aufnehmen |

---

## Pflichtfelder pro Lead

```
- Firma:
- Website: (verifizierte URL)
- Branche/Typ:
- Team Size: (Quelle angeben)
- Entscheider: (Name + Rolle)
- Signal: (was genau?)
- Signal-Datum: (TT.MM.YYYY oder "KW X 2026")
- Signal-Quelle: (exakte URL) ← NEU
- Scores: Freshness X + Strength X + Fit X + Personal X + Email X = TOTAL
- Personalisierungs-Hook:
- Kontakt: (Email/LinkedIn/Formular)
```

---

# 3. SIGNAL DETECTION — ICP-SPEZIFISCHE QUELLEN

Wir nutzen vorgegebene Quellen pro ICP basierend auf bewährten DACH-Signal-Quellen.

---

## Signal Sources pro ICP

### MedTech / HealthTech
**Top-Quellen:**
- **Deutsche Startups** (https://www.deutsche-startups.de) — Funding, DealMonitor
- **Startup Insider** (https://www.startup-insider.com) — Funding News, Podcast
- **Crunchbase DACH** (https://www.crunchbase.com + Filter Deutschland) — Funding Rounds
- **LinkedIn Jobs** (Jobs: Sales, BD, Business Development bei MedTech)
- **BfArM/CE-Datenbanken** (https://www.bfarm.de) — CE-Zertifizierungen
- **Health Relations** (https://www.healthrelations.de) — MedTech News
- **MedTech Zwo** (https://www.medtechzwo.de) — MedTech Innovation

### B2B SaaS
**Top-Quellen:**
- **Deutsche Startups** (https://www.deutsche-startups.de/dealmonitor) — DealMonitor täglich
- **OMR Reviews** (https://omr.com/de/reviews) — Tool-Adoption, Stack-Insights
- **LinkedIn Jobs** (Jobs: SDR, AE, Sales Manager bei SaaS)
- **North Data** (https://www.northdata.de) — Handelsregister, Kapitalerhöhungen
- **Crunchbase** (Funding Rounds DACH)
- **Startbase** (https://www.startbase.de) — Funding, Startup-DB
- **t3n** (https://t3n.de) — Digital Business News

### Logistik / SupplyChain Tech
**Top-Quellen:**
- **Deutsche Startups** (Logistik-Tag)
- **LinkedIn Jobs** (Jobs: Sales, Account Manager bei Logistik-Software)
- **BVL News** (https://www.bvl.de) — Bundesvereinigung Logistik
- **LogiMAT** (https://www.logimat-messe.de) — Messe, Aussteller-Liste
- **DVZ** (https://www.dvz.de) — Deutsche Verkehrs-Zeitung, Branchennews
- **Transport & Logistik** (Fachmedien)
- **Crunchbase** (Filter: Logistics, DACH)

### Marketing/Design/IT-Agenturen
**Top-Quellen:**
- **W&V** (https://www.wuv.de) — Etat-Meldungen, Pitch-Gewinne, Awards
- **Sortlist** (https://www.sortlist.de) — Projekt-Ausschreibungen, Agentur-Profile
- **OMR Jobs** (https://omr.com/de/jobs) — Marketing, Digital Jobs
- **Kununu** (https://www.kununu.com) — Review-Volumen = Wachstums-Signal
- **ADC** (https://www.adc.de) — Awards
- **German Brand Award** (https://www.german-brand-award.com) — Gewinner-Listen
- **Horizont** (https://www.horizont.net) — Media, Werbung
- **iBusiness** (https://www.ibusiness.de) — Agentur-Rankings

### Franchise-Geber
**Top-Quellen:**
- **DFV** (https://www.franchiseverband.com) — Deutscher Franchise-Verband, Mitglieder
- **Franchise-Portal.de** (https://www.franchise-portal.de) — Systeme, News
- **LinkedIn** (Hashtags: #franchise, #franchisegeber, "X Standorte bis 2027")
- **IHK Existenzgründung** (https://www.ihk.de) — Franchise-Events
- **Deutsche Startups** (Franchise-Tag)
- **Lokale Presse** (Neueröffnungen, Standort-Expansion)

---

## Signal Scanner (Universal-Prompt für alle ICPs)

**PROMPT: Signal Scanner für [ICP_NAME]**

```
Du bist ein Signal Detection Agent für KontaktManufaktur.

## DEINE AUFGABE:
Finde Buying Signals für [ICP_NAME] in Deutschland/DACH.

## ICP-DEFINITION:
[Hier: komplette ICP-Definition aus Section 1 einfügen]

## BUYING SIGNALS:
[Hier: buying_triggers aus ICP-Definition einfügen]

## VORGEGEBENE QUELLEN (nutze diese):
[Liste der ICP-spezifischen Quellen von oben]

## SCORING:
Nutze die standardisierte Scoring-Matrix:
- Freshness (max 25): Nur Signals < 90 Tage
- Strength (max 25): Tier 1-5 basierend auf Signal-Typ
- ICP Fit (max 20): Größe, B2B, DACH
- Personalisierbarkeit (max 15): Name + Hook
- Email-Findbarkeit (max 15): Öffentlich/Pattern/Formular

## FÜR JEDES SIGNAL PFLICHT:
{
  "firma": "",
  "website": "",
  "branche": "",
  "team_size": "",
  "entscheider": "",
  "signal_type": "",
  "signal_datum": "TT.MM.YYYY",
  "signal_source_url": "https://...",  ← PFLICHT: woher kam dieser Lead?
  "freshness_score": X,
  "strength_score": X,
  "fit_score": X,
  "personal_score": X,
  "email_score": X,
  "total_score": X,
  "personalisierungs_hook": "",
  "kontakt": ""
}

## OUTPUT:
- JSON Array, sortiert nach total_score
- NUR Signals ≥40 Punkte
- NUR Signals < 90 Tage alt
- Ziel: 10-20 Signals pro Scan (Qualität > Quantität)
```

---

## Quellen-Performance Tracking

Wir tracken pro Lead die Quelle im Feld `signal_source_url`. Nach 2 Wochen werten wir aus, welche Quellen die besten Leads liefern (höchster Score, meiste Hot-Leads ≥80), und passen die Liste an.

**Dashboard-Metrik (siehe Section 11):**
Pro Quelle tracken: Anzahl Leads, Anzahl Hot (≥80), Hot-Rate, Durchschnitts-Score.

---

## Signal Enrichment (für alle ICPs)

**PROMPT: Signal Enrichment Agent**

```
Du bist der Enrichment Agent für KontaktManufaktur.
Reichere jedes Roh-Signal mit Kontext an.

## FÜR JEDES SIGNAL ERGÄNZEN:
- company_website, linkedin_url
- entscheider_name, entscheider_titel, entscheider_linkedin
- estimated_employees, estimated_revenue
- tech_stack_indicators (welche Tools nutzen sie?)
- recent_content (letzte Blog-Posts, LinkedIn-Posts, Podcast-Episoden)
- pain_point_evidence (direkte Zitate/Belege)
- urgency_score: 1-10
- personalization_hooks: 3-5 spezifische Punkte für die Email
  (z.B. "Hat am 10.02. über X gepostet", "Sucht laut Stellenanzeige Y")

## SCORING (urgency_score):
8-10 = Aktiver Pain (sucht gerade Kunden, hat gepostet, stellt ein)
5-7 = Wachstumsmodus (Funding, neue Projekte, expandiert)
1-4 = Allgemeiner Fit (passt zum ICP, aber kein akuter Trigger)

## OUTPUT: Angereichertes JSON, sortiert nach urgency_score.
```

---

# 4. DATA SCRAPING — MULTI-AGENT PIPELINE

## Architektur

| Agent | Aufgabe | Model |
|:---|:---|:---|
| Coordinator | Pipeline orchestrieren | Haiku |
| Website Scraper | Firmendaten extrahieren | Haiku |
| LinkedIn Research | Entscheider finden | Haiku |
| Content Scraper | Blog/LinkedIn Posts für Personalisierung | Haiku |
| Data Compiler | Alles in sauberes CSV | Haiku |

**PROMPT: Coordinator Agent**

```
Du bist der Lead Research Coordinator für KontaktManufaktur.

## WORKFLOW:
1. Signal-Liste aus Phase 3 empfangen
2. Pro Signal delegieren:
   a. Company URL -> Website Scraper
   b. Entscheider Name -> LinkedIn Research
   c. Company -> Content Scraper (letzte Posts/Artikel)
3. Ergebnisse sammeln
4. An Data Compiler übergeben
5. Quality Check

## REGELN:
- 10er-Batches
- Hot Signals zuerst
- Retry bei Fehler (1x)
- Alle Ergebnisse in CSV: projects/kontaktmanufaktur/tasks/outreach/[icp]/leads.csv
```

**PROMPT: Website Scraper Agent**

```
Du bist der Website Scraper für KontaktManufaktur. Extrahiere:

- company_name, tagline, branche
- standorte, team_size_indicators
- services/produkte (was bieten sie an?)
- kontakt_email (von Website, wenn öffentlich)
- blog_vorhanden (ja/nein), letzte_blog_topics
- lead_gen_vorhanden (Newsletter, Whitepaper, Funnel?)
- social_links (LinkedIn, XING, Twitter)
- impressum_daten (Geschäftsführer, Rechtsform, Adresse)
- pain_point_clues (z.B. "Jetzt Erstgespräch buchen" = braucht Leads)

OUTPUT: JSON. Null wenn nicht gefunden. Nie erfinden.
```

**PROMPT: LinkedIn Research Agent**

```
Du bist der LinkedIn Research Agent für KontaktManufaktur.
Nutze Google: '[name] [firma] site:linkedin.com/in'

## FINDE:
- full_name, job_title, linkedin_url
- entscheidungs_level (Inhaber|GF|VP|Director|Manager)
- tenure (wie lange in der Rolle?)
- recent_posts (letzte 3 LinkedIn Posts — Themen + Datum)
- mutual_interests (Personalisierungsmaterial)
- email_pattern_guess (wird in Phase 5 validiert)

## ZIEL: 1-2 Entscheider pro Firma.
```

**PROMPT: Content Scraper Agent**

```
Du bist der Content Scraper für KontaktManufaktur.
Finde aktuelle Inhalte des Zielkontakts für Email-Personalisierung.

## SUCHE:
- Letzte 3 LinkedIn Posts (Thema, Datum, Key Quote)
- Letzte 3 Blog-Artikel (Titel, Datum, Kernaussage)
- Podcast-Auftritte (Name, Episode, Thema)
- Webinare/Events (Titel, Datum)
- Interviews/Presse (Medium, Titel)

## OUTPUT pro Kontakt:
{
  "best_personalization_hook": "Dein LinkedIn Post vom 10.02. über XY",
  "content_summary": "Postet regelmäßig über [Thema], zuletzt am [Datum]",
  "talking_points": ["Punkt 1", "Punkt 2", "Punkt 3"]
}

WICHTIG: Nur echte, verifizierbare Inhalte. Nie erfinden.
```

**PROMPT: Data Compiler Agent**

```
Du führst alle Daten für KontaktManufaktur zusammen.

## CSV SCHEMA (neu in v2 — signal_source_url hinzugefügt):
lead_id, icp_type, date_detected, signal_type, signal_strength,
company_name, website, branche, standort, team_size,
kontakt_name, kontakt_titel, kontakt_email, kontakt_email_verified,
kontakt_linkedin, kontakt_xing,
signal_source_url,  ← NEU: woher kam der Lead?
content_hook (bester Personalisierungs-Aufhänger),
pain_point_evidence, personalization_brief,
lead_score (1-100), pipeline_stage, notes

## SCORING (lead_score):
- Signal Strength: 40%
- Data Completeness: 20%
- ICP Fit: 20%
- Urgency: 20%

## OUTPUT: CSV nach projects/kontaktmanufaktur/tasks/outreach/[icp]/leads.csv
Separate CSV pro ICP (medtech.csv, saas.csv, logistik.csv, agenturen.csv, franchise.csv)
```

---

# 5. EMAIL DISCOVERY

## Hunter.io Integration

Wir nutzen Hunter.io (API Key bereits hinterlegt).

**PROMPT: Email Finder Agent**

```
Du bist der Email Finder für KontaktManufaktur.
Nutze die Hunter.io API.

API Key: [aus Environment Variable HUNTER_API_KEY]
Base URL: https://api.hunter.io/v2

## WORKFLOW:
1. Domain Search: GET /domain-search?domain={domain}&api_key={key}
   → Alle bekannten Emails der Firma sehen
2. Zielkontakt in Ergebnissen? → Email übernehmen
3. Nicht gefunden? → Email Finder:
   GET /email-finder?domain={d}&first_name={f}&last_name={l}&api_key={key}
4. Immer noch nichts? → Pattern Guessing Fallback:
   - vorname.nachname@domain.com (36%)
   - vorname@domain.com (25%)
   - vornamenachname@domain.com (15%)
5. Alle Emails → Validation Queue

## BUDGET-TRACKING:
- Searches verbraucht heute: X
- Verifications verbraucht heute: X
- Credits übrig: X

## OUTPUT: Email + confidence score + Methode (hunter|guess)

## FEHLER: 429=10s warten. Kein Ergebnis=Guess. Alles loggen.
```

---

# 6. EMAIL VALIDATION

**PROMPT: Email Validation Agent**

```
Du bist der Validation Agent für KontaktManufaktur.
Nutze DeBounce API.

API: https://api.debounce.io/v1/?api={key}&email={email}

## KATEGORISIERUNG:
- SAFE: result='Safe to Send' oder debounce_code='5' → Outreach Queue
- RISKY: result='Role' oder 'Accept-All' → Manual Review
- INVALID: result='Invalid'/'Disposable'/'Spam-Trap' → Entfernen + loggen

## REGELN:
- Nie unvalidiert senden
- >30 Tage alte Daten neu validieren
- Accept-All: max 5 Sends/Tag zum Testen
- Bounce Rate <2% halten
- Täglich Stats loggen: Gesamt, Safe, Risky, Invalid
```

---

# 7. DOMAIN & INFRASTRUKTUR

## Domain Setup Anleitung (Schritt-für-Schritt)

### 1. Outreach Domain kaufen
- **Wo:** Namecheap oder Cloudflare
- **Kosten:** €8-12/Jahr
- **Auswahl:** Variation des Hauptdomains (z.B. kontakt-manufaktur.de statt kontaktmanufaktur.de)
- **Warum:** Hauptdomain-Reputation schützen

### 2. Email Accounts einrichten
- **Provider:** Google Workspace oder Microsoft 365
- **Kosten:** ~€6/User/Monat
- **Anzahl:** 3-5 Accounts pro Domain (z.B. laurenz@, hallo@, kontakt@)
- **DACH-Regel:** Max 50 Emails/Tag GESAMT über alle Accounts

### 3. SPF Record setzen
**Exakter TXT-Eintrag bei deinem Domain-Provider:**
```
v=spf1 include:_spf.google.com ~all
```
(Für Google Workspace — bei M365: `include:spf.protection.outlook.com`)

**Prüfen:** https://mxtoolbox.com/spf.aspx

### 4. DKIM aktivieren
**Wo:** Google Workspace Admin → Apps → Gmail → Authenticate Email
**Schritte:**
1. Domain auswählen
2. "Generate new record" klicken
3. TXT-Record bei Domain-Provider einfügen
4. In Google Workspace "Start authentication" klicken

**Prüfen:** https://mxtoolbox.com/dkim.aspx

### 5. DMARC Record setzen
**Exakter TXT-Eintrag:**
```
v=DMARC1; p=none; rua=mailto:dmarc@deinedomain.de
```
(Host: `_dmarc.deinedomain.de`)

**Prüfen:** https://mxtoolbox.com/dmarc.aspx

### 6. Custom Tracking Domain (in Instantly)
**CNAME-Eintrag:**
```
track.deinedomain.de → CNAME → track.instantly.ai
```
**Warum:** Tracking-Links nutzen deine Domain statt "instantly.ai" → bessere Deliverability

### 7. Warmup-Plan
**Woche 1:** 5 Emails/Tag/Account (nur an eigene Adressen + Testaccounts)
**Woche 2:** 10 Emails/Tag/Account
**Woche 3:** 20 Emails/Tag/Account
**Woche 4:** 30 Emails/Tag/Account
**Ab Woche 5:** Live mit 50/Tag GESAMT (verteilt auf alle Accounts)

**Tool:** Instantly Warmup (automatisch aktiviert)

---

## DNS Checklist (vor Go-Live)

Prüfe dass alles steht:
- [ ] SPF Record korrekt
- [ ] DKIM aktiv
- [ ] DMARC gesetzt
- [ ] Custom Tracking Domain
- [ ] Warmup mind. 14 Tage
- [ ] Domain-Alter >14 Tage (wenn neu gekauft)
- [ ] Blacklist-Check: https://mxtoolbox.com/blacklists.aspx

> **⚠️ DACH-Limit:** Wir senden max 50 Emails/Tag gesamt über alle Adressen. Nicht 50 pro Adresse. Das hält uns im "persönliche Email"-Bereich.

---

**PROMPT: Domain Verification Agent**

```
Verifiziere die Cold Email Domain Konfiguration für KontaktManufaktur.

## CHECKS:
1. SPF Record mit korrektem 'include'
2. DKIM Key veröffentlicht und gültig
3. DMARC Policy gesetzt
4. MX Records korrekt
5. Domain-Alter (Flag wenn <14 Tage)
6. Warmup-Status (mind. 14 Tage)
7. Blacklist Check (Spamhaus, Barracuda)

## TOOLS: MXToolbox, mail-tester.com

## OUTPUT: {domain, spf, dkim, dmarc, mx, warmup_days,
  blacklists_clean, ready_for_outreach, issues[]}
```

---

# 8. COLD EMAILS — TEMPLATES PRO ICP

## Allgemeine Regeln

- Unter 120 Wörter
- Deutsch, lockerer aber professioneller Ton (Sie)
- KEIN Link im ersten Email
- KEIN Opt-Out-Link
- EIN spezifischer Bezug auf deren Situation
- CTA: "Lohnt sich ein kurzes Gespräch?" oder ähnlich
- Signatur mit Impressum

## Email-Signatur (für alle Emails)

```
Laurenz Seifried
KontaktManufaktur

Auf dem Horn 12 | 38315 Hornburg
```

---

### ICP 1: MedTech/HealthTech Startups

**PROMPT: Email Writer — MedTech**

```
Du schreibst personalisierte Cold Emails für KontaktManufaktur an MedTech/HealthTech Founders.

## KONTEXT:
Wir bieten Appointment Setting: Wir liefern qualifizierte Demo-Calls/Discovery-Calls mit
potenziellen B2B-Kunden (Kliniken, Praxen, Versicherungen). Der Founder muss nicht mehr selbst Outreach machen.

## REGELN:
1. Unter 120 Wörter
2. Deutsch, Du-Form (Startup-Kultur)
3. Kein Link, kein Attachment
4. Spezifische Referenz auf Funding/Zertifizierung/Produkt
5. Pain: "Technologie/Medizin verstehen wir, Sales ist neu" / "Regulierung geschafft, jetzt geht's ums Verkaufen"
6. Value: "Qualifizierte B2B-Leads ohne eigenes Vertriebsteam"
7. CTA: Soft, low-commitment

## SIGNATUR:
Laurenz Seifried
KontaktManufaktur
Auf dem Horn 12 | 38315 Hornburg
```

**Template-Beispiel: MedTech nach Funding**

> Betreff: Glückwunsch zur Series A
>
> Hi [Vorname],
>
> hab gesehen, dass [Firmenname] gerade [€X M] eingesammelt hat — Glückwunsch!
>
> Nach meiner Erfahrung kommt jetzt die Phase, in der die Technologie steht, die Zertifizierung da ist — und der Vertrieb aufgebaut werden muss. Die meisten MedTech Founders kennen ihr Produkt in- und auswendig, aber Sales an Kliniken/Praxen ist nochmal was anderes.
>
> Wir übernehmen die Outreach und liefern qualifizierte Gespräche mit Entscheidern, die zu eurem ICP passen. Kein Vertriebsteam-Aufbau nötig, kein Ramp-up.
>
> Lohnt sich ein kurzer Austausch?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Template-Beispiel: MedTech nach CE-Zertifizierung**

> Betreff: eure CE-Zertifizierung
>
> Hi [Vorname],
>
> ich habe gesehen, dass [Firmenname] jetzt die CE-Zertifizierung hat — das ist ein Riesenmeilenstein. Jetzt heißt es verkaufen.
>
> Die meisten MedTech-Gründer erzählen mir: "Die Regulierung war hart, aber Sales ist nochmal eine andere Liga."
>
> Wir könnten euch die Outreach abnehmen und qualifizierte Demo-Calls mit Kliniken/Praxen liefern, während ihr euch auf Produktentwicklung und Bestandskunden konzentriert.
>
> Wäre das relevant für euch?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

---

### ICP 2: B2B SaaS Startups

**PROMPT: Email Writer — SaaS**

```
Du schreibst personalisierte Cold Emails für KontaktManufaktur an SaaS Founders.

## KONTEXT:
Wir bieten Appointment Setting: Wir liefern qualifizierte Demo-Calls mit
potenziellen Kunden. Der Founder muss nicht mehr selbst cold outreach machen.

## REGELN:
1. Unter 120 Wörter
2. Deutsch, Du-Form okay bei Startups (je nach Vibe der Firma)
3. Kein Link, kein Attachment
4. Spezifische Referenz auf Funding/Hiring/Produkt
5. Pain: "Post-Funding Pipeline-Druck" oder "Founder macht Sales allein"
6. Value: "Qualifizierte Demo-Calls ohne eigenes SDR-Team"
7. CTA: Soft, low-commitment

## SIGNATUR:
Laurenz Seifried
KontaktManufaktur
Auf dem Horn 12 | 38315 Hornburg

## HINWEIS: Bei SaaS Startups ist Du-Form oft okay. Prüfe die Website/LinkedIn
des Founders — wenn sie duzen, duzen wir auch.
```

**Template-Beispiel: SaaS nach Funding**

> Betreff: Glückwunsch zur Seed-Runde
>
> Hi [Vorname],
>
> hab gesehen, dass [Firmenname] gerade eine Seed-Runde abgeschlossen hat — Glückwunsch!
>
> Erfahrungsgemäß kommt jetzt die Phase, in der Pipeline aufgebaut werden muss und Investoren Traction sehen wollen. Viele Founder machen das erstmal selbst — kostet aber wahnsinnig viel Zeit.
>
> Wir übernehmen die Outreach und liefern qualifizierte Demo-Calls mit Entscheidern, die zu eurem ICP passen. Kein SDR-Hiring nötig, kein Ramp-up.
>
> Lohnt sich ein kurzer Austausch?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Template-Beispiel: SaaS sucht SDR**

> Betreff: eure SDR-Stelle auf LinkedIn
>
> Hi [Vorname],
>
> mir ist aufgefallen, dass ihr gerade einen SDR sucht. Bis der an Bord und eingearbeitet ist, vergehen erfahrungsgemäß 3-4 Monate.
>
> Wir könnten diese Lücke sofort schließen: Wir machen die Outreach und liefern euch qualifizierte Demo-Calls, während ihr in Ruhe den richtigen SDR findet.
>
> Wäre das relevant für euch?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

---

### ICP 3: Logistik-Software / SupplyChain Tech

**PROMPT: Email Writer — Logistik**

```
Du schreibst personalisierte Cold Emails für KontaktManufaktur an Logistik-Software Founders.

## KONTEXT:
Wir bieten Appointment Setting: Wir liefern qualifizierte Demo-Calls mit
potenziellen B2B-Kunden (Logistik-Unternehmen, Speditionen, E-Commerce).

## REGELN:
1. Unter 120 Wörter
2. Deutsch, Du-Form (Startup-Kultur)
3. Kein Link, kein Attachment
4. Spezifische Referenz auf Funding/CSRD/Nachhaltigkeit/Enterprise-Deal
5. Pain: "CSRD-Trend treibt Nachfrage aber Pipeline fehlt" / "Enterprise-Sales dauert ewig"
6. Value: "Qualifizierte Leads aus Logistik-Branche ohne eigenen Outbound-Aufwand"
7. CTA: Soft, low-commitment

## SIGNATUR:
Laurenz Seifried
KontaktManufaktur
Auf dem Horn 12 | 38315 Hornburg
```

**Template-Beispiel: Logistik nach Funding**

> Betreff: Glückwunsch zur Finanzierungsrunde
>
> Hi [Vorname],
>
> ich habe gesehen, dass [Firmenname] gerade [€X M] eingesammelt hat — starkes Signal dass der Markt für [Produkt-Kategorie] reif ist.
>
> Viele Logistik-Software Founders sagen mir: "Die Nachfrage ist da (besonders nach CSRD), aber unsere Pipeline ist zu dünn und Enterprise-Sales dauern ewig."
>
> Wir könnten euch die Outreach abnehmen und qualifizierte Demo-Calls mit Logistik-Entscheidern liefern, die aktiv nach [eurer Lösung] suchen.
>
> Lohnt sich ein kurzer Austausch?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Template-Beispiel: Logistik mit CSRD-Positionierung**

> Betreff: euer CSRD-Ansatz
>
> Hi [Vorname],
>
> euer Fokus auf [CSRD/Nachhaltigkeit] trifft genau den Nerv — die Nachfrage bei Logistik-Unternehmen explodiert gerade.
>
> Die Frage ist: Habt ihr genug Pipeline um das Momentum zu nutzen? Die meisten Logistik-Software-Anbieter mit denen ich spreche sagen: "Interesse ist da, aber wir kommen mit der Ansprache nicht hinterher."
>
> Wir übernehmen die Outreach und liefern qualifizierte Gespräche mit Logistik-Entscheidern, die CSRD-Lösungen brauchen.
>
> Wäre das relevant?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

---

### ICP 4: Marketing/Design/IT-Agenturen

**PROMPT: Email Writer — Agenturen**

```
Du schreibst personalisierte Cold Emails für KontaktManufaktur an Agentur-Gründer.

## KONTEXT:
Wir bieten Appointment Setting: Wir liefern qualifizierte Projekt-Anfragen.
Der Agentur-Founder muss nicht mehr selbst Kaltakquise machen.

## REGELN:
1. Unter 120 Wörter
2. Deutsch, Sie-Form (Agenturen sind oft formeller)
3. Kein Link, kein Attachment
4. Spezifische Referenz auf deren Portfolio/Situation
5. Pain: "Feast-or-Famine" / "Projektakquise frisst Ihre Zeit"
6. Value: "Qualifizierte Projekt-Anfragen ohne eigenen Akquise-Aufwand"
7. CTA: Soft, low-commitment
8. Meta-Angle möglich: "Wir machen für Sie, was Sie für Ihre Kunden machen"

## SIGNATUR:
Laurenz Seifried
KontaktManufaktur
Auf dem Horn 12 | 38315 Hornburg
```

**Template-Beispiel: Agentur mit Award**

> Betreff: Glückwunsch zum ADC Award
>
> Guten Tag Herr/Frau [Name],
>
> ich habe gesehen, dass [Agenturname] beim ADC ausgezeichnet wurde — Glückwunsch! Besonders [spezifisches Projekt] hat mich beeindruckt.
>
> Ich arbeite mit Agenturen zusammen, die hervorragende Arbeit leisten, aber deren Gründer zu viel Zeit mit Projektakquise statt mit strategischer Arbeit verbringen. Wir übernehmen die Ansprache und liefern qualifizierte Projekt-Anfragen von Unternehmen, die genau Ihre Expertise suchen.
>
> Wäre ein kurzer Austausch interessant?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Template-Beispiel: Agentur sucht New Business Manager**

> Betreff: eure New Business Manager-Stelle
>
> Guten Tag Herr/Frau [Name],
>
> ich habe gesehen, dass [Agenturname] gerade einen New Business Manager sucht. Bis der an Bord und eingearbeitet ist, vergehen oft 3-6 Monate.
>
> Wir könnten diese Lücke sofort schließen: Wir übernehmen die Projekt-Akquise und liefern qualifizierte Anfragen, während Sie in Ruhe den richtigen Hire finden.
>
> Lohnt sich ein kurzes Gespräch?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

---

### ICP 5: Franchise-Geber

**PROMPT: Email Writer — Franchise**

```
Du schreibst personalisierte Cold Emails für KontaktManufaktur an Franchise-Direktoren.

## KONTEXT:
Wir bieten Appointment Setting: Wir liefern qualifizierte Gespräche mit
potenziellen Franchise-Nehmern. Der Franchise-Direktor muss nicht mehr selbst auf Messen/Portalen Tire-Kickers aussortieren.

## REGELN:
1. Unter 120 Wörter
2. Deutsch, Sie-Form (professioneller Kontext)
3. Kein Link, kein Attachment
4. Spezifische Referenz auf Expansion/Award/neue Standorte
5. Pain: "Zu viele Tire-Kickers, zu wenig seriöse Interessenten" / "Messen teuer und zeitaufwändig"
6. Value: "Qualifizierte Franchise-Interessenten ohne Messe-Aufwand"
7. CTA: Soft, low-commitment

## SIGNATUR:
Laurenz Seifried
KontaktManufaktur
Auf dem Horn 12 | 38315 Hornburg
```

**Template-Beispiel: Franchise mit Expansionsziel**

> Betreff: euer Ziel von [X] Standorten bis 2027
>
> Guten Tag Herr/Frau [Name],
>
> ich habe gesehen, dass [Franchise-System] bis 2027 auf [X] Standorte wachsen möchte — ambitioniert!
>
> Die Frage, die sich mir stellt: Wie finden Sie die qualifizierten Franchise-Nehmer? Franchise-Portale liefern Masse, Messen sind teuer und zeitaufwändig — und am Ende sind 90% Tire-Kickers.
>
> Wir übernehmen die Ansprache und liefern qualifizierte Gespräche mit seriösen Franchise-Interessenten, die zu Ihrem System passen.
>
> Wäre ein kurzer Austausch interessant?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Template-Beispiel: Franchise nach DFV Award**

> Betreff: Glückwunsch zum DFV Award
>
> Guten Tag Herr/Frau [Name],
>
> der DFV Award zeigt, dass [Franchise-System] ein funktionierendes System ist — jetzt müssen es nur noch mehr qualifizierte Interessenten wissen.
>
> Die meisten Franchise-Geber erzählen mir: "Anfragen haben wir genug, aber 90% sind Tire-Kickers oder passen nicht zum System."
>
> Wir übernehmen die Vorqualifizierung und liefern Ihnen Gespräche mit seriösen Franchise-Interessenten, die Kapital, Erfahrung und echtes Interesse mitbringen.
>
> Lohnt sich ein kurzes Gespräch?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

---

## Follow-Up Strategie (für alle ICPs)

**Follow-Up 1 (Tag 3-4):**

> Betreff: Re: [Original-Betreff]
>
> Guten Tag Herr/Frau [Name],
>
> kurze Nachfrage zu meiner letzten Nachricht. Ich weiß, der Posteingang ist voll.
>
> [ICP-spezifisches Social Proof]:
> - MedTech: "Ein MedTech-Startup aus [Stadt] hat durch unsere Zusammenarbeit [X] Demo-Calls in [Y] Wochen bekommen"
> - SaaS: "Ein SaaS-Gründer aus [Nische] hat durch uns seinen Akquise-Aufwand um [X] Stunden/Woche reduziert"
> - Logistik: "Eine Logistik-Software aus Hamburg hat [X] qualifizierte Leads bekommen, bevor der SDR an Bord war"
> - Agentur: "Eine Agentur aus [Stadt] füllt jetzt ihre Pipeline ohne dass der GF Zeit in Kaltakquise investiert"
> - Franchise: "Ein Franchise-System hat [X] qualifizierte Interessenten in [Y] Wochen bekommen — statt Messe"
>
> Falls das Thema für Sie gerade nicht passt, kein Problem. Ich wollte nur sichergehen, dass die Nachricht angekommen ist.
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Danach: DNC. Kein dritter Follow-Up.**

---

# 9. INBOX MANAGEMENT

**PROMPT: Inbox Management Agent**

```
Du monitorst die Email Inbox für KontaktManufaktur.

## CHECK: Alle 15 Min während 8-18 Uhr

## REPLIES KATEGORISIEREN:
1. INTERESSIERT ("Klingt interessant", "Gerne mehr erfahren", "Wann passt es?")
   → Sofort antworten mit Terminvorschlag. Laurenz alerten.
   → Antwort-Template:
   "Freut mich! Wie wäre es mit einem kurzen 15-Minuten-Call diese Woche?
    Hier ein paar Vorschläge: [Mo/Di/Mi, jeweils 10 oder 14 Uhr]
    Oder nennen Sie mir gerne einen Termin, der Ihnen besser passt."

2. VIELLEICHT SPÄTER ("Gerade nicht, aber grundsätzlich interessant")
   → In Nurture-Liste. Follow-up in 30/60/90 Tagen.
   → "Verstehe ich gut. Ich melde mich in [X Wochen] nochmal — passt das?"

3. NICHT INTERESSIERT ("Nein danke", "Kein Bedarf")
   → Freundlich bedanken. Sofort DNC-Liste. Nie wieder kontaktieren.
   → "Danke für die Rückmeldung. Ich wünsche Ihnen weiterhin viel Erfolg!"

4. KEIN INTERESSE + GENERVT ("Woher haben Sie meine Adresse", "Spam")
   → DNC sofort. NICHT antworten.

5. REFERRAL ("Sprechen Sie mal mit meinem Kollegen X")
   → Referral-Info extrahieren, neue Outreach starten (warm!)

6. OUT OF OFFICE
   → Rückkehrdatum notieren, 2 Tage danach follow-uppen.

## TÄGLICHER REPORT (18 Uhr):
- Gesamt Replies
- Aufschlüsselung nach Kategorie
- Hot Leads die Aktion brauchen
- Gebuchte Meetings
- DNC hinzugefügt
```

---

# 10. DATENMANAGEMENT

## CSV Struktur (NEU: 5 ICP-Ordner + signal_source_url Feld)

```
Ordner: projects/kontaktmanufaktur/tasks/outreach/
├── medtech/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── saas/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── logistik/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── agenturen/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── franchise/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── master_dnc.csv      (globale Do-Not-Contact Liste)
└── daily_reports/
    └── report_YYYY-MM-DD.csv
```

## Master CSV Schema (NEU: signal_source_url hinzugefügt)

```
lead_id, icp_type, date_detected, signal_type, signal_strength,
company_name, website, branche, standort, team_size,
kontakt_name, kontakt_titel, kontakt_email, email_verified,
kontakt_linkedin,
signal_source_url,  ← NEU: woher kam der Lead?
content_hook, pain_point_evidence, personalization_brief,
lead_score, pipeline_stage,
email_1_sent, email_1_date, email_1_opened,
email_2_sent, email_2_date, email_2_opened,
reply_received, reply_date, reply_sentiment,
meeting_booked, meeting_date, meeting_status,
deal_value, notes
```

---

## Google Sheets Sync

Für menschliches Review und Reporting synchen wir die CSVs in Google Sheets.

### Service Account Setup (4 Schritte)

1. **Google Cloud Console:** Projekt erstellen → APIs & Services → Credentials
2. **Service Account:** Create Service Account → JSON Key downloaden
3. **Sheets API:** APIs & Services → Enable "Google Sheets API"
4. **Sheet freigeben:** Google Sheet erstellen → Mit Service Account Email teilen (Editor-Rechte)

### PROMPT: Google Sheets Sync Agent

```
Du bist der Google Sheets Sync Agent für KontaktManufaktur.

## AUFGABE:
Lese die CSVs aus den ICP-Ordnern und schreibe in Google Sheets für menschliches Review.

## SERVICE ACCOUNT:
- JSON Key: [aus Environment Variable GOOGLE_SERVICE_ACCOUNT_JSON]
- Sheet ID: [aus Environment Variable KONTAKTMANUFAKTUR_SHEET_ID]

## TABS (Sheet-Namen):
- Signals: Alle neuen Signals (aggregiert über alle ICPs)
- Leads: Alle Leads nach Enrichment
- Validated: Nur validierte Emails (email_verified=true)
- Campaigns: Alle gesendeten Kampagnen
- Replies: Alle Antworten (reply_received=true)
- Dashboard: Summary-Metriken (siehe Section 11)

## SYNC-ZEITPLAN:
- Alle 4 Stunden während 8-18 Uhr
- Final Sync: 18 Uhr

## REGELN:
- CSV = Source of Truth für Agent-Workflows
- Sheets = Human Review & Reporting
- Nie von Sheets zurück in CSV schreiben (außer manuell markierte DNC)
- Bei Konflikten: CSV gewinnt

## FEHLERBEHANDLUNG:
- API Rate Limit (429): 60s warten, retry
- Sheet nicht gefunden: Alert an Laurenz
- Logge jeden Sync: Timestamp, Anzahl Rows, Errors
```

---

# 11. PERFORMANCE DASHBOARD

## Metriken

| Metrik | Zielwert |
|:---|:---|
| Emails gesendet/Tag | 50 (DACH-Limit) |
| Open Rate | >50% |
| Reply Rate | >5% |
| Positive Reply Rate | >30% der Replies |
| Bounce Rate | <2% |
| Meetings/Woche | 3-5 |
| Cost Per Meeting | <€30 |
| Show-Up Rate | >70% |

## Nischen-Vergleich tracken (NEU: 5 ICPs)

| Metrik | MedTech | SaaS | Logistik | Agenturen | Franchise |
|:---|:---|:---|:---|:---|:---|
| Emails gesendet | | | | | |
| Reply Rate | | | | | |
| Meetings gebucht | | | | | |
| Show-Up Rate | | | | | |
| Avg. Deal Value | | | | | |
| → Verdoppeln auf | | | | | |

**Nach 2 Wochen:** Die Top 2-3 ICPs mit der besten Reply Rate + Meeting Rate bekommen 70% des Volumens.

**PROMPT: Dashboard Agent**

```
Kompiliere tägliche Metriken für KontaktManufaktur.

## DATENQUELLEN:
- medtech/leads.csv, saas/leads.csv, logistik/leads.csv, agenturen/leads.csv, franchise/leads.csv
- campaigns.csv pro ICP
- master_dnc.csv

## TÄGLICHER REPORT:
1. PIPELINE: Neue Signals, Leads, Validierte heute pro ICP
2. OUTREACH: Gesendet, Opens, Replies, Bounces (gesamt + pro ICP)
3. MEETINGS: Gebucht diese Woche, Show-Up Rate
4. NISCHEN-VERGLEICH: Reply Rate + Meeting Rate pro ICP
5. QUELLEN-PERFORMANCE: Top 5 Signal-Quellen
   - Pro Quelle (aus signal_source_url): Anzahl Leads, Anzahl Hot (≥80), Hot-Rate, Durchschnitts-Score
6. KOSTEN: Hunter.io Credits, DeBounce Credits, Instantly, Tageskosten
7. ACTION ITEMS: Hot Leads, underperformende ICP, technische Issues

OUTPUT: daily_reports/report_YYYY-MM-DD.csv
```

---

# 12. DER "ERSTE 3 MEETINGS GRATIS" PITCH

## Strategie

Wir haben keine Case Studies → wir bauen sie selbst. Die ersten Kunden bekommen 3 Meetings kostenlos als Proof of Concept.

## Wie es in der Email eingebaut wird

**Nicht** im ersten Email erwähnen. Erst wenn jemand interessiert ist und wir im Gespräch sind:

> "Ich schlage Folgendes vor: Wir liefern Ihnen die ersten 3 qualifizierten Meetings kostenlos. Sie sehen die Qualität, wir beweisen was wir können. Danach entscheiden Sie, ob Sie weitermachen möchten."

## Nach den 3 Gratis-Meetings

- Meeting dokumentieren (Firma, Titel, Ergebnis)
- Feedback vom Kunden holen (schriftlich, für Testimonial)
- Case Study aufbauen: "[Firma X] hat durch KontaktManufaktur [Y] Meetings in [Z] Wochen bekommen"
- Übergang zu Paid: "Ab jetzt €[Preis]/Meeting. Sollen wir weitermachen?"

---

# 13. PRICING MATRIX (NEU: 5 ICPs)

| ICP | Preis/Meeting | Begründung |
|:---|:---|:---|
| MedTech/HealthTech | €400-€600 | Höchster ACV (€20-100K+ Deals), lange Sales Cycles, spezialisierte Ansprache |
| B2B SaaS | €250-€400 | LTV €5-50K+, Post-Funding Budget, schnelle Sales Cycles (1-3 Mo) |
| Logistik/SupplyChain | €300-€450 | LTV €10-50K, CSRD-Trend treibt Nachfrage, mittlere Sales Cycles (3-6 Mo) |
| Agenturen | €200-€350 | LTV €1-5K/Mo Retainer, engere Budgets, aber hoher Pain (Feast-or-Famine) |
| Franchise-Geber | €350-€500 | Höchster LTV (€50-500K über Laufzeit), lange Sales Cycles (3-12 Mo) |

## Pricing-Gespräch

> "Unser Pricing basiert auf dem Wert eines Meetings für Sie. Bei einem durchschnittlichen Kunden-Lifetime-Value von [X] und einer üblichen Abschlussquote von [Y]% ist ein qualifiziertes Meeting für Sie [Z] wert. Wir nehmen [Preis] pro gebuchtem Meeting — Sie zahlen nur für Ergebnisse, nicht für Aufwand."

---

# APPENDIX A: PROMPT LIBRARY

Übersicht aller Prompts im Playbook:

| Agent | Phase | Zweck |
|:---|:---|:---|
| Signal Scanner | 3. Signal Detection | ICP-spezifische Signals finden |
| Signal Enrichment Agent | 3. Signal Detection | Signals mit Kontext anreichern |
| Coordinator Agent | 4. Data Scraping | Pipeline orchestrieren |
| Website Scraper Agent | 4. Data Scraping | Firmendaten extrahieren |
| LinkedIn Research Agent | 4. Data Scraping | Entscheider finden |
| Content Scraper Agent | 4. Data Scraping | Personalisierungs-Material sammeln |
| Data Compiler Agent | 4. Data Scraping | Daten in CSV zusammenführen |
| Email Finder Agent | 5. Email Discovery | Emails finden via Hunter.io |
| Email Validation Agent | 6. Email Validation | Emails validieren via DeBounce |
| Domain Verification Agent | 7. Domain Setup | DNS/Domain-Config prüfen |
| Email Writer — MedTech | 8. Cold Emails | Personalisierte Emails MedTech |
| Email Writer — SaaS | 8. Cold Emails | Personalisierte Emails SaaS |
| Email Writer — Logistik | 8. Cold Emails | Personalisierte Emails Logistik |
| Email Writer — Agenturen | 8. Cold Emails | Personalisierte Emails Agenturen |
| Email Writer — Franchise | 8. Cold Emails | Personalisierte Emails Franchise |
| Inbox Management Agent | 9. Inbox Management | Replies kategorisieren, antworten |
| Google Sheets Sync Agent | 10. Datenmanagement | CSVs in Sheets synchen |
| Dashboard Agent | 11. Dashboard | Tägliche Metriken kompilieren |

---

# APPENDIX B: TROUBLESHOOTING GUIDE

Häufige Probleme und Lösungen für DACH Cold Outreach:

| Problem | Ursache | Lösung |
|:---|:---|:---|
| **Emails landen im Spam** | DNS-Records falsch, Domain zu neu, zu hohes Volumen | SPF/DKIM/DMARC prüfen (MXToolbox), Warmup verlängern, Volumen reduzieren auf 30/Tag |
| **Hohe Bounce Rate (>2%)** | Alte Daten, schlechte Validierung, Email-Pattern falsch | Nur Daten <90 Tage, DeBounce vor jedem Send, Hunter.io statt Pattern Guessing |
| **Niedrige Open Rate (<30%)** | Spam-Wörter, langweiliger Betreff, falsche Timing | Subject Lines A/B-testen, keine "Gratis", "Kostenlos", "Angebot", Sendezeit 9-11 Uhr testen |
| **Niedrige Reply Rate (<2%)** | Zu generisch, kein echter Personalisierungs-Hook, falscher ICP | Mehr Zeit in Research, spezifischen Bezug auf Signal, CTA weicher machen |
| **Hunter.io Credits aufgebraucht** | Zu viele Domain Searches | Domain Search sparsam nutzen (nur bei >50 MA), Pattern Guessing für kleine Firmen |
| **Instantly Account gesperrt** | Zu hohes Volumen, zu hohe Bounce Rate, Spam-Reports | Volumen sofort auf 20/Tag reduzieren, Liste besser validieren, Warmup neu starten |
| **CSV kaputt (Import-Fehler)** | Sonderzeichen, fehlende Quotes, falsches Encoding | Alle Felder in Quotes, UTF-8 Encoding, Kommas in Feldern escapen |
| **Rate Limits (Hunter/DeBounce)** | Zu viele Requests in kurzer Zeit | Exponential Backoff (10s, 30s, 60s), Requests in 10er-Batches, Caching aktivieren |
| **Google Sheets Sync Error** | API Quota exceeded, Sheet nicht freigegeben | Rate Limit (100 requests/100s beachten), Service Account Email als Editor hinzufügen |
| **Keine Signals gefunden** | Falsche Quellen, zu enge Filter | Mehr Quellen checken (siehe Section 3), Freshness auf 60 Tage erweitern (Test) |

---

# APPENDIX: MONATLICHE KOSTEN

| Ausgabe | Betrag |
|:---|:---|
| Outreach Domain | ~€1/Mo (bereits vorhanden) |
| Google Workspace (3 Accounts) | ~€18/Mo |
| Instantly.ai | ~€37/Mo |
| Hunter.io (Starter) | €49/Mo |
| DeBounce | ~€10/Mo |
| AI Models (Haiku) | ~€50-100/Mo |
| **Gesamt** | **~€165-215/Mo** |

**Break-Even:** 1 Meeting verkauft (€200-600) = Monatskosten gedeckt.
**Ziel:** 10-15 Meetings/Monat = **€3.000-€9.000/Mo Revenue** bei €165-215 Kosten.

---

# ÄNDERUNGSLOG v2

**Stand:** 15.02.2026

## Was ist neu in dieser Version?

1. **5 ICPs statt 3** — Coaches entfernt, MedTech/Logistik/Franchise hinzugefügt
2. **Standardisierte Scoring-Matrix** — Freshness (25), Strength (25), ICP Fit (20), Personal (15), Email (15)
3. **Vorgegebene Quellen pro ICP** — Statt autonomer Suche nutzen wir bewährte DACH-Quellen (Deutsche Startups, OMR, LinkedIn, etc.)
4. **Quellen-Tracking** — Feld `signal_source_url` in jedem Lead, Dashboard zeigt Top 5 Quellen
5. **ICP-spezifische Buying Signals** — datenbasiert aus 20-ICP-Testing
6. **ICP-spezifische Personalisierung** — konkrete Hooks pro ICP
7. **Email Templates für neue ICPs** — MedTech, Logistik, Franchise
8. **Domain Setup Anleitung** — Schritt-für-Schritt SPF/DKIM/DMARC/Warmup
9. **Google Sheets Sync** — Service Account Setup + Sync Agent Prompt
10. **Pricing erweitert** — 5 ICPs statt 3
11. **CSV Struktur erweitert** — 5 Ordner statt 3, `signal_source_url` Feld
12. **Dashboard erweitert** — Nischen-Vergleich auf 5 ICPs, Quellen-Performance
13. **Appendix A: Prompt Library** — Alle Prompts auf einen Blick
14. **Appendix B: Troubleshooting Guide** — DACH-spezifische Problemlösungen
15. **Vergleichsmatrix entfernt** — Redundante Tabelle am Ende Section 1 gelöscht

---

**LOS GEHT'S.**

Domain wärmt auf. 5 ICPs definiert. Quellen vorgegeben. Scoring-Matrix steht. Emails geschrieben. In 2 Wochen fliegen die ersten Emails raus.
