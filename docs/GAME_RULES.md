# Game rules

All numbers live in `src/engine/rewards.ts` and are mirrored into the database by `npm run content:sql`.

## XP
| Action | XP | Rule |
|---|---|---|
| Complete a lesson for the first time | 20 | once per lesson (`lesson:<id>`) |
| …with every question right first time | +5 | once per lesson |
| Pass a unit checkpoint | 40 | once per checkpoint |
| Pass a final exam | 100 | once per course |
| Revision session | 10 | first 3 sessions per learning day |
| Daily mission | 15 | once per mission per day |
| Weekly mission | 50 | once per mission per week |

Replaying lessons, retaking passed assessments, refreshing, or repeating a request never re-awards XP (unique `source_key` + idempotent attempt ids).

## Levels
Level L→L+1 costs `100 + 50 × (L − 1)` XP (level 2 at 100, 3 at 250, 4 at 450 …), up to level 100 (about 250,000 XP in total). 24 named ranks, from Curious Saver (1), Budget Builder (3) and Coin Collector (5) through Company Analyst (17), Market Strategist (36), Macro Thinker (50) and Capital Allocator (72) to Veleta Legend (92) and Veleta Grandmaster (100). The full list is `LEVEL_NAMES` in `src/engine/rewards.ts`.

## Daily goal and streaks
- An **activity** is a completed lesson (including replays), revision session or assessment submission. Goals: 1, 2, 3 or 5 activities.
- The **learning day** is the calendar day in the learner’s time zone, computed by the server.
- Meeting the goal on consecutive days extends the streak; extra activities the same day don’t.
- Missed days are covered by **streak freezes**, one per missed day, if enough are held; otherwise the streak restarts at 1. Each missed day can consume at most one freeze (unique per day).
- Learners start with 1 freeze and earn 1 every 7 streak days, holding at most 2. No paid currency exists.

## Progression
- All courses are open. Within a course, lessons unlock in order; a unit’s first lesson needs the previous unit’s checkpoint; a checkpoint needs its unit’s lessons; the final exam needs every checkpoint.
- Checkpoint pass mark 70%, exam pass mark 80% (per-course `passMark`). Unlimited retakes; all attempts are recorded.
- **Course completion and certificate** require all lessons, all checkpoints and a passed final exam; the server issues one active certificate per learner per course.

## Mastery and revision (Leitner)
- Each lesson question has a box 0–5. First correct → box 1; correct later → +1 box, **at most once per day**; wrong → −2 boxes.
- Review intervals by box: 0, 1, 3, 7, 14, 30 days.
- Revision sessions (up to 8 questions) take missed questions first, then due ones, then the weakest.
- Course/concept mastery = average box weight (0, 40, 60, 75, 90, 100%) across **all** its lesson questions, unseen counting as 0. Labels: Started, Learned (40%+), Strong (70%+), Mastered (90%+).

## Missions
Every day brings three **daily missions** (15 XP each) and every Monday three **weekly goals** (50 XP each). They are picked from 36 mission templates (`MISSION_TEMPLATES` in `src/engine/missions.ts`):
- Daily sets cycle every **14 days**. Each starts with an easy mission anyone can finish (complete a lesson, do 2 activities, meet your daily goal), followed by two different kinds of challenge.
- Weekly sets cycle every **8 weeks**, mixing volume (5–12 lessons, 10 activities), consistency (goal met on 3, 5 or 7 days), revision, checkpoints, accuracy and XP targets.
- Mission types: lessons completed, **new** lessons (first completions only), revision sessions, correct first-time answers, perfect lessons, checkpoints passed, daily goal met, activities (lessons, revision or assessments) and XP earned. XP paid out by missions does not count towards XP missions.
- Missions are chosen from the date, so they never reshuffle during a day or week.

## Achievements
Achievements are data: `ACHIEVEMENTS` in `src/engine/achievements.ts` defines each one as a metric plus a threshold (for example `lessons ≥ 50` or `streak ≥ 30`), with a category and a tier (bronze, silver, gold, platinum). `npm run content:sql` copies the definitions into `veleta_private.achievements`, and the server function `evaluate_achievements` unlocks any whose threshold is met, so the browser and database always agree.

Series include lessons completed, perfect lessons, streak length, daily goals met, revision sessions, correct answers, mastered questions, checkpoints passed and aced, courses completed, total XP, levels reached, missions completed and friends, plus a “started” and a “completed” badge for every course. Adding a course adds its badges automatically.

## Leaderboards
Friends-only: you plus accepted friends who allow it. **This week** = XP since Monday 00:00 UTC; **All time** = total XP. Only display name, username, avatar and XP are shown.
