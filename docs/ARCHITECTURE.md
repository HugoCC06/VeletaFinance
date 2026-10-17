# Architecture and key decisions

## Overview

```
Browser (React SPA on GitHub Pages)
 ├─ content/  ──────────────► lesson text, questions, answer keys (typed TS)
 ├─ engine/   ──────────────► pure rules (grading, XP, streaks, mastery, missions, achievements, unlocks)
 ├─ backend/Backend interface
 │    ├─ SupabaseBackend ───► Supabase Auth + Postgres RPCs (trusted)
 │    └─ LocalBackend ──────► demo mode: rules.ts on localStorage
 └─ UI (pages, learning players, charts, tools)

Supabase (Postgres)
 ├─ public.* learner tables (RLS: read own rows only)
 ├─ veleta_private.* answer keys, config, idempotency, rate limits (no client access)
 └─ SECURITY DEFINER functions: submit_lesson / submit_assessment / submit_revision / social / certificates
```

## Decisions

| Decision | Alternatives | Choice and rationale |
|---|---|---|
| Routing | History routing + 404 redirect trick | **Hash routing.** GitHub Pages can’t rewrite paths; hash URLs make every deep link and refresh work with no hacks. SEO is handled by generated static course pages. |
| Content storage | CMS, database, MDX | **Typed TypeScript modules** with small builder helpers. Content is reviewed in code, validated by tests, versioned with git, and the server’s answer keys are generated from the same source (`npm run content:sql`). |
| Backend | Firebase, custom API | **Supabase** — see [BACKEND.md](BACKEND.md). |
| Trusted logic | Edge functions | **Postgres SECURITY DEFINER functions.** Grading, XP, streaks, missions, achievements and certificates run in one transaction next to the data, with unique constraints providing idempotency. No extra runtime to deploy. |
| Demo mode | Require a backend | **LocalBackend** implementing the same interface and rules, so the deployed site is usable (and testable) before a backend exists. Clearly bannered; certificates are marked DEMO. |
| Charts | Recharts/Chart.js | **Custom SVG**: ~10 KB, accessible (keyboard inspection, data tables), consistent styling. |
| State | Redux/React Query | **One React context** holding the server state snapshot (`get_my_state`), refreshed after each submission. The app’s data needs are simple and mostly server-computed. |

## Data flow for a lesson

1. The player shows steps; answers are graded locally for instant feedback. Missed questions are re-queued.
2. A draft (position, first answers, attempt id) is saved to localStorage after each step.
3. On completion the **first-attempt answers** and a random **attempt id** are sent to `submit_lesson`.
4. The server re-checks the lesson is unlocked, grades every answer against its own keys, updates mastery, awards XP via `xp_events` (unique per `source_key`), records the activity for streaks, advances missions, evaluates achievements, stores the result under the attempt id and returns it.
5. A repeated request with the same attempt id returns the stored result. If the network fails, the submission is queued locally and retried later — safe because of idempotency.

## Assessment integrity

- Certificates are created **only** inside `submit_assessment`, after the server grades a passing exam and re-checks that every lesson is complete and every checkpoint passed. The client cannot insert or update certificates, XP, attempts or progress (no grants; RLS read-only; covered by SQL tests).
- Exam results return only the score and missed concepts, not per-question correctness, to reduce answer harvesting. Assessment submissions are rate-limited (30/hour).
- **Known limitation:** answer keys are present in the client bundle (needed for instant lesson feedback). Moving exam questions behind an RPC that strips answers would close this gap: the generated `veleta_private.questions` table already holds every key, so the remaining work is a `get_exam_questions` RPC plus excluding exam keys from the browser build.

## Time and streaks

The learning day is computed **on the server** from `now()` in the learner’s stored IANA time zone (validated against `pg_timezone_names`), so a changed device clock can’t extend a streak. Date maths uses calendar days, which is safe across daylight-saving changes. In demo mode the browser clock is used (documented limitation).

## What is and isn’t tested

| Area | How |
|---|---|
| Engine rules, formulas, content structure, parsers, client/server config sync | Vitest (`npm test`) |
| Schema, RLS, grants, trusted functions, idempotency, streak freezes, friends, privacy, deletion | SQL suite on real PostgreSQL 16 with a Supabase auth stub (`npm run test:sql`) |
| Journeys A–E through the real UI | Playwright against the production build in demo mode (`npm run test:e2e`) |
| Supabase Auth emails, PostgREST transport, hosted project config | **Not automated** — requires a real Supabase project. Follow the manual checks in [DEPLOYMENT.md](DEPLOYMENT.md). |
