# KONTAKTMANUFAKTUR — CUSTOMER ONBOARDING PLAYBOOK v1

**B2B Appointment Setting für den DACH-Markt**  
Vollständiger Onboarding-Prozess für Neukunden

Stand: 15. Februar 2026  
Laurenz Seifried | KontaktManufaktur

---

> **🎯 ZIEL DIESES DOKUMENTS**
>
> Vollständiges, operativ nutzbares Onboarding-Framework von Vertragsunterzeichnung bis laufendem Betrieb.
> Basis: Best Practices internationaler Agencies + DACH-spezifische Compliance.

---

# INHALTSVERZEICHNIS

**HAUPTPHASEN:**
- Phase 0: Pre-Onboarding (Sales → Ops Handoff)
- Phase 1: Vertrag & Rechtliches
- Phase 2: Kunden-Briefing
- Phase 3: Domain & Infrastruktur Setup
- Phase 4: ICP & Signal-Konfiguration
- Phase 5: Email-Entwicklung
- Phase 6: Soft Launch & Testing
- Phase 7: Go-Live & Monitoring
- Phase 8: Übergabe & laufender Betrieb
- Phase 9: Performance Review & Optimization
- Phase 10: Escalation Management
- Phase 11: Offboarding

**ANHÄNGE:**
- Anhang A: Rechtliche Grundlagen DACH
- Anhang B: Checklisten pro Phase
- Anhang C: Template-Bibliothek
- Anhang D: Troubleshooting Guide

---

# GESAMTÜBERSICHT

## Zeitplan

| Phase | Dauer | Verantwortlich | Automatisierbar? |
|-------|-------|----------------|------------------|
| 0: Pre-Onboarding | 1-2 Tage | Sales + Ops Lead | 🟡 50% |
| 1: Vertrag & Rechtliches | 2-5 Tage | Laurenz + Anwalt | 🟡 30% |
| 2: Kunden-Briefing | 1-3 Tage | Kunde + Ops | 🟢 70% |
| 3: Domain & Infrastruktur | 1-2 Tage + 14-21 Tage Warmup | Ops/Tech | 🟢 90% |
| 4: ICP & Signal-Config | 2-4 Tage | Research Team | 🟡 40% |
| 5: Email-Entwicklung | 3-5 Tage | Copywriter + Kunde | 🔴 20% |
| 6: Soft Launch & Testing | 3-7 Tage | Ops + Tech | 🟡 60% |
| 7: Go-Live | Tag 1 | Ops | 🟢 80% |
| 8: Übergabe & Betrieb | Laufend | Account Manager | 🟢 70% |
| **GESAMT bis erste Emails** | **21-30 Tage** | | |
| **Erste Meetings erwartbar** | **7-21 Tage nach Go-Live** | | |

**KRITISCHER PFAD:** Domain-Warmup (14-21 Tage) ist der längste nicht-komprimierbare Schritt.

---

## Kostenübersicht pro Kunde

| Position | Einmalig | Monatlich | Anmerkungen |
|----------|----------|-----------|-------------|
| **Setup-Fee (an Kunde)** | €1.000-€3.000 | - | Deckt Onboarding-Aufwand |
| Outreach-Domain | €8-12 | - | Auf Kunde registriert, wir managen |
| Google Workspace (3-5 Accounts) | - | €18-30 | Email-Infrastruktur |
| Instantly Workspace | - | Teil des Agency-Plans | Pro Kunde separater Workspace |
| Mailforge/DNS-Tools | - | €10-20 | Optional: Auto-DNS |
| Hunter.io Credits | - | ~€10-20 | Email-Discovery |
| DeBounce Credits | - | ~€5-10 | Email-Validation |
| **TOTAL pro Kunde** | €1.008-€3.012 | €43-80 | |

**EMPFEHLUNG:** Setup-Fee von €1.500-€2.000 für Onboarding + erste Kampagne.

---

# PHASE 0: PRE-ONBOARDING (Sales → Ops Handoff)

**Dauer:** 1-2 Tage  
**Verantwortlich:** Sales Lead + Operations Lead  
**Ziel:** Saubere Übergabe vom Vertrieb an die Umsetzung, realistische Erwartungen setzen

---

## 0.1 Sales-to-Delivery Handoff

**Trigger:** Vertrag unterschrieben, Anzahlung eingegangen

### Handoff-Meeting (30 Min, intern)

**Teilnehmer:** Sales Rep + Ops Lead + Account Manager

**Agenda:**
1. **Was wurde versprochen?**
   - Anzahl Meetings/Monat
   - ICP-Definition
   - Pricing-Modell (€/Meeting oder Pauschal?)
   - Timeline-Versprechen
   - Spezielle Anforderungen

2. **Was ist realistisch?**
   - Abgleich Versprechen vs. Machbarkeit
   - ICP-Fit (haben wir Erfahrung mit dieser Nische?)
   - Signal-Verfügbarkeit (gibt es frische Leads in diesem ICP?)
   - Deliverability-Risiko (schwierige Branche?)

3. **Red Flags identifizieren**
   - Unrealistische Erwartungen ("100 Meetings im ersten Monat")
   - Zu breiter ICP ("alle B2B-Firmen in DACH")
   - Rechtliche Grauzone (Branchen mit hohem Abmahn-Risiko)
   - Budget zu niedrig für versprochene KPIs

**ENTSCHEIDUNG NÖTIG:** Falls Red Flags → sofort mit Kunde Nachverhandlung oder Klarstellung.

---

## 0.2 Erwartungsmanagement beim Kunden

**Innerhalb 24h nach Vertragsunterzeichnung:** Kick-off Email an Kunden

### Email-Template: Willkommen & Timeline

```
Betreff: Willkommen bei KontaktManufaktur — Ihre nächsten Schritte

Guten Tag [Ansprechpartner],

herzlich Willkommen bei KontaktManufaktur! Wir freuen uns auf die Zusammenarbeit.

Damit Sie genau wissen, was Sie in den nächsten Wochen erwartet, hier der Ablauf:

📅 TIMELINE BIS ERSTE EMAILS:
- Woche 1-2: Briefing, Domain-Setup, Warmup-Start
- Woche 3: ICP-Research, Email-Templates entwickeln
- Woche 4: Ihre Freigabe + Soft Launch (erste Test-Emails)
- Ab Woche 5: Vollständiger Go-Live

➡️ ERSTE QUALIFIZIERTE MEETINGS: Erfahrungsgemäß 1-3 Wochen nach Go-Live

🎯 WAS WIR VON IHNEN BRAUCHEN:
1. Ausfüllen des Briefing-Fragebogens (Link folgt heute)
2. Domain-Zugang (wir kümmern uns um alles, brauchen nur kurzen Zugriff)
3. Freigabe der Email-Templates (ca. Woche 3)

⏱️ ZEITAUFWAND FÜR SIE:
- Fragebogen ausfüllen: ~30 Minuten
- Template-Review: ~15 Minuten
- Wöchentliche Updates: ~5 Minuten

📞 IHR ANSPRECHPARTNER:
[Account Manager Name]
[Email & Telefon]

Haben Sie Fragen? Melden Sie sich jederzeit.

Beste Grüße
Laurenz Seifried
KontaktManufaktur
```

---

## 0.3 Stakeholder Mapping (intern)

**Dokumentieren im CRM/Notion:**

```
KUNDE: [Firmenname]
BRANCHE: [X]
ICP: [Primärer ICP]

STAKEHOLDER:
1. Decision Maker: [Name, Rolle, Email, Telefon]
   - Erwartet: [Monatliche Reports? Weekly Calls?]
   - Involviert in: [Freigaben, Strategie-Calls]

2. Operativer Kontakt: [Name, Rolle]
   - Täglicher Ansprechpartner für: [Meeting-Übergaben, Listen-Feedback]

3. Weitere Beteiligte: [z.B. Marketing-Lead für Brand Voice]

KOMMUNIKATIONS-PRÄFERENZEN:
- Reporting-Frequenz: [Wöchentlich/Monatlich]
- Kanal: [Email/Slack/Call]
- Eskalations-Schwelle: [Ab wann informieren bei Problemen?]

SUCCESS CRITERIA (was ist "Erfolg" für diesen Kunden?):
- Quantitativ: [X Meetings/Monat, Y% Show-Up-Rate]
- Qualitativ: [Lead-Qualität, bestimmte Firmengröße/Titel]

RED FLAGS:
- [z.B. "Kunde erwartet Meetings innerhalb 1 Woche — unrealistisch"]
```

---

## 0.4 Projekt-Setup (intern)

**Ordnerstruktur anlegen:**

```
projects/kontaktmanufaktur/clients/[kundenname]/
├── briefing/
│   ├── onboarding-questionnaire-responses.json
│   ├── competitive-research.md
│   └── value-prop-analysis.md
├── infrastructure/
│   ├── domain-config.md
│   ├── dns-records.txt
│   └── email-accounts.csv
├── campaigns/
│   ├── icp-definition.json
│   ├── email-templates-v1.md
│   ├── signal-sources.md
│   └── leads.csv
├── reporting/
│   ├── weekly-reports/
│   └── monthly-deep-dives/
└── meetings/
    └── handoff-docs/
```

**CRM/Notion Setup:**
- Kunden-Projekt anlegen
- Account Manager zuweisen
- Onboarding-Checklist aktivieren (siehe Anhang B)

---

**✅ PHASE 0 ABSCHLUSS-KRITERIEN:**
- [ ] Handoff-Meeting durchgeführt, Notizen dokumentiert
- [ ] Kick-off Email an Kunde versendet
- [ ] Stakeholder gemappt, Success Criteria definiert
- [ ] Projekt-Struktur angelegt
- [ ] Account Manager assigned

**NEXT STEP:** Phase 1 starten (Vertragliche Details finalisieren, wenn noch offen)

---

# PHASE 1: VERTRAG & RECHTLICHES

**Dauer:** 2-5 Tage (abhängig von Verhandlung & Anwalt-Review)  
**Verantwortlich:** Laurenz + ggf. Rechtsanwalt  
**Ziel:** Rechtssichere vertragliche Grundlage für DACH-Markt

---

## 1.1 Hauptvertrag (Dienstleistungsvertrag)

### Essentials für DACH B2B Appointment Setting

**Muss-Inhalte:**

#### § 1 Vertragsparteien & Gegenstand
```
Auftragnehmer: KontaktManufaktur (Laurenz Seifried)
Auftraggeber: [Kundenname, Adresse, USt-ID]

Gegenstand: B2B Appointment Setting Service
- Leadgenerierung via personalisierte Email-Outreach
- Qualifizierte Terminvereinbarung mit potenziellen Kunden des Auftraggebers
- Meeting-Übergabe an Sales-Team des Auftraggebers

NICHT enthalten:
- Deal Closing
- CRM-Management (außer anders vereinbart)
- Paid Ads oder andere Kanäle (außer separat beauftragt)
```

#### § 2 Leistungsumfang

**Option A: Best-Effort-Modell (EMPFEHLUNG für Start)**
```
KontaktManufaktur verpflichtet sich nach bestem Wissen und Gewissen:
- ICP-konforme Lead-Research durchzuführen
- Personalisierte Email-Sequenzen zu entwickeln und zu versenden
- Qualifizierte Meetings zu vereinbaren

Zielvolumen: [X] qualifizierte Meetings pro Monat
Definition "qualifiziertes Meeting":
  - Entscheider mit relevantem Budget
  - Aktueller Bedarf oder konkretes Interesse am Produkt/Service
  - Termin im Kalender bestätigt

WICHTIG: Es handelt sich um eine Dienstleistung, nicht um eine Erfolgsgarantie.
Performance hängt ab von: Marktbedingungen, ICP-Qualität, Produkt-Market-Fit.
```

**Option B: Performance-basiert (nur für Fortgeschrittene)**
```
Vergütung nach gebuchten Meetings (siehe § 3).
Minimum-Garantie: [X] Meetings in den ersten 3 Monaten oder Geld zurück (50%).
```

**EMPFEHLUNG:** Für neue Kunden Option A. Performance-Modell erst wenn Proof of Concept steht.

#### § 3 Vergütung

**Variante 1: Pauschal + Setup-Fee (STANDARD)**
```
Setup-Fee: €1.500 einmalig (fällig bei Vertragsunterzeichnung)
  Deckt: Domain-Setup, ICP-Research, Email-Entwicklung, Warmup

Monatliche Pauschale: €2.500-€6.000 (ICP-abhängig)
  Beinhaltet: Bis zu [X] Meetings/Monat, laufendes Monitoring, wöchentliche Reports

Zahlungsweise: Monatlich im Voraus, Fälligkeit jeweils am 1. des Monats
```

**Variante 2: Pay-per-Meeting (nur für erfahrene ICPs)**
```
€250-€600 pro gebuchtem, qualifiziertem Meeting (ICP-abhängig)
Definition siehe § 2

Abrechnung: Monatlich nachträglich
Mindestabnahme: [X] Meetings in 3 Monaten oder Pauschale €[Y]
```

**Pricing-Matrix (intern):**
- MedTech/HealthTech: €400-€600/Meeting oder €4.000-€6.000 Pauschale
- B2B SaaS: €250-€400/Meeting oder €2.500-€4.000 Pauschale
- Logistik/SupplyChain: €300-€450/Meeting oder €3.000-€5.000 Pauschale
- Agenturen: €200-€350/Meeting oder €2.000-€3.500 Pauschale
- Franchise: €350-€500/Meeting oder €3.500-€5.500 Pauschale

**"3 Meetings Gratis"-Variante (für Case Studies):**
```
Pilotphase: Erste 3 qualifizierte Meetings kostenfrei (nur Setup-Fee €500)
Nach Pilotphase: Entscheidung über Fortsetzung zu [Preis/Monat]
```

#### § 4 Laufzeit & Kündigung
```
Mindestlaufzeit: 3 Monate (ab Go-Live)
Begründung: Outbound-Kampagnen brauchen 60-90 Tage für Optimierung

Verlängerung: Automatisch um jeweils 1 Monat, sofern nicht gekündigt

Kündigungsfrist: 30 Tage zum Monatsende

Sonderkündigungsrecht:
  - Bei < 50% der Ziel-Meetings über 2 aufeinanderfolgende Monate
    (nach Ablauf von 90 Tagen ab Go-Live)
  - Bei schwerwiegenden Vertragsverletzungen
```

#### § 5 Haftung & Freistellung ⚠️ KRITISCH FÜR DACH

