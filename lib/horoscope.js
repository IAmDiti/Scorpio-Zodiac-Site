import { createAdminClient } from './supabase/admin.js'
import { computeSky } from './astro/sky.js'
import { completeJSON } from './anthropic.js'
import { HOME_SIGN } from './constants.js'
import { instantForDate } from './dates.js'
import { HOROSCOPE_SCHEMA, buildHoroscopePrompt } from './prompts/daily-horoscope.js'

/** Read a stored horoscope, or null. */
export async function getHoroscope(dateISO) {
  const db = createAdminClient()
  const { data, error } = await db
    .from('daily_horoscopes')
    .select('*')
    .eq('date', dateISO)
    .maybeSingle()
  if (error) throw error
  return data
}

/** Generate (but do not store) a horoscope row for a date. */
export async function generateHoroscope(dateISO) {
  const sky = computeSky(instantForDate(dateISO))
  const { system, user } = buildHoroscopePrompt({ dateISO, sky })

  const { data, model } = await completeJSON({
    system,
    user,
    schema: HOROSCOPE_SCHEMA,
    effort: 'medium',
  })

  return {
    date: dateISO,
    sign: HOME_SIGN,
    headline: data.headline.trim().replace(/[.!?]+$/, ''),
    overview: data.overview.trim(),
    love: data.love.trim(),
    career: data.career.trim(),
    wellbeing: data.wellbeing.trim(),
    lucky_color: data.lucky_color.trim(),
    lucky_number: String(Math.max(1, Math.min(99, Math.round(Number(data.lucky_number)) || 8))),
    transit_data: sky,
    model,
    generated_at: new Date().toISOString(),
  }
}

/**
 * Store a generated row. Tolerates the `headline` column not existing yet
 * (before migration 0004 is applied) by retrying without it.
 */
export async function storeHoroscope(row, { overwrite = false } = {}) {
  const db = createAdminClient()
  const opts = { onConflict: 'date', ignoreDuplicates: !overwrite }

  let { error } = await db.from('daily_horoscopes').upsert(row, opts)
  if (error && /headline/i.test(error.message || '')) {
    const { headline, ...withoutHeadline } = row
    void headline
    ;({ error } = await db.from('daily_horoscopes').upsert(withoutHeadline, opts))
  }
  if (error) throw error
}

/**
 * Return the horoscope for a date, generating and storing it if missing.
 * If a concurrent request wins the insert race, that row is kept.
 */
export async function ensureHoroscope(dateISO) {
  const existing = await getHoroscope(dateISO)
  if (existing) return existing

  const row = await generateHoroscope(dateISO)
  await storeHoroscope(row)
  return (await getHoroscope(dateISO)) ?? row
}
