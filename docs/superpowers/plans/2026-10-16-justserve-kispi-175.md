# JustServe Pfahl Zürich × Kinderspital Zürich – «Trösterli»-Sammelaktion 2027 – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine öffentliche, deutschsprachige Vue-Website, auf der die Mitglieder des Pfahls Zürich Foto-Beiträge («Trösterli») für das Kinderspital Zürich einreichen, der Fortschritt pro Kategorie und gesamt sichtbar ist, und alles zu einem Mosaik zusammenwächst.

**Architecture:** Statisches Vue-3-SPA (Vite), getrieben von Supabase (Postgres + Storage + Auth + RLS). Kein eigener Server. Öffentliche Spaltenlesung nur für freigegebene Beiträge; Einreichen ist offen, Freigabe nur via Auth. Bilder werden im Browser komprimiert und in einen öffentlichen Storage-Bucket mit UUID-Pfaden gelegt.

**Tech Stack:** Vue 3 (Composition API) + Vue Router · TypeScript · Vite 8 · Tailwind CSS 4.3 (`@tailwindcss/vite`) · Vitest + Vue Test Utils · `@supabase/supabase-js` v2 · GitHub Pages (GitHub Actions)

**Spec:** `docs/superpowers/specs/2026-10-16-justserve-kispi-175-design.md`

## Global Constraints

- **Alle sichtbaren Texte auf Deutsch.** Code-Identifier auf Deutsch/Englisch gemischt ist ok, aber UI-Strings immer deutsch.
- **Keine Secrets im Repo.** Nur `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` (beide öffentlich per Design). `service_role`-Key niemals verwenden.
- **Öffentliches Repo** `Phhofm/justserve-kispi-175`; `.gitignore` schliesst `node_modules/`, `dist/`, `.kilo/`, `kilo.json`, `.env*`, Editor-/OS-Dateien aus.
- **Versions-Untergrenzen:** Node ≥ 20, Vue ≥ 3.5, Vite ≥ 8, TypeScript ≥ 5, Tailwind CSS ≥ 4.3, Vitest ≥ 3, `@supabase/supabase-js` ≥ 2.
- **Zielwerte:** 5 Kategorien, je **175** Mindestziel (`ZIEL_PRO_KATEGORIE = 175`), Gesamtziel **875**. Ziel ist **offen nach oben**.
- **Mobile-first**, barrierefrei (Kontraste, Labels, Alt-Texte, Tastaturbedienung).
- **Supabase-Region:** Zürich (`eu-central-2`).

## Review Focus

Diese Eingaben/Fehlerfälle impliziert die Spec, aber kein Feature deckt sie automatisch ab – jeder bekommt einen Test in der zuständigen Task:

1. **Mengen-Manipulation** (`menge` ≤ 0, `menge` > 175, nicht-numerisch) – muss abgelehnt werden (Client **und** DB-CHECK). Test in Task 4/9.
2. **Nicht-Bild- oder Riesen-Upload** (z. B. `.pdf`, 50 MB) – muss abgelehnt werden (MIME + Grösse). Test in Task 6/9.
3. **Übererfüllung** (`210 / 175`) – Balken cappt bei 100 %, Zähler zeigt `210 / 175 (120 %)`. Test in Task 4/7.
4. **Backend aus/Pausiert** beim Laden – Seite zeigt letzten bekannten Stand statt Absturz/Fehlermeldung. Test in Task 5/8.
5. **`einreicher`-Text mit HTML/Skript** – wird nie als Markup gerendert (kein `v-html`). Test in Task 7.

---

## File Structure