```
§ 5.1 Haftungsausschluss Spam/Abmahnungen

Der Auftraggeber stellt den Auftragnehmer von sämtlichen Ansprüchen Dritter frei,
die aus der Email-Kontaktaufnahme im Rahmen dieses Vertrags resultieren.

Der Auftraggeber bestätigt:
a) Die Kontaktaufnahme erfolgt im berechtigten geschäftlichen Interesse
b) Er trägt das Risiko von Spam-Beschwerden, Abmahnungen und rechtlichen Schritten
c) Er ist sich der rechtlichen Grauzone von Cold Email in Deutschland bewusst

§ 5.2 Compliance-Verpflichtungen des Auftragnehmers

Der Auftragnehmer verpflichtet sich:
a) Best Practices für Email-Deliverability einzuhalten (SPF, DKIM, DMARC)
b) Kein Spam-Wording, keine irreführenden Betreffzeilen
c) Vollständiges Impressum in jeder Email
d) Opt-Out-Anfragen innerhalb 24h umzusetzen
e) Den Auftraggeber unverzüglich über Spam-Beschwerden zu informieren

§ 5.3 Haftungsbegrenzung

Die Haftung des Auftragnehmers ist begrenzt auf Fälle von Vorsatz und
grober Fahrlässigkeit, maximal auf die Höhe des Jahresvertragswerts.
```

**BEGRÜNDUNG:** Domain wird auf Kunde registriert → Kunde ist primär haftbar bei Spam. Wir bieten Best-Effort Compliance, aber übernehmen kein Abmahn-Risiko.

#### § 6 Datenschutz & Auftragsverarbeitung
```
Die Parteien schließen einen separaten Auftragsverarbeitungsvertrag (AV-Vertrag)
gemäß Art. 28 DSGVO ab (siehe Anlage 1).

Der Auftragnehmer verpflichtet sich:
- Technisch-organisatorische Maßnahmen (TOMs) einzuhalten
- Subunternehmer nur mit schriftlicher Genehmigung einzusetzen
- Daten nach Vertragsende zu löschen oder an Auftraggeber zu übergeben
```

#### § 7 Domain & Infrastruktur-Eigentum
```
§ 7.1 Domain-Registrierung

Die Outreach-Domain(s) wird/werden im Namen und auf Rechnung des Auftraggebers
registriert. Der Auftraggeber ist ab Registrierung alleiniger Eigentümer.

Der Auftragnehmer erhält Admin-Zugriff für technische Konfiguration (DNS, Email-Setup).

Kosten: Domain-Registrierung/Renewal (€8-15/Jahr) wird vom Auftragnehmer vorgestreckt
und monatlich abgerechnet oder vom Auftraggeber direkt bezahlt.

§ 7.2 Email-Accounts

Email-Accounts werden auf Google Workspace des Auftraggebers eingerichtet oder
auf separatem Google Workspace Account, der dem Auftraggeber gehört.

Kosten: Google Workspace (€6/Account/Monat) wird separat abgerechnet.

§ 7.3 Bei Vertragsende

Der Auftragnehmer übergibt alle Zugangsdaten (Domain, Email, Tools) innerhalb
von 14 Tagen an den Auftraggeber.
```

**EMPFEHLUNG:** Domain IMMER auf Kunde registrieren (Haftungstrennung, siehe Anhang A).

#### § 8 Geheimhaltung (NDA)
```
Beide Parteien verpflichten sich zur Vertraulichkeit über:
- Kundendaten, Lead-Listen, ICP-Definitionen
- Email-Templates, Strategien
- Pricing, Vertragskonditionen
- Geschäftsgeheimnisse

Dauer: Während Vertragslaufzeit + 2 Jahre nach Vertragsende
```

#### § 9 Reporting & KPIs
```
Wöchentliche Reports (jeden Montag):
- Anzahl gesendeter Emails
- Open Rate, Reply Rate, Bounce Rate
- Gebuchte Meetings, Show-Up Rate

Monatliche Deep-Dive Calls (30-60 Min):
- Performance-Review
- ICP-Adjustments
- Strategie-Updates

Dashboard-Zugang: Der Auftraggeber erhält Lesezugriff auf Live-Dashboard
(Instantly/Smartlead Workspace)
```

#### § 10 Rechtswahl & Gerichtsstand
```
Es gilt das Recht der Bundesrepublik Deutschland.

Gerichtsstand: [Stadt des Auftragnehmers]
(oder: "Bei Streitigkeiten einigen sich die Parteien auf Mediation vor Klage")
```

---

## 1.2 Auftragsverarbeitungsvertrag (AV-Vertrag) — PFLICHT

**Rechtsgrundlage:** Art. 28 DSGVO — Auftragsverarbeiter

**Warum notwendig?**
KontaktManufaktur verarbeitet personenbezogene Daten (Namen, Email-Adressen, Jobtitel) im Auftrag des Kunden.
- Kunde = Verantwortlicher (Controller)
- KontaktManufaktur = Auftragsverarbeiter (Processor)

### Mindestinhalte AV-Vertrag (Art. 28 Abs. 3 DSGVO)

#### 1. Gegenstand & Dauer
```
Gegenstand: Verarbeitung von B2B-Kontaktdaten zum Zweck der Terminvereinbarung

Dauer: Entspricht Laufzeit des Hauptvertrags

Art der Verarbeitung:
- Automatisiert: Email-Versand, CRM-Eintragung, Tracking
- Manuell: Telefonische Nachfassaktionen, LinkedIn-Research (falls beauftragt)
```

#### 2. Art der personenbezogenen Daten
```
- Stammdaten: Vorname, Nachname, Jobtitel, Firmenname, Email-Adresse, Telefonnummer
- Verhaltens-/Interaktionsdaten: Email-Öffnungen, Klicks, Replies, Call-Notizen
- KEINE sensiblen Daten im Sinne von Art. 9 DSGVO
```

#### 3. Kategorien betroffener Personen
```
- B2B-Entscheider und Fachkräfte in Zielunternehmen
- Keine Verbraucher (B2C)
```

#### 4. Pflichten des Auftragsverarbeiters
```
a) Verarbeitung nur nach dokumentierter Weisung des Auftraggebers

b) Vertraulichkeit:
   Alle Mitarbeiter sind auf Vertraulichkeit verpflichtet

c) Technisch-organisatorische Maßnahmen (TOMs):
   - Verschlüsselung: TLS für Email-Versand, HTTPS für Tools
   - Zugriffskontrolle: Nur autorisierte Mitarbeiter haben Zugang zu Kundendaten
   - Datensicherung: Tägliche Backups, 30-Tage-Aufbewahrung
   - Trennung: Separate Instantly Workspaces pro Kunde (Daten-Isolation)

d) Subunternehmer (Sub-Processors):
   Liste der genehmigten Subunternehmer (siehe Anlage):
   - Instantly.ai (Email-Versand & Warmup)
   - Google LLC (Google Workspace für Email-Infrastruktur)
   - Hunter.io (Email-Discovery)
   - DeBounce (Email-Validation)
   - [ggf. Apollo.io, Clay.com für Research]

   Änderungen: Schriftliche Vorab-Information, Widerspruchsrecht innerhalb 14 Tagen

e) Unterstützung bei Betroffenenrechten:
   - Auskunft (Art. 15 DSGVO)
   - Berichtigung (Art. 16 DSGVO)
   - Löschung (Art. 17 DSGVO)
   - Datenübertragbarkeit (Art. 20 DSGVO)

   Reaktionszeit: Innerhalb 5 Werktagen nach Anfrage des Auftraggebers

f) Meldepflicht bei Datenpannen:
   Unverzügliche Information des Auftraggebers (innerhalb 24h)
   bei Datenschutzverletzungen (Breach, Hacks, Datenlecks)

g) Löschpflicht nach Vertragsende:
   Alle personenbezogenen Daten werden innerhalb 30 Tagen nach Vertragsende
   gelöscht oder auf Wunsch an Auftraggeber übergeben (CSV-Export)
```

#### 5. Rechte des Verantwortlichen (Auftraggeber)
```
- Kontrollrecht: Der Auftraggeber kann Audits durchführen (mit 14 Tagen Vorlauf)
- Weisungsrecht: Jederzeit schriftliche Weisungen zur Datenverarbeitung
- Auskunftsrecht: Auf Anfrage Informationen über TOMs und Subunternehmer
```

#### 6. Haftung
```
Der Auftragsverarbeiter haftet für Verstöße gegen DSGVO nach Art. 82 DSGVO.

Versicherung: [Optional] Cyber-Haftpflichtversicherung (empfohlen ab 5+ Kunden)
```

### AV-Vertrag: Praktische Umsetzung

**Option A: Standard-Template nutzen (EMPFEHLUNG für Start)**
- **activeMind AG AV-Vertrag Muster:** https://www.activemind.de/datenschutz/generatoren/
- Kostenlos, DSGVO-compliant, einfach anpassbar
- Download als Word/PDF, anpassen auf KontaktManufaktur-Services

**Option B: Anwalt beauftragen (EMPFEHLUNG ab 10+ Kunden)**
- Rechtsanwalt für IT-/Datenschutzrecht: €1.000-€2.000 einmalig
- Vorteil: Auf eure spezifischen Services zugeschnitten, rechtssicher

**ENTSCHEIDUNG NÖTIG:**
- Für die ersten 1-3 Kunden: activeMind Template nutzen
- Ab 5+ Kunden oder bei Enterprise-Kunden: Anwalt beauftragen

### Sub-Processor-Liste (Anlage zum AV-Vertrag)

```
LISTE DER SUBUNTERNEHMER (Stand: [Datum])

1. Instantly.ai
   Zweck: Email-Versand, Warmup, Campaign-Management
   Standort: USA (Privacy Shield Nachfolger-Mechanismus oder EU-Hosting)
   AV-Vertrag: https://instantly.ai/dpa (Data Processing Agreement)

2. Google LLC (Google Workspace)
   Zweck: Email-Infrastruktur (Gmail-Accounts)
   Standort: USA/EU
   AV-Vertrag: https://workspace.google.com/terms/dpa_terms.html

3. Hunter.io
   Zweck: Email-Discovery & Verification
   Standort: Frankreich (EU)
   AV-Vertrag: https://hunter.io/data-processing-agreement

4. DeBounce
   Zweck: Email-Validation
   Standort: [prüfen]
   AV-Vertrag: [Link]

[Weitere bei Bedarf]

ÄNDERUNGEN: Der Auftraggeber wird mind. 30 Tage vor Einsatz neuer
Subunternehmer informiert und kann widersprechen.
```

**WICHTIG:** Instantly & Co haben EIGENE AV-Verträge → Ketten-AV-Vertrag (wir als Processor, Instantly als Sub-Processor). Links zu DPAs im AV-Vertrag referenzieren.

---

## 1.3 Weitere rechtliche Dokumente (Optional)

### NDA (Non-Disclosure Agreement)
- Kann Teil des Hauptvertrags sein (siehe § 8 Geheimhaltung)
- Oder separates Dokument bei besonders sensiblen Branchen

### Service Level Agreement (SLA)
**Nur bei Enterprise-Kunden:**
```
Response Times:
- Kritische Issues (Domain down, Compliance-Problem): < 4h
- Meeting-Übergabe: < 2h während Geschäftszeiten
- Standard-Anfragen: < 24h

Verfügbarkeit:
- Dashboard: 99% Uptime
- Email-Infrastruktur: 99.5% Uptime (via Google Workspace SLA)

Reporting:
- Wöchentlich: Jeden Montag bis 10 Uhr
- Monatlich: Bis zum 5. des Folgemonats
```

---

## 1.4 Domain-Ownership: Rechtliche Best Practice

**EMPFEHLUNG: Domain IMMER auf Kunde registrieren**

### Warum?

| Aspekt | Domain auf Kunde | Domain auf KontaktManufaktur |
|--------|------------------|------------------------------|
| **Haftung bei Spam** | ✅ Kunde haftet primär | ❌ Wir haften direkt |
| **Impressumspflicht** | ✅ Kunden-Impressum passt | 🟡 Unser Impressum (verwirrend) |
| **Transfer bei Kündigung** | ✅ Kein Transfer nötig | ❌ Transfer-Prozess (dauert) |
| **Kontrolle** | ✅ Kunde hat volle Kontrolle | ❌ Kunde abhängig von uns |
| **Admin-Aufwand** | 🟡 Kunde muss Zugang geben | ✅ Wir haben volle Kontrolle |

### Praktische Umsetzung

**Schritt-für-Schritt:**

1. **Kunde kauft Domain selbst (Option A)**
   - Wir senden Anleitung (z.B. "Bitte bei Namecheap Domain X registrieren")
   - Kunde gibt uns DNS-Zugang (oder befolgt unsere DNS-Anleitung)
   - **Problem:** Verzögerung wenn Kunde unerfahren

2. **Wir kaufen im Namen des Kunden (Option B — EMPFEHLUNG)**
   - Wir nutzen Namecheap/GoDaddy, tragen Kunde als Registrant ein
   - Kunde erhält Zugangsdaten sofort nach Kauf
   - **Rechtlich:** Wir handeln als "Erfüllungsgehilfe" des Kunden
   - **Vertraglich absichern:** "KontaktManufaktur kauft Domain treuhänderisch, Eigentümer ist Kunde ab Minute 1"

**Vertragliche Absicherung (bereits in § 7 Hauptvertrag enthalten):**
```markdown
Die KontaktManufaktur registriert im Namen und auf Rechnung des Kunden
eine oder mehrere Outreach-Domains. Der Kunde ist ab Registrierung
alleiniger Eigentümer der Domain(s).
```

---

## 1.5 Haftung bei Spam-Beschwerden: Wer zahlt?

### Rechtslage (siehe Anhang A für Details)

**Primär haftbar:** Domain-Inhaber (= Kunde, wenn Domain auf Kunde registriert)  
**Sekundär haftbar:** Absender (= wir, wenn als "verantwortlich" erkennbar)

**Risiken:**
- **UWG-Verstoß:** Abmahnungen, Unterlassungserklärungen, Schadensersatz (€1.000-€5.000 pro Fall)
- **DSGVO-Verstoß:** Bußgelder (bis 4% Jahresumsatz oder €20 Mio — theoretisch)

### Vertragliche Risiko-Verteilung (bereits in § 5 enthalten)

```
Kunde stellt uns frei von Ansprüchen Dritter.
Kunde trägt das Risiko von Spam-Beschwerden.
Wir verpflichten uns zu Best Practices (Opt-Out, Impressum, Deliverability).
Unsere Haftung begrenzt auf Vorsatz/grobe Fahrlässigkeit, max. Jahresvertragswert.
```

