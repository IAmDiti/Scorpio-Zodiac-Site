import Link from 'next/link'
import { HoroscopeView } from '@/components/horoscope-view'
import { DateNav } from '@/components/date-nav'
import { getHoroscope, ensureHoroscope } from '@/lib/horoscope'
import { todayISO, addDays, relativeToToday, formatLong } from '@/lib/dates'

/**
 * Renders one day's Scorpio horoscope.
 * Generates on demand for today and yesterday; older missing days are just
 * not in the archive, and future days aren't available yet.
 */
export async function HoroscopeDay({ dateISO }) {
  const today = todayISO()
  const when = relativeToToday(dateISO)
  const canGenerate = dateISO === today || dateISO === addDays(today, -1)

  let horoscope = null
  let error = false
  try {
    horoscope = canGenerate ? await ensureHoroscope(dateISO) : await getHoroscope(dateISO)
  } catch (e) {
    console.error('horoscope render failed', e)
    error = true
  }

  const prev = addDays(dateISO, -1)
  const next = when === 'past' ? addDays(dateISO, 1) : null
  const label = dateISO === today ? 'Today' : formatLong(dateISO)

  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-4">
      <DateNav
        prev={prev}
        next={next}
        label={dateISO === today ? `Today · ${formatLong(dateISO)}` : label}
      />

      <div className="mt-6">
        {horoscope ? (
          <HoroscopeView horoscope={horoscope} dateISO={dateISO} dateLabel={formatLong(dateISO)} />
        ) : (
          <div className="rounded-2xl border border-line bg-surface p-6 text-center">
            <h1 className="text-[22px] text-ink-bright">
              {when === 'future'
                ? 'This day hasn&rsquo;t arrived'
                : error
                  ? 'The reading is being prepared'
                  : 'Not in the archive'}
            </h1>
            <p className="mt-3 text-sm text-ink-3">
              {when === 'future'
                ? 'Come back on the day for its horoscope.'
                : error
                  ? 'Something went wrong generating this one. Try again in a moment.'
                  : 'We only keep recent days. Read today&rsquo;s instead.'}
            </p>
            <Link
              href="/horoscope"
              className="mt-5 inline-flex rounded-full bg-garnet px-5 py-2.5 font-ui text-[13px] font-bold text-white"
            >
              Today&rsquo;s horoscope
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
