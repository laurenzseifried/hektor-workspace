# KONTAKTMANUFAKTUR — CUSTOMER ONBOARDING v2

**B2B Appointment Setting für den DACH-Markt**

Stand: 15. Februar 2026  
Laurenz Seifried | KontaktManufaktur

---

> **🎯 ZIEL DIESES DOKUMENTS**
>
> Operativer Onboarding-Prozess von Vertragsunterzeichnung bis laufendem Betrieb.
> Beschreibt WAS passiert, WER macht es, WANN es passiert.
> Technische Agent-Prompts → siehe Hunter Setup Template.

---

# INHALTSVERZEICHNIS

- Phase 1: Vertrag & Onboarding-Fragebogen
- Phase 2: Kunden-Briefing (Call)
- Phase 3: Domain & Infrastruktur
- Phase 4: Kampagnen-Setup & Soft Launch
- Phase 5: Go-Live & laufender Betrieb
- Phase 6: Review & Optimierung
- Offboarding
- Anhang: Checklisten

---

# GESAMTÜBERSICHT

## Zeitplan

| Phase | Dauer | Verantwortlich |
|-------|-------|----------------|
| 1: Vertrag & Fragebogen | 2-5 Tage | Laurenz + Kunde |
| 2: Kunden-Briefing (Call) | 1 Tag (30 Min Call) | Laurenz + Kunde |
| 3: Domain & Infrastruktur | 1-2 Tage Setup + 14-21 Tage Warmup | Hektor |
| 4: Kampagnen-Setup & Soft Launch | 5-10 Tage | Hunter Agent |
| 5: Go-Live & laufender Betrieb | Ongoing | Hunter Agent |
| 6: Review & Optimierung | Monatlich (30 Min Call) | Laurenz + Kunde |
| **GESAMT bis erste Emails** | **21-30 Tage** | |
| **Erste Meetings erwartbar** | **7-21 Tage nach Go-Live** | |

**KRITISCHER PFAD:** Domain-Warmup (14-21 Tage) nicht komprimierbar.

---

## Kosten & Pricing

### Kostenübersicht pro Kunde

| Position | Monatlich | Anmerkungen |
|----------|-----------|-------------|
| Outreach-Domain | €1-2 | Kunde kauft selbst (jährlich €8-12) |
| Google Workspace (3-5 Accounts) | €18-30 | Email-Infrastruktur |
| Instantly Workspace | - | Teil unseres Agency-Plans |
| Hunter.io Credits | ~€10-20 | Email-Discovery |
| DeBounce Credits | ~€5-10 | Email-Validation |
| **TOTAL pro Kunde (operativ)** | **€34-62** | |

### Pricing-Modell: Pay-per-Meeting

**KEIN Setup-Fee. KEINE Pauschale. KEINE monatlichen Fixkosten.**

**Payment:** Ausschließlich pro gebuchtem, qualifiziertem Meeting.

**Pricing:** Wird pro Kunde individuell festgelegt, basierend auf:
- Branche und Komplexität des Zielmarkts
- Durchschnittlicher Deal Value des Kunden
- Sales Cycle Länge
- **Richtwert: €200-€600 pro Meeting**

**Definition "Qualifiziertes Meeting":**
- Lead erscheint zum Termin
- Lead passt zum ICP (Größe, Branche, Rolle)
- Lead ist Entscheider oder beeinflusst Kaufentscheidung

**Rechnungsstellung:** Monatlich nachträglich, basierend auf Anzahl gebuchter qualifizierter Meetings.

**Proof of Concept:** Erste 3 Meetings gratis → dann Entscheidung über Fortsetzung.

---

# PHASE 1: VERTRAG & ONBOARDING-FRAGEBOGEN

**Dauer:** 2-5 Tage  
**Verantwortlich:** Laurenz + Kunde  
**Ziel:** Rechtssichere vertragliche Grundlage + initiales Kunden-Briefing

---

## 1.1 Hauptvertrag + AV-Vertrag

