import { notFound } from 'next/navigation'
import { CompatReport } from '@/components/compat-report'
import { partnerSign, getCompatibility, ensureCompatibility } from '@/lib/compatibility'

const PREFIX = 'scorpio-and-'

// A compatibility write-up is stable; cache it and refresh monthly. Pages
// render on first request (reading the row the seed script wrote), then cache.
export const revalidate = 2592000 // 30 days
export const dynamicParams = true

function keyFromPair(pair) {
  if (typeof pair !== 'string' || !pair.startsWith(PREFIX)) return null
  return pair.slice(PREFIX.length)
}

export async function generateMetadata({ params }) {
  const { pair } = await params
  const sign = partnerSign(keyFromPair(pair))
  if (!sign) return {}
  return {
    title: `Scorpio & ${sign.name} Compatibility`,
    description: `How Scorpio and ${sign.name} match in love, trust, communication and friendship. For entertainment purposes only.`,
  }
}

export default async function PairPage({ params }) {
  const { pair } = await params
  const key = keyFromPair(pair)
  const sign = partnerSign(key)
  if (!sign) notFound()

  let data = null
  let error = false
  try {
    data = (await getCompatibility(key)) ?? (await ensureCompatibility(key))
  } catch (e) {
    console.error('compatibility render failed', e)
    error = true
  }

  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-8">
      {data ? (
        <CompatReport partner={sign} data={data} />
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <h1 className="text-[22px] text-ink-bright">Scorpio &amp; {sign.name}</h1>
          <p className="mt-3 text-sm text-ink-3">
            {error
              ? 'This reading is being prepared — check back shortly.'
              : 'This reading isn&rsquo;t ready yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
