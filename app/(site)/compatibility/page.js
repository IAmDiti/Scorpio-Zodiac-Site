import Link from 'next/link'
import { SignGlyph } from '@/components/sign-glyph'
import { Container } from '@/components/container'
import { SIGNS } from '@/lib/astro/zodiac'
import { pairSlug } from '@/lib/constants'

export const metadata = {
  title: 'Scorpio Compatibility With Every Sign',
  description:
    'How Scorpio matches with all twelve signs — passion, trust, communication and friendship. Free. For entertainment purposes only.',
  alternates: { canonical: '/compatibility' },
}

export default function CompatibilityIndexPage() {
  return (
    <Container size="wide" className="py-8 sm:py-12">
      <div className="sm:mx-auto sm:max-w-2xl sm:text-center">
        <p className="eyebrow mb-2">Compatibility</p>
        <h1 className="text-[30px] text-ink-bright sm:text-[42px]">Scorpio &amp; every sign</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink-2 sm:text-[17px]">
          Pick a sign to see how it pairs with Scorpio — where the pull is, and where it strains.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-4">
        {SIGNS.map((sign) => (
          <Link
            key={sign.key}
            href={`/compatibility/${pairSlug(sign.key)}`}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-colors hover:border-line-2 sm:p-4"
          >
            <SignGlyph sign={sign.key} className="h-6 w-6 shrink-0 text-gold sm:h-7 sm:w-7" />
            <span className="min-w-0">
              <span className="block font-ui text-[13px] font-bold text-ink">{sign.name}</span>
              <span className="block font-ui text-[11px] text-ink-4">
                {sign.element} · {sign.modality}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Container>
  )
}
