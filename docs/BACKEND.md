# Backend: selection and setup

## Options considered

| Requirement | Supabase | Firebase (Auth + Firestore + Functions) |
|---|---|---|
| Authentication (email/password, confirmation, reset) | Built in | Built in |
| Relational data (lessons ↔ attempts ↔ certificates, friendships, leaderboards) | Postgres: joins, constraints, transactions | Document store: denormalisation and manual consistency |
| Access control | Row-level security policies in SQL | Security rules (expressive, but logic for multi-document invariants is harder) |
| Trusted server logic | SQL functions in the database (no extra service); Edge Functions if needed | Cloud Functions (Blaze pay-as-you-go plan required for deployment) |
| Idempotent rewards | `UNIQUE (user_id, source_key)` + transactions | Transactions/batched writes per document |
| Certificate issuance & public verification | Function + partial unique index; anon-callable verify RPC | Function + rules |
| Leaderboards for friends | One SQL query | Fan-out or aggregation documents |
| GitHub Pages compatibility | JS client, PKCE redirects to any URL | JS client |
| Portability | Standard Postgres; migrations are plain SQL | Proprietary data model |
| Local testing | Plain PostgreSQL (used by `npm run test:sql`) | Emulator suite |

**Choice: Supabase.** Veleta’s core invariants — XP awarded once, certificates only after all requirements, friendship-scoped leaderboards, privacy-respecting public profiles — are relational and transactional. Postgres expresses them as constraints, RLS and functions that run atomically, with no separate server to deploy, and the schema is portable.

### Free-tier note
Plans change. At the time of writing, third-party summaries of Supabase’s free plan describe roughly 500 MB of database per project, 50,000 monthly active users, two active free projects, and **pausing of free projects after about a week of inactivity**. No free tier is unlimited. Check the current limits at https://supabase.com/pricing before launch; a paused project makes the site fall back to error states (not demo mode) until it is restored.

## Schema (summary)

`supabase/migrations/`:

1. `…01_schema.sql` — tables. Learner tables in `public`: `profiles`, `preferences`, `lesson_progress`, `assessment_attempts`, `question_stats`, `xp_events`, `daily_activity`, `streaks`, `streak_freeze_usage`, `user_achievements`, `mission_progress`, `learner_counters`, `certificates`, `friendships`. Private schema `veleta_private`: curriculum keys (`courses`, `units`, `lessons`, `assessments`, `questions`), `config` (XP), mission templates/rotation, `attempt_answers`, `processed_requests` (idempotency), `rate_events`.
2. `…02_functions.sql` — grading, Leitner updates, XP, missions, streaks, achievements, unlock rules, the RPCs, social functions, certificate verification, account deletion and the new-user trigger.
3. `…03_security.sql` — RLS on every table, least-privilege grants (read own rows; update only safe profile/preference columns), function execute grants.
4. `…04_content_seed.sql` — **generated** by `npm run content:sql`; upserts curriculum keys and game config.

### RPCs exposed to the browser

| Function | Who | Purpose |
|---|---|---|
| `get_my_state()` | authenticated | Everything the app needs for the signed-in learner |
| `submit_lesson(lesson_id, answers, attempt_id)` | authenticated | Grade, record, award |
| `submit_assessment(assessment_id, answers, attempt_id)` | authenticated | Grade checkpoint/exam, issue certificate |
| `submit_revision(answers, attempt_id)` | authenticated | Spaced-revision session |
| `is_username_available`, `search_users`, `send_friend_request`, `respond_friend_request`, `remove_friend`, `list_friends`, `friend_leaderboard` | authenticated | Social |
| `delete_my_account()` | authenticated | Deletes the auth user; cascades remove all learner data |
| `get_public_profile(username)` | anon + authenticated | Public fields only, and only if public (or owner) |
| `verify_certificate(id)` | anon + authenticated | Public verification fields |

### Data retained after deletion
None in Veleta’s tables: every learner row references `profiles` with `ON DELETE CASCADE`, and certificates are deleted too (their IDs stop verifying, which the privacy notice explains). Supabase’s platform backups may retain data for their documented retention period.

## Setup steps

1. **Create a project** at https://supabase.com (choose a region near your learners).
2. **Apply migrations** in filename order:
   - CLI: `npm i -g supabase` (or use `npx supabase`), `supabase login`, `supabase link --project-ref <ref>`, `supabase db push`.
   - Or Dashboard → SQL Editor: paste and run each file in order.
3. **Auth settings** (Dashboard → Authentication):
   - URL configuration → Site URL: `https://<user>.github.io/<repo>/` (or your custom domain, with trailing slash).
   - Redirect URLs: the same URL, plus `http://localhost:5173/<repo>/` for development. The app redirects to `<site>?next=onboarding` and `<site>?next=reset-password`, which match the base URL.
   - Providers → Email: enabled; “Confirm email” on (recommended). Customise email templates if you like.
   - Rate limits: defaults are fine; consider enabling CAPTCHA before a public launch.
4. **Keys**: Project Settings → API → copy the Project URL and the anon/publishable key into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (locally in `.env.local`, in GitHub as repository variables). Do not use the service-role key anywhere in the app.
5. **Verify security**: in the SQL editor run `select tablename, rowsecurity from pg_tables where schemaname = 'public';` — every row should show `true`. Optionally run the SQL suite against a scratch project.
6. **Content updates**: after editing `src/content`, run `npm run content:sql`, commit, and apply the regenerated seed (safe to re-run).
7. **Manual smoke test** after deploying: sign up (confirm the email), complete onboarding and a lesson, refresh on another device to see progress, send a friend request between two accounts, toggle profile visibility, and verify a certificate URL in a private window.
