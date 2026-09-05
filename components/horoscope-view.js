import { IconScorpio, IconMoon, IconHeart, IconSparkle } from '@/components/icons'
import { SaveButton } from '@/components/save-button'

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

const ASPECT_GLYPH = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
}

function SkySnapshot({ sky }) {
  if (!sky) return null
  const chips = []

  if (sky.moon?.sign) {
    chips.push({ text: `Moon in ${sky.moon.sign}`, key: 'moon-sign' })
  }
  for (const a of (sky.aspects || []).slice(0, 3)) {
    chips.push({
      text: `${cap(a.a)} ${ASPECT_GLYPH[a.aspect] || a.aspect} ${cap(a.b)}`,
      key: `${a.a}-${a.b}`,
    })
  }
  if (sky.moon?.phase) {
    chips.push({
      text: `${sky.moon.phase} · ${sky.moon.illuminationPercent}%`,
      key: 'phase',
      dim: true,
    })
  }
  for (const r of (sky.retrogrades || []).slice(0, 2)) {
    chips.push({ text: `${r} ℞`, key: r, dim: true })
  }

  return (
    <div className="rounded-2xl border border-line-2 bg-gradient-to-br from-surface-2 to-surface p-4">
      <p className="eyebrow mb-2.5 text-gold">Today&rsquo;s sky</p>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span
            key={c.key}
            className={`rounded-full px-2.5 py-1.5 font-ui text-[11.5px] ${
              c.dim ? 'bg-void text-ink-3' : 'bg-[#221836] text-ink-2'
            }`}
          >
            {c.text}
          </span>
        ))}
      </div>
    </div>
  )
}

const SECTIONS = [
  { key: 'overview', label: 'Overview', Icon: IconSparkle, color: 'text-lilac' },
  { key: 'love', label: 'Love', Icon: IconHeart, color: 'text-garnet' },
  { key: 'career', label: 'Career', Icon: IconSparkle, color: 'text-gold' },
  { key: 'wellbeing', label: 'Wellbeing', Icon: IconMoon, color: 'text-violet' },
]

export function HoroscopeView({ horoscope, dateISO, dateLabel }) {
  return (
    <article>
      <div className="mb-4 text-center">
        <IconScorpio className="mx-auto mb-3 h-11 w-12 text-garnet" />
        <h1 className="text-[30px] text-ink-bright">Scorpio</h1>
        <p className="eyebrow mt-2">{dateLabel}</p>
      </div>

      <SkySnapshot sky={horoscope.transit_data} />

      <div className="mt-4 flex flex-col gap-3">
        {SECTIONS.map(({ key, label, Icon, color }) => (
          <section key={key} className="rounded-2xl border border-line bg-surface p-[17px]">
            <div className="mb-2 flex items-center gap-2.5">
              <Icon className={`h-[18px] w-[18px] ${color}`} />
              <h2 className="text-base">{label}</h2>
            </div>
            <p className="text-[14.5px] text-ink-2">{horoscope[key]}</p>
          </section>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-surface p-4 text-center">
          <p className="eyebrow mb-2.5">Lucky colour</p>
          <p className="font-ui text-sm text-ink">{horoscope.lucky_color}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 text-center">
          <p className="eyebrow mb-2.5">Lucky number</p>
          <p className="font-display text-2xl leading-none text-gold">{horoscope.lucky_number}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2.5">
        <SaveButton
          kind="horoscope"
          refKey={dateISO}
          label={`Scorpio horoscope · ${dateLabel}`}
          redirectTo={dateISO ? `/horoscope/${dateISO}` : '/horoscope'}
        />
      </div>

      <p className="mt-5 text-center font-ui text-[11px] text-ink-5">
        Generated from the real planetary positions for this date. For entertainment purposes only.
      </p>
    </article>
  )
}
