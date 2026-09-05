import { HoroscopeDay } from '@/components/horoscope-day'
import { JsonLd } from '@/components/json-ld'
import { todayISO, formatLong } from '@/lib/dates'
import { SITE_NAME } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function generateMetadata() {
  const today = todayISO()
  const title = `Scorpio Horoscope — ${formatLong(today)}`
  const description =
    "Today's Scorpio horoscope, read from the real positions of the Sun, Moon and planets: love, career and wellbeing. For entertainment purposes only."
  return {
    title,
    description,
    alternates: { canonical: '/horoscope' },
    openGraph: { title, description, type: 'article' },
  }
}

export default function HoroscopePage() {
  const today = todayISO()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Scorpio Horoscope for ${formatLong(today)}`,
    datePublished: today,
    dateModified: today,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
    about: { '@type': 'Thing', name: 'Scorpio zodiac sign' },
    isAccessibleForFree: true,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <HoroscopeDay dateISO={today} />
    </>
  )
}
