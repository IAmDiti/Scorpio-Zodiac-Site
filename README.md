# Scorpio Daily

A free daily Scorpio horoscope drawn from the real sky, plus compatibility with
every sign and engagement quizzes. Growth-first; one-time paid readings later.

## Stack

| Layer                    | Choice                                                                    |
| ------------------------ | ------------------------------------------------------------------------- |
| Framework                | Next.js 16 (App Router, **plain JavaScript**)                             |
| Styling                  | Tailwind CSS v4 (theme tokens in `app/globals.css`)                       |
| Auth + DB + storage      | Supabase (`@supabase/ssr`)                                                |
| Horoscope / reading text | Anthropic API (`claude-opus-5`), grounded in `astronomy-engine` ephemeris |
| Payments (Phase 8)       | Lemon Squeezy, one-time purchases                                         |
| Hosting                  | Railway (web service + a daily cron)                                      |
| Analytics                | Plausible (cookieless, optional)                                          |
| Errors                   | Sentry (optional)                                                         |

## Local setup

```bash
npm install
cp .env.example .env          # fill in the values (see below)
npm run dev                   # http://localhost:3000
```

The app runs without any env — pages render in a logged-out / "being prepared"
state. To exercise the real features you need a Supabase project and an Anthropic
key. See `supabase/README.md` and `DEPLOY.md`.

### Environment variables

`.env.example` is the source of truth. Minimum for full local functionality:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `CRON_SECRET`, `SITE_TZ`.

## Scripts

| Command                                               | What                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`                                         | dev server                                                                |
| `npm run build` / `npm start`                         | production build / serve                                                  |
| `npm run lint`                                        | ESLint                                                                    |
| `npm test`                                            | `node --test` — the `lib/astro` ephemeris + quiz scoring                  |
| `npm run compat:generate`                             | generate the 12 compatibility pages (Anthropic)                           |
| `npm run horoscope:generate`                          | generate today's horoscope; `-- --force` to redo; `2026-01-01` for a date |
| `node scripts/screenshot.mjs <url> <out.png> <width>` | dev-only page screenshot (needs Chrome)                                   |

## Layout

```
app/
  layout.js               root: fonts, starfield, analytics, cookie notice, JSON-LD, skip link
  (site)/                 pages with the site header + footer
    page.js               homepage
    horoscope/            /horoscope (today), /horoscope/[date] (archive)
    compatibility/        picker + /compatibility/scorpio-and-[sign]
    quizzes/              quiz catalog
    account/ onboarding/  profile, saved items, quiz history
    privacy/ terms/ disclaimer/ about-scorpio/
    error.js
  (auth)/                 chrome-less /signup + /login + server actions
  (play)/quiz/[slug]/     chrome-less quiz taker, /result, /r/[key] (+ OG image)
  auth/callback/ confirm/ OAuth + email-confirm route handlers
  api/
    cron/daily-horoscope/ secret-protected generation endpoint
    health/               Railway healthcheck
  robots.js sitemap.js manifest.js icon.js apple-icon.js opengraph-image.js
components/               shared UI
lib/
  astro/                  geocentric tropical ephemeris + aspects (+ tests)
  quizzes/                6 quiz data modules + registry + pure scoring
  anthropic.js horoscope.js compatibility.js quiz-results.js
  supabase/               client.js / server.js / middleware.js / admin.js
  dates.js constants.js og-card.js
proxy.js                  refreshes the Supabase session on every request
instrumentation*.js       Sentry (inert without NEXT_PUBLIC_SENTRY_DSN)
supabase/migrations/      0001 horoscope+compatibility · 0002 profiles · 0003 quiz_results
design/                   the approved "cosmic noir" design canvas + screenshots
scripts/                  generators + a screenshot helper
```

## Deploying

See **`DEPLOY.md`** for the full Railway + Supabase + DNS runbook.

## Build phases

Done: design canvas · scaffold · horoscope + compatibility · auth + profile ·
quiz engine · SEO / legal / accessibility · responsive pass · launch prep.

Remaining: **Phase 8** — one-time paid readings via Lemon Squeezy.

Plan: `C:\Users\Diti\.claude\plans\i-have-a-facebook-cached-dove.md`