```
/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── .gitignore
├── .env.example
├── README.md
├── public/
│   ├── 404.html                 # SPA-Fallback für GitHub Pages
│   └── spendenbild.jpg          # Spendenbild (Platzhalter, wird ersetzt)
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css                # Tailwind-Import + Theme-Tokens
│   ├── router/index.ts
│   ├── lib/
│   │   ├── supabase.ts          # Client (env-basiert)
│   │   ├── types.ts             # Beitrag, CategorySlug, Kategorie, Fortschritt
│   │   ├── categories.ts        # 5 Kategorien (Slug, Label, Farbe, Beschreibung)
│   │   ├── progress.ts          # berechneFortschritt()
│   │   └── imageCompression.ts  # berechneZielmasse(), komprimiereBild()
│   ├── composables/
│   │   ├── useContributions.ts  # laden() + reicheBeitragEin()
│   │   ├── useAuth.ts           # Admin-Login
│   │   └── useModeration.ts     # offene(), freigeben(), ablehnen()
│   ├── components/
│   │   ├── HeroSection.vue
│   │   ├── OverallProgress.vue
│   │   ├── ProgressBar.vue
│   │   ├── CategoryCard.vue
│   │   ├── PhotoGrid.vue
│   │   ├── UploadModal.vue
│   │   ├── DonationSection.vue
│   │   ├── ConfettiOverlay.vue
│   │   └── SiteFooter.vue
│   └── views/
│       ├── HomeView.vue
│       ├── MosaicView.vue
│       └── AdminView.vue
├── supabase/migrations/0001_init.sql   # Tabelle, RLS, Storage-Bucket, Policies
├── scripts/smoke-rls.mjs               # Integrationstest der Policies
└── .github/workflows/deploy.yml        # Build + Deploy auf Pages
```

---

## Task 1: Projekt-Scaffold & Git-Hygiene

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.ts`, `src/App.vue`, `src/style.css`, `.gitignore`, `.env.example`, `README.md`, `src/lib/supabase.ts`

**Interfaces:**
- Produces: lauffähige Vite+Vue+TS+Tailwind-App; `getSupabase()` in `src/lib/supabase.ts`.

- [ ] **Step 1: Vite-Projekt anlegen**

Run: `npm create vite@latest . -- --template vue-ts`
Erwartung: Projektdateien im aktuellen Verzeichnis.

- [ ] **Step 2: Abhängigkeiten installieren**

Run: `npm install && npm install @supabase/supabase-js && npm install -D tailwindcss @tailwindcss/vite vitest @vue/test-utils jsdom @vitest/coverage-v8`
Erwartung: `node_modules/` vorhanden, keine Fehler.

- [ ] **Step 3: Tailwind v4 einbinden**

`vite.config.ts`: `tailwindcss()` aus `@tailwindcss/vite` zu `plugins` hinzufügen. `src/style.css` mit `@import "tailwindcss";` beginnen (Rest der Vite-Demo-CSS löschen). In `src/main.ts` `import './style.css'` sicherstellen.

- [ ] **Step 4: Vitest konfigurieren**

`vite.config.ts`: `test: { environment: 'jsdom', globals: true }`. In `package.json` Skripte ergänzen: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 5: .gitignore schreiben**

Inhalt:
```
node_modules/
dist/
.kilo/
kilo.json
.env
.env.*
!.env.example
.DS_Store
*.log
coverage/
```

- [ ] **Step 6: .env.example schreiben**

```
VITE_SUPABASE_URL=https://<projekt>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

- [ ] **Step 7: Supabase-Client anlegen**

`src/lib/supabase.ts`: lese `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, exportiere `getSupabase(): SupabaseClient` (Singleton). Wirft eine klare deutsche Fehlermeldung, wenn die Env-Variablen fehlen.

- [ ] **Step 8: Smoke-Test schreiben**

`src/App.test.ts`: rendert `App.vue`, erwartet dass ein Element mit `data-testid="app"` existiert.

- [ ] **Step 9: Tests + Build prüfen**

Run: `npm run test` → PASS. Run: `npm run build` → Erwartung: `dist/` entsteht ohne Fehler.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vue 3 + Vite + TS + Tailwind v4"
```

---

## Task 2: Supabase-Schema, RLS & Storage

**Files:**
- Create: `supabase/migrations/0001_init.sql`, `scripts/smoke-rls.mjs`

**Interfaces:**
- Produces: Tabelle `beitraege`, Bucket `fotos`, Policies. (Namen müssen exakt zu Task 3–5 passen.)

- [ ] **Step 1: Migration schreiben**

