# Domain-Setup für Cold Outreach – Schritt-für-Schritt Anleitung

🎥 **Video-Tutorial kommt bald** — bis dahin folgen Sie dieser Anleitung.

**Zeitaufwand:** Ca. 45-60 Minuten  
**Kosten:** Ca. €8-10/Jahr für die Domain + €18/Monat für 3 Email-Adressen

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de** oder WhatsApp/Signal **[TELEFONNUMMER]**

---

## Warum eine separate Domain?

Für Cold Outreach verwenden wir **NICHT** Ihre Hauptdomain (z.B. `firma.de`), sondern eine neue, separate Domain (z.B. `tryfirma.com`).

**Grund:** Beim Cold Outreach kann es passieren, dass einzelne Empfänger Ihre E-Mails als Spam markieren. Das ist normal und kein Problem – **aber** es würde die Reputation Ihrer Hauptdomain gefährden, wenn Sie diese verwenden würden. Mit einer separaten Domain schützen Sie Ihre geschäftskritischen E-Mails (Rechnungen, Kundenkommunikation, etc.).

---

## Schritt 1: Outreach-Domain kaufen

### 1.1 Welche Domain kaufen?

Wählen Sie eine Domain, die **ähnlich** zu Ihrer Hauptdomain ist, aber **nicht identisch**.

**Beispiele:**

| Ihre Hauptdomain | Gute Outreach-Domains |
|------------------|----------------------|
| `firma.de` | `tryfirma.com`, `firma.io`, `get-firma.com` |
| `mustermann-consulting.de` | `mustermann.io`, `mustermann-consult.com` |
| `shop24.de` | `tryshop24.com`, `shop24.io` |

**Tipps:**
- ✅ `.com`, `.io`, `.co` sind ideal (international, vertrauenswürdig)
- ✅ Kurz und ähnlich zur Hauptdomain
- ❌ Keine `.info`, `.biz`, `.xyz` (werden oft als Spam gefiltert)

---

### 1.2 Domain bei Cloudflare kaufen (empfohlen)

Cloudflare bietet die günstigsten Verlängerungspreise (€8-10/Jahr, **keine versteckten Aufschläge**).

**Schritt-für-Schritt:**

