import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og-card'
import { partnerSign } from '@/lib/compatibility'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = OG_ALT

const PREFIX = 'scorpio-and-'

export default async function Image({ params }) {
  const { pair } = await params
  const key = typeof pair === 'string' && pair.startsWith(PREFIX) ? pair.slice(PREFIX.length) : null
  const sign = partnerSign(key)

  return new ImageResponse(
    <OgCard
      eyebrow="Compatibility"
      title={sign ? `Scorpio & ${sign.name}` : 'Scorpio compatibility'}
      subtitle={sign ? `Water × ${sign.element} · Fixed × ${sign.modality}` : undefined}
    />,
    { ...OG_SIZE }
  )
}