`supabase/migrations/0001_init.sql`:
- `create table beitraege (...)` mit den Spalten aus Design §6; `menge int not null check (menge between 1 and 175)`; `kategorie text not null check (kategorie in ('autos','sticker','stempel','tiere','buecher'))`; `status text not null default 'pending' check (status in ('pending','approved','rejected'))`.
- `alter table beitraege enable row level security;`
- Policy `oeffentlich_lesen_freigegeben`: `for select using (status = 'approved')`.
- Policy `anon_einreichen`: `for insert to anon with check (status = 'pending')`.
- Policy `admin_alles`: `for all to authenticated using (true) with check (true)`.
- Storage: `insert into storage.buckets (id, name, public) values ('fotos','fotos', true) on conflict do nothing;`
- Storage-Policies: `anon` INSERT nur in Prefix `pending`; SELECT nur Prefix `approved`; DELETE/UPDATE nur `authenticated`.

- [ ] **Step 2: Migration anwenden**

Run: SQL im Supabase-Dashboard (Region Zürich) im SQL-Editor ausführen. Erwartung: keine Fehler.
Anmerkung: Dies setzt das vom Auftraggeber angelegte Supabase-Projekt voraus (URL + anon-Key in `.env`).

- [ ] **Step 3: RLS-Smoke-Test schreiben**

`scripts/smoke-rls.mjs`: nutzt `@supabase/supabase-js` mit dem anon-Key und prüft:
1. INSERT eines `pending`-Beitrags gelingt.
2. SELECT auf `beitraege` liefert den frisch eingefügten (pending) Satz **nicht**.
3. Ein auf `approved` gesetzter Satz (manuell im Dashboard) ist per SELECT sichtbar.
4. DELETE eines Satzes über anon schlägt fehl.

- [ ] **Step 4: Test ausführen**

Run: `node scripts/smoke-rls.mjs`
Erwartung: alle vier Prüfungen erfüllen die Erwartung; Skript endet mit `OK` und Exit-Code 0.

- [ ] **Step 5: Commit**

```bash
git add supabase scripts
git commit -m "feat(db): beitraege-Tabelle, RLS-Policies und fotos-Bucket"
```

---

## Task 3: Typen, Kategorien-Konfiguration

**Files:**
- Create: `src/lib/types.ts`, `src/lib/categories.ts`, `src/lib/types.test.ts`

**Interfaces:**
- Produces:
  - `type CategorySlug = 'autos'|'sticker'|'stempel'|'tiere'|'buecher'`
  - `interface Beitrag { id: string; created_at: string; kategorie: CategorySlug; menge: number; einreicher: string | null; foto_pfad: string; status: 'pending'|'approved'|'rejected'; freigegeben_am: string | null }`
  - `interface Kategorie { slug: CategorySlug; label: string; farbe: string; beschreibung: string }`
  - `const ZIEL_PRO_KATEGORIE = 175`
  - `const KATEGORIEN: Kategorie[]`
  - `function kategorieLabel(slug: CategorySlug): string`

- [ ] **Step 1: Failing test schreiben**

`src/lib/types.test.ts`: erwartet `KATEGORIEN.length === 5`; alle Slugs eindeutig; jede hat nicht-leeres deutsches `label`; `ZIEL_PRO_KATEGORIE === 175`; `kategorieLabel('autos')` liefert den Label-String.

- [ ] **Step 2: Test laufen lassen**

Run: `npm run test -- types`
Erwartung: FAIL (Module fehlen).

- [ ] **Step 3: Implementieren**

`types.ts` und `categories.ts` mit den 5 Kategorien:
`autos` → «Kleine Autos», `sticker` → «Sticker-Sets & Tattoos», `stempel` → «Stempel & Farbstifte», `tiere` → «Plastiktiere & Figuren», `buecher` → «Kinderbücher & Puzzles». Je eine Farbe (Hex) und kurze Beschreibung.

- [ ] **Step 4: Test laufen lassen**

