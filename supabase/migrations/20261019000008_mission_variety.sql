-- Veleta Finance — more varied missions. Safe to re-run.
-- Rotations now cycle through however many sets the content seed defines, and
-- three new mission metrics are tracked with triggers so the submit functions
-- stay unchanged. Mirrors src/engine/missions.ts and Tx in src/backend/rules.ts.

create or replace function veleta_private.current_missions(p_day date)
returns table (mission_key text, template_id text, period text, metric text, target int, title text)
language sql stable set search_path = '' as $$
  with n as (
    select greatest(1, count(*) filter (where period = 'daily'))::int as nd,
           greatest(1, count(*) filter (where period = 'weekly'))::int as nw
    from veleta_private.mission_rotation
  ), idx as (
    select ((p_day - date '2024-01-01') % n.nd + n.nd) % n.nd as d,
           (((veleta_private.week_start(p_day) - date '2024-01-01') / 7) % n.nw + n.nw) % n.nw as w
    from n
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

-- xp: XP earned, except XP paid out by missions themselves.
create or replace function veleta_private.missions_on_xp() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.source_key not like 'mission:%' then
    perform veleta_private.mission_event(new.user_id, new.day, 'xp', new.amount);
  end if;
  return null;
end $$;
create or replace trigger missions_on_xp after insert on public.xp_events
  for each row execute function veleta_private.missions_on_xp();

-- activities: lessons, revision sessions and assessments counted for the day.
create or replace function veleta_private.missions_on_activity() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_inc int := new.activities - (case when tg_op = 'UPDATE' then old.activities else 0 end);
begin
  if v_inc > 0 then
    perform veleta_private.mission_event(new.user_id, new.day, 'activities', v_inc);
  end if;
  return null;
end $$;
create or replace trigger missions_on_activity after insert or update of activities on public.daily_activity
  for each row execute function veleta_private.missions_on_activity();

-- new_lessons: a lesson completed for the first time.
create or replace function veleta_private.missions_on_new_lesson() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform veleta_private.mission_event(new.user_id, veleta_private.user_today(new.user_id), 'new_lessons', 1);
  return null;
end $$;
create or replace trigger missions_on_new_lesson after insert on public.lesson_progress
  for each row execute function veleta_private.missions_on_new_lesson();

revoke execute on function veleta_private.missions_on_xp() from public, anon, authenticated;
revoke execute on function veleta_private.missions_on_activity() from public, anon, authenticated;
revoke execute on function veleta_private.missions_on_new_lesson() from public, anon, authenticated;