**Dokumente:**
- Dienstleistungsvertrag (siehe `dienstleistungsvertrag-template.md`)
- Auftragsverarbeitungsvertrag (siehe `av-vertrag-template.md`)

**Inhalt (Kurzversion):**
- Leistungsumfang: Lead-Research, Email-Outreach, Meeting-Buchung, Reply-Handling
- Vergütung: Pay-per-Meeting, Proof of Concept (3 Meetings gratis)
- Laufzeit: 3 Monate Mindestlaufzeit, dann monatlich kündbar (30 Tage)
- Compliance: SPF/DKIM/DMARC, Impressum, max 50 Emails/Tag GESAMT, Opt-Out <24h
- Datenschutz: Art. 28 DSGVO, Sub-Processors (Instantly, Google, Hunter, DeBounce)
- Domain: Kunde kauft Domain (wir liefern Anleitung) ODER Concierge Setup (€150 einmalig)

**Unterzeichnung:** Digital (DocuSign/PandaDoc) oder per Email/Post

---

## 1.2 Onboarding-Fragebogen versenden

**Direkt nach Vertragsunterzeichnung:**

**Email-Template:**

```
Betreff: Willkommen bei KontaktManufaktur — Ihr Onboarding-Fragebogen

Guten Tag [Ansprechpartner],

herzlich Willkommen bei KontaktManufaktur!

📅 TIMELINE BIS ERSTE EMAILS:
- Woche 1-2: Briefing, Domain-Setup, Warmup-Start
- Woche 3: ICP-Research, Email-Templates entwickeln
- Woche 4: Ihre Freigabe + Soft Launch
- Ab Woche 5: Go-Live

🎯 NÄCHSTER SCHRITT:
Bitte füllen Sie unseren Onboarding-Fragebogen aus (ca. 15-20 Min):
[LINK ZUM FRAGEBOGEN]

Deadline: [3 Tage ab heute]

Nach Eingang vereinbaren wir ein 30-minütiges Briefing-Gespräch.

Bei Fragen erreichen Sie mich jederzeit.

Beste Grüße
Laurenz Seifried
KontaktManufaktur
```

**Fragebogen:** Siehe `onboarding-fragebogen.md` (24 Fragen, 15-20 Min)

**Follow-Up:**
- Tag 2: Freundliche Erinnerung
- Tag 3: Anruf bei Unklarheiten

---

**✅ PHASE 1 ABSCHLUSS:**
- [ ] Hauptvertrag unterzeichnet
- [ ] AV-Vertrag unterzeichnet
- [ ] Onboarding-Fragebogen versendet
- [ ] Fragebogen ausgefüllt (vom Kunden)

---

# PHASE 2: KUNDEN-BRIEFING (CALL)

**Dauer:** 1 Tag (30 Min Call)  
**Verantwortlich:** Laurenz + Kunde  
**Ziel:** ICP, Value Prop, Tone of Voice verstehen + klären

---

## 2.1 Vorbereitung (intern)

**Vor dem Call (1-2 Stunden):**
- Fragebogen-Antworten durchlesen
- Kunden-Website analysieren (Positioning, Value Prop)
- LinkedIn-Profil checken (Follower, Posts, Tone)
- Top 3 Wettbewerber identifizieren (Google Search, LinkedIn)
- 20-30 Beispiel-Prospects finden (LinkedIn Sales Navigator, kostenlos via Google)

**Output:** Notion-Seite mit Notizen, erste ICP-Hypothese

---

## 2.2 Briefing-Call (30 Min)

**Agenda:**

1. **ICP-Definition bestätigen** (10 Min)
   - Branchen, Firmengröße, Region, Entscheider-Titel
   - Buying Signals klären (Was zeigt Kaufbereitschaft?)
   - No-Gos & DNC-Liste

2. **Value Prop schärfen** (5 Min)
   - Was unterscheidet Kunde von Wettbewerbern?
   - Hauptvorteil in 1 Satz
   - Typische Pain Points der Zielkunden

