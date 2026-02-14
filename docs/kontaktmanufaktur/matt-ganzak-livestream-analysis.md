# Matt Ganzak Livestream Analyse — Lead Gen / Appointment Gen

**Quelle:** Leadgen_Live.m4a (~52 Min)
**Kontext:** Matt Ganzak's Membership-Community Livestream über Cold Outreach mit OpenClaw

---

## 1. Matt's Empfehlungen (aus dem Livestream)

### Architektur & Agents
| Thema | Matt's Empfehlung | Details |
|-------|-------------------|---------|
| **Model-Wahl** | Haiku für alles Heavy Lifting | ~12 Haiku-Agents parallel: Signal Scanner, Enrichment, Scraper, LinkedIn, Reviews, Data Compiler, Email Finder, Validator |
| **Eskalation** | Haiku → Sonnet → Opus | Nur wenn Agent "stuck" ist oder Qualität nicht reicht |
| **Lokale LLMs** | Ollama für Heartbeats/Fallback | Nachteil: kann CAPTCHAs nicht gut handlen |
| **Multi-Agent** | ~12 spezialisierte Haiku-Agents | Jeder Agent hat eine Aufgabe (Signal, Scrape, Enrich, Validate etc.) |
| **Alles auf einer Maschine** | Ja, ein System | Cron-basiert: jede Stunde andere Task-Blocks |

### Cold Outreach Pipeline (9 Phasen)
1. **Signal Detection** — Keywords auf LinkedIn, Blogs, Crunchbase, News APIs überwachen
2. **Signal Enrichment** — Gefundene Signals anreichern (Firma, Kontext, Größe)
3. **Web Scraping** — Decision Makers finden (Name, Titel, Firma)
4. **LinkedIn Research** — Profil-Daten pullen (Name, Job Title, Activity)
5. **Review Scraping** (optional) — Bad Reviews = Opportunity (Glassdoor, Google, Yelp)
6. **Email Discovery** — Zwei Wege (siehe Fork unten)
7. **Email Validation** — NON-NEGOTIABLE (DeBounce, ZeroBounce, NeverBounce)
8. **Cold Email Writing** — Personalisiert mit Context aus Scraping
9. **Performance Dashboard** — Signal → Deal Closed tracking

