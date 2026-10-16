# Trösterli für das Kinderspital Zürich

Website der Sammelaktion **JustServe Pfahl Zürich × Kinderspital Zürich (2027)** – als Beitrag des
Pfahls zum **175-Jahr-Jubiläum der Kirche Jesu Christi der Heiligen der Letzten Tage in der Schweiz**.

Mitglieder reichen Fotos ihrer gekauften «Trösterli» ein; die Website zeigt den Fortschritt pro
Kategorie und gesamt und lässt alles zu einem Mosaik zusammenwachsen.

## Stack

- **Vue 3** (Composition API) + **Vue Router** + **TypeScript**
- **Vite** und **Tailwind CSS 4**
- **Supabase** (Postgres + Storage + Auth + Row Level Security), Region Zürich
- **GitHub Pages** (Deployment über GitHub Actions)
- **Vitest** + **Vue Test Utils**

## Voraussetzungen

- Node ≥ 20 (siehe `.nvmrc`)
- Ein Supabase-Projekt

## Einrichtung

```bash
nvm use            # Node 22
npm install
cp .env.example .env   # VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY eintragen
```

Die Migration einmalig im Supabase-**SQL-Editor** ausführen: `supabase/migrations/0001_init.sql`.

```bash
npm run dev        # Entwicklungsserver
npm run test       # Tests
npm run build      # Produktionsbuild nach dist/
```

## Admin-Moderation

Erreichbar unter `/admin`. Login über **Supabase Auth** (E-Mail + Passwort). Einen Admin-Account
legst Du im Supabase-Dashboard unter **Authentication → Users** an.

## Deployment

Push auf `main` löst den Workflow `.github/workflows/deploy.yml` aus. Nötig sind die
**Repository-Variablen** `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`
(Settings → Secrets and variables → Actions → Variables) sowie GitHub Pages als Quelle
«GitHub Actions».

Details zum Betrieb (Keep-alive, Entpausieren, Admin anlegen) stehen in
[`docs/betrieb.md`](docs/betrieb.md).

## Dokumentation

- Design: [`docs/superpowers/specs/2026-10-16-justserve-kispi-175-design.md`](docs/superpowers/specs/2026-10-16-justserve-kispi-175-design.md)
- Umsetzungsplan: [`docs/superpowers/plans/2026-10-16-justserve-kispi-175.md`](docs/superpowers/plans/2026-10-16-justserve-kispi-175.md)
