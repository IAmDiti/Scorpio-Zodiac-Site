// Date helpers. A "horoscope day" is anchored to SITE_TZ so the site rolls
// over to the next day at local midnight, not UTC midnight. The sky snapshot
// for a given date is computed at 12:00 UTC that day — for sun-sign astrology
// the exact instant within the day is immaterial.

const TZ = process.env.SITE_TZ || 'Europe/Rome'

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/

/** Today's date (YYYY-MM-DD) in the site timezone. */
export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now)
}

export function isValidDateISO(s) {
  return typeof s === 'string' && ISO_RE.test(s) && !Number.isNaN(Date.parse(`${s}T12:00:00Z`))
}

/** The instant to compute the sky for a horoscope date. */
export function instantForDate(iso) {
  return new Date(`${iso}T12:00:00Z`)
}

export function addDays(iso, n) {
  const d = instantForDate(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function relativeToToday(iso, now = new Date()) {
  const t = todayISO(now)
  if (iso < t) return 'past'
  if (iso > t) return 'future'
  return 'today'
}

const fmt = (opts) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts })

export function formatLong(iso) {
  return fmt({ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(
    instantForDate(iso)
  )
}

export function formatMedium(iso) {
  return fmt({ month: 'long', day: 'numeric', year: 'numeric' }).format(instantForDate(iso))
}

export function formatShort(iso) {
  return fmt({ weekday: 'short', month: 'short', day: 'numeric' }).format(instantForDate(iso))
}

export function formatWeekday(iso) {
  return fmt({ weekday: 'short' }).format(instantForDate(iso))
}
