-- Härtung nach dem Code-Review (16.10.2026)
--  1. Upload-Grenzen am Foto-Bucket – serverseitig, unabhängig vom Client.
--  2. Admin-Zugriff auf eine explizite Allowlist beschränken.
-- Im Supabase-SQL-Editor ausführen (nach 0001_init.sql).

-- 1. Bucket-Grenzen -------------------------------------------------------
update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'fotos';

-- 2. Admin-Allowlist ------------------------------------------------------
create table if not exists public.admins (
  email text primary key
);

alter table public.admins enable row level security;

-- Eingeloggte sehen nur ihre eigene Admin-Zeile.
drop policy if exists "eigene_adminzeile" on public.admins;
create policy "eigene_adminzeile"
  on public.admins for select
  to authenticated
  using (email = auth.jwt() ->> 'email');

grant select on public.admins to authenticated;

-- 3. Admin-Policy auf beitraege verschärfen -------------------------------
-- Nur wer in public.admins steht, darf moderieren.
drop policy if exists "admin_verwaltet" on public.beitraege;
create policy "admin_verwaltet"
  on public.beitraege for all
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'))
  with check (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

-- 4. Ersten Admin eintragen (E-Mail anpassen und ausführen!) --------------
-- insert into public.admins (email) values ('deine@email.ch') on conflict do nothing;
