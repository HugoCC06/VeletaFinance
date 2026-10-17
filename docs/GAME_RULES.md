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
Level L→L+1 costs `100 + 50 × (L − 1)` XP (level 2 at 100, 3 at 250, 4 at 450 …), up to level 60. Names: Curious Saver (1), Budget Builder (3), Market Explorer (5), Portfolio Apprentice (8), Company Analyst (12), Value Seeker (16), Market Strategist (21), Long-Term Thinker (28), Veleta Sage (36).

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
Three daily missions (always “Complete 2 lessons” plus two rotating from: revision session, 15 correct first-time answers, a perfect lesson) and three weekly missions (8 lessons, goal met on 5 days, plus 4 revision sessions or a checkpoint pass), chosen deterministically from the date so they never reshuffle mid-day.

## Achievements
First Lesson, First Perfect Quiz, Getting Serious (10 lessons), Half-Century (50), Seven-Day Streak, Thirty-Day Streak, Consistent Learner (goal met on 14 days), Checkpoint Ace, Revision Champion (10 sessions), First Course Completed, Financial Foundations Mastered, Company Analyst, Portfolio Builder, Valuation Explorer, Veleta Graduate (all 8), Study Buddy (first friend).

## Leaderboards
Friends-only: you plus accepted friends who allow it. **This week** = XP since Monday 00:00 UTC; **All time** = total XP. Only display name, username, avatar and XP are shown.
