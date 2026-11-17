-- =============================================================================
-- Referans. Uygulamayın.
-- Reference only. Do not apply.
-- =============================================================================
-- Baseline: snapshot of the live Supabase schema (project talent-in-scope)
-- Read from the database catalog on 2026-11-17. Nothing was changed remotely.
--
-- Covers the `public` schema (tables, constraints, functions, RLS policies,
-- grants) plus the two triggers this app installs on `auth.users`.
-- Supabase-managed schemas (auth, storage, extensions, ...) are not included.
--
-- The remote migration history contains 7 entries (all 2026-08-15) that were
-- applied directly to the database and never committed to this repo:
--   20260815145608 create_workforce_data_tables
--   20260815145615 add_current_company_id_helper
--   20260815145617 add_rls_policies_for_company_data
--   20260815145624 restrict_companies_visibility
--   20260815145628 validate_invite_code_server_side
--   20260815150054 lock_down_handle_new_user_rpc
--   20260815150201 add_invite_code_precheck_rpc
-- This file documents their combined end state. It is NOT a migration and is
-- kept outside supabase/migrations/ on purpose so no tooling picks it up.
-- Do not run it against the existing project (all objects already exist).
--
-- Observations recorded as-is (not fixed here):
--   * Each data table has TWO permissive SELECT policies: one via
--     current_company_id() (public.users lookup) and one via the JWT
--     app_metadata.company_id claim. Either one grants access.
--   * No policy checks users.active / companies.active for reads.
--   * handle_new_user() still has EXECUTE for anon/authenticated (trigger
--     functions are not callable through PostgREST, so this is low impact).
--   * check_invite_code(text) is callable by anon (invite-code probing).
--   * users_id_fkey has no ON DELETE CASCADE, so deleting an auth user that
--     has a public.users row fails until that row is removed.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table public.companies (
  id          text not null,
  name        text not null,
  active      boolean default true,
  invite_code text not null,
  max_users   integer default 5,
  created_at  timestamp without time zone default now(),
  constraint companies_pkey primary key (id),
  constraint companies_invite_code_key unique (invite_code)
);

create table public.users (
  id         uuid not null,
  email      text not null,
  company_id text not null,
  role       text default 'user'::text,
  active     boolean default true,
  created_at timestamp without time zone default now(),
  last_login timestamp without time zone,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_id_fkey foreign key (id) references auth.users(id)
);

create table public.monthly (
  company_id       text not null,
  month            text not null,
  total_employees  integer,
  open_to_work_pct numeric(5,2),
  industry_avg_pct numeric(5,2),
  constraint monthly_pkey primary key (company_id, month),
  constraint monthly_company_id_fkey foreign key (company_id)
    references public.companies(id) on delete cascade
);

create table public.departments (
  company_id       text not null,
  month            text not null,
  function         text not null,
  function_tr      text,
  open_to_work_pct numeric(5,2),
  employees        integer,
  constraint departments_pkey primary key (company_id, month, function),
  constraint departments_company_id_fkey foreign key (company_id)
    references public.companies(id) on delete cascade
);

create table public.trends (
  company_id   text not null,
  month        text not null,
  open_to_work numeric(5,2),
  industry     numeric(5,2),
  constraint trends_pkey primary key (company_id, month),
  constraint trends_company_id_fkey foreign key (company_id)
    references public.companies(id) on delete cascade
);


-- -----------------------------------------------------------------------------
-- Functions
-- -----------------------------------------------------------------------------

-- Company of the signed-in user, looked up in public.users (used by RLS).
create or replace function public.current_company_id()
 returns text
 language sql
 stable
 set search_path to 'public'
as $function$
  select company_id from public.users where id = auth.uid();
$function$;

-- BEFORE INSERT trigger on auth.users: validates the invite code sent in
-- raw_user_meta_data and writes the resolved company_id into raw_app_meta_data.
create or replace function public.check_invite_code()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_company text;
begin
  select id into v_company
  from public.companies
  where invite_code = new.raw_user_meta_data->>'invite_code'
    and active = true;

  if v_company is null then
    raise exception 'INVALID_INVITE_CODE';
  end if;

  new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('company_id', v_company);
  return new;
end;
$function$;

-- RPC used as a UX pre-check before sign-up (overload of the name above).
create or replace function public.check_invite_code(p_code text)
 returns boolean
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select exists (
    select 1 from public.companies
    where invite_code = p_code and active = true
  );
$function$;

-- AFTER INSERT trigger on auth.users: mirrors the new user into public.users.
create or replace function public.handle_new_user()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  insert into public.users (id, email, company_id, role)
  values (new.id, new.email, new.raw_app_meta_data->>'company_id', 'user');
  return new;
end;
$function$;


-- -----------------------------------------------------------------------------
-- Triggers on auth.users
-- -----------------------------------------------------------------------------

drop trigger if exists before_auth_user_created on auth.users;
create trigger before_auth_user_created
  before insert on auth.users
  for each row execute function public.check_invite_code();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.companies   enable row level security;
alter table public.users       enable row level security;
alter table public.monthly     enable row level security;
alter table public.departments enable row level security;
alter table public.trends      enable row level security;

-- companies
create policy "Users can view own company" on public.companies
  as permissive for select to public
  using (id = current_company_id());

create policy "companies_own_company" on public.companies
  as permissive for select to authenticated
  using (id = ((auth.jwt() -> 'app_metadata'::text) ->> 'company_id'::text));

-- users
create policy "Users can view own data" on public.users
  as permissive for select to public
  using (auth.uid() = id);

-- monthly
create policy "Users can view own company monthly data" on public.monthly
  as permissive for select to public
  using (company_id = current_company_id());

create policy "monthly_own_company" on public.monthly
  as permissive for select to authenticated
  using (company_id = ((auth.jwt() -> 'app_metadata'::text) ->> 'company_id'::text));

-- departments
create policy "Users can view own company departments" on public.departments
  as permissive for select to public
  using (company_id = current_company_id());

create policy "departments_own_company" on public.departments
  as permissive for select to authenticated
  using (company_id = ((auth.jwt() -> 'app_metadata'::text) ->> 'company_id'::text));

-- trends
create policy "Users can view own company trends" on public.trends
  as permissive for select to public
  using (company_id = current_company_id());

create policy "trends_own_company" on public.trends
  as permissive for select to authenticated
  using (company_id = ((auth.jwt() -> 'app_metadata'::text) ->> 'company_id'::text));


-- -----------------------------------------------------------------------------
-- Grants (as present on the live database; these match Supabase defaults —
-- RLS above is what actually restricts access, and there are no write policies)
-- -----------------------------------------------------------------------------

grant all on table public.companies   to anon, authenticated, service_role;
grant all on table public.users       to anon, authenticated, service_role;
grant all on table public.monthly     to anon, authenticated, service_role;
grant all on table public.departments to anon, authenticated, service_role;
grant all on table public.trends      to anon, authenticated, service_role;

grant execute on function public.current_company_id() to anon, authenticated, service_role;
grant execute on function public.check_invite_code()  to anon, authenticated, service_role;
grant execute on function public.handle_new_user()    to anon, authenticated, service_role;

-- check_invite_code(text) is the only function with EXECUTE revoked from PUBLIC.
revoke all on function public.check_invite_code(text) from public;
grant execute on function public.check_invite_code(text) to anon, authenticated, service_role;