1. **Gehen Sie zu:** [https://www.cloudflare.com](https://www.cloudflare.com)

2. **Account erstellen:**
   - Klicken Sie oben rechts auf **"Sign Up"**
   - E-Mail-Adresse eingeben (Ihre geschäftliche E-Mail)
   - Passwort erstellen (mindestens 8 Zeichen, sicher!)
   - Bestätigungs-E-Mail öffnen und Link klicken

3. **Domain registrieren:**
   - Nach dem Login: Links im Menü auf **"Domain Registration"** klicken
   - In der Suchleiste Ihre Wunsch-Domain eingeben (z.B. `tryfirma.com`)
   - Klicken Sie auf **"Search"**

4. **Domain auswählen:**
   - Verfügbare Domains werden angezeigt
   - Klicken Sie bei Ihrer Wunsch-Domain auf **"Purchase"**
   - Falls nicht verfügbar: Varianten probieren (z.B. `firma.io` statt `.com`)

5. **Kaufabwicklung:**
   - **Auto-Renew:** ✅ Aktiviert lassen (Domain verlängert sich automatisch)
   - **WHOIS Privacy:** ✅ Aktiviert lassen (schützt Ihre Kontaktdaten)
   - Zahlungsmethode hinzufügen (Kreditkarte oder PayPal)
   - Klicken Sie auf **"Complete Purchase"**

6. **Bestätigung:**
   - Sie erhalten eine E-Mail von Cloudflare
   - Die Domain erscheint in Ihrem Cloudflare Dashboard unter **"Websites"**

✅ **Domain gekauft!** Lassen Sie das Cloudflare-Fenster geöffnet – wir brauchen es später noch.

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

## Schritt 2: Google Workspace einrichten

Sie benötigen **3 professionelle E-Mail-Adressen** auf Ihrer neuen Domain (z.B. `max@tryfirma.com`). Wir nutzen Google Workspace, weil es zuverlässig ist und die beste Zustellrate bietet.

**Kosten:** €6,00 pro E-Mail-Adresse/Monat = **€18/Monat für 3 Adressen**

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

### 2.1 Google Workspace Account erstellen

1. **Gehen Sie zu:** [https://workspace.google.com](https://workspace.google.com)

2. **Klicken Sie auf:** **"Get started"** (oben rechts)

3. **Firmendaten eingeben:**
   - **Business name:** Ihr Firmenname (z.B. "Mustermann Consulting")
   - **Number of employees:** Wählen Sie "Just you" oder "2-9"
   - **Region:** Germany
   - Klicken Sie auf **"Next"**

4. **Kontaktdaten:**
   - **Your name:** Ihr Name (Vorname + Nachname)
   - **Current email:** Ihre bestehende E-Mail (z.B. Ihre Hauptdomain-Adresse)
   - Klicken Sie auf **"Next"**

5. **Domain angeben:**
   - Wählen Sie: **"Yes, I have one I can use"**
   - Geben Sie Ihre neue Outreach-Domain ein (z.B. `tryfirma.com`)
   - Klicken Sie auf **"Next"**

6. **Erste E-Mail-Adresse erstellen:**
   - **Username:** Wählen Sie einen Benutzernamen (z.B. `max` → wird zu `max@tryfirma.com`)
   - **Password:** Sicheres Passwort (mindestens 8 Zeichen, Buchstaben + Zahlen + Sonderzeichen)
   - ⚠️ **Wichtig:** Notieren Sie sich das Passwort sofort!
   - Klicken Sie auf **"Next"**

✅ **Erster Google Workspace Account erstellt!** Sie werden jetzt zur Domain-Verifizierung weitergeleitet.

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

### 2.2 Domain verifizieren

Google muss sicherstellen, dass Sie die Domain wirklich besitzen.

**Sie sehen jetzt eine Seite mit einem TXT-Record.**

**Beispiel:**
```
Name/Host: @
Type: TXT
Value: google-site-verification=ABC123XYZ...
```

**So fügen Sie den TXT-Record in Cloudflare hinzu:**

1. **Öffnen Sie ein neues Browser-Tab**
2. Gehen Sie zu [https://dash.cloudflare.com](https://dash.cloudflare.com)
3. Loggen Sie sich ein
4. Klicken Sie auf Ihre Domain (z.B. `tryfirma.com`)
5. Links im Menü: Klicken Sie auf **"DNS"** → **"Records"**
6. Klicken Sie auf **"Add record"**
7. **Füllen Sie aus:**
   - **Type:** `TXT`
   - **Name:** `@`
   - **Content:** Den langen Code von Google (z.B. `google-site-verification=ABC123...`)
   - **TTL:** `Auto`
   - **Proxy status:** ⚠️ **Grauer Schalter** (DNS only, NICHT orange!)
8. Klicken Sie auf **"Save"**

9. **Zurück zu Google Workspace:**
   - Klicken Sie auf **"Verify"**
   - Falls Fehler: Warten Sie 5 Minuten und nochmal klicken (DNS braucht Zeit)

✅ **Domain verifiziert!**

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

### 2.3 MX-Records setzen (E-Mail-Empfang aktivieren)

Damit E-Mails an Ihre neue Domain zugestellt werden, müssen Sie **MX-Records** setzen.

**Google zeigt Ihnen jetzt eine Tabelle mit 5 MX-Records an.**

**Beispiel:**
```
Priority 1:  ASPMX.L.GOOGLE.COM
Priority 5:  ALT1.ASPMX.L.GOOGLE.COM
Priority 5:  ALT2.ASPMX.L.GOOGLE.COM
Priority 10: ALT3.ASPMX.L.GOOGLE.COM
Priority 10: ALT4.ASPMX.L.GOOGLE.COM
```

**So fügen Sie MX-Records in Cloudflare hinzu:**

1. **Gehen Sie zurück zu Cloudflare** (Tab mit Ihrer Domain)
2. Klicken Sie auf **"DNS"** → **"Records"**
3. **Löschen Sie alte MX-Records** (falls vorhanden):
   - Suchen Sie nach Einträgen mit Type "MX"
   - Klicken Sie auf **"Edit"** → **"Delete"**

4. **Fügen Sie die 5 Google MX-Records hinzu:**

   **Für jeden Record:**
   - Klicken Sie auf **"Add record"**
   - **Type:** `MX`
   - **Name:** `@`
   - **Mail server:** (z.B. `ASPMX.L.GOOGLE.COM`)
   - **Priority:** (z.B. `1`)
   - **TTL:** `Auto`
   - Klicken Sie auf **"Save"**

   **Wiederholen Sie das für alle 5 MX-Records!**

5. **Zurück zu Google Workspace:**
   - Klicken Sie auf **"Activate Gmail"**
   - Warten Sie 5-10 Minuten (MX-Records brauchen Zeit)

✅ **E-Mail-Empfang aktiviert!**

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

### 2.4 Zwei weitere E-Mail-Adressen erstellen

Wir brauchen insgesamt **3 E-Mail-Adressen** für optimales Outreach.

1. **Gehen Sie zu:** [https://admin.google.com](https://admin.google.com)
2. Loggen Sie sich mit Ihrer ersten E-Mail-Adresse ein (z.B. `max@tryfirma.com`)
3. Links im Menü: **"Directory"** → **"Users"**
4. Klicken Sie oben auf **"Add new user"**

**Erste zusätzliche E-Mail:** `hello@`
- **First name:** `Hello`
- **Last name:** `Team` (oder leer lassen)
- **Primary email:** `hello` (wird zu `hello@tryfirma.com`)
- **Password:** Sicheres Passwort erstellen
- ⚠️ **Wichtig:** Notieren Sie das Passwort!
- Klicken Sie auf **"Add new user"**

**Zweite zusätzliche E-Mail:** `team@`
- Wiederholen Sie die Schritte für `team@tryfirma.com`

✅ **3 E-Mail-Adressen erstellt!**

**Beispiel:**
- `max@tryfirma.com`
- `hello@tryfirma.com`
- `team@tryfirma.com`

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

## Schritt 3: DNS-Einträge für E-Mail-Authentifizierung

Damit Ihre E-Mails nicht im Spam landen, müssen Sie **SPF**, **DKIM** und **DMARC** einrichten. Das sind Sicherheitsstandards, die beweisen, dass E-Mails wirklich von Ihnen kommen.

**Keine Sorge:** Einfach die vorgegebenen Texte kopieren und einfügen!

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

### 3.1 SPF-Record hinzufügen

**SPF** = "Sender Policy Framework" – sagt anderen Servern: "Google darf E-Mails für meine Domain versenden"

**So geht's:**

1. **Gehen Sie zu Cloudflare** → Ihre Domain → **"DNS"** → **"Records"**
2. Klicken Sie auf **"Add record"**
3. **Füllen Sie aus:**
   - **Type:** `TXT`
   - **Name:** `@`
   - **Content:** (genau so kopieren!)
     ```
     v=spf1 include:_spf.google.com ~all
     ```
   - **TTL:** `Auto`
4. Klicken Sie auf **"Save"**

✅ **SPF-Record gesetzt!**

---

### 3.2 DKIM-Record hinzufügen

**DKIM** = "DomainKeys Identified Mail" – digitale Signatur für Ihre E-Mails

**Schritt 1: DKIM in Google Workspace aktivieren**

1. **Gehen Sie zu:** [https://admin.google.com](https://admin.google.com)
2. Links im Menü: **"Apps"** → **"Google Workspace"** → **"Gmail"**
3. Scrollen Sie nach unten zu **"Authenticate email"**
4. Klicken Sie auf **"Authenticate email"**
5. Wählen Sie Ihre Domain (z.B. `tryfirma.com`)
6. Klicken Sie auf **"Generate new record"**

**Sie sehen jetzt einen langen TXT-Record:**

```
Name/Host: google._domainkey
Type: TXT
Value: v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCg...
```

**Schritt 2: DKIM-Record in Cloudflare hinzufügen**

1. **Gehen Sie zu Cloudflare** → Ihre Domain → **"DNS"** → **"Records"**
2. Klicken Sie auf **"Add record"**
3. **Füllen Sie aus:**
   - **Type:** `TXT`
   - **Name:** `google._domainkey`
   - **Content:** Den langen Code von Google (beginnt mit `v=DKIM1; k=rsa; p=...`)
   - **TTL:** `Auto`
4. Klicken Sie auf **"Save"**

**Schritt 3: DKIM in Google aktivieren**

1. **Zurück zu Google Workspace Admin**
2. Klicken Sie auf **"Start authentication"**
3. Warten Sie 10-15 Minuten
4. Aktualisieren Sie die Seite – Status sollte auf **"Authenticating email"** wechseln

✅ **DKIM aktiviert!**

---

### 3.3 DMARC-Record hinzufügen

**DMARC** = Sicherheitsstandard, der anderen Servern sagt, wie sie mit E-Mails umgehen sollen, die die Prüfung nicht bestehen.

**So geht's:**

1. **Gehen Sie zu Cloudflare** → Ihre Domain → **"DNS"** → **"Records"**
2. Klicken Sie auf **"Add record"**
3. **Füllen Sie aus:**
   - **Type:** `TXT`
   - **Name:** `_dmarc`
   - **Content:** (genau so kopieren, aber ersetzen Sie `max@tryfirma.com` mit Ihrer ersten Email-Adresse!)
     ```
     v=DMARC1; p=none; rua=mailto:max@tryfirma.com
     ```
   - **TTL:** `Auto`
4. Klicken Sie auf **"Save"**

✅ **DMARC-Record gesetzt!**

---

### 3.4 Test: Funktioniert alles?

**Senden Sie eine Test-Email an mail-tester.com:**

1. Loggen Sie sich bei Gmail ein mit `max@tryfirma.com`
2. Gehen Sie zu [https://www.mail-tester.com](https://www.mail-tester.com)
3. Kopieren Sie die angezeigte Email-Adresse (z.B. `test-abc123@mail-tester.com`)
4. Senden Sie von `max@tryfirma.com` eine Email an diese Adresse
   - Betreff: "Test"
   - Inhalt: "Dies ist ein Test"
5. Zurück zu mail-tester.com → Klicken Sie auf **"Then check your score"**

**Ziel:** Score **>8/10**

Falls Score niedrig:
- Warten Sie 24h (DNS braucht Zeit)
- Prüfen Sie nochmal alle Records
- **Kontaktieren Sie uns:** kontakt@kontaktmanufaktur.de

✅ **Alles funktioniert!**

---

## Schritt 4: Zugangsdaten sicher an uns übergeben

**Wir benötigen folgende Zugänge, um die Domain für Sie zu konfigurieren:**

### 4.1 Was wir brauchen:

**1. Google Workspace Admin-Zugang:**
- E-Mail-Adresse: (z.B. `max@tryfirma.com`)
- Passwort

**2. Cloudflare-Zugang:**
- E-Mail-Adresse (mit der Sie bei Cloudflare registriert sind)
- Passwort

---

### 4.2 Wie Sie die Zugangsdaten sicher übermitteln:

⚠️ **NIEMALS per E-Mail verschicken!** E-Mails sind unsicher.

**Empfohlener Weg: Verschlüsselter Messenger**

Nutzen Sie **Signal** oder **WhatsApp**:

Schicken Sie uns die Zugangsdaten per verschlüsselter Nachricht an: **[TELEFONNUMMER]**

---

### 4.3 Checkliste für die Übergabe:

```
✅ Domain-Name: [z.B. tryfirma.com]

✅ Google Workspace Admin:
   E-Mail: [z.B. max@tryfirma.com]
   Passwort: [...]

✅ Alle 3 Google Workspace E-Mail-Adressen + Passwörter:
   1. [max@tryfirma.com] – Passwort: [...]
   2. [hello@tryfirma.com] – Passwort: [...]
   3. [team@tryfirma.com] – Passwort: [...]

✅ Cloudflare-Zugang:
   E-Mail: [...]
   Passwort: [...]
```

**Kommen Sie nicht weiter?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

## Schritt 5: Was passiert jetzt?

Nachdem Sie uns die Zugangsdaten übermittelt haben, übernehmen wir die technische Konfiguration. **Sie müssen nichts weiter tun!**

### Was wir für Sie einrichten:

**1. Instantly-Integration:**
- Wir verbinden Ihre 3 E-Mail-Adressen mit unserem Outreach-Tool (Instantly)
- Wir konfigurieren die optimalen Versand-Einstellungen

**2. Domain Warmup (14-21 Tage):**
- Neue Domains haben erstmal keine "Reputation" bei E-Mail-Anbietern
- Wir starten ein automatisches Warmup-Programm:
  - Tag 1-3: 5-10 E-Mails pro Tag
  - Tag 4-7: 15-20 E-Mails pro Tag
  - Tag 8-14: 30-40 E-Mails pro Tag
  - Tag 15-21: 50+ E-Mails pro Tag
- Während des Warmups verschicken wir **keine** echten Outreach-Mails
- Die Warmup-E-Mails gehen an andere Warmup-Accounts (gegenseitig, automatisch)

**3. Spam-Tests & Optimierung:**
- Wir testen Ihre Domain mit professionellen Tools
- Wir optimieren alle Einstellungen für maximale Zustellrate

---

### Timeline:

**Tag 1 (nach Zugangs-Übergabe):**
- Wir konfigurieren Instantly
- Wir starten Domain Warmup

**Tag 14-21:**
- Domain ist "warm" (gute Reputation aufgebaut)
- Wir informieren Sie per E-Mail/Telefonat

**Ab Tag 21:**
- 🚀 **Start der echten Outreach-Kampagne**
- Sie erhalten wöchentliche Reports von uns

---

### Was Sie während des Warmups NICHT tun sollten:

❌ **Keine** manuellen E-Mails von den 3 Outreach-Adressen versenden  
❌ **Keine** DNS-Einträge ändern  
❌ **Keine** Google Workspace-Einstellungen ändern  
❌ **Keine** Passwörter ändern (falls doch: uns informieren!)

✅ **Einfach zurücklehnen** – wir kümmern uns um alles!

---

## Häufige Fragen (FAQ)

**Q: Kann ich die Outreach-Domain später auch für andere Dinge nutzen?**  
A: Besser nicht. Die Domain sollte ausschließlich für Cold Outreach genutzt werden, um die Reputation zu schützen.

**Q: Was passiert, wenn ich die Google Workspace-Kosten nicht mehr zahlen möchte?**  
A: Die E-Mail-Adressen werden deaktiviert und Outreach stoppt. Wir empfehlen, die Domain aktiv zu halten, solange Sie Outreach betreiben.

**Q: Wie lange dauert der Domain-Kauf?**  
A: Bei Cloudflare: 5-10 Minuten. Die Domain ist sofort aktiv.

**Q: Was ist, wenn ich bei einem Schritt nicht weiterkomme?**  
A: Kein Problem! Schicken Sie uns einen Screenshot + kurze Beschreibung des Problems. Wir helfen Ihnen sofort weiter.

**Q: Muss ich die Domain jedes Jahr verlängern?**  
A: Wenn Sie bei Cloudflare "Auto-Renew" aktiviert haben (empfohlen), verlängert sich die Domain automatisch. Sie müssen nichts tun.

---

## Alternative: Concierge Setup (wir machen's für Sie)

**Keine Zeit oder Lust auf technisches Setup?**

Wir übernehmen Domain-Kauf + Google Workspace Setup + DNS-Konfiguration für Sie.

**Kosten:** €150 einmalig  
**Sie müssen nur:** Uns die Firmendaten geben, wir machen den Rest  
**Domain bleibt:** In Ihrem Eigentum

**Interesse?** Schreiben Sie uns: **kontakt@kontaktmanufaktur.de**

---

## Support

**Bei Fragen oder Problemen:**

📧 E-Mail: **kontakt@kontaktmanufaktur.de**  
📱 WhatsApp/Signal: **[TELEFONNUMMER]**  
🕒 Antwortzeit: Innerhalb von 24 Stunden (werktags meist innerhalb 2-3 Stunden)

---

**Viel Erfolg beim Setup! Wir freuen uns auf die Zusammenarbeit. 🚀**

*– Das Team von KontaktManufaktur*

---

## Appendix: Alternative Registrar (Namecheap)

Falls Sie lieber Namecheap nutzen möchten (statt Cloudflare):

1. **Gehen Sie zu:** [https://www.namecheap.com](https://www.namecheap.com)
2. Domain suchen und kaufen (ca. €12-15/Jahr)
3. **WhoisGuard aktivieren** (kostenlos, schützt Ihre Daten)
4. **Nameserver auf Cloudflare umstellen:**
   - Namecheap → Domain List → Manage
   - Nameservers: Custom DNS
   - Eintragen: `ns1.cloudflare.com` und `ns2.cloudflare.com`
5. **Bei Cloudflare:** "Add a Site" → Ihre Domain → Free Plan
6. Dann wie oben weitermachen (DNS-Records in Cloudflare)

**Support bei Namecheap-Setup:** kontakt@kontaktmanufaktur.de
