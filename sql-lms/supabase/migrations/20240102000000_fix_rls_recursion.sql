-- ============================================================
-- Fix RLS recursion + auth.users access issues
-- ============================================================
-- Problems in the initial schema:
--   1) user_profiles admin policy referenced user_profiles itself
--      -> "infinite recursion detected in policy" on any read.
--   2) whitelist/read policies queried auth.users, which the
--      `authenticated` role cannot SELECT -> policies silently
--      returned no rows, blocking login and problem listing.
--
-- Fix: use SECURITY DEFINER helper functions (bypass RLS, no
-- recursion) and read the email from the JWT instead of auth.users.
-- ============================================================

-- Helper: current user's email straight from the JWT (no auth.users read)
create or replace function public.current_email()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'email', '')
$$;

-- Helper: is the current user an admin? SECURITY DEFINER -> reads
-- user_profiles as the owner, bypassing RLS, so no recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select up.is_admin from public.user_profiles up where up.id = auth.uid()),
    false
  )
$$;

-- Helper: is the current user whitelisted? SECURITY DEFINER bypasses
-- email_whitelist RLS; email comes from the JWT.
create or replace function public.is_whitelisted()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.email_whitelist w
    where w.email = public.current_email()
  )
$$;

-- ============================================================
-- email_whitelist
-- ============================================================
drop policy if exists "admins_manage_whitelist"   on public.email_whitelist;
drop policy if exists "users_check_own_whitelist" on public.email_whitelist;

create policy "admins_manage_whitelist" on public.email_whitelist
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "users_check_own_whitelist" on public.email_whitelist
  for select to authenticated
  using (email = public.current_email());

-- ============================================================
-- user_profiles
-- ============================================================
drop policy if exists "users_read_own_profile" on public.user_profiles;
drop policy if exists "admins_manage_profiles" on public.user_profiles;

create policy "users_read_own_profile" on public.user_profiles
  for select to authenticated
  using (id = auth.uid());

create policy "admins_manage_profiles" on public.user_profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- datasets
-- ============================================================
drop policy if exists "whitelisted_read_datasets" on public.datasets;
drop policy if exists "admins_manage_datasets"    on public.datasets;

create policy "whitelisted_read_datasets" on public.datasets
  for select to authenticated
  using (public.is_whitelisted());

create policy "admins_manage_datasets" on public.datasets
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- chapters
-- ============================================================
drop policy if exists "whitelisted_read_chapters" on public.chapters;
drop policy if exists "admins_manage_chapters"    on public.chapters;

create policy "whitelisted_read_chapters" on public.chapters
  for select to authenticated
  using (public.is_whitelisted());

create policy "admins_manage_chapters" on public.chapters
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- problems
-- ============================================================
drop policy if exists "whitelisted_read_problems" on public.problems;
drop policy if exists "admins_manage_problems"    on public.problems;

create policy "whitelisted_read_problems" on public.problems
  for select to authenticated
  using (public.is_whitelisted());

create policy "admins_manage_problems" on public.problems
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- problem_solutions  (learners still blocked; admins + service role only)
-- ============================================================
drop policy if exists "admins_manage_solutions" on public.problem_solutions;

create policy "admins_manage_solutions" on public.problem_solutions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- submissions
-- ============================================================
drop policy if exists "users_insert_own_submission" on public.submissions;
drop policy if exists "users_read_own_submissions"  on public.submissions;
drop policy if exists "admins_read_all_submissions" on public.submissions;

create policy "users_insert_own_submission" on public.submissions
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "users_read_own_submissions" on public.submissions
  for select to authenticated
  using (user_id = auth.uid());

create policy "admins_read_all_submissions" on public.submissions
  for select to authenticated
  using (public.is_admin());