### Praktische Risikominimierung

**SIEHE Phase 7 (Go-Live & Monitoring) für operative Maßnahmen:**
- One-Click Opt-Out in jeder Email
- Vollständiges Impressum
- Spam-Complaint-Rate < 0.1%
- Saubere Listen (nur verified Emails)

**Versicherung (EMPFEHLUNG ab 5+ Kunden):**
- **Cyber-Haftpflichtversicherung:** €500-€2.000/Jahr
- Deckt: DSGVO-Bußgelder (€100k-€1 Mio), Abmahnkosten, Rechtsberatung
- Anbieter: Hiscox, ERGO, AXA (nach "Cyber-Versicherung B2B" googeln)

---

**✅ PHASE 1 ABSCHLUSS-KRITERIEN:**
- [ ] Hauptvertrag unterzeichnet (von beiden Parteien)
- [ ] AV-Vertrag unterzeichnet (von beiden Parteien)
- [ ] Pricing & Laufzeit geklärt
- [ ] Domain-Ownership-Modell festgelegt (Kunde = Eigentümer)
- [ ] Haftungsklauseln akzeptiert
- [ ] Setup-Fee eingegangen (wenn vereinbart)
- [ ] Versicherung geprüft (wenn > 5 Kunden)

**NEXT STEP:** Phase 2 (Kunden-Briefing) parallel zu Phase 3 (Domain-Setup) starten

---

# PHASE 2: KUNDEN-BRIEFING

**Dauer:** 1-3 Tage  
**Verantwortlich:** Account Manager + Kunde  
**Ziel:** Vollständiges Verständnis von ICP, Value Prop, Tone of Voice  
**Automatisierungsgrad:** 🟢 70% (Fragebogen automatisiert, Review manuell)

---

## 2.1 Automatisierter Onboarding-Fragebogen

**Tool-Empfehlung:** Typeform > Tally > Notion Forms

**Warum Typeform?**
- Conditional Logic (Fragen basierend auf vorherigen Antworten)
- Schöne UX (höhere Completion-Rate)
- Zapier-Integration (Auto-Import in Notion/Airtable)
- Preis: €25/Monat (Basic Plan ausreichend)

**Alternative Tally.so:** Kostenlos, ähnliche Features, weniger poliert

### Fragebogen-Struktur (30-45 Minuten Bearbeitungszeit)

**SEKTION 1: FIRMA & PRODUKT** (5-7 Fragen)

```
1. Firmenname & Website
   [Textfeld]

2. Was verkaufen Sie? (In einem Satz)
   [Textfeld, 150 Zeichen]

3. Welches konkrete Problem lösen Sie für Ihre Kunden?
   [Textarea, 500 Zeichen]
   Beispiel: "Unsere Software automatisiert Rechnungsfreigaben und
   reduziert den manuellen Aufwand im Accounting um 70%."

4. Was unterscheidet Sie von Wettbewerbern?
   [Textarea, 500 Zeichen]
   Beispiel: "Im Gegensatz zu SAP sind wir speziell für KMU konzipiert,
   ohne Setup-Aufwand, sofort einsatzbereit."

5. Typischer Deal Value (Jahresumsatz pro Kunde)
   [ ] < €5K
   [ ] €5-20K
   [ ] €20-50K
   [ ] €50-100K
   [ ] > €100K

6. Typischer Sales Cycle (von Erstkontakt bis Abschluss)
   [ ] < 1 Monat
   [ ] 1-3 Monate
   [ ] 3-6 Monate
   [ ] 6-12 Monate
   [ ] > 12 Monate

7. Haben Sie Case Studies/Referenzen?
   [ ] Ja (bitte URL oder PDF hochladen)
   [ ] Nein, aber können wir erstellen
   [ ] Nein
```

**SEKTION 2: IDEAL CUSTOMER PROFILE (ICP)** (8-12 Fragen)

```
8. Branche(n) Ihrer Zielkunden (Mehrfachauswahl)
   [ ] SaaS/Tech
   [ ] E-Commerce
   [ ] Logistik
   [ ] Gesundheitswesen/MedTech
   [ ] Finanzen/Versicherungen
   [ ] Agenturen (Marketing/Design/IT)
   [ ] Industrie/Fertigung
   [ ] Andere: [Freitext]

9. Unternehmensgröße (Mitarbeiter)
   [ ] 1-10 (Micro)
   [ ] 11-50 (Small)
   [ ] 51-200 (Medium)
   [ ] 201-500 (Medium-Large)
   [ ] 500+ (Enterprise)

10. Geografie
    [ ] DACH (Deutschland, Österreich, Schweiz)
    [ ] Nur Deutschland
    [ ] Europa
    [ ] Global

11. Entscheider-Titel (wer kauft bei Ihnen?)
    [Mehrfachauswahl + Freitext]
    [ ] CEO/Geschäftsführer
    [ ] CFO
    [ ] CTO/Head of IT
    [ ] VP Sales/Head of Sales
    [ ] Marketing Director/CMO
    [ ] Operations Manager/COO
    [ ] Andere: [Freitext]

12. Welche Buying Signals sind besonders wertvoll?
    (Was deutet darauf hin, dass ein Unternehmen JETZT kaufbereit ist?)
    [ ] Frisches Funding (Seed, Series A/B)
    [ ] Stellenausschreibungen (Sales, Marketing, etc.)
    [ ] Neuer Standort/Expansion
    [ ] Produktlaunch
    [ ] Wechsel in der Geschäftsführung
    [ ] Award/Auszeichnung gewonnen
    [ ] Andere: [Freitext]

13. Beschreiben Sie Ihren BESTEN aktuellen Kunden
    (Firma, Branche, Größe, warum funktioniert die Zusammenarbeit?)
    [Textarea, 1000 Zeichen]

14. Beschreiben Sie Ihren SCHLECHTESTEN ehemaligen Kunden
    (Warum hat es nicht funktioniert? Was sollen wir vermeiden?)
    [Textarea, 1000 Zeichen]

15. No-Go-Branchen oder Firmen (wen wollen Sie AUF KEINEN FALL ansprechen?)
    [Freitext]
    Beispiel: "Keine Konkurrenten, keine Non-Profits, keine Regierungsbehörden"
```

**SEKTION 3: MESSAGING & TONE OF VOICE** (5-8 Fragen)

```
16. Wie kommunizieren Sie typischerweise mit Kunden?
    [ ] Förmlich (Sie, Herr/Frau)
    [ ] Locker aber professionell (Sie, Vorname)
    [ ] Sehr locker (Du)

17. Beispiel-Email oder Text, der Ihren Stil zeigt
    [File Upload oder Textarea]
    "Laden Sie eine beispielhafte Email oder Nachricht hoch, die zeigt,
    wie Sie normalerweise kommunizieren."

18. Welche Wörter/Phrasen nutzen Sie häufig?
    [Freitext]
    Beispiel: "digitale Transformation, KI-gestützt, ohne Vendor Lock-in"

19. Was sind absolute No-Gos in der Kommunikation?
    [Freitext]
    Beispiel: "Kein Verkaufsdruck, kein 'einmaliges Angebot', keine Übertreibungen"

20. Haben Sie einen Brand Voice Guide oder Style Guide?
    [ ] Ja (bitte hochladen)
    [ ] Nein
```

**SEKTION 4: WETTBEWERB & POSITIONIERUNG** (3-5 Fragen)

```
21. Wer sind Ihre 3 größten Wettbewerber?
    [Freitext, 3 Felder]

22. Werden Ihre Prospects auch von anderen Anbietern angesprochen?
    [ ] Ja, sehr häufig
    [ ] Manchmal
    [ ] Selten
    [ ] Weiß nicht

23. Was sagen Prospects, wenn sie NEIN sagen?
    (Häufigste Einwände)
    [Textarea]
    Beispiel: "Zu teuer", "Wir haben bereits eine Lösung", "Kein Budget"
```

**SEKTION 5: LOGISTIK & MEETING-HANDLING** (4-6 Fragen)

```
24. Wer soll die gebuchten Meetings durchführen?
    [Freitext: Name, Rolle, Email]

25. Wie sollen Meetings gebucht werden?
    [ ] Über meinen Calendly/HubSpot Link: [URL]
    [ ] KontaktManufaktur bucht direkt in meinen Kalender (Google Cal Zugang nötig)
    [ ] Ich werde per Email/Slack informiert, buche dann selbst

26. Bevorzugte Meeting-Zeiten
    [Freitext]
    Beispiel: "Mo-Do 10-16 Uhr, keine Freitage"

27. Wie sollen wir qualifizierte Leads identifizieren?
    (Welche Fragen sollen wir in der Email/vor dem Meeting stellen?)
    [Textarea]
    Beispiel: "Hat das Unternehmen Budget? Wer muss bei der Kaufentscheidung
    einbezogen werden? Gibt es einen konkreten Zeitrahmen?"

28. Was ist für Sie ein "qualifiziertes Meeting"?
    [Textarea]
    Beispiel: "Entscheider mit Budget, aktueller Bedarf, Termin im Kalender bestätigt"
```

**SEKTION 6: MATERIALIEN & RESSOURCEN** (3-4 Fragen)

```
29. Welche Materialien können wir nutzen?
    [ ] Case Studies (bitte hochladen/verlinken)
    [ ] Whitepapers
    [ ] Produktdemos (Video/Link)
    [ ] Pitch Deck
    [ ] Blog-Artikel
    [ ] Andere: [Freitext]

30. Haben Sie bestehende Email-Templates, die gut funktioniert haben?
    [ ] Ja (bitte hochladen)
    [ ] Nein

31. Gibt es spezifische Kampagnen/Themen, die wir aufgreifen sollen?
    [Freitext]
    Beispiel: "Wir launchen gerade ein neues Feature X, das wäre ein guter Hook"
```

**SEKTION 7: ERWARTUNGEN & SUCCESS METRICS** (3-4 Fragen)

```
32. Was ist Ihr Ziel für die ersten 3 Monate?
    [ ] X qualifizierte Meetings pro Monat: [Zahl]
    [ ] Y Opportunities generiert
    [ ] Z€ Pipeline aufgebaut
    [ ] Andere: [Freitext]

33. Wie häufig möchten Sie Updates?
    [ ] Täglich (Email)
    [ ] 2-3x pro Woche (Slack/Email)
    [ ] Wöchentlich (Email-Report)
    [ ] Nur monatlich (Deep Dive Call)

34. Was wäre für Sie ein "Erfolg" nach 6 Monaten?
    [Textarea]
```

### Typeform-Setup: Schritt-für-Schritt

1. **Typeform Account:** https://typeform.com → Sign Up (Basic Plan €25/Monat)
2. **Template erstellen:** "Blank Form" → obige Fragen einfügen
3. **Conditional Logic:**
   - z.B. Frage 30: Nur zeigen wenn Frage 29 "Ja" ausgewählt
4. **Design:** Logo hochladen, Farben anpassen (Corporate Identity)
5. **Zapier-Integration:**
   - Typeform → Notion/Airtable (neue Antworten automatisch in Datenbank)
   - Typeform → Slack (Notification wenn Fragebogen ausgefüllt)
6. **Link generieren:** Custom URL (z.B. typeform.com/to/km-onboarding)

---

## 2.2 Fragebogen versenden & Follow-Up

**Trigger:** Vertrag unterschrieben + Anzahlung eingegangen

**Email an Kunde (innerhalb 24h):**

```
Betreff: Ihr Onboarding-Fragebogen — KontaktManufaktur

Guten Tag [Ansprechpartner],

um die bestmöglichen Ergebnisse für Sie zu erzielen, benötigen wir
einige Informationen zu Ihrem Unternehmen, Ihrer Zielgruppe und Ihrer
Kommunikation.

📋 FRAGEBOGEN AUSFÜLLEN (ca. 30-45 Minuten):
[Typeform-Link]

💡 TIPP: Am besten in einem Rutsch ausfüllen. Sie können zwischenspeichern,
aber erfahrungsgemäß ist es effizienter, sich einmal Zeit zu nehmen.

⏰ DEADLINE: Bitte bis [Datum, 3 Tage später] abschließen.

Sobald wir Ihre Antworten haben, starten wir mit der Kampagnen-Entwicklung.

Fragen? Melden Sie sich jederzeit.

Beste Grüße
[Account Manager Name]
KontaktManufaktur
```

**Follow-Up bei Nicht-Ausfüllung:**
- **Tag 2:** Freundliche Erinnerung per Email
- **Tag 3:** Anruf: "Gibt es Unklarheiten? Können wir gemeinsam durchgehen?"
- **Tag 5:** Eskalation an Decision Maker: "Ohne Briefing können wir leider nicht starten"

---

## 2.3 Competitive Intelligence & Research (parallel)

**Während Kunde Fragebogen ausfüllt:** Unser Team recherchiert

### Research-Checklist (intern, 2-4 Stunden)

**PROMPT für Research-Agent:**

```
Du bist der Competitive Intelligence Agent für KontaktManufaktur.
Recherchiere für [Kundenname]:

1. FIRMA:
   - Website-Analyse (Positioning, Value Prop)
   - LinkedIn-Profil (Follower, Posts, Tone)
   - Crunchbase/North Data (Funding, Team Size, Investors)

2. WETTBEWERBER:
   - Top 3-5 Wettbewerber identifizieren
   - Wie positionieren die sich?
   - Welche Email-Kampagnen laufen die (LinkedIn-Inbox checken, Newsletter anmelden)

3. ZIELGRUPPE:
   - LinkedIn Sales Navigator: 50-100 Beispiel-Prospects finden
   - Welche Pain Points posten die? (LinkedIn Activity durchsuchen)
   - Welche Lösungen nutzen die aktuell? (aus LinkedIn Profilen)

4. CONTENT-ANALYSE:
   - Blog-Artikel: Welche Themen behandelt der Kunde?
   - Case Studies: Welche Erfolge werden kommuniziert?
   - Testimonials: Was sagen zufriedene Kunden?

OUTPUT: Notion-Seite mit:
- Competitor Matrix (Name, Positioning, Pricing, Stärken/Schwächen)
- ICP Persona (fiktive Person mit typischen Problemen)
- Content Audit (welche Materialien nutzen wir für Personalisierung?)
```

**TOOLS:**
- LinkedIn Sales Navigator ($79/Monat — OPTIONAL)
- Crunchbase (kostenlos für Basics)
- SimilarWeb (Competitor Traffic Analysis — kostenlos)
- BuiltWith (Tech Stack Analysis — kostenlos)

