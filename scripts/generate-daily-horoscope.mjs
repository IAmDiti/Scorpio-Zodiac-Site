#!/usr/bin/env node
// Generate the Scorpio daily horoscope and store it.
//
//   npm run horoscope:generate               -> today (skips if it exists)
//   npm run horoscope:generate 2026-09-05     -> a specific date
//   npm run horoscope:generate -- --force     -> regenerate today
//
// Railway runs this once a day as a scheduled cron service.

import { ensureHoroscope, generateHoroscope } from '../lib/horoscope.js'
import { createAdminClient } from '../lib/supabase/admin.js'
import { todayISO, isValidDateISO } from '../lib/dates.js'

const args = process.argv.slice(2)
const force = args.includes('--force')
const dateArg = args.find((a) => isValidDateISO(a))
const date = dateArg || todayISO()

console.log(`Scorpio horoscope · ${date}${force ? ' (force)' : ''}`)

try {
  let row
  if (force) {
    row = await generateHoroscope(date)
    const { error } = await createAdminClient()
      .from('daily_horoscopes')
      .upsert(row, { onConflict: 'date' })
    if (error) throw error
  } else {
    row = await ensureHoroscope(date)
  }
  console.log(`  model: ${row.model}`)
  console.log(`  overview: ${row.overview}`)
  console.log('done.')
} catch (e) {
  console.error('failed:', e?.message || e)
  process.exit(1)
}
