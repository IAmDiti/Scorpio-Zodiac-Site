import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og-card'
import { todayISO, formatLong } from '@/lib/dates'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = OG_ALT

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Daily horoscope"
      title="Today's Scorpio horoscope"
      subtitle={formatLong(todayISO())}
    />,
    { ...OG_SIZE }
  )
}