3. **Tone of Voice** (5 Min)
   - Du/Sie? Formell/Locker?
   - No-Go-Formulierungen?
   - Beispiel-Email zeigen (aus Fragebogen oder Website)

4. **Qualification Criteria** (5 Min)
   - Was ist ein "qualifiziertes Meeting" für den Kunden?
   - Typischer Sales Cycle?
   - Häufigste Einwände?

5. **Next Steps** (5 Min)
   - Domain-Setup (Kunde macht selbst vs. Concierge)
   - Timeline bis Go-Live
   - Wöchentliche Updates ab Warmup-Start

**Dokumentation:** Notion-Seite mit finalen ICPs, Notizen, Action Items

---

## 2.3 ICP-Definition finalisieren (intern)

**Template:**

```json
{
  "icp_id": "[kunde]_icp_1",
  "kunde": "[Firmenname]",
  "icp_name": "[Beschreibung]",
  "company_size": "X-Y Mitarbeiter",
  "industries": ["Branche 1", "Branche 2"],
  "geographic": "DACH",
  "decision_makers": ["CEO", "VP Sales"],
  "pricing": "€X/Meeting",
  "deal_value_kunde": "€X-Y",
  "NOT_THIS": ["Ausschlüsse"],
  "buying_triggers": [
    "Funding",
    "Job Posting Sales",
    "Expansion"
  ],
  "pain_points": [
    "Problem 1",
    "Problem 2"
  ],
  "qualification_criteria": [
    "Budget: Mind. €X",
    "Entscheider im Call",
    "Zeitrahmen <3 Monate"
  ],
  "dnc_companies": ["Firma A", "Firma B"],
  "dnc_industries": ["Non-Profit"]
}
```

**Speichern:** `projects/kontaktmanufaktur/clients/[kunde]/campaigns/icp-definition.json`

---

**✅ PHASE 2 ABSCHLUSS:**
- [ ] Briefing-Call durchgeführt (30 Min)
- [ ] ICP-Definition finalisiert (JSON)
- [ ] Qualification Criteria definiert
- [ ] DNC-Liste dokumentiert
- [ ] Tone of Voice dokumentiert

---

# PHASE 3: DOMAIN & INFRASTRUKTUR

**Dauer:** 1-2 Tage Setup + 14-21 Tage Warmup  
**Verantwortlich:** Hektor + Kunde  
**Ziel:** Deliverability-optimierte Email-Infrastruktur

---

## 3.1 Domain-Setup

**Verweis auf:** `domain-setup-anleitung-kunden.md`

### Option A: Kunde kauft selbst (Standard)

**Wir senden Anleitung:**
- Domain-Auswahl (Variation der Hauptdomain, z.B. `tryfirma.com`)
- Registrierung bei Cloudflare (empfohlen, €8-10/Jahr)
- Google Workspace Setup (3 Email-Adressen, €18/Monat)
- DNS-Records (SPF, DKIM, DMARC, MX)
- Zugangsdaten sicher übermitteln (Signal/WhatsApp)

**Zeitaufwand Kunde:** 45-60 Min

**Kommen Sie nicht weiter?** → Support-Hotline (Email/WhatsApp)

### Option B: Concierge Setup (€150 einmalig)

**Wir übernehmen:**
- Domain-Kauf (auf Kunde registriert)
- Google Workspace Setup
- DNS-Konfiguration
- Instantly-Integration
- Warmup-Start

**Kunde muss nur:** Firmendaten + Zahlungsmethode bereitstellen

**Domain bleibt:** Im Eigentum des Kunden (ab Tag 1)

---

## 3.2 DNS & Email-Authentifizierung

**Wird von Hektor konfiguriert** (Kunde gibt DNS-Zugang)

**Records:**
- SPF: `v=spf1 include:_spf.google.com ~all`
- DKIM: Google Workspace generiert (TXT Record)
- DMARC: `v=DMARC1; p=none; rua=mailto:[kunde-email]`
- MX: 5 Google MX-Records
- Custom Tracking: `track.[domain]` → `track.instantly.ai`