---

## 2.4 Briefing-Review Call (30-60 Min)

**Wann:** Nach Typeform-Eingang + unserer Research (Tag 3-5)

**Teilnehmer:** Account Manager + Kunde (Decision Maker + operative Kontakte)

**Agenda:**

```
1. DANKE & ÜBERBLICK (5 Min)
   - Danke für ausführliches Briefing
   - Überblick über nächste Schritte

2. FRAGEBOGEN DEEP-DIVE (20-30 Min)
   - ICP-Definition bestätigen:
     "Sie haben gesagt 'Unternehmen 50-200 MA' — ist das hart oder kann
      auch mal 40 oder 250 sein?"
   - Value Prop schärfen:
     "Ihr Hauptunterschied zu X ist Y — korrekt?"
   - Buying Signals klären:
     "Sie haben 'Funding' als Signal genannt — reicht Series A oder
      auch Seed? Welcher Betrag ist relevant?"
   - Qualification Criteria:
     "Was sind die 3 Must-Haves für ein qualifiziertes Meeting?"

3. COMPETITIVE INTEL PRÄSENTIEREN (10 Min)
   - "Wir haben Ihre Wettbewerber analysiert, hier unsere Erkenntnisse"
   - Positionierungs-Vorschlag basierend auf Gaps

4. TONE OF VOICE (5 Min)
   - Email-Beispiel zeigen:
     "Würden Sie so schreiben oder eher so?"

5. NO-GOS & DNC (5 Min)
   - "Gibt es Firmen, die wir AUF KEINEN FALL ansprechen sollen?
     (Kunden, Partner, Konkurrenten)"

6. NEXT STEPS (5 Min)
   - Timeline kommunizieren
   - Nächster Touchpoint: Template-Review (in 7-10 Tagen)
```

**DOKUMENTATION:** Notion-Seite updaten mit finalen ICPs, Notizen, Entscheidungen.

---

## 2.5 ICP-Definition finalisieren (intern)

**Nach Briefing-Call:** ICP in strukturiertem JSON-Format festhalten

**Template (aus Playbook v2 übernehmen):**

```json
{
  "icp_id": "kunde_x_icp_1",
  "kunde": "Firmenname",
  "icp_name": "B2B SaaS Startups DACH",
  "company_size": "10-80 Mitarbeiter",
  "stage": "Seed bis Series A",
  "industries": ["SaaS", "B2B Software", "Tech"],
  "verticals": ["FinTech", "HRTech", "DevTools"],
  "revenue": "€200K-€5M ARR",
  "geographic": "DACH",
  "decision_makers": ["CEO/Founder", "CRO", "VP Sales"],
  "pricing": "€300/Meeting",
  "deal_value_kunde": "€10-50K",
  "NOT_THIS": ["B2C SaaS", "Marktplätze", "Hardware"],
  "buying_triggers": [
    "Frisches Funding (Seed, Series A)",
    "Erste Sales-Hire (SDR/AE Posting)",
    "Product Launch / neues Feature",
    "Expansion DACH → EU"
  ],
  "pain_points": [
    "Technical Founder, null Sales-Erfahrung",
    "Nach Funding: schnell Traction zeigen",
    "Paid Ads zu teuer, organisch zu langsam"
  ],
  "qualification_criteria": [
    "Budget: Mind. €X/Jahr für Tool/Service",
    "Decision Maker: CEO oder VP Sales im Call",
    "Timeframe: Kaufentscheidung innerhalb 3 Monate"
  ],
  "dnc_companies": ["Firma A GmbH", "Firma B AG"],
  "dnc_industries": ["Non-Profit", "Behörden"]
}
```

**Speichern:** `projects/kontaktmanufaktur/clients/[kunde]/campaigns/icp-definition.json`

---

**✅ PHASE 2 ABSCHLUSS-KRITERIEN:**
- [ ] Typeform-Fragebogen ausgefüllt (vom Kunden)
- [ ] Competitive Research abgeschlossen (intern)
- [ ] Briefing-Review Call durchgeführt
- [ ] ICP-Definition finalisiert (JSON)
- [ ] Qualification Criteria klar definiert
- [ ] DNC-Liste (Do Not Contact) dokumentiert
- [ ] Tone of Voice Beispiele gesammelt

**NEXT STEP:** Phase 3 (Domain Setup) + Phase 4 (Signal-Research) parallel starten

---

# PHASE 3: DOMAIN & INFRASTRUKTUR SETUP

**Dauer:** 1-2 Tage Setup + **14-21 Tage Warmup** (kritischer Pfad!)  
**Verantwortlich:** Tech/Ops Lead  
**Ziel:** Deliverability-optimierte Email-Infrastruktur  
**Automatisierungsgrad:** 🟢 90% (mit Mailforge/Infraforge) oder 🟡 50% (manuell)

---

## 3.1 Outreach-Domain kaufen

### Domain-Auswahl Strategie

**Regel:** Domain muss Variation der Kunden-Hauptdomain sein, aber **NICHT** identisch.

**Beispiele:**
- Hauptdomain: `kunde.de`
- Outreach-Domain: `kontakt-kunde.de`, `kunde-connect.de`, `get-kunde.de`

**Kriterien:**
- Ähnlich genug → Vertrauen
- Unterschiedlich genug → Hauptdomain-Reputation geschützt
- Keine Bindestriche wenn möglich (aber okay für Variation)
- .de bevorzugt (DACH-Markt), .com als Alternative

### Domain kaufen — 2 Optionen

**OPTION A: Kunde kauft selbst (nur wenn Kunde tech-affin)**

Email an Kunde:
```
Betreff: Domain-Registrierung für Ihre Outreach-Kampagne

Guten Tag [Name],

für Ihre Kampagne brauchen wir eine separate Outreach-Domain.
Das schützt Ihre Hauptdomain vor Spam-Risiken.

📋 EMPFOHLENE DOMAIN: [kontakt-kunde.de]

Bitte registrieren Sie diese Domain bei Namecheap oder einem anderen
Provider Ihrer Wahl. Kosten: ca. €10/Jahr.

WICHTIG: Die Domain muss auf Ihren Namen/Ihre Firma laufen (Sie sind Eigentümer).

Sobald die Domain registriert ist, geben Sie uns bitte Zugang für
die DNS-Konfiguration (wir senden Ihnen dazu eine separate Anleitung).

Bei Fragen: Melden Sie sich gerne.

Beste Grüße
[Name]
```

**OPTION B: Wir kaufen im Namen des Kunden (EMPFEHLUNG — schneller)**

1. **Namecheap Account** (wenn noch nicht vorhanden)
2. **Domain Search:** https://namecheap.com → [domain] eingeben
3. **Purchase:**
   - Registrant: **KUNDE** (Name, Adresse, Email des Kunden)
   - Admin Contact: **KontaktManufaktur** (für technische Verwaltung)
   - WhoisGuard: **AUS** (in DACH oft Impressumspflicht)
4. **Kosten:** €8-12/Jahr → Kunde in Rechnung stellen oder vorläufig vorstrecken
5. **Zugangsdaten:** An Kunde senden (per verschlüsselter Email oder Passwort-Manager)

**Vertragliche Absicherung (bereits in Phase 1 verankert):**
> "KontaktManufaktur registriert Domain treuhänderisch. Kunde ist ab Minute 1 Eigentümer."

---

## 3.2 Google Workspace Setup

**Warum Google Workspace (statt z.B. Microsoft 365)?**
- Beste Deliverability (Gmail-Infrastruktur)
- Einfaches SPF/DKIM-Setup
- Instantly.ai Integration out-of-the-box
- Preis: €6/User/Monat (Business Starter)

### Schritt-für-Schritt

#### 1. Google Workspace Account erstellen

**Option A: Kunde hat schon Google Workspace**
→ Neue Email-Adressen auf bestehenden Account hinzufügen

**Option B: Neuer Account (STANDARD für Outreach-Domain)**

1. **Signup:** https://workspace.google.com → "Get Started"
2. **Business Name:** [Kundenname] (oder "KontaktManufaktur - [Kunde]" wenn wir verwalten)
3. **Employees:** 1-9 (wir brauchen 3-5 Accounts)
4. **Domain:** [outreach-domain.de] (die in 3.1 registrierte Domain)
5. **Admin Email:** admin@[outreach-domain.de] (erstellen wir später)

#### 2. Domain verifizieren

Google zeigt DNS-Record (TXT) zum Verifizieren:
```
TXT Record:
Host: @ oder [outreach-domain.de]
Value: google-site-verification=XXXXXXXXXXXXX
```

**Bei Namecheap eintragen:**
1. Namecheap → Domain List → [Domain] → Manage
2. Advanced DNS → Add New Record
3. Type: TXT, Host: @, Value: [Google Code], TTL: Automatic
4. Save
5. Zurück zu Google → "Verify" klicken

**Propagation:** 10 Minuten bis 24 Stunden (meist < 1h)

#### 3. Email-Accounts anlegen

**Anzahl:** 3-5 Accounts pro Domain (für DACH: max. 50 Emails/Tag GESAMT)

**Namenskonvention:**
- `laurenz@[outreach-domain.de]`
- `hallo@[outreach-domain.de]`
- `kontakt@[outreach-domain.de]`
- `team@[outreach-domain.de]`
- `info@[outreach-domain.de]`

**ODER personalisiert (wenn Kunde involviert sein soll):**
- `max.mueller@[outreach-domain.de]` (Sales Rep des Kunden)

**Anlegen:**
1. Google Workspace Admin → Users → Add New User
2. First Name / Last Name (kann fiktiv sein, z.B. "Laurenz / Support")
3. Primary Email: [siehe oben]
4. Password: Starkes Passwort generieren (1Password, Bitwarden)
5. Repeat für 3-5 Accounts

**Passwörter dokumentieren:**
```
projects/kontaktmanufaktur/clients/[kunde]/infrastructure/email-accounts.csv

email,password,created,purpose
laurenz@outreach-kunde.de,XXXXX,2026-02-15,Main sender
hallo@outreach-kunde.de,XXXXX,2026-02-15,Secondary sender
kontakt@outreach-kunde.de,XXXXX,2026-02-15,Tertiary sender
```

**🔒 SICHERHEIT:** CSV mit `git-crypt` verschlüsseln oder in 1Password Vault speichern.

---

## 3.3 DNS-Records setzen (SPF, DKIM, DMARC)

**Ziel:** Maximale Deliverability, Spam-Filter umgehen

### SPF Record (Sender Policy Framework)

**Was:** Definiert, welche Server Emails von deiner Domain senden dürfen.

**Google Workspace SPF:**
```
Type: TXT
Host: @ oder [outreach-domain.de]
Value: v=spf1 include:_spf.google.com ~all
TTL: Automatic
```

**Bei Namecheap eintragen:**
1. Advanced DNS → Add New Record
2. Type: TXT, Host: @, Value: `v=spf1 include:_spf.google.com ~all`
3. Save

**Prüfen:** https://mxtoolbox.com/spf.aspx → [outreach-domain.de] eingeben

---

### DKIM (DomainKeys Identified Mail)

**Was:** Signiert Emails kryptografisch → Beweis dass Email wirklich von dir kommt.

**Aktivieren in Google Workspace:**

1. **Admin Console:** https://admin.google.com
2. **Apps → Google Workspace → Gmail → Authenticate email**
3. **Domain auswählen:** [outreach-domain.de]
4. **"Generate new record"** klicken
5. **DKIM Host + Value kopieren** (sieht ungefähr so aus):
   ```
   Host: google._domainkey
   Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ... (sehr lang)
   ```

**Bei Namecheap eintragen:**
1. Advanced DNS → Add New Record
2. Type: TXT
3. Host: `google._domainkey` (oder was Google anzeigt)
4. Value: [langer String von Google]
5. TTL: Automatic
6. Save

**In Google aktivieren:**
1. Zurück zu Google Admin → "Start authentication"
2. Status wird "Authenticating emails" → nach 24-48h "Authenticating emails ✓"

**Prüfen:** https://mxtoolbox.com/dkim.aspx

---

### DMARC (Domain-based Message Authentication)

**Was:** Policy für Emails, die SPF/DKIM-Check nicht bestehen.

**DMARC Record:**
```
Type: TXT
Host: _dmarc oder _dmarc.[outreach-domain.de]
Value: v=DMARC1; p=none; rua=mailto:dmarc@[outreach-domain.de]
TTL: Automatic
```

**Erklärung:**
- `p=none` → Monitoring-Modus (empfohlen für Start)
- `rua=mailto:dmarc@[...]` → Reports an diese Email senden

**Bei Namecheap eintragen:**
1. Advanced DNS → Add New Record
2. Type: TXT, Host: `_dmarc`, Value: [siehe oben]
3. Save

**Später verschärfen (nach 30 Tagen):**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@[outreach-domain.de]; pct=10
```
(= 10% der fehlerhaften Emails in Spam, 90% durchlassen)

**Prüfen:** https://mxtoolbox.com/dmarc.aspx

---

### MX Records (Mail Exchange)

**Was:** Definiert, wo Emails für deine Domain eingehen.

**Google Workspace MX Records:**
```
Priority 1: ASPMX.L.GOOGLE.COM
Priority 5: ALT1.ASPMX.L.GOOGLE.COM
Priority 5: ALT2.ASPMX.L.GOOGLE.COM
Priority 10: ALT3.ASPMX.L.GOOGLE.COM
Priority 10: ALT4.ASPMX.L.GOOGLE.COM
```

**Bei Namecheap eintragen:**
1. Advanced DNS → Mail Settings → Custom MX
2. Add New Record (5x):
   - Priority: [siehe oben], Value: ASPMX.L.GOOGLE.COM
   - Repeat für alle 5
3. Save

**Prüfen:** https://mxtoolbox.com/mx/ → [outreach-domain.de]

---

## 3.4 Custom Tracking Domain (in Instantly)

**Warum:** Tracking-Links (für Email-Öffnungen/Klicks) zeigen `track.[deine-domain.de]` statt `track.instantly.ai` → bessere Deliverability.

### Setup

**CNAME bei Namecheap:**
```
Type: CNAME
Host: track (oder track.[outreach-domain.de])
Value: track.instantly.ai
TTL: Automatic
```

**In Instantly aktivieren:**
1. Instantly → Settings → Email Accounts → [Account auswählen]
2. Custom Tracking Domain → `track.[outreach-domain.de]`
3. Verify

**Prüfen:** Email an dich selbst senden → Link inspizieren → sollte `track.[outreach-domain.de]` sein

---

## 3.5 DNS-Checklist (vor Warmup-Start)

**PROMPT für DNS Verification Agent:**

```
Verifiziere die DNS-Konfiguration für [outreach-domain.de]:

CHECKS:
1. SPF Record: v=spf1 include:_spf.google.com ~all
2. DKIM Key: google._domainkey TXT Record vorhanden
3. DMARC Policy: _dmarc TXT Record vorhanden
4. MX Records: Google Workspace MX Records korrekt
5. Custom Tracking: track.[domain] CNAME → track.instantly.ai
6. Blacklist Check: Domain nicht auf Spamhaus, Barracuda, etc.

TOOLS:
- MXToolbox: https://mxtoolbox.com
- mail-tester.com: https://mail-tester.com (Test-Email senden → Score sollte >8/10)

OUTPUT:
{
  "domain": "[outreach-domain.de]",
  "spf": "PASS/FAIL",
  "dkim": "PASS/FAIL",
  "dmarc": "PASS/FAIL",
  "mx": "PASS/FAIL",
  "tracking": "PASS/FAIL",
  "blacklists": "CLEAN/LISTED",
  "mail_tester_score": "X/10",
  "ready_for_warmup": true/false,
  "issues": ["Issue 1", "Issue 2"]
}
```

**✅ Erst wenn ALLE PASS → Warmup starten**

---

## 3.6 Instantly Workspace Setup

### Multi-Client Management (separater Workspace pro Kunde)

**Warum separate Workspaces?**
- Daten-Isolation (Kunde A sieht nichts von Kunde B)
- Deliverability-Schutz (Kunde A's Spam-Problem schadet nicht Kunde B)
- Sauberes Reporting pro Kunde
- Einfaches Offboarding (Workspace-Ownership übertragen)

**Kosten-Modell (Stand 2026):**
- Instantly erlaubt **unlimited Workspaces** im Hyper Growth / Light Speed Plan
- **NICHT** pro Workspace bezahlt, sondern pro **Email Account**
- Beispiel: 50 Email Accounts über 10 Workspaces verteilt = EIN Instantly Plan

**WARNUNG aus Research:**
Einige Quellen (z.B. SalesHandy) behaupten "separate paid workspaces" — das ist **FALSCH** laut aktueller Instantly-Dokumentation (Stand 2026). Workspaces sind kostenfrei, nur Email Accounts zählen.

### Workspace erstellen

1. **Instantly Login:** https://app.instantly.ai
2. **Workspaces:** Linke Sidebar → Workspace-Name (aktuell) → "+" Icon
3. **Create Workspace:**
   - Name: `[Kundenname] - Outreach` (z.B. "Acme Corp - Outreach")
   - **Wichtig:** Naming Convention einhalten für Übersicht
4. **Team Members hinzufügen (optional):**
   - Settings → Team → Invite
   - Role: "Client" (wenn Kunde Zugriff bekommt) oder "Editor" (intern)

**Dokumentieren:**
```
projects/kontaktmanufaktur/clients/[kunde]/infrastructure/instantly-workspace.md

Workspace Name: [Kunde] - Outreach
Workspace ID: [wird von Instantly generiert]
Created: 2026-02-15
Team Members:
  - laurenz@kontaktmanufaktur.de (Owner)
  - [account-manager]@kontaktmanufaktur.de (Admin)
  - [kunde-email] (Client — optional)
