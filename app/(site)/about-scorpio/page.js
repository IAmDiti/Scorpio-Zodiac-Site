import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { SCORPIO } from '@/lib/constants'
import { SITE_URL as siteUrl } from '@/lib/site'

export const metadata = {
  title: 'About Scorpio',
  description:
    'Scorpio dates, element, ruling planets, personality traits and compatibility, plus common questions about the sign. For entertainment purposes only.',
  alternates: { canonical: '/about-scorpio' },
}

const TRAITS = [
  ['Dates', 'October 23 – November 21'],
  ['Element', SCORPIO.element],
  ['Quality', SCORPIO.modality],
  ['Ruling planets', 'Mars (traditional) & Pluto (modern)'],
  ['Symbol', SCORPIO.symbol],
  ['Opposite sign', 'Taurus'],
]

const FAQ = [
  {
    q: 'When is Scorpio season?',
    a: 'Scorpio season runs from about October 23 to November 21 each year, while the Sun moves through the Scorpio portion of the zodiac. The exact start and end shift by a day depending on the year.',
  },
  {
    q: 'What are Scorpio personality traits?',
    a: 'Scorpio is known for emotional depth, loyalty, and intensity, along with a private, observant nature and a strong will. As a fixed water sign it feels deeply but keeps a great deal below the surface.',
  },
  {
    q: 'Which signs is Scorpio most compatible with?',
    a: 'Scorpio tends to match most easily with the other water signs, Cancer and Pisces, and with grounded earth signs like Virgo and Capricorn. Taurus, its opposite sign, brings strong attraction alongside strong friction.',
  },
  {
    q: 'Who rules Scorpio?',
    a: 'Traditional astrology assigns Mars as Scorpio’s ruler; modern astrology adds Pluto, the planet of transformation, which is why Scorpio is so associated with reinvention and depth.',
  },
]

export default function AboutScorpioPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-10 sm:max-w-2xl sm:px-8 sm:py-14">
      <JsonLd data={faqJsonLd} />

      <p className="eyebrow mb-3">The sign</p>
      <h1 className="text-[30px] text-ink-bright sm:text-[42px]">Scorpio</h1>
      <p className="mt-4 text-ink-2 sm:text-[17px]">
        The eighth sign of the zodiac and the one people find hardest to read. A fixed water sign:
        emotional depth held with unusual control. Scorpio is associated with intensity, loyalty,
        privacy, transformation and a refusal to do anything by halves.
      </p>

      <dl className="mt-6 overflow-hidden rounded-2xl border border-line">
        {TRAITS.map(([k, v], i) => (
          <div
            key={k}
            className={`flex items-center justify-between bg-void/60 px-4 py-3.5 ${
              i > 0 ? 'border-t border-line' : ''
            }`}
          >
            <dt className="font-ui text-[13px] text-ink-3">{k}</dt>
            <dd className="font-ui text-[13px] text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 font-display text-[22px] text-ink-bright sm:text-[28px]">
        Common questions
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {FAQ.map(({ q, a }) => (
          <div key={q}>
            <h3 className="font-display text-[16px] text-ink sm:text-[18px]">{q}</h3>
            <p className="mt-1.5 text-[14.5px] text-ink-2">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/horoscope"
          className="rounded-full bg-garnet px-5 py-2.5 font-ui text-[13px] font-bold text-white"
        >
          Today’s horoscope
        </Link>
        <Link
          href="/compatibility"
          className="rounded-full border border-line-2 px-5 py-2.5 font-ui text-[13px] font-bold text-ink"
        >
          Compatibility
        </Link>
      </div>

      <p className="mt-8 font-ui text-[11px] text-ink-5">For entertainment purposes only.</p>
    </div>
  )
}