**Prüfen:** mail-tester.com (Score >8/10)

---

## 3.3 Warmup starten ⏱️ KRITISCH

**Dauer:** 14-21 Tage MINIMUM

**Instantly Auto-Warmup:**
- Ramp-up: Medium
- Reply Rate: 40% (simuliert)
- Max Emails/Day: 50 GESAMT (DACH-Limit)
- Warmup Pool: Premium

**Schedule:**

| Woche | Emails/Tag/Account | Gesamt (3-5 Accounts) |
|-------|-------------------|---------------------|
| 1 | 5-10 | 15-50 |
| 2 | 10-15 | 30-75 |
| 3+ | 10 | 30-50 TOTAL |

**Monitoring (wöchentlich):**
- Deliverability Score >85%
- Bounce Rate <2%
- Spam Complaint <0.1%
- Inbox Placement >80%

**Eskalation:** Falls Deliverability <85% nach 21 Tagen:
- Warmup pausieren
- DNS-Records prüfen (SPF/DKIM/DMARC korrekt?)
- Domain auf Blacklist? (MXToolbox)
- Falls Domain kompromittiert: Neue Domain empfehlen
- Keine Kosten für Kunde während Troubleshooting

---

**✅ PHASE 3 ABSCHLUSS:**
- [ ] Domain registriert (auf Kunde)
- [ ] Google Workspace eingerichtet (3-5 Accounts)
- [ ] DNS-Records gesetzt (SPF, DKIM, DMARC, MX, Tracking)
- [ ] mail-tester.com Score >8/10
- [ ] Instantly Workspace erstellt
- [ ] Email-Accounts zu Instantly hinzugefügt
- [ ] **Warmup gestartet (läuft 14-21 Tage)**

**PARALLEL:** Während Warmup läuft → Phase 4 starten.

---

# PHASE 4: KAMPAGNEN-SETUP & SOFT LAUNCH

**Dauer:** 5-10 Tage  
**Verantwortlich:** Hunter Agent + Laurenz  
**Ziel:** Kampagne einsatzbereit + erste Test-Emails

**WICHTIG:** Technische Details (Prompts, Signal-Quellen, Email-Templates) → siehe **Hunter Setup Template** (wird pro Kunde erstellt).

---

## 4.1 Hunter Setup Template anpassen

**Input:**
- ICP-Definition aus Phase 2
- Playbook v2 (Standard-Prompts)

**Output:** `projects/kontaktmanufaktur/clients/[kunde]/campaigns/hunter-setup.md`

**Inhalt (Kurzversion):**
1. Kunden-Kontext (ICP, Value Prop, Tone)
2. Signal Detection (Quellen, Scoring)
3. Lead Enrichment (Website/LinkedIn Research)
4. Email Discovery & Validation
5. Outreach (Email-Templates, Instantly-Setup)
6. Reply Handling (Meeting-Übergabe)
7. Reporting (KPIs)
8. Kunden-spezifische Regeln (DNC, No-Gos)

---

## 4.2 Signal-Research + Lead-Liste

**Hunter Agent erstellt:**
- 10-20 Hot Leads (Score ≥80)
- ICP-spezifische Buying Signals
- Kontakt-Emails (verified via Hunter.io + DeBounce)
- Personalisierungs-Hooks (aus LinkedIn, Website, News)

**Timeframe:** 2-3 Tage

**Output:** CSV mit 10-20 validierten Leads

---

## 4.3 Email-Templates entwickeln

**Hunter Agent erstellt:**
- 2-3 Email-Varianten (basierend auf Playbook v2 Templates)
- ICP-spezifische Personalisierung
- Tone of Voice aus Briefing
- Follow-Up (Tag 3-4)

**Beispiel-Template wird an Kunde gesendet zur Freigabe.**

**Iteration:** Max 2 Runden, dann Go.

---

