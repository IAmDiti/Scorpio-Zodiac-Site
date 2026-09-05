# Supabase

Schema lives in `migrations/`, applied in filename order.

## Apply the schema

**Option A — dashboard (quickest to start):**
Open your project → SQL Editor → paste the contents of each file in
`migrations/` in order → Run.

**Option B — Supabase CLI:**

```bash
npm i -g supabase
supabase link --project-ref <your-project-ref>
supabase db push
```

## After the schema is in place

1. Fill `.env` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`.
2. Seed the 12 compatibility pages once:
   ```bash
   npm run compat:generate
   ```
3. Generate today's horoscope (also runs daily via the cron service):
   ```bash
   npm run horoscope:generate
   ```

## Migrations

| File | What it adds |
| --- | --- |
| `0001_horoscope_and_compatibility.sql` | `daily_horoscopes`, `compatibility` (public read; writes via service role) |

Auth tables (`profiles`, `quiz_results`, …) arrive in Phase 4.
