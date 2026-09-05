import { notFound, redirect } from 'next/navigation'
import { HoroscopeDay } from '@/components/horoscope-day'
import { isValidDateISO, todayISO, formatLong } from '@/lib/dates'

// A past date's reading never changes once generated.
export const revalidate = 604800
export const dynamicParams = true

export async function generateMetadata({ params }) {
  const { date } = await params
  if (!isValidDateISO(date)) return {}
  return {
    title: `Scorpio Horoscope — ${formatLong(date)}`,
    description: `The Scorpio horoscope for ${formatLong(date)}, drawn from that day's real sky.`,
  }
}

export default async function HoroscopeArchivePage({ params }) {
  const { date } = await params
  if (!isValidDateISO(date)) notFound()
  if (date === todayISO()) redirect('/horoscope')

  return <HoroscopeDay dateISO={date} />
}
