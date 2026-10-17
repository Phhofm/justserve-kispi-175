# JustServe Pfahl Zürich × Kinderspital Zürich – «Trösterli»-Sammelaktion 2027

Design-Dokument · 16. Oktober 2026 · Autor: Philip Hofmann (JustServe-Spezialist Pfahl Zürich)

## 1. Absicht & Warum

Die Kirche feiert 2028 ihr **175-Jahr-Jubiläum in der Schweiz**. Der **Pfahl Zürich** (11 Einheiten) führt 2027 dazu ein gemeinnütziges Dienstprojekt durch: die Sammlung von **«Trösterli»** – kleinen Trost-Geschenken – für das **Kinderspital Zürich (Kispi)**.

Diese Website ist das öffentliche Schaufenster der Aktion. Sie

- zeigt den Sammelfortschritt sichtbar für alle,
- lässt Mitglieder ihre gekauften Artikel per Handy-Foto beisteuern,
- bündelt die Foto-Beiträge zu einem wachsenden Mosaik,
- und bietet einen direkten Spendenweg für alle, die lieber Geld geben.

Sie ist zugleich der digitale Teil des **JustServe-Stands am Jubiläumsanlass 2028**.

## 2. Nutzer

| Rolle | Wer | Tut |
|---|---|---|
| **Mitglieder** | Mitglieder der 11 Einheiten des Pfahls Zürich | Kaufen Artikel, fotografieren, laden vom Handy hoch |
| **Admin** | JustServe-Spezialist (Philip) | Gibt Beiträge frei oder lehnt ab, sieht alles |
| **Öffentlichkeit / Pfahlpräsident** | Interessierte, Präsidentschaft | Sieht Fortschritt und Mosaik, kann spenden |

## 3. Ziele / Nicht-Ziele / Anti-Ziele

**Ziele**
- Mindestens **175 Stück pro Kategorie** (5 × 175 = **875**), offen nach oben.
- Öffentlich sichtbarer Fortschritt pro Kategorie **und** gesamt.
- Toter-einfacher Upload vom Handy.
- Grosses **Mosaikbild** aus allen freigegebenen Fotos (auch als Download).
- Spendenweg zur offiziellen Kispi-Spendenaktion, Anzeigeziel **1'000 CHF**.
- Sauberes, öffentliches Repo ohne Secrets.

**Nicht-Ziele**
- Kein Login für Mitglieder (nur Admin).
- Kein Shop, keine Bestellung, kein Versand.
- Keine Karte, kein Standort, kein Kalender.
- Keine Mehrsprachigkeit (nur Deutsch).
- Keine Offline-Fähigkeit.
- Echtzeit-Updates sind nice-to-have, nicht Pflicht.

**Anti-Ziele** (wäre ein Fehlschlag, auch wenn es technisch läuft)
- Unsicher: Spam, Vandalismus, Datenverlust, geleakte Secrets.
- Unübersichtlich oder unschön – schlechter Eindruck beim Pfahlpräsidenten.
- Mitglieder verstehen den Upload nicht.
- Laufende Kosten oder Lock-in.

## 4. Rahmenbedingungen

- **Kostenlos** – keine Kreditkarte, keine laufenden Kosten.
- Hosting auf **GitHub Pages** (rein statisch).
- **Alle sichtbaren Texte auf Deutsch.**
- **Öffentliches Repo**: sauberer, professioneller Code, keine Secrets.
- Läuft evtl. rund ein Jahr – evtl. aber nur als kurze Demo für den Pfahlpräsidenten. Also **kein Lock-in**, jederzeit löschbar.
- **Mobil-first** (Uploads kommen vom Handy).

## 5. Technische Entscheide (vom Auftraggeber getroffen)