```

---

## 3.7 Email-Accounts zu Instantly hinzufügen

**Pro Workspace: 3-5 Email-Accounts**

### Schritt-für-Schritt

1. **Instantly Workspace öffnen:** [Kunde]-Workspace auswählen
2. **Email Accounts → Add Email Account**
3. **Provider:** Google Workspace
4. **Email:** laurenz@[outreach-domain.de]
5. **Authenticate via OAuth:**
   - "Connect with Google" → Google Login → Zugriff erlauben
6. **Repeat** für alle 3-5 Accounts

### App Password (falls OAuth nicht funktioniert)

1. **Google Account:** https://myaccount.google.com
2. **Security → 2-Step Verification** (muss aktiv sein)
3. **App Passwords → Generate**
4. **Name:** "Instantly Outreach"
5. **Password kopieren** → in Instantly einfügen

**SMTP Settings (manuell):**
```
SMTP Server: smtp.gmail.com
Port: 587
Username: laurenz@[outreach-domain.de]
Password: [App Password]
```

---

## 3.8 Warmup starten ⏱️ KRITISCHER PFAD

**Dauer: 14-21 Tage MINIMUM**

**Was ist Warmup?**
Neue Email-Accounts/Domains haben keine "Reputation". Wenn wir sofort 50 Emails/Tag senden, landen wir im Spam. Warmup = graduelles Hochfahren des Volumens.

### Instantly Auto-Warmup (EMPFEHLUNG)

**Aktivieren:**
1. Instantly → Email Accounts → [Account auswählen]
2. Warmup → **Enable**
3. **Settings:**
   - **Ramp-up Geschwindigkeit:** Medium (empfohlen)
   - **Reply Rate:** 40% (simuliert, dass Empfänger antworten)
   - **Max Emails/Day:** 50 (DACH-konform)
   - **Warmup Pool:** Instantly Premium Pool (höhere Qualität)

**Was passiert?**
- Tag 1-3: 5-10 Emails/Tag (an andere Warmup-Accounts)
- Tag 4-7: 15-20 Emails/Tag
- Tag 8-14: 30-40 Emails/Tag
- Tag 15+: 50 Emails/Tag (Zielvolumen)

**Monitoring:**
- **Deliverability Score:** Instantly zeigt Score (sollte >85% sein)
- **Bounce Rate:** < 2%
- **Spam Placement:** Instantly testet automatisch

### Warmup-Schedule (konservativ für DACH)

| Woche | Emails/Tag/Account | Gesamt (5 Accounts) | Aktivität |
|-------|-------------------|---------------------|-----------|
| 1 | 5-10 | 25-50 | Nur Warmup-Pool |
| 2 | 10-15 | 50-75 | Nur Warmup-Pool |
| 3 | 15-20 | 75-100 | Warmup-Pool + Test-Sends |
| 4+ | 10 (DACH-Limit) | 50 TOTAL | Live Outreach |

**DACH-BESONDERHEIT:** Max 50 Emails/Tag GESAMT (nicht pro Account). Verteilen auf 5 Accounts = 10 Emails/Account/Tag.

### Warmup-Überwachung (wöchentlich)

**Checklist:**
- [ ] Deliverability Score >85%
- [ ] Bounce Rate <2%
- [ ] Spam Complaint Rate <0.1%
- [ ] Inbox Placement >80% (Instantly testet automatisch)
- [ ] Keine Blacklist-Einträge (MXToolbox check)

**Falls Probleme:**
- Score <80% → Warmup verlangsamen (auf 5 Emails/Tag zurück)
- Blacklist → DNS prüfen, Instantly Support kontaktieren

---

## 3.9 Alternative: Mailforge/Infraforge (Auto-DNS)

**Wenn du 10+ Kunden hast:** Mailforge automatisiert Domain+DNS+Warmup

**Services:**
- **Mailforge.ai:** Domain-Kauf, Auto-DNS, Warmup, Dedicated IPs (€3.50-€4.50/Mailbox/Monat)
- **Infraforge.ai:** Private Infra, Custom DNS (€4-6/Mailbox)
- **Warmforge.ai:** Nur Warmup (€2-3/Mailbox)

**Vorteil:** 1-Click Setup statt manuell
**Nachteil:** Zusatzkosten, weniger Kontrolle

**ENTSCHEIDUNG NÖTIG:** Für 1-5 Kunden → manuell. Ab 10+ Kunden → Mailforge evaluieren.

---

**✅ PHASE 3 ABSCHLUSS-KRITERIEN:**
- [ ] Outreach-Domain registriert (auf Kunde)
- [ ] Google Workspace Account erstellt (3-5 Email-Accounts)
- [ ] DNS-Records gesetzt (SPF, DKIM, DMARC, MX)
- [ ] Custom Tracking Domain konfiguriert
- [ ] DNS-Verification PASS (alle Checks grün)
- [ ] Instantly Workspace erstellt (separater Workspace für Kunde)
- [ ] Email-Accounts zu Instantly hinzugefügt
- [ ] **Warmup gestartet (läuft 14-21 Tage)**

**NEXT STEP:** Während Warmup läuft → Phase 4 (ICP & Signal-Config) + Phase 5 (Email-Entwicklung) parallel

---

# PHASE 4: ICP & SIGNAL-KONFIGURATION

**Dauer:** 2-4 Tage  
**Verantwortlich:** Research Team  
**Ziel:** Frische, qualifizierte Leads mit Buying Signals  
**Automatisierungsgrad:** 🟡 40% (Signal-Detection automatisiert, Review manuell)

**HINWEIS:** Diese Phase nutzt das im Playbook v2 definierte ICP-Framework + Signal Sources.

---

## 4.1 ICP aus Phase 2 übernehmen

**Input:** `projects/kontaktmanufaktur/clients/[kunde]/campaigns/icp-definition.json`

**Review:**
- ICP passt zu einem der 5 Standard-ICPs (MedTech, SaaS, Logistik, Agenturen, Franchise)?
- Falls JA → Signal-Sources aus Playbook v2 nutzen
- Falls NEIN → Custom Signal-Sources recherchieren

---

## 4.2 Signal-Sources Mapping

**Aus Playbook v2 (Section 3: Signal Detection — ICP-spezifische Quellen):**

Für jeden ICP haben wir vorgegebene Quellen (z.B. für SaaS: Deutsche Startups, OMR, LinkedIn Jobs, Crunchbase).

**Task:**
1. **Quellen-Liste kopieren** (aus Playbook v2, passend zum Kunden-ICP)
2. **In Notion/Airtable dokumentieren:**
   ```
   projects/kontaktmanufaktur/clients/[kunde]/campaigns/signal-sources.md

   # Signal Sources für [Kunde]

   ICP: [Name]

   ## Top-Quellen (priorisiert):
   1. Deutsche Startups (https://deutsche-startups.de/dealmonitor)
      - Check-Frequenz: Täglich
      - Signal-Typ: Funding
   2. LinkedIn Jobs (https://linkedin.com/jobs)
      - Suchbegriff: "SDR" OR "Account Executive" + [Branche]
      - Signal-Typ: Team-Wachstum
   3. [...]
   ```

---

## 4.3 Signal Scanner Agent Setup

**PROMPT (angepasst auf Kunden-ICP):**

```
Du bist der Signal Detection Agent für KontaktManufaktur, Kunde: [Kundenname].

## ICP-DEFINITION:
[Hier: icp-definition.json einfügen]

## BUYING SIGNALS:
[buying_triggers aus ICP]

## VORGEGEBENE QUELLEN:
[signal-sources.md Liste]

## SCORING-MATRIX:
- Freshness (max 25): Nur Signals < 90 Tage
- Strength (max 25):
  - Tier 1 (25): Funding, aktive Sales-Job-Posting
  - Tier 2 (20): Teamwachstum, neue GF/Partner, Expansion
  - Tier 3 (15): Content Marketing, Event-Speaker
  - Tier 4 (10): Verzeichnis-Eintrag, Social Media
  - Tier 5 (5): Nur Website gefunden
- ICP Fit (max 20): Größe, B2B, DACH
- Personalisierbarkeit (max 15): Name + Hook
- Email-Findbarkeit (max 15): Öffentlich/Pattern/Formular

## OUTPUT PRO SIGNAL:
{
  "firma": "",
  "website": "",
  "branche": "",
  "team_size": "",
  "entscheider": "",
  "signal_type": "",
  "signal_datum": "TT.MM.YYYY",
  "signal_source_url": "https://...",
  "freshness_score": X,
  "strength_score": X,
  "fit_score": X,
  "personal_score": X,
  "email_score": X,
  "total_score": X,
  "personalisierungs_hook": "",
  "kontakt": ""
}

## ZIEL:
20-30 Signals pro Woche, nur Score ≥60, sortiert nach total_score DESC

## SPEICHERN:
projects/kontaktmanufaktur/clients/[kunde]/campaigns/signals-[YYYY-MM-DD].json
```

**Ausführung:**
- **Manuell:** Research-Team nutzt Prompt, arbeitet Quellen ab (2-4h/Woche)
- **Automatisiert:** Scout-Agent scheduled täglich (siehe Playbook v2 "Multi-Agent Pipeline")

---

## 4.4 List Verification & Cleaning

**Nach Signal-Detection:** Leads enrichieren + validieren

### Email-Discovery (Hunter.io)

**PROMPT für Email Finder Agent (aus Playbook v2, Section 5):**

```
Du bist der Email Finder für [Kunde].

INPUT: signals-[datum].json

FÜR JEDEN LEAD:
1. Domain Search: Hunter.io API /domain-search?domain={domain}
   → Alle bekannten Emails der Firma
2. Zielkontakt gefunden? → Email übernehmen
3. Nicht gefunden? → Email Finder:
   /email-finder?domain={d}&first_name={f}&last_name={l}
4. Immer noch nichts? → Pattern Guessing:
   - vorname.nachname@domain.de (36%)
   - vorname@domain.de (25%)
   - v.nachname@domain.de (15%)
5. Alle Emails → Validation Queue

OUTPUT: leads-[datum]-with-emails.json

BUDGET-TRACKING: Log searches/day
```

### Email-Validation (DeBounce)

**PROMPT für Validation Agent (aus Playbook v2, Section 6):**

```
Du bist der Validation Agent für [Kunde].

INPUT: leads-[datum]-with-emails.json

API: DeBounce https://api.debounce.io/v1/?api={key}&email={email}

KATEGORISIERUNG:
- SAFE: result='Safe to Send' → Outreach Queue
- RISKY: result='Role' oder 'Accept-All' → Manual Review (max 5 Test-Sends)
- INVALID: result='Invalid'/'Disposable' → ENTFERNEN

REGEL: NUR "SAFE" Emails in finale Liste.

OUTPUT: leads-[datum]-validated.csv

STATS LOGGEN: Gesamt, Safe (%), Risky (%), Invalid (%)
```

### Quality Gate: 95%+ Validation Rate

**Vor Go-Live checken:**
```
Total Leads: 100
Safe: 95+ ✅
Risky: <5 (nur wenn manuell geprüft)
Invalid: <5 (entfernt)
```

**Falls <95% Safe:** Liste nochmal prüfen, ggf. andere Email-Discovery-Methode.

---

## 4.5 Lead Enrichment (Content Scraper)

**PROMPT (aus Playbook v2, Section 4):**

```
Du bist der Content Scraper für [Kunde].

INPUT: leads-[datum]-validated.csv

FÜR JEDEN LEAD:
- Letzte 3 LinkedIn Posts (Thema, Datum, Key Quote)
- Letzte 3 Blog-Artikel (Titel, Datum, Kernaussage)
- Podcast-Auftritte (Name, Episode, Thema)
- Awards/Ranking (z.B. DFV Award, BVL Ranking)

OUTPUT PRO KONTAKT:
{
  "best_personalization_hook": "Dein LinkedIn Post vom [Datum] über [Thema]",
  "content_summary": "Postet regelmäßig über [X], zuletzt am [Datum]",
  "talking_points": ["Punkt 1", "Punkt 2", "Punkt 3"]
}

WICHTIG: Nur echte, verifizierbare Inhalte. Nie erfinden.

SPEICHERN: leads-[datum]-enriched.json
```

---

## 4.6 Finale Lead-Liste

**Kompilieren:**

```csv
lead_id,icp_type,date_detected,signal_type,signal_strength,
company_name,website,branche,standort,team_size,
kontakt_name,kontakt_titel,kontakt_email,email_verified,
kontakt_linkedin,
signal_source_url,
content_hook,pain_point_evidence,personalization_brief,
lead_score,pipeline_stage,notes
```

**Beispiel-Row:**
```csv
001,saas,2026-02-15,Funding - Series A,25,
Acme Corp,acme-corp.de,B2B SaaS,Berlin,45,
Max Müller,CEO,max.mueller@acme-corp.de,SAFE,
https://linkedin.com/in/maxmueller,
https://deutsche-startups.de/acme-series-a,
LinkedIn Post vom 10.02. über KI-Integration,
Sucht laut Stellenanzeige SDR — braucht Pipeline,
"Glückwunsch zur Series A. Wie baut ihr die Sales-Pipeline auf?",
85,NEW,Hot Lead — frisches Funding
```

**Speichern:**
`projects/kontaktmanufaktur/clients/[kunde]/campaigns/leads-final-[YYYY-MM-DD].csv`

---

## 4.7 DNC-Liste (Do Not Contact) Check

**Vor finalem Export:**

```
Für jeden Lead checken:
1. In Kunden-DNC-Liste? (aus Phase 2 Briefing)
2. In Master-DNC-Liste? (globale Opt-Outs über alle Kunden)
3. Ist Lead ein Konkurrent des Kunden?
4. Ist Lead in problematischer Branche (z.B. Kunde will keine Non-Profits)?

Falls JA bei einem → ENTFERNEN aus Liste + Grund loggen.
```

**Master-DNC-Liste:**
`projects/kontaktmanufaktur/master_dnc.csv`

```csv
email,reason,date_added,source
spam-complainer@firma.de,Spam-Beschwerde,2026-01-15,Kunde A Campaign
opt-out@firma.de,Opt-Out Request,2026-02-01,Kunde B Campaign
```

---

**✅ PHASE 4 ABSCHLUSS-KRITERIEN:**
- [ ] Signal-Sources mapped (aus Playbook v2 oder custom)
- [ ] Signal Scanner läuft (täglich oder wöchentlich)
- [ ] 20-30 qualifizierte Signals gesammelt (Score ≥60)
- [ ] Emails discovered (Hunter.io)
- [ ] Emails validated (DeBounce, ≥95% Safe)
- [ ] Leads enriched (Content Scraper: Personalisierungs-Hooks)
- [ ] DNC-Check durchgeführt
- [ ] Finale Lead-Liste: `leads-final-[datum].csv` (ready für Kampagne)

**NEXT STEP:** Phase 5 (Email-Entwicklung) — Templates basierend auf Leads schreiben

---

# PHASE 5: EMAIL-ENTWICKLUNG

**Dauer:** 3-5 Tage  
**Verantwortlich:** Copywriter + Kunde (Review)  
**Ziel:** 2-3 personalisierte Email-Templates + Follow-Up-Sequenz  
**Automatisierungsgrad:** 🔴 20% (AI-Drafts, aber manuelles Finetuning kritisch)

---

## 5.1 Template-Struktur (aus Playbook v2)

**Standard-Sequenz:**
- **Email 1:** Initial Outreach (120 Wörter max, kein Link, spezifischer Hook)
- **Email 2:** Follow-Up (Tag 3-4, Social Proof, weicher CTA)
- **Email 3:** Break-Up (Tag 7, "Falls nicht relevant, kein Problem")

**DACH-Regeln (aus Playbook v2 + Compliance-Research):**
- ✅ Vollständiges Impressum in jeder Email (Name, Adresse — §5 DDG)
- ✅ KEIN Opt-Out-Link (Grauzone-Strategie: "persönliche Geschäftsanbahnung", kein Newsletter)
- ✅ Unter 120 Wörter (persönlich, nicht Massen-Marketing)
- ✅ Spezifischer Bezug (Signal/Personalisierung)
- ✅ Sie-Form (professionell) oder Du (nur bei Startups, nach Briefing-Check)
- ❌ KEIN Link in erster Email (erhöht Spam-Score)
- ❌ KEINE Attachments (Spam-Filter)
- ❌ KEINE Spam-Wörter ("Gratis", "Kostenlos", "Jetzt kaufen", "einmalig")

---

## 5.2 ICP-spezifische Templates (aus Playbook v2)

**Aus Playbook v2 Section 8 haben wir Templates für:**
- MedTech/HealthTech
- B2B SaaS
- Logistik/SupplyChain
- Agenturen
- Franchise-Geber

**Task:**
1. **Kunden-ICP identifizieren** (aus Phase 2/4)
2. **Template aus Playbook v2 als Basis nehmen**
3. **Anpassen auf:**
   - Kunden-Value Prop (aus Phase 2 Briefing)
   - Kunden-Tone of Voice (aus Phase 2)
   - Spezifische Signals (aus Phase 4 Leads)

### Beispiel-Anpassung: SaaS Startup

**Playbook v2 Template (generisch):**
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
> Beste Grüße...

**Angepasst auf Kunde "Acme CRM" (Beispiel):**
> Betreff: Glückwunsch zur Series A — [Firmenname]
>
> Hi [Vorname],
>
> ich habe gesehen, dass [Firmenname] gerade [€X M] von [Investor] eingesammelt hat — starkes Signal!
>
> Viele SaaS-Gründer erzählen mir nach der Series A: "Jetzt müssen wir schnell Traction zeigen, aber Cold Outreach frisst wahnsinnig viel Zeit."
>
> Acme CRM hat genau das Problem gelöst, indem wir die Outreach übernommen haben — innerhalb von 4 Wochen 12 qualifizierte Demo-Calls mit VP Sales und CTOs aus dem Mittelstand.
>
> Würde das auch für euch Sinn machen?
>
> Beste Grüße
> [Name]
> [Kunde-Firma]
> [Adresse]

**Änderungen:**
- Spezifischer Investor (wenn bekannt)
- Social Proof eingefügt (andere Kunden)
- Kunden-Firma (statt "KontaktManufaktur") — wir versenden IM NAMEN des Kunden
- CTA angepasst ("Würde das auch für euch Sinn machen?" = weicher)

---

## 5.3 AI-gestützte Draft-Erstellung

**PROMPT für Email Writer Agent:**

```
Du bist Copywriter für [Kunde].

## KUNDE:
[Briefing aus Phase 2: Value Prop, Tone of Voice, Pain Points]

## ICP:
[ICP-Definition aus Phase 4]

## LEADS (Beispiele):
[5-10 Leads aus leads-final.csv mit Personalisierungs-Hooks]

## AUFGABE:
Schreibe 3 Email-Varianten (A/B/C) für die erste Email.

REGELN:
1. Unter 120 Wörter
2. Deutsch, [Sie/Du basierend auf Briefing]
3. Kein Link, kein Attachment
4. Spezifischer Bezug auf Signal (aus lead.content_hook)
5. Value: [Kunden-Value-Prop]
6. CTA: Soft, low-commitment ("Lohnt sich ein Gespräch?")
7. Signatur: [Kunden-Kontaktdaten + Impressum]

STRUKTUR:
- Betreff: [Signal-bezogen, max 50 Zeichen]
- Zeile 1: Hook (Signal erwähnen)
- Zeile 2-3: Pain/Problem (aus ICP pain_points)
- Zeile 4-5: Value/Lösung (Kunden-Offering)
- Zeile 6: CTA
- Signatur

OUTPUT: 3 Varianten (unterschiedliche Hooks, CTAs)
```

**AI-Tool:** ChatGPT, Claude, oder Custom GPT

**Output-Beispiel (3 Varianten):**

**Variante A: Funding-Hook**
> Betreff: Glückwunsch zur Series A — [Firma]
> [siehe oben]

**Variante B: Job-Posting-Hook**
> Betreff: eure SDR-Stelle auf LinkedIn
>
> Hi [Vorname],
>
> mir ist aufgefallen, dass ihr gerade einen SDR sucht. Bis der an Bord und eingearbeitet ist, vergehen erfahrungsgemäß 3-4 Monate.
>
> [Kunde] hat mit Acme CRM genau diese Lücke überbrückt: Wir haben die Outreach übernommen und 15 qualifizierte Calls geliefert, während der SDR-Hiring-Prozess lief.
>
> Würde das auch für euch Sinn machen?
>
> Beste Grüße...

**Variante C: Product-Launch-Hook**
> Betreff: euer neues [Feature] — Launch-Strategie?
>
> Hi [Vorname],
>
> ich habe gesehen, dass [Firmenname] gerade [Feature X] gelauncht hat — spannend!
>
> Die größte Herausforderung nach einem Launch: Die richtigen Leute erreichen, die das Feature wirklich brauchen. [Kunde] hatte das gleiche Problem und hat mit Acme CRM innerhalb von 6 Wochen 20 qualifizierte Calls mit Decision Makern generiert.
>
> Lohnt sich ein kurzer Austausch?
>
> Beste Grüße...

---

## 5.4 Spam-Checker Integration

**Vor Finalisierung:** Jede Email durch Spam-Checker

**Tools:**
- **mail-tester.com:** Email an test@mail-tester.com senden → Score (Ziel: >8/10)
- **SpamAssassin (lokal):** Score <5 (alles >5 = Spam-Risiko)
- **GlockApps:** Inbox-Placement-Test (€79/Monat, optional)

**PROMPT für Spam Check Agent:**

```
Analysiere Email-Template auf Spam-Risiko:

CHECKS:
1. Spam-Wörter: "Gratis", "Kostenlos", "Jetzt", "Einmalig", "Garantiert" → ENTFERNEN
2. Links: Max 1 Link (besser 0 in erster Email)
3. ALL CAPS: Keine GROSSBUCHSTABEN-WÖRTER
4. Sonderzeichen: Keine Emojis in Subject Line
5. Länge: Subject <50 Zeichen, Body <120 Wörter
6. Impressum: Vollständig? (Name, Adresse, Stadt, PLZ)
7. HTML: Plain Text bevorzugt (oder minimal HTML)

SCORE: 1-10 (10 = kein Spam-Risiko)

Falls Score <7 → Verbesserungsvorschläge
```

---

## 5.5 Follow-Up-Sequenz

**Email 2 (Tag 3-4 nach Email 1):**

**Template:**
> Betreff: Re: [Original-Betreff]
>
> Guten Tag Herr/Frau [Name],
>
> kurze Nachfrage zu meiner letzten Nachricht. Ich weiß, der Posteingang ist voll.
>
> [Social Proof]:
> Ein [ICP-Typ] aus [Stadt] hat durch [Kunde] [X] [Meetings/Calls/Opportunities] in [Y] Wochen bekommen — ohne eigenen SDR zu hirien oder Zeit in Cold Outreach zu investieren.
>
> Falls das Thema für Sie gerade nicht passt, kein Problem. Ich wollte nur sichergehen, dass die Nachricht angekommen ist.
>
> Beste Grüße...

**Email 3 (Tag 7, "Break-Up"):**
> Betreff: Re: [Original-Betreff] — letzte Nachricht
>
> Guten Tag Herr/Frau [Name],
>
> ich nehme an, das Thema ist aktuell nicht relevant für Sie — kein Problem!
>
> Falls sich das ändert: Melden Sie sich gerne. Ansonsten wünsche ich Ihnen viel Erfolg mit [Firmenname].
>
> Beste Grüße...

**NACH Email 3:** Lead in DNC-Liste → nie wieder kontaktieren (Compliance).

---

## 5.6 Kunden-Freigabe (Template Review)

**Email an Kunde:**

```
Betreff: Template-Review — KontaktManufaktur Kampagne

Guten Tag [Ansprechpartner],

wir haben die Email-Templates für Ihre Kampagne entwickelt.
Bitte prüfen Sie:

1. **Tone of Voice:** Passt die Ansprache zu Ihrer Marke?
2. **Value Proposition:** Wird Ihr USP klar kommuniziert?
3. **Compliance:** Impressum vollständig? Keine problematischen Aussagen?

📎 TEMPLATES:
[Google Doc Link oder PDF]

⏰ DEADLINE: Bitte Feedback bis [Datum, 3 Tage später]

Änderungswünsche? Markieren Sie direkt im Dokument oder per Email.

Beste Grüße
[Account Manager]
```

**Review-Prozess:**
1. Kunde gibt Feedback (direkt in Google Doc)
2. Wir adjustieren (max. 2 Iterationen)
3. Finale Freigabe (schriftlich per Email: "Templates genehmigt")

**DOKUMENTIEREN:**
`projects/kontaktmanufaktur/clients/[kunde]/campaigns/email-templates-approved.md`

---

## 5.7 A/B-Testing-Framework

**Für erste 50-100 Sends:** A/B-Test

**Variablen testen:**
1. **Subject Lines** (wichtigster Faktor für Open Rate)
   - Variante A: Signal-bezogen ("Glückwunsch zur Series A")
   - Variante B: Problem-fokussiert ("Pipeline aufbauen nach Funding")
   - Variante C: Frage ("Wie baut ihr eure Sales-Pipeline?")

2. **CTA** (Call-to-Action)
   - Variante A: Frage ("Lohnt sich ein Gespräch?")
   - Variante B: Angebot ("Gerne zeige ich Ihnen, wie das funktioniert")
   - Variante C: Direkt ("Wann passt es für einen 15-Min-Call?")

3. **Länge**
   - Variante A: Ultra-short (60 Wörter)
   - Variante B: Standard (100-120 Wörter)

**Tracking:**
- Open Rate (Ziel: >50%)
- Reply Rate (Ziel: >3%)
- Positive Reply Rate (Ziel: >30% der Replies)

**Nach 100 Sends:** Beste Variante skalieren.

---

**✅ PHASE 5 ABSCHLUSS-KRITERIEN:**
- [ ] 2-3 Email-Templates entwickelt (basierend auf Playbook v2 + Kunden-Briefing)
- [ ] Follow-Up-Sequenz erstellt (Email 2 + Email 3)
- [ ] Spam-Check durchgeführt (Score >7/10)
- [ ] Impressum in jeder Email (Name, Adresse)
- [ ] Kunden-Freigabe eingeholt (schriftlich)
- [ ] A/B-Test-Varianten definiert
- [ ] Templates in Instantly hochgeladen (als Campaign-Drafts)

**NEXT STEP:** Phase 6 (Soft Launch & Testing) — erste 20-30 Test-Sends

---

# PHASE 6: SOFT LAUNCH & TESTING

**Dauer:** 3-7 Tage  
**Verantwortlich:** Ops + Tech  
**Ziel:** Deliverability validieren, Template-Performance testen, vor Vollgas  
**Automatisierungsgrad:** 🟡 60%

---

## 6.1 Warum Soft Launch?

**Problem:** Full-Scale Launch (50+ Emails/Tag) ohne Testing = hohes Risiko:
- Unbekannte Deliverability-Probleme
- Templates performen schlecht (niedrige Reply Rate)
- Bounce Rate zu hoch (schlechte Liste)

**Lösung:** Gradueller Rollout mit kleinem Volumen.

---

## 6.2 Test-Lead-Auswahl

**Aus leads-final.csv: 20-30 "Safe Bet" Leads auswählen:**

**Kriterien:**
- Lead Score ≥80 (Hot Leads)
- Email Verification: SAFE (nicht Risky/Accept-All)
- Kein Bounce-Risiko (große Firma mit stabiler Domain)
- Diversifiziert (verschiedene Branchen/Größen innerhalb ICP)

**WARUM diversifiziert?**
→ Testen ob Templates bei verschiedenen Sub-Segmenten funktionieren.

**Dokumentieren:**
`projects/kontaktmanufaktur/clients/[kunde]/campaigns/test-leads-week1.csv`

---

## 6.3 Instantly Campaign Setup

### Campaign erstellen

1. **Instantly Workspace:** [Kunde]-Workspace öffnen
2. **Campaigns → New Campaign**
3. **Name:** "[Kunde] - Soft Launch Week 1 - [Signal-Typ]"
4. **Email Accounts:** Alle 5 Accounts auswählen (Load Balancing)
5. **Schedule:**
   - **Woche 1:** 5-10 Emails/Tag TOTAL (nicht pro Account!)
   - **Sendezeiten:** Mo-Fr, 9-11 Uhr + 14-16 Uhr (DACH Geschäftszeiten)
   - **Wochenenden:** AUS (persönliche Business-Email wird am Wochenende nicht versendet)

### Sequence Setup

**Schritt 1: Email 1**
- Template: [aus Phase 5]
- Personalisierung: `{{firstName}}`, `{{companyName}}`, `{{customField1}}` (= Personalisierungs-Hook)
- Delay vor Send: Randomize 1-3h (verhindert "batch sending"-Muster)

**Schritt 2: Wait 3-4 Tage**
- Auto-Skip wenn Reply

**Schritt 3: Email 2 (Follow-Up)**
- Template: [aus Phase 5]
- Auto-Skip wenn Reply

**Schritt 4: Wait 3 Tage**
- Auto-Skip wenn Reply

**Schritt 5: Email 3 (Break-Up)**
- Template: [aus Phase 5]
- Nach Email 3 → Lead in DNC

**Schritt 6: Stop**

### CSV Upload

**CSV-Format für Instantly:**
```csv
email,firstName,lastName,companyName,customField1,customField2
max.mueller@firma.de,Max,Müller,Firma GmbH,"LinkedIn Post vom 10.02. über KI","Series A €5M von Project A"
```

**Upload:**
1. Campaigns → [Campaign] → Leads → Upload CSV
2. Map Columns → Assign custom fields
3. **Skip Duplicates:** AN (verhindert doppelte Ansprache)

---

## 6.4 Deliverability Pre-Flight Check

**VOR erstem Send:**

### Mail-Tester Test
1. **Test-Email senden:** An test-[random]@mail-tester.com
2. **Score prüfen:** https://mail-tester.com
3. **Ziel:** >8/10
4. **Falls <8:** Feedback umsetzen (meist SPF/DKIM/DMARC oder Spam-Wörter)

### GlockApps Inbox Placement Test (Optional, €79/Monat)
- Zeigt: Landet Email in Inbox oder Spam bei Gmail, Outlook, Yahoo, etc.
- **Ziel:** >80% Inbox Placement

### Seed List Test
**Eigene Emails als Test:**
- Email an eigene Gmail, Outlook, Yahoo Accounts senden
- Checken: Landet in Inbox oder Spam?
- Link-Tracking funktioniert?
- Signatur korrekt?

---

## 6.5 Week 1 Monitoring (täglich)

### Instantly Dashboard Metrics

**Check jeden Morgen (9 Uhr):**

| Metrik | Ziel Week 1 | Kritisch wenn |
|--------|-------------|---------------|
| **Sent** | 5-10/Tag | - |
| **Bounced** | <2% | >5% → STOP |
| **Open Rate** | >40% | <30% |
| **Reply Rate** | >2% | <1% |
| **Spam Complaints** | 0 | >0 → STOP |
| **Unsubscribes** | 0 (kein Unsub-Link) | - |

**Daily Log:**
```
projects/kontaktmanufaktur/clients/[kunde]/reporting/daily-soft-launch-log.md

# Day 1 (2026-02-20)
- Sent: 10
- Bounced: 0 (0%)
- Opens: 6 (60%)
- Replies: 1 (10%) — POSITIV, "Klingt interessant, mehr Info?"
- Actions: Reply beantwortet, Meeting-Anfrage

# Day 2 (2026-02-21)
- Sent: 10
- Bounced: 1 (10%) — PROBLEM: max.mueller@firma.de bounced
- Opens: 4 (40%)
- Replies: 0
- Actions: Bounced Email aus Liste entfernt, DeBounce re-check
```

---

## 6.6 Probleme & Sofort-Maßnahmen

### Problem 1: Bounce Rate >5%

**Ursachen:**
- Schlechte Email-Validation (DeBounce hat versagt)
- Alte Daten (Leads >90 Tage)
- Firmen-Domains down/umgezogen

**SOFORT:**
1. Kampagne pausieren
2. Liste re-validieren (DeBounce nochmal laufen lassen)
3. Bounced Emails in DNC
4. Nur "SAFE" Emails weiterverwenden
5. Kampagne mit cleaner Liste neu starten

### Problem 2: Open Rate <30%

**Ursachen:**
- Subject Lines schlecht
- Emails landen im Spam
- Sendezeit falsch

**SOFORT:**
1. Spam-Check (mail-tester, GlockApps)
2. Subject Line A/B-Test (neue Varianten)
3. Sendezeit anpassen (testen: 10 Uhr vs. 14 Uhr)

### Problem 3: Spam Complaint >0

**SOFORT:**
1. Kampagne STOPPEN
2. Spam-Complainer in DNC
3. Email analysieren: Was hat Spam-Trigger ausgelöst?
4. Template überarbeiten (mehr Personalisierung, weniger "Verkauf")
5. Mit Kunde besprechen: Compliance-Strategie anpassen?

**ESKALATION:** Falls 2+ Spam Complaints in Woche 1 → Kampagne komplett neu evaluieren.

---

## 6.7 Reply Handling & Qualification

**Jede Reply innerhalb 2h beantworten** (während Geschäftszeiten 9-18 Uhr)

### Reply-Kategorisierung (aus Playbook v2)

**1. INTERESSIERT** ("Klingt interessant", "Mehr Info", "Wann passt ein Call?")

**SOFORT-AKTION:**
```
Antwort-Template:
"Freut mich! Wie wäre es mit einem kurzen 15-Minuten-Call diese Woche?
Hier ein paar Vorschläge: [Mo 10 Uhr, Di 14 Uhr, Mi 11 Uhr]
Oder nennen Sie mir gerne einen Termin, der Ihnen besser passt."
```
→ Calendly-Link ERST in Antwort (nicht in erster Email)  
→ Kunde/Account Manager informieren (Slack/Email)

**2. VIELLEICHT SPÄTER** ("Aktuell kein Bedarf, aber grundsätzlich interessant")

**AKTION:**
```
"Verstehe ich gut. Ich melde mich in [4 Wochen] nochmal — passt das?"
```
→ In Nurture-Liste (CRM: Follow-up in 30/60/90 Tagen)

**3. NICHT INTERESSIERT** ("Nein danke", "Kein Bedarf")

**AKTION:**
```
"Danke für die Rückmeldung. Ich wünsche Ihnen weiterhin viel Erfolg!"
```
→ DNC-Liste SOFORT  
→ NIE wieder kontaktieren

**4. GENERVT/BESCHWERDE** ("Woher haben Sie meine Adresse?", "Spam!")

**AKTION:**
- DNC SOFORT
- NICHT antworten (verschlimmert nur)
- Intern dokumentieren (Reason, Lead-Source)
- Mit Kunde besprechen wenn >1 Fall

**5. OUT OF OFFICE**

**AKTION:**
- Rückkehrdatum notieren
- 2 Tage nach Rückkehr: Follow-Up senden

---

## 6.8 Week 1 Ergebnis-Review (intern)

**Am Ende von Woche 1 (Tag 5-7):**

### Review-Meeting (30 Min)

**Teilnehmer:** Ops Lead + Account Manager + ggf. Kunde

**Agenda:**

```
1. METRICS (5 Min)
   - Sent, Bounced, Opens, Replies
   - Benchmark-Vergleich (siehe unten)

2. LEARNINGS (10 Min)
   - Was hat funktioniert? (Best Reply, höchste Open Rate)
   - Was nicht? (Bounces, Spam Complaints)
   - Template-Performance: Welche Variante (A/B/C) am besten?

3. ADJUSTMENTS (10 Min)
   - Template-Tweaks nötig?
   - Liste cleanen?
   - Sendezeit/Frequenz anpassen?

4. GO/NO-GO für Week 2 (5 Min)
   - GO: Bounce <2%, Open >40%, Reply >2%, Spam=0
   - NO-GO: Bounce >5% ODER Spam >0 ODER Open <30%
```

### Benchmark-Tabelle (B2B Cold Email DACH)

| Metrik | Good | Great | Problem |
|--------|------|-------|---------|
| **Bounce Rate** | <2% | <1% | >5% |
| **Open Rate** | 40-60% | 60%+ | <30% |
| **Reply Rate** | 2-5% | 5%+ | <1% |
| **Positive Reply Rate** | 30-50% der Replies | 50%+ | <20% |
| **Spam Complaints** | 0 | 0 | >0 |

**ENTSCHEIDUNG:**
- **GO:** Alle Metriken im "Good"-Bereich → Week 2 skalieren auf 20-30 Emails/Tag
- **ADJUST:** Ein Metrik im "Problem"-Bereich → Fixen, dann Week 2
- **STOP:** Mehrere Metriken "Problem" + Spam Complaints → Kampagne komplett neu aufsetzen

---

**✅ PHASE 6 ABSCHLUSS-KRITERIEN:**
- [ ] Test-Leads ausgewählt (20-30, Score ≥80)
- [ ] Instantly Campaign setup (Sequence mit 3 Emails)
- [ ] Deliverability Pre-Flight Check (mail-tester >8/10)
- [ ] Week 1: 5-10 Emails/Tag gesendet
- [ ] Daily Monitoring durchgeführt (Bounce, Open, Reply, Spam)
- [ ] Replies beantwortet (<2h Response Time)
- [ ] Week 1 Review-Meeting durchgeführt
- [ ] GO/NO-GO Entscheidung getroffen
- [ ] Adjustments dokumentiert (falls nötig)

**NEXT STEP:** Falls GO → Phase 7 (Go-Live & Skalierung)

---

# PHASE 7: GO-LIVE & MONITORING

**Dauer:** Tag 1 (Go-Live) + laufend  
**Verantwortlich:** Ops + Account Manager  
**Ziel:** Hochskalieren auf Zielvolumen, kontinuierliches Monitoring  
**Automatisierungsgrad:** 🟢 80%

---

## 7.1 Skalierungs-Plan

**Nach erfolgreicher Soft Launch (Week 1):**

| Woche | Emails/Tag | Leads/Woche | Erwartete Meetings |
|-------|-----------|-------------|---------------------|
| Week 2 | 20-30 | 100-150 | 2-4 |
| Week 3 | 30-40 | 150-200 | 3-6 |
| Week 4+ | 50 (DACH-Limit) | 250 | 5-10 |

**DACH-BESONDERHEIT:** Max 50 Emails/Tag GESAMT (verteilt auf 5 Accounts = 10/Account).

**Regel:** Skalierung nur wenn:
- Bounce Rate <2%
- Spam Complaints = 0
- Deliverability Score >85%

---

## 7.2 Instantly Campaign: Vollständige Liste hochladen

**Aus Phase 4: `leads-final-[datum].csv` (100-300 Leads)**

**Upload:**
1. Instantly → [Kunde]-Workspace → Campaign
2. Leads → Upload CSV
3. **Daily Send Limit:** 50 TOTAL (Instantly verteilt automatisch auf Accounts)
4. **Randomize Send Times:** 9-11 Uhr + 14-16 Uhr
5. **Skip Weekends:** AN
6. **Auto-Reply Detection:** AN (stoppt Sequence bei Reply)

**Campaign Launch:**
- **Tag 1:** 20 Emails (konservativ)
- **Tag 2-3:** 30 Emails
- **Tag 4+:** 50 Emails (Zielvolumen)

---

## 7.3 Daily KPI-Check (automatisiert)

**PROMPT für Dashboard Agent (aus Playbook v2):**

```
Kompiliere tägliche Metriken für [Kunde].

DATENQUELLE: Instantly API

TÄGLICHER REPORT (jeden Morgen 8 Uhr, Auto-Email an Team):

1. PIPELINE:
   - Leads in Campaign: X
   - Emails sent gestern: X
   - Emails scheduled heute: X

2. OUTREACH (gestern):
   - Gesendet: X
   - Opens: X (Y%)
   - Replies: X (Y%)
   - Bounces: X (Y%)
   - Spam Complaints: X

3. DELIVERABILITY:
   - Deliverability Score: X/100
   - Bounce Rate: X% (Ziel: <2%)
   - Spam Rate: X% (Ziel: <0.1%)

4. MEETINGS (diese Woche):
   - Gebucht: X
   - Show-Up Rate: X%
   - No-Shows: X

5. ACTION ITEMS:
   - [Bounce Rate >2%: Liste cleanen]
   - [Spam Complaint: Lead XYZ in DNC, analysieren]
   - [Hot Lead replied: Account Manager informieren]

OUTPUT: Email an laurenz@kontaktmanufaktur.de + Slack #kunde-alerts
```

**Automatisierung:**
- Zapier/Make: Instantly API → Google Sheets → Auto-Email
- Oder: Custom Script (Python + Instantly API)

---

## 7.4 Wöchentlicher Report an Kunden

**Jeden Montag 10 Uhr:**

### Email-Template (an Kunden)

```
Betreff: KontaktManufaktur Weekly Report — KW [X]

Guten Tag [Ansprechpartner],

hier Ihr wöchentlicher Update zur Outreach-Kampagne.

📊 KEY METRICS (KW [X], [Datum-Datum]):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Emails Sent:            250
📖 Open Rate:              58% ↑ (Benchmark: 50%)
💬 Reply Rate:             4.2% ↑ (Benchmark: 3%)
✅ Positive Replies:       8
📅 Meetings Booked:        3 ✅ (Ziel: 3-5/Woche)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 HIGHLIGHTS:
• Best Reply: [Firma X] — CEO antwortete innerhalb 2h, Meeting für Do 14 Uhr
• Top-Performing Template: Variante B (Funding-Hook) — 6.5% Reply Rate
• Signal-Typ "Series A Funding" performt am besten (8% Reply Rate)

⚠️ ISSUES & ACTIONS:
• Bounce Rate bei 1 Domain erhöht (2.8%) → DNS-Check durchgeführt, jetzt wieder normal
• 1 Opt-Out Request → Lead in DNC, kein Problem

📅 GEBUCHTE MEETINGS (diese Woche):
1. [Firma A] — [Name, Titel] — Di 10 Uhr — [Briefing-Doc Link]
2. [Firma B] — [Name, Titel] — Do 14 Uhr — [Briefing-Doc Link]
3. [Firma C] — [Name, Titel] — Fr 11 Uhr — [Briefing-Doc Link]

📈 NEXT WEEK:
• Skalierung auf 300 Emails (aktuelles Volumen gut performt)
• Neue ICP-Segment "Logistik-Software" testen (20 Leads)
• A/B-Test: Subject Line Variante D

📊 LIVE DASHBOARD:
[Instantly Dashboard Link — Read-Only Zugang]

Fragen? Jederzeit melden.

Beste Grüße
[Account Manager Name]
KontaktManufaktur
```

**Attachments:**
- `weekly-report-kw[X].pdf` (schönes PDF aus Template, optional)

---

## 7.5 Reply Handling Workflow (SOP)

**Ziel:** Jede Reply binnen 2h (während Geschäftszeiten 9-18 Uhr)

### Inbox Management (siehe Playbook v2, Section 9)

**Tools:**
- **Instantly Unibox:** Zentraler Inbox für alle 5 Email-Accounts
- **Oder:** Gmail Shared Inbox (alle Accounts forwarden an team@kontaktmanufaktur.de)

**Verantwortlich:** Account Manager (primär) + Backup (Ops Lead)

### Reply-Kategorisierung & Templates (aus Playbook v2)

**1. INTERESSIERT → Terminvereinbarung**

**Antwort:**
```
Betreff: Re: [Original]

Guten Tag [Name],

freut mich sehr! Wie wäre es mit einem kurzen 15-Minuten-Call diese Woche?

Hier ein paar Vorschläge:
• Dienstag, 10:00 Uhr
• Mittwoch, 14:00 Uhr
• Donnerstag, 11:00 Uhr

Oder nutzen Sie gerne direkt meinen Kalender:
[Calendly/HubSpot Meetings Link]

Beste Grüße
[Name]
[Kunde-Signatur]
```

**WICHTIG:**
- Calendly-Link ERST in Antwort (nicht in Cold Email → Spam-Risiko)
- Kunde/Sales-Team SOFORT informieren (Slack/Email: "Hot Lead, Meeting geplant")

**2. MEHR INFO → Kurze Antwort + Material**

**Antwort:**
```
Guten Tag [Name],

gerne! Kurz zusammengefasst:
[2-3 Bullet Points Value Prop]

Hier ein Case Study von [ähnlicher Kunde]:
[Link oder Attachment]

Lohnt sich ein kurzer Call um Details zu besprechen?

Beste Grüße...
```

**3. NICHT INTERESSIERT → Höflich beenden**

```
Danke für die Rückmeldung, [Name]. Ich wünsche Ihnen weiterhin viel Erfolg!

Beste Grüße...
```
→ DNC-Liste SOFORT

**4. BESCHWERDE/GENERVT → Nicht antworten**

→ DNC SOFORT  
→ Intern analysieren: Warum genervt? Lead-Quality? Template zu aggressiv?

**5. OUT OF OFFICE**

→ CRM: Reminder für 2 Tage nach Rückkehr  
→ Dann: Follow-Up

---

## 7.6 Meeting-Übergabe Prozess

**Sobald ein Meeting gebucht ist:**

1. **Briefing-Doc erstellen** (pro Meeting):
   - Lead-Name, Firma, Titel
   - Signal das zur Kontaktaufnahme führte
   - Email-Verlauf (was wurde geschrieben, was geantwortet)
   - Personalisierungs-Hooks (worüber reden?)
   - ICP-Score + Einschätzung

2. **Kalender-Einladung** an Kunde + Lead
   - Kunde als Host
   - Wir im CC (nur wenn Kunde das will)
   - Meeting-Link (Kunde's Tool: Zoom/Teams/Google Meet)

3. **24h vor Meeting:** Reminder an Kunden mit Briefing-Doc

4. **Nach Meeting:** Feedback vom Kunden einholen
   - "Wie war die Qualität des Leads?"
   - "Passt der ICP?"
   - "Gibt es Follow-Up?"

---

# PHASE 8: LAUFENDER BETRIEB

**Dauer:** Ab Go-Live, ongoing
**Automatisierungsgrad:** 🟡 70% automatisiert

---

## 8.1 Weekly Report an Kunden

Jeden Montag, automatisch generiert:

| Metrik | Diese Woche | Gesamt |
|---|---|---|
| Emails gesendet | X | X |
| Open Rate | X% | X% |
| Reply Rate | X% | X% |
| Positive Replies | X | X |
| Meetings gebucht | X | X |
| Bounce Rate | X% | X% |

Plus:
- Qualitative Zusammenfassung (welche Signals, welche Firmen)
- Adjustments die wir gemacht haben
- Empfehlungen für nächste Woche

**EMPFEHLUNG:** Report per Email + kurzer Loom-Video (2 Min) für persönliche Note.

## 8.2 Monthly Deep Dive

Einmal pro Monat, 30-Min Call mit Kunde:

- KPI-Review (Trends, nicht nur Zahlen)
- ICP-Adjustments (was funktioniert, was nicht)
- Email-Template Optimierung (A/B Test Ergebnisse)
- Quellen-Performance (welche Quellen liefern beste Leads)
- Pipeline-Forecast (erwartete Meetings nächster Monat)
- Feedback-Einarbeitung (Lead-Qualität, Meeting-Qualität)

## 8.3 Ongoing Optimierung

**Kontinuierlich:**
- Email A/B Tests (Subject Lines, CTAs, Opener)
- ICP-Sharpening basierend auf Reply-Daten
- Quellen-Liste anpassen (Top-Quellen mehr, schlechte raus)
- DNC-Liste pflegen
- Deliverability monitoren (Bounce Rate, Spam Score)

---

# PHASE 9: ESCALATION MANAGEMENT

**Trigger:** KPIs unter Benchmark nach 4+ Wochen

---

## 9.1 Performance Benchmarks

| KPI | Grün ✅ | Gelb ⚠️ | Rot 🔴 |
|---|---|---|---|
| Open Rate | >50% | 30-50% | <30% |
| Reply Rate | >5% | 2-5% | <2% |
| Positive Reply Rate | >30% | 15-30% | <15% |
| Bounce Rate | <2% | 2-5% | >5% |
| Meetings/Monat | >5 | 2-5 | <2 |

## 9.2 Eskalationsstufen

**Stufe 1 — Gelb (2 Wochen unter Benchmark):**
- Interne Analyse (Deliverability? Templates? ICP?)
- Adjustments implementieren
- Kunde informieren: "Wir optimieren gerade X"

**Stufe 2 — Rot (4 Wochen unter Benchmark):**
- Notfall-Call mit Kunde
- Root Cause Analyse präsentieren
- Aktionsplan mit Timeline
- Optionen: ICP wechseln, Templates komplett neu, Domain prüfen

**Stufe 3 — Kritisch (6+ Wochen unter Benchmark):**
- Ehrliches Gespräch: "Dieser ICP funktioniert nicht via Cold Email"
- Optionen: Pivot, Pause, Vertrag auflösen
- Keine Kosten für Monate ohne Ergebnis (Goodwill)

## 9.3 Sofort-Eskalation (unabhängig von Timeline)

- **Bounce Rate >5%:** Sofort Sending stoppen, Liste prüfen, Domain checken
- **Spam Complaint:** Sofort Sending stoppen, Template + Liste analysieren
- **Blacklisted:** Domain wechseln, Kunde informieren, 0-Kosten bis gelöst
- **Abmahnung/Rechtsanwalt:** Sofort Sending stoppen, Laurenz informieren, Rechtsberatung

---

# PHASE 10: OFFBOARDING

**Trigger:** Kunde kündigt oder Vertrag läuft aus
**Dauer:** 5-10 Werktage

---

## 10.1 Offboarding Checklist

### Sofort (Tag 1):
- [ ] Alle Campaigns in Instantly stoppen
- [ ] Keine neuen Leads mehr generieren
- [ ] Offene Replies noch beantworten (max 5 Tage)

### Daten & Domain (Tag 2-5):
- [ ] Abschluss-Report erstellen (gesamte Zusammenarbeit, KPIs, Learnings)
- [ ] Lead-Daten exportieren und an Kunden übergeben (CSV)
- [ ] Domain-Ownership an Kunden übertragen ODER Domain stilllegen
- [ ] Kunden-Daten aus unseren Systemen löschen (DSGVO Art. 17)
- [ ] DNC-Liste BEHALTEN (die brauchen wir weiterhin)

### Instantly Workspace (Tag 3-5):
- [ ] Alle Daten exportieren
- [ ] Workspace an Kunden übertragen (wenn gewünscht) ODER löschen
- [ ] Email-Accounts stilllegen

### Abschluss (Tag 5-10):
- [ ] Exit-Interview (5 Min): Was lief gut? Was nicht? Warum Kündigung?
- [ ] Letzte Rechnung stellen
- [ ] Löschbestätigung an Kunden senden (DSGVO-Nachweis)
- [ ] Intern: Learnings dokumentieren für Prozessverbesserung

## 10.2 Abschluss-Report Template

```
# Abschluss-Report — [Kundenname]

## Zusammenarbeit: [Start] bis [Ende]
## ICP: [Beschreibung]

## Ergebnisse Gesamt:
- Emails gesendet: X
- Open Rate: X%
- Reply Rate: X%
- Meetings gebucht: X
- Show-Up Rate: X%
- Cost per Meeting: €X

## Top Quellen:
1. [Quelle] — X Leads, X% Hot-Rate
2. [Quelle] — X Leads, X% Hot-Rate

## Was funktioniert hat:
- [Punkt 1]
- [Punkt 2]

## Was nicht funktioniert hat:
- [Punkt 1]
- [Punkt 2]

## Empfehlung für Kunden (wenn sie selbst weitermachen):
- [Empfehlung]
```

---

# TIMELINE ZUSAMMENFASSUNG

| Phase | Dauer | Kumuliert |
|---|---|---|
| Phase 0: Pre-Onboarding | 1-2 Tage | Tag 1-2 |
| Phase 1: Vertrag | 2-5 Tage | Tag 3-7 |
| Phase 2: Briefing | 1-2 Tage | Tag 4-9 |
| Phase 3: Domain & Infra | 1-2 Tage Setup + 14-21 Tage Warmup | Tag 5-30 |
| Phase 4: ICP & Signals | 1-2 Tage (parallel zu Warmup) | — |
| Phase 5: Emails | 2-3 Tage (parallel zu Warmup) | — |
| Phase 6: Soft Launch | 3-5 Tage | Tag 21-35 |
| Phase 7: Go-Live | Ongoing | Ab Tag 25-35 |

**Kritischer Pfad: 25-35 Tage** von Vertragsunterschrift bis erste Emails.
**Bottleneck: Domain-Warmup** (14-21 Tage, nicht beschleunigbar).

**EMPFEHLUNG:** Domain-Kauf + Warmup am Tag 1 nach Vertragsunterschrift starten, parallel Briefing + ICP + Templates entwickeln.

---

# ENTSCHEIDUNGEN FÜR LAURENZ — ZUSAMMENFASSUNG

1. **AV-Vertrag:** activeMind Template nutzen oder Anwalt? → EMPFEHLUNG: Template für erste 3 Kunden, Anwalt ab Kunde 5+
2. **Fragebogen-Tool:** Typeform (€25/Mo), Tally (kostenlos), oder Google Forms? → EMPFEHLUNG: Tally (kostenlos, gut genug)
3. **Domain-Registrar:** Namecheap oder Cloudflare? → EMPFEHLUNG: Cloudflare (günstigste Renewals)
4. **Instantly Plan:** Growth (€37/Mo) oder Hyper Growth (€97/Mo)? → EMPFEHLUNG: Growth für erste 2 Kunden, Hyper Growth ab 3+
5. **Cyber-Haftpflicht:** Ja oder Nein? → EMPFEHLUNG: Ja, ab Kunde 3+ (€500-€2.000/Jahr)
6. **Report-Format:** Email, Loom, Dashboard? → EMPFEHLUNG: Email + Loom (2 Min) weekly