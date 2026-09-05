#!/usr/bin/env node
/**
 * Daily Scorpio horoscope generator.
 *
 * Wired in Phase 3. Will:
 *   1. compute the day's real sky with astronomy-engine
 *   2. build a transit summary for the Scorpio band (210deg-240deg)
 *   3. ask Claude to interpret ONLY that data
 *   4. upsert the result into `daily_horoscopes` via the service-role client
 *
 * Run locally with:  npm run horoscope:generate
 * Run on Railway as a scheduled cron service hitting /api/cron/daily-horoscope.
 */

console.error('generate-daily-horoscope: not implemented yet — arrives in Phase 3.')
process.exit(1)
