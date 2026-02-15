# Review Report — KontaktManufaktur Dokumentation
**Stand:** 15. Februar 2026  
**Reviewer:** Hektor Sub-Agent  
**Bewertungskriterien:** Simplicity First, rechtliche Compliance, Praxis-Tauglichkeit

---

## 1. Executive Summary

Das System ist **prinzipiell ready für den ersten Kunden**, hat aber klare **Overengineering-Symptome**. Die Dokumente sind zu detailliert, zu viele Phasen, zu viele Felder, zu viele Prompts die in der Praxis nie so genutzt werden. **70% der Komplexität kann gestrichen werden** ohne Qualitätsverlust. Die rechtlichen Dokumente (AV-Vertrag, Dienstleistungsvertrag) sind solide. Das größte Problem: Kein Kunde wird 9 Onboarding-Phasen durchlaufen oder 30+ Fragebogen-Fragen beantworten. **Empfehlung:** Radikal vereinfachen, dann starten.

---

## 2. Dokument-für-Dokument Review

### 2.1 `CONTEXT.md`

#### ✅ Gut
- Klare Übersicht über Dokumente + Status
- Entscheidungslog (Payment per Meeting, 5 ICPs, etc.)
- Referenz zu Original-Quellen

#### ❌ Zu kompliziert / Streichen
- **"Offene Tasks" Sektion veraltet** — Customer Onboarding v2 ist fertig, AV-Vertrag fertig, Hunter Setup Template fertig → Tasks-Liste ist obsolet
- **Zu viele Stati** — "In Arbeit", "Fertig", "Draft fertig, reviewed" verwirren. Entweder fertig oder nicht.

#### 🔍 Fehlt
- **Kein Link zum Simplified Workflow** — wo ist das eine Dokument das zeigt: "So läuft's ab"?
- **Keine Priorisierung** — Was MUSS Kunde 1 haben? Was kann warten?

#### 💡 Empfehlung
- **Streichen:** "Offene Tasks" Sektion (alles erledigt)
- **Ergänzen:** "Ready for Customer 1" Checklist (5 Zeilen, was wirklich nötig ist)
- **Klarstellen:** CONTEXT.md = Index, kein Action-Log

---

### 2.2 `customer-onboarding-v2.md`

#### ✅ Gut
- Klare Timeline (21-30 Tage bis erste Emails)
- Preis-Transparenz (€34-62 operativ, Payment per Meeting)
- Domain-Warmup als kritischer Pfad klar kommuniziert
- Email-Templates für Kunden-Kommunikation

#### ❌ Zu kompliziert / Overengineered

**PHASE 0: PRE-ONBOARDING**
- ❌ **"Handoff-Meeting"** — Für Kunde 1 (Laurenz = Sales + Delivery) ist das überflüssig. Streichen.
- ❌ **Kick-off Email Template zu lang** — 200 Wörter für "Los geht's". Kürzen auf 50.
- ❌ **Projekt-Struktur anlegen** (7 Unterordner) — Overkill für Kunde 1. Reicht: `/kunde1/leads.csv`, `/kunde1/onboarding.md`.

**PHASE 1: VERTRAG**
- ❌ **5-Seiten Vertrags-Summary im Onboarding** — Gehört nicht hierhin. Verweis auf `dienstleistungsvertrag-template.md` reicht.
- ✅ **Domain-Ownership** gut erklärt (Kunde kauft).

**PHASE 2: KUNDEN-BRIEFING**
- ❌ **30+ Fragen im Fragebogen** (siehe Section 2.10) — Zu viel für ersten Kunden. Auf 10-12 Pflichtfragen kürzen.
- ❌ **Competitive Research (2-4 Stunden)** — Nice to have, aber nicht für Kunde 1 nötig. Verschieben auf "nach 3 Meetings".
- ❌ **Briefing-Review Call (60 Min)** — 30 Min reichen. Erste Kunden sind experimentierfreudig, nicht ultra-detailliert.

**PHASE 3: DOMAIN & INFRASTRUKTUR**
- ✅ **Domain-Setup Optionen klar** (A: Kunde kauft, B: Wir kaufen treuhänderisch).
- ✅ **Google Workspace Setup** Schritt-für-Schritt OK.
- ❌ **DNS-Records Beispiel-Code zu technisch** — Verweis auf `domain-setup-anleitung-kunden.md` reicht. Nicht doppelt erklären.
- ✅ **Warmup-Zeitplan** klar.

**PHASE 4: ICP & KAMPAGNEN-SETUP**
- ❌ **"Hunter Setup Template anpassen und deployen"** — Was heißt "deployen"? Kunde versteht das nicht. Schreiben: "Wir richten Hunter ein".
- ❌ **"Signal-Research starten"** zu vage — Was passiert genau? Wie lange dauert's?
- ✅ **Email-Templates Freigabe durch Kunde** — wichtig, gut.

**PHASE 5: SOFT LAUNCH**
- ❌ **"Iteration (max 2 Runden)"** — Für Kunde 1 unrealistisch. Erste Email wird funktionieren oder nicht. Kein A/B-Testing bei 10 Emails.
- ✅ **KPIs (Open >50%, Bounce <2%)** klar definiert.

**PHASE 6-9: GO-LIVE, LAUFEND, REVIEW, OFFBOARDING**
- ✅ **Go-Live Email-Template** OK.
- ✅ **Wöchentliche Updates** Template OK.
- ❌ **Monatliche Performance Review (60 Min Call)** — Für Kunde 1-3 Overkill. 30 Min reichen.
- ❌ **Offboarding Phase 9** — Für erstes Dokument irrelevant. In separates Doc auslagern.

#### 🔍 Fehlt
- **Was wenn Kunde die Domain-Anleitung nicht schafft?** Fallback fehlt.
- **Was wenn Warmup nicht klappt?** (Deliverability <85%) — Eskalationsprozess fehlt.

#### 💡 Simplification-Empfehlungen
1. **Streichen:** Phase 0 (Handoff-Meeting), Competitive Research (verschieben), Phase 9 (Offboarding in separates Doc)
2. **Kürzen:** Vertragliche Details raus (Verweis genügt), Email-Templates auf 50 Wörter
3. **Zusammenlegen:** Phase 4+5 (Setup & Test) — sind eigentlich eins
4. **Ersetzen:** "Hunter deployen" → "Wir richten die Kampagne ein"
5. **Reduzieren:** 9 Phasen → **5 Phasen** (Vertrag, Briefing, Domain+Warmup, Kampagne, Go-Live)

