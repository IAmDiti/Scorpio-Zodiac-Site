import { createAdminClient } from '@/lib/supabase/admin.js'

// Admin helpers for daily_horoscopes. Generation / storage reuse
// lib/horoscope.js (generateHoroscope, storeHoroscope, getHoroscope).

export async function listHoroscopes({ limit = 60 } = {}) {
  const db = createAdminClient()
  const { data, error } = await db
    .from('daily_horoscopes')
    .select('date, headline, model, generated_at')
    .order('date', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function deleteHoroscope(dateISO) {
  const db = createAdminClient()
  const { error } = await db.from('daily_horoscopes').delete().eq('date', dateISO)
  if (error) throw new Error(error.message)
}

/** Persist admin edits to an existing row (never generates). */
export async function saveHoroscopeEdits(dateISO, patch) {
  const db = createAdminClient()
  const { error } = await db.from('daily_horoscopes').update(patch).eq('date', dateISO)
  if (error) throw new Error(error.message)
}