## 4.4 Soft Launch (Test-Kampagne)

**Nach Email-Template-Freigabe:**

**Hunter Agent:**
- Erste 10-20 Emails an Hot Leads
- Monitoring: Opens, Replies, Bounces
- Deliverability prüfen

**Ziel-KPIs:**
- Open Rate >50%
- Bounce Rate <2%
- Reply Rate >5% (inkl. positive + negative)

**Falls KPIs nicht erreicht:**
- Subject Lines anpassen
- Email-Body kürzen
- Personalisierung verstärken
- Sendezeiten testen (9-11 Uhr vs. 14-16 Uhr)

**Max 2 Iterationen**, dann Go-Live.

---

## 4.5 Kunde informieren (Soft Launch Ergebnis)

**Email-Template:**

```
Betreff: KontaktManufaktur — Soft Launch abgeschlossen

Guten Tag [Name],

wir haben die ersten 20 Test-Emails versendet. Hier die Ergebnisse:

📊 ZAHLEN:
- Emails gesendet: 20
- Open Rate: X%
- Reply Rate: Y%
- Bounces: Z

💡 LEARNINGS:
[1-2 Sätze zu Optimierungen]

🚀 NÄCHSTE SCHRITTE:
- Go-Live ab [Datum]
- Volumen: 50 Emails/Tag
- Dashboard-Zugang folgt

Beste Grüße
Laurenz Seifried
```

---

**✅ PHASE 4 ABSCHLUSS:**
- [ ] Hunter Setup Template angepasst und deployed
- [ ] Signal-Research abgeschlossen (10-20 Hot Leads)
- [ ] Email-Templates entwickelt
- [ ] Kunde hat Templates freigegeben
- [ ] Soft Launch durchgeführt (10-20 Test-Emails)
- [ ] KPIs validiert (Open >50%, Bounce <2%)
- [ ] Iteration abgeschlossen (falls nötig)

---

# PHASE 5: GO-LIVE & LAUFENDER BETRIEB

**Verantwortlich:** Hunter Agent + Laurenz  
**Ziel:** Kontinuierliche Optimierung, Meeting-Delivery

---

## 5.1 Kampagne aktivieren

**Hunter Agent:**
- Volumen: 50 Emails/Tag (DACH-Limit, GESAMT über alle Accounts)
- Verteilung: 10-15 Emails/Account/Tag (3-5 Accounts)
- Zeitplan: Mo-Fr, 9-17 Uhr

**Monitoring:** Täglich KPIs prüfen.

---

## 5.2 Kunde informieren (Go-Live)

**Email-Template:**

```
Betreff: KontaktManufaktur — Kampagne ist live 🚀

Guten Tag [Name],

Ihre Kampagne ist ab heute live. Wir senden 50 Emails/Tag an qualifizierte Leads.

📊 DASHBOARD: [Link]

Sie sehen dort:
- Gesendete Emails, Opens, Replies
- Gebuchte Meetings
- Lead-Details

📈 ERWARTUNG: Erste Meetings innerhalb 1-3 Wochen.

📅 UPDATES: Wöchentlich freitags per Email.

Beste Grüße
Laurenz Seifried
```

---

## 5.3 Hunter Agent: Daily Operations

**Täglich:**
- Signal-Detection (neue Leads)
- Email-Versand (50/Tag)
- Inbox-Monitoring (Replies kategorisieren)
- Bounce/Spam-Tracking

**Wöchentlich:**
- Lead-Liste auffüllen (20-30 neue Leads)
- Email-Templates optimieren (A/B-Tests)
- Quellen-Performance auswerten

---

## 5.4 Reply Handling & Meeting-Übergabe

**Hunter Agent kategorisiert Replies:**

**INTERESSIERT:**
- Sofort antworten, Terminvorschlag
- Laurenz alerten
- Meeting in Kunde-Kalender buchen (Calendly/Google Cal)
- Meeting-Briefing erstellen (Personalisierungs-Hooks, Pain Points, Firma-Info)