---

### 2.3 `hunter-setup-template.md`

#### ✅ Gut
- Klare Struktur pro Kunde
- JSON-ICP-Definition wiederverwendbar
- Verweis auf Playbook v2 als Source of Truth

#### ❌ Zu kompliziert / Overengineered

**SECTION 1: KUNDEN-KONTEXT**
- ✅ ICP-Definition (JSON) gut.
- ❌ **Tone of Voice Beispiel-Formulierungen** — Für ersten Kunden übertrieben. Reicht: "Du/Sie" + "Locker/Förmlich".

**SECTION 2: SIGNAL DETECTION**
- ❌ **Quellen-Liste mit 10+ Quellen pro ICP** — Hunter wird nicht 10 Quellen parallel checken. Für Kunde 1: **3 Top-Quellen** reichen.
- ❌ **Signal Scanner Prompt 50 Zeilen lang** — Hunter wird das nie 1:1 nutzen. Kürzen auf 20 Zeilen.

**SECTION 3: LEAD ENRICHMENT**
- ❌ **4 separate Agent-Prompts** (Website Scraper, LinkedIn Research, Content Scraper, Data Compiler) — Für Kunde 1 unrealistisch. Hunter macht das manuell oder mit einem Prompt.
- ✅ **CSV Schema** OK, aber...
- ❌ **25 Felder im CSV** (lead_id, icp_type, date_detected, signal_type, signal_strength, company_name, website, branche, standort, team_size, kontakt_name, kontakt_titel, kontakt_email, email_verified, kontakt_linkedin, signal_source_url, content_hook, pain_point_evidence, personalization_brief, lead_score, pipeline_stage, email_1_sent, email_1_date, email_1_opened, notes) — **Overkill.** Für Kunde 1 reichen: company_name, website, kontakt_name, kontakt_email, signal_type, personalisierungs_hook, notes. **12 Felder streichen.**

**SECTION 4: EMAIL DISCOVERY & VALIDATION**
- ✅ Hunter.io + DeBounce Prompts OK.
- ❌ **Budget-Tracking täglich** — Für Kunde 1 Overhead. Wöchentlich reicht.

**SECTION 5: OUTREACH**
- ✅ **Email Templates** werden im Onboarding mit Kunde erstellt — gut.
- ❌ **Signatur mit Adresse** — OK, aber warum zweimal (hier + Playbook v2)?
- ❌ **Instantly Kampagnen-Setup** zu detailliert (Sendezeiten, Sequenz, Tracking) — Verweis auf Playbook reicht.

**SECTION 6: REPLY HANDLING**
- ❌ **Inbox Management Prompt** 40 Zeilen — zu lang. Kürzen auf 15 Zeilen (Kategorien + Action).
- ✅ **Meeting-Briefing Generator** Prompt gut.

**SECTION 7: REPORTING**
- ❌ **Daily KPIs (18 Uhr Report)** — Für Kunde 1 Overhead. Wöchentlich reicht.
- ✅ **Weekly Report Email-Template** OK.

**SECTION 8: KUNDEN-SPEZIFISCHE REGELN**
- ✅ **DNC-Liste, No-Gos, Budget-Limits** — wichtig, gut.

#### 🔍 Fehlt
- **Was ist der Minimal-Setup?** — "Hunter Setup in 30 Minuten" fehlt. Alles zu komplex.

#### 💡 Simplification-Empfehlungen
1. **Streichen:** 4 separate Enrichment-Prompts → 1 Prompt "Lead Research" (kombiniert)
2. **Reduzieren:** CSV-Schema von 25 auf **13 Pflichtfelder**
3. **Kürzen:** Signal Scanner Prompt auf 20 Zeilen
4. **Zusammenlegen:** Section 5 (Outreach) + Section 6 (Reply) = "Email Workflow"
5. **Verschieben:** Daily KPIs → Weekly Reports

---

### 2.4 `kontaktmanufaktur-playbook-v2.md`

#### ✅ Gut
- **5 ICPs klar definiert** (MedTech, SaaS, Logistik, Agenturen, Franchise)
- **Scoring-Matrix standardisiert** (Freshness 25, Strength 25, ICP Fit 20, Personal 15, Email 15)
- **Compliance-Regeln** oben (Impressum, max 50/Tag, kein Opt-Out)
- **Email-Templates pro ICP** konkret und nutzbar
- **Quellen-Liste pro ICP** hilfreich

#### ❌ Zu kompliziert / Overengineered

**SECTION 1: ICPS**
- ✅ **5 ICPs gut definiert**
- ❌ **Zu viel Detail** (z.B. MedTech: 6 Buying Triggers, 4 Pain Points, 3 Personalisierungs-Ansätze) — Für Kunde 1 reichen **3 Triggers, 2 Pains, 1 Beispiel-Email**.

**SECTION 2: LEAD SCORING MATRIX**
- ✅ **Scoring (100 Punkte)** klar.
- ❌ **Pflichtfelder-Liste (13 Felder)** — Redundant zu CSV Schema in Hunter Setup Template. Einmal definieren, nicht dreimal.

**SECTION 3: SIGNAL DETECTION**
- ❌ **10+ Quellen pro ICP** — Unrealistisch. Für Kunde 1: **3 Top-Quellen pro ICP** (highest ROI).
- ❌ **Signal Scanner Universal-Prompt** 60 Zeilen — zu lang, Hunter wird das nicht nutzen.
- ✅ **Quellen-Performance Tracking** — gute Idee, aber erst ab Kunde 2+.

**SECTION 4: DATA SCRAPING**
- ❌ **Multi-Agent Pipeline (5 Agents: Coordinator, Website Scraper, LinkedIn Research, Content Scraper, Data Compiler)** — **Massives Overengineering.** Für Kunde 1-5 macht Laurenz/Hektor das manuell oder mit 1 Prompt. Multi-Agent-System erst ab 10+ Kunden nötig.
- ❌ **CSV Schema 25 Felder** (siehe 2.3) — zu viel.

**SECTION 5-6: EMAIL DISCOVERY & VALIDATION**
- ✅ **Hunter.io + DeBounce Prompts** OK.

