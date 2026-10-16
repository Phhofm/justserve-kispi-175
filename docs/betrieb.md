# Betrieb

## Keep-alive (wichtig für den Dauerbetrieb)

Supabase **pausiert Free-Projekte nach 7 Tagen ohne Datenbank-Aktivität**. Läuft die Seite längere
Zeit ruhig, wird das Projekt pausiert und die Seite zeigt den letzten Stand nicht mehr an – bis es
im Dashboard wieder entpausiert wird.

Dagegen hilft ein **täglicher Ping**. Empfehlung: ein kostenloser externer Cron-Dienst
(z. B. `cron-job.org`), **nicht** eine GitHub-Action – geplante GitHub-Workflows werden nach
60 Tagen Repo-Ruhe automatisch deaktiviert, also genau in der stillen Phase.

**Einrichtung (cron-job.org):**

1. Gratis-Konto anlegen.
2. Neuer Job, täglich (z. B. 06:00).
3. URL (einfachste Variante – Key direkt in der URL):
   `https://<projekt>.supabase.co/rest/v1/beitraege?select=id&limit=1&apikey=<publishable-key>`
   (Alternative ohne Key in der URL: Header `apikey: <key>` und `Authorization: Bearer <key>` setzen.)
4. Speichern.

Ein **HTTP-Status 200** bedeutet Erfolg. Der Key in der URL ist der öffentliche publishable-Key –
er steht ohnehin im ausgelieferten JavaScript.

Der Ping erzeugt eine Datenbank-Anfrage und hält das Projekt damit aktiv.

## Projekt entpausieren

Falls es doch pausiert wurde: Supabase-Dashboard → Projekt → **Restore/Resume**. Nichts geht verloren.

## Admin-Account anlegen

1. Supabase-Dashboard → **Authentication → Users → Add user** → E-Mail + Passwort.
2. Die E-Mail in die **Admin-Allowlist** aufnehmen (SQL-Editor):
   ```sql
   insert into public.admins (email) values ('deine@email.ch') on conflict do nothing;
   ```
3. Unter `/admin` anmelden. Weitere Admins: weitere Users anlegen und deren E-Mail ergänzen.

**Wichtig:** In Supabase unter **Authentication → Sign In / Providers** das **öffentliche
Registrieren deaktivieren** («Allow new users to sign up» aus). Die Moderation ist dank der
`admins`-Allowlist ohnehin geschützt, aber die Registrierung soll geschlossen sein.

## Repository-Variablen für das Deployment

GitHub-Repo → **Settings → Secrets and variables → Actions → Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Diese Werte sind **öffentlich** (sie landen im JS-Bundle); die Sicherheit kommt aus den
RLS-Policies in der Datenbank. Der `service_role`-Key gehört **nie** hierher.

## Testzeilen entfernen

Der RLS-Smoke-Test legt eine Zeile mit `einreicher = '__smoke__'` und Status `pending` an. Im
Supabase-Dashboard unter **Table Editor → beitraege** löschen.

## Migrationen

Migrationen liegen als SQL in `supabase/migrations/` und werden der Reihe nach im SQL-Editor
ausgeführt: `0001_init.sql` (Tabellen, RLS, Bucket), `0002_hardening.sql` (Bucket-Grenzen,
Admin-Allowlist). Bei Änderungen im SQL-Editor ausführen und die Datei im Repo mitführen.