**VIELLEICHT SPÄTER:**
- Nurture-Liste (Follow-up in 30/60 Tagen)

**NICHT INTERESSIERT:**
- Freundlich bedanken, DNC-Liste

**SPAM-BESCHWERDE:**
- DNC sofort, NICHT antworten
- Laurenz alerten (bei >3 Complaints/Woche)

---

## 5.5 Wöchentliche Updates (Freitag)

**Email-Template:**

```
Betreff: KontaktManufaktur — Wochenreport KW [X]

Guten Tag [Name],

hier Ihr Update für KW [X]:

📊 ZAHLEN:
- Emails gesendet: X
- Open Rate: Y%
- Reply Rate: Z%
- Meetings gebucht: A
- Show-Up Rate: B%

📅 NÄCHSTE WOCHE:
- X neue Leads in Pipeline
- Y Follow-Ups geplant

💡 LEARNINGS:
[1-2 Sätze zu Optimierungen]

Fragen? Melden Sie sich gerne.

Beste Grüße
Laurenz Seifried
```

---

## 5.6 Monatliche Rechnung

**Beispiel:**

```
Rechnung Februar 2026

Gebuchte qualifizierte Meetings: 8
Preis/Meeting: €350
Summe: €2.800

Meetings:
1. [Firma A] — [Datum] — [Entscheider/Titel] — [Status: erschienen]
2. [Firma B] — [Datum] — [Entscheider/Titel] — [Status: erschienen]
...
```

**Falls Kunde nach Proof of Concept (3 Meetings) nicht fortsetzt:**
- Vertrag endet automatisch (§3 Vertrag)
- Keine Kündigungsfrist nötig
- Alle Zugänge werden übergeben (Domain bleibt beim Kunden)

---

**✅ LAUFENDER BETRIEB KRITERIEN:**
- Hunter Agent sendet 50 Emails/Tag
- Replies werden <2h kategorisiert
- Meetings <2h in Kunde-Kalender
- Wöchentliche Updates pünktlich
- Dashboard aktuell

---

# PHASE 6: REVIEW & OPTIMIERUNG

**Frequenz:** Monatlich (30 Min Call)  
**Teilnehmer:** Laurenz + Kunde

---

## 6.1 Agenda

1. **Performance-Review** (10 Min)
   - Meetings gebucht vs. Ziel
   - Show-Up Rate
   - Lead-Qualität (Kunde-Feedback)

2. **ICP-Adjustments** (10 Min)
   - Funktioniert ICP?
   - Signals zu breit/eng?
   - Neue Branchen testen?

3. **Email-Optimierung** (5 Min)
   - Welche Templates performen?
   - Neue Hooks testen?

4. **Strategie-Updates** (5 Min)
   - Neue Produkte/Services?
   - Neue Zielgruppen?
   - Volumen erhöhen?

---

## 6.2 Optimierung

**Basierend auf Review:**
- Hunter Agent passt ICP an (JSON updaten)
- Neue Email-Templates entwickeln
- Quellen erweitern/reduzieren
- Volumen erhöhen (falls Deliverability >90% konstant)

**Eskalation bei schlechter Performance:**
- Falls <50% Ziel-Meetings über 2 Monate → Analyse-Call
- ICP zu eng? Zu breite Ansprache?
- Produkt-Market-Fit-Problem?
- Ggf. Kampagne pausieren + Strategie-Pivot

---

**✅ PHASE 6 ABSCHLUSS:**
- [ ] Monatlicher Call durchgeführt
- [ ] Performance dokumentiert
- [ ] Optimierungen definiert
- [ ] Hunter Setup Template geupdatet (falls nötig)

---

# OFFBOARDING

**Trigger:** Kunde kündigt (30 Tage Kündigungsfrist)  
**Dauer:** 30 Tage

---

## 1. Kampagne stoppen

**Sofort nach Kündigung:**
- Email-Versand pausieren (keine neuen Outreach-Mails)
- Laufende Kampagnen zu Ende bringen

