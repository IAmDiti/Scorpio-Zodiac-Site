import { SCORPIO } from '@/lib/constants'

export const metadata = {
  title: 'About Scorpio',
  description:
    'Scorpio dates, element, ruling planets and the traits the sign is known for. For entertainment purposes only.',
}

const TRAITS = [
  ['Dates', 'October 23 – November 21'],
  ['Element', SCORPIO.element],
  ['Quality', SCORPIO.modality],
  ['Ruling planets', 'Mars (traditional) & Pluto (modern)'],
  ['Symbol', SCORPIO.symbol],
  ['Opposite sign', 'Taurus'],
]

export default function AboutScorpioPage() {
  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-10 sm:max-w-2xl sm:px-8 sm:py-14">
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

      <p className="mt-6 font-ui text-[11px] text-ink-5">For entertainment purposes only.</p>
    </div>
  )
}
