-- Veleta Finance: complete database setup (all migrations in order).
-- Paste this whole file into Supabase → SQL Editor → New query, then press Run. Run it ONCE.


-- ===== 20261016000001_schema.sql =====
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


-- ===== 20261016000002_functions.sql =====
-- Veleta Finance — trusted server-side logic.
-- Mirrors src/backend/rules.ts. Every function that changes progress runs as
-- SECURITY DEFINER with an empty search_path, derives the learner from
-- auth.uid(), grades answers against the server's own answer keys and never
-- accepts XP amounts, scores or dates from the client.
--
-- Error codes (SQLSTATE) understood by src/backend/supabase.ts:
--   VL001 locked, VL002 validation, VL003 not found, VL004 forbidden,
--   VL005 conflict, VL006 rate limited, 28000 not signed in.

-- ---------------------------------------------------------------- helpers --
create or replace function veleta_private.cfg(k text) returns numeric
language sql stable set search_path = '' as $$
  select value from veleta_private.config where key = k
$$;

create or replace function veleta_private.require_uid() returns uuid
language plpgsql stable set search_path = '' as $$
declare uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Please sign in.' using errcode = '28000';
  end if;
  return uid;
end $$;

create or replace function veleta_private.rate_limit(uid uuid, p_action text, p_max int, p_window interval) returns void
language plpgsql set search_path = '' as $$
begin
  if (select count(*) from veleta_private.rate_events r
      where r.user_id = uid and r.action = p_action and r.created_at > now() - p_window) >= p_max then
    raise exception 'You are doing that too often. Please wait a little and try again.' using errcode = 'VL006';
  end if;
  insert into veleta_private.rate_events (user_id, action) values (uid, p_action);
end $$;

create or replace function veleta_private.user_today(uid uuid) returns date
language sql stable set search_path = '' as $$
  select (now() at time zone coalesce((select p.timezone from public.preferences p where p.user_id = uid), 'UTC'))::date
$$;

create or replace function veleta_private.week_start(d date) returns date
language sql immutable set search_path = '' as $$
  select d - (extract(isodow from d)::int - 1)
$$;

create or replace function veleta_private.validate_timezone() returns trigger
language plpgsql set search_path = '' as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names t where t.name = new.timezone) then
    raise exception 'Unknown time zone.' using errcode = 'VL002';
  end if;
  return new;
end $$;

create trigger preferences_timezone before insert or update of timezone on public.preferences
  for each row execute function veleta_private.validate_timezone();

-- Prevent learners from editing protected columns even if grants change.
create or replace function veleta_private.protect_preferences() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.user_id := old.user_id;
  return new;
end $$;
create trigger preferences_protect before update on public.preferences
  for each row execute function veleta_private.protect_preferences();