Run: `npm run test -- types`
Erwartung: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat(lib): typen und kategorien-konfiguration"
```

---

## Task 4: Fortschritts-Logik

**Files:**
- Create: `src/lib/progress.ts`, `src/lib/progress.test.ts`

**Interfaces:**
- Consumes: `KATEGORIEN`, `ZIEL_PRO_KATEGORIE`, `Beitrag` (Task 3).
- Produces:
  - `interface KategorieFortschritt { slug: CategorySlug; gesammelt: number; ziel: number; prozent: number; zielErreicht: boolean }`
  - `interface GesamtFortschritt { gesammelt: number; ziel: number; prozent: number; kategorien: KategorieFortschritt[] }`
  - `function berechneFortschritt(beitraege: Pick<Beitrag,'kategorie'|'menge'>[]): GesamtFortschritt`
  - `function balkenBreite(prozent: number): number` (cappt bei 100)

- [ ] **Step 1: Failing tests schreiben**

`src/lib/progress.test.ts`:
- Leere Eingabe → `gesammelt === 0`, `ziel === 875`, alle 5 Kategorien `gesammelt === 0`.
- Menge summiert pro Kategorie; unbekannte Kategorie wird ignoriert.
- Übererfüllung: 210 in `autos` → Kategorie `prozent === 120`, `zielErreicht === true`, `balkenBreite(120) === 100`.
- Gesamtprozent wird über alle Kategorien korrekt gerundet.
- Negative/gebrochene Werte werden nicht eingerechnet (Verteidigung gegen kaputte Daten).

- [ ] **Step 2: Test laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren** (`progress.ts`), `prozent = Math.round(gesammelt / ziel * 100)`, `balkenBreite = Math.min(100, prozent)`.

- [ ] **Step 4: Test laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat(lib): fortschritts-berechnung mit offenem ziel"
```

---

## Task 5: Bildkompression

**Files:**
- Create: `src/lib/imageCompression.ts`, `src/lib/imageCompression.test.ts`

**Interfaces:**
- Produces:
  - `function berechneZielmasse(breite: number, hoehe: number, maxKante: number): { breite: number; hoehe: number }`
  - `async function komprimiereBild(datei: File, maxKante = 800, qualitaet = 0.72): Promise<Blob>`
  - `function istErlaubtesBild(datei: File): boolean` (MIME in `image/jpeg|png|webp`, Grösse ≤ 10 MB)

- [ ] **Step 1: Failing tests schreiben**

`src/lib/imageCompression.test.ts`:
- `berechneZielmasse(1600, 900, 800)` → `{ breite: 800, hoehe: 450 }`.
- `berechneZielmasse(400, 300, 800)` → unverändert `{ breite: 400, hoehe: 300 }`.
- `istErlaubtesBild` akzeptiert `image/jpeg`, lehnt `application/pdf` und eine 20-MB-Datei ab.

- [ ] **Step 2: Test laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren** (`berechneZielmasse` rein rechnerisch; `komprimiereBild` via `createImageBitmap` + `OffscreenCanvas`/`canvas.toBlob`).

- [ ] **Step 4: Test laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat(lib): client-seitige bildkompression und upload-pruefung"
```

---

## Task 6: Datenzugriff (Composables)

**Files:**
- Create: `src/composables/useContributions.ts`, `src/composables/useContributions.test.ts`

**Interfaces:**
- Consumes: `getSupabase()` (T1), `Beitrag`/`Kategorie`/`CategorySlug` (T3), `komprimiereBild`/`istErlaubtesBild` (T5).
- Produces:
  - `interface NeuerBeitrag { kategorie: CategorySlug; menge: number; einreicher?: string; datei: File }`
  - `function useContributions(): { beitraege: Ref<Beitrag[]>; fortschritt: ComputedRef<GesamtFortschritt>; laden(): Promise<void>; fehler: Ref<string|null> }`
  - `async function reicheBeitragEin(input: NeuerBeitrag): Promise<void>`

- [ ] **Step 1: Failing tests schreiben** (Supabase-Client gemockt)

`src/composables/useContributions.test.ts`:
- `laden()` fragt nur `status = 'approved'` ab und befüllt `beitraege`.
- `reicheBeitragEin` mit `menge = 0` / `menge = 176` wirft eine deutsche Validierungsfehlermeldung.
- `reicheBeitragEin` mit ungültigem Dateityp wirft.
- Bei Backend-Fehler setzt `laden()` `fehler` und lässt `beitraege` auf dem letzten Stand (kein Throw) → deckt Review-Focus #4.

- [ ] **Step 2: Test laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren**: Upload nach `pending/<uuid>.<ext>`, dann INSERT in `beitraege` mit `status:'pending'`.

- [ ] **Step 4: Test laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/composables
git commit -m "feat(composables): beitraege laden und einreichen"
```