**SECTION 7: DOMAIN & INFRASTRUKTUR**
- ✅ **Domain Setup Anleitung** gut (aber doppelt mit `domain-setup-anleitung-kunden.md` — siehe Konsistenz).
- ❌ **DNS Checklist (7 Punkte)** — Gut gemeint, aber zu technisch für dieses Dokument. Verweis auf separate Anleitung reicht.

**SECTION 8: COLD EMAILS**
- ✅ **Templates pro ICP** gut, nutzbar.
- ❌ **5 × 2 Templates (10 Email-Varianten)** — Für Kunde 1 reichen **2 Templates** (Funding + Generic). Rest iterativ.

**SECTION 9: INBOX MANAGEMENT**
- ✅ **Kategorisierung (6 Typen)** klar.
- ❌ **Prompt zu lang** (40 Zeilen) — kürzen auf 20.

**SECTION 10: DATENMANAGEMENT**
- ❌ **Google Sheets Sync Agent** — Nice to have, aber für Kunde 1 **nicht nötig**. CSV reicht. Google Sheets ab Kunde 3+.

**SECTION 11: PERFORMANCE DASHBOARD**
- ❌ **Dashboard Agent (täglich 18 Uhr Report)** — Overkill für Kunde 1. Wöchentlich reicht.
- ✅ **Metriken-Tabelle** klar.

**SECTION 12-13: PITCH & PRICING**
- ✅ **"Erste 3 Meetings gratis"** gut erklärt.
- ✅ **Pricing Matrix** klar (€200-€600 je ICP).

**APPENDIX A: PROMPT LIBRARY**
- ✅ Übersicht gut.

**APPENDIX B: TROUBLESHOOTING**
- ✅ Hilfreich.

#### 🔍 Fehlt
- **Quick Start Guide** — "So startest du in 3 Tagen" fehlt. Alles zu detailliert, kein Einstieg.

#### 💡 Simplification-Empfehlungen
1. **Streichen:** Multi-Agent Pipeline (Section 4), Google Sheets Sync (Section 10), Daily Dashboard (Section 11)
2. **Reduzieren:** Quellen pro ICP von 10+ auf **3**, Email Templates von 10 auf **2 pro ICP**
3. **Kürzen:** Alle Prompts auf max 25 Zeilen
4. **Ergänzen:** "Quick Start — Erste Kampagne in 3 Tagen" (2 Seiten, keine Details)

---

### 2.5 `ICP-definitions-v1.md`

#### ✅ Gut
- **5 ICPs klar beschrieben**
- **Buying Signals pro ICP**
- **Personalisierungs-Ansätze** konkret
- **Vergleichsmatrix** am Ende hilft bei Entscheidung

#### ❌ Zu kompliziert / Redundant
- ❌ **Redundant zu Playbook v2 Section 1** — Exakt gleiche Inhalte, nur anderes Format. **Eines der beiden Dokumente streichen** oder zusammenlegen.
- ❌ **"Nächste Schritte" Sektion veraltet** — "Hunter konfigurieren", "Autonome Suche" → Das steht schon im Playbook. Verwirrt nur.

#### 🔍 Fehlt
- **Welcher ICP für welchen Kunden?** — Empfehlungslogik fehlt (z.B. "Wenn Kunde SaaS verkauft → ICP 2: B2B SaaS Startups targeten").

#### 💡 Empfehlung
- **Zusammenlegen** mit Playbook v2 Section 1 **ODER**
- **ICP-definitions-v1.md** als **standalone Quick Reference** (1 Seite pro ICP, A4-druckbar)
- **Streichen:** "Nächste Schritte" (gehört nicht hierhin)

---

### 2.6 `scoring-matrix.md`

#### ✅ Gut
- **Kompakt (1 Seite)**
- **Klar definiert** (Freshness 25, Strength 25, ICP Fit 20, Personal 15, Email 15)
- **Pflichtfelder-Liste** OK

#### ❌ Redundant
- ❌ **Exakt identisch zu Playbook v2 Section 2** — Wozu separates Dokument?

#### 🔍 Fehlt
- Nichts.

#### 💡 Empfehlung
- **Streichen** als separates Dokument **ODER**
- **Nutzen als Cheat Sheet** (Ausdrucken, neben Bildschirm legen) — dann OK

---

### 2.7 `av-vertrag-template.md`

#### ✅ Gut
- **Vollständig (Art. 28 DSGVO konforme Struktur)**
- **TOMs detailliert** (11 Punkte: Zutrittskontrolle, Zugangskontrolle, etc.)
- **Sub-Processors aufgelistet** (Instantly, Hunter, DeBounce, Google, Anthropic)
- **Praktisch nutzbar** (Lücken für Kundendaten)

#### ❌ Zu kompliziert / Overkill für Einzelunternehmer?

**Vertrag selbst:**
- ✅ **Rechtlich solide** — activeMind AG Muster als Basis gut.
- ❌ **10 Seiten für Einzelunternehmer?** — Ja, aber **notwendig** (DSGVO verlangt das). Nicht kürzen.

**ANLAGE 1: TOMs**
- ✅ **11 Maßnahmen** sind Standard (Zutrittskontrolle, Verschlüsselung, etc.).
- ❌ **"Kein Fernzugriff auf Lead-Datenbanken"** — Widerspruch: Hektor (auf Mac mini) greift auf Daten zu. Klarstellen: "Nur Laurenz + Hektor (autorisierter Agent)".

**ANLAGE 2: SUB-PROCESSORS**
- ✅ **5 Sub-Processors aufgelistet** (Instantly, Hunter, DeBounce, Google, Anthropic).
- ❌ **Anthropic (Claude AI via OpenClaw)** — **Rechtlich grau:** Anthropic ist kein "Sub-Processor" im klassischen Sinn, wenn Daten nicht persistent gespeichert werden. **Klarstellung nötig:** "KI-Assistenz zur Datenverarbeitung, keine dauerhafte Speicherung".

#### 🔍 Fehlt
- **Was wenn Sub-Processor ändert?** — Prozess ist beschrieben (14 Tage Vorankündigung), aber **Muster-Email fehlt**.

#### 💡 Empfehlung
- **Behalten** (rechtlich notwendig).
- **Klarstellen:** Anthropic-Rolle (KI-Assistenz, keine Datenspeicherung).
- **Ergänzen:** Muster-Email "Änderung Sub-Processor" (50 Wörter).