- **Frontend:** Vue 3 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Postgres + Storage + Auth + Row Level Security), Free Tier, **Region Zürich (`eu-central-2`)** – Schweizer Datenhaltung, DSGVO-freundlich.
- **Hosting:** GitHub Pages (statischer Build) + GitHub Actions fürs Deployment
- **Admin-Login:** Supabase Auth (E-Mail + Passwort, Konto = Philips E-Mail) – **bewusst kein PIN** (ein Client-PIN ist trivial umgehbar)
- **Bilder:** Kompression im Browser vor dem Upload (~800 px längste Seite, ~200 KB)
- **Keep-alive:** externer Cron-Ping täglich (cron-job.org), damit das Free-Projekt nicht nach 7 Tagen Inaktivität pausiert (Supabase-dokumentierter Weg). **Nicht** GitHub-Actions-Cron (wird nach 60 Tagen Repo-Ruhe deaktiviert).
- **Keine Secrets:** nur der öffentliche `anon`-Key; Sicherheit kommt aus RLS, nicht aus einem Key. Der `service_role`-Key wird nie ins Frontend gebaut.

## 6. Datenmodell

### Tabelle `beitraege` (Postgres)

| Feld | Typ | Regeln |
|---|---|---|
| `id` | uuid | PK, `gen_random_uuid()` |
| `created_at` | timestamptz | Default `now()` |
| `kategorie` | text | NOT NULL, CHECK in (`autos`,`sticker`,`stempel`,`tiere`,`buecher`) |
| `menge` | int | NOT NULL, CHECK 1–175 |
| `einreicher` | text | NULL, max. 120 Zeichen (optional, z. B. «Familie Muster, Gemeinde Schwamendingen») |
| `foto_pfad` | text | NOT NULL, Pfad im Storage |
| `status` | text | NOT NULL Default `pending`, CHECK in (`pending`,`approved`,`rejected`) |
| `freigegeben_am` | timestamptz | NULL |

Kategorien-Slugs → deutsche Labels liegen im Frontend (stabil, übersetzbar).

### Storage-Bucket `fotos`

- **Public-Bucket**, Dateinamen mit UUID (`pending/<uuid>.jpg`, nach Freigabe `approved/<uuid>.jpg`).
- Policies: `anon` darf **nur in `pending/` einfügen** und **nicht listen**; Lesen nur im `approved/`-Prefix; Löschen/Verschieben nur Admin.
- Da Pfade UUIDs sind und Listing verboten ist, sind nicht freigegebene Fotos nicht auffindbar.
- Abgelehnte Beiträge: Objekt wird gelöscht.

## 7. Features im Detail

### 7.1 Hero / Startseite
- Titel: «175 Jahre Kirche in der Schweiz – JustServe Pfahl Zürich × Kinderspital Zürich»
- Kurze Erklärung des «Trösterli»-Gedankens.
- **Gesamtfortschritt**: `X / 875 Trösterli (Y%)` – offen nach oben.
- Call-to-Action: **«Jetzt beitragen»** → Upload.

### 7.2 Kategorien (5 Karten)
1. Kleine Autos
2. Sticker-Sets & Tattoos
3. Stempel & Farbstifte
4. Plastiktiere & Figuren
5. Kinderbücher & Puzzles

Je Karte: Fortschrittsbalken, Zähler (`X / 175`, `Y%`), Button «Beitrag einreichen», Foto-Grid der freigegebenen Bilder dieser Kategorie.

### 7.3 Fortschrittslogik (offenes Ziel)
- **Minimum 175** pro Kategorie. Balken **cappt bei 100 %** und zeigt dann Häkchen/Konfetti «Ziel erreicht 🎉».
- **Zähler läuft weiter**: `210 / 175 (120 %)`.
- **Gesamt** auf der Startseite: `940 / 875 (107 %)`.

### 7.4 Upload
- Modal, mobil-first.
- Felder: Kategorie (Dropdown; vorausgewählt, wenn über eine Karte geöffnet), Menge (1–175), Name/Gemeinde (optional), Foto (Kamera oder Datei).
- Client-seitige Kompression vor dem Upload.
- Absenden → Status `pending` → Bestätigung («Danke! Dein Beitrag wird geprüft.»).

### 7.5 Moderation (Admin)
- Login über Supabase Auth.
- Liste offener Beiträge mit Foto + Daten.
- **Freigeben** / **Ablehnen**.
- Freigegebene erscheinen im Grid und zählen. Abgelehnte werden verworfen.

### 7.6 Mosaik
- Seite «Mosaik»: alle freigegebenen Fotos als ein grosses Mosaikbild.
- **Download** als einzelnes Bild (client-seitig per Canvas zusammengesetzt).

