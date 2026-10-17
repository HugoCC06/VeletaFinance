# Deployment checklist

## GitHub Pages
- [ ] Settings → Pages → Source: **GitHub Actions**
- [ ] Workflow `Test and deploy to GitHub Pages` is green on `main`
- [ ] Site loads at `https://<user>.github.io/<repo>/`; refresh on `#/curriculum` works
- [ ] `robots.txt`, `sitemap.xml` and `/courses/<slug>/` pages are served
- [ ] Custom domain (optional): set `VITE_BASE_PATH=/` and `VITE_SITE_URL=https://domain/` variables, configure the domain and HTTPS in Pages

## Online mode (Supabase)
- [ ] Project created; migrations 01→04 applied in order
- [ ] RLS shows enabled on every `public` table
- [ ] Auth Site URL and Redirect URLs set to the deployed URL (and localhost for dev)
- [ ] Email provider enabled; confirmation emails arrive (consider custom SMTP for volume)
- [ ] Repository variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set; workflow re-run
- [ ] Demo banner no longer shown

## Manual acceptance tests against the real backend
- [ ] Sign up → confirm email → onboarding → first lesson → XP and streak shown
- [ ] Sign in on a second device/browser → progress is there
- [ ] Password reset email → new password works
- [ ] Two accounts: friend request, accept, both appear on leaderboard; remove friend
- [ ] Profile private by default; public link shows only public fields; private again → link shows “private”
- [ ] Complete a course → certificate → PDF downloads → verification URL works in a private window
- [ ] Delete account → can’t sign in; certificate ID no longer verifies
- [ ] Network offline mid-lesson → finish lesson → reconnect → XP appears once

## Before a public launch
- [ ] Review tax content dates (UK tax year / US tax year)
- [ ] Enable Supabase CAPTCHA / abuse protections
- [ ] Monitor free-tier usage and project pausing
- [ ] Consider moving exam keys server-side (see ARCHITECTURE.md)
