import { HoroscopeDay } from '@/components/horoscope-day'
import { todayISO, formatLong } from '@/lib/dates'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
  const today = todayISO()
  return {
    title: `Scorpio Horoscope — ${formatLong(today)}`,
    description:
      "Today's Scorpio horoscope, read from the real positions of the Sun, Moon and planets: love, career and wellbeing. For entertainment purposes only.",
    alternates: { canonical: '/horoscope' },
  }
}

export default function HoroscopePage() {
  return <HoroscopeDay dateISO={todayISO()} />
}