---

### 2.8 `dienstleistungsvertrag-template.md`

#### ✅ Gut
- **Präambel klar** (Was macht Laurenz, was will Kunde)
- **§1 Leistungsumfang** detailliert (6 Punkte: Lead-Recherche, Email-Findung, Kampagnen, Reply Handling, Meeting-Übergabe, Reporting)
- **§2 Vergütung** transparent (Pay-per-Meeting, Proof of Concept 3 gratis)
- **§3 Laufzeit** realistisch (3 Monate Mindestlaufzeit, dann 30 Tage Kündigung)
- **§4-5 Pflichten** beider Seiten klar
- **§6 Haftung** begrenzt (Gesamtwert letzte 3 Monate)
- **§7 Compliance** (persönliche Geschäftsanbahnung, max 50/Tag)
- **§10 Schlussbestimmungen** vollständig

#### ❌ Zu kompliziert / Overkill?

**§1 Leistungsumfang:**
- ✅ **6 Punkte** sind OK, nicht zu viel.
- ❌ **"Google Sheets Dashboard"** erwähnt — Aber im Playbook v2 steht: Google Sheets ab Kunde 3+. **Inkonsistenz.**

**§2.3 Definition "qualifiziertes Meeting":**
- ✅ **3 Kriterien** klar (erscheint, passt ICP, ist Entscheider).

**§6.3 Haftung Spam-Beschwerden:**
- ✅ **Freistellung wenn Compliance eingehalten** — rechtlich sauber.

**§10.6 Anlagen:**
- ❌ **"Anlage 1: AV-Vertrag"** erwähnt, aber **keine Anlage 2** definiert. Sauber wäre: "Anlage 1: AV-Vertrag, Anlage 2: ICP-Definition". Aktuell nur Verweis auf AV-Vertrag.

#### 🔍 Fehlt
- **Was wenn Kunde Domain nicht bereitstellt?** — Sonderkündigungsrecht fehlt.
- **Was wenn Payment nach 3 Gratis-Meetings abgelehnt wird?** — Regelung fehlt (kann der Kunde einfach gehen?).

#### 💡 Empfehlung
- **Ergänzen:** §3.3 "Falls Kunde nach Proof of Concept nicht fortsetzt, endet Vertrag automatisch (keine Kündigungsfrist nötig)".
- **Klarstellen:** Dashboard = "Web-basiert" (nicht "Google Sheets" erwähnen, falls noch nicht umgesetzt).
- **Ergänzen:** §5.1 "Falls Domain nicht binnen 14 Tagen bereitgestellt, kann Auftragnehmer ohne Frist kündigen".

---

### 2.9 `domain-setup-anleitung-kunden.md`

#### ✅ Gut
- **Non-Tech-Friendly** (Schritt-für-Schritt, Screenshots-freundlich)
- **Cloudflare empfohlen** (günstig, gut)
- **Google Workspace Setup** detailliert
- **DNS-Records (SPF, DKIM, DMARC)** erklärt
- **Zugangsdaten-Übergabe** mit Sicherheitshinweisen (kein Email, verschlüsselt)
- **Timeline "Was passiert jetzt?"** beruhigt Kunden

#### ❌ Zu kompliziert / Zu lang

**Gesamtlänge:**
- ❌ **~1200 Zeilen (ca. 35 Seiten A4)** — **VIEL zu lang.** Kein Kunde liest das. **Ziel: max 10 Seiten.**

**Schritt 1: Domain kaufen:**
- ✅ **Cloudflare + Namecheap** gut erklärt.
- ❌ **Beide Optionen vollständig erklärt** — Besser: **Nur Cloudflare** (empfohlen), Namecheap in Appendix.

**Schritt 2: Google Workspace:**
- ✅ **2.1-2.5** gut strukturiert.
- ❌ **2.4 "Zwei weitere Email-Adressen erstellen"** — Zu detailliert (5 Unterabschnitte). Kürzen auf: "Wiederhole für `hello@` und `team@`".

**Schritt 3: DNS-Records:**
- ✅ **SPF, DKIM, DMARC** gut erklärt.
- ❌ **3.2 DKIM** 3 Unterabschritte — zu kleinteilig. Zusammenfassen.
- ❌ **3.4 DNS-Records überprüfen** (9 Records auflisten) — Verwirrt mehr als hilft. Besser: "Test-Email senden".

**Schritt 4: Zugangsdaten:**
- ✅ **Sicherheit betont** (nicht per Email).
- ❌ **3 Optionen (Passwort-Manager, Messenger, Sharing-Tool)** — Zu viel Wahl. Besser: **1 Empfehlung** (z.B. "Nutze Signal oder WhatsApp").

**Schritt 5: Was jetzt?**
- ✅ **Timeline klar** (Tag 1: Warmup, Tag 21: Go-Live).

**FAQ:**
- ✅ **8 Fragen** hilfreich.
- ❌ **Zu viele** — auf 5 kürzen (häufigste).

#### 🔍 Fehlt
- **Video-Tutorial** — Für Non-Tech-Kunden wäre ein 10-Min-Video (Loom) effektiver als 35 Seiten Text.
- **"Ich komme nicht weiter"-Button** — Direkter Support-Link fehlt (sollte auf jeder Seite sein).

#### 💡 Simplification-Empfehlungen
1. **Kürzen von 35 auf 10 Seiten** — Nur Cloudflare (Namecheap in Appendix), Details in Sublinks
2. **Schritt-Zähler** statt Fließtext (z.B. "Schritt 3/8: DKIM aktivieren")
3. **Video-Tutorial** produzieren (10 Min Loom), Link oben im Dokument
4. **FAQ auf 5 Fragen kürzen** (häufigste)
5. **Support-Button** auf jeder Seite ("Hilfe? → Signal/WhatsApp +49...")

---

### 2.10 `onboarding-fragebogen.md`

#### ✅ Gut
- **7 Sektionen logisch** (Firma, Produkt, ICP, Kommunikation, Vertrieb, Technisches)
- **Beispiele bei jeder Frage** — hilft Kunden
- **Zeitangabe (10-15 Min)** — realistisch (aber siehe unten)

#### ❌ Zu kompliziert / Zu viele Fragen

