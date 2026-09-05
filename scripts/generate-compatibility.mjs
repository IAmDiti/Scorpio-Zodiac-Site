#!/usr/bin/env node
// Generate the 12 Scorpio-and-X compatibility write-ups and store them.
//
//   npm run compat:generate                -> any that are missing
//   npm run compat:generate -- --force     -> regenerate all 12
//   npm run compat:generate leo taurus     -> just those

import { SIGNS } from '../lib/astro/zodiac.js'
import { getCompatibility, generateCompatibility } from '../lib/compatibility.js'
import { createAdminClient } from '../lib/supabase/admin.js'

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--'))
const keys = (only.length ? only : SIGNS.map((s) => s.key)).filter((k) =>
  SIGNS.some((s) => s.key === k)
)

const db = createAdminClient()
let ok = 0

for (const key of keys) {
  if (!force && (await getCompatibility(key))) {
    console.log(`  ${key}: already present, skipping`)
    ok++
    continue
  }
  try {
    process.stdout.write(`  ${key}: generating… `)
    const row = await generateCompatibility(key)
    const { error } = await db.from('compatibility').upsert(row, { onConflict: 'partner_sign' })
    if (error) throw error
    console.log(`${row.scores.overall}% — "${row.headline}"`)
    ok++
  } catch (e) {
    console.log(`FAILED (${e?.message || e})`)
  }
}

console.log(`\n${ok}/${keys.length} ready.`)
process.exit(ok === keys.length ? 0 : 1)