**Bis Ende Kündigungsfrist:**
- Replies weiter bearbeiten
- Gebuchte Meetings übergeben
- Wöchentliche Updates wie gewohnt

---

## 2. Daten-Übergabe

**Innerhalb 14 Tagen:**
- Lead-Listen (CSV-Export)
- Email-Templates
- Performance-Daten (Reports)
- Alle Domain-Zugänge (Cloudflare, Google Workspace)
- Instantly Workspace Ownership (optional, falls Kunde weitermachen will)

---

## 3. Daten-Löschung

**Nach 30 Tagen (DSGVO):**
- Alle personenbezogenen Daten löschen
- Nur aggregierte Metriken behalten (anonymisiert, für interne Analysen)

---

## 4. Finale Rechnung

**Letzte gebuchte Meetings werden abgerechnet** (bis Ende Kündigungsfrist).

---

**✅ OFFBOARDING ABSCHLUSS:**
- [ ] Kampagne gestoppt
- [ ] Daten übergeben (CSV, Zugänge)
- [ ] Daten gelöscht (nach 30 Tagen)
- [ ] Finale Rechnung versendet

---

# ANHANG: CHECKLISTEN

## Onboarding-Checklist (Gesamt)

**Phase 1: Vertrag & Fragebogen**
- [ ] Hauptvertrag unterschrieben
- [ ] AV-Vertrag unterschrieben
- [ ] Onboarding-Fragebogen versendet
- [ ] Fragebogen ausgefüllt

**Phase 2: Briefing**
- [ ] Briefing-Call (30 Min)
- [ ] ICP finalisiert
- [ ] Qualification Criteria definiert

**Phase 3: Infrastruktur**
- [ ] Domain registriert (auf Kunde)
- [ ] Google Workspace (3-5 Accounts)
- [ ] DNS-Records (SPF, DKIM, DMARC, MX)
- [ ] mail-tester.com Score >8/10
- [ ] Warmup gestartet (14-21 Tage)

**Phase 4: Kampagnen-Setup & Soft Launch**
- [ ] Hunter Setup Template angepasst
- [ ] Signal-Research (10-20 Hot Leads)
- [ ] Email-Templates freigegeben
- [ ] Soft Launch (10-20 Test-Emails)
- [ ] KPIs validiert

**Phase 5: Go-Live**
- [ ] Kampagne live (50 Emails/Tag)
- [ ] Dashboard-Zugang Kunde
- [ ] Wöchentliche Updates gestartet

**Phase 6: Review**
- [ ] Monatlicher Call (30 Min)
- [ ] Optimierungen umgesetzt

---

## Domain-Setup Checklist (für Hektor)

- [ ] Domain-Auswahl (Variation Hauptdomain)
- [ ] Registrierung (auf Kunde, Cloudflare empfohlen)
- [ ] Google Workspace Account (3-5 Email-Adressen)
- [ ] SPF Record
- [ ] DKIM aktiviert
- [ ] DMARC Record
- [ ] MX Records (5 Google MX)
- [ ] Custom Tracking Domain
- [ ] mail-tester.com >8/10
- [ ] Instantly Workspace erstellt
- [ ] Email-Accounts zu Instantly hinzugefügt
- [ ] Warmup aktiviert
- [ ] Warmup-Monitoring (wöchentlich, Deliverability >85%)

---

## Go-Live Checklist (für Hunter)

- [ ] ICP-Definition deployed
- [ ] Signal-Quellen konfiguriert
- [ ] Email-Templates deployed
- [ ] Lead-Liste ≥20 Leads
- [ ] Alle Emails validiert (DeBounce)
- [ ] DNC-Liste aktuell
- [ ] Instantly Kampagne konfiguriert (50/Tag GESAMT)
- [ ] Inbox-Monitoring aktiv
- [ ] Dashboard live
- [ ] Kunde informiert (Go-Live Email)

---

**END OF DOCUMENT**