**Gesamtzahl Fragen:**
- ❌ **37 Fragen** (davon 20 Pflichtfelder) — **VIEL zu viel.** Kunde braucht realistisch **30-40 Min**, nicht 10-15.
- ❌ **Erste Kunden sind experimentierfreudig** — Die brauchen kein 37-Fragen-Briefing. Die wollen schnell starten.

**SEKTION 1: FIRMA (5 Fragen)**
- ✅ OK.

**SEKTION 2: PRODUKT (6 Fragen)**
- ✅ Fragen 1-3 (Was verkaufen Sie, Preis, CLV) — gut.
- ❌ Frage 4 (USP) — **zu offen**, Kunden schreiben Roman. Besser: "Ihr Hauptvorteil in 1 Satz".
- ❌ Frage 5-6 (Case Studies, Testimonials) — **Optional**, nicht Pflicht für Kunde 1.

**SEKTION 3: ICP (8 Fragen)**
- ✅ Fragen 1-4 (Branchen, Größe, Region, Entscheider) — Pflicht.
- ❌ Frage 5-8 (DNC-Liste, Kunden-Liste, CRM-Export) — **Zu viel Detail.** Verschieben in "Phase 2" (nach Vertrag).

**SEKTION 4: KOMMUNIKATION (4 Fragen)**
- ✅ Fragen 1-2 (Du/Sie, Stil) — Pflicht.
- ❌ Frage 3-4 (No-Gos, Must-Haves) — **Nice to have**, nicht für Kunde 1 nötig.

**SEKTION 5: VERTRIEB (5 Fragen)**
- ✅ Frage 1 (Outbound ja/nein) — gut.
- ❌ Frage 2-5 (Erfahrungen, Pain Points, Einwände, Sales-Prozess) — **Zu detailliert** für ersten Fragebogen. Im Briefing-Call klären.

**SEKTION 6: TECHNISCHES (6 Fragen)**
- ✅ Fragen 1-2 (Domain, Kalender-Tool) — Pflicht.
- ❌ Frage 3-6 (Meeting-Empfang, Verfügbarkeit, CRM, Zugangsdaten) — **Zu viel**. Vereinfachen: "Wann sind Sie verfügbar?" + "Nutzen Sie Calendly/Google Cal?".

#### 🔍 Fehlt
- **Priorisierung** — Was ist Pflicht, was optional?
- **"Später ergänzen"-Option** — Kunde kann loslegen mit 50% Daten, Rest iterativ.

#### 💡 Simplification-Empfehlungen
1. **Reduzieren von 37 auf 12 Pflichtfragen:**
   - Firma (3): Name, Website, Branche
   - Produkt (2): Was verkaufen Sie, Preis
   - ICP (4): Branchen, Größe, Region, Entscheider
   - Kommunikation (2): Du/Sie, Stil
   - Technisches (1): Kalender-Tool
2. **Rest optional oder "im Briefing-Call klären"**
3. **Zweistufiger Fragebogen:** "Quick Start" (12 Fragen, 5 Min) + "Deep Dive" (optional, 20 Min)

---

## 3. Konsistenz-Probleme

### 3.1 ICPs

| Dokument | ICPs erwähnt | Konsistent? |
|----------|--------------|-------------|
| `kontaktmanufaktur-playbook-v2.md` | 5 ICPs (MedTech, SaaS, Logistik, Agenturen, Franchise) | ✅ |
| `ICP-definitions-v1.md` | 5 ICPs (identisch) | ✅ |
| `hunter-setup-template.md` | ICP-JSON (gleiche 5) | ✅ |
| `customer-onboarding-v2.md` | Pricing-Matrix (gleiche 5) | ✅ |
| `dienstleistungsvertrag-template.md` | ICP erwähnt (generisch) | ✅ |

**Ergebnis:** ✅ **Konsistent** — Alle 5 ICPs überall gleich.

---

### 3.2 Pricing

| Dokument | Pricing-Modell | Preise pro ICP | Konsistent? |
|----------|----------------|----------------|-------------|
| `customer-onboarding-v2.md` | Pay-per-Meeting, 3 gratis | MedTech €400-600, SaaS €250-400, Logistik €300-450, Agenturen €200-350, Franchise €350-500 | ✅ |
| `kontaktmanufaktur-playbook-v2.md` | Pay-per-Meeting, 3 gratis | Identische Preise | ✅ |
| `dienstleistungsvertrag-template.md` | Pay-per-Meeting, 3 gratis | Preis per Meeting (ICP-abhängig) | ✅ |

**Ergebnis:** ✅ **Konsistent** — Payment-Modell + Preise überall gleich.

---

### 3.3 Compliance-Aussagen

| Dokument | Max Emails/Tag | Opt-Out-Link | Impressum | Konsistent? |
|----------|----------------|--------------|-----------|-------------|
| `kontaktmanufaktur-playbook-v2.md` | 50 GESAMT | ❌ Kein Link | ✅ Pflicht | ✅ |
| `customer-onboarding-v2.md` | 50 GESAMT | ❌ Kein Link | ✅ Pflicht | ✅ |
| `dienstleistungsvertrag-template.md` | 50/Domain/Tag (❗) | ❌ Kein Link | ✅ Pflicht | ❌ |

**Inkonsistenz gefunden:**
- ❗ **Playbook + Onboarding:** "50 Emails/Tag GESAMT"
- ❗ **Vertrag:** "50 Emails pro Domain und Tag" (= 250 bei 5 Accounts)

**Problem:** Vertrag widerspricht Playbook. **Korrektur nötig.**

**Empfehlung:** Im Vertrag ändern zu: "Maximale Versandmenge: 50 E-Mails pro Tag (verteilt über alle genutzten Absender-Adressen)".

---

### 3.4 Domain-Setup Anleitung

| Dokument | Domain-Setup erklärt | Konsistent? |
|----------|---------------------|-------------|
| `customer-onboarding-v2.md` | Section 3.1-3.5 (6 Seiten) | ✅ |
| `domain-setup-anleitung-kunden.md` | Vollständig (35 Seiten) | ✅ (inhaltlich) |
| `kontaktmanufaktur-playbook-v2.md` | Section 7 (4 Seiten) | ✅ (inhaltlich) |

**Problem:** ❗ **Domain-Setup wird DREIMAL erklärt** (Onboarding, Anleitung, Playbook).