### Email Discovery Fork
| Option | Kosten | Details |
|--------|--------|---------|
| **Guessing (Matt's Favorit)** | Gratis | 36% = first.last@domain, 25% = first@domain — Agent rät + Bounce-Check |
| **Hunter.io** | $34-$349/mo | 500-10.000 Searches; Matt nutzt es nicht mehr bei Scale |
| **Apollo.io** | Varies | Alternative zu Hunter |
| **Snov.io** | Varies | Alternative zu Hunter |
| **Waterfall Agent** | Mix | Checkt Hunter → Apollo → Snov → Fallback: Guess |

### Domain & Email Setup
| Regel | Detail |
|-------|--------|
| **Max 5 Inboxes pro Domain** | Darüber → Spam-Risk steigt massiv |
| **Matt's Sweet Spot** | 3 Inboxes pro Domain |
| **Nur Top-Level Domains** | Keine Subdomains für Outreach |
| **Neue Domain pro Outreach-Vertical** | Domain verbrennt? Delete + nächste kaufen |
| **DNS** | SPF + DKIM + DMARC Pflicht |

### Email Sending
| Option | Matt's Take |
|--------|------------|
| **Instantly** | War bei 2M Emails/Monat; Warmup inkludiert; jetzt OpenClaw direkt |
| **OpenClaw direkt** | Matt's aktuelle Richtung; Warmup selbst mit OpenClaw |
| **Twilio (SMS)** | Nur mit Opt-In! US hat strenge Regeln (A2P, TCPA) |

### Cold Email Best Practices
- **Subject:** 3-5 Wörter
- **Opening:** 1 Satz, personalisiert (referenziert deren Blog/Artikel/Post)
- **Pain Point:** 1-2 Sätze
- **CTA:** Low commitment — "Antworte einfach, ob das interessant klingt"
- **KEINE Links im ersten Email** — Erst nach positiver Antwort Booking-Link senden
- **Agent managed Inbox** — Responses automatisch klassifizieren → positiv = Booking-Link senden

### Daten-Management
| Empfehlung | Warum |
|------------|-------|
| **Lokale CSVs** | Weniger Komplexität, kein API-Overhead zu Google Sheets |
| **Google Sheets nur für Client-Sharing** | Wenn Client Zugriff braucht |
| **Master List → manuell zu Google Sheets** | Erst wenn sauber + validiert |

### Folder-Struktur
```
.openclaw/
  projects/
    [project-name]/
      tasks/
        outreach/
          signal-scanner.md
          enrichment.md
          scraper.md
          master-list.csv
          ...
```

### Sonstiges
- **Brave Search API:** Pflicht-Install ($4/mo für ~20M Searches, hilft bei CAPTCHAs)
- **Memory:** In Project Files speichern, Main Memory verweist auf Project Files
- **New Session Command:** Custom Keyword das Session-History löscht aber Memory behält
- **Chrome Extension:** Für Paywalls
- **GoHighLevel:** Matt's CRM für SMS/Messaging — Agent hat KEINEN Zugriff auf seine Social Accounts
- **Matt's Scale:** War bei 2M Emails/Mo mit Instantly, will dahin zurück mit OpenClaw (aktuell ~50K)
- **Matt's Consulting:** $100K/mo für distressed Tech-Companies (200-500 Employees, Non-Tech Founders)

---

## 2. Alternativen & Tools (im Livestream erwähnt)

| Kategorie | Tool | Status/Notes |
|-----------|------|-------------|
| **Email Discovery** | Hunter.io, Apollo.io, Snov.io | Paid alternatives zum Guessing |
| **Email Validation** | DeBounce, ZeroBounce, NeverBounce, Bouncer | ~$10-15 für 5-10K Checks |
| **Email Sending** | Instantly ($97/mo Hypergrowth) | Warmup inklusive |
| **SMS** | Twilio | Nur mit Opt-In |
| **CRM** | GoHighLevel | Matt's Wahl für Messaging-Management |
| **Search** | Brave Search API | $4/mo, quasi Pflicht |
| **Models** | Gemini 2.5 (wird getestet), Grok 4.1, Ollama lokal | Matt benchmarkt Gemini gegen Haiku |
| **Dashboard** | Open Source BI (Metabase?) | Matt hat eins für ~$0.01-0.03 gebaut |
| **Booking** | Google Calendar (shared) | Für Client-Attribution |

---

## 3. Hektor's Empfehlungen für KontaktManufaktur

### Was wir übernehmen (1:1 von Matt)
- ✅ **Haiku als Workhorse** — Haben wir schon (85% Haiku laut AGENTS.md)
- ✅ **Eskalation Haiku → Sonnet → Opus** — Haben wir schon
- ✅ **Brave Search API** — Installiert
- ✅ **3 Inboxes pro Domain** — Haben wir (3 Google Workspace Accounts auf hallo-kontakt-manufaktur.de)
- ✅ **DNS Setup** — SPF, DKIM, DMARC bereits verified
- ✅ **Email Validation ist Pflicht** — DeBounce geplant
- ✅ **Lokale CSVs** — Passt zu unserem Setup
- ✅ **Project Folder Struktur** — Schon angelegt unter workspace/projects/
- ✅ **Low-Commitment CTA** — "Antworten Sie kurz" statt Booking-Link

### Was wir ANDERS machen
| Matt | Wir (KontaktManufaktur) | Warum |
|------|------------------------|-------|
| 12 separate Haiku-Agents parallel | Hektor + Sub-Agents via sessions_spawn | Weniger Overhead, gleiche Logik, einfacher zu debuggen |
| Instantly für Sending ($97/mo) | Instantly Hypergrowth trotzdem | Warmup + Deliverability ist zu kritisch für DIY am Anfang |
| Guessing für Emails | Hunter.io Free (25 Searches/mo) + Guessing Fallback | Erst Free Tier ausreizen, bei Scale dann Guessing-First |
| GoHighLevel CRM | Dashboard + CSV + später Cal.com | Kein GHL nötig für DACH B2B Appointment Setting |
| 2M Emails/Monat | Start mit 50-100/Tag, Scale nach Warmup | Wir starten gerade erst, erstmal Qualität > Quantity |
| US-fokussiert | DACH-Markt | Andere Regeln (DSGVO!), andere Kultur, andere Email-Patterns |

### Was wir NICHT machen
- ❌ **SMS Outreach** — DSGVO macht Cold SMS quasi unmöglich in DACH
- ❌ **Chrome Extension für Paywalls** — Ethisch grenzwertig, unnötig für unseren Case
- ❌ **Claude OAuth Workaround** — Gegen Anthropic TOS, Risiko nicht wert
- ❌ **Facebook/Instagram DMs** — Sofort-Ban-Risiko, nicht unser Kanal
- ❌ **LinkedIn Automation** — Erst wenn Basis-Pipeline steht, dann manuell + vorsichtig

### DACH-spezifische Anpassungen
| Thema | Anpassung |
|-------|-----------|
| **DSGVO** | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f) als Rechtsgrundlage für B2B Cold Email — aber Opt-Out muss sofort funktionieren |
| **Sprache** | Deutsche Emails, formeller Ton als US, aber nicht steif |
| **Email-Patterns DACH** | vorname.nachname@ dominiert noch stärker (~50%+) |
| **Anrede** | "Sie" im Erstkontakt, außer Startup/Tech-Szene |
| **Impressum** | Pflicht in jeder Email (Name, Adresse, Kontakt) |

### Priorisierte nächste Schritte
1. **Instantly Account einrichten + 3 Accounts connecten + Warmup starten** ← JETZT
2. **Hunter.io Free Account** für erste Email-Discovery Tests
3. **DeBounce Account** für Validation
4. **ICP definieren** — Welche DACH SaaS/B2B Verticals?
5. **Signal-Keywords definieren** — Was triggert Outreach?
6. **Erste Email-Templates** (3-4 Varianten, deutsch, personalisiert)
7. **Task-Folder Struktur aufbauen** unter workspace/projects/kontaktmanufaktur/tasks/
8. **Sub-Agent Prompts schreiben** für: Signal Scanner, Enrichment, Email Finder, Validator
9. **Cron Schedule** für automatisierte Pipeline-Steps
10. **Cal.com Booking-Link** einrichten

---

## 4. Key Takeaways

> **Matt's Kernmessage:** Die Personalisierung durch OpenClaw ist der Game Changer. Nicht das Volumen (2M Emails) macht den Unterschied, sondern dass jede Email auf einen spezifischen Kontext referenziert (Blogartikel, LinkedIn-Post, News). Das macht Open Rates von 40-45% und hohe Response Rates möglich.

> **Für uns:** Wir haben den technischen Stack schon zu 70% stehen (Domain, DNS, Google Workspace, Agent-Architektur, Dashboard). Was fehlt: Instantly + Warmup, ICP-Definition, Email-Templates, und die Sub-Agent-Prompts für die Pipeline.

> **Timeline:** 2-3 Wochen Warmup → erste Kampagne in Woche 4 (aligned mit unserem Launch-Timeline Doc).
