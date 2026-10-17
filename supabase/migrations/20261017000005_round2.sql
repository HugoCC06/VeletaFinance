-- Veleta Finance — round 2: data-driven achievements, level cap 100, extra counters.
-- Safe to re-run. Existing projects: apply via supabase/update.sql.

create table if not exists veleta_private.achievements (
  id text primary key,
  metric text not null,
  threshold numeric not null check (threshold > 0),
  course_id text
);
revoke all on veleta_private.achievements from public;

-- Computes every metric once, then unlocks each achievement whose metric reaches
-- its threshold. Mirrors metricValue() in src/engine/achievements.ts.
create or replace function veleta_private.evaluate_achievements(uid uuid) returns void
language plpgsql set search_path = '' as $$
declare m jsonb;
begin
  select jsonb_build_object(
    'lessons', (select count(*) from public.lesson_progress where user_id = uid),
    'perfect_lessons', coalesce((select perfect_lessons from public.learner_counters where user_id = uid), 0),
    'streak', coalesce((select longest from public.streaks where user_id = uid), 0),
    'goal_days', (select count(*) from public.daily_activity where user_id = uid and goal_met),
    'revisions', coalesce((select revision_sessions from public.learner_counters where user_id = uid), 0),
    'friends', (select count(*) from public.friendships where status = 'accepted' and uid in (requester, addressee)),
    'perfect_checkpoints', coalesce((select perfect_checkpoints from public.learner_counters where user_id = uid), 0),
    'checkpoints', (select count(distinct at.assessment_id) from public.assessment_attempts at
                    join veleta_private.assessments a on a.id = at.assessment_id
                    where at.user_id = uid and at.passed and a.kind = 'checkpoint'),
    'courses', (select count(*) from public.certificates where user_id = uid and not revoked),
    'xp', coalesce((select sum(amount) from public.xp_events where user_id = uid), 0),
    'missions', (select count(*) from public.xp_events where user_id = uid and source_key like 'mission:%'),
    'correct', coalesce((select sum(correct) from public.question_stats where user_id = uid), 0),
    'mastered', (select count(*) from public.question_stats where user_id = uid and box >= 5)
  ) into m;

  insert into public.user_achievements (user_id, achievement_id)
  select uid, a.id
  from veleta_private.achievements a
  where case
          when a.metric = 'course' then
            (exists (select 1 from public.certificates c where c.user_id = uid and c.course_id = a.course_id and not c.revoked))::int
          when a.metric = 'course_lessons' then
            (select count(*) from public.lesson_progress lp join veleta_private.lessons l on l.id = lp.lesson_id
             where lp.user_id = uid and l.course_id = a.course_id)
          else coalesce((m ->> a.metric)::numeric, 0)
        end >= a.threshold
  on conflict do nothing;
end $$;

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
      'friends', (select count(*) from public.friendships where status = 'accepted' and uid in (requester, addressee)),
      'perfectLessons', coalesce((select perfect_lessons from public.learner_counters where user_id = uid), 0),
      'perfectCheckpoints', coalesce((select perfect_checkpoints from public.learner_counters where user_id = uid), 0),
      'missions', (select count(*) from public.xp_events where user_id = uid and source_key like 'mission:%'))
  );
end $$;

create or replace function public.get_public_profile(p_username text) returns jsonb
language plpgsql security definer stable set search_path = '' as $$
declare p public.profiles; v_xp bigint; v_level int := 1; v_me boolean;
begin
  select * into p from public.profiles where username = lower(btrim(p_username));
  if not found then return null; end if;
  v_me := p.id = auth.uid();
  if not p.is_public and not v_me then return null; end if;
  select coalesce(sum(amount), 0) into v_xp from public.xp_events where user_id = p.id;
  -- level = largest L with 100(L-1) + 25(L-1)(L-2) <= xp, capped at 100 (mirrors src/engine/rewards.ts)
  while v_level < 100 and v_xp >= 100 * v_level + 25 * v_level * (v_level - 1) loop
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

revoke execute on function veleta_private.evaluate_achievements(uuid) from public, anon, authenticated;
grant execute on function public.get_my_state() to authenticated;
grant execute on function public.get_public_profile(text) to anon, authenticated;