### 7.7 Spenden
- Karte mit **Spendenbild** und kurzer Erklärung.
- Der **Link wird noch NICHT gesetzt** – der Pfahl legt die eigene Spendenaktion erst an. Bis dahin zeigt der Button «Bald verfügbar» (deaktiviert).
- Anzeige des Ziels **1'000 CHF** (Betrag wird vorerst statisch/manuell gepflegt).

## 8. Sicherheitsmodell

- **Row Level Security** auf `beitraege`:
  - `anon` (nicht eingeloggt): **nur INSERT**. Kein SELECT/UPDATE/DELETE.
  - SELECT öffentlich **nur** für `status = 'approved'`.
  - `authenticated` (Admin): alles.
- **Storage-Policies** wie in §6.
- **Validierung**: Menge 1–175, Textlängen begrenzt, nur Bild-MIME (jpeg/png/webp), Grösse begrenzt.
- **Keine Secrets** im Repo. `anon`-Key und URL sind öffentlich per Design.
- **Keep-alive**: externer Cron verhindert Pausieren.
- **Graceful degradation**: Bei Backend-Ausfall zeigt die Seite den zuletzt bekannten Stand statt einer Fehlermeldung.

### 8.1 Härtung nach Code-Review (16.10.2026, Migration 0002)
- **Upload-Grenzen am Bucket** (`file_size_limit` 10 MB, `allowed_mime_types` jpeg/png/webp) – serverseitig, unabhängig vom Client.
- **Admin-Allowlist** (`public.admins`): Die Moderation ist auf eingetragene E-Mails beschränkt, nicht auf jeden eingeloggten Nutzer. Öffentliche Registrierung in Supabase deaktivieren.
- **Freigabe robust**: Scheitert das Verschieben des Fotos nach `approved/`, bleibt der Pfad unverändert; das Foto ist im öffentlichen Bucket weiterhin erreichbar.
- **Bewusster Kompromiss**: Der Bucket bleibt öffentlich. `pending`-Fotos sind damit über ihre (nicht auflistbare) UUID-URL erreichbar. Ohne Listung praktisch nicht auffindbar; für striktere Isolation wäre ein privater Bucket mit Signed URLs nötig.

## 9. Design & UX

Anspruch: **schön, modern, clean, intuitiv** – mit ansprechenden Visualisierungen, Grafiken und sanften Animationen. Der Ersteindruck beim Pfahlpräsidenten zählt.

- Farben: **JustServe-Blau** plus warme, kinderspital-freundliche Akzente.
- **Mobil-first**, umgesetzt mit Tailwind.
- Eigene Illustrationen/Icons statt Standard-Look; weiche Schatten, grosszügiger Weissraum, runde Ecken.
- **Barrierefrei**: ausreichende Kontraste, Labels, Alt-Texte, Tastaturbedienung.
- Sanfte Animationen; Konfetti beim Erreichen der 175 pro Kategorie.

## 10. Repo & Betrieb

- **Root-`.gitignore`**: `node_modules/`, `dist/`, `.kilo/`, `kilo.json`, `.env*`, Editor-/OS-Dateien.
- **GitHub Actions**: Build (Vite) und Deploy auf GitHub Pages.
- **Env**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (öffentlich; landen ohnehin im Bundle).
- Kein Build-Step-zur-Laufzeit notwendig; Website ist statisch.

## 11. Offene Punkte / Builder-Entscheide

Dem Builder überlassen (kein Auftraggeber-Input nötig):
- Genaue Farbwerte der JustServe-/Kispi-Palette.
- Realtime (Supabase Realtime) vs. Polling beim Laden.
- Mosaik-Layout-Algorithmus (Grid/Quadratisch, Sortierung).
- Ob Konfetti per CSS oder kleiner Lib.
- Genaue Policy-Syntax fürs Storage.
- Detail-Setup des GitHub-Actions-Workflows.

## 12. Abgrenzung

Nicht Teil dieses Projekts: die Logistik der Kisten (Bischofschaften, JAE-Institut), Flyer/Print, das Jubiläumsprogramm 2028. Die Website bildet nur Sammlung, Fortschritt und Spendenweg ab.