**Empfehlung:**
- **Streichen:** Domain-Setup aus Playbook v2 (Verweis auf Anleitung)
- **Kürzen:** Onboarding v2 (Verweis auf Anleitung statt 6 Seiten Copy)
- **Behalten:** `domain-setup-anleitung-kunden.md` als **EINZIGE** Quelle

---

### 3.5 CSV Schema

| Dokument | CSV-Felder definiert | Anzahl Felder | Konsistent? |
|----------|---------------------|---------------|-------------|
| `hunter-setup-template.md` Section 3.4 | 25 Felder | 25 | ✅ (aber zu viel) |
| `kontaktmanufaktur-playbook-v2.md` Section 10 | 25 Felder | 25 | ✅ (identisch) |
| `kontaktmanufaktur-playbook-v2.md` Section 2 | Pflichtfelder: 13 | 13 | ❌ (widerspricht) |

**Inkonsistenz gefunden:**
- ❗ **Playbook Section 2 (Scoring):** 13 Pflichtfelder
- ❗ **Playbook Section 10 + Hunter Setup:** 25 Felder

**Problem:** Was ist Pflicht — 13 oder 25?

**Empfehlung:** **13 Pflichtfelder**, Rest optional. In allen Dokumenten klarstellen.

---

### 3.6 Google Sheets Dashboard

| Dokument | Google Sheets erwähnt | Wann? | Konsistent? |
|----------|---------------------|-------|-------------|
| `customer-onboarding-v2.md` | ❌ Nein | — | — |
| `dienstleistungsvertrag-template.md` | ✅ Ja ("Web-Dashboard") | Ab Kunde 1 | ✅ |
| `kontaktmanufaktur-playbook-v2.md` Section 10 | ✅ Ja (Google Sheets Sync) | Ab Kunde 1 (implizit) | ❌ |

**Inkonsistenz:**
- ❗ **Playbook:** Google Sheets Sync ab Kunde 1 beschrieben
- ❗ **Realität:** Laut Review sollte Google Sheets erst ab Kunde 3+ kommen

**Empfehlung:** Im Playbook klarstellen: "Google Sheets Sync (ab Kunde 3+)" + "Für Kunde 1-2: CSV-Reports".

---

### 3.7 Querverweise zwischen Dokumenten

| Von | Nach | Verweis vorhanden? |
|-----|------|--------------------|
| `customer-onboarding-v2.md` | `hunter-setup-template.md` | ✅ ("siehe Hunter Setup Template") |
| `customer-onboarding-v2.md` | `domain-setup-anleitung-kunden.md` | ❌ ("wird noch erstellt" — aber existiert!) |
| `hunter-setup-template.md` | `kontaktmanufaktur-playbook-v2.md` | ✅ ("Basis: Playbook v2") |
| `dienstleistungsvertrag-template.md` | `av-vertrag-template.md` | ✅ ("Anlage 1") |
| `ICP-definitions-v1.md` | `kontaktmanufaktur-playbook-v2.md` | ❌ (kein Verweis) |

**Probleme:**
- ❗ **Onboarding → Domain-Anleitung:** Verweis fehlt (steht "wird noch erstellt", existiert aber)
- ❗ **ICP-definitions-v1.md:** Kein Verweis zu Playbook (redundant, unklar welches Source of Truth)

**Empfehlung:**
- **Ergänzen:** In Onboarding v2 Section 3.1 → "Siehe `domain-setup-anleitung-kunden.md`"
- **Klarstellen:** In ICP-definitions-v1.md oben schreiben: "Kurzversion von Playbook v2 Section 1"

---

## 4. Top 10 Simplification-Empfehlungen (priorisiert)

### 🥇 1. Onboarding von 9 auf 5 Phasen reduzieren
**Warum:** 9 Phasen schrecken ab. Kein Kunde will 9-Phasen-Prozess durchlaufen.  
**Was:** Streichen: Phase 0 (Handoff), Phase 5 (Soft Launch in Phase 4 integrieren), Phase 9 (Offboarding separates Doc).  
**Neue Struktur:** Phase 1 (Vertrag), Phase 2 (Briefing), Phase 3 (Domain+Warmup), Phase 4 (Kampagne+Test), Phase 5 (Go-Live).  
**Impact:** ⭐⭐⭐⭐⭐ (sehr hoch)

---

### 🥈 2. Fragebogen von 37 auf 12 Pflichtfragen kürzen
**Warum:** 37 Fragen = 40 Min = Kunden brechen ab.  
**Was:** Nur 12 Pflicht (Firma 3, Produkt 2, ICP 4, Kommunikation 2, Technisches 1). Rest optional oder im Briefing-Call.  
**Impact:** ⭐⭐⭐⭐⭐ (sehr hoch — betrifft ersten Eindruck)

---

### 🥉 3. CSV-Schema von 25 auf 13 Pflichtfelder reduzieren
**Warum:** 25 Felder = Overhead bei manuellem Export/Review. Für Kunde 1-3 unrealistisch.  
**Was:** Streichen: `icp_type`, `date_detected`, `signal_strength`, `team_size`, `kontakt_xing`, `pain_point_evidence`, `personalization_brief`, `pipeline_stage`, `email_1_sent`, `email_1_date`, `email_1_opened`.  
**Behalten:** `company_name`, `website`, `branche`, `standort`, `kontakt_name`, `kontakt_titel`, `kontakt_email`, `email_verified`, `kontakt_linkedin`, `signal_type`, `signal_source_url`, `content_hook`, `notes`.  
**Impact:** ⭐⭐⭐⭐ (hoch)

---

### 4. Multi-Agent Pipeline streichen (für Kunde 1-5)
**Warum:** "Coordinator, Website Scraper, LinkedIn Research, Content Scraper, Data Compiler" = Overengineering. Für 10-20 Leads/Woche macht Laurenz/Hektor das manuell.  
**Was:** Ersetzen durch **1 Prompt "Lead Research"** (kombiniert Website + LinkedIn + Content in einem).  
**Wann umsetzen:** Multi-Agent ab 10+ Kunden (wenn Volumen >50 Leads/Woche).  
**Impact:** ⭐⭐⭐⭐ (hoch — reduziert Komplexität massiv)

---

### 5. Domain-Setup Anleitung von 35 auf 10 Seiten kürzen
**Warum:** 35 Seiten liest niemand. Kunden brauchen Quick Start + Support-Hotline.  
**Was:** Nur Cloudflare (Namecheap in Appendix), Details in Sublinks, FAQ auf 5 Fragen.  
**Ergänzen:** 10-Min Video-Tutorial (Loom), Link oben.  
**Impact:** ⭐⭐⭐⭐ (hoch — Kunden-Experience)

