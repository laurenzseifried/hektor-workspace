# KONTAKTMANUFAKTUR — COLD OUTREACH PLAYBOOK

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

1. Unsere 3 ICPs — Wen wir targeten
2. Signal Detection — Buying Signals pro ICP
3. Data Scraping — Multi-Agent Pipeline
4. Email Discovery — Hunter.io + Guessing
5. Email Validation — DeBounce
6. Domain & Infrastruktur — Instantly Setup
7. Cold Emails — Templates pro ICP
8. Inbox Management — Reply Handling
9. Datenmanagement — CSV Workflow
10. Performance Dashboard
11. Der "Erste 3 Meetings gratis" Pitch
12. Pricing Matrix

---

# 1. UNSERE 3 ICPs

Wir testen parallel 3 Nischen und verdoppeln auf die, die am besten konvertiert.

## ICP 1: B2B Coaches & Unternehmensberater ⭐⭐⭐⭐⭐

```json
{
  "icp": "coaches_berater",
  "company_size": "1-10 Mitarbeiter",
  "industries": ["Business Coaching", "Unternehmensberatung", "Managementberatung", "Leadership Coaching"],
  "revenue": "€100K-€2M Jahresumsatz",
  "geographic": "Deutschland",
  "decision_makers": ["Inhaber", "Geschäftsführer"],
  "pricing": "€300-€500/Meeting",
  "buying_triggers": [
    "LinkedIn-Posts über 'suche Klienten' oder 'freie Plätze'",
    "Website mit 'Kostenloses Erstgespräch' aber kein Funnel",
    "Content/Podcast vorhanden aber keine Lead-Gen-Strategie",
    "Webinare ohne Follow-up-Strategie",
    "Testimonials vorhanden aber keine aktive Outreach"
  ],
  "pain_points": [
    "Ständig selber verkaufen müssen statt coachen",
    "10 Discovery Calls für 1 zahlenden Kunden",
    "Feast-or-Famine: Nach Projektende Pipeline leer",
    "Empfehlungen nicht skalierbar"
  ]
}
```

## ICP 2: SaaS Startups (Seed–Series A) ⭐⭐⭐⭐⭐

```json
{
  "icp": "saas_startups",
  "company_size": "5-50 Mitarbeiter",
  "industries": ["SaaS", "B2B Software", "Tech Startups"],
  "revenue": "€200K-€5M ARR",
  "geographic": "Deutschland (DACH)",
  "decision_makers": ["Founder/CEO", "Co-Founder", "VP Sales", "Head of Growth"],
  "pricing": "€250-€400/Meeting",
  "buying_triggers": [
    "Fundraising-Runde in letzten 6 Monaten (Crunchbase, LinkedIn, News)",
    "Job-Posting: 'First Sales Rep' oder 'SDR'",
    "Founder postet über 'looking for beta customers'",
    "0-2 SDRs auf LinkedIn sichtbar",
    "Product-Led Growth aber kein Outbound erkennbar"
  ],
  "pain_points": [
    "Technical Founder, null Sales-Erfahrung",
    "Nach Funding: schnell Traction zeigen (Investor-Druck)",
    "Paid Ads zu teuer, organisch zu langsam",
    "Kein Sales-Prozess, Founder macht alles selbst"
  ]
}
```

## ICP 3: Marketing/Design/IT-Agenturen ⭐⭐⭐⭐

```json
{
  "icp": "agenturen",
  "company_size": "3-30 Mitarbeiter",
  "industries": ["Digitalagentur", "Marketingagentur", "Designagentur", "IT-Dienstleister", "Webagentur"],
  "revenue": "€200K-€5M Jahresumsatz",
  "geographic": "Deutschland",
  "decision_makers": ["Geschäftsführer", "Founder", "Managing Partner", "Head of New Business"],
  "pricing": "€200-€350/Meeting",
  "buying_triggers": [
    "Posts über 'freie Kapazitäten' oder 'suche Projektpartner'",
    "Job-Posting für 'New Business Manager'",
    "Case Studies älter als 12 Monate",
    "Keine Lead-Magneten auf der Website",
    "Nur Referral-basiertes Geschäft erkennbar"
  ],
  "pain_points": [
    "Feast-or-Famine Projektgeschäft",
    "Founder gefangen in Akquise statt strategischer Arbeit",
    "Empfehlungen funktionieren aber skalieren nicht",
    "Ohne Pipeline: müssen jeden Kunden nehmen (auch schlechte Deals)"
  ]
}
```

---

# 2. SIGNAL DETECTION

## Signal Scanner pro ICP

**PROMPT: Signal Scanner — Coaches & Berater**

```
Du bist ein Signal Detection Agent für KontaktManufaktur.
Scanne das Internet nach Buying Signals für B2B Coaches und Unternehmensberater in Deutschland.

## ICP: B2B Coaches & Berater
- Solo-Selbstständige oder kleine Teams (1-10 MA)
- Business Coaching, Managementberatung, Leadership, Vertriebscoaching
- Deutschland

## QUELLEN:
1. LinkedIn: Posts mit "suche Klienten", "freie Plätze", "Discovery Call", "Erstgespräch buchen"
2. Google: "[coaching nische] coach deutschland" + Website-Analyse (Funnel vorhanden?)
3. Podcast-Verzeichnisse: Coaches mit Podcast aber ohne Lead-Funnel
4. XING: Profil-Suche "Business Coach" + "Unternehmensberater"
5. Coaching-Verzeichnisse: coach-datenbank.de, coaching-magazin.de

## FÜR JEDES SIGNAL:
- company_name, website, coach_name
- signal_type, signal_source (URL)
- signal_description (2-3 Sätze)
- signal_strength (hot|warm|cold)
- coaching_nische, location
- personalization_hooks (3-5 spezifische Punkte)

## OUTPUT: JSON, sortiert nach signal_strength. Ziel: 15-30 pro Scan.
```

**PROMPT: Signal Scanner — SaaS Startups**

```
Du bist ein Signal Detection Agent für KontaktManufaktur.
Scanne das Internet nach Buying Signals für SaaS Startups (Seed-Series A) in Deutschland/DACH.

## ICP: SaaS Startups
- 5-50 Mitarbeiter, Seed bis Series A
- B2B SaaS, Software Startups
- Deutschland/DACH

## QUELLEN:
1. Crunchbase: Funding Rounds letzte 6 Monate, Germany/DACH Filter
2. LinkedIn: "We just raised", "Hiring: Sales/SDR/BDR", Founder-Posts über Wachstum
3. Deutsche Startup-News: deutsche-startups.de, gruenderszene.de, t3n.de
4. Indeed/LinkedIn Jobs: "SDR", "BDR", "Sales Development" + Startup-Name
5. ProductHunt: Deutsche/DACH Launches

## FÜR JEDES SIGNAL:
- company_name, website, founder_name
- signal_type, signal_source (URL)
- funding_stage, funding_amount
- signal_strength (hot|warm|cold)
- product_description, team_size
- personalization_hooks (3-5 spezifische Punkte)

## OUTPUT: JSON, sortiert nach signal_strength. Ziel: 10-20 pro Scan.
```

**PROMPT: Signal Scanner — Agenturen**

```
Du bist ein Signal Detection Agent für KontaktManufaktur.
Scanne das Internet nach Buying Signals für Marketing/Design/IT-Agenturen in Deutschland.

## ICP: Agenturen
- 3-30 Mitarbeiter
- Digital-, Marketing-, Design-, IT-Agenturen, Webagenturen
- Deutschland

## QUELLEN:
1. LinkedIn: Agentur-Founder Posts über "Projektakquise", "freie Kapazitäten", "suche Partner"
2. Sortlist.de, Clutch.co, OMR Reviews: Agentur-Profile analysieren
3. Indeed/StepStone: "New Business Manager" + Agenturname
4. Google: "[typ] agentur [stadt]" + Website-Analyse
5. Branchenverzeichnisse: bvdw.org Mitgliederliste, GWA Mitglieder

## FÜR JEDES SIGNAL:
- agency_name, website, founder_name
- signal_type, signal_source (URL)
- agency_type, team_size_estimate
- signal_strength (hot|warm|cold)
- services, location
- personalization_hooks (3-5 spezifische Punkte)

## OUTPUT: JSON, sortiert nach signal_strength. Ziel: 15-30 pro Scan.
```

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

## SCORING:
8-10 = Aktiver Pain (sucht gerade Kunden, hat gepostet, stellt ein)
5-7 = Wachstumsmodus (Funding, neue Projekte, expandiert)
1-4 = Allgemeiner Fit (passt zum ICP, aber kein akuter Trigger)

## OUTPUT: Angereichertes JSON, sortiert nach urgency_score.
```

---

# 3. DATA SCRAPING — MULTI-AGENT PIPELINE

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
1. Signal-Liste aus Phase 2 empfangen
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
- email_pattern_guess (wird in Phase 4 validiert)

## ZIEL: 1-2 Entscheider pro Firma. Bei Solo-Selbstständigen: nur den Inhaber.
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

## CSV SCHEMA:
lead_id, icp_type, date_detected, signal_type, signal_strength,
company_name, website, branche, standort, team_size,
kontakt_name, kontakt_titel, kontakt_email, kontakt_email_verified,
kontakt_linkedin, kontakt_xing,
content_hook (bester Personalisierungs-Aufhänger),
pain_point_evidence, personalization_brief,
lead_score (1-100), pipeline_stage, notes

## SCORING (lead_score):
- Signal Strength: 40%
- Data Completeness: 20%
- ICP Fit: 20%
- Urgency: 20%

## OUTPUT: CSV nach projects/kontaktmanufaktur/tasks/outreach/[icp]/leads.csv
Separate CSV pro ICP (coaches.csv, saas.csv, agenturen.csv)
```

---

# 4. EMAIL DISCOVERY

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

# 5. EMAIL VALIDATION

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

# 6. DOMAIN & INFRASTRUKTUR

## Instantly Setup (bereits aktiv)

- **Outreach Domain:** [deine Domain]
- **Email Accounts:** 3 Adressen, aktuell im Warmup
- **Zeitplan:**
  - Jetzt: Warmup läuft (Instantly automatisch)
  - In 2 Wochen: Start mit 30 Emails/Tag/Adresse (= 90 gesamt, wir cappen bei 50 gesamt)
  - 2 Wochen danach: Rauf auf 50/Tag gesamt

> **⚠️ DACH-Limit:** Wir senden max 50 Emails/Tag gesamt über alle Adressen. Nicht 50 pro Adresse. Das hält uns im "persönliche Email"-Bereich.

## DNS Check (vor Go-Live)

Prüfe dass alles steht:
- [ ] SPF Record korrekt
- [ ] DKIM aktiv
- [ ] DMARC gesetzt
- [ ] Custom Tracking Domain
- [ ] Warmup mind. 14 Tage

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

# 7. COLD EMAILS — TEMPLATES PRO ICP

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

### ICP 1: Coaches & Berater

**PROMPT: Email Writer — Coaches**

```
Du schreibst personalisierte Cold Emails für KontaktManufaktur an B2B Coaches und Berater.

## KONTEXT:
Wir bieten Appointment Setting: Wir liefern qualifizierte Discovery Calls mit
potenziellen Klienten. Der Coach/Berater muss nicht mehr selbst akquirieren.

## REGELN:
1. Unter 120 Wörter
2. Deutsch, Sie-Form, professionell aber menschlich
3. Kein Link, kein Attachment
4. Spezifische Referenz auf deren Content/Situation
5. Pain: "Zeit mit Akquise statt Coaching verbringen"
6. Value: "Qualifizierte Discovery Calls ohne eigenen Aufwand"
7. CTA: Soft, low-commitment

## SIGNATUR:
Laurenz Seifried
KontaktManufaktur
Auf dem Horn 12 | 38315 Hornburg

## INPUT: {kontakt_name, firma, content_hook, pain_point_evidence, personalization_hooks}
```

**Template-Beispiel: Coach mit LinkedIn-Content**

> Betreff: Ihr Beitrag über Führungskräfte-Entwicklung
>
> Guten Tag Herr/Frau [Name],
>
> Ihr LinkedIn-Beitrag vom [Datum] über [Thema] hat mich angesprochen — besonders der Punkt zu [spezifisches Detail].
>
> Ich arbeite mit Coaches und Beratern zusammen, die ihr Fachwissen lieber in Klienten investieren als in die Akquise. Wir übernehmen die Ansprache und liefern qualifizierte Discovery Calls mit Entscheidern, die aktiv nach genau Ihrer Expertise suchen.
>
> Hätten Sie Interesse an einem kurzen Austausch, ob das für Sie relevant sein könnte?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Follow-Up (Tag 3-4):**

> Betreff: Re: Ihr Beitrag über Führungskräfte-Entwicklung
>
> Guten Tag Herr/Frau [Name],
>
> kurze Nachfrage zu meiner letzten Nachricht. Ich weiß, der Posteingang ist voll.
>
> Ein Berater aus [ähnliche Nische] hat durch unsere Zusammenarbeit seinen Akquise-Aufwand um [X] Stunden pro Woche reduziert — und verbringt die Zeit jetzt mit zahlenden Klienten.
>
> Falls das Thema für Sie gerade nicht passt, kein Problem. Ich wollte nur sichergehen, dass die Nachricht angekommen ist.
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

**Danach: DNC. Kein dritter Follow-Up.**

---

### ICP 2: SaaS Startups

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

### ICP 3: Agenturen

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

**Template-Beispiel: Agentur mit Kapazitäts-Signal**

> Betreff: Ihre Arbeiten für [Kundenname/Branche]
>
> Guten Tag Herr/Frau [Name],
>
> ich bin auf [Agenturname] gestoßen und war beeindruckt von Ihrem [spezifisches Projekt/Case Study]. Besonders [konkretes Detail] hat mich überzeugt.
>
> Ich arbeite mit Agenturen zusammen, die hervorragende Arbeit leisten, aber deren Gründer zu viel Zeit mit Projektakquise statt mit strategischer Arbeit verbringen. Wir übernehmen die Ansprache und liefern qualifizierte Projekt-Anfragen von Unternehmen, die genau Ihre Expertise suchen.
>
> Wäre ein kurzer Austausch interessant?
>
> Beste Grüße
> Laurenz Seifried
> KontaktManufaktur
> Auf dem Horn 12 | 38315 Hornburg

---

# 8. INBOX MANAGEMENT

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

# 9. DATENMANAGEMENT

## CSV Struktur

```
Ordner: projects/kontaktmanufaktur/tasks/outreach/
├── coaches/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── saas/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── agenturen/
│   ├── signals.csv
│   ├── leads.csv
│   └── campaigns.csv
├── master_dnc.csv      (globale Do-Not-Contact Liste)
└── daily_reports/
    └── report_YYYY-MM-DD.csv
```

## Master CSV Schema

```
lead_id, icp_type, date_detected, signal_type, signal_strength,
company_name, website, branche, standort, team_size,
kontakt_name, kontakt_titel, kontakt_email, email_verified,
kontakt_linkedin,
content_hook, pain_point_evidence, personalization_brief,
lead_score, pipeline_stage,
email_1_sent, email_1_date, email_1_opened,
email_2_sent, email_2_date, email_2_opened,
reply_received, reply_date, reply_sentiment,
meeting_booked, meeting_date, meeting_status,
deal_value, notes
```