-- --------------------------------------------------------------- grading --
create or replace function veleta_private.grade(p_kind text, p_key jsonb, p_tol numeric, p_answer jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
begin
  if p_answer is null then
    return false;
  end if;
  if p_kind = 'numeric' then
    if jsonb_typeof(p_answer) <> 'number' then return false; end if;
    return abs((p_answer #>> '{}')::numeric - (p_key #>> '{}')::numeric) <= p_tol + 0.000000001;
  elsif p_kind = 'multi' then
    if jsonb_typeof(p_answer) <> 'array' or jsonb_array_length(p_answer) <> jsonb_array_length(p_key) then return false; end if;
    return coalesce((select jsonb_agg(v order by (v #>> '{}')::numeric) from jsonb_array_elements(p_answer) v where jsonb_typeof(v) = 'number'), '[]'::jsonb) = p_key;
  else
    return p_answer = p_key;
  end if;
end $$;

-- Validates that p_answers has a well-formed answer for every question id.
create or replace function veleta_private.check_answers(p_answers jsonb, p_ids text[]) returns void
language plpgsql immutable set search_path = '' as $$
declare v jsonb; qid text;
begin
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Answers must be an object.' using errcode = 'VL002';
  end if;
  foreach qid in array p_ids loop
    v := p_answers -> qid;
    if v is null
       or not (jsonb_typeof(v) = 'number'
               or (jsonb_typeof(v) = 'array' and jsonb_array_length(v) <= 20
                   and not exists (select 1 from jsonb_array_elements(v) e where jsonb_typeof(e) <> 'number'))) then
      raise exception 'Please answer every question before submitting.' using errcode = 'VL002';
    end if;
  end loop;
end $$;

-- Leitner update; mirrors src/engine/mastery.ts updateStat().
create or replace function veleta_private.update_stat(uid uuid, p_qid text, p_concept text, p_ok boolean, p_day date) returns void
language plpgsql set search_path = '' as $$
declare s public.question_stats; v_box int; v_prom date;
  intervals int[] := array[0, 1, 3, 7, 14, 30];
begin
  select * into s from public.question_stats where user_id = uid and question_id = p_qid for update;
  if not found then
    v_box := case when p_ok then 1 else 0 end;
    v_prom := case when p_ok then p_day end;
    insert into public.question_stats (user_id, question_id, concept, box, attempts, correct, last_day, due_day, promoted_day)
    values (uid, p_qid, p_concept, v_box, 1, case when p_ok then 1 else 0 end, p_day, p_day + intervals[v_box + 1], v_prom);
    return;
  end if;
  v_prom := s.promoted_day;
  if p_ok then
    v_box := case when s.promoted_day = p_day then s.box else least(5, s.box + 1) end;
    if v_box > s.box then v_prom := p_day; end if;
  else
    v_box := greatest(0, s.box - 2);
  end if;
  update public.question_stats set
    box = v_box, attempts = s.attempts + 1, correct = s.correct + case when p_ok then 1 else 0 end,
    last_day = p_day, due_day = p_day + intervals[v_box + 1], promoted_day = v_prom
  where user_id = uid and question_id = p_qid;
end $$;

-- ------------------------------------------------------------------- XP --
create or replace function veleta_private.award_xp(uid uuid, p_key text, p_amount int, p_label text, p_day date) returns int
language plpgsql set search_path = '' as $$
begin
  if p_amount <= 0 then return 0; end if;
  insert into public.xp_events (user_id, source_key, amount, label, day)
  values (uid, p_key, p_amount, p_label, p_day)
  on conflict (user_id, source_key) do nothing;
  if not found then return 0; end if;
  insert into public.daily_activity (user_id, day, xp) values (uid, p_day, p_amount)
  on conflict (user_id, day) do update set xp = public.daily_activity.xp + p_amount;
  return p_amount;
end $$;

-- ------------------------------------------------------------- missions --
create or replace function veleta_private.current_missions(p_day date)
returns table (mission_key text, template_id text, period text, metric text, target int, title text)
language sql stable set search_path = '' as $$
  with idx as (
    select ((p_day - date '2024-01-01') % 3 + 3) % 3 as d,
           (((veleta_private.week_start(p_day) - date '2024-01-01') / 7) % 2 + 2) % 2 as w
  ), slots as (
    select 'daily:' || to_char(p_day, 'YYYY-MM-DD') || ':' || t.tid as mission_key, t.tid, t.ord, 0 as grp
    from idx, veleta_private.mission_rotation r, unnest(r.template_ids) with ordinality as t(tid, ord)
    where r.period = 'daily' and r.idx = idx.d
    union all
    select 'weekly:' || to_char(veleta_private.week_start(p_day), 'YYYY-MM-DD') || ':' || t.tid, t.tid, t.ord, 1
    from idx, veleta_private.mission_rotation r, unnest(r.template_ids) with ordinality as t(tid, ord)
    where r.period = 'weekly' and r.idx = idx.w
  )
  select s.mission_key, m.id, m.period, m.metric, m.target, m.title
  from slots s join veleta_private.mission_templates m on m.id = s.tid
  order by s.grp, s.ord
$$;

create or replace function veleta_private.mission_event(uid uuid, p_day date, p_metric text, p_inc int) returns void
language plpgsql set search_path = '' as $$
declare m record; v_done boolean;
begin
  if p_inc <= 0 then return; end if;
  for m in select * from veleta_private.current_missions(p_day) c where c.metric = p_metric loop
    insert into public.mission_progress (user_id, mission_key, template_id, progress, target)
    values (uid, m.mission_key, m.template_id, 0, m.target)
    on conflict (user_id, mission_key) do nothing;
    update public.mission_progress
      set progress = least(target, progress + p_inc), completed = least(target, progress + p_inc) >= target
      where user_id = uid and mission_key = m.mission_key and not completed
      returning completed into v_done;
    if v_done then
      perform veleta_private.award_xp(uid, 'mission:' || m.mission_key,
        (case when m.period = 'daily' then veleta_private.cfg('dailyMission') else veleta_private.cfg('weeklyMission') end)::int,
        'Mission: ' || m.title, p_day);
    end if;
  end loop;
end $$;

-- -------------------------------------------------------------- streaks --
-- Counts one activity for the day; meeting the daily goal updates the streak.
create or replace function veleta_private.record_activity(uid uuid, p_day date) returns jsonb
language plpgsql set search_path = '' as $$
declare v_acts int; v_met boolean; v_goal int; s public.streaks;
  v_missed int; v_used int := 0; v_earned boolean := false; v_extended boolean := false;
begin
  insert into public.daily_activity (user_id, day, activities) values (uid, p_day, 1)
  on conflict (user_id, day) do update set activities = public.daily_activity.activities + 1
  returning activities, goal_met into v_acts, v_met;
  select daily_goal into v_goal from public.preferences where user_id = uid;
  if v_met or v_acts < coalesce(v_goal, 2) then
    return jsonb_build_object('goalMetNow', false, 'extended', false, 'freezesUsed', 0, 'freezeEarned', false);
  end if;
  update public.daily_activity set goal_met = true where user_id = uid and day = p_day;

  insert into public.streaks (user_id) values (uid) on conflict do nothing;
  select * into s from public.streaks where user_id = uid for update;
  if s.last_day is not null and p_day <= s.last_day then
    null; -- same day or clock moved backwards: no change
  else
    v_extended := true;
    if s.last_day is null then
      s.current := 1;
    else
      v_missed := p_day - s.last_day - 1;
      if v_missed = 0 then
        s.current := s.current + 1;
      elsif v_missed <= s.freezes then
        insert into public.streak_freeze_usage (user_id, day)
        select uid, d::date from generate_series(s.last_day + 1, p_day - 1, interval '1 day') d
        on conflict do nothing;
        get diagnostics v_used = row_count;
        s.freezes := s.freezes - v_used;
        s.current := s.current + 1;
      else
        s.current := 1;
      end if;
    end if;
    s.last_day := p_day;
    if s.current % 7 = 0 and s.freezes < 2 then
      s.freezes := s.freezes + 1;
      v_earned := true;
    end if;
    s.longest := greatest(s.longest, s.current);
    update public.streaks set current = s.current, longest = s.longest, last_day = s.last_day, freezes = s.freezes where user_id = uid;
  end if;
  perform veleta_private.mission_event(uid, p_day, 'goal_days', 1);
  return jsonb_build_object('goalMetNow', true, 'extended', v_extended, 'freezesUsed', v_used, 'freezeEarned', v_earned);
end $$;

create or replace function veleta_private.streak_view(uid uuid, p_day date) returns jsonb
language plpgsql stable set search_path = '' as $$
declare s public.streaks; v_gap int; v_missed int; v_alive boolean;
begin
  select * into s from public.streaks where user_id = uid;
  if not found or s.last_day is null then
    return jsonb_build_object('current', 0, 'longest', coalesce(s.longest, 0), 'freezes', coalesce(s.freezes, 1), 'doneToday', false, 'missedDays', 0);
  end if;
  v_gap := p_day - s.last_day;
  v_missed := greatest(0, v_gap - 1);
  v_alive := v_gap <= 1 or v_missed <= s.freezes;
  return jsonb_build_object('current', case when v_alive then s.current else 0 end, 'longest', s.longest, 'freezes', s.freezes,
    'doneToday', v_gap = 0, 'missedDays', v_missed);
end $$;

-- ---------------------------------------------------------- achievements --
-- Mirrors src/engine/achievements.ts.
create or replace function veleta_private.evaluate_achievements(uid uuid) returns void
language plpgsql set search_path = '' as $$
declare v_lessons int; v_perfect int; v_longest int; v_courses text[]; v_rev int; v_goal_days int; v_friends int; v_perfect_cp int;
begin
  select count(*) into v_lessons from public.lesson_progress where user_id = uid;
  select coalesce(perfect_lessons, 0), coalesce(revision_sessions, 0), coalesce(perfect_checkpoints, 0)
    into v_perfect, v_rev, v_perfect_cp from public.learner_counters where user_id = uid;
  select coalesce(longest, 0) into v_longest from public.streaks where user_id = uid;
  select coalesce(array_agg(course_id), '{}') into v_courses from public.certificates where user_id = uid and not revoked;
  select count(*) into v_goal_days from public.daily_activity where user_id = uid and goal_met;
  select count(*) into v_friends from public.friendships where status = 'accepted' and uid in (requester, addressee);
  insert into public.user_achievements (user_id, achievement_id)
  select uid, a.id from (values
    ('first_lesson', v_lessons >= 1),
    ('perfect_lesson', coalesce(v_perfect, 0) >= 1),
    ('ten_lessons', v_lessons >= 10),
    ('fifty_lessons', v_lessons >= 50),
    ('streak_7', coalesce(v_longest, 0) >= 7),
    ('streak_30', coalesce(v_longest, 0) >= 30),
    ('consistent', v_goal_days >= 14),
    ('checkpoint_ace', coalesce(v_perfect_cp, 0) >= 1),
    ('revision_champion', coalesce(v_rev, 0) >= 10),
    ('first_course', cardinality(v_courses) >= 1),
    ('foundations', 'c1' = any(v_courses)),
    ('company_analyst', 'c3' = any(v_courses)),
    ('portfolio_builder', 'c4' = any(v_courses)),
    ('valuation_explorer', 'c5' = any(v_courses)),
    ('all_courses', cardinality(v_courses) >= 8),
    ('first_friend', v_friends >= 1)
  ) as a(id, ok)
  where a.ok
  on conflict do nothing;
end $$;

-- ---------------------------------------------------------- progression --
create or replace function veleta_private.lesson_unlocked(uid uuid, p_lesson_id text) returns boolean
language plpgsql stable set search_path = '' as $$
declare l veleta_private.lessons; u veleta_private.units;
begin
  select * into l from veleta_private.lessons where id = p_lesson_id;
  if not found then return false; end if;
  if l.position > 1 then
    return exists (select 1 from public.lesson_progress lp join veleta_private.lessons p on p.id = lp.lesson_id
                   where lp.user_id = uid and p.unit_id = l.unit_id and p.position = l.position - 1);
  end if;
  select * into u from veleta_private.units where id = l.unit_id;
  if u.position = 1 then return true; end if;
  return exists (select 1 from public.assessment_attempts at
                 join veleta_private.assessments a on a.id = at.assessment_id
                 join veleta_private.units pu on pu.id = a.unit_id
                 where at.user_id = uid and at.passed and a.kind = 'checkpoint'
                   and pu.course_id = u.course_id and pu.position = u.position - 1);
end $$;

create or replace function veleta_private.assessment_unlocked(uid uuid, p_assessment_id text) returns boolean
language plpgsql stable set search_path = '' as $$
declare a veleta_private.assessments;
begin
  select * into a from veleta_private.assessments where id = p_assessment_id;
  if not found then return false; end if;
  if a.kind = 'checkpoint' then
    return not exists (select 1 from veleta_private.lessons l where l.unit_id = a.unit_id
                       and not exists (select 1 from public.lesson_progress lp where lp.user_id = uid and lp.lesson_id = l.id));
  end if;
  return not exists (select 1 from veleta_private.assessments c where c.course_id = a.course_id and c.kind = 'checkpoint'
                     and not exists (select 1 from public.assessment_attempts at where at.user_id = uid and at.assessment_id = c.id and at.passed));
end $$;

-- ------------------------------------------------------- result summary --
create or replace function veleta_private.reward_summary(uid uuid, p_day date, p_activity jsonb) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'xpAwarded', coalesce((select sum(amount) from public.xp_events where user_id = uid and created_at = now()), 0),
    'xpBreakdown', coalesce((select jsonb_agg(jsonb_build_object('label', label, 'amount', amount) order by id)
                             from public.xp_events where user_id = uid and created_at = now()), '[]'::jsonb),
    'totalXp', coalesce((select sum(amount) from public.xp_events where user_id = uid), 0),
    'streak', jsonb_build_object(
      'current', veleta_private.streak_view(uid, p_day) -> 'current',
      'extended', coalesce(p_activity -> 'extended', 'false'::jsonb),
      'freezesUsed', coalesce(p_activity -> 'freezesUsed', '0'::jsonb),
      'freezeEarned', coalesce(p_activity -> 'freezeEarned', 'false'::jsonb)),
    'goalMetNow', coalesce(p_activity -> 'goalMetNow', 'false'::jsonb),
    'newAchievements', coalesce((select jsonb_agg(achievement_id order by achievement_id) from public.user_achievements
                                 where user_id = uid and unlocked_at = now()), '[]'::jsonb),
    'missionsCompleted', coalesce((select jsonb_agg(substr(label, 10) order by id) from public.xp_events
                                   where user_id = uid and created_at = now() and source_key like 'mission:%'), '[]'::jsonb)
  )
$$;

create or replace function veleta_private.begin_request(uid uuid, p_attempt_id uuid) returns jsonb
language plpgsql set search_path = '' as $$
declare v jsonb;
begin
  if p_attempt_id is null then
    raise exception 'Missing attempt id.' using errcode = 'VL002';
  end if;
  -- Serialise each learner's submissions so concurrent duplicates cannot double-award.
  perform pg_advisory_xact_lock(hashtextextended(uid::text, 42));
  select result into v from veleta_private.processed_requests where user_id = uid and attempt_id = p_attempt_id;
  return v;
end $$;

-- ================================================================ RPCs ==

create or replace function public.submit_lesson(p_lesson_id text, p_answers jsonb, p_attempt_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); v_prev jsonb; v_day date; q record;
  v_ok boolean; v_correct int := 0; v_total int := 0; v_first boolean; v_perfect boolean; v_acc numeric;
  v_ids text[]; v_title text; v_activity jsonb; v_result jsonb;
begin
  v_prev := veleta_private.begin_request(uid, p_attempt_id);
  if v_prev is not null then return v_prev; end if;
  select title into v_title from veleta_private.lessons where id = p_lesson_id;
  if not found then raise exception 'Lesson not found.' using errcode = 'VL003'; end if;
  v_first := not exists (select 1 from public.lesson_progress where user_id = uid and lesson_id = p_lesson_id);
  if v_first and not veleta_private.lesson_unlocked(uid, p_lesson_id) then
    raise exception 'Complete the previous lesson first.' using errcode = 'VL001';
  end if;
  select array_agg(id) into v_ids from veleta_private.questions where lesson_id = p_lesson_id;
  perform veleta_private.check_answers(p_answers, v_ids);
  v_day := veleta_private.user_today(uid);

  for q in select * from veleta_private.questions where lesson_id = p_lesson_id order by id loop
    v_ok := veleta_private.grade(q.kind, q.answer, q.tolerance, p_answers -> q.id);
    v_total := v_total + 1;
    if v_ok then v_correct := v_correct + 1; end if;
    perform veleta_private.update_stat(uid, q.id, q.concept, v_ok, v_day);
  end loop;
  v_perfect := v_correct = v_total;
  v_acc := v_correct::numeric / v_total;

  insert into public.lesson_progress (user_id, lesson_id, first_accuracy, best_accuracy)
  values (uid, p_lesson_id, v_acc, v_acc)
  on conflict (user_id, lesson_id) do update
    set completions = public.lesson_progress.completions + 1,
        best_accuracy = greatest(public.lesson_progress.best_accuracy, excluded.best_accuracy);

  if v_first then
    perform veleta_private.award_xp(uid, 'lesson:' || p_lesson_id, veleta_private.cfg('lessonFirstCompletion')::int, 'Lesson: ' || v_title, v_day);
    if v_perfect then
      perform veleta_private.award_xp(uid, 'lesson-perfect:' || p_lesson_id, veleta_private.cfg('lessonPerfectBonus')::int, 'Perfect first attempt', v_day);
    end if;
  end if;
  insert into public.learner_counters (user_id) values (uid) on conflict do nothing;
  if v_perfect then
    update public.learner_counters set perfect_lessons = perfect_lessons + 1 where user_id = uid;
  end if;
  perform veleta_private.mission_event(uid, v_day, 'lessons', 1);
  perform veleta_private.mission_event(uid, v_day, 'correct', v_correct);
  perform veleta_private.mission_event(uid, v_day, 'perfect', case when v_perfect then 1 else 0 end);
  v_activity := veleta_private.record_activity(uid, v_day);
  perform veleta_private.evaluate_achievements(uid);

  v_result := veleta_private.reward_summary(uid, v_day, v_activity) || jsonb_build_object(
    'firstCompletion', v_first, 'correct', v_correct, 'total', v_total, 'perfect', v_perfect);
  insert into veleta_private.processed_requests (user_id, attempt_id, kind, result) values (uid, p_attempt_id, 'lesson', v_result);
  return v_result;
end $$;

create or replace function veleta_private.new_certificate_id() returns text
language plpgsql volatile set search_path = '' as $$
declare alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; b bytea; s text := ''; i int;
  positions int[] := array[0, 1, 2, 3, 4, 5, 9, 10];
begin
  b := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
  foreach i in array positions loop
    s := s || substr(alphabet, (get_byte(b, i) % 32) + 1, 1);
  end loop;
  return 'VF-' || substr(s, 1, 4) || '-' || substr(s, 5, 4);
end $$;

create or replace function public.submit_assessment(p_assessment_id text, p_answers jsonb, p_attempt_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); v_prev jsonb; v_day date; a veleta_private.assessments; q record;
  v_ok boolean; v_correct int := 0; v_total int := 0; v_score numeric; v_passed boolean; v_already boolean;
  v_ids text[]; v_results jsonb := '{}'::jsonb; v_missed text[] := '{}'; v_cert text; v_course_title text;
  v_unit_title text; v_activity jsonb; v_result jsonb; v_name text; v_try int := 0;
begin
  v_prev := veleta_private.begin_request(uid, p_attempt_id);
  if v_prev is not null then return v_prev; end if;
  select * into a from veleta_private.assessments where id = p_assessment_id;
  if not found then raise exception 'Assessment not found.' using errcode = 'VL003'; end if;
  if not veleta_private.assessment_unlocked(uid, p_assessment_id) then
    raise exception '%', case when a.kind = 'exam' then 'Pass every unit checkpoint to unlock the final exam.'
                              else 'Finish the unit''s lessons to unlock this checkpoint.' end using errcode = 'VL001';
  end if;
  perform veleta_private.rate_limit(uid, 'assessment', 30, interval '1 hour');
  select array_agg(id) into v_ids from veleta_private.questions where assessment_id = p_assessment_id;
  perform veleta_private.check_answers(p_answers, v_ids);
  v_day := veleta_private.user_today(uid);

  for q in select * from veleta_private.questions where assessment_id = p_assessment_id order by id loop
    v_ok := veleta_private.grade(q.kind, q.answer, q.tolerance, p_answers -> q.id);
    v_total := v_total + 1;
    v_results := v_results || jsonb_build_object(q.id, v_ok);
    if v_ok then v_correct := v_correct + 1;
    elsif not q.concept = any(v_missed) then v_missed := v_missed || q.concept;
    end if;
  end loop;
  v_score := v_correct::numeric / v_total;
  v_passed := v_score + 0.000000001 >= a.pass_mark;
  v_already := exists (select 1 from public.assessment_attempts where user_id = uid and assessment_id = p_assessment_id and passed);

  insert into public.assessment_attempts (id, user_id, assessment_id, score, correct, total, passed)
  values (p_attempt_id, uid, p_assessment_id, v_score, v_correct, v_total, v_passed);
  insert into veleta_private.attempt_answers (attempt_id, answers, results) values (p_attempt_id, p_answers, v_results);

  if v_passed and a.kind = 'checkpoint' then
    select title into v_unit_title from veleta_private.units where id = a.unit_id;
    perform veleta_private.award_xp(uid, 'checkpoint:' || p_assessment_id, veleta_private.cfg('checkpointPass')::int, 'Checkpoint passed: ' || v_unit_title, v_day);
    if not v_already then perform veleta_private.mission_event(uid, v_day, 'checkpoints', 1); end if;
    if v_score = 1 then
      insert into public.learner_counters (user_id) values (uid) on conflict do nothing;
      update public.learner_counters set perfect_checkpoints = perfect_checkpoints + 1 where user_id = uid;
    end if;
  end if;

  if v_passed and a.kind = 'exam' then
    select title into v_course_title from veleta_private.courses where id = a.course_id;
    perform veleta_private.award_xp(uid, 'exam:' || p_assessment_id, veleta_private.cfg('examPass')::int, 'Final exam passed: ' || v_course_title, v_day);
    select id into v_cert from public.certificates where user_id = uid and course_id = a.course_id and not revoked;
    -- Eligibility re-checked here: every lesson complete and every checkpoint passed.
    if v_cert is null
       and not exists (select 1 from veleta_private.lessons l where l.course_id = a.course_id
                       and not exists (select 1 from public.lesson_progress lp where lp.user_id = uid and lp.lesson_id = l.id))
       and veleta_private.assessment_unlocked(uid, p_assessment_id) then
      select display_name into v_name from public.profiles where id = uid;
      loop
        v_try := v_try + 1;
        begin
          v_cert := veleta_private.new_certificate_id();
          insert into public.certificates (id, user_id, course_id, recipient_name, score, attempt_id)
          values (v_cert, uid, a.course_id, v_name, v_score, p_attempt_id);
          exit;
        exception when unique_violation then
          if v_try >= 5 then raise; end if;
        end;
      end loop;
    end if;
  end if;

  perform veleta_private.mission_event(uid, v_day, 'correct', v_correct);
  v_activity := veleta_private.record_activity(uid, v_day);
  perform veleta_private.evaluate_achievements(uid);

  v_result := veleta_private.reward_summary(uid, v_day, v_activity) || jsonb_build_object(
    'attemptId', p_attempt_id, 'score', v_score, 'correct', v_correct, 'total', v_total, 'passed', v_passed,
    'passMark', a.pass_mark,
    'results', case when a.kind = 'checkpoint' then v_results else 'null'::jsonb end,
    'missedConcepts', to_jsonb(v_missed),
    'courseCompleted', v_cert is not null and v_passed and a.kind = 'exam',
    'certificateId', case when a.kind = 'exam' and v_passed then to_jsonb(v_cert) else 'null'::jsonb end);
  insert into veleta_private.processed_requests (user_id, attempt_id, kind, result) values (uid, p_attempt_id, 'assessment', v_result);
  return v_result;
end $$;

create or replace function public.submit_revision(p_answers jsonb, p_attempt_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); v_prev jsonb; v_day date; q record; v_ids text[];
  v_ok boolean; v_correct int := 0; v_total int := 0; v_results jsonb := '{}'::jsonb; v_sessions int;
  v_activity jsonb; v_result jsonb;
begin
  v_prev := veleta_private.begin_request(uid, p_attempt_id);
  if v_prev is not null then return v_prev; end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Answers must be an object.' using errcode = 'VL002';
  end if;
  select array_agg(k) into v_ids from jsonb_object_keys(p_answers) k;
  if v_ids is null or cardinality(v_ids) < 1 or cardinality(v_ids) > 12 then
    raise exception 'A revision session needs 1–12 questions.' using errcode = 'VL002';
  end if;
  if (select count(*) from veleta_private.questions where id = any(v_ids) and lesson_id is not null) <> cardinality(v_ids) then
    raise exception 'Revision can only include lesson questions.' using errcode = 'VL002';
  end if;
  if exists (select 1 from veleta_private.questions q2 where q2.id = any(v_ids)
             and not exists (select 1 from public.lesson_progress lp where lp.user_id = uid and lp.lesson_id = q2.lesson_id)) then
    raise exception 'You can only revise lessons you have completed.' using errcode = 'VL004';
  end if;
  perform veleta_private.check_answers(p_answers, v_ids);
  v_day := veleta_private.user_today(uid);
  for q in select * from veleta_private.questions where id = any(v_ids) order by id loop
    v_ok := veleta_private.grade(q.kind, q.answer, q.tolerance, p_answers -> q.id);
    v_total := v_total + 1;
    v_results := v_results || jsonb_build_object(q.id, v_ok);
    if v_ok then v_correct := v_correct + 1; end if;
    perform veleta_private.update_stat(uid, q.id, q.concept, v_ok, v_day);
  end loop;
  select count(*) into v_sessions from public.xp_events where user_id = uid and source_key like 'revision:' || to_char(v_day, 'YYYY-MM-DD') || ':%';
  if v_sessions < veleta_private.cfg('revisionSessionsPerDay') then
    perform veleta_private.award_xp(uid, 'revision:' || to_char(v_day, 'YYYY-MM-DD') || ':' || (v_sessions + 1), veleta_private.cfg('revisionSession')::int, 'Revision session', v_day);
  end if;
  insert into public.learner_counters (user_id) values (uid) on conflict do nothing;
  update public.learner_counters set revision_sessions = revision_sessions + 1 where user_id = uid;
  perform veleta_private.mission_event(uid, v_day, 'revisions', 1);
  perform veleta_private.mission_event(uid, v_day, 'correct', v_correct);
  v_activity := veleta_private.record_activity(uid, v_day);
  perform veleta_private.evaluate_achievements(uid);
  v_result := veleta_private.reward_summary(uid, v_day, v_activity) || jsonb_build_object('correct', v_correct, 'total', v_total, 'results', v_results);
  insert into veleta_private.processed_requests (user_id, attempt_id, kind, result) values (uid, p_attempt_id, 'revision', v_result);
  return v_result;
end $$;

-- Everything the app needs for the signed-in learner in one round trip.
create or replace function public.get_my_state() returns jsonb
language plpgsql security definer stable set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); v_day date; v_ws date;
begin
  if not exists (select 1 from public.profiles where id = uid) then
    raise exception 'Profile not found.' using errcode = 'VL003';
  end if;
  v_day := veleta_private.user_today(uid);
  v_ws := veleta_private.week_start(v_day);
  return jsonb_build_object(
    'profile', (select jsonb_build_object('userId', p.id, 'username', p.username, 'displayName', p.display_name, 'avatar', p.avatar,
                 'bio', p.bio, 'isPublic', p.is_public, 'createdAt', p.created_at) from public.profiles p where p.id = uid),
    'prefs', (select jsonb_build_object('experience', p.experience, 'interests', to_jsonb(p.interests), 'dailyGoal', p.daily_goal,
                 'intensity', p.intensity, 'market', p.market, 'timezone', p.timezone, 'onboarded', p.onboarded,
                 'showOnLeaderboard', p.show_on_leaderboard, 'recommendedCourse', p.recommended_course)
              from public.preferences p where p.user_id = uid),
    'today', to_char(v_day, 'YYYY-MM-DD'),
    'xp', jsonb_build_object(
      'total', coalesce((select sum(amount) from public.xp_events where user_id = uid), 0),
      'today', coalesce((select sum(amount) from public.xp_events where user_id = uid and day = v_day), 0),
      'week', coalesce((select sum(amount) from public.xp_events where user_id = uid and day >= v_ws), 0)),
    'streak', veleta_private.streak_view(uid, v_day),
    'todayActivities', coalesce((select activities from public.daily_activity where user_id = uid and day = v_day), 0),
    'lessons', coalesce((select jsonb_object_agg(lesson_id, jsonb_build_object('lessonId', lesson_id, 'completedAt', completed_at,
                 'firstAccuracy', first_accuracy, 'bestAccuracy', best_accuracy, 'completions', completions))
               from public.lesson_progress where user_id = uid), '{}'::jsonb),
    'assessments', coalesce((select jsonb_object_agg(assessment_id, jsonb_build_object('assessmentId', assessment_id, 'attempts', n,
                 'passed', passed, 'bestScore', best, 'lastScore', last_score, 'lastAttemptAt', last_at, 'passedAt', passed_at))
               from (select assessment_id, count(*) n, bool_or(passed) passed, max(score) best,
                            (array_agg(score order by created_at desc))[1] last_score, max(created_at) last_at,
                            min(created_at) filter (where passed) passed_at
                     from public.assessment_attempts where user_id = uid group by assessment_id) s), '{}'::jsonb),
    'achievements', coalesce((select jsonb_object_agg(achievement_id, unlocked_at) from public.user_achievements where user_id = uid), '{}'::jsonb),
    'missions', coalesce((select jsonb_agg(jsonb_build_object('key', m.mission_key, 'templateId', m.template_id, 'title', m.title,
                 'period', m.period, 'progress', coalesce(mp.progress, 0), 'target', m.target, 'completed', coalesce(mp.completed, false),
                 'xp', (case when m.period = 'daily' then veleta_private.cfg('dailyMission') else veleta_private.cfg('weeklyMission') end)::int))
               from veleta_private.current_missions(v_day) m
               left join public.mission_progress mp on mp.user_id = uid and mp.mission_key = m.mission_key), '[]'::jsonb),
    'stats', coalesce((select jsonb_agg(jsonb_build_object('questionId', question_id, 'concept', concept, 'box', box, 'attempts', attempts,
                 'correct', correct, 'lastDay', last_day, 'dueDay', due_day, 'promotedDay', promoted_day))
               from public.question_stats where user_id = uid), '[]'::jsonb),
    'certificates', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'courseId', course_id, 'recipientName', recipient_name,
                 'score', score, 'issuedAt', issued_at, 'revoked', revoked, 'demo', false) order by issued_at)
               from public.certificates where user_id = uid), '[]'::jsonb),
    'activity', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'xp', xp, 'activities', activities, 'goalMet', goal_met) order by day)
               from (select * from public.daily_activity where user_id = uid order by day desc limit 28) d), '[]'::jsonb),
    'counters', jsonb_build_object(
      'revisionSessions', coalesce((select revision_sessions from public.learner_counters where user_id = uid), 0),
      'goalDays', (select count(*) from public.daily_activity where user_id = uid and goal_met),
      'friends', (select count(*) from public.friendships where status = 'accepted' and uid in (requester, addressee)))
  );
end $$;

-- ================================================================ social ==

create or replace function public.is_username_available(p_username text) returns boolean
language sql security definer stable set search_path = '' as $$
  select not exists (select 1 from public.profiles where username = lower(p_username) and id <> auth.uid())
$$;

create or replace function public.search_users(p_query text)
returns table (user_id uuid, username text, display_name text, avatar text)
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); v_q text := lower(btrim(coalesce(p_query, '')));
begin
  if char_length(v_q) < 3 or char_length(v_q) > 40 then
    raise exception 'Search needs 3–40 characters.' using errcode = 'VL002';
  end if;
  perform veleta_private.rate_limit(uid, 'search', 60, interval '10 minutes');
  -- Private profiles are only found by their exact username; public profiles also by prefix.
  return query
    select p.id, p.username, p.display_name, p.avatar from public.profiles p
    where p.id <> uid
      and (p.username = v_q
           or (p.is_public and (p.username like replace(replace(v_q, '%', ''), '_', '\_') || '%'
                                or lower(p.display_name) like '%' || replace(replace(v_q, '%', ''), '_', '\_') || '%')))
    order by (p.username = v_q) desc, p.username
    limit 10;
end $$;

create or replace function public.send_friend_request(p_username text) returns text
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); v_target uuid; f public.friendships;
begin
  perform veleta_private.rate_limit(uid, 'friend_request', 30, interval '1 hour');
  select id into v_target from public.profiles where username = lower(btrim(p_username));
  if v_target is null then raise exception 'No learner with that username.' using errcode = 'VL003'; end if;
  if v_target = uid then raise exception 'You cannot add yourself.' using errcode = 'VL002'; end if;
  select * into f from public.friendships where least(requester, addressee) = least(uid, v_target) and greatest(requester, addressee) = greatest(uid, v_target);
  if found then
    if f.status = 'accepted' then return 'already_friends'; end if;
    if f.requester = uid then return 'already_requested'; end if;
    update public.friendships set status = 'accepted', responded_at = now() where id = f.id;
    perform veleta_private.evaluate_achievements(uid);
    perform veleta_private.evaluate_achievements(v_target);
    return 'accepted';
  end if;
  insert into public.friendships (requester, addressee) values (uid, v_target);
  return 'requested';
end $$;

create or replace function public.respond_friend_request(p_friendship_id uuid, p_accept boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); f public.friendships;
begin
  select * into f from public.friendships where id = p_friendship_id for update;
  if not found or f.addressee <> uid or f.status <> 'pending' then
    raise exception 'Friend request not found.' using errcode = 'VL003';
  end if;
  if p_accept then
    update public.friendships set status = 'accepted', responded_at = now() where id = f.id;
    perform veleta_private.evaluate_achievements(uid);
    perform veleta_private.evaluate_achievements(f.requester);
  else
    delete from public.friendships where id = f.id;
  end if;
end $$;

create or replace function public.remove_friend(p_friendship_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid();
begin
  delete from public.friendships where id = p_friendship_id and uid in (requester, addressee);
  if not found then raise exception 'Friendship not found.' using errcode = 'VL003'; end if;
end $$;

create or replace function public.list_friends()
returns table (friendship_id uuid, user_id uuid, username text, display_name text, avatar text, status text, since timestamptz)
language plpgsql security definer stable set search_path = '' as $$
declare uid uuid := veleta_private.require_uid();
begin
  return query
    select f.id, p.id, p.username, p.display_name, p.avatar,
           case when f.status = 'accepted' then 'accepted' when f.addressee = uid then 'incoming' else 'outgoing' end,
           coalesce(f.responded_at, f.created_at)
    from public.friendships f
    join public.profiles p on p.id = case when f.requester = uid then f.addressee else f.requester end
    where uid in (f.requester, f.addressee)
    order by f.status, p.display_name;
end $$;

-- Weekly window: Monday 00:00 UTC to now. 'all' = lifetime XP.
create or replace function public.friend_leaderboard(p_period text)
returns table (user_id uuid, username text, display_name text, avatar text, xp bigint, is_me boolean)
language plpgsql security definer stable set search_path = '' as $$
declare uid uuid := veleta_private.require_uid(); v_from timestamptz;
begin
  if p_period not in ('week', 'all') then raise exception 'Unknown period.' using errcode = 'VL002'; end if;
  v_from := case when p_period = 'week' then date_trunc('week', now() at time zone 'UTC') at time zone 'UTC' else '-infinity'::timestamptz end;
  return query
    with members as (
      select uid as id
      union
      select case when f.requester = uid then f.addressee else f.requester end
      from public.friendships f
      join public.preferences pr on pr.user_id = case when f.requester = uid then f.addressee else f.requester end
      where f.status = 'accepted' and uid in (f.requester, f.addressee) and pr.show_on_leaderboard
    )
    select p.id, p.username, p.display_name, p.avatar,
           coalesce((select sum(e.amount) from public.xp_events e where e.user_id = p.id and e.created_at >= v_from), 0)::bigint,
           p.id = uid
    from members m join public.profiles p on p.id = m.id
    order by 5 desc, p.display_name;
end $$;

-- Public profile: returns only fields intended for public display, and only
-- when the profile is public (or when the owner is viewing it).
create or replace function public.get_public_profile(p_username text) returns jsonb
language plpgsql security definer stable set search_path = '' as $$
declare p public.profiles; v_xp bigint; v_level int := 1; v_me boolean;
begin
  select * into p from public.profiles where username = lower(btrim(p_username));
  if not found then return null; end if;
  v_me := p.id = auth.uid();
  if not p.is_public and not v_me then return null; end if;
  select coalesce(sum(amount), 0) into v_xp from public.xp_events where user_id = p.id;
  -- level = largest L with 100(L-1) + 25(L-1)(L-2) <= xp, capped at 60 (mirrors src/engine/rewards.ts)
  while v_level < 60 and v_xp >= 100 * v_level + 25 * v_level * (v_level - 1) loop
    v_level := v_level + 1;
  end loop;
  return jsonb_build_object(
    'userId', p.id, 'username', p.username, 'displayName', p.display_name, 'avatar', p.avatar, 'bio', p.bio,
    'level', v_level, 'xpTotal', v_xp,
    'longestStreak', coalesce((select longest from public.streaks where user_id = p.id), 0),
    'lessonsCompleted', (select count(*) from public.lesson_progress where user_id = p.id),
    'achievements', coalesce((select jsonb_agg(achievement_id order by unlocked_at) from public.user_achievements where user_id = p.id), '[]'::jsonb),
    'completedCourses', coalesce((select jsonb_agg(course_id order by issued_at) from public.certificates where user_id = p.id and not revoked), '[]'::jsonb),
    'certificates', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'courseId', course_id, 'issuedAt', issued_at) order by issued_at)
                              from public.certificates where user_id = p.id and not revoked), '[]'::jsonb),
    'isMe', v_me);
end $$;

create or replace function public.verify_certificate(p_id text) returns jsonb
language sql security definer stable set search_path = '' as $$
  select jsonb_build_object('id', c.id, 'status', case when c.revoked then 'revoked' else 'valid' end,
    'recipientName', c.recipient_name, 'courseId', c.course_id, 'score', c.score, 'issuedAt', c.issued_at, 'demo', false)
  from public.certificates c where c.id = upper(btrim(p_id))
$$;

create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := veleta_private.require_uid();
begin
  -- Cascades remove the profile, progress, XP, friendships and certificates.
  delete from auth.users where id = uid;
end $$;