---

### 6. ICP-definitions-v1.md und Playbook v2 Section 1 zusammenlegen
**Warum:** Exakt gleiche Inhalte, zwei Dokumente verwirren.  
**Was:** **Entweder:**  
- `ICP-definitions-v1.md` als **standalone Quick Reference** (1 Seite pro ICP, A4-druckbar) **ODER**  
- Nur Playbook v2 Section 1, `ICP-definitions-v1.md` streichen.  
**Impact:** ⭐⭐⭐ (mittel — reduziert Redundanz)

---

### 7. Google Sheets Sync auf "ab Kunde 3+" verschieben
**Warum:** Für Kunde 1-2 ist CSV + wöchentliche Reports ausreichend. Google Sheets Sync = Extra-Komplexität ohne Mehrwert.  
**Was:** Im Playbook v2 Section 10 klarstellen: "Google Sheets Sync (ab Kunde 3+)". Für Kunde 1-2: CSV-Exports.  
**Impact:** ⭐⭐⭐ (mittel)

---

### 8. Daily Reports → Weekly Reports
**Warum:** Tägliche KPI-Reports (18 Uhr) = Overhead für Kunde 1-3. Wöchentlich reicht.  
**Was:** Im Hunter Setup Template + Playbook v2: "Weekly Reports (Freitag 16 Uhr)". Daily nur intern.  
**Impact:** ⭐⭐⭐ (mittel)

---

### 9. Compliance-Inkonsistenz korrigieren (50/Tag)
**Warum:** Vertrag sagt "50 pro Domain", Playbook sagt "50 GESAMT". Rechtlich relevant.  
**Was:** Im Vertrag ändern zu: "Maximale Versandmenge: 50 E-Mails pro Tag (verteilt über alle genutzten Absender-Adressen)".  
**Impact:** ⭐⭐⭐⭐⭐ (sehr hoch — rechtliches Risiko)

---

### 10. "Quick Start Guide" erstellen (2 Seiten)
**Warum:** Alle Dokumente sind detailliert, aber kein "So startest du in 3 Tagen"-Überblick.  
**Was:** Neues Dokument `quick-start.md` (2 Seiten):  
- Tag 1: Vertrag + Fragebogen (12 Fragen)  
- Tag 2: Domain kaufen + Google Workspace (mit Video-Link)  
- Tag 3: Briefing-Call + Warmup starten  
- Woche 3: Go-Live  
**Impact:** ⭐⭐⭐⭐ (hoch — Erste-Kunden-Erfahrung)

---

## 5. Vergessene Punkte

### 5.1 Was wenn Kunde die Domain-Anleitung nicht schafft?
**Fehlt in:** `customer-onboarding-v2.md`, `domain-setup-anleitung-kunden.md`  
**Problem:** Non-Tech-Kunden könnten scheitern (DNS-Records, Google Workspace).  
**Lösung:** **"Concierge Setup"-Option** anbieten:  
- "Wir übernehmen Domain-Kauf + Setup für €150 Einmalgebühr"  
- Domain bleibt im Eigentum des Kunden  
- Erwähnen in Onboarding + Domain-Anleitung

---

### 5.2 Was wenn Payment nach 3 Gratis-Meetings abgelehnt wird?
**Fehlt in:** `dienstleistungsvertrag-template.md`  
**Problem:** Proof of Concept endet, Kunde sagt "nein danke" — was dann?  
**Lösung:** Ergänzen in §3:  
> "Falls der Auftraggeber nach den 3 Gratis-Meetings die Zusammenarbeit nicht fortsetzt, endet der Vertrag automatisch ohne Kündigungsfrist. Beide Parteien haben keine weiteren Verpflichtungen."

---

### 5.3 Was wenn Warmup fehlschlägt? (Deliverability <85%)
**Fehlt in:** `customer-onboarding-v2.md`, `hunter-setup-template.md`  
**Problem:** Warmup kann scheitern (Domain auf Blacklist, DNS falsch, etc.).  
**Lösung:** Ergänzen in Onboarding Phase 3:  
> "Falls nach 21 Tagen Warmup die Deliverability <85% ist, pausieren wir und analysieren (kostenlos). Mögliche Ursachen: DNS-Records falsch, Domain bereits kompromittiert, ISP-Problem. Wir beheben das Problem oder empfehlen neue Domain."

---

### 5.4 Muster-Email "Änderung Sub-Processor" (AV-Vertrag)
**Fehlt in:** `av-vertrag-template.md`  
**Problem:** §2.4 sagt "14 Tage Vorankündigung bei Sub-Processor-Änderung", aber kein Template.  
**Lösung:** Ergänzen in Anlage 2:

```
MUSTER-EMAIL: Änderung Unterauftragsverarbeiter

Betreff: KontaktManufaktur — Änderung Unterauftragsverarbeiter

Guten Tag [Kunde],

gemäß unserem Auftragsverarbeitungsvertrag (§2.4) informieren wir Sie über folgende Änderung:

**Neuer Unterauftragsverarbeiter:**
- Name: [z.B. Lemlist SAS]
- Standort: [z.B. Frankreich (EU)]
- Leistung: [z.B. Email-Versand]
- Verarbeitete Daten: [z.B. Email-Adressen, Namen]
- Datenschutzniveau: [z.B. DSGVO (EU)]

**Einspruchsfrist:** 14 Tage ab Erhalt dieser E-Mail

Falls Sie Einspruch erheben möchten, teilen Sie uns dies bitte bis zum [DATUM] mit.

Bei Fragen stehe ich gerne zur Verfügung.

Beste Grüße
Laurenz Seifried
KontaktManufaktur
```

---

### 5.5 Video-Tutorial für Domain-Setup fehlt
**Fehlt in:** `domain-setup-anleitung-kunden.md`  
**Problem:** 35 Seiten Text sind für Non-Tech-Kunden ineffektiv.  
**Lösung:** 10-Min Loom-Video produzieren:  
- Cloudflare Domain kaufen (2 Min)  
- Google Workspace einrichten (4 Min)  
- DNS-Records setzen (3 Min)  
- Test-Email senden (1 Min)  
Link oben im Dokument: "🎥 Lieber Video? [10-Min Tutorial ansehen](#)"

