-- JustServe Pfahl Zürich × Kinderspital Zürich – «Trösterli» 2027
-- Tabellen, Row Level Security und Foto-Speicher.
-- Ausführen im Supabase SQL-Editor (Region Zürich: eu-central-2).

-- 1. Tabelle --------------------------------------------------------------
create table if not exists public.beitraege (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kategorie text not null check (kategorie in ('autos','sticker','stempel','tiere','buecher')),
  menge int not null check (menge between 1 and 175),
  einreicher text check (char_length(einreicher) <= 120),
  foto_pfad text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  freigegeben_am timestamptz
);

create index if not exists beitraege_status_idx on public.beitraege (status);
create index if not exists beitraege_kategorie_idx on public.beitraege (kategorie);

-- 2. Row Level Security ---------------------------------------------------
alter table public.beitraege enable row level security;

-- Öffentlich: nur freigegebene Beiträge lesen
drop policy if exists "oeffentlich_liest_freigegebene" on public.beitraege;
create policy "oeffentlich_liest_freigegebene"
  on public.beitraege for select
  using (status = 'approved');

-- Öffentlich: nur einreichen, und nur als «pending»
drop policy if exists "oeffentlich_reicht_ein" on public.beitraege;
create policy "oeffentlich_reicht_ein"
  on public.beitraege for insert
  to anon
  with check (status = 'pending');

-- Admin (eingeloggt): alles
drop policy if exists "admin_verwaltet" on public.beitraege;
create policy "admin_verwaltet"
  on public.beitraege for all
  to authenticated
  using (true)
  with check (true);

-- 3. Tabellenrechte -------------------------------------------------------
-- «Automatically expose new tables» ist deaktiviert, darum explizit erteilen.
grant usage on schema public to anon, authenticated;
grant select on public.beitraege to anon;
grant insert on public.beitraege to anon;
grant select, insert, update, delete on public.beitraege to authenticated;

-- 4. Foto-Speicher --------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

drop policy if exists "fotos_oeffentlich_einreichen" on storage.objects;
create policy "fotos_oeffentlich_einreichen"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = 'pending');

drop policy if exists "fotos_oeffentlich_lesen_freigegeben" on storage.objects;
create policy "fotos_oeffentlich_lesen_freigegeben"
  on storage.objects for select
  to anon
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = 'approved');

drop policy if exists "fotos_admin_verwaltet" on storage.objects;
create policy "fotos_admin_verwaltet"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'fotos')
  with check (bucket_id = 'fotos');