## 13. Nach Reviewer-Check festgelegt

Diese Punkte wurden nach dem Builder-Review entschieden (Entscheid des Builders, vom Auftraggeber überprüfbar):

- **Region Zürich (`eu-central-2`)** – Schweizer Datenhaltung für Namen und Fotos.
- **Admin-Konto** = Philips E-Mail; E-Mail-Bestätigung erfolgt durch ihn. Kein weiterer Login-Mechanismus.
- **Keep-alive** über einen externen Dienst (cron-job.org); täglicher Ping auf einen Supabase-Endpunkt.
- **Deutsche Texte**: Der Builder schreibt alle Texte; Philip korrigiert nach dem ersten Build.
- **Langlebigkeit**: Das Design funktioniert für eine kurze Demo **und** für den Jahresbetrieb.
- **Spenden-URL** `https://spendenaktion.kispi.uzh.ch` geprüft: erreichbar (HTTP 200, Plattform Koalect) – wird aber **noch nicht verlinkt**, bis die eigene Aktion steht.

Vom Auftraggeber noch bereitzustellen (vor dem Build):

1. **Supabase-Projekt** anlegen (Free Tier, Region Zürich) – und URL + `anon`-Key mitteilen.

**Repo:** `https://github.com/Phhofm/justserve-kispi-175` (bereits angelegt, Account `Phhofm`).

## 14. Inhalte, Texte & Klärungen (Feedback 16.10.2026)

### Entscheidungen
- **Admin-Dashboard in der Web-App** (Route `/admin`, Task 11): Liste der eingereichten Beiträge mit **Menge + Foto**, Freigeben/Ablehnen. Kein externes Tool.
- **Name/Gemeinde** wird erfasst als freiwilliges Feld «Dein Name & Gemeinde (freiwillig)» (Task 9). Kein Pflichtfeld – senkt die Hürde.
- **Kategorien-Bilder**: je Kategorie ein kleines, einheitliches Icon/Emoji statt echtem Foto (Task 7/13). Echte Beispielbilder später möglich, aber nicht nötig.
- **Mosaik** (Task 10): **pro Kategorie** ein Foto-Grid (schon vorhanden) **und** eine eigene Seite «/mosaik» mit dem grossen **Gesamtmosaik + Download**.
- **Spende** (Task 12): eigener Abschnitt mit **Platzhalter-Karte/Bild**, **noch ohne Link**. Wird ersetzt, sobald die eigene Spendenaktion steht.

### Abschnitt «Über die Aktion» (Text, vom Auftraggeber geliefert)
> Auf den verschiedenen Abteilungen gibt es sog. Belohnungsboxen, aus welchen unsere Patientinnen und Patienten sich nach einer unangenehmen Behandlung ein Geschenkli aussuchen dürfen. Sie sind auch eine gute Ablenkung. Jährlich setzt das Kinderspital Zürich rund 150'000 Trösterli ein! Die Geschenke sollen nicht mehr als 1–3 Franken kosten.

Dienstprojekt-Rahmung:
> Wir machen ein **Dienstprojekt der anderen Art**: Gemeinsam sammeln wir Trösterli für das Kinderspital Zürich und bringen sie als **Trösterlipaket** vorbei – als Beitrag des Pfahls Zürich zum 175-Jahr-Jubiläum unserer Kirche in der Schweiz.

### Abschnitt «Was das Kinderspital braucht» (Hinweise, offizieller Kispi-Text)
> Das Kinderspital ist ein besonderer Ort: neben der medizinischen Versorgung ist uns das Wohlbefinden unserer Patienten sowie deren Angehörigen ein grosses Anliegen. Damit sich Kinder und ihre Familien trotz Krankheit oder Unfall wohl fühlen können, möchten wir ihnen mit kleinen Besonderheiten den Alltag bunter gestalten. In den Wartebereichen des Notfalls und der Poliklinik sowie auf den Bettenstationen haben wir deshalb u.a. Spielsachen und «Trösterli-Gschänkli» für unsere jungen Patientinnen und Patienten. Diese sind sehr wichtig zur Ablenkung in oftmals schwierigen Situationen.
>
> **Wichtig:**
> - Neue und möglichst originalverpackte Spielsachen sind willkommen und bereiten unseren Patienten grosse Freude. Bitte verpacken Sie **KEINE** Spielsachen und Sachspenden in Geschenkpapier.
> - **Achtung:** Stofftiere können wir nicht annehmen, da sie sich nicht desinfizieren lassen und deshalb für immungeschwächte Kinder gefährlich sind.

