-- Veleta SQL test suite: trusted progression, idempotency, RLS and privacy.
-- Run with `npm run test:sql` (see supabase/tests/run.sh).
\set QUIET on
set client_min_messages = notice;

-- ------------------------------------------------------------- helpers --
create schema test;
grant usage on schema test to anon, authenticated;

create function test.ok(cond boolean, msg text) returns void language plpgsql as $$
begin
  if cond is not true then raise exception 'FAIL: %', msg; end if;
  raise notice 'ok - %', msg;
end $$;

create function test.login(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', case when uid is null then '' else json_build_object('sub', uid, 'role', 'authenticated')::text end, false)
$$;

create function test.expect_error(p_sql text, p_code text, msg text) returns void language plpgsql as $$
begin
  execute p_sql;
  raise exception 'FAIL: % (expected error %, got success)', msg, p_code;
exception when others then
  if sqlstate like 'P0001' and sqlerrm like 'FAIL:%' then raise; end if;
  if sqlstate <> p_code then raise exception 'FAIL: % (expected %, got % %)', msg, p_code, sqlstate, sqlerrm; end if;
  raise notice 'ok - %', msg;
end $$;

create table test.keys as select id, kind, lesson_id, assessment_id, answer from veleta_private.questions;

create function test.right_lesson(p text) returns jsonb language sql as $$ select jsonb_object_agg(id, answer) from test.keys where lesson_id = p $$;
create function test.right_assessment(p text) returns jsonb language sql as $$ select jsonb_object_agg(id, answer) from test.keys where assessment_id = p $$;
create function test.wrong_assessment(p text, n int) returns jsonb language sql as $$
  select jsonb_object_agg(id, case when rn <= n then (case when jsonb_typeof(answer) = 'array' then '[99]'::jsonb else '99999'::jsonb end) else answer end)
  from (select id, answer, row_number() over (order by id) rn from test.keys where assessment_id = p) s
$$;
create function test.uuid(n int) returns uuid language sql as $$ select ('00000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid $$;

grant select on test.keys to authenticated;
grant execute on all functions in schema test to anon, authenticated;

-- ------------------------------------------------------------- fixtures --
insert into auth.users (id, email, raw_user_meta_data) values
  ('a0000000-0000-4000-8000-000000000001', 'alice@example.com', '{"display_name":"Alice"}'),
  ('b0000000-0000-4000-8000-000000000002', 'bob@example.com', '{"display_name":"Bob <script>"}'),
  ('c0000000-0000-4000-8000-000000000003', 'carol@example.com', '{}'),
  ('d0000000-0000-4000-8000-000000000004', 'dave@example.com', '{"display_name":"Dave"}');

select test.ok((select count(*) = 4 from public.profiles), 'signup trigger creates profiles');
select test.ok((select bool_and(not is_public) from public.profiles), 'profiles are private by default');
select test.ok((select display_name from public.profiles where id = 'b0000000-0000-4000-8000-000000000002') = 'Bob script', 'display names are sanitised');
select test.ok((select display_name from public.profiles where id = 'c0000000-0000-4000-8000-000000000003') = 'Learner', 'missing display name defaults');
select test.ok((select freezes from public.streaks where user_id = 'a0000000-0000-4000-8000-000000000001') = 1, 'new learners start with one streak freeze');
update public.profiles set username = 'alice' where id = 'a0000000-0000-4000-8000-000000000001';
update public.profiles set username = 'bob' where id = 'b0000000-0000-4000-8000-000000000002';
update public.profiles set username = 'carol' where id = 'c0000000-0000-4000-8000-000000000003';

-- ======================================================= as Alice ======
set role authenticated;
select test.login('a0000000-0000-4000-8000-000000000001');

select test.expect_error($$select public.submit_lesson('c1-u1-l2', test.right_lesson('c1-u1-l2'), test.uuid(1))$$, 'VL001', 'locked lesson is rejected');
select test.expect_error($$select public.submit_lesson('c1-u1-l1', '{}'::jsonb, test.uuid(2))$$, 'VL002', 'incomplete answers are rejected');
select test.expect_error($$select public.submit_lesson('nope', '{}'::jsonb, test.uuid(3))$$, 'VL003', 'unknown lesson is rejected');

select public.submit_lesson('c1-u1-l1', test.right_lesson('c1-u1-l1'), test.uuid(10)) as r1 \gset
select test.ok((:'r1'::jsonb ->> 'firstCompletion')::boolean, 'first completion recorded');
select test.ok((:'r1'::jsonb ->> 'perfect')::boolean, 'perfect lesson detected');
select test.ok((select sum(amount) from public.xp_events where source_key like 'lesson%') = 25, 'lesson XP 20 + perfect bonus 5');
select test.ok((select count(*) from public.user_achievements where achievement_id in ('first_lesson', 'perfect_lesson')) = 2, 'first lesson and perfect achievements unlocked');

select public.submit_lesson('c1-u1-l1', test.right_lesson('c1-u1-l1'), test.uuid(10)) as r1b \gset
select test.ok(:'r1'::jsonb = :'r1b'::jsonb, 'duplicate request returns the stored result');
select test.ok((select count(*) from public.xp_events where source_key like 'lesson%') = 2, 'duplicate request awards nothing');

select public.submit_lesson('c1-u1-l1', test.right_lesson('c1-u1-l1'), test.uuid(11)) as r2 \gset
select test.ok(not (:'r2'::jsonb ->> 'firstCompletion')::boolean, 'replay is not a first completion');
select test.ok((select count(*) from public.xp_events where source_key like 'lesson%') = 2, 'replaying a lesson cannot farm lesson XP');
select test.ok((select completions from public.lesson_progress where lesson_id = 'c1-u1-l1') = 2, 'replays are counted');
select test.ok((:'r2'::jsonb ->> 'goalMetNow')::boolean, 'second activity meets the default daily goal of 2');
select test.ok((select current from public.streaks) = 1, 'streak starts at 1');

-- Trusted tables cannot be written directly.
select test.expect_error($$insert into public.xp_events (user_id, source_key, amount, label, day) values (auth.uid(), 'hack', 1000, 'hack', current_date)$$, '42501', 'cannot insert XP directly');
select test.expect_error($$update public.lesson_progress set completions = 100$$, '42501', 'cannot edit lesson progress');
select test.expect_error($$insert into public.certificates (id, user_id, course_id, recipient_name, score, attempt_id) values ('VF-AAAA-AAAA', auth.uid(), 'c1', 'x', 1, gen_random_uuid())$$, '42501', 'cannot forge a certificate');
select test.expect_error($$update public.streaks set current = 999$$, '42501', 'cannot edit streaks');
select test.expect_error($$select * from veleta_private.questions$$, '42501', 'cannot read answer keys');
select test.expect_error($$select veleta_private.award_xp(auth.uid(), 'x', 500, 'x', current_date)$$, '42501', 'cannot call internal functions');
select test.expect_error($$update public.profiles set id = gen_random_uuid()$$, '42501', 'cannot change profile id');
update public.profiles set bio = 'Hello' where id = auth.uid();
select test.ok((select bio from public.profiles) = 'Hello', 'can edit own bio');
update public.profiles set bio = 'Hacked' where id = 'b0000000-0000-4000-8000-000000000002';
select test.ok(true, 'update of another profile affects no rows (checked as Bob below)');

-- Revision: XP capped at 3 sessions a day; only completed lessons allowed.
select public.submit_revision(jsonb_build_object('c1-u1-l1.q1', (select answer from test.keys where id = 'c1-u1-l1.q1')), test.uuid(20 + g)) from generate_series(1, 5) g;
select test.ok((select count(*) from public.xp_events where source_key like 'revision:%') = 3, 'revision XP capped at 3 sessions per day');
select test.ok((select revision_sessions from public.learner_counters) = 5, 'all revision sessions counted');
select test.expect_error($$select public.submit_revision(jsonb_build_object('c1-u2-l1.q1', 0), test.uuid(30))$$, 'VL004', 'cannot revise an unfinished lesson');
select test.expect_error($$select public.submit_revision(jsonb_build_object('c1-exam.e1', 0), test.uuid(31))$$, 'VL002', 'cannot revise exam questions');

-- Complete course 1.
do $$
declare lid text; r jsonb; n int := 100; cp text;
begin
  for lid in select distinct lesson_id from test.keys where lesson_id like 'c1-%' order by 1 loop
    n := n + 1;
    if lid = 'c1-u2-l1' then
      r := public.submit_assessment('c1-u1-cp', test.right_assessment('c1-u1-cp'), test.uuid(n)); n := n + 1;
      perform test.ok((r ->> 'passed')::boolean and r -> 'results' is not null and r -> 'results' <> 'null'::jsonb, 'checkpoint 1 passed with per-question results');
    elsif lid = 'c1-u3-l1' then
      r := public.submit_assessment('c1-u2-cp', test.right_assessment('c1-u2-cp'), test.uuid(n)); n := n + 1;
    end if;
    perform public.submit_lesson(lid, test.right_lesson(lid), test.uuid(n));
  end loop;
end $$;
select test.ok((select count(*) from public.lesson_progress) = 11, 'all eleven course 1 lessons complete');
select test.expect_error($$select public.submit_assessment('c1-exam', test.right_assessment('c1-exam'), test.uuid(300))$$, 'VL001', 'exam locked until all checkpoints passed');
select public.submit_assessment('c1-u3-cp', test.right_assessment('c1-u3-cp'), test.uuid(301)) as cp3 \gset
select test.ok((:'cp3'::jsonb ->> 'passed')::boolean, 'final checkpoint passed');

select public.submit_assessment('c1-exam', test.wrong_assessment('c1-exam', 4), test.uuid(302)) as fail \gset
select test.ok(not (:'fail'::jsonb ->> 'passed')::boolean, 'exam with 4 wrong answers fails (pass mark 80%)');
select test.ok(:'fail'::jsonb -> 'results' = 'null'::jsonb, 'failed exam does not reveal per-question answers');
select test.ok(jsonb_array_length(:'fail'::jsonb -> 'missedConcepts') > 0, 'failed exam lists concepts to revise');
select test.ok(:'fail'::jsonb -> 'certificateId' = 'null'::jsonb, 'no certificate after failing');
select test.ok((select count(*) from public.certificates) = 0, 'no certificate row after failing');

select public.submit_assessment('c1-exam', test.right_assessment('c1-exam'), test.uuid(303)) as pass \gset
select test.ok((:'pass'::jsonb ->> 'passed')::boolean and (:'pass'::jsonb ->> 'courseCompleted')::boolean, 'retake passes and completes the course');
select test.ok((:'pass'::jsonb ->> 'certificateId') ~ '^VF-[A-Z0-9]{4}-[A-Z0-9]{4}$', 'certificate id issued');
select test.ok((select count(*) from public.assessment_attempts where assessment_id = 'c1-exam') = 2, 'failed and passed attempts both recorded');
select public.submit_assessment('c1-exam', test.right_assessment('c1-exam'), test.uuid(304)) as again \gset
select test.ok((:'again'::jsonb ->> 'certificateId') = (:'pass'::jsonb ->> 'certificateId'), 'retaking after passing returns the same certificate');
select test.ok((select count(*) from public.certificates) = 1, 'exactly one certificate per course');
select test.ok((select count(*) from public.xp_events where source_key = 'exam:c1-exam') = 1, 'exam XP awarded once');
select test.ok((select count(*) from public.user_achievements where achievement_id in ('first_course', 'foundations', 'ten_lessons')) = 3, 'course achievements unlocked');

select public.get_my_state() as st \gset
select test.ok((:'st'::jsonb -> 'xp' ->> 'total')::int = (select sum(amount) from public.xp_events), 'state XP equals ledger');
select test.ok(jsonb_array_length(:'st'::jsonb -> 'missions') = 6, 'six missions (3 daily, 3 weekly)');
select test.ok((:'st'::jsonb -> 'assessments' -> 'c1-exam' ->> 'attempts')::int = 3, 'state aggregates attempts');
select test.ok(not (:'st'::jsonb ? 'email'), 'state does not include email');

-- ======================================================= as Bob ========
select test.login('b0000000-0000-4000-8000-000000000002');
select test.ok((select bio from public.profiles where id = auth.uid()) = '', 'Alice could not edit Bob''s profile');
select test.ok((select count(*) from public.xp_events) = 0, 'Bob cannot see Alice''s XP');
select test.ok((select count(*) from public.profiles) = 1, 'Bob only sees his own profile row');
select test.ok((select count(*) from public.certificates) = 0, 'Bob cannot see Alice''s certificates');
select test.ok(public.get_public_profile('alice') is null, 'private profile hidden from Bob');
select test.ok((select count(*) from public.search_users('ali')) = 0, 'private profile not found by prefix');
select test.ok((select count(*) from public.search_users('alice')) = 1, 'private profile found by exact username');
select test.ok(public.send_friend_request('alice') = 'requested', 'Bob sends a friend request');
select test.ok(public.send_friend_request('alice') = 'already_requested', 'duplicate request is a no-op');
select test.expect_error($$select public.send_friend_request('bob')$$, 'VL002', 'cannot friend yourself');
select test.ok((select count(*) from public.friend_leaderboard('week')) = 1, 'pending request not on leaderboard');

-- ======================================================= as Carol ======
select test.login('c0000000-0000-4000-8000-000000000003');
select test.expect_error($$select public.respond_friend_request((select friendship_id from public.list_friends() limit 1), true)$$, 'VL003', 'Carol cannot see or answer others'' requests');
select test.ok((select count(*) from public.friendships) = 0, 'Carol cannot see the friendship row');

-- ======================================================= as Alice ======
select test.login('a0000000-0000-4000-8000-000000000001');
select test.ok((select status from public.list_friends()) = 'incoming', 'Alice sees an incoming request');
select public.respond_friend_request((select friendship_id from public.list_friends()), true);
select test.ok((select count(*) from public.friend_leaderboard('week')) = 2, 'leaderboard shows Alice and Bob');
select test.ok((select xp from public.friend_leaderboard('all') where is_me) = (select sum(amount) from public.xp_events), 'leaderboard XP matches ledger');
select test.ok((select count(*) from public.user_achievements where achievement_id = 'first_friend') = 1, 'friend achievement unlocked');
update public.profiles set is_public = true where id = auth.uid();

-- ======================================================= as anonymous ==
reset role;
select test.login(null);
set role anon;
select public.get_public_profile('alice') as pub \gset
select test.ok((:'pub'::jsonb ->> 'displayName') = 'Alice', 'public profile visible to visitors');
select test.ok(not (:'pub'::jsonb ? 'email') and not (:'pub'::jsonb ? 'interests'), 'public profile exposes no private fields');
select public.verify_certificate(:'pass'::jsonb ->> 'certificateId') as ver \gset
select test.ok((:'ver'::jsonb ->> 'status') = 'valid' and (:'ver'::jsonb ->> 'recipientName') = 'Alice', 'certificate verifies publicly');
select test.ok(public.verify_certificate('VF-ZZZZ-ZZZZ') is null, 'unknown certificate does not verify');
select test.expect_error($$select public.submit_lesson('c1-u1-l1', '{}'::jsonb, gen_random_uuid())$$, '42501', 'anonymous visitors cannot submit');
select test.expect_error($$select * from public.profiles$$, '42501', 'anonymous visitors cannot read tables');

-- ============================================== streak rules (as owner) ==
reset role;
do $$
declare d uuid := 'd0000000-0000-4000-8000-000000000004'; r jsonb;
begin
  update public.preferences set daily_goal = 1 where user_id = d;
  r := veleta_private.record_activity(d, '2026-03-01');
  perform test.ok((r ->> 'goalMetNow')::boolean, 'goal met on day 1');
  r := veleta_private.record_activity(d, '2026-03-01');
  perform test.ok(not (r ->> 'goalMetNow')::boolean, 'second activity same day does not re-count');
  r := veleta_private.record_activity(d, '2026-03-03');
  perform test.ok((r ->> 'freezesUsed')::int = 1 and (select current from public.streaks where user_id = d) = 2, 'one missed day uses a freeze and keeps the streak');
  perform test.ok((select count(*) from public.streak_freeze_usage where user_id = d) = 1, 'freeze usage recorded once');
  r := veleta_private.record_activity(d, '2026-03-06');
  perform test.ok((select current from public.streaks where user_id = d) = 1, 'two missed days without freezes reset the streak');
  perform test.ok((select longest from public.streaks where user_id = d) = 2, 'longest streak kept');
  for i in 7..13 loop perform veleta_private.record_activity(d, ('2026-03-' || lpad(i::text, 2, '0'))::date); end loop;
  perform test.ok((select current from public.streaks where user_id = d) = 8 and (select freezes from public.streaks where user_id = d) = 1, 'a freeze is earned at 7 days');
end $$;

-- =========================================================== deletion ==
set role authenticated;
select test.login('b0000000-0000-4000-8000-000000000002');
select public.delete_my_account();
reset role;
select test.ok(not exists (select 1 from public.profiles where id = 'b0000000-0000-4000-8000-000000000002'), 'account deletion removes the profile');
select test.ok(not exists (select 1 from public.friendships), 'account deletion removes friendships');
select test.ok(not exists (select 1 from auth.users where id = 'b0000000-0000-4000-8000-000000000002'), 'account deletion removes the auth user');
\echo 'All SQL tests passed.'
