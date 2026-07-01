-- ============================================================
-- sql-lms initial schema
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

create table public.email_whitelist (
  email       text primary key,
  note        text,
  added_at    timestamptz not null default now()
);

create table public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.datasets (
  id          uuid primary key default uuid_generate_v4(),
  domain      text not null,
  title       text not null,
  description text,
  setup_sql   text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.chapters (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  order_num   integer not null unique,
  created_at  timestamptz not null default now()
);

create table public.problems (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  track           text not null check (track in ('syntax', 'case')),
  domain          text,
  dataset_id      uuid references public.datasets(id) on delete set null,
  chapter_id      uuid references public.chapters(id) on delete set null,
  difficulty      text not null check (difficulty in ('easy', 'medium', 'hard')) default 'easy',
  description     text not null,
  extra_setup_sql text,
  grading_mode    text not null check (grading_mode in ('ordered', 'unordered')) default 'unordered',
  tags            text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Stored separately so RLS can block learners from reading it
create table public.problem_solutions (
  problem_id    uuid primary key references public.problems(id) on delete cascade,
  solution_sql  text not null,
  updated_at    timestamptz not null default now()
);

create table public.submissions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  problem_id    uuid not null references public.problems(id) on delete cascade,
  submitted_sql text not null,
  is_correct    boolean not null,
  submitted_at  timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index on public.submissions (user_id, problem_id);
create index on public.problems (track);
create index on public.problems (domain);
create index on public.problems (difficulty);
create index on public.problems (dataset_id);

-- ============================================================
-- Trigger: auto-create user_profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.email_whitelist    enable row level security;
alter table public.user_profiles      enable row level security;
alter table public.datasets           enable row level security;
alter table public.chapters           enable row level security;
alter table public.problems           enable row level security;
alter table public.problem_solutions  enable row level security;
alter table public.submissions        enable row level security;

-- email_whitelist: only admins can manage; authenticated users can check own email
create policy "admins_manage_whitelist" on public.email_whitelist
  for all to authenticated
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true)
  );

create policy "users_check_own_whitelist" on public.email_whitelist
  for select to authenticated
  using (email = (select email from auth.users where id = auth.uid()));

-- user_profiles: users read own row; admins read all
create policy "users_read_own_profile" on public.user_profiles
  for select to authenticated
  using (id = auth.uid());

create policy "admins_manage_profiles" on public.user_profiles
  for all to authenticated
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true)
  );

-- datasets: authenticated whitelisted users can read; admins can write
create policy "whitelisted_read_datasets" on public.datasets
  for select to authenticated
  using (
    exists (
      select 1 from public.email_whitelist w
      join auth.users u on u.email = w.email
      where u.id = auth.uid()
    )
  );

create policy "admins_manage_datasets" on public.datasets
  for all to authenticated
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true)
  );

-- chapters: same pattern
create policy "whitelisted_read_chapters" on public.chapters
  for select to authenticated
  using (
    exists (
      select 1 from public.email_whitelist w
      join auth.users u on u.email = w.email
      where u.id = auth.uid()
    )
  );

create policy "admins_manage_chapters" on public.chapters
  for all to authenticated
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true)
  );

-- problems: whitelisted users read; admins write
create policy "whitelisted_read_problems" on public.problems
  for select to authenticated
  using (
    exists (
      select 1 from public.email_whitelist w
      join auth.users u on u.email = w.email
      where u.id = auth.uid()
    )
  );

create policy "admins_manage_problems" on public.problems
  for all to authenticated
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true)
  );

-- problem_solutions: NO learner access — only admins + service role (Edge Function)
create policy "admins_manage_solutions" on public.problem_solutions
  for all to authenticated
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true)
  );

-- submissions: users insert own + read own; admins read all
create policy "users_insert_own_submission" on public.submissions
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "users_read_own_submissions" on public.submissions
  for select to authenticated
  using (user_id = auth.uid());

create policy "admins_read_all_submissions" on public.submissions
  for select to authenticated
  using (
    exists (select 1 from public.user_profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- Seed: first admin (update email after deployment)
-- ============================================================
-- After creating your Supabase Auth user, run:
-- UPDATE public.user_profiles SET is_admin = true WHERE email = 'your-admin@email.com';
