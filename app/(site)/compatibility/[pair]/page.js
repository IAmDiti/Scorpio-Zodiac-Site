import { notFound } from 'next/navigation'
import { PagePlaceholder } from '@/components/page-placeholder'
import { ZODIAC_SIGNS } from '@/lib/constants'

const PREFIX = 'scorpio-and-'

const partnerFromPair = (pair) => {
  if (!pair?.startsWith(PREFIX)) return null
  const key = pair.slice(PREFIX.length)
  const sign = ZODIAC_SIGNS.find((s) => s.key === key)
  return sign && sign.key !== 'scorpio' ? sign : null
}

export function generateStaticParams() {
  return ZODIAC_SIGNS.filter((s) => s.key !== 'scorpio').map((s) => ({
    pair: `${PREFIX}${s.key}`,
  }))
}

export async function generateMetadata({ params }) {
  const { pair } = await params
  const match = partnerFromPair(pair)
  if (!match) return {}
  return {
    title: `Scorpio & ${match.name} Compatibility`,
    description: `How Scorpio and ${match.name} match in love, trust, communication and friendship. For entertainment purposes only.`,
  }
}

export default async function PairPage({ params }) {
  const { pair } = await params
  const match = partnerFromPair(pair)
  if (!match) notFound()

  return (
    <PagePlaceholder
      eyebrow="Match report"
      title={`Scorpio & ${match.name}`}
      blurb={`Water × ${match.element} · Fixed × ${match.modality}. The full breakdown is generated in the next phase.`}
      phase="Phase 3 (horoscope + compatibility)"
    />
  )
}