---

### 5.6 Pricing-Begründung für Kunden fehlt
**Fehlt in:** `customer-onboarding-v2.md`, `dienstleistungsvertrag-template.md`  
**Problem:** Kunden fragen "Warum €400/Meeting bei MedTech?"  
**Lösung:** Ergänzen in Onboarding oder Pricing-Dokument:

> **Warum kostet ein MedTech-Meeting €400-600?**  
> - Durchschnittlicher Deal Value bei MedTech: €20-100K+  
> - Bei 10% Close-Rate: Ein Meeting = €2.000-€10.000 Umsatz  
> - €400 Meeting-Kosten = 4-20% Akquisekosten (Branchenstandard: 10-25%)  
> - Sie zahlen nur bei Ergebnis (kein Risiko)

---

### 5.7 CRM-Integration nicht beschrieben
**Fehlt in:** `customer-onboarding-v2.md`, `hunter-setup-template.md`  
**Problem:** Fragebogen fragt "Nutzen Sie ein CRM?", aber nirgends steht WAS dann passiert.  
**Lösung:** Ergänzen in Onboarding Phase 6 (Go-Live):  
> "Falls Sie ein CRM nutzen (HubSpot, Salesforce, Pipedrive), können wir gebuchte Meetings automatisch übertragen (Zapier/Make). Aufwand: ca. 2 Stunden Setup, einmalig €100."

---

### 5.8 Backup-Plan wenn Kunde keine Google Workspace will
**Fehlt in:** `customer-onboarding-v2.md`  
**Problem:** Google Workspace kostet €18/Monat. Was wenn Kunde ablehnt?  
**Lösung:** Ergänzen in Onboarding Phase 3:  
> "Alternative zu Google Workspace: Microsoft 365 Business Basic (€5,60/Nutzer/Monat). Funktioniert ebenfalls, aber etwas schlechtere Deliverability. Wir empfehlen Google für beste Ergebnisse."

---

## 6. Gesamtbewertung: Ist das System ready für den ersten Kunden?

### ✅ JA — mit Einschränkungen

**Was funktioniert (ready to go):**
- ✅ **Rechtliche Grundlage** — AV-Vertrag + Dienstleistungsvertrag solide, DSGVO-konform
- ✅ **ICPs definiert** — 5 ICPs klar, Buying Signals identifiziert, Email-Templates vorhanden
- ✅ **Technischer Stack** — Instantly, Hunter, DeBounce, Google Workspace klar beschrieben
- ✅ **Pricing** — Pay-per-Meeting transparent, 3 Gratis-Meetings als Hook
- ✅ **Domain-Setup Anleitung** — Non-Tech-freundlich (wenn gekürzt auf 10 Seiten + Video)

**Was NICHT ready ist (Blocker für Go-Live):**
- ❌ **Onboarding zu komplex** — 9 Phasen, 37 Fragen, 35 Seiten Domain-Anleitung = Kunden steigen aus
- ❌ **Multi-Agent Pipeline** — Beschrieben, aber für Kunde 1-5 unrealistisch (manuell schneller)
- ❌ **Google Sheets Sync** — Beschrieben, aber unnötig (CSV reicht)
- ❌ **Daily Reports** — Overhead, wöchentlich reicht
- ❌ **Compliance-Inkonsistenz** — "50/Tag GESAMT" vs. "50/Domain/Tag" muss korrigiert werden

**Was fehlt (nicht blockierend, aber wichtig):**
- ⚠️ **Quick Start Guide** (2 Seiten "So startest du in 3 Tagen")
- ⚠️ **Video-Tutorial** für Domain-Setup (10 Min Loom)
- ⚠️ **Concierge Setup-Option** (€150 Einmalgebühr, wir machen Domain+DNS)
- ⚠️ **CRM-Integration** beschreiben (für Kunden mit HubSpot/Salesforce)
- ⚠️ **Backup-Plan** (Was wenn Warmup scheitert, Kunde zahlt nicht, etc.)

---

### Empfehlung für Go-Live:

**Option A: Jetzt starten (minimalistisch)**
- **Tun:** Compliance-Inkonsistenz korrigieren (50/Tag GESAMT), Fragebogen auf 12 Fragen kürzen, Domain-Anleitung auf 10 Seiten + Video
- **Nicht tun:** Multi-Agent Pipeline, Google Sheets Sync, Daily Reports (vorerst manuell/wöchentlich)
- **Timeline:** 2-3 Tage bis ready
- **Risiko:** Niedrig (Kunde 1 ist Experiment, Komplexität schadet mehr als hilft)

**Option B: Polieren vor Start (empfohlen)**
- **Tun:** Alle 10 Simplification-Empfehlungen umsetzen (1-2 Wochen Arbeit)
- **Ergebnis:** Professionelles, schlankes System
- **Timeline:** 7-10 Tage bis ready
- **Risiko:** Sehr niedrig, bessere Kunden-Experience

**Meine Empfehlung:** **Option A** — Starten mit Minimal-Setup, iterativ verbessern. Erste Kunden verzeihen Unvollkommenheit, wenn Ergebnisse stimmen.

---

## Zusammenfassung der nötigen Änderungen (vor Go-Live):

### ⚡ CRITICAL (must-fix vor Kunde 1):
1. **Compliance korrigieren:** "50 Emails/Tag GESAMT" überall (Vertrag inkonsistent)
2. **Fragebogen kürzen:** 37 → 12 Pflichtfragen
3. **Domain-Anleitung kürzen:** 35 → 10 Seiten + Video produzieren

### ⭐ HIGH (should-fix vor Kunde 1):
4. **Onboarding vereinfachen:** 9 → 5 Phasen
5. **CSV-Schema reduzieren:** 25 → 13 Pflichtfelder
6. **Quick Start Guide erstellen:** 2 Seiten "So läuft's ab"

### 🔧 MEDIUM (nice-to-have, kann warten):
7. **Multi-Agent Pipeline streichen** (für Kunde 1-5 manuell)
8. **Google Sheets Sync verschieben** (ab Kunde 3+)
9. **ICP-definitions-v1.md zusammenlegen** mit Playbook
10. **Daily Reports → Weekly Reports**

---

**Ende des Reviews. Bereit für Rückfragen.**
