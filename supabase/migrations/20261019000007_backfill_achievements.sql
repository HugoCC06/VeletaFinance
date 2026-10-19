-- Award achievements already earned by existing learners. Achievements are
-- otherwise only checked when a learner finishes something, so progress made
-- before an achievement existed would stay locked until their next activity.
-- Safe to re-run: evaluate_achievements only inserts missing rows.
do $$
declare p record;
begin
  for p in select id from public.profiles loop
    perform veleta_private.evaluate_achievements(p.id);
  end loop;
end $$;
