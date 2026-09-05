import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Liveness check for Railway's healthcheck, plus a config summary to make
// first-deploy debugging painless. Reports only booleans / non-secret values.
export async function GET() {
  const config = {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    anthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    cronSecret: Boolean(process.env.CRON_SECRET),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    siteTz: process.env.SITE_TZ || null,
    plausible: Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
    sentry: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  }

  // Can we actually reach the database and see the schema?
  let db = { checked: false }
  if (config.supabaseUrl && config.supabaseServiceKey) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const supabase = createAdminClient()
      const [horoscopes, compatibility, profiles] = await Promise.all([
        supabase.from('daily_horoscopes').select('date', { count: 'exact', head: true }),
        supabase.from('compatibility').select('partner_sign', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ])
      db = {
        checked: true,
        daily_horoscopes: horoscopes.error ? horoscopes.error.message : `${horoscopes.count} rows`,
        compatibility: compatibility.error
          ? compatibility.error.message
          : `${compatibility.count} rows`,
        profiles: profiles.error ? profiles.error.message : 'table ok',
      }
    } catch (e) {
      db = { checked: true, error: String(e?.message || e) }
    }
  }

  return NextResponse.json({ ok: true, ts: new Date().toISOString(), config, db })
}
