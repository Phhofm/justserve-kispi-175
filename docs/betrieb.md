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
3. URL: `https://<projekt>.supabase.co/rest/v1/beitraege?select=id&limit=1`
4. Header ergänzen: `apikey: <anon-publishable-key>` und `Authorization: Bearer <anon-publishable-key>`
5. Speichern. Ein HTTP-Status 200 bedeutet Erfolg.

Der Ping erzeugt eine Datenbank-Anfrage und hält das Projekt damit aktiv.

## Projekt entpausieren

Falls es doch pausiert wurde: Supabase-Dashboard → Projekt → **Restore/Resume**. Nichts geht verloren.

## Admin-Account anlegen

Supabase-Dashboard → **Authentication → Users → Add user** → E-Mail + Passwort. Mit diesen Daten
meldet man sich unter `/admin` an. Weitere Admins: einfach weitere Users anlegen.

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

Migrationen liegen als SQL in `supabase/migrations/`. Bei Änderungen im SQL-Editor ausführen und
die Datei im Repo mitführen.
