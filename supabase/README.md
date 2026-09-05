# Supabase

Schema lives in `migrations/`, applied in filename order.

## Apply the schema

**Option A — dashboard:** SQL Editor → paste each file in `migrations/` in order → Run.

**Option B — CLI:**

```bash
npm i -g supabase
supabase link --project-ref <your-project-ref>
supabase db push
```

## Migrations

| File | Adds |
| --- | --- |
| `0001_horoscope_and_compatibility.sql` | `daily_horoscopes`, `compatibility` (public read; writes via service role) |
| `0002_profiles_and_saved_items.sql` | `profiles` (auto-created on signup), `saved_items`; both owner-only RLS |
| `0003_quiz_results.sql` | `quiz_results` (per-user, owner-only RLS). Quiz definitions live in `lib/quizzes/`. |

## Auth configuration (dashboard → Authentication)

1. **URL Configuration**
   - Site URL: your production URL (e.g. `https://scorpiodaily.com`)
   - Redirect URLs: add `http://localhost:3000/**` and `https://<your-domain>/**`

2. **Providers → Email**: enable. "Confirm email" ON is recommended.

3. **Providers → Google**: enable, and paste the Client ID + Secret from a
   Google Cloud OAuth 2.0 Web client. In Google Cloud, set the authorized
   redirect URI to `https://<project-ref>.supabase.co/auth/v1/callback`.

4. **Email Templates → Confirm signup**: change the link to point at our
   handler so the SSR session is set correctly:

   ```
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup">Confirm your account</a>
   ```

   (Do the same for the Magic Link / Recovery templates if you use them,
   with `type=magiclink` / `type=recovery`.)

## Env

`.env` needs: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `CRON_SECRET`,
`NEXT_PUBLIC_SITE_URL` (used for OAuth/confirm redirects — must match a
Supabase redirect URL).

## Seed content

```bash
npm run compat:generate      # 12 compatibility rows
npm run horoscope:generate   # today's horoscope (also runs daily via cron)
```
