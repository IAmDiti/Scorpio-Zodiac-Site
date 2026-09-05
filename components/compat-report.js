import Link from 'next/link'
import { SignGlyph } from '@/components/sign-glyph'
import { ScoreMeter } from '@/components/score-meter'
import { SaveButton } from '@/components/save-button'
import { SIGNS } from '@/lib/astro/zodiac'
import { pairSlug } from '@/lib/constants'

const SCORPIO = SIGNS.find((s) => s.key === 'scorpio')

function ScoreRing({ value }) {
  const r = 64
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.max(0, Math.min(100, value)) / 100)
  return (
    <div className="relative mx-auto h-[150px] w-[150px] shrink-0">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="#221836" strokeWidth="12" />
        <circle
          cx="75"
          cy="75"
          r={r}
          fill="none"
          stroke="#c02a4a"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 75 75)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[38px] leading-none text-ink-bright">
          {value}
          <span className="text-base text-ink-3">%</span>
        </span>
        <span className="eyebrow">Overall</span>
      </div>
    </div>
  )
}

export function CompatReport({ partner, data }) {
  const s = data.scores
  const others = SIGNS.filter((x) => x.key !== partner.key).slice(0, 8)

  return (
    <article>
      <div className="text-center">
        <div className="mb-3.5 flex items-center justify-center gap-4 text-ink">
          <SignGlyph
            sign="scorpio"
            title="Scorpio"
            className="h-10 w-10 text-garnet sm:h-12 sm:w-12"
          />
          <span className="text-ink-4">+</span>
          <SignGlyph
            sign={partner.key}
            title={partner.name}
            className="h-10 w-10 text-gold sm:h-12 sm:w-12"
          />
        </div>
        <h1 className="text-[26px] text-ink-bright sm:text-[34px]">Scorpio &amp; {partner.name}</h1>
        <p className="mt-1.5 font-ui text-[13px] text-ink-3">
          {SCORPIO.element} × {partner.element} · {SCORPIO.modality} × {partner.modality}
        </p>
      </div>

      {/* score + summary */}
      <div className="mt-6 sm:flex sm:items-center sm:gap-7 sm:text-left">
        <ScoreRing value={s.overall} />
        <div className="mt-3 sm:mt-0">
          <p className="px-6 text-center font-body text-[15px] italic text-ink-2 sm:px-0 sm:text-[17px]">
            &ldquo;{data.headline}&rdquo;
          </p>
          <p className="mt-3 text-center text-[14.5px] text-ink-2 sm:text-left sm:text-[15px]">
            {data.summary}
          </p>
        </div>
      </div>

      {/* meters */}
      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-x-8">
        <ScoreMeter label="Passion" value={s.passion} />
        <ScoreMeter label="Trust" value={s.trust} />
        <ScoreMeter label="Communication" value={s.communication} />
        <ScoreMeter label="Friendship" value={s.friendship} />
      </div>

      {/* spark / friction */}
      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <p className="eyebrow mb-2 text-violet">The spark</p>
          <p className="text-sm text-ink-2">{data.spark}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <p className="eyebrow mb-2 text-garnet">The friction</p>
          <p className="text-sm text-ink-2">{data.friction}</p>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-sm">
        <SaveButton
          kind="compatibility"
          refKey={partner.key}
          label={`Scorpio & ${partner.name}`}
          redirectTo={`/compatibility/${pairSlug(partner.key)}`}
        />
      </div>

      <div className="mt-7">
        <p className="mb-2.5 font-ui text-xs text-ink-3">Try another sign</p>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.key}
              href={`/compatibility/${pairSlug(o.key)}`}
              className="rounded-full border border-line-2 bg-surface-2 px-3 py-2 font-ui text-xs text-ink-2 transition-colors hover:text-ink"
            >
              {o.name}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center font-ui text-[11px] text-ink-5">
        For entertainment purposes only.
      </p>
    </article>
  )
}
