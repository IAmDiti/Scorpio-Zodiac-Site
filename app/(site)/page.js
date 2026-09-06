import Link from 'next/link'
import { Constellation } from '@/components/constellation'
import { Container } from '@/components/container'
import { IconArrowRight, IconClock, IconHeart, IconMoon, IconQuiz } from '@/components/icons'
import { SCORPIO, PARTNER_SIGNS, pairSlug } from '@/lib/constants'
import { getHoroscope } from '@/lib/horoscope'
import { todayISO, formatLong } from '@/lib/dates'

export const revalidate = 1800

export const metadata = {
  title: 'Daily Scorpio Horoscope & Compatibility',
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

const FALLBACK = {
  headline: 'Read the room, then the stars',
  teaser:
    'Your daily Scorpio horoscope is drawn from the real positions of the Sun, Moon and planets — not the same sentence recycled twelve ways.',
  transits: null,
}

function firstSentences(text, count = 2) {
  const matches = (text || '').match(/[^.!?]+[.!?]+(\s|$)/g)
  if (!matches) return (text || '').trim()
  return matches.slice(0, count).join('').trim()
}

async function loadHero() {
  try {
    const h = await getHoroscope(todayISO())
    if (!h) return FALLBACK
    const sky = h.transit_data
    const transits = sky
      ? [
          sky.moon?.sign && `Moon in ${sky.moon.sign}`,
          sky.aspects?.[0] &&
            `${cap(sky.aspects[0].a)} ${sky.aspects[0].aspect} ${cap(sky.aspects[0].b)}`,
          sky.retrogrades?.[0] && `${sky.retrogrades[0]} retrograde`,
        ]
          .filter(Boolean)
          .join(' · ')
      : null
    return {
      headline: h.headline?.trim() || FALLBACK.headline,
      teaser: firstSentences(h.overview, 2) || FALLBACK.teaser,
      transits,
    }
  } catch {
    return FALLBACK
  }
}

const NAV = [
  { href: '/horoscope', label: 'Horoscope', icon: IconClock },
  { href: '/compatibility', label: 'Compatibility', icon: IconHeart },
  { href: '/quizzes', label: 'Quizzes', icon: IconQuiz },
]

const SIGN_FACTS = [
  ['Dates', 'Oct 23 – Nov 21'],
  ['Element', SCORPIO.element],
  ['Quality', SCORPIO.modality],
  ['Ruling planets', SCORPIO.ruler],
]

export default async function HomePage() {
  const hero = await loadHero()
  const dateLabel = formatLong(todayISO())

  return (
    <Container size="wide" className="pb-8">
      {/* hero */}
      <section className="pb-8 pt-3 sm:mx-auto sm:max-w-2xl sm:pt-6 sm:text-center lg:pb-12 lg:pt-10">
        <Constellation className="mb-3.5 h-24 w-full opacity-90 sm:h-28 lg:h-32" />
        <p className="eyebrow mb-2.5">{dateLabel}</p>
        <h1 className="text-balance text-[clamp(24px,6.5vw,30px)] text-ink-bright sm:text-[34px] lg:text-[40px]">
          {hero.headline}
        </h1>
        <p className="mx-auto mt-3.5 max-w-xl text-[15px] text-ink-2 sm:text-base">{hero.teaser}</p>

        <div className="mt-5 flex flex-col items-center gap-2.5 sm:mt-7">
          <Link
            href="/horoscope"
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-garnet px-6 text-center font-ui text-sm font-bold tracking-[0.04em] text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            Read your full horoscope
            <IconArrowRight className="h-4 w-4 shrink-0" />
          </Link>
          {hero.transits ? (
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-ui text-xs text-ink-4">
              <IconMoon className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span>{hero.transits}</span>
            </p>
          ) : null}
        </div>
      </section>

      {/* quick nav */}
      <section className="grid grid-cols-3 gap-2.5 sm:mx-auto sm:max-w-xl sm:gap-4">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-line bg-surface p-3.5 text-center transition-colors hover:border-line-2 sm:p-5"
          >
            <Icon className="mx-auto mb-2 h-[22px] w-[22px] text-lilac sm:h-6 sm:w-6" />
            <span className="font-ui text-xs font-bold text-ink sm:text-[13px]">{label}</span>
          </Link>
        ))}
      </section>

      {/* feature grid — two balanced columns on desktop */}
      <div className="mt-8 flex flex-col gap-6 sm:mt-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          {/* compatibility */}
          <section className="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
            <h2 className="mb-1 text-[19px]">Who&rsquo;s your match?</h2>
            <p className="mb-3.5 font-ui text-[13px] text-ink-3">
              See how {SCORPIO.name} pairs with every sign.
            </p>
            <div className="flex flex-wrap gap-2">
              {PARTNER_SIGNS.filter((s) => s.key !== 'scorpio')
                .slice(0, 5)
                .map((s) => (
                  <Link
                    key={s.key}
                    href={`/compatibility/${pairSlug(s.key)}`}
                    className="rounded-full border border-line-2 bg-surface-2 px-3 py-2 font-ui text-xs text-ink-2 transition-colors hover:text-ink"
                  >
                    {s.name}
                  </Link>
                ))}
              <Link
                href="/compatibility"
                className="rounded-full border border-line-2 px-3 py-2 font-ui text-xs text-eyebrow"
              >
                all 12
              </Link>
            </div>
          </section>

          {/* featured quiz */}
          <section className="overflow-hidden rounded-[20px] border border-line bg-surface">
            <div className="relative h-[132px] overflow-hidden bg-gradient-to-br from-[#3a1030] via-[#1c1030] to-[#241338] sm:h-40">
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG thumbnail; next/image would need dangerouslyAllowSVG */}
              <img
                src="/quiz/what-kind-of-scorpio-are-you.svg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="p-5 pt-4 sm:p-6">
              <p className="eyebrow mb-2 text-gold">Personality · 2 min</p>
              <h3 className="mb-2 text-xl">What kind of Scorpio are you?</h3>
              <p className="mb-3.5 text-sm text-ink-2">
                Mystic, Detective, Phoenix or Sting? Six questions decide.
              </p>
              <Link
                href="/quiz/what-kind-of-scorpio-are-you"
                className="inline-flex min-h-[44px] items-center rounded-full border border-line-2 px-5 font-ui text-[13px] font-bold text-ink transition-colors hover:border-lilac"
              >
                Take the quiz
              </Link>
            </div>
          </section>
        </div>

        <div className="contents lg:flex lg:flex-col lg:gap-6">
          {/* know your sign */}
          <section className="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
            <h2 className="mb-3.5 text-[19px]">Know your sign</h2>
            <dl className="overflow-hidden rounded-2xl border border-line">
              {SIGN_FACTS.map(([k, v], i) => (
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
          </section>

          {/* newsletter */}
          <section className="rounded-[20px] border border-line-2 bg-gradient-to-b from-surface-2 to-surface p-5 sm:p-6">
            <h3 className="mb-1.5 text-[18px]">Your stars, in your inbox</h3>
            <p className="mb-3.5 text-[13px] text-ink-3">
              A short Scorpio reading every morning. Free.
            </p>
            <form className="flex gap-2" action="/signup">
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                aria-label="Email address"
                className="min-h-[46px] flex-1 rounded-xl border border-line-2 bg-void px-3.5 font-ui text-[13px] text-ink placeholder:text-ink-4 focus:border-lilac focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[46px] shrink-0 rounded-xl bg-garnet px-4 font-ui text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              >
                Join
              </button>
            </form>
          </section>
        </div>
      </div>
    </Container>
  )
}