-- ------------------------------------------------------ new-user trigger --
create or replace function veleta_private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_name text; v_base text; v_username text; v_try int := 0;
begin
  v_name := left(btrim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 40);
  v_name := regexp_replace(v_name, '[<>]', '', 'g');
  if v_name = '' then v_name := 'Learner'; end if;
  v_base := left(regexp_replace(lower(v_name), '[^a-z0-9_]', '', 'g'), 14);
  if char_length(v_base) < 3 then v_base := 'learner'; end if;
  loop
    v_try := v_try + 1;
    v_username := v_base || '_' || substr(md5(random()::text || clock_timestamp()::text), 1, 4);
    exit when not exists (select 1 from public.profiles where username = v_username) or v_try > 10;
  end loop;
  insert into public.profiles (id, username, display_name) values (new.id, v_username, v_name);
  insert into public.preferences (user_id) values (new.id);
  insert into public.streaks (user_id) values (new.id);
  insert into public.learner_counters (user_id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function veleta_private.handle_new_user();


-- ===== 20261016000003_security.sql =====
-- Veleta Finance — row-level security and least-privilege grants.

-- Enable RLS on every learner table. Tables without a policy for an operation deny it.
alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.question_stats enable row level security;
alter table public.xp_events enable row level security;
alter table public.daily_activity enable row level security;
alter table public.streaks enable row level security;
alter table public.streak_freeze_usage enable row level security;
alter table public.user_achievements enable row level security;
alter table public.mission_progress enable row level security;
alter table public.learner_counters enable row level security;
alter table public.certificates enable row level security;
alter table public.friendships enable row level security;

-- Start from nothing, then grant only what the app needs.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all tables in schema veleta_private from anon, authenticated;
revoke all on schema veleta_private from anon, authenticated;

-- Learners can read their own rows.
grant select on public.profiles, public.preferences, public.lesson_progress, public.assessment_attempts,
  public.question_stats, public.xp_events, public.daily_activity, public.streaks, public.streak_freeze_usage,
  public.user_achievements, public.mission_progress, public.learner_counters, public.certificates, public.friendships
  to authenticated;

create policy "own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "own preferences" on public.preferences for select to authenticated using (user_id = (select auth.uid()));
create policy "own lesson progress" on public.lesson_progress for select to authenticated using (user_id = (select auth.uid()));
create policy "own attempts" on public.assessment_attempts for select to authenticated using (user_id = (select auth.uid()));
create policy "own question stats" on public.question_stats for select to authenticated using (user_id = (select auth.uid()));
create policy "own xp" on public.xp_events for select to authenticated using (user_id = (select auth.uid()));
create policy "own activity" on public.daily_activity for select to authenticated using (user_id = (select auth.uid()));
create policy "own streak" on public.streaks for select to authenticated using (user_id = (select auth.uid()));
create policy "own freezes" on public.streak_freeze_usage for select to authenticated using (user_id = (select auth.uid()));
create policy "own achievements" on public.user_achievements for select to authenticated using (user_id = (select auth.uid()));
create policy "own missions" on public.mission_progress for select to authenticated using (user_id = (select auth.uid()));
create policy "own counters" on public.learner_counters for select to authenticated using (user_id = (select auth.uid()));
create policy "own certificates" on public.certificates for select to authenticated using (user_id = (select auth.uid()));
create policy "own friendships" on public.friendships for select to authenticated using ((select auth.uid()) in (requester, addressee));

-- Learners may edit only these profile and preference columns, only on their own row.
grant update (username, display_name, avatar, bio, is_public) on public.profiles to authenticated;
grant update (experience, interests, daily_goal, intensity, market, timezone, onboarded, show_on_leaderboard, recommended_course)
  on public.preferences to authenticated;
create policy "update own profile" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "update own preferences" on public.preferences for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Functions: nothing is executable by default; expose only the RPCs.
revoke execute on all functions in schema public from public, anon, authenticated;
revoke execute on all functions in schema veleta_private from public, anon, authenticated;

grant execute on function public.submit_lesson(text, jsonb, uuid) to authenticated;
grant execute on function public.submit_assessment(text, jsonb, uuid) to authenticated;
grant execute on function public.submit_revision(jsonb, uuid) to authenticated;
grant execute on function public.get_my_state() to authenticated;
grant execute on function public.is_username_available(text) to authenticated;
grant execute on function public.search_users(text) to authenticated;
grant execute on function public.send_friend_request(text) to authenticated;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;
grant execute on function public.remove_friend(uuid) to authenticated;
grant execute on function public.list_friends() to authenticated;
grant execute on function public.friend_leaderboard(text) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.get_public_profile(text) to anon, authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Supabase grants default privileges to anon/authenticated on new objects in
-- public; make future objects private by default too.
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;


-- ===== 20261016000004_content_seed.sql =====
-- GENERATED by scripts/generate-content-sql.ts — do not edit by hand.
-- Re-run `npm run content:sql` after changing src/content or game configuration.
-- Rows are upserted, never deleted, so existing learner progress keeps valid references.
begin;

insert into veleta_private.config (key, value) values
  ('lessonFirstCompletion', 20),
  ('lessonPerfectBonus', 5),
  ('checkpointPass', 40),
  ('examPass', 100),
  ('revisionSession', 10),
  ('revisionSessionsPerDay', 3),
  ('dailyMission', 15),
  ('weeklyMission', 50)
on conflict (key) do update set value = excluded.value;

insert into veleta_private.mission_templates (id, period, metric, target, title) values
  ('d_lessons2', 'daily', 'lessons', 2, 'Complete 2 lessons'),
  ('d_revise1', 'daily', 'revisions', 1, 'Finish a revision session'),
  ('d_correct15', 'daily', 'correct', 15, 'Answer 15 questions right first time'),
  ('d_perfect1', 'daily', 'perfect', 1, 'Finish a lesson with no mistakes'),
  ('w_lessons8', 'weekly', 'lessons', 8, 'Complete 8 lessons this week'),
  ('w_revise4', 'weekly', 'revisions', 4, 'Finish 4 revision sessions this week'),
  ('w_checkpoint1', 'weekly', 'checkpoints', 1, 'Pass a unit checkpoint this week'),
  ('w_goal5', 'weekly', 'goal_days', 5, 'Meet your daily goal on 5 days')
on conflict (id) do update set period = excluded.period, metric = excluded.metric, target = excluded.target, title = excluded.title;

delete from veleta_private.mission_rotation;
insert into veleta_private.mission_rotation (period, idx, template_ids) values
  ('daily', 0, array['d_lessons2', 'd_revise1', 'd_correct15']::text[]),
  ('daily', 1, array['d_lessons2', 'd_perfect1', 'd_revise1']::text[]),
  ('daily', 2, array['d_lessons2', 'd_correct15', 'd_perfect1']::text[]),
  ('weekly', 0, array['w_lessons8', 'w_goal5', 'w_revise4']::text[]),
  ('weekly', 1, array['w_lessons8', 'w_goal5', 'w_checkpoint1']::text[]);

insert into veleta_private.courses (id, title, pass_mark, position) values
  ('c1', 'Investing Fundamentals', 0.8, 1),
  ('c2', 'Understanding Stocks and Stock Markets', 0.8, 2),
  ('c3', 'Company Financial Analysis', 0.8, 3),
  ('c4', 'ETFs, Index Funds and Portfolio Construction', 0.8, 4),
  ('c5', 'Valuation and Company Analysis', 0.8, 5),
  ('c6', 'Bonds, Interest Rates and Macroeconomics', 0.8, 6),
  ('c7', 'Dividends and Long-Term Wealth Building', 0.8, 7),
  ('c8', 'Trading, Technical Analysis and Investor Psychology', 0.8, 8)
on conflict (id) do update set title = excluded.title, pass_mark = excluded.pass_mark, position = excluded.position;

insert into veleta_private.units (id, course_id, position, title) values
  ('c1-u1', 'c1', 1, 'Why invest?'),
  ('c1-u2', 'c1', 2, 'Risk and return'),
  ('c1-u3', 'c1', 3, 'The investor’s toolkit'),
  ('c2-u1', 'c2', 1, 'Owning a piece of a company'),
  ('c2-u2', 'c2', 2, 'Prices and orders'),
  ('c2-u3', 'c2', 3, 'Market life'),
  ('c3-u1', 'c3', 1, 'How businesses make money'),
  ('c3-u2', 'c3', 2, 'Balance sheets, cash and debt'),
  ('c3-u3', 'c3', 3, 'Judging quality'),
  ('c4-u1', 'c4', 1, 'Funds and trackers'),
  ('c4-u2', 'c4', 2, 'Building a portfolio'),
  ('c4-u3', 'c4', 3, 'Managing a portfolio'),
  ('c5-u1', 'c5', 1, 'Multiples'),
  ('c5-u2', 'c5', 2, 'Cash flow valuation'),
  ('c5-u3', 'c5', 3, 'Valuation in practice'),
  ('c6-u1', 'c6', 1, 'Bonds'),
  ('c6-u2', 'c6', 2, 'The economy and central banks'),
  ('c6-u3', 'c6', 3, 'Markets and macro'),
  ('c7-u1', 'c7', 1, 'Dividend basics'),
  ('c7-u2', 'c7', 2, 'Sustainable income'),
  ('c7-u3', 'c7', 3, 'Building wealth for the long term'),
  ('c8-u1', 'c8', 1, 'Charts and indicators'),
  ('c8-u2', 'c8', 2, 'Investor psychology'),
  ('c8-u3', 'c8', 3, 'Managing risk')
on conflict (id) do update set course_id = excluded.course_id, position = excluded.position, title = excluded.title;

insert into veleta_private.lessons (id, course_id, unit_id, position, title) values
  ('c1-u1-l1', 'c1', 'c1-u1', 1, 'What is investing?'),
  ('c1-u1-l2', 'c1', 'c1-u1', 2, 'Saving versus investing'),
  ('c1-u1-l3', 'c1', 'c1-u1', 3, 'Inflation and purchasing power'),
  ('c1-u1-l4', 'c1', 'c1-u1', 4, 'The power of compounding'),
  ('c1-u2-l1', 'c1', 'c1-u2', 1, 'Risk and return'),
  ('c1-u2-l2', 'c1', 'c1-u2', 2, 'Time horizons and liquidity'),
  ('c1-u2-l3', 'c1', 'c1-u2', 3, 'Don’t put all your eggs in one basket'),
  ('c1-u2-l4', 'c1', 'c1-u2', 4, 'Investing versus speculation'),
  ('c1-u3-l1', 'c1', 'c1-u3', 1, 'The main asset classes'),
  ('c1-u3-l2', 'c1', 'c1-u3', 2, 'The hidden power of costs'),
  ('c1-u3-l3', 'c1', 'c1-u3', 3, 'Common investing myths'),
  ('c2-u1-l1', 'c2', 'c2-u1', 1, 'What a share really is'),
  ('c2-u1-l2', 'c2', 'c2-u1', 2, 'Why companies sell shares'),
  ('c2-u1-l3', 'c2', 'c2-u1', 3, 'How stock exchanges work'),
  ('c2-u2-l1', 'c2', 'c2-u2', 1, 'Share price and market capitalisation'),
  ('c2-u2-l2', 'c2', 'c2-u2', 2, 'Bid, ask and the spread'),
  ('c2-u2-l3', 'c2', 'c2-u2', 3, 'Market orders and limit orders'),
  ('c2-u2-l4', 'c2', 'c2-u2', 4, 'Why prices move — and price versus value'),
  ('c2-u3-l1', 'c2', 'c2-u3', 1, 'Dividends and stock splits'),
  ('c2-u3-l2', 'c2', 'c2-u3', 2, 'Market indices'),
  ('c2-u3-l3', 'c2', 'c2-u3', 3, 'Bull markets, bear markets and volatility'),
  ('c2-u3-l4', 'c2', 'c2-u3', 4, 'UK and US markets, pounds and dollars'),
  ('c3-u1-l1', 'c3', 'c3-u1', 1, 'What is a business model?'),
  ('c3-u1-l2', 'c3', 'c3-u1', 2, 'The income statement'),
  ('c3-u1-l3', 'c3', 'c3-u1', 3, 'Margins and profitability'),
  ('c3-u2-l1', 'c3', 'c3-u2', 1, 'The balance sheet'),
  ('c3-u2-l2', 'c3', 'c3-u2', 2, 'The cash flow statement'),
  ('c3-u2-l3', 'c3', 'c3-u2', 3, 'Debt and leverage'),
  ('c3-u3-l1', 'c3', 'c3-u3', 1, 'ROE, ROIC and EPS'),
  ('c3-u3-l2', 'c3', 'c3-u3', 2, 'Growth, quality and competitive advantages'),
  ('c3-u3-l3', 'c3', 'c3-u3', 3, 'Annual reports, limitations and red flags'),
  ('c4-u1-l1', 'c4', 'c4-u1', 1, 'What is a fund?'),
  ('c4-u1-l2', 'c4', 'c4-u1', 2, 'Active versus passive investing'),
  ('c4-u1-l3', 'c4', 'c4-u1', 3, 'ETFs, index funds and tracking'),
  ('c4-u2-l1', 'c4', 'c4-u2', 1, 'Asset allocation'),
  ('c4-u2-l2', 'c4', 'c4-u2', 2, 'Geography, sectors and concentration'),
  ('c4-u2-l3', 'c4', 'c4-u2', 3, 'Correlation: why mixing assets works'),
  ('c4-u2-l4', 'c4', 'c4-u2', 4, 'Currency risk and hedging'),
  ('c4-u3-l1', 'c4', 'c4-u3', 1, 'Rebalancing'),
  ('c4-u3-l2', 'c4', 'c4-u3', 2, 'Portfolio volatility and time horizons'),
  ('c4-u3-l3', 'c4', 'c4-u3', 3, 'The limits of diversification'),
  ('c5-u1-l1', 'c5', 'c5-u1', 1, 'Price, value and expectations'),
  ('c5-u1-l2', 'c5', 'c5-u1', 2, 'The price-to-earnings ratio'),
  ('c5-u1-l3', 'c5', 'c5-u1', 3, 'Price-to-sales and price-to-book'),
  ('c5-u1-l4', 'c5', 'c5-u1', 4, 'Enterprise value and EV/EBITDA'),
  ('c5-u2-l1', 'c5', 'c5-u2', 1, 'Present value: money now versus later'),
  ('c5-u2-l2', 'c5', 'c5-u2', 2, 'Discount rates and required returns'),
  ('c5-u2-l3', 'c5', 'c5-u2', 3, 'Discounted cash flow (DCF) fundamentals'),
  ('c5-u2-l4', 'c5', 'c5-u2', 4, 'Sensitivity and margin of safety'),
  ('c5-u3-l1', 'c5', 'c5-u3', 1, 'Dividend yield and free cash flow yield'),
  ('c5-u3-l2', 'c5', 'c5-u3', 2, 'Comparable company analysis'),
  ('c5-u3-l3', 'c5', 'c5-u3', 3, 'Growth, mature and cyclical businesses'),
  ('c5-u3-l4', 'c5', 'c5-u3', 4, 'Value traps and justified premiums'),
  ('c6-u1-l1', 'c6', 'c6-u1', 1, 'What is a bond?'),
  ('c6-u1-l2', 'c6', 'c6-u1', 2, 'Bond prices and yields'),
  ('c6-u1-l3', 'c6', 'c6-u1', 3, 'Duration and interest-rate risk'),
  ('c6-u1-l4', 'c6', 'c6-u1', 4, 'Credit risk: government and corporate bonds'),
  ('c6-u2-l1', 'c6', 'c6-u2', 1, 'GDP, growth and recessions'),
  ('c6-u2-l2', 'c6', 'c6-u2', 2, 'Inflation and unemployment'),
  ('c6-u2-l3', 'c6', 'c6-u2', 3, 'Central banks: the Bank of England and the Fed'),
  ('c6-u2-l4', 'c6', 'c6-u2', 4, 'Monetary versus fiscal policy'),
  ('c6-u3-l1', 'c6', 'c6-u3', 1, 'The yield curve'),
  ('c6-u3-l2', 'c6', 'c6-u3', 2, 'Interest rates and share valuations'),
  ('c6-u3-l3', 'c6', 'c6-u3', 3, 'Exchange rates'),
  ('c7-u1-l1', 'c7', 'c7-u1', 1, 'How dividends work'),
  ('c7-u1-l2', 'c7', 'c7-u1', 2, 'Dividend yield and payout ratio'),
  ('c7-u1-l3', 'c7', 'c7-u1', 3, 'Dividend growth and reinvestment'),
  ('c7-u2-l1', 'c7', 'c7-u2', 1, 'Is the dividend sustainable?'),
  ('c7-u2-l2', 'c7', 'c7-u2', 2, 'Dividend cuts and yield traps'),
  ('c7-u2-l3', 'c7', 'c7-u2', 3, 'Yield versus total return'),
  ('c7-u3-l1', 'c7', 'c7-u3', 1, 'Time in the market'),
  ('c7-u3-l2', 'c7', 'c7-u3', 2, 'Fees, inflation and real returns'),
  ('c7-u3-l3', 'c7', 'c7-u3', 3, 'Tax basics: UK and US (educational overview)'),
  ('c8-u1-l1', 'c8', 'c8-u1', 1, 'Investing versus trading'),
  ('c8-u1-l2', 'c8', 'c8-u1', 2, 'Reading charts: OHLC, candlesticks and volume'),
  ('c8-u1-l3', 'c8', 'c8-u1', 3, 'Trends, support and resistance'),
  ('c8-u1-l4', 'c8', 'c8-u1', 4, 'Moving averages and RSI'),
  ('c8-u2-l1', 'c8', 'c8-u2', 1, 'Market efficiency and technical versus fundamental analysis'),
  ('c8-u2-l2', 'c8', 'c8-u2', 2, 'Overconfidence and confirmation bias'),
  ('c8-u2-l3', 'c8', 'c8-u2', 3, 'Loss aversion and recency bias'),
  ('c8-u2-l4', 'c8', 'c8-u2', 4, 'Herd behaviour, FOMO and emotional decisions'),
  ('c8-u3-l1', 'c8', 'c8-u3', 1, 'Risk management and position sizing'),
  ('c8-u3-l2', 'c8', 'c8-u3', 2, 'Leverage and drawdowns'),
  ('c8-u3-l3', 'c8', 'c8-u3', 3, 'Why short-term trading is hard — and backtests mislead')
on conflict (id) do update set course_id = excluded.course_id, unit_id = excluded.unit_id, position = excluded.position, title = excluded.title;

insert into veleta_private.assessments (id, kind, course_id, unit_id, pass_mark, title) values
  ('c1-u1-cp', 'checkpoint', 'c1', 'c1-u1', 0.7, 'Checkpoint: Why invest?'),
  ('c1-u2-cp', 'checkpoint', 'c1', 'c1-u2', 0.7, 'Checkpoint: Risk and return'),
  ('c1-u3-cp', 'checkpoint', 'c1', 'c1-u3', 0.7, 'Checkpoint: The investor’s toolkit'),
  ('c1-exam', 'exam', 'c1', null, 0.8, 'Investing Fundamentals: final exam'),
  ('c2-u1-cp', 'checkpoint', 'c2', 'c2-u1', 0.7, 'Checkpoint: Owning a piece of a company'),
  ('c2-u2-cp', 'checkpoint', 'c2', 'c2-u2', 0.7, 'Checkpoint: Prices and orders'),
  ('c2-u3-cp', 'checkpoint', 'c2', 'c2-u3', 0.7, 'Checkpoint: Market life'),
  ('c2-exam', 'exam', 'c2', null, 0.8, 'Understanding Stocks and Stock Markets: final exam'),
  ('c3-u1-cp', 'checkpoint', 'c3', 'c3-u1', 0.7, 'Checkpoint: How businesses make money'),
  ('c3-u2-cp', 'checkpoint', 'c3', 'c3-u2', 0.7, 'Checkpoint: Balance sheets, cash and debt'),
  ('c3-u3-cp', 'checkpoint', 'c3', 'c3-u3', 0.7, 'Checkpoint: Judging quality'),
  ('c3-exam', 'exam', 'c3', null, 0.8, 'Company Financial Analysis: final exam'),
  ('c4-u1-cp', 'checkpoint', 'c4', 'c4-u1', 0.7, 'Checkpoint: Funds and trackers'),
  ('c4-u2-cp', 'checkpoint', 'c4', 'c4-u2', 0.7, 'Checkpoint: Building a portfolio'),
  ('c4-u3-cp', 'checkpoint', 'c4', 'c4-u3', 0.7, 'Checkpoint: Managing a portfolio'),
  ('c4-exam', 'exam', 'c4', null, 0.8, 'ETFs, Index Funds and Portfolio Construction: final exam'),
  ('c5-u1-cp', 'checkpoint', 'c5', 'c5-u1', 0.7, 'Checkpoint: Multiples'),
  ('c5-u2-cp', 'checkpoint', 'c5', 'c5-u2', 0.7, 'Checkpoint: Cash flow valuation'),
  ('c5-u3-cp', 'checkpoint', 'c5', 'c5-u3', 0.7, 'Checkpoint: Valuation in practice'),
  ('c5-exam', 'exam', 'c5', null, 0.8, 'Valuation and Company Analysis: final exam'),
  ('c6-u1-cp', 'checkpoint', 'c6', 'c6-u1', 0.7, 'Checkpoint: Bonds'),
  ('c6-u2-cp', 'checkpoint', 'c6', 'c6-u2', 0.7, 'Checkpoint: The economy and central banks'),
  ('c6-u3-cp', 'checkpoint', 'c6', 'c6-u3', 0.7, 'Checkpoint: Markets and macro'),
  ('c6-exam', 'exam', 'c6', null, 0.8, 'Bonds, Interest Rates and Macroeconomics: final exam'),
  ('c7-u1-cp', 'checkpoint', 'c7', 'c7-u1', 0.7, 'Checkpoint: Dividend basics'),
  ('c7-u2-cp', 'checkpoint', 'c7', 'c7-u2', 0.7, 'Checkpoint: Sustainable income'),
  ('c7-u3-cp', 'checkpoint', 'c7', 'c7-u3', 0.7, 'Checkpoint: Building wealth for the long term'),
  ('c7-exam', 'exam', 'c7', null, 0.8, 'Dividends and Long-Term Wealth Building: final exam'),
  ('c8-u1-cp', 'checkpoint', 'c8', 'c8-u1', 0.7, 'Checkpoint: Charts and indicators'),
  ('c8-u2-cp', 'checkpoint', 'c8', 'c8-u2', 0.7, 'Checkpoint: Investor psychology'),
  ('c8-u3-cp', 'checkpoint', 'c8', 'c8-u3', 0.7, 'Checkpoint: Managing risk'),
  ('c8-exam', 'exam', 'c8', null, 0.8, 'Trading, Technical Analysis and Investor Psychology: final exam')
on conflict (id) do update set kind = excluded.kind, course_id = excluded.course_id, unit_id = excluded.unit_id, pass_mark = excluded.pass_mark, title = excluded.title;

insert into veleta_private.questions (id, kind, lesson_id, assessment_id, answer, tolerance, concept) values
  ('c1-u1-l1.q1', 'mcq', 'c1-u1-l1', null, '2'::jsonb, 0, 'investing-basics'),
  ('c1-u1-l1.q2', 'numeric', 'c1-u1-l1', null, '6'::jsonb, 0, 'investing-basics'),
  ('c1-u1-l1.q3', 'tf', 'c1-u1-l1', null, '0'::jsonb, 0, 'investing-basics'),
  ('c1-u1-l1.q4', 'multi', 'c1-u1-l1', null, '[0,1,2]'::jsonb, 0, 'investing-basics'),
  ('c1-u1-l2.q1', 'mcq', 'c1-u1-l2', null, '1'::jsonb, 0, 'saving-vs-investing'),
  ('c1-u1-l2.q2', 'match', 'c1-u1-l2', null, '[0,1,2]'::jsonb, 0, 'saving-vs-investing'),
  ('c1-u1-l2.q3', 'tf', 'c1-u1-l2', null, '1'::jsonb, 0, 'saving-vs-investing'),
  ('c1-u1-l3.q1', 'mcq', 'c1-u1-l3', null, '2'::jsonb, 0, 'inflation'),
  ('c1-u1-l3.q2', 'numeric', 'c1-u1-l3', null, '4'::jsonb, 0.15, 'inflation'),
  ('c1-u1-l3.q3', 'tf', 'c1-u1-l3', null, '1'::jsonb, 0, 'inflation'),
  ('c1-u1-l4.q1', 'numeric', 'c1-u1-l4', null, '1102.5'::jsonb, 0.01, 'compounding'),
  ('c1-u1-l4.q2', 'numeric', 'c1-u1-l4', null, '9'::jsonb, 0.2, 'compounding'),
  ('c1-u1-l4.q3', 'tf', 'c1-u1-l4', null, '1'::jsonb, 0, 'compounding'),
  ('c1-u1-l4.q4', 'order', 'c1-u1-l4', null, '[0,1,2,3]'::jsonb, 0, 'compounding'),
  ('c1-u1-cp.c1', 'mcq', null, 'c1-u1-cp', '1'::jsonb, 0, 'investing-basics'),
  ('c1-u1-cp.c2', 'numeric', null, 'c1-u1-cp', '9'::jsonb, 0.05, 'investing-basics'),
  ('c1-u1-cp.c3', 'tf', null, 'c1-u1-cp', '1'::jsonb, 0, 'saving-vs-investing'),
  ('c1-u1-cp.c4', 'numeric', null, 'c1-u1-cp', '-3'::jsonb, 0.15, 'inflation'),
  ('c1-u1-cp.c5', 'numeric', null, 'c1-u1-cp', '605'::jsonb, 0.01, 'compounding'),
  ('c1-u1-cp.c6', 'mcq', null, 'c1-u1-cp', '2'::jsonb, 0, 'compounding'),
  ('c1-u2-l1.q1', 'mcq', 'c1-u2-l1', null, '1'::jsonb, 0, 'risk-return'),
  ('c1-u2-l1.q2', 'numeric', 'c1-u2-l1', null, '25'::jsonb, 0.1, 'risk-return'),
  ('c1-u2-l1.q3', 'tf', 'c1-u2-l1', null, '1'::jsonb, 0, 'risk-return'),
  ('c1-u2-l2.q1', 'mcq', 'c1-u2-l2', null, '2'::jsonb, 0, 'time-horizon'),
  ('c1-u2-l2.q2', 'order', 'c1-u2-l2', null, '[0,1,2,3]'::jsonb, 0, 'time-horizon'),
  ('c1-u2-l2.q3', 'tf', 'c1-u2-l2', null, '0'::jsonb, 0, 'time-horizon'),
  ('c1-u2-l3.q1', 'numeric', 'c1-u2-l3', null, '2.5'::jsonb, 0.01, 'diversification-basics'),
  ('c1-u2-l3.q2', 'mcq', 'c1-u2-l3', null, '1'::jsonb, 0, 'diversification-basics'),
  ('c1-u2-l3.q3', 'tf', 'c1-u2-l3', null, '1'::jsonb, 0, 'diversification-basics'),
  ('c1-u2-l4.q1', 'multi', 'c1-u2-l4', null, '[0,2,3]'::jsonb, 0, 'speculation'),
  ('c1-u2-l4.q2', 'mcq', 'c1-u2-l4', null, '1'::jsonb, 0, 'speculation'),
  ('c1-u2-l4.q3', 'tf', 'c1-u2-l4', null, '1'::jsonb, 0, 'speculation'),
  ('c1-u2-cp.c1', 'mcq', null, 'c1-u2-cp', '1'::jsonb, 0, 'risk-return'),
  ('c1-u2-cp.c2', 'numeric', null, 'c1-u2-cp', '100'::jsonb, 0.1, 'risk-return'),
  ('c1-u2-cp.c3', 'mcq', null, 'c1-u2-cp', '2'::jsonb, 0, 'liquidity'),
  ('c1-u2-cp.c4', 'tf', null, 'c1-u2-cp', '1'::jsonb, 0, 'diversification-basics'),
  ('c1-u2-cp.c5', 'multi', null, 'c1-u2-cp', '[0,1,3]'::jsonb, 0, 'speculation'),
  ('c1-u2-cp.c6', 'mcq', null, 'c1-u2-cp', '1'::jsonb, 0, 'time-horizon'),
  ('c1-u3-l1.q1', 'match', 'c1-u3-l1', null, '[0,1,2,3]'::jsonb, 0, 'asset-classes'),
  ('c1-u3-l1.q2', 'mcq', 'c1-u3-l1', null, '2'::jsonb, 0, 'asset-classes'),
  ('c1-u3-l1.q3', 'tf', 'c1-u3-l1', null, '1'::jsonb, 0, 'asset-classes'),
  ('c1-u3-l2.q1', 'numeric', 'c1-u3-l2', null, '6.5'::jsonb, 0.05, 'investment-costs'),
  ('c1-u3-l2.q2', 'mcq', 'c1-u3-l2', null, '1'::jsonb, 0, 'investment-costs'),
  ('c1-u3-l2.q3', 'tf', 'c1-u3-l2', null, '1'::jsonb, 0, 'investment-costs'),
  ('c1-u3-l3.q1', 'tf', 'c1-u3-l3', null, '1'::jsonb, 0, 'misconceptions'),
  ('c1-u3-l3.q2', 'tf', 'c1-u3-l3', null, '1'::jsonb, 0, 'misconceptions'),
  ('c1-u3-l3.q3', 'mcq', 'c1-u3-l3', null, '1'::jsonb, 0, 'misconceptions'),
  ('c1-u3-l3.q4', 'tf', 'c1-u3-l3', null, '1'::jsonb, 0, 'misconceptions'),
  ('c1-u3-l3.q5', 'mcq', 'c1-u3-l3', null, '1'::jsonb, 0, 'misconceptions'),
  ('c1-u3-cp.c1', 'mcq', null, 'c1-u3-cp', '1'::jsonb, 0, 'asset-classes'),
  ('c1-u3-cp.c2', 'tf', null, 'c1-u3-cp', '0'::jsonb, 0, 'asset-classes'),
  ('c1-u3-cp.c3', 'numeric', null, 'c1-u3-cp', '6.5'::jsonb, 0.05, 'investment-costs'),
  ('c1-u3-cp.c4', 'mcq', null, 'c1-u3-cp', '0'::jsonb, 0, 'investment-costs'),
  ('c1-u3-cp.c5', 'tf', null, 'c1-u3-cp', '1'::jsonb, 0, 'misconceptions'),
  ('c1-u3-cp.c6', 'mcq', null, 'c1-u3-cp', '1'::jsonb, 0, 'misconceptions'),
  ('c1-exam.e1', 'mcq', null, 'c1-exam', '1'::jsonb, 0, 'investing-basics'),
  ('c1-exam.e2', 'numeric', null, 'c1-exam', '2.5'::jsonb, 0.01, 'investing-basics'),
  ('c1-exam.e3', 'tf', null, 'c1-exam', '0'::jsonb, 0, 'inflation'),
  ('c1-exam.e4', 'numeric', null, 'c1-exam', '0'::jsonb, 0.05, 'inflation'),
  ('c1-exam.e5', 'numeric', null, 'c1-exam', '2121.8'::jsonb, 0.01, 'compounding'),
  ('c1-exam.e6', 'mcq', null, 'c1-exam', '1'::jsonb, 0, 'compounding'),
  ('c1-exam.e7', 'mcq', null, 'c1-exam', '1'::jsonb, 0, 'risk-return'),
  ('c1-exam.e8', 'numeric', null, 'c1-exam', '33.33'::jsonb, 0.1, 'risk-return'),
  ('c1-exam.e9', 'order', null, 'c1-exam', '[0,1,2]'::jsonb, 0, 'liquidity'),
  ('c1-exam.e10', 'mcq', null, 'c1-exam', '1'::jsonb, 0, 'diversification-basics'),
  ('c1-exam.e11', 'tf', null, 'c1-exam', '0'::jsonb, 0, 'speculation'),
  ('c1-exam.e12', 'mcq', null, 'c1-exam', '1'::jsonb, 0, 'asset-classes'),
  ('c1-exam.e13', 'numeric', null, 'c1-exam', '1'::jsonb, 0.01, 'investment-costs'),
  ('c1-exam.e14', 'mcq', null, 'c1-exam', '1'::jsonb, 0, 'misconceptions'),
  ('c1-exam.e15', 'tf', null, 'c1-exam', '1'::jsonb, 0, 'time-horizon'),
  ('c2-u1-l1.q1', 'numeric', 'c2-u1-l1', null, '0.25'::jsonb, 0.001, 'shares-basics'),
  ('c2-u1-l1.q2', 'tf', 'c2-u1-l1', null, '1'::jsonb, 0, 'shares-basics'),
  ('c2-u1-l1.q3', 'multi', 'c2-u1-l1', null, '[0,2,3]'::jsonb, 0, 'shares-basics'),
  ('c2-u1-l2.q1', 'mcq', 'c2-u1-l2', null, '1'::jsonb, 0, 'primary-secondary'),
  ('c2-u1-l2.q2', 'tf', 'c2-u1-l2', null, '0'::jsonb, 0, 'primary-secondary'),
  ('c2-u1-l2.q3', 'mcq', 'c2-u1-l2', null, '1'::jsonb, 0, 'primary-secondary'),
  ('c2-u1-l3.q1', 'mcq', 'c2-u1-l3', null, '1'::jsonb, 0, 'exchanges'),
  ('c2-u1-l3.q2', 'tf', 'c2-u1-l3', null, '0'::jsonb, 0, 'exchanges'),
  ('c2-u1-l3.q3', 'match', 'c2-u1-l3', null, '[0,1,2]'::jsonb, 0, 'exchanges'),
  ('c2-u1-cp.c1', 'numeric', null, 'c2-u1-cp', '0.2'::jsonb, 0.001, 'shares-basics'),
  ('c2-u1-cp.c2', 'tf', null, 'c2-u1-cp', '1'::jsonb, 0, 'shares-basics'),
  ('c2-u1-cp.c3', 'mcq', null, 'c2-u1-cp', '0'::jsonb, 0, 'primary-secondary'),
  ('c2-u1-cp.c4', 'mcq', null, 'c2-u1-cp', '0'::jsonb, 0, 'primary-secondary'),
  ('c2-u1-cp.c5', 'mcq', null, 'c2-u1-cp', '1'::jsonb, 0, 'exchanges'),
  ('c2-u1-cp.c6', 'tf', null, 'c2-u1-cp', '1'::jsonb, 0, 'exchanges'),
  ('c2-u2-l1.q1', 'numeric', 'c2-u2-l1', null, '420'::jsonb, 0.5, 'market-cap'),
  ('c2-u2-l1.q2', 'tf', 'c2-u2-l1', null, '1'::jsonb, 0, 'market-cap'),
  ('c2-u2-l1.q3', 'order', 'c2-u2-l1', null, '[0,1,2]'::jsonb, 0, 'market-cap'),
  ('c2-u2-l2.q1', 'mcq', 'c2-u2-l2', null, '2'::jsonb, 0, 'bid-ask'),
  ('c2-u2-l2.q2', 'numeric', 'c2-u2-l2', null, '1'::jsonb, 0, 'bid-ask'),
  ('c2-u2-l2.q3', 'tf', 'c2-u2-l2', null, '0'::jsonb, 0, 'bid-ask'),
  ('c2-u2-l3.q1', 'mcq', 'c2-u2-l3', null, '2'::jsonb, 0, 'order-types'),
  ('c2-u2-l3.q2', 'tf', 'c2-u2-l3', null, '1'::jsonb, 0, 'order-types'),
  ('c2-u2-l3.q3', 'match', 'c2-u2-l3', null, '[0,1]'::jsonb, 0, 'order-types'),
  ('c2-u2-l4.q1', 'mcq', 'c2-u2-l4', null, '1'::jsonb, 0, 'price-vs-value'),
  ('c2-u2-l4.q2', 'multi', 'c2-u2-l4', null, '[0,1,2,3]'::jsonb, 0, 'price-vs-value'),
  ('c2-u2-l4.q3', 'tf', 'c2-u2-l4', null, '1'::jsonb, 0, 'price-vs-value'),
  ('c2-u2-cp.c1', 'numeric', null, 'c2-u2-cp', '5'::jsonb, 0.01, 'market-cap'),
  ('c2-u2-cp.c2', 'tf', null, 'c2-u2-cp', '1'::jsonb, 0, 'market-cap'),
  ('c2-u2-cp.c3', 'mcq', null, 'c2-u2-cp', '0'::jsonb, 0, 'bid-ask'),
  ('c2-u2-cp.c4', 'mcq', null, 'c2-u2-cp', '1'::jsonb, 0, 'order-types'),
  ('c2-u2-cp.c5', 'tf', null, 'c2-u2-cp', '0'::jsonb, 0, 'price-vs-value'),
  ('c2-u2-cp.c6', 'mcq', null, 'c2-u2-cp', '1'::jsonb, 0, 'price-vs-value'),
  ('c2-u3-l1.q1', 'tf', 'c2-u3-l1', null, '1'::jsonb, 0, 'dividends-splits'),
  ('c2-u3-l1.q2', 'numeric', 'c2-u3-l1', null, '48'::jsonb, 0.01, 'dividends-splits'),
  ('c2-u3-l1.q3', 'numeric', 'c2-u3-l1', null, '90'::jsonb, 0, 'dividends-splits'),
  ('c2-u3-l1.q4', 'tf', 'c2-u3-l1', null, '1'::jsonb, 0, 'dividends-splits'),
  ('c2-u3-l2.q1', 'mcq', 'c2-u3-l2', null, '1'::jsonb, 0, 'indices'),
  ('c2-u3-l2.q2', 'match', 'c2-u3-l2', null, '[0,1,2]'::jsonb, 0, 'indices'),
  ('c2-u3-l2.q3', 'tf', 'c2-u3-l2', null, '1'::jsonb, 0, 'indices'),
  ('c2-u3-l3.q1', 'numeric', 'c2-u3-l3', null, '22.5'::jsonb, 0.05, 'market-cycles'),
  ('c2-u3-l3.q2', 'tf', 'c2-u3-l3', null, '1'::jsonb, 0, 'market-cycles'),
  ('c2-u3-l3.q3', 'mcq', 'c2-u3-l3', null, '1'::jsonb, 0, 'market-cycles'),
  ('c2-u3-l4.q1', 'numeric', 'c2-u3-l4', null, '3.45'::jsonb, 0.001, 'uk-us-markets'),
  ('c2-u3-l4.q2', 'numeric', 'c2-u3-l4', null, '15.5'::jsonb, 0.05, 'uk-us-markets'),
  ('c2-u3-l4.q3', 'tf', 'c2-u3-l4', null, '0'::jsonb, 0, 'uk-us-markets'),
  ('c2-u3-l4.q4', 'mcq', 'c2-u3-l4', null, '1'::jsonb, 0, 'uk-us-markets'),
  ('c2-u3-cp.c1', 'numeric', null, 'c2-u3-cp', '100'::jsonb, 0.01, 'dividends-splits'),
  ('c2-u3-cp.c2', 'mcq', null, 'c2-u3-cp', '2'::jsonb, 0, 'dividends-splits'),
  ('c2-u3-cp.c3', 'mcq', null, 'c2-u3-cp', '2'::jsonb, 0, 'indices'),
  ('c2-u3-cp.c4', 'numeric', null, 'c2-u3-cp', '20'::jsonb, 0.05, 'market-cycles'),
  ('c2-u3-cp.c5', 'numeric', null, 'c2-u3-cp', '8'::jsonb, 0.05, 'currency'),
  ('c2-u3-cp.c6', 'tf', null, 'c2-u3-cp', '0'::jsonb, 0, 'uk-us-markets'),
  ('c2-exam.e1', 'mcq', null, 'c2-exam', '1'::jsonb, 0, 'shares-basics'),
  ('c2-exam.e2', 'tf', null, 'c2-exam', '0'::jsonb, 0, 'shares-basics'),
  ('c2-exam.e3', 'mcq', null, 'c2-exam', '1'::jsonb, 0, 'primary-secondary'),
  ('c2-exam.e4', 'mcq', null, 'c2-exam', '1'::jsonb, 0, 'exchanges'),
  ('c2-exam.e5', 'numeric', null, 'c2-exam', '180'::jsonb, 0.1, 'market-cap'),
  ('c2-exam.e6', 'numeric', null, 'c2-exam', '8'::jsonb, 0.01, 'bid-ask'),
  ('c2-exam.e7', 'mcq', null, 'c2-exam', '1'::jsonb, 0, 'order-types'),
  ('c2-exam.e8', 'tf', null, 'c2-exam', '0'::jsonb, 0, 'price-vs-value'),
  ('c2-exam.e9', 'tf', null, 'c2-exam', '1'::jsonb, 0, 'dividends-splits'),
  ('c2-exam.e10', 'numeric', null, 'c2-exam', '30'::jsonb, 0.01, 'dividends-splits'),
  ('c2-exam.e11', 'mcq', null, 'c2-exam', '1'::jsonb, 0, 'indices'),
  ('c2-exam.e12', 'mcq', null, 'c2-exam', '2'::jsonb, 0, 'market-cycles'),
  ('c2-exam.e13', 'tf', null, 'c2-exam', '0'::jsonb, 0, 'market-cycles'),
  ('c2-exam.e14', 'numeric', null, 'c2-exam', '15.5'::jsonb, 0.05, 'currency'),
  ('c2-exam.e15', 'multi', null, 'c2-exam', '[0,1,3]'::jsonb, 0, 'uk-us-markets'),
  ('c3-u1-l1.q1', 'match', 'c3-u1-l1', null, '[0,1,2,3]'::jsonb, 0, 'business-model'),
  ('c3-u1-l1.q2', 'mcq', 'c3-u1-l1', null, '1'::jsonb, 0, 'business-model'),
  ('c3-u1-l1.q3', 'tf', 'c3-u1-l1', null, '1'::jsonb, 0, 'business-model'),
  ('c3-u1-l2.q1', 'numeric', 'c3-u1-l2', null, '300'::jsonb, 0, 'income-statement'),
  ('c3-u1-l2.q2', 'numeric', 'c3-u1-l2', null, '120'::jsonb, 0, 'income-statement'),
  ('c3-u1-l2.q3', 'order', 'c3-u1-l2', null, '[0,1,2,3,4]'::jsonb, 0, 'income-statement'),
  ('c3-u1-l2.q4', 'mcq', 'c3-u1-l2', null, '2'::jsonb, 0, 'income-statement'),
  ('c3-u1-l3.q1', 'numeric', 'c3-u1-l3', null, '15'::jsonb, 0.05, 'margins'),
  ('c3-u1-l3.q2', 'mcq', 'c3-u1-l3', null, '2'::jsonb, 0, 'margins'),
  ('c3-u1-l3.q3', 'numeric', 'c3-u1-l3', null, '12.5'::jsonb, 0.05, 'margins'),
  ('c3-u1-l3.q4', 'tf', 'c3-u1-l3', null, '0'::jsonb, 0, 'margins'),
  ('c3-u1-cp.c1', 'mcq', null, 'c3-u1-cp', '1'::jsonb, 0, 'business-model'),
  ('c3-u1-cp.c2', 'numeric', null, 'c3-u1-cp', '40'::jsonb, 0, 'income-statement'),
  ('c3-u1-cp.c3', 'numeric', null, 'c3-u1-cp', '16'::jsonb, 0.05, 'margins'),
  ('c3-u1-cp.c4', 'tf', null, 'c3-u1-cp', '1'::jsonb, 0, 'income-statement'),
  ('c3-u1-cp.c5', 'mcq', null, 'c3-u1-cp', '1'::jsonb, 0, 'margins'),
  ('c3-u1-cp.c6', 'order', null, 'c3-u1-cp', '[0,1,2,3]'::jsonb, 0, 'income-statement'),
  ('c3-u2-l1.q1', 'numeric', 'c3-u2-l1', null, '350'::jsonb, 0, 'balance-sheet'),
  ('c3-u2-l1.q2', 'match', 'c3-u2-l1', null, '[0,1,1,0]'::jsonb, 0, 'balance-sheet'),
  ('c3-u2-l1.q3', 'tf', 'c3-u2-l1', null, '1'::jsonb, 0, 'balance-sheet'),
  ('c3-u2-l2.q1', 'match', 'c3-u2-l2', null, '[0,1,2]'::jsonb, 0, 'cash-flow'),
  ('c3-u2-l2.q2', 'numeric', 'c3-u2-l2', null, '70'::jsonb, 0, 'cash-flow'),
  ('c3-u2-l2.q3', 'tf', 'c3-u2-l2', null, '0'::jsonb, 0, 'cash-flow'),
  ('c3-u2-l2.q4', 'mcq', 'c3-u2-l2', null, '1'::jsonb, 0, 'cash-flow'),
  ('c3-u2-l3.q1', 'numeric', 'c3-u2-l3', null, '750'::jsonb, 0, 'leverage'),
  ('c3-u2-l3.q2', 'numeric', 'c3-u2-l3', null, '3'::jsonb, 0.01, 'leverage'),
  ('c3-u2-l3.q3', 'mcq', 'c3-u2-l3', null, '2'::jsonb, 0, 'leverage'),
  ('c3-u2-cp.c1', 'numeric', null, 'c3-u2-cp', '500'::jsonb, 0, 'balance-sheet'),
  ('c3-u2-cp.c2', 'mcq', null, 'c3-u2-cp', '1'::jsonb, 0, 'balance-sheet'),
  ('c3-u2-cp.c3', 'numeric', null, 'c3-u2-cp', '180'::jsonb, 0, 'cash-flow'),
  ('c3-u2-cp.c4', 'mcq', null, 'c3-u2-cp', '2'::jsonb, 0, 'cash-flow'),
  ('c3-u2-cp.c5', 'numeric', null, 'c3-u2-cp', '5'::jsonb, 0.01, 'leverage'),
  ('c3-u2-cp.c6', 'tf', null, 'c3-u2-cp', '0'::jsonb, 0, 'leverage'),
  ('c3-u3-l1.q1', 'numeric', 'c3-u3-l1', null, '15'::jsonb, 0.05, 'returns-metrics'),
  ('c3-u3-l1.q2', 'mcq', 'c3-u3-l1', null, '1'::jsonb, 0, 'returns-metrics'),
  ('c3-u3-l1.q3', 'numeric', 'c3-u3-l1', null, '2'::jsonb, 0.001, 'returns-metrics'),
  ('c3-u3-l1.q4', 'tf', 'c3-u3-l1', null, '0'::jsonb, 0, 'returns-metrics'),
  ('c3-u3-l2.q1', 'numeric', 'c3-u3-l2', null, '15'::jsonb, 0.05, 'business-quality'),
  ('c3-u3-l2.q2', 'match', 'c3-u3-l2', null, '[0,1,2,3]'::jsonb, 0, 'business-quality'),
  ('c3-u3-l2.q3', 'multi', 'c3-u3-l2', null, '[0,1,3]'::jsonb, 0, 'business-quality'),
  ('c3-u3-l3.q1', 'order', 'c3-u3-l3', null, '[0,1,2,3]'::jsonb, 0, 'red-flags'),
  ('c3-u3-l3.q2', 'multi', 'c3-u3-l3', null, '[0,1,2]'::jsonb, 0, 'red-flags'),
  ('c3-u3-l3.q3', 'mcq', 'c3-u3-l3', null, '1'::jsonb, 0, 'red-flags'),
  ('c3-u3-cp.c1', 'numeric', null, 'c3-u3-cp', '20'::jsonb, 0.05, 'returns-metrics'),
  ('c3-u3-cp.c2', 'numeric', null, 'c3-u3-cp', '70'::jsonb, 0.01, 'returns-metrics'),
  ('c3-u3-cp.c3', 'mcq', null, 'c3-u3-cp', '1'::jsonb, 0, 'returns-metrics'),
  ('c3-u3-cp.c4', 'mcq', null, 'c3-u3-cp', '1'::jsonb, 0, 'business-quality'),
  ('c3-u3-cp.c5', 'tf', null, 'c3-u3-cp', '0'::jsonb, 0, 'red-flags'),
  ('c3-u3-cp.c6', 'mcq', null, 'c3-u3-cp', '1'::jsonb, 0, 'red-flags'),
  ('c3-exam.e1', 'mcq', null, 'c3-exam', '1'::jsonb, 0, 'business-model'),
  ('c3-exam.e2', 'numeric', null, 'c3-exam', '40'::jsonb, 0.05, 'margins'),
  ('c3-exam.e3', 'numeric', null, 'c3-exam', '12'::jsonb, 0.05, 'margins'),
  ('c3-exam.e4', 'tf', null, 'c3-exam', '0'::jsonb, 0, 'balance-sheet'),
  ('c3-exam.e5', 'numeric', null, 'c3-exam', '1200'::jsonb, 0, 'balance-sheet'),
  ('c3-exam.e6', 'mcq', null, 'c3-exam', '1'::jsonb, 0, 'cash-flow'),
  ('c3-exam.e7', 'tf', null, 'c3-exam', '0'::jsonb, 0, 'cash-flow'),
  ('c3-exam.e8', 'numeric', null, 'c3-exam', '2'::jsonb, 0.01, 'leverage'),
  ('c3-exam.e9', 'mcq', null, 'c3-exam', '3'::jsonb, 0, 'leverage'),
  ('c3-exam.e10', 'numeric', null, 'c3-exam', '15'::jsonb, 0.05, 'returns-metrics'),
  ('c3-exam.e11', 'mcq', null, 'c3-exam', '0'::jsonb, 0, 'returns-metrics'),
  ('c3-exam.e12', 'numeric', null, 'c3-exam', '-10'::jsonb, 0.05, 'business-quality'),
  ('c3-exam.e13', 'multi', null, 'c3-exam', '[0,1,3]'::jsonb, 0, 'business-quality'),
  ('c3-exam.e14', 'mcq', null, 'c3-exam', '1'::jsonb, 0, 'red-flags'),
  ('c3-exam.e15', 'tf', null, 'c3-exam', '1'::jsonb, 0, 'red-flags'),
  ('c4-u1-l1.q1', 'mcq', 'c4-u1-l1', null, '1'::jsonb, 0, 'funds-basics'),
  ('c4-u1-l1.q2', 'numeric', 'c4-u1-l1', null, '20'::jsonb, 0.01, 'funds-basics'),
  ('c4-u1-l1.q3', 'multi', 'c4-u1-l1', null, '[0,1,3]'::jsonb, 0, 'funds-basics'),
  ('c4-u1-l2.q1', 'mcq', 'c4-u1-l2', null, '1'::jsonb, 0, 'active-passive'),
  ('c4-u1-l2.q2', 'tf', 'c4-u1-l2', null, '0'::jsonb, 0, 'active-passive'),
  ('c4-u1-l2.q3', 'match', 'c4-u1-l2', null, '[0,1,1,0]'::jsonb, 0, 'active-passive'),
  ('c4-u1-l3.q1', 'mcq', 'c4-u1-l3', null, '1'::jsonb, 0, 'etfs'),
  ('c4-u1-l3.q2', 'numeric', 'c4-u1-l3', null, '-0.2'::jsonb, 0.01, 'etfs'),
  ('c4-u1-l3.q3', 'mcq', 'c4-u1-l3', null, '0'::jsonb, 0, 'etfs'),
  ('c4-u1-cp.c1', 'mcq', null, 'c4-u1-cp', '0'::jsonb, 0, 'funds-basics'),
  ('c4-u1-cp.c2', 'numeric', null, 'c4-u1-cp', '18'::jsonb, 0.01, 'funds-basics'),
  ('c4-u1-cp.c3', 'tf', null, 'c4-u1-cp', '1'::jsonb, 0, 'active-passive'),
  ('c4-u1-cp.c4', 'mcq', null, 'c4-u1-cp', '0'::jsonb, 0, 'active-passive'),
  ('c4-u1-cp.c5', 'numeric', null, 'c4-u1-cp', '-0.2'::jsonb, 0.01, 'etfs'),
  ('c4-u1-cp.c6', 'mcq', null, 'c4-u1-cp', '0'::jsonb, 0, 'etfs'),
  ('c4-u2-l1.q1', 'numeric', 'c4-u2-l1', null, '6.2'::jsonb, 0.01, 'asset-allocation'),
  ('c4-u2-l1.q2', 'mcq', 'c4-u2-l1', null, '1'::jsonb, 0, 'asset-allocation'),
  ('c4-u2-l1.q3', 'tf', 'c4-u2-l1', null, '1'::jsonb, 0, 'asset-allocation'),
  ('c4-u2-l2.q1', 'mcq', 'c4-u2-l2', null, '1'::jsonb, 0, 'concentration'),
  ('c4-u2-l2.q2', 'numeric', 'c4-u2-l2', null, '60'::jsonb, 0.05, 'concentration'),
  ('c4-u2-l2.q3', 'multi', 'c4-u2-l2', null, '[0,2,3]'::jsonb, 0, 'concentration'),
  ('c4-u2-l3.q1', 'match', 'c4-u2-l3', null, '[0,1,2]'::jsonb, 0, 'correlation'),
  ('c4-u2-l3.q2', 'mcq', 'c4-u2-l3', null, '2'::jsonb, 0, 'correlation'),
  ('c4-u2-l3.q3', 'tf', 'c4-u2-l3', null, '0'::jsonb, 0, 'correlation'),
  ('c4-u2-l4.q1', 'numeric', 'c4-u2-l4', null, '4.76'::jsonb, 0.1, 'currency-risk'),
  ('c4-u2-l4.q2', 'mcq', 'c4-u2-l4', null, '0'::jsonb, 0, 'currency-risk'),
  ('c4-u2-l4.q3', 'tf', 'c4-u2-l4', null, '1'::jsonb, 0, 'currency-risk'),
  ('c4-u2-cp.c1', 'numeric', null, 'c4-u2-cp', '6.8'::jsonb, 0.01, 'asset-allocation'),
  ('c4-u2-cp.c2', 'tf', null, 'c4-u2-cp', '0'::jsonb, 0, 'asset-allocation'),
  ('c4-u2-cp.c3', 'mcq', null, 'c4-u2-cp', '0'::jsonb, 0, 'concentration'),
  ('c4-u2-cp.c4', 'mcq', null, 'c4-u2-cp', '2'::jsonb, 0, 'correlation'),
  ('c4-u2-cp.c5', 'numeric', null, 'c4-u2-cp', '9.2'::jsonb, 0.05, 'currency-risk'),
  ('c4-u2-cp.c6', 'tf', null, 'c4-u2-cp', '0'::jsonb, 0, 'currency-risk'),
  ('c4-u3-l1.q1', 'numeric', 'c4-u3-l1', null, '64.3'::jsonb, 0.1, 'rebalancing'),
  ('c4-u3-l1.q2', 'numeric', 'c4-u3-l1', null, '500'::jsonb, 0.01, 'rebalancing'),
  ('c4-u3-l1.q3', 'tf', 'c4-u3-l1', null, '0'::jsonb, 0, 'rebalancing'),
  ('c4-u3-l2.q1', 'numeric', 'c4-u3-l2', null, '25'::jsonb, 0.05, 'portfolio-volatility'),
  ('c4-u3-l2.q2', 'mcq', 'c4-u3-l2', null, '3'::jsonb, 0, 'portfolio-volatility'),
  ('c4-u3-l2.q3', 'tf', 'c4-u3-l2', null, '1'::jsonb, 0, 'portfolio-volatility'),
  ('c4-u3-l3.q1', 'mcq', 'c4-u3-l3', null, '1'::jsonb, 0, 'diversification-limits'),
  ('c4-u3-l3.q2', 'tf', 'c4-u3-l3', null, '1'::jsonb, 0, 'diversification-limits'),
  ('c4-u3-l3.q3', 'order', 'c4-u3-l3', null, '[0,1,2,3,4]'::jsonb, 0, 'diversification-limits'),
  ('c4-u3-cp.c1', 'numeric', null, 'c4-u3-cp', '1800'::jsonb, 0.01, 'rebalancing'),
  ('c4-u3-cp.c2', 'mcq', null, 'c4-u3-cp', '1'::jsonb, 0, 'rebalancing'),
  ('c4-u3-cp.c3', 'numeric', null, 'c4-u3-cp', '30'::jsonb, 0.05, 'portfolio-volatility'),
  ('c4-u3-cp.c4', 'tf', null, 'c4-u3-cp', '1'::jsonb, 0, 'diversification-limits'),
  ('c4-u3-cp.c5', 'mcq', null, 'c4-u3-cp', '1'::jsonb, 0, 'diversification-limits'),
  ('c4-u3-cp.c6', 'mcq', null, 'c4-u3-cp', '1'::jsonb, 0, 'portfolio-volatility'),
  ('c4-exam.e1', 'mcq', null, 'c4-exam', '0'::jsonb, 0, 'funds-basics'),
  ('c4-exam.e2', 'numeric', null, 'c4-exam', '150'::jsonb, 0.01, 'funds-basics'),
  ('c4-exam.e3', 'tf', null, 'c4-exam', '0'::jsonb, 0, 'active-passive'),
  ('c4-exam.e4', 'mcq', null, 'c4-exam', '0'::jsonb, 0, 'etfs'),
  ('c4-exam.e5', 'mcq', null, 'c4-exam', '0'::jsonb, 0, 'etfs'),
  ('c4-exam.e6', 'numeric', null, 'c4-exam', '4.6'::jsonb, 0.01, 'asset-allocation'),
  ('c4-exam.e7', 'mcq', null, 'c4-exam', '1'::jsonb, 0, 'concentration'),
  ('c4-exam.e8', 'tf', null, 'c4-exam', '0'::jsonb, 0, 'correlation'),
  ('c4-exam.e9', 'tf', null, 'c4-exam', '1'::jsonb, 0, 'correlation'),
  ('c4-exam.e10', 'numeric', null, 'c4-exam', '-1'::jsonb, 0.05, 'currency-risk'),
  ('c4-exam.e11', 'numeric', null, 'c4-exam', '2000'::jsonb, 0.01, 'rebalancing'),
  ('c4-exam.e12', 'multi', null, 'c4-exam', '[0,1,2]'::jsonb, 0, 'rebalancing'),
  ('c4-exam.e13', 'numeric', null, 'c4-exam', '30'::jsonb, 0.05, 'portfolio-volatility'),
  ('c4-exam.e14', 'mcq', null, 'c4-exam', '1'::jsonb, 0, 'diversification-limits'),
  ('c4-exam.e15', 'tf', null, 'c4-exam', '1'::jsonb, 0, 'diversification-limits'),
  ('c5-u1-l1.q1', 'mcq', 'c5-u1-l1', null, '1'::jsonb, 0, 'valuation-basics'),
  ('c5-u1-l1.q2', 'tf', 'c5-u1-l1', null, '1'::jsonb, 0, 'valuation-basics'),
  ('c5-u1-l1.q3', 'multi', 'c5-u1-l1', null, '[0,1,2]'::jsonb, 0, 'valuation-basics'),
  ('c5-u1-l2.q1', 'numeric', 'c5-u1-l2', null, '15'::jsonb, 0.01, 'pe-ratio'),
  ('c5-u1-l2.q2', 'numeric', 'c5-u1-l2', null, '4'::jsonb, 0.01, 'pe-ratio'),
  ('c5-u1-l2.q3', 'mcq', 'c5-u1-l2', null, '2'::jsonb, 0, 'pe-ratio'),
  ('c5-u1-l3.q1', 'numeric', 'c5-u1-l3', null, '3'::jsonb, 0.01, 'ps-pb'),
  ('c5-u1-l3.q2', 'numeric', 'c5-u1-l3', null, '0.8'::jsonb, 0.01, 'ps-pb'),
  ('c5-u1-l3.q3', 'match', 'c5-u1-l3', null, '[0,1,2]'::jsonb, 0, 'ps-pb'),
  ('c5-u1-l3.q4', 'tf', 'c5-u1-l3', null, '1'::jsonb, 0, 'ps-pb'),
  ('c5-u1-l4.q1', 'numeric', 'c5-u1-l4', null, '1200'::jsonb, 0, 'ev-ebitda'),
  ('c5-u1-l4.q2', 'numeric', 'c5-u1-l4', null, '8'::jsonb, 0.01, 'ev-ebitda'),
  ('c5-u1-l4.q3', 'mcq', 'c5-u1-l4', null, '1'::jsonb, 0, 'ev-ebitda'),
  ('c5-u1-cp.c1', 'numeric', null, 'c5-u1-cp', '15'::jsonb, 0.01, 'pe-ratio'),
  ('c5-u1-cp.c2', 'numeric', null, 'c5-u1-cp', '10'::jsonb, 0.01, 'pe-ratio'),
  ('c5-u1-cp.c3', 'mcq', null, 'c5-u1-cp', '1'::jsonb, 0, 'pe-ratio'),
  ('c5-u1-cp.c4', 'numeric', null, 'c5-u1-cp', '0.8'::jsonb, 0.01, 'ps-pb'),
  ('c5-u1-cp.c5', 'numeric', null, 'c5-u1-cp', '1000'::jsonb, 0, 'ev-ebitda'),
  ('c5-u1-cp.c6', 'tf', null, 'c5-u1-cp', '1'::jsonb, 0, 'valuation-basics'),
  ('c5-u2-l1.q1', 'numeric', 'c5-u2-l1', null, '453.51'::jsonb, 0.02, 'present-value'),
  ('c5-u2-l1.q2', 'mcq', 'c5-u2-l1', null, '1'::jsonb, 0, 'present-value'),
  ('c5-u2-l1.q3', 'numeric', 'c5-u2-l1', null, '86.78'::jsonb, 0.02, 'present-value'),
  ('c5-u2-l1.q4', 'tf', 'c5-u2-l1', null, '0'::jsonb, 0, 'present-value'),
  ('c5-u2-l2.q1', 'mcq', 'c5-u2-l2', null, '1'::jsonb, 0, 'discount-rate'),
  ('c5-u2-l2.q2', 'tf', 'c5-u2-l2', null, '0'::jsonb, 0, 'discount-rate'),
  ('c5-u2-l2.q3', 'mcq', 'c5-u2-l2', null, '1'::jsonb, 0, 'discount-rate'),
  ('c5-u2-l3.q1', 'order', 'c5-u2-l3', null, '[0,1,2,3]'::jsonb, 0, 'dcf'),
  ('c5-u2-l3.q2', 'numeric', 'c5-u2-l3', null, '100'::jsonb, 0.01, 'dcf'),
  ('c5-u2-l3.q3', 'mcq', 'c5-u2-l3', null, '3'::jsonb, 0, 'dcf'),
  ('c5-u2-l4.q1', 'mcq', 'c5-u2-l4', null, '1'::jsonb, 0, 'margin-of-safety'),
  ('c5-u2-l4.q2', 'numeric', 'c5-u2-l4', null, '25'::jsonb, 0.05, 'margin-of-safety'),
  ('c5-u2-l4.q3', 'tf', 'c5-u2-l4', null, '0'::jsonb, 0, 'margin-of-safety'),
  ('c5-u2-cp.c1', 'numeric', null, 'c5-u2-cp', '100'::jsonb, 0.01, 'present-value'),
  ('c5-u2-cp.c2', 'mcq', null, 'c5-u2-cp', '1'::jsonb, 0, 'present-value'),
  ('c5-u2-cp.c3', 'mcq', null, 'c5-u2-cp', '2'::jsonb, 0, 'discount-rate'),
  ('c5-u2-cp.c4', 'numeric', null, 'c5-u2-cp', '100'::jsonb, 0.01, 'dcf'),
  ('c5-u2-cp.c5', 'numeric', null, 'c5-u2-cp', '20'::jsonb, 0.05, 'margin-of-safety'),
  ('c5-u2-cp.c6', 'tf', null, 'c5-u2-cp', '1'::jsonb, 0, 'margin-of-safety'),
  ('c5-u3-l1.q1', 'numeric', 'c5-u3-l1', null, '3'::jsonb, 0.01, 'yields'),
  ('c5-u3-l1.q2', 'numeric', 'c5-u3-l1', null, '5'::jsonb, 0.01, 'yields'),
  ('c5-u3-l1.q3', 'mcq', 'c5-u3-l1', null, '1'::jsonb, 0, 'yields'),
  ('c5-u3-l2.q1', 'numeric', 'c5-u3-l2', null, '27'::jsonb, 0.01, 'comparables'),
  ('c5-u3-l2.q2', 'numeric', 'c5-u3-l2', null, '300'::jsonb, 0, 'comparables'),
  ('c5-u3-l2.q3', 'multi', 'c5-u3-l2', null, '[0,1,3]'::jsonb, 0, 'comparables'),
  ('c5-u3-l2.q4', 'tf', 'c5-u3-l2', null, '1'::jsonb, 0, 'comparables'),
  ('c5-u3-l3.q1', 'match', 'c5-u3-l3', null, '[0,1,2,3]'::jsonb, 0, 'business-types'),
  ('c5-u3-l3.q2', 'mcq', 'c5-u3-l3', null, '1'::jsonb, 0, 'business-types'),
  ('c5-u3-l3.q3', 'tf', 'c5-u3-l3', null, '1'::jsonb, 0, 'business-types'),
  ('c5-u3-l4.q1', 'multi', 'c5-u3-l4', null, '[0,1,2]'::jsonb, 0, 'value-traps'),
  ('c5-u3-l4.q2', 'mcq', 'c5-u3-l4', null, '2'::jsonb, 0, 'value-traps'),
  ('c5-u3-l4.q3', 'tf', 'c5-u3-l4', null, '0'::jsonb, 0, 'value-traps'),
  ('c5-u3-cp.c1', 'numeric', null, 'c5-u3-cp', '5'::jsonb, 0.01, 'yields'),
  ('c5-u3-cp.c2', 'numeric', null, 'c5-u3-cp', '4'::jsonb, 0.01, 'yields'),
  ('c5-u3-cp.c3', 'numeric', null, 'c5-u3-cp', '30'::jsonb, 0.01, 'comparables'),
  ('c5-u3-cp.c4', 'mcq', null, 'c5-u3-cp', '1'::jsonb, 0, 'business-types'),
  ('c5-u3-cp.c5', 'mcq', null, 'c5-u3-cp', '1'::jsonb, 0, 'business-types'),
  ('c5-u3-cp.c6', 'tf', null, 'c5-u3-cp', '1'::jsonb, 0, 'value-traps'),
  ('c5-exam.e1', 'mcq', null, 'c5-exam', '1'::jsonb, 0, 'valuation-basics'),
  ('c5-exam.e2', 'numeric', null, 'c5-exam', '15'::jsonb, 0.01, 'pe-ratio'),
  ('c5-exam.e3', 'numeric', null, 'c5-exam', '3'::jsonb, 0.01, 'ps-pb'),
  ('c5-exam.e4', 'numeric', null, 'c5-exam', '10'::jsonb, 0.01, 'ev-ebitda'),
  ('c5-exam.e5', 'tf', null, 'c5-exam', '1'::jsonb, 0, 'ev-ebitda'),
  ('c5-exam.e6', 'numeric', null, 'c5-exam', '800'::jsonb, 0.01, 'present-value'),
  ('c5-exam.e7', 'mcq', null, 'c5-exam', '1'::jsonb, 0, 'discount-rate'),
  ('c5-exam.e8', 'numeric', null, 'c5-exam', '240'::jsonb, 0.01, 'dcf'),
  ('c5-exam.e9', 'tf', null, 'c5-exam', '0'::jsonb, 0, 'dcf'),
  ('c5-exam.e10', 'numeric', null, 'c5-exam', '25'::jsonb, 0.05, 'margin-of-safety'),
  ('c5-exam.e11', 'numeric', null, 'c5-exam', '4'::jsonb, 0.01, 'yields'),
  ('c5-exam.e12', 'numeric', null, 'c5-exam', '250'::jsonb, 0, 'comparables'),
  ('c5-exam.e13', 'mcq', null, 'c5-exam', '2'::jsonb, 0, 'business-types'),
  ('c5-exam.e14', 'multi', null, 'c5-exam', '[0,1,2]'::jsonb, 0, 'value-traps'),
  ('c5-exam.e15', 'tf', null, 'c5-exam', '0'::jsonb, 0, 'value-traps'),
  ('c6-u1-l1.q1', 'numeric', 'c6-u1-l1', null, '22.5'::jsonb, 0.01, 'bonds-basics'),
  ('c6-u1-l1.q2', 'match', 'c6-u1-l1', null, '[0,1,2,3]'::jsonb, 0, 'bonds-basics'),
  ('c6-u1-l1.q3', 'tf', 'c6-u1-l1', null, '1'::jsonb, 0, 'bonds-basics'),
  ('c6-u1-l2.q1', 'numeric', 'c6-u1-l2', null, '5'::jsonb, 0.01, 'bond-yields'),
  ('c6-u1-l2.q2', 'mcq', 'c6-u1-l2', null, '1'::jsonb, 0, 'bond-yields'),
  ('c6-u1-l2.q3', 'tf', 'c6-u1-l2', null, '0'::jsonb, 0, 'bond-yields'),
  ('c6-u1-l3.q1', 'numeric', 'c6-u1-l3', null, '-7'::jsonb, 0.05, 'duration'),
  ('c6-u1-l3.q2', 'mcq', 'c6-u1-l3', null, '2'::jsonb, 0, 'duration'),
  ('c6-u1-l3.q3', 'numeric', 'c6-u1-l3', null, '2'::jsonb, 0.05, 'duration'),
  ('c6-u1-l3.q4', 'tf', 'c6-u1-l3', null, '1'::jsonb, 0, 'duration'),
  ('c6-u1-l4.q1', 'order', 'c6-u1-l4', null, '[0,1,2,3,4]'::jsonb, 0, 'credit-risk'),
  ('c6-u1-l4.q2', 'numeric', 'c6-u1-l4', null, '1.8'::jsonb, 0.01, 'credit-risk'),
  ('c6-u1-l4.q3', 'mcq', 'c6-u1-l4', null, '1'::jsonb, 0, 'credit-risk'),
  ('c6-u1-cp.c1', 'numeric', null, 'c6-u1-cp', '3'::jsonb, 0.01, 'bonds-basics'),
  ('c6-u1-cp.c2', 'mcq', null, 'c6-u1-cp', '1'::jsonb, 0, 'bond-yields'),
  ('c6-u1-cp.c3', 'numeric', null, 'c6-u1-cp', '5'::jsonb, 0.01, 'bond-yields'),
  ('c6-u1-cp.c4', 'numeric', null, 'c6-u1-cp', '-5'::jsonb, 0.05, 'duration'),
  ('c6-u1-cp.c5', 'mcq', null, 'c6-u1-cp', '2'::jsonb, 0, 'credit-risk'),
  ('c6-u1-cp.c6', 'tf', null, 'c6-u1-cp', '0'::jsonb, 0, 'credit-risk'),
  ('c6-u2-l1.q1', 'numeric', 'c6-u2-l1', null, '2'::jsonb, 0.01, 'gdp'),
  ('c6-u2-l1.q2', 'mcq', 'c6-u2-l1', null, '3'::jsonb, 0, 'gdp'),
  ('c6-u2-l1.q3', 'tf', 'c6-u2-l1', null, '1'::jsonb, 0, 'gdp'),
  ('c6-u2-l2.q1', 'match', 'c6-u2-l2', null, '[0,1,2]'::jsonb, 0, 'inflation-unemployment'),
  ('c6-u2-l2.q2', 'numeric', 'c6-u2-l2', null, '4'::jsonb, 0.01, 'inflation-unemployment'),
  ('c6-u2-l2.q3', 'mcq', 'c6-u2-l2', null, '1'::jsonb, 0, 'inflation-unemployment'),
  ('c6-u2-l3.q1', 'match', 'c6-u2-l3', null, '[0,1]'::jsonb, 0, 'central-banks'),
  ('c6-u2-l3.q2', 'mcq', 'c6-u2-l3', null, '1'::jsonb, 0, 'central-banks'),
  ('c6-u2-l3.q3', 'tf', 'c6-u2-l3', null, '0'::jsonb, 0, 'central-banks'),
  ('c6-u2-l4.q1', 'multi', 'c6-u2-l4', null, '[0,2]'::jsonb, 0, 'monetary-fiscal'),
  ('c6-u2-l4.q2', 'mcq', 'c6-u2-l4', null, '1'::jsonb, 0, 'monetary-fiscal'),
  ('c6-u2-l4.q3', 'tf', 'c6-u2-l4', null, '0'::jsonb, 0, 'monetary-fiscal'),
  ('c6-u2-cp.c1', 'numeric', null, 'c6-u2-cp', '3'::jsonb, 0.01, 'gdp'),
  ('c6-u2-cp.c2', 'mcq', null, 'c6-u2-cp', '1'::jsonb, 0, 'gdp'),
  ('c6-u2-cp.c3', 'numeric', null, 'c6-u2-cp', '5'::jsonb, 0.01, 'inflation-unemployment'),
  ('c6-u2-cp.c4', 'mcq', null, 'c6-u2-cp', '1'::jsonb, 0, 'central-banks'),
  ('c6-u2-cp.c5', 'mcq', null, 'c6-u2-cp', '1'::jsonb, 0, 'monetary-fiscal'),
  ('c6-u2-cp.c6', 'tf', null, 'c6-u2-cp', '0'::jsonb, 0, 'monetary-fiscal'),
  ('c6-u3-l1.q1', 'mcq', 'c6-u3-l1', null, '1'::jsonb, 0, 'yield-curve'),
  ('c6-u3-l1.q2', 'numeric', 'c6-u3-l1', null, '-0.7'::jsonb, 0.01, 'yield-curve'),
  ('c6-u3-l1.q3', 'tf', 'c6-u3-l1', null, '1'::jsonb, 0, 'yield-curve'),
  ('c6-u3-l2.q1', 'multi', 'c6-u3-l2', null, '[0,1,2]'::jsonb, 0, 'rates-equities'),
  ('c6-u3-l2.q2', 'mcq', 'c6-u3-l2', null, '1'::jsonb, 0, 'rates-equities'),
  ('c6-u3-l2.q3', 'tf', 'c6-u3-l2', null, '1'::jsonb, 0, 'rates-equities'),
  ('c6-u3-l3.q1', 'numeric', 'c6-u3-l3', null, '500'::jsonb, 0.01, 'exchange-rates'),
  ('c6-u3-l3.q2', 'mcq', 'c6-u3-l3', null, '0'::jsonb, 0, 'exchange-rates'),
  ('c6-u3-l3.q3', 'tf', 'c6-u3-l3', null, '1'::jsonb, 0, 'exchange-rates'),
  ('c6-u3-cp.c1', 'mcq', null, 'c6-u3-cp', '0'::jsonb, 0, 'yield-curve'),
  ('c6-u3-cp.c2', 'numeric', null, 'c6-u3-cp', '-1'::jsonb, 0.01, 'yield-curve'),
  ('c6-u3-cp.c3', 'tf', null, 'c6-u3-cp', '1'::jsonb, 0, 'rates-equities'),
  ('c6-u3-cp.c4', 'mcq', null, 'c6-u3-cp', '0'::jsonb, 0, 'rates-equities'),
  ('c6-u3-cp.c5', 'numeric', null, 'c6-u3-cp', '500'::jsonb, 0.01, 'exchange-rates'),
  ('c6-u3-cp.c6', 'mcq', null, 'c6-u3-cp', '1'::jsonb, 0, 'exchange-rates'),
  ('c6-exam.e1', 'tf', null, 'c6-exam', '0'::jsonb, 0, 'bonds-basics'),
  ('c6-exam.e2', 'numeric', null, 'c6-exam', '60'::jsonb, 0.01, 'bonds-basics'),
  ('c6-exam.e3', 'numeric', null, 'c6-exam', '5'::jsonb, 0.01, 'bond-yields'),
  ('c6-exam.e4', 'mcq', null, 'c6-exam', '1'::jsonb, 0, 'duration'),
  ('c6-exam.e5', 'numeric', null, 'c6-exam', '6'::jsonb, 0.05, 'duration'),
  ('c6-exam.e6', 'numeric', null, 'c6-exam', '3.5'::jsonb, 0.01, 'credit-risk'),
  ('c6-exam.e7', 'mcq', null, 'c6-exam', '1'::jsonb, 0, 'credit-risk'),
  ('c6-exam.e8', 'tf', null, 'c6-exam', '0'::jsonb, 0, 'gdp'),
  ('c6-exam.e9', 'multi', null, 'c6-exam', '[0,1,2]'::jsonb, 0, 'inflation-unemployment'),
  ('c6-exam.e10', 'mcq', null, 'c6-exam', '1'::jsonb, 0, 'central-banks'),
  ('c6-exam.e11', 'mcq', null, 'c6-exam', '1'::jsonb, 0, 'central-banks'),
  ('c6-exam.e12', 'mcq', null, 'c6-exam', '1'::jsonb, 0, 'monetary-fiscal'),
  ('c6-exam.e13', 'tf', null, 'c6-exam', '1'::jsonb, 0, 'yield-curve'),
  ('c6-exam.e14', 'tf', null, 'c6-exam', '1'::jsonb, 0, 'rates-equities'),
  ('c6-exam.e15', 'numeric', null, 'c6-exam', '4'::jsonb, 0.05, 'exchange-rates'),
  ('c7-u1-l1.q1', 'order', 'c7-u1-l1', null, '[0,1,2,3]'::jsonb, 0, 'dividend-mechanics'),
  ('c7-u1-l1.q2', 'numeric', 'c7-u1-l1', null, '1.4'::jsonb, 0.001, 'dividend-mechanics'),
  ('c7-u1-l1.q3', 'tf', 'c7-u1-l1', null, '1'::jsonb, 0, 'dividend-mechanics'),
  ('c7-u1-l2.q1', 'numeric', 'c7-u1-l2', null, '4'::jsonb, 0.01, 'payout-ratio'),
  ('c7-u1-l2.q2', 'numeric', 'c7-u1-l2', null, '50'::jsonb, 0.01, 'payout-ratio'),
  ('c7-u1-l2.q3', 'numeric', 'c7-u1-l2', null, '2'::jsonb, 0.01, 'payout-ratio'),
  ('c7-u1-l2.q4', 'mcq', 'c7-u1-l2', null, '3'::jsonb, 0, 'payout-ratio'),
  ('c7-u1-l3.q1', 'numeric', 'c7-u1-l3', null, '66.9'::jsonb, 0.1, 'dividend-growth'),
  ('c7-u1-l3.q2', 'mcq', 'c7-u1-l3', null, '1'::jsonb, 0, 'dividend-growth'),
  ('c7-u1-l3.q3', 'tf', 'c7-u1-l3', null, '1'::jsonb, 0, 'dividend-growth'),
  ('c7-u1-cp.c1', 'mcq', null, 'c7-u1-cp', '1'::jsonb, 0, 'dividend-mechanics'),
  ('c7-u1-cp.c2', 'numeric', null, 'c7-u1-cp', '5'::jsonb, 0.01, 'payout-ratio'),
  ('c7-u1-cp.c3', 'numeric', null, 'c7-u1-cp', '75'::jsonb, 0.01, 'payout-ratio'),
  ('c7-u1-cp.c4', 'numeric', null, 'c7-u1-cp', '3'::jsonb, 0.01, 'payout-ratio'),
  ('c7-u1-cp.c5', 'mcq', null, 'c7-u1-cp', '1'::jsonb, 0, 'dividend-growth'),
  ('c7-u1-cp.c6', 'tf', null, 'c7-u1-cp', '0'::jsonb, 0, 'dividend-mechanics'),
  ('c7-u2-l1.q1', 'numeric', 'c7-u2-l1', null, '80'::jsonb, 0.05, 'dividend-sustainability'),
  ('c7-u2-l1.q2', 'multi', 'c7-u2-l1', null, '[0,1,2]'::jsonb, 0, 'dividend-sustainability'),
  ('c7-u2-l1.q3', 'mcq', 'c7-u2-l1', null, '0'::jsonb, 0, 'dividend-sustainability'),
  ('c7-u2-l2.q1', 'numeric', 'c7-u2-l2', null, '10'::jsonb, 0.01, 'dividend-traps'),
  ('c7-u2-l2.q2', 'numeric', 'c7-u2-l2', null, '6.25'::jsonb, 0.01, 'dividend-traps'),
  ('c7-u2-l2.q3', 'tf', 'c7-u2-l2', null, '0'::jsonb, 0, 'dividend-traps'),
  ('c7-u2-l3.q1', 'numeric', 'c7-u2-l3', null, '1'::jsonb, 0.01, 'total-return'),
  ('c7-u2-l3.q2', 'mcq', 'c7-u2-l3', null, '1'::jsonb, 0, 'total-return'),
  ('c7-u2-l3.q3', 'tf', 'c7-u2-l3', null, '1'::jsonb, 0, 'total-return'),
  ('c7-u2-cp.c1', 'numeric', null, 'c7-u2-cp', '40'::jsonb, 0.05, 'dividend-sustainability'),
  ('c7-u2-cp.c2', 'tf', null, 'c7-u2-cp', '1'::jsonb, 0, 'dividend-sustainability'),
  ('c7-u2-cp.c3', 'numeric', null, 'c7-u2-cp', '10'::jsonb, 0.01, 'dividend-traps'),
  ('c7-u2-cp.c4', 'mcq', null, 'c7-u2-cp', '0'::jsonb, 0, 'dividend-traps'),
  ('c7-u2-cp.c5', 'numeric', null, 'c7-u2-cp', '10'::jsonb, 0.01, 'total-return'),
  ('c7-u2-cp.c6', 'tf', null, 'c7-u2-cp', '1'::jsonb, 0, 'total-return'),
  ('c7-u3-l1.q1', 'mcq', 'c7-u3-l1', null, '2'::jsonb, 0, 'long-term-investing'),
  ('c7-u3-l1.q2', 'tf', 'c7-u3-l1', null, '1'::jsonb, 0, 'long-term-investing'),
  ('c7-u3-l1.q3', 'mcq', 'c7-u3-l1', null, '1'::jsonb, 0, 'long-term-investing'),
  ('c7-u3-l2.q1', 'numeric', 'c7-u3-l2', null, '4'::jsonb, 0.15, 'real-returns'),
  ('c7-u3-l2.q2', 'mcq', 'c7-u3-l2', null, '1'::jsonb, 0, 'real-returns'),
  ('c7-u3-l2.q3', 'tf', 'c7-u3-l2', null, '1'::jsonb, 0, 'real-returns'),
  ('c7-u3-l3.q1', 'match', 'c7-u3-l3', null, '[0,1,0,1]'::jsonb, 0, 'tax-basics'),
  ('c7-u3-l3.q2', 'mcq', 'c7-u3-l3', null, '1'::jsonb, 0, 'tax-basics'),
  ('c7-u3-l3.q3', 'tf', 'c7-u3-l3', null, '1'::jsonb, 0, 'tax-basics'),
  ('c7-u3-cp.c1', 'mcq', null, 'c7-u3-cp', '0'::jsonb, 0, 'long-term-investing'),
  ('c7-u3-cp.c2', 'tf', null, 'c7-u3-cp', '1'::jsonb, 0, 'long-term-investing'),
  ('c7-u3-cp.c3', 'numeric', null, 'c7-u3-cp', '3'::jsonb, 0.15, 'real-returns'),
  ('c7-u3-cp.c4', 'mcq', null, 'c7-u3-cp', '2'::jsonb, 0, 'tax-basics'),
  ('c7-u3-cp.c5', 'mcq', null, 'c7-u3-cp', '1'::jsonb, 0, 'tax-basics'),
  ('c7-u3-cp.c6', 'tf', null, 'c7-u3-cp', '0'::jsonb, 0, 'tax-basics'),
  ('c7-exam.e1', 'order', null, 'c7-exam', '[0,1,2,3]'::jsonb, 0, 'dividend-mechanics'),
  ('c7-exam.e2', 'numeric', null, 'c7-exam', '2'::jsonb, 0.001, 'dividend-mechanics'),
  ('c7-exam.e3', 'numeric', null, 'c7-exam', '5'::jsonb, 0.01, 'payout-ratio'),
  ('c7-exam.e4', 'numeric', null, 'c7-exam', '75'::jsonb, 0.01, 'payout-ratio'),
  ('c7-exam.e5', 'numeric', null, 'c7-exam', '48.4'::jsonb, 0.05, 'dividend-growth'),
  ('c7-exam.e6', 'mcq', null, 'c7-exam', '0'::jsonb, 0, 'dividend-sustainability'),
  ('c7-exam.e7', 'tf', null, 'c7-exam', '1'::jsonb, 0, 'dividend-traps'),
  ('c7-exam.e8', 'numeric', null, 'c7-exam', '-5'::jsonb, 0.01, 'total-return'),
  ('c7-exam.e9', 'tf', null, 'c7-exam', '1'::jsonb, 0, 'total-return'),
  ('c7-exam.e10', 'mcq', null, 'c7-exam', '1'::jsonb, 0, 'total-return'),
  ('c7-exam.e11', 'tf', null, 'c7-exam', '1'::jsonb, 0, 'long-term-investing'),
  ('c7-exam.e12', 'numeric', null, 'c7-exam', '4'::jsonb, 0.15, 'real-returns'),
  ('c7-exam.e13', 'multi', null, 'c7-exam', '[0,1,3]'::jsonb, 0, 'tax-basics'),
  ('c7-exam.e14', 'mcq', null, 'c7-exam', '1'::jsonb, 0, 'tax-basics'),
  ('c7-exam.e15', 'tf', null, 'c7-exam', '0'::jsonb, 0, 'dividend-traps'),
  ('c8-u1-l1.q1', 'match', 'c8-u1-l1', null, '[0,1,2,3]'::jsonb, 0, 'trading-basics'),
  ('c8-u1-l1.q2', 'numeric', 'c8-u1-l1', null, '15'::jsonb, 0.05, 'trading-basics'),
  ('c8-u1-l1.q3', 'tf', 'c8-u1-l1', null, '1'::jsonb, 0, 'trading-basics'),
  ('c8-u1-l2.q1', 'numeric', 'c8-u1-l2', null, '11'::jsonb, 0, 'candlesticks'),
  ('c8-u1-l2.q2', 'mcq', 'c8-u1-l2', null, '1'::jsonb, 0, 'candlesticks'),
  ('c8-u1-l2.q3', 'tf', 'c8-u1-l2', null, '0'::jsonb, 0, 'candlesticks'),
  ('c8-u1-l3.q1', 'mcq', 'c8-u1-l3', null, '1'::jsonb, 0, 'support-resistance'),
  ('c8-u1-l3.q2', 'mcq', 'c8-u1-l3', null, '1'::jsonb, 0, 'support-resistance'),
  ('c8-u1-l3.q3', 'tf', 'c8-u1-l3', null, '1'::jsonb, 0, 'support-resistance'),
  ('c8-u1-l4.q1', 'numeric', 'c8-u1-l4', null, '12'::jsonb, 0, 'indicators'),
  ('c8-u1-l4.q2', 'numeric', 'c8-u1-l4', null, '75'::jsonb, 0.01, 'indicators'),
  ('c8-u1-l4.q3', 'tf', 'c8-u1-l4', null, '1'::jsonb, 0, 'indicators'),
  ('c8-u1-cp.c1', 'mcq', null, 'c8-u1-cp', '1'::jsonb, 0, 'trading-basics'),
  ('c8-u1-cp.c2', 'numeric', null, 'c8-u1-cp', '7'::jsonb, 0, 'candlesticks'),
  ('c8-u1-cp.c3', 'mcq', null, 'c8-u1-cp', '1'::jsonb, 0, 'candlesticks'),
  ('c8-u1-cp.c4', 'tf', null, 'c8-u1-cp', '0'::jsonb, 0, 'support-resistance'),
  ('c8-u1-cp.c5', 'numeric', null, 'c8-u1-cp', '22'::jsonb, 0, 'indicators'),
  ('c8-u1-cp.c6', 'numeric', null, 'c8-u1-cp', '50'::jsonb, 0.01, 'indicators'),
  ('c8-u2-l1.q1', 'match', 'c8-u2-l1', null, '[0,1,2]'::jsonb, 0, 'market-efficiency'),
  ('c8-u2-l1.q2', 'mcq', 'c8-u2-l1', null, '1'::jsonb, 0, 'market-efficiency'),
  ('c8-u2-l1.q3', 'tf', 'c8-u2-l1', null, '1'::jsonb, 0, 'market-efficiency'),
  ('c8-u2-l2.q1', 'mcq', 'c8-u2-l2', null, '1'::jsonb, 0, 'overconfidence'),
  ('c8-u2-l2.q2', 'mcq', 'c8-u2-l2', null, '0'::jsonb, 0, 'overconfidence'),
  ('c8-u2-l2.q3', 'tf', 'c8-u2-l2', null, '0'::jsonb, 0, 'overconfidence'),
  ('c8-u2-l3.q1', 'mcq', 'c8-u2-l3', null, '1'::jsonb, 0, 'loss-aversion'),
  ('c8-u2-l3.q2', 'tf', 'c8-u2-l3', null, '1'::jsonb, 0, 'loss-aversion'),
  ('c8-u2-l3.q3', 'mcq', 'c8-u2-l3', null, '0'::jsonb, 0, 'loss-aversion'),
  ('c8-u2-l4.q1', 'multi', 'c8-u2-l4', null, '[0,1,3]'::jsonb, 0, 'herding'),
  ('c8-u2-l4.q2', 'tf', 'c8-u2-l4', null, '1'::jsonb, 0, 'herding'),
  ('c8-u2-l4.q3', 'mcq', 'c8-u2-l4', null, '1'::jsonb, 0, 'herding'),
  ('c8-u2-cp.c1', 'mcq', null, 'c8-u2-cp', '0'::jsonb, 0, 'market-efficiency'),
  ('c8-u2-cp.c2', 'mcq', null, 'c8-u2-cp', '0'::jsonb, 0, 'overconfidence'),
  ('c8-u2-cp.c3', 'mcq', null, 'c8-u2-cp', '0'::jsonb, 0, 'loss-aversion'),
  ('c8-u2-cp.c4', 'tf', null, 'c8-u2-cp', '0'::jsonb, 0, 'loss-aversion'),
  ('c8-u2-cp.c5', 'mcq', null, 'c8-u2-cp', '0'::jsonb, 0, 'herding'),
  ('c8-u2-cp.c6', 'tf', null, 'c8-u2-cp', '1'::jsonb, 0, 'herding'),
  ('c8-u3-l1.q1', 'numeric', 'c8-u3-l1', null, '80'::jsonb, 0, 'position-sizing'),
  ('c8-u3-l1.q2', 'tf', 'c8-u3-l1', null, '1'::jsonb, 0, 'position-sizing'),
  ('c8-u3-l1.q3', 'mcq', 'c8-u3-l1', null, '1'::jsonb, 0, 'position-sizing'),
  ('c8-u3-l2.q1', 'numeric', 'c8-u3-l2', null, '100'::jsonb, 0.01, 'leverage-risk'),
  ('c8-u3-l2.q2', 'numeric', 'c8-u3-l2', null, '150'::jsonb, 0.1, 'leverage-risk'),
  ('c8-u3-l2.q3', 'tf', 'c8-u3-l2', null, '0'::jsonb, 0, 'leverage-risk'),
  ('c8-u3-l3.q1', 'match', 'c8-u3-l3', null, '[0,1,2,3]'::jsonb, 0, 'backtesting'),
  ('c8-u3-l3.q2', 'mcq', 'c8-u3-l3', null, '1'::jsonb, 0, 'backtesting'),
  ('c8-u3-l3.q3', 'tf', 'c8-u3-l3', null, '1'::jsonb, 0, 'backtesting'),
  ('c8-u3-cp.c1', 'numeric', null, 'c8-u3-cp', '100'::jsonb, 0, 'position-sizing'),
  ('c8-u3-cp.c2', 'tf', null, 'c8-u3-cp', '0'::jsonb, 0, 'position-sizing'),
  ('c8-u3-cp.c3', 'numeric', null, 'c8-u3-cp', '30'::jsonb, 0.01, 'leverage-risk'),
  ('c8-u3-cp.c4', 'numeric', null, 'c8-u3-cp', '25'::jsonb, 0.1, 'leverage-risk'),
  ('c8-u3-cp.c5', 'mcq', null, 'c8-u3-cp', '0'::jsonb, 0, 'backtesting'),
  ('c8-u3-cp.c6', 'tf', null, 'c8-u3-cp', '1'::jsonb, 0, 'backtesting'),
  ('c8-exam.e1', 'mcq', null, 'c8-exam', '3'::jsonb, 0, 'trading-basics'),
  ('c8-exam.e2', 'numeric', null, 'c8-exam', '12'::jsonb, 0.05, 'trading-basics'),
  ('c8-exam.e3', 'mcq', null, 'c8-exam', '0'::jsonb, 0, 'candlesticks'),
  ('c8-exam.e4', 'tf', null, 'c8-exam', '0'::jsonb, 0, 'candlesticks'),
  ('c8-exam.e5', 'tf', null, 'c8-exam', '1'::jsonb, 0, 'support-resistance'),
  ('c8-exam.e6', 'numeric', null, 'c8-exam', '9.5'::jsonb, 0.001, 'indicators'),
  ('c8-exam.e7', 'numeric', null, 'c8-exam', '66.7'::jsonb, 0.1, 'indicators'),
  ('c8-exam.e8', 'mcq', null, 'c8-exam', '1'::jsonb, 0, 'indicators'),
  ('c8-exam.e9', 'mcq', null, 'c8-exam', '1'::jsonb, 0, 'market-efficiency'),
  ('c8-exam.e10', 'mcq', null, 'c8-exam', '0'::jsonb, 0, 'overconfidence'),
  ('c8-exam.e11', 'tf', null, 'c8-exam', '0'::jsonb, 0, 'loss-aversion'),
  ('c8-exam.e12', 'multi', null, 'c8-exam', '[0,1,2]'::jsonb, 0, 'herding'),
  ('c8-exam.e13', 'numeric', null, 'c8-exam', '40'::jsonb, 0, 'position-sizing'),
  ('c8-exam.e14', 'numeric', null, 'c8-exam', '60'::jsonb, 0.01, 'leverage-risk'),
  ('c8-exam.e15', 'mcq', null, 'c8-exam', '0'::jsonb, 0, 'backtesting')
on conflict (id) do update set kind = excluded.kind, lesson_id = excluded.lesson_id, assessment_id = excluded.assessment_id, answer = excluded.answer, tolerance = excluded.tolerance, concept = excluded.concept;

commit;