---

## Task 7: Kern-Komponenten (Balken, Gesamt, Karte, Grid)

**Files:**
- Create: `src/components/ProgressBar.vue`, `src/components/OverallProgress.vue`, `src/components/CategoryCard.vue`, `src/components/PhotoGrid.vue`, `src/components/ConfettiOverlay.vue`; Tests daneben (`*.test.ts`).

**Interfaces:**
- Consumes: `KategorieFortschritt`, `GesamtFortschritt`, `balkenBreite` (T4); `Kategorie`, `Beitrag` (T3).
- Produces: Komponenten mit Props:
  - `ProgressBar` props: `{ gesammelt: number; ziel: number; prozent: number; farbe?: string }`
  - `CategoryCard` props: `{ kategorie: Kategorie; fortschritt: KategorieFortschritt; fotos: Beitrag[] }`, Emit `einreichen(slug)`.
  - `PhotoGrid` props: `{ fotos: Beitrag[] }` – rendert `img` mit `:src` und `:alt`, **nie** `v-html`.

- [ ] **Step 1: Failing tests schreiben**

- `ProgressBar`: Balkenbreite ist `min(prozent,100)` %; bei `zielErreicht` erscheint Text «Ziel erreicht»; Zählertext zeigt `210 / 175 (120 %)`.
- `CategoryCard`: zeigt Label, Zähler und den Button «Beitrag einreichen»; Klick emittiert `einreichen` mit dem Slug.
- `PhotoGrid`: ein `einreicher`-Wert `<img src=x onerror=alert(1)>` erscheint als **Text**, nicht als HTML (Review-Focus #5).

- [ ] **Step 2: Tests laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren** (Tailwind-Klassen, `aria-*`, `alt`-Texte). Konfetti nur bei erstmaligem Erreichen (Prop-getriggert), `prefers-reduced-motion` respektieren.

- [ ] **Step 4: Tests laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat(ui): fortschritts-balken, kategorie-karten und foto-grid"
```

---

## Task 8: Startseite (Hero + Übersicht)

**Files:**
- Create: `src/views/HomeView.vue`, `src/components/HeroSection.vue`, `src/components/SiteFooter.vue`, `src/components/UploadModal.vue` (Grundgerüst), `src/router/index.ts`; Tests daneben.

**Interfaces:**
- Consumes: `useContributions` (T6), `KATEGORIEN` (T3), `berechneFortschritt` (T4).
- Produces: Route `/` → `HomeView`; `UploadModal` mit Props `{ offen: boolean; startKategorie?: CategorySlug }`, Emit `geschlossen`, `eingereicht`.

- [ ] **Step 1: Failing test schreiben**

`HomeView.test.ts`: mit gemockten Daten zeigt die Seite den Hero-Titel «175 Jahre Kirche in der Schweiz», den Gesamtzähler `X / 875 (Y %)` und genau 5 `CategoryCard`s. Bei Backend-Fehler bleibt der letzte Stand sichtbar und es erscheint ein dezenter Hinweis (Review-Focus #4).

- [ ] **Step 2: Test laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren**: Router mit `createWebHistory(import.meta.env.BASE_URL)`, Routen `/`, `/mosaik`, `/admin`. Hero mit CTA «Jetzt beitragen» öffnet `UploadModal`.

- [ ] **Step 4: Test laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat(ui): startseite mit hero und gesamtfortschritt"
```

---

## Task 9: Upload-Modal (Einreichen)

**Files:**
- Modify: `src/components/UploadModal.vue`; Test `src/components/UploadModal.test.ts`.

**Interfaces:**
- Consumes: `reicheBeitragEin` (T6), `KATEGORIEN` (T3), `komprimiereBild`/`istErlaubtesBild` (T5).

- [ ] **Step 1: Failing tests schreiben**

- Menge `0` und `176` blockieren das Absenden mit deutscher Fehlermeldung (Review-Focus #1).
- Dateiauswahl `.pdf` und 20-MB-Datei zeigen Fehler (Review-Focus #2).
- Gültige Eingabe ruft `reicheBeitragEin` auf und zeigt danach «Danke! Dein Beitrag wird geprüft.».

- [ ] **Step 2: Tests laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren**: Kategorie-Dropdown (vorausgewählt via `startKategorie`), Menge (1–175), `einreicher` optional (max 120 Zeichen), Foto (`accept="image/*" capture="environment"`), Kompression vor dem Senden, Ladezustand, Fokus-Falle + Escape zum Schliessen.

- [ ] **Step 4: Tests laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat(ui): upload-modal zum einreichen von beitraegen"
```

---

## Task 10: Mosaik-Ansicht & Download

**Files:**
- Create: `src/views/MosaicView.vue`, `src/lib/mosaic.ts`, `src/lib/mosaic.test.ts`.

**Interfaces:**
- Produces: `function mosaikLayout(anzahl: number): { spalten: number; zeilen: number }`; Route `/mosaik` → `MosaicView`.

- [ ] **Step 1: Failing test schreiben**

`mosaic.test.ts`: `mosaikLayout(0)` → `{0,0}`; `mosaikLayout(9)` quadratisch (3×3); `mosaikLayout(10)` → 4×3 bzw. deckend.

- [ ] **Step 2: Test laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren**: `mosaic.ts` (reine Mathematik). `MosaicView` lädt alle freigegebenen Fotos, zeichnet sie per Canvas in ein Raster und bietet «Mosaik herunterladen» (PNG) an.

- [ ] **Step 4: Test laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib src/views
git commit -m "feat(ui): mosaik-ansicht mit download"
```

---

## Task 11: Admin-Login & Moderation

**Files:**
- Create: `src/composables/useAuth.ts`, `src/composables/useModeration.ts`, `src/views/AdminView.vue`; Tests daneben.

**Interfaces:**
- Produces:
  - `useAuth(): { benutzer: Ref<User|null>; angemeldet: ComputedRef<boolean>; anmelden(email, passwort): Promise<void>; abmelden(): Promise<void> }`
  - `useModeration(): { offene: Ref<Beitrag[]>; laden(): Promise<void>; freigeben(id: string): Promise<void>; ablehnen(id: string): Promise<void> }`

- [ ] **Step 1: Failing tests schreiben**

- `anmelden` mit falschem Passwort → deutsche Fehlermeldung, `angemeldet === false`.
- `freigeben(id)` setzt `status='approved'` und `freigegeben_am` (gemockt geprüft).
- `ablehnen(id)` markiert `rejected` und löscht das Storage-Objekt.
- `AdminView` zeigt ohne Login nur das Login-Formular.

- [ ] **Step 2: Tests laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren**: Supabase Auth `signInWithPassword`; Moderation über authentifizierte Queries; Route `/admin` (kein Link in der öffentlichen Navigation).

- [ ] **Step 4: Tests laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat(admin): login und moderation von beitraegen"
```

---

## Task 12: Spenden-Sektion (Bild, noch kein Link)

**Files:**
- Create: `src/components/DonationSection.vue`, `public/spendenbild.jpg` (Platzhalter); Test daneben.

**Interfaces:**
- Produces: `DonationSection` auf der Startseite; Button «Bald verfügbar» deaktiviert; Anzeige Ziel «1'000 CHF».

- [ ] **Step 1: Failing test schreiben**

`DonationSection.test.ts`: zeigt das Spendenbild (`img` mit Alt-Text), den Text «Bald verfügbar», und **kein** `href` mit `spendenaktion.kispi.uzh.ch` (noch nicht verlinkt).

- [ ] **Step 2: Test laufen lassen** → FAIL.

- [ ] **Step 3: Implementieren**: Karte mit Bild, kurzem Erklärtext zum «Trösterli»-Zweck und deaktiviertem Button. Ein auskommentierter Platzhalter markiert, wo der Link später gesetzt wird.

- [ ] **Step 4: Test laufen lassen** → PASS.

- [ ] **Step 5: Commit**

```bash
git add src public
git commit -m "feat(ui): spenden-sektion mit bild, link noch deaktiviert"
```

---

## Task 13: Design-Feinschliff & Barrierefreiheit

**Files:**
- Modify: `src/style.css` (Theme-Tokens), `src/App.vue`, alle Komponenten.

- [ ] **Step 1: Theme setzen**

In `src/style.css` via Tailwind v4 `@theme` die JustServe-Blau-Palette plus warme Akzente als CSS-Variablen definieren; Schrift, Radien, Schatten festlegen. Sichtbare Texte gegen Kontrastanforderungen prüfen.

- [ ] **Step 2: Animationen & Illustration**

Sanfte Übergänge, Hover-/Fokus-Zustände, ein leichtes SVG-Illustrations-Element im Hero, Konfetti bei Zielerreichung (`prefers-reduced-motion` respektiert).

- [ ] **Step 3: A11y-Durchgang**

Tastaturbedienung des Modals, sichtbarer Fokusring, `alt`-Texte, semantische Überschriftenhierarchie, `lang="de"` in `index.html`.

- [ ] **Step 4: Responsive prüfen**

Run: `npm run dev` und DevTools bei 360 px, 768 px, 1280 px – Layout intakt, kein horizontales Scrollen.

- [ ] **Step 5: Tests + Build**

Run: `npm run test && npm run build` → PASS / fehlerfrei.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "style: theme, animationen und barrierefreiheit"
```

---

## Task 14: Deployment auf GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `public/404.html`; Modify: `vite.config.ts` (`base`).

- [ ] **Step 1: Base-Pfad setzen**

`vite.config.ts`: `base: '/justserve-kispi-175/'` (Projekt-Pages). Für lokale Entwicklung greift `import.meta.env.BASE_URL` bereits im Router.

- [ ] **Step 2: SPA-Fallback**

`public/404.html`: leitet auf `index.html` um (bekanntes GitHub-Pages-SPA-Muster), damit `/mosaik` und `/admin` direkt erreichbar sind.

- [ ] **Step 3: Workflow schreiben**

`.github/workflows/deploy.yml`: bei Push auf `main` → `npm ci`, `npm run build` mit `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` aus Repository-Variablen, Upload als Pages-Artefakt, Deploy via `actions/deploy-pages`.

- [ ] **Step 4: Verifizieren**

Run lokal: `npm run build && npx vite preview` → Seite lädt unter dem Basis-Pfad, Routen funktionieren.
Erwartung nach Push: Actions-Lauf grün, Seite unter `https://phhofm.github.io/justserve-kispi-175/` erreichbar.

- [ ] **Step 5: Commit**

```bash
git add .github public vite.config.ts
git commit -m "ci: build und deploy auf github pages"
```

---

## Task 15: Betrieb: Keep-alive & Doku

**Files:**
- Create: `docs/betrieb.md`; Modify: `README.md`.

- [ ] **Step 1: Betriebsanleitung schreiben**

`docs/betrieb.md` (deutsch): wie man einen täglichen Ping via cron-job.org auf einen Supabase-Endpunkt einrichtet (URL + `apikey`-Header), warum das nötig ist (Free-Pause nach 7 Tagen), wie man im Supabase-Dashboard entpausiert, und wie man einen neuen Admin-Account anlegt.

- [ ] **Step 2: README schreiben**

Kurzbeschreibung, Setup-Schritte (`.env`, Migration anwenden), Skripte (`dev`, `test`, `build`), Deploy-Hinweis und Link zum Design-Dokument.

- [ ] **Step 3: Commit**

```bash
git add README.md docs
git commit -m "docs: betriebsanleitung und readme"
```

---

## Self-Review-Ergebnis

- **Spec-Abdeckung:** Hero/§7.1→T8; Kategorien/§7.2→T7,T8; Fortschrittslogik/§7.3→T4,T7; Upload/§7.4→T9; Moderation/§7.5→T11; Mosaik/§7.6→T10; Spenden/§7.7→T12; Sicherheit/§8→T2,T6,T9; Design/§9→T13; Repo&Betrieb/§10→T1,T14,T15. Alle abgedeckt.
- **Typkonsistenz:** `CategorySlug`, `Beitrag`, `KategorieFortschritt`, `GesamtFortschritt`, `NeuerBeitrag` durchgehend gleich benannt.
- **Review Focus:** #1→T4/T9, #2→T5/T9, #3→T4/T7, #4→T6/T8, #5→T7.
