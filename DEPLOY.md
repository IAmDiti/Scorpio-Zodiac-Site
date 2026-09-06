# Deploying Scorpio Daily

A step-by-step launch runbook. Rough order: Supabase → Google OAuth → Railway →
DNS → seed content → smoke test.

You need accounts on: **Supabase**, **Railway**, **Google Cloud** (for Google
sign-in), and a **domain registrar**. Optional: **Plausible** (analytics),
**Sentry** (error monitoring), **Resend** or another SMTP provider (email).

---

## 1. Supabase

1. Create a project. From **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (server-only!)
2. **SQL Editor** → run each file in `supabase/migrations/` in order
   (`0001` → `0002` → `0003`).
3. **Authentication → URL Configuration**
   - Site URL: `https://YOURDOMAIN`
   - Redirect URLs: add `https://YOURDOMAIN/**` and `http://localhost:3000/**`
4. **Authentication → Providers**
   - **Email**: enabled, "Confirm email" ON.
   - **Google**: enabled — paste the Client ID + Secret from step 2 below.
5. **Authentication → Email Templates → Confirm signup**: change the link to
   ```
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup">Confirm your account</a>
   ```
   (Do the same for Magic Link / Recovery with `type=magiclink` / `type=recovery`
   if you enable them.)
6. **Email**: for real volume, set **Authentication → SMTP Settings** to a
   provider like Resend. Supabase's built-in email is rate-limited and fine only
   for early testing.

---

## 2. Google OAuth (for "Continue with Google")

1. [Google Cloud Console](https://console.cloud.google.com/) → create a project.
2. **APIs & Services → OAuth consent screen**: External, add your domain,
   support email, and the scopes `email`, `profile`, `openid`. Publish it (or
   keep in testing and add yourself as a test user for now).
3. **Credentials → Create credentials → OAuth client ID → Web application**
   - Authorized redirect URI:
     `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
4. Copy the Client ID + Secret into Supabase (step 1.4).

---

## 3. Railway — the web app

1. **New Project → Deploy from GitHub repo** → pick this repo. Railway detects
   Next.js (Nixpacks) and uses `railway.json` for build/start + the
   `/api/health` healthcheck.
2. **Variables** on the service:

   | Variable                        | Value                                                       |
   | ------------------------------- | ----------------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | from Supabase                                               |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase                                               |
   | `SUPABASE_SERVICE_ROLE_KEY`     | from Supabase (secret)                                      |
   | `ANTHROPIC_API_KEY`             | from console.anthropic.com                                  |
   | `CRON_SECRET`                   | a long random string (e.g. `openssl rand -hex 32`)          |
   | `NEXT_PUBLIC_SITE_URL`          | `https://YOURDOMAIN`                                        |
   | `SITE_TZ`                       | IANA zone the "horoscope day" resets on, e.g. `Europe/Rome` |
   | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`  | your domain, or leave unset                                 |
   | `NEXT_PUBLIC_SENTRY_DSN` etc.   | optional, see §7                                            |

   Railway sets `PORT` automatically; `npm start` binds `0.0.0.0`.

3. Deploy. Check the deploy logs for `✓ Ready`, then open the Railway-provided
   URL and confirm the homepage loads.

---

## 4. Custom domain + DNS

1. Railway service → **Settings → Networking → Custom Domain** → add
   `YOURDOMAIN` (and `www.YOURDOMAIN` if you want it).
2. At your registrar, create the CNAME record(s) Railway shows you. For an apex
   domain, use your registrar's ALIAS/ANAME/flattened-CNAME feature, or
   Cloudflare with proxy on.
3. Wait for the certificate to issue (minutes to an hour). Then update:
   - `NEXT_PUBLIC_SITE_URL` on Railway → `https://YOURDOMAIN` (redeploy)
   - Supabase Site URL + Redirect URLs → the real domain
   - Google OAuth consent screen domain if needed

---

## 5. The daily-horoscope cron

The site self-heals — the first visitor after midnight triggers generation — but
a scheduled job means the reading is always ready. Pick one:

**A. Railway cron service (recommended).** New service in the same project, same
repo:

- **Settings → Deploy → Custom Start Command**: `npm run horoscope:generate`
- **Settings → Cron Schedule**: `5 0 * * *` (00:05 every day)
- Give it the same `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `ANTHROPIC_API_KEY`, `SITE_TZ` variables.

**B. External cron hitting the endpoint.** Any scheduler (cron-job.org, GitHub
Actions, Supabase `pg_cron` + `pg_net`) doing a daily:

```
GET https://YOURDOMAIN/api/cron/daily-horoscope?secret=YOUR_CRON_SECRET
```

Either way, seed the first day + the 12 compatibility pages once (locally with a
filled `.env`, or from a Railway one-off shell):

```
npm run compat:generate      # ~1 min, a few cents of Anthropic usage
npm run horoscope:generate   # today's horoscope
```

---

## 6. Analytics (optional)

Google Analytics 4 is on by default (measurement ID `G-MK7C2CQ3Q2`). Override it
with `NEXT_PUBLIC_GA_MEASUREMENT_ID` on Railway, or set it to an empty string to
turn GA off. GA sets cookies — in the EU/UK you need a consent gate before it
loads.

Optionally also add the site in [Plausible](https://plausible.io) and set
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` on Railway. Plausible is cookieless — no consent
gate needed.

---

## 7. Error monitoring (optional)

Create a Sentry project (Next.js platform). Set on Railway:
`NEXT_PUBLIC_SENTRY_DSN`, and for source maps also `SENTRY_ORG`,
`SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`. Without `NEXT_PUBLIC_SENTRY_DSN` Sentry is
completely inert.

---

## 8. Legal — before you link the site publicly

Open `app/(site)/privacy/page.js`, `terms/page.js`, `disclaimer/page.js` and
replace every `[BRACKETED]` placeholder: your name/company, contact email,
address, jurisdiction, retention period, dates. Have a lawyer skim them —
astrology plus payments is a slightly sensitive combination.

---

## 9. Post-deploy smoke test

- [ ] `https://YOURDOMAIN` loads; `/api/health` returns `{"ok":true}`
- [ ] `/horoscope` shows a real reading (run the seed if it's the "being
      prepared" state)
- [ ] `/compatibility/scorpio-and-leo` shows a real report
- [ ] Sign up with email → confirmation email arrives → link logs you in →
      lands on `/onboarding`
- [ ] "Continue with Google" completes and returns you signed in
- [ ] Take a quiz logged out → redirected to sign up → result revealed after
      signing in; it appears in `/account`
- [ ] Save a horoscope (heart) → shows in `/account`
- [ ] `/robots.txt`, `/sitemap.xml` load; share a page on Facebook and check the
      preview card
- [ ] Run Lighthouse on `/` (mobile) — aim for 90+ on every category

---

## 10. Announce

Post the link from the Facebook page. Pin a post. Consider leading with a quiz
("What kind of Scorpio are you?") — it's the strongest share hook.
