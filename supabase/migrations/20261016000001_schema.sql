-- Veleta Finance — core schema
-- Apply in order with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- All learner progress tables are written ONLY by SECURITY DEFINER functions in
-- 20261016000002_functions.sql; browsers can read their own rows through RLS.

create schema if not exists veleta_private;
revoke all on schema veleta_private from public;

-- ---------------------------------------------------------------------------
-- Curriculum reference data (generated from src/content by
-- `npm run content:sql` into 20261016000004_content_seed.sql). Only the
-- server reads it; the browser has its own copy of the lesson text.
-- ---------------------------------------------------------------------------
create table veleta_private.courses (
  id text primary key,
  title text not null,
  pass_mark numeric not null check (pass_mark > 0 and pass_mark <= 1),
  position int not null
);

create table veleta_private.units (
  id text primary key,
  course_id text not null references veleta_private.courses(id) on delete cascade,
  position int not null,
  title text not null,
  unique (course_id, position)
);

create table veleta_private.lessons (
  id text primary key,
  course_id text not null references veleta_private.courses(id) on delete cascade,
  unit_id text not null references veleta_private.units(id) on delete cascade,
  position int not null,
  title text not null,
  unique (unit_id, position)
);

create table veleta_private.assessments (
  id text primary key,
  kind text not null check (kind in ('checkpoint', 'exam')),
  course_id text not null references veleta_private.courses(id) on delete cascade,
  unit_id text references veleta_private.units(id) on delete cascade,
  pass_mark numeric not null check (pass_mark > 0 and pass_mark <= 1),
  title text not null
);

create table veleta_private.questions (
  id text primary key,
  kind text not null check (kind in ('mcq', 'tf', 'multi', 'numeric', 'match', 'order')),
  lesson_id text references veleta_private.lessons(id) on delete cascade,
  assessment_id text references veleta_private.assessments(id) on delete cascade,
  answer jsonb not null,
  tolerance numeric not null default 0,
  concept text not null,
  check ((lesson_id is null) <> (assessment_id is null))
);
create index on veleta_private.questions (lesson_id);
create index on veleta_private.questions (assessment_id);

create table veleta_private.config (
  key text primary key,
  value numeric not null
);

create table veleta_private.mission_templates (
  id text primary key,
  period text not null check (period in ('daily', 'weekly')),
  metric text not null,
  target int not null check (target > 0),
  title text not null
);

create table veleta_private.mission_rotation (
  period text not null check (period in ('daily', 'weekly')),
  idx int not null,
  template_ids text[] not null,
  primary key (period, idx)
);

-- ---------------------------------------------------------------------------
-- Learner data
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 40 and display_name !~ '[<>]'),
  avatar text not null default 'vane' check (avatar ~ '^[a-z0-9-]{1,24}$'),
  bio text not null default '' check (char_length(bio) <= 160),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  experience text not null default 'none' check (experience in ('none', 'some', 'experienced')),
  interests text[] not null default '{}' check (cardinality(interests) <= 8),
  daily_goal int not null default 2 check (daily_goal in (1, 2, 3, 5)),
  intensity text not null default 'balanced' check (intensity in ('relaxed', 'balanced', 'challenge')),
  market text not null default 'both' check (market in ('uk', 'us', 'both')),
  timezone text not null default 'UTC' check (char_length(timezone) <= 64),
  onboarded boolean not null default false,
  show_on_leaderboard boolean not null default true,
  recommended_course text check (recommended_course ~ '^c[0-9]{1,2}$')
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references veleta_private.lessons(id),
  completed_at timestamptz not null default now(),
  first_accuracy numeric not null,
  best_accuracy numeric not null,
  completions int not null default 1,
  primary key (user_id, lesson_id)
);

create table public.assessment_attempts (
  id uuid primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  assessment_id text not null references veleta_private.assessments(id),
  score numeric not null check (score between 0 and 1),
  correct int not null,
  total int not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);
create index on public.assessment_attempts (user_id, assessment_id);

-- Detailed responses stay private (no client SELECT policy).
create table veleta_private.attempt_answers (
  attempt_id uuid primary key references public.assessment_attempts(id) on delete cascade,
  answers jsonb not null,
  results jsonb not null
);

create table public.question_stats (
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null references veleta_private.questions(id),
  concept text not null,
  box int not null check (box between 0 and 5),
  attempts int not null,
  correct int not null,
  last_day date not null,
  due_day date not null,
  promoted_day date,
  primary key (user_id, question_id)
);

create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_key text not null,
  amount int not null check (amount > 0 and amount <= 1000),
  label text not null,
  day date not null,
  created_at timestamptz not null default now(),
  unique (user_id, source_key)
);
create index on public.xp_events (user_id, created_at);

create table public.daily_activity (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  activities int not null default 0,
  xp int not null default 0,
  goal_met boolean not null default false,
  primary key (user_id, day)
);

create table public.streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current int not null default 0,
  longest int not null default 0,
  last_day date,
  freezes int not null default 1 check (freezes between 0 and 2)
);

create table public.streak_freeze_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  used_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table public.mission_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_key text not null,
  template_id text not null references veleta_private.mission_templates(id),
  progress int not null default 0,
  target int not null,
  completed boolean not null default false,
  primary key (user_id, mission_key)
);

create table public.learner_counters (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  revision_sessions int not null default 0,
  perfect_lessons int not null default 0,
  perfect_checkpoints int not null default 0
);

create table public.certificates (
  id text primary key check (id ~ '^VF-[A-Z0-9]{4}-[A-Z0-9]{4}$'),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references veleta_private.courses(id),
  recipient_name text not null,
  score numeric not null,
  attempt_id uuid not null references public.assessment_attempts(id),
  issued_at timestamptz not null default now(),
  revoked boolean not null default false,
  revoked_reason text
);
create unique index certificates_one_active_per_course on public.certificates (user_id, course_id) where not revoked;

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references public.profiles(id) on delete cascade,
  addressee uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester <> addressee)
);
create unique index friendships_pair on public.friendships (least(requester, addressee), greatest(requester, addressee));
create index on public.friendships (addressee, status);

-- Idempotency: a repeated request with the same attempt id returns the stored result.
create table veleta_private.processed_requests (
  user_id uuid not null references public.profiles(id) on delete cascade,
  attempt_id uuid not null,
  kind text not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, attempt_id)
);

-- Simple per-user rate limiting for social actions.
create table veleta_private.rate_events (
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);
create index on veleta_private.rate_events (user_id, action, created_at);