## 15. Feedback 17.10.2026 (Community, Familien, Ablauf)

- **Preis bleibt 1–3 Franken** (nicht 1–5). Offizieller Kispi-Wert. Wird im Regel-Callout prominent gezeigt, damit niemand Teures kauft oder auspackt.
- **Spenden-Link bleibt deaktiviert** («Bald verfügbar»), bis die eigene Aktion des Pfahls steht.
- **Regeln** («Gut zu wissen») als drei hervorgehobene Kacheln: *Neu & originalverpackt*, *Klein & günstig (1–3 Franken)*, *Keine Stofftiere*. Zusätzlich der Hinweis **kein Geschenkpapier**.
- **Hero und «Über die Aktion»**: wärmerer Dienst- und Familien-Ton («nicht um teure Geschenke, sondern ums Helfen und Mitfühlen»; «als Familie, Primarklasse oder allein»).
- **Ablauf** («So funktioniert's») auf **5 Schritte** erweitert: Einkaufen & hochladen → in der Kapelle abgeben → Pfahlkonferenz Herbst 2027 → Sortieren im Institut (JAE) → Übergabe ans Kinderspital.
- **Mutmacher-Karten** als **eigener Abschnitt** («Wie der Primi mithelfen kann»), **unterhalb** der Kategorien, **oberhalb** der Spende. Sie sind **separat** und zählen **nicht** zu den 875. Status: **«In Abklärung»**, da noch unklar ist, ob das Kinderspital handgemachte Karten annimmt. Kinder malen z. B. eine Superheldin/einen Superhelden und schreiben «Du bist mutig» / «Du bist stark» darauf.
- **Spenden-Abschnitt**: zusätzlich die Idee von **Kuchenverkauf, Sponsorenlauf** oder Bastelaktion; Hinweis, dass ab **1’000 CHF** die offizielle Scheck-Übergabe beim Kispi möglich ist.

## 16. Feedback 17.10.2026 (Sinn früher, Buttons, Teilen, Zeit, Kontakt)

- **Sinn des Projekts nach oben**: Der Abschnitt «Über die Aktion» beginnt jetzt mit dem Warum (Kinder trotz Krankheit/Unfall, Wartebereiche, Ablenkung und Trost). Ohne Fettdruck in diesem Abschnitt.
- **Formulierung**: «Trost» statt «Lächeln» im Hero (passt zum Namen «Trösterli»).
- **2027/2028 erklärt**: «Dienstprojekt für 2027 – unser Beitrag als Pfahl Zürich an die Kinder. Und weil 2028 unsere 175-Jahr-Jubiläumsfeier ansteht, sammeln wir 175 Trösterli aus jeder Kategorie.»
- **Zwei gleich grosse Hero-Buttons**: «Unser Mosaik» (sanftes Autoscrollen zum Mosaik) und «Beitrag einreichen» (öffnet das Upload-Formular).
- **Teilen-Button** («Aktion teilen»): nutzt die Web-Share-API, sonst WhatsApp-Link.
- **Zeitleiste «Unser Weg»** als Grafik: Frühjahr 2027 Start → 2027 Sammeln → Herbst 2027 Sortieren & Übergeben → 2028 Jubiläum.
- **Kinder-Schriftstelle zuerst**: 3. Nephi 17,21 direkt unter dem Hero, noch vor dem Fortschritt. «kleine Kinder» und «segnete» fett.
- **Kontakt-Abschnitt**: Philip Hofmann, JustServe-Spezialist Pfahl Zürich. Allgemeine JustServe-E-Mail wird noch eingerichtet (im Code als `KONTAKT_EMAIL` vorbereitet).
- **Mutmacher-Hinweis entschärft**: Der Satz «separat, zählt nicht zum Zähler» ist entfernt (klang nach Ausschluss); es bleibt ein neutraler Satz zur Abklärung.



