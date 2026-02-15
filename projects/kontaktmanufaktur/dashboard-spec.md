# KontaktManufaktur — Kunden-Dashboard Spec

## Überblick

Web-Dashboard für Kunden des Appointment-Setting-Service. Zeigt Leads, Meetings, KPIs und Rechnungen. Läuft lokal auf unserem Mac, Kunden greifen per Login zu.

---

## Design-Vibe

- **Dunkel, clean, datengetrieben.** Keine Gradients, keine AI-Ästhetik, kein Purple.
- Hauptsächlich Schwarz mit Stahlblau als einziger Akzentfarbe.
- Große Zahlen, kleine Labels. Whitespace > Dekoration.
- Flat Design, subtile Shadows für Card-Tiefe.
- Typografie: System-Font-Stack oder Inter/Geist — gut lesbar in Tabellen.
- **Farbpalette (grob):**
  - Backgrounds: Sehr dunkles Schwarz/Navy
  - Cards/Surfaces: Minimal heller als Background
  - Akzent: Stahlblau (für aktive States, CTAs, KPI-Highlights)
  - Status-Farben: Grün (Erfolg/Gebucht), Gelb (Pending/Warmup), Rot (Problem)
  - Text: Helles Grau, gedämpftes Grau für Sekundärtext

---

## Tech Stack

| Komponente | Technologie |
|-----------|------------|
| Frontend | React + Vite (oder Next.js) — Antigravity baut das |
| Backend | Node.js + Express — Claude Code baut das |
| Datenbank | SQLite (einfach, kein Server nötig, lokal) |
| Auth | JWT (Email + Passwort, simpel) |
| Hosting | Lokal auf Mac Mini, Cloudflare Tunnel für externen Zugriff |

---

## Seiten

### 1. Login
- Email + Passwort
- Minimalistisch, Logo, fertig

### 2. Overview (Dashboard-Startseite)
- **KPI-Cards oben:**
  - Meetings diesen Monat (Zahl + Trend vs. Vormonat)
  - Leads in Pipeline (aktiv kontaktiert)
  - Response Rate (%)
  - Nächstes Meeting (Datum + Firma)
- **Status-Badge:** Warmup / Active / Paused
- **Aktivitäts-Feed:** Letzte 10 Events (Lead kontaktiert, Reply erhalten, Meeting gebucht)
- **Meetings-Chart:** Einfaches Bar-Chart, Meetings pro Woche (letzte 8 Wochen)

### 3. Leads
- **Tabelle** mit Spalten:
  - Firma, Ansprechpartner, Position, Status, Score, Letzte Aktivität, Quelle
- **Status-Werte:** New → Contacted → Replied → Meeting Booked → Not Interested → DNC
- **Filter:** Status, Score-Range, Datum
- **Suche:** Freitext über Firma/Name
- Lead-Detail per Klick: Kontakthistorie (wann welche Email, Reply ja/nein)

### 4. Meetings
- **Liste** gebuchter Meetings:
  - Datum/Uhrzeit, Firma, Ansprechpartner, Position, Briefing-Link
- **Meeting-Briefing** (Detail-View):
  - Firma-Kurzprofil, Ansprechpartner-Info, Gesprächsanlass (welches Signal), Empfohlene Talking Points
- **Status:** Scheduled → Completed → No-Show → Cancelled
- **Kalender-View** optional (nice-to-have, nicht MVP)

### 5. Invoices
- **Monatliche Abrechnung:**
  - Monat, Anzahl Meetings, Preis pro Meeting, Gesamtbetrag, Status (Offen/Bezahlt)
- **Detail:** Liste der abgerechneten Meetings mit Datum + Firma
- **Download:** PDF-Export pro Rechnung

### 6. Settings
- **Profil:** Firmenname, Ansprechpartner, Email
- **ICP-Info:** Aktuelle Zielgruppen-Definition (read-only, von uns gepflegt)
- **Domain-Status:** Warmup-Fortschritt, Sending-Limit, Health-Score
- **Passwort ändern**

---

## API-Kontrakt

Base URL: `/api/v1`
Auth: `Authorization: Bearer <jwt>`

### Auth
```
POST /auth/login        { email, password }    → { token, user }
POST /auth/logout       {}                     → { ok }
```

### Dashboard
```
GET /dashboard/overview                        → { kpis, recentActivity, meetingsChart }
```

### Leads
```
GET    /leads           ?status=&minScore=&page=&limit=&q=    → { leads[], total, page }
GET    /leads/:id                                              → { lead, contactHistory[] }
```

### Meetings
```
GET    /meetings        ?status=&month=&page=&limit=          → { meetings[], total }
GET    /meetings/:id                                           → { meeting, briefing }
```

### Invoices
```
GET    /invoices         ?status=&year=                        → { invoices[] }
GET    /invoices/:id                                           → { invoice, meetingDetails[] }
GET    /invoices/:id/pdf                                       → binary (PDF)
```

### Settings
```
GET    /settings/profile                                       → { profile }
GET    /settings/icp                                           → { icpDefinition }
GET    /settings/domain                                        → { domainStatus }
PATCH  /settings/password  { oldPassword, newPassword }        → { ok }
```

---

## Datenmodell (SQLite)

### users
id, email, password_hash, company_name, contact_name, created_at

### leads
id, user_id, company, contact_name, contact_position, contact_email, status, score, source, created_at, updated_at

### lead_activities
id, lead_id, type (email_sent, reply_received, meeting_booked, status_change), detail, created_at

### meetings
id, user_id, lead_id, scheduled_at, status, briefing_json, created_at, updated_at

### invoices
id, user_id, month, year, meeting_count, price_per_meeting, total_amount, status, created_at

### invoice_items
id, invoice_id, meeting_id

### domain_status
id, user_id, domain, warmup_start, warmup_progress, daily_limit, health_score, updated_at

---

## Scope-Regeln

- **MVP:** Login, Overview, Leads (Tabelle + Detail), Meetings (Liste + Briefing), Invoices (Liste + PDF), Settings (read-only ICP + Domain)
- **Nicht MVP:** Kalender-View, Echtzeit-Updates, Multi-Language, Mobile App
- **Daten-Input:** Wir (intern) pflegen Leads + Meetings via API oder direktem DB-Zugang. Kunde sieht nur, schreibt nicht.
- **Multi-Tenant:** Jeder Kunde sieht nur seine Daten (user_id Filter auf allem)

---

## Workflow: Wer baut was?

| Was | Tool | Reihenfolge |
|-----|------|-------------|
| Diese Spec | Hektor + Laurenz | ✅ Done |
| Backend (API + DB + Auth) | Claude Code | Schritt 1 |
| Seed-Daten (Demo-Kunde) | Claude Code | Schritt 2 |
| Frontend (alle Seiten) | Antigravity | Schritt 3 |
| Integration + Bugfixes | Beide | Schritt 4 |
| PDF-Export | Claude Code | Schritt 4 |

**Antigravity bekommt:** Diese Spec + laufende Backend-API als Kontext.
**Claude Code bekommt:** Diese Spec, baut Backend-first.
