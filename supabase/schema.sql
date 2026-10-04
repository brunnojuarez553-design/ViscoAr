-- ViscoAr: ejecutar en SQL Editor de un proyecto Supabase.
-- Crea tablas propias. No modifica usuarios ni tablas de otras aplicaciones.
begin;
create table if not exists public.viscoar_licenses (
 user_id uuid primary key references auth.users(id) on delete cascade,
 active boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.viscoar_records (
 owner uuid not null references auth.users(id) on delete cascade,
 id text not null check (char_length(id) between 1 and 100),
 kind text not null check (kind in ('vehicle','favorite','history')),
 data jsonb not null check (jsonb_typeof(data) = 'object'),
 primary key(owner,id,kind)
);
create index if not exists viscoar_records_owner_kind_idx on public.viscoar_records(owner,kind);
alter table public.viscoar_licenses enable row level security;
alter table public.viscoar_records enable row level security;
revoke all on public.viscoar_licenses from anon, authenticated;
revoke all on public.viscoar_records from anon, authenticated;
grant select on public.viscoar_licenses to authenticated;
grant select,insert,update,delete on public.viscoar_records to authenticated;
drop policy if exists viscoar_license_read_own on public.viscoar_licenses;
create policy viscoar_license_read_own on public.viscoar_licenses for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists viscoar_records_read_own on public.viscoar_records;
create policy viscoar_records_read_own on public.viscoar_records for select to authenticated using (
 (select auth.uid())=owner and exists(select 1 from public.viscoar_licenses l where l.user_id=(select auth.uid()) and l.active)
);
drop policy if exists viscoar_records_insert_own on public.viscoar_records;
create policy viscoar_records_insert_own on public.viscoar_records for insert to authenticated with check (
 (select auth.uid())=owner and exists(select 1 from public.viscoar_licenses l where l.user_id=(select auth.uid()) and l.active)
);
drop policy if exists viscoar_records_update_own on public.viscoar_records;
create policy viscoar_records_update_own on public.viscoar_records for update to authenticated using (
 (select auth.uid())=owner and exists(select 1 from public.viscoar_licenses l where l.user_id=(select auth.uid()) and l.active)
) with check (
 (select auth.uid())=owner and exists(select 1 from public.viscoar_licenses l where l.user_id=(select auth.uid()) and l.active)
);
drop policy if exists viscoar_records_delete_own on public.viscoar_records;
create policy viscoar_records_delete_own on public.viscoar_records for delete to authenticated using (
 (select auth.uid())=owner and exists(select 1 from public.viscoar_licenses l where l.user_id=(select auth.uid()) and l.active)
);
commit;
