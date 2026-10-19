# Veleta Finance

**Make finance simple.** Veleta is a free, Duolingo-style learning app for investing and financial markets: short interactive lessons, instant feedback, XP, streaks, spaced revision, final exams and verifiable course certificates.

It is a static React app deployed to **GitHub Pages**, with an optional **Supabase** backend for accounts, synchronised progress, friends and verifiable certificates. Without Supabase credentials it runs in a clearly labelled **demo mode** that stores everything in the browser.

> Veleta provides general financial education, not personalised financial, investment, tax or legal advice.

---

## Contents

- [Features](#features)
- [Curriculum](#curriculum)
- [Technology](#technology)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Backend setup (Supabase)](#backend-setup-supabase)
- [Testing](#testing)
- [Deployment to GitHub Pages](#deployment-to-github-pages)
- [Project structure](#project-structure)
- [Known limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)
- Further docs: [Architecture & decisions](docs/ARCHITECTURE.md) · [Backend](docs/BACKEND.md) · [Game rules](docs/GAME_RULES.md) · [Content & sources](docs/CONTENT.md) · [Data](docs/DATA.md) · [Deployment checklist](docs/DEPLOYMENT.md)

## Features

**Learning**
- 8 courses, 24 units, 84 lessons and 531 questions (see [Curriculum](#curriculum)).
- Lesson player with explanations, callouts, diagrams, interactive charts, worked numbers and six question types: multiple choice, true/false, multi-select, numeric calculation, matching and ordering — plus scenario and final-challenge questions.
- Instant feedback explaining *why*, the correct answer and calculation working. Missed questions return later in the lesson. No hearts or energy — retry freely.
- Lesson progress is saved on the device and resumed after a refresh; completed lessons can be revisited at any time.
- Unit checkpoints (70%) and course final exams (80%, configurable per course) with unlimited retakes. Checkpoints show a full answer review; exams show only the topics to revise.
- Spaced revision (Leitner boxes) with a revision queue, weak-concept list and per-course mastery.

**Gamification**
- XP from a central config, idempotent and recorded server-side; replays and duplicate requests can’t farm XP.
- 100 levels with 24 named ranks; daily goals; streaks evaluated in the learner’s time zone; earned streak freezes.
- 120+ achievements across six categories (learning, streaks, mastery, courses, milestones, social) in bronze, silver, gold and platinum tiers; 3 daily missions and 3 weekly goals drawn from 33 mission types, rotating over 14 days and 8 weeks.
- Friends (search by username, requests, accept/decline/remove) and friends-only weekly/all-time leaderboards (online mode).

**Accounts & privacy**
- Email/password sign-up, sign-in, sign-out, email confirmation and password reset (Supabase Auth, PKCE).
- Onboarding: profile, avatar, experience, interests, market, daily goal, intensity and an optional placement check that recommends a course.
- Profiles are private by default; public profiles expose only public fields. Account deletion removes all learner data.

**Certificates**
- Issued only by the backend after all lessons, all checkpoints and the final exam are complete.
- Professional on-screen certificate, downloadable A4 PDF, public verification page, and an “Add to LinkedIn” link. Clearly marked as non-accredited.

**Practical tools & data**
- Compound interest, inflation/real return, stock return, dividend, company valuation (multiples + DCF with sensitivity table) and portfolio diversification tools. Formulas are unit-tested and explained on each page.
- Interactive line and candlestick charts with keyboard inspection and data-table alternatives. All bundled datasets are **synthetic or illustrative and labelled as such** — see [Data](docs/DATA.md).
- Qualitative case studies of Apple, Microsoft, Coca-Cola, Tesco and Unilever with links to primary sources (no invented figures).

**Quality**
- Responsive from 320px phones to desktop, keyboard accessible, visible focus, reduced-motion support, screen-reader progress text, never colour-only state.
- Build-time SEO pages for every course, sitemap, robots, Open Graph image; learner pages are `noindex`.

## Curriculum

| # | Course | Units | Lessons |
|---|--------|-------|---------|
| 1 | Investing Fundamentals | Why invest? · Risk and return · The investor’s toolkit | 11 |
| 2 | Understanding Stocks and Stock Markets | Owning a piece of a company · Prices and orders · Market life | 11 |
| 3 | Company Financial Analysis | How businesses make money · Balance sheets, cash and debt · Judging quality | 9 |
| 4 | ETFs, Index Funds and Portfolio Construction | Funds and trackers · Building a portfolio · Managing a portfolio | 10 |
| 5 | Valuation and Company Analysis | Multiples · Cash flow valuation · Valuation in practice | 12 |
| 6 | Bonds, Interest Rates and Macroeconomics | Bonds · The economy and central banks · Markets and macro | 11 |
| 7 | Dividends and Long-Term Wealth Building | Dividend basics · Sustainable income · Building wealth for the long term | 9 |
| 8 | Trading, Technical Analysis and Investor Psychology | Charts and indicators · Investor psychology · Managing risk | 11 |

Every unit has a 6-question checkpoint and every course a 15-question final exam. Full lesson list: the in-app Curriculum page or `src/content/courses/`.

## Technology

| Concern | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript (strict) | Typed, component-based, widely known |
| Build | Vite 8 | Fast builds, code splitting, simple static output |
| Routing | React Router 7, **hash routing** | Deep links and refreshes work on GitHub Pages with no server rewrites |
| Backend | Supabase (Postgres, Auth, RLS, SQL functions) | Relational data, row-level security and trusted server functions without running a server — see [comparison](docs/BACKEND.md) |
| Charts | Small custom SVG components | Accessible, tiny, no heavy charting dependency |
| PDF | jsPDF (lazy-loaded) | Client-side PDF from the server-issued certificate record |
| Tests | Vitest, PostgreSQL SQL suite, Playwright | Unit, database/security and end-to-end coverage |
| Fonts | Nunito + Baloo 2 via Fontsource (bundled, OFL) | No third-party font requests |

## Quick start

Prerequisites: **Node.js 22+** and npm. PostgreSQL 15+ only if you want to run the SQL tests.

```bash
npm install
npm run dev            # http://localhost:5173/VeletaFinance/  (demo mode)
```

To use a real backend locally, copy `.env.example` to `.env.local` and fill in the Supabase values (see below), then restart `npm run dev`.

## Environment variables

| Name | Public? | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes (bundled) | Your Supabase project URL. Empty → demo mode. |
| `VITE_SUPABASE_ANON_KEY` | Yes (bundled) | Supabase anon/publishable key. Designed to be public; RLS and SQL functions protect data. |
| `VITE_BASE_PATH` | Yes | Path the site is served from. `/VeletaFinance/` for the project site, `/` for a custom domain. Default in `site.config.ts`. |
| `VITE_SITE_URL` | Yes | Absolute public URL including the base path, used for canonical/OG/sitemap/course pages. |

**Never** put the Supabase service-role key, database password or access tokens in a `VITE_` variable, in `.env` files that are committed, or in the workflow. The app doesn’t need them.

In GitHub, set these as **repository variables** (Settings → Secrets and variables → Actions → *Variables*), not secrets — they end up in the public bundle anyway.

## Backend setup (Supabase)

Full guide: [docs/BACKEND.md](docs/BACKEND.md). In short:

1. Create a Supabase project (free tier is fine to start).
2. New project: paste `supabase/setup.sql` (all migrations combined) into the SQL editor and run it once. Or use the CLI: `supabase link --project-ref <ref> && supabase db push`.
3. Auth → URL configuration: set **Site URL** to your deployed URL (e.g. `https://<user>.github.io/VeletaFinance/`) and add it (and `http://localhost:5173/VeletaFinance/` for development) to **Redirect URLs**.
4. Auth → Providers → Email: enable email sign-ups; keep “Confirm email” on (recommended).
5. Copy the project URL and anon key into `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
6. Existing project created from an older `setup.sql`: run `supabase/update.sql` once in the SQL editor. It applies the newer migrations and the latest content, and is safe to run again.
7. Whenever lesson content, achievements or XP settings change, run `npm run content:sql` and apply the regenerated `supabase/update.sql` (it upserts content and removes retired achievement definitions; it never deletes learner data).

## Testing

```bash
npm run typecheck      # TypeScript project references
npm run lint           # ESLint
npm test               # Vitest: engine, rules, formulas, content validation, parsers
npm run content:check  # fails if the SQL answer-key seed is out of date
npm run test:sql       # applies all migrations to a throwaway local PostgreSQL DB and runs the SQL suite
npm run test:e2e       # Playwright journeys against the production build (demo mode)
```

- `test:sql` needs a local PostgreSQL 15+ server; it uses `supabase/tests/supabase_stub.sql` to emulate Supabase’s `auth` schema and roles. Set `PGHOST`/`PGUSER`/`PGPASSWORD` if needed.
- `test:e2e` needs Chromium (`npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_PATH` to an existing binary).
- The end-to-end tests run in **demo mode**; they exercise the real UI and the same rules engine, but not the live Supabase service. The friend/leaderboard and cross-user privacy rules are verified at the database level by `test:sql`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#what-is-and-isnt-tested).

## Deployment to GitHub Pages

`.github/workflows/deploy.yml` type-checks, runs the unit tests, builds and deploys `dist/` with the official Pages actions. `.github/workflows/checks.yml` runs lint, SQL and end-to-end tests separately so a slow test can't block a deploy.

> **Important:** don't use “Deploy from a branch”. That serves the unbuilt source `index.html`, which shows a blank white page. The site must be built by the workflow.

1. Repository → Settings → Pages → **Source: GitHub Actions**.
2. (Optional, for online mode) add repository variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. (Custom domain only) set `VITE_BASE_PATH=/` and `VITE_SITE_URL=https://your.domain/`, and configure the domain in Pages settings.
4. Push to `main` or a `claude/**` branch, or run “Build and deploy to GitHub Pages” manually from the Actions tab.

Base path and site URL default to what `actions/configure-pages` reports, so the repository name is not hard-coded anywhere except the fallback in `site.config.ts`. A full checklist is in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Project structure

```
src/
  content/        typed curriculum (courses/*.ts), builders, validation, registry
  engine/         pure rules: grading, XP & levels, streaks, mastery, missions, achievements, progression
  backend/        Backend interface, Supabase client, demo-mode LocalBackend, shared rules, response parsing
  learning/       lesson player, question components, feedback, rewards
  pages/          public, auth, app, learning, social, certificates, tools, charts
  charts/         SVG line / bar / donut / candlestick charts and the diagram renderer
  tools/          finance formulas (+ tests) and portfolio assumptions
  certificates/   on-screen certificate and PDF generation
  brand/          logo and mascot (original SVG artwork)
  components/ layout/ state/ styles/ data/ lib/
supabase/
  migrations/     schema, trusted functions, security (RLS/grants), generated content seed
  tests/          SQL test suite + Supabase auth stub + runner
e2e/              Playwright journeys A–E
scripts/          content seed generator, SEO build plugin, social image renderer
docs/             architecture, backend, rules, content, data, deployment
```

## Known limitations

- **Demo mode** (no Supabase configured) stores data only in the browser: no cross-device sync, no friends/leaderboards, and demo certificates can’t be verified by anyone else. This is shown in a banner on every page.
- Answer keys for lesson and exam questions ship in the JavaScript bundle so the app can give instant feedback. The server grades independently and issues certificates itself, but a determined learner could read the exam answers from the bundle. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#assessment-integrity).
- No licensed historical market data is bundled yet; charts use labelled synthetic/illustrative data. Case studies quote no financial figures.
- Reminder notifications aren’t implemented. Offline support covers finishing lessons/assessments while offline (queued and synced later), not loading the app offline.
- The PDF uses jsPDF’s built-in Latin-1 fonts; names in other scripts appear correctly on screen and on the verification page but are replaced with “?” in the PDF (the app warns when this happens).
- Hash URLs (`#/…`) are not indexed as separate pages; public course content is indexed through the generated `/courses/<slug>/` pages.

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank white page on Pages | Pages is set to “Deploy from a branch”. Switch Settings → Pages → Source to **GitHub Actions** and re-run the deploy workflow. |
| 404 for assets on Pages | `VITE_BASE_PATH` must match the URL path (`/<repo>/` for project sites, `/` for custom domains). |
| “Demo mode” banner in production | The build didn’t see `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`. Add them as repository *variables* and redeploy. |
| Confirmation/reset links go to the wrong place | Check Supabase Auth Site URL and Redirect URLs include the exact deployed URL with trailing slash. |
| `permission denied` / `42501` from the API | Migrations not fully applied, or applied out of order. Re-run them in filename order. |
| Lessons fail to save with “Lesson not found” | The content seed is missing or stale — run `npm run content:sql` and apply the seed file. |
| `npm run test:sql` can’t connect | Start PostgreSQL and set `PGHOST`, `PGUSER`, `PGPASSWORD`. |
| Playwright can’t find a browser | `npx playwright install chromium` or set `PLAYWRIGHT_CHROMIUM_PATH`. |

## Licence and credits

Original code, lesson content, logo and mascot were created for Veleta Finance. Fonts: Nunito and Baloo 2 (SIL Open Font License) via Fontsource.
