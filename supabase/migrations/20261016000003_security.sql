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
