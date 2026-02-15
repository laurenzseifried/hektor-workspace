# KontaktManufaktur — Master TODO

Stand: 15.02.2026

---

## 🔴 Phase 1: Grundlagen (vor Kunde 1)

### Branding
- [ ] Brand Guide erstellen (Farben, Typo, Tonalität, Logo-Usage)
- [ ] Logo erstellen (SVG, dunkel + hell, mit Nano Banana)
- [ ] Favicon generieren (aus Logo)
- [ ] OG-Image (Social Preview)
- [ ] Email-Signatur Template

### Rechtliches
- [ ] Gewerbeanmeldung (Einzelunternehmen, Gewerbeamt Hornburg)
- [ ] Steuernummer / USt-ID beantragen (oder Kleinunternehmerregelung §19)
- [ ] Impressum erstellen (Dashboard Footer + Emails)
- [ ] Datenschutzerklärung erstellen (Dashboard)
- [ ] AV-Vertrag finalisieren (Template existiert in projects/kontaktmanufaktur/)
- [ ] Dienstleistungsvertrag finalisieren (Template existiert)

### Dashboard — Backend (Claude Code)
- [ ] API-Anbindung: Alle Pages auf echte API-Calls statt Dummy-Daten
- [ ] Rechnungs-PDF professionell (Logo, Adresse, IBAN DE38100110012192368783, USt, Rechnungsnummer)
- [ ] Rechnungs-PDF: Kleinunternehmer-Klausel oder USt 19% (je nach Gewerbeanmeldung)
- [ ] Email-Benachrichtigungen via Resend (Meeting gebucht, Rechnung verfügbar, Bestätigungs-Reminder)
- [ ] Onboarding-Email bei Kunden-Anlage (Willkommen + Login-Daten)
- [ ] Impressum + Datenschutz Seiten/Footer
- [ ] Meeting-Reminder Cron (48h nach Meeting ohne Bestätigung → Email)
- [ ] Rechnungs-Generierung Cron (1. des Monats)

### Dashboard — Frontend (Antigravity)
- [ ] Responsive/Mobile (Sidebar Collapse, Tabellen-Scroll)
- [ ] Loading States (Skeleton Loader)
- [ ] Error States + Leer-Zustände ("Noch keine Meetings diesen Monat")
- [ ] Favicon + Meta Tags (Titel: "KontaktManufaktur Dashboard")
- [ ] Logo in Sidebar + Login-Seite einbauen

### Infrastruktur
- [ ] Domain prüfen: hallo-kontakt-manufaktur.de (GoDaddy) — Subdomain `dashboard.` einrichten
- [ ] Hosting: Cloudflare Tunnel auf Mac Mini einrichten (HTTPS, dashboard.hallo-kontakt-manufaktur.de)
- [ ] Calendly Standard Abo ($10/Mo) — Laurenz kauft
- [ ] Calendly Webhook konfigurieren → Dashboard API
- [ ] Instantly Webhook konfigurieren → Dashboard API
- [ ] Resend: Domain verifizieren (SPF/DKIM für hallo-kontakt-manufaktur.de)

### Accounts & Tools
- [ ] Calendly: Event-Typ erstellen (30 Min Discovery Call)
- [ ] Calendly: Custom Questions (Firma, Rolle)
- [ ] Calendly: Booking-Link in Instantly Follow-Up Templates einbauen
- [ ] Resend: Sender-Domain verifizieren
- [ ] API-Key für Hektor/Hunter im Dashboard generieren

---

## 🟡 Phase 2: Polish (nach Kunde 1 live)

### Dashboard
- [ ] Magic Link Login (statt Passwort)
- [ ] Audit-Log (wer hat wann was gemacht)
- [ ] Dark/Light Toggle
- [ ] CSV Export (Meetings)
- [ ] Calendly-Embed im Dashboard (Terminbuchung direkt)
- [ ] Domain-Status Anzeige (Warmup-Fortschritt, Health)
- [ ] KPI-Trends (Charts über Zeit)

### Operativ
- [ ] Onboarding-Fragebogen auf Tally aufsetzen
- [ ] Google Sheets KPI-Tracking Template erstellen
- [ ] Erst-Kunden-Akquise starten (eigene Leadgen für KontaktManufaktur)

---

## 🟢 Phase 3: Skalierung (ab Kunde 3+)

- [ ] Railway EU Migration (weg vom Mac Mini)
- [ ] Anwalt: Verträge reviewen lassen
- [ ] Multi-Agent: Hunter Agent pro Kunde automatisch konfigurieren
- [ ] White-Label Option (Kunde sieht eigenes Branding)
- [ ] Zapier/Webhook-Integration für Kunden
- [ ] Erweitertes Reporting

---

## Erledigte Meilensteine

- [x] Dashboard Spec v1 + v2 geschrieben
- [x] Dashboard Backend gebaut (Next.js, Prisma, Auth, API-Routes)
- [x] Dashboard Frontend gebaut (Dark Theme, Meetings, Rechnungen, Briefings)
- [x] Calendly + Instantly Webhooks implementiert
- [x] Meeting-Bestätigung (Kunde klickt Stattgefunden/No-Show)
- [x] Playbook v2, ICP-Definitions, Scoring Matrix
- [x] AV-Vertrag + Dienstleistungsvertrag Templates
- [x] Domain-Setup-Anleitung für Kunden
- [x] Onboarding-Fragebogen (30→24 Fragen)
- [x] Customer Onboarding v2 (6 Phasen)
- [x] Hunter Setup Template
- [x] Git Repos: hektor-workspace + kontaktmanufaktur-dashboard
- [x] Outreach-Domain: hallo-kontakt-manufaktur.de (GoDaddy)
- [x] Google Workspace (3 Accounts) auf Outreach-Domain
- [x] Instantly Warmup gestartet (14.02.2026)
- [x] Resend API Key hinterlegt
- [x] Gemini API Key hinterlegt (Nano Banana)
