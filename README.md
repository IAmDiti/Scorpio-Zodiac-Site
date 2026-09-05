# Scorpio Daily

A free daily Scorpio horoscope drawn from the real sky, plus compatibility with every
sign and engagement quizzes. Growth-first; one-time paid readings come later.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router, **plain JavaScript**) |
| Styling | Tailwind CSS v4 (theme tokens in `app/globals.css`) |
| Auth + DB + storage | Supabase (`@supabase/ssr`) |
| Horoscope text | Anthropic API (`claude-opus-5`), grounded in `astronomy-engine` ephemeris |
| Payments (later) | Lemon Squeezy, one-time purchases |
| Hosting | Railway (web service + daily cron) |

## Local setup

```bash
npm install
cp .env.example .env          # fill in the values
npm run dev                   # http://localhost:3000
```

### Environment variables

See `.env.example`. You need a Supabase project (URL + anon key + service-role key),
an Anthropic API key, and a `CRON_SECRET` (any long random string).

## Project layout

```
app/
  layout.js            root: fonts, <Starfield>, metadata
  (site)/              public pages that share the header + footer
    page.js            homepage
    horoscope/         daily horoscope (Phase 3)
    compatibility/     Scorpio x every sign (Phase 3)
    quizzes/ quiz/     quiz engine (Phase 5)
    account/           profile + history (Phase 4)
    privacy/ terms/ disclaimer/
  not-found.js
components/             shared UI (header, footer, icons, constellation)
lib/
  constants.js         site name, zodiac data, nav
  supabase/            client.js / server.js / middleware.js / admin.js
middleware.js           refreshes the Supabase session on every request
scripts/
  generate-daily-horoscope.mjs   (Phase 3)
design/                 the approved "cosmic noir" design canvas source
```

## Build phases

1. ~~Design canvas~~ — done (`design/`)
2. **Scaffold** — this commit
3. Horoscope + compatibility (astro module, daily generator, cron, pages)
4. Auth + profile (email/password + Google, onboarding, `/account`)
5. Quiz engine (take flow, registration gate, results, seed quizzes)
6. SEO, legal, analytics, polish
7. Launch to Railway + custom domain
8. Paid one-time products via Lemon Squeezy

Full plan: `C:\Users\Diti\.claude\plans\i-have-a-facebook-cached-dove.md`

## Deploy (Railway)

- New project from this repo. Railway auto-detects Next.js (Nixpacks).
- Set all variables from `.env.example` in the service.
- `railway.json` pins build/start commands. Railway provides `PORT`.
- Add the custom domain in the service's Networking settings and point DNS at Railway.
- Phase 3 adds a second **cron** service that calls `/api/cron/daily-horoscope`
  with the `CRON_SECRET` once a day.
