import Link from 'next/link'
import { SignGlyph } from '@/components/sign-glyph'
import { SIGNS } from '@/lib/astro/zodiac'
import { pairSlug } from '@/lib/constants'

export const metadata = {
  title: 'Scorpio Compatibility With Every Sign',
  description:
    'How Scorpio matches with all twelve signs — passion, trust, communication and friendship. Free. For entertainment purposes only.',
}

export default function CompatibilityIndexPage() {
  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-8">
      <p className="eyebrow mb-2">Compatibility</p>
      <h1 className="text-[30px] text-ink-bright">Scorpio &amp; every sign</h1>
      <p className="mt-3 text-[15px] text-ink-2">
        Pick a sign to see how it pairs with Scorpio — where the pull is, and where it strains.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {SIGNS.map((sign) => (
          <Link
            key={sign.key}
            href={`/compatibility/${pairSlug(sign.key)}`}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-colors hover:border-line-2"
          >
            <SignGlyph sign={sign.key} className="h-6 w-6 shrink-0 text-gold" />
            <span className="min-w-0">
              <span className="block font-ui text-[13px] font-bold text-ink">{sign.name}</span>
              <span className="block font-ui text-[11px] text-ink-4">
                {sign.element} · {sign.modality}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