---

# 10. PERFORMANCE DASHBOARD

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

## Nischen-Vergleich tracken

| Metrik | Coaches | SaaS | Agenturen |
|:---|:---|:---|:---|
| Emails gesendet | | | |
| Reply Rate | | | |
| Meetings gebucht | | | |
| Show-Up Rate | | | |
| → Verdoppeln auf | | | |

**Nach 2 Wochen:** Die Nische mit der besten Reply Rate + Meeting Rate bekommt 70% des Volumens.

**PROMPT: Dashboard Agent**

```
Kompiliere tägliche Metriken für KontaktManufaktur.

## DATENQUELLEN:
- coaches/leads.csv, saas/leads.csv, agenturen/leads.csv
- campaigns.csv pro ICP
- master_dnc.csv

## TÄGLICHER REPORT:
1. PIPELINE: Neue Signals, Leads, Validierte heute pro ICP
2. OUTREACH: Gesendet, Opens, Replies, Bounces (gesamt + pro ICP)
3. MEETINGS: Gebucht diese Woche, Show-Up Rate
4. NISCHEN-VERGLEICH: Reply Rate + Meeting Rate pro ICP
5. KOSTEN: Hunter.io Credits, DeBounce Credits, Instantly, Tageskosten
6. ACTION ITEMS: Hot Leads, underperformende ICP, technische Issues

OUTPUT: daily_reports/report_YYYY-MM-DD.csv
```

---

# 11. DER "ERSTE 3 MEETINGS GRATIS" PITCH

## Strategie

Wir haben keine Case Studies → wir bauen sie selbst. Die ersten Kunden bekommen 3 Meetings kostenlos als Proof of Concept.

## Wie es in der Email eingebaut wird

**Nicht** im ersten Email erwähnen. Erst wenn jemand interessiert ist und wir im Gespräch sind:

> "Ich schlage Folgendes vor: Wir liefern Ihnen die ersten 3 qualifizierten Meetings kostenlos. Sie sehen die Qualität, wir beweisen was wir können. Danach entscheiden Sie, ob Sie weitermachen möchten."

## Nach den 3 Gratis-Meetings

- Meeting dokumentieren (Firma, Titel, Ergebnis)
- Feedback vom Kunden holen (schriftlich, für Testimonial)
- Case Study aufbauen: "[Coach X] hat durch KontaktManufaktur [Y] Discovery Calls in [Z] Wochen bekommen"
- Übergang zu Paid: "Ab jetzt €[Preis]/Meeting. Sollen wir weitermachen?"

---

# 12. PRICING MATRIX

| ICP | Preis/Meeting | Begründung |
|:---|:---|:---|
| Coaches & Berater | €300-€500 | LTV €5K-€100K+, hohe Stundensätze, höchste Zahlungsbereitschaft |
| SaaS Startups | €250-€400 | LTV €5K-€50K+, Post-Funding Budget, LTV/CAC Ratio 3:1 |
| Agenturen | €200-€350 | LTV €5K-€50K Projekt, engere Budgets, aber hoher Pain |

## Pricing-Gespräch

> "Unser Pricing basiert auf dem Wert eines Meetings für Sie. Bei einem durchschnittlichen Kunden-Lifetime-Value von [X] und einer üblichen Abschlussquote von [Y]% ist ein qualifiziertes Meeting für Sie [Z] wert. Wir nehmen [Preis] pro gebuchtem Meeting — Sie zahlen nur für Ergebnisse, nicht für Aufwand."

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

**Break-Even:** 1 Meeting verkauft (€200-500) = Monatskosten gedeckt.
**Ziel:** 10-15 Meetings/Monat = **€2.000-€7.500/Mo Revenue** bei €165-215 Kosten.

---

**LOS GEHT'S.**

Domain wärmt auf. ICPs definiert. Emails geschrieben. In 2 Wochen fliegen die ersten Emails raus.
