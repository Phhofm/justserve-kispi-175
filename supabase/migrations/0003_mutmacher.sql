-- Mutmacher-Karten als zusätzliche, gezählte Kategorie (separat vom 875-Ziel).
-- Im Supabase-SQL-Editor ausführen (nach 0002_hardening.sql).

alter table public.beitraege
  drop constraint if exists beitraege_kategorie_check;

alter table public.beitraege
  add constraint beitraege_kategorie_check
  check (kategorie in ('autos', 'sticker', 'stempel', 'tiere', 'buecher', 'mutmacher'));
