import Link from 'next/link'
import { Constellation } from '@/components/constellation'
import {
  IconArrowRight,
  IconClock,
  IconHeart,
  IconMoon,
  IconQuiz,
  IconScorpio,
} from '@/components/icons'
import { SCORPIO, PARTNER_SIGNS } from '@/lib/constants'

export const metadata = {
  title: 'Daily Scorpio Horoscope & Compatibility',
}

// Placeholder content until the daily-horoscope pipeline is wired (Phase 3).
const PREVIEW = {
  headline: 'The depths call today',
  teaser:
    'The Moon slips into Pisces and meets your ruler Pluto — intuition runs ahead of logic. Trust the first thing you feel, not the fifth thing you talk yourself into.',
  transits: 'Moon in Pisces · Mars trine Pluto · Mercury direct',
}

export default function HomePage() {
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto w-full max-w-[26rem] px-5">
      {/* hero */}
      <section className="pb-7 pt-3">
        <Constellation className="mb-3.5 h-24 w-full opacity-90" />
        <p className="eyebrow mb-2.5">{dateLabel}</p>
        <h1 className="text-[clamp(28px,9vw,34px)] text-ink-bright text-balance">
          {PREVIEW.headline}
        </h1>
        <p className="mt-3.5 text-base text-ink-2">{PREVIEW.teaser}</p>

        <div className="mt-5 flex flex-col gap-2.5">
          <Link
            href="/horoscope"
            className="flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-garnet px-4 text-center font-ui text-sm font-bold tracking-[0.04em] text-white transition-opacity hover:opacity-90"
          >
            Read your full horoscope
            <IconArrowRight className="h-4 w-4 shrink-0" />
          </Link>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-ui text-xs text-ink-4">
            <IconMoon className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span>{PREVIEW.transits}</span>
          </p>
        </div>
      </section>

      {/* quick nav */}
      <section className="grid grid-cols-3 gap-2.5">
        {[
          { href: '/horoscope', label: 'Horoscope', icon: IconClock },
          { href: '/compatibility', label: 'Compatibility', icon: IconHeart },
          { href: '/quizzes', label: 'Quizzes', icon: IconQuiz },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-line bg-surface p-3.5 text-center transition-colors hover:border-line-2"
          >
            <Icon className="mx-auto mb-2 h-[22px] w-[22px] text-lilac" />
            <span className="font-ui text-xs font-bold text-ink">{label}</span>
          </Link>
        ))}
      </section>

      {/* cosmic weather */}
      <section className="mt-6 flex items-center gap-4 rounded-[18px] border border-line-2 bg-gradient-to-br from-surface-2 to-surface p-[18px]">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-[0_0_24px_rgba(217,180,106,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_34%,#f3ecd9,#cdbf9c)]" />
          <div className="absolute -right-[15px] -top-1.5 h-[68px] w-[52px] rounded-full bg-surface-2" />
        </div>
        <div>
          <p className="eyebrow mb-1.5">Tonight&rsquo;s sky</p>
          <p className="text-sm text-ink-2">
            Waxing gibbous, 84% lit. A good night to finish something quietly rather than start
            something loud.
          </p>
        </div>
      </section>

      {/* compatibility teaser */}
      <section className="mt-6">
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
                href={`/compatibility/scorpio-and-${s.key}`}
                className="rounded-full border border-line-2 bg-surface-2 px-3 py-2 font-ui text-xs text-ink-2 transition-colors hover:text-ink"
              >
                {s.name}
              </Link>
            ))}
          <Link
            href="/compatibility"
            className="rounded-full border border-line-2 px-3 py-2 font-ui text-xs text-eyebrow"
          >
            +7 more
          </Link>
        </div>
      </section>

      {/* featured quiz */}
      <section className="mt-6 overflow-hidden rounded-[20px] border border-line bg-surface">
        <div className="relative h-[132px] bg-gradient-to-br from-[#3a1030] via-[#1c1030] to-[#241338]">
          <Constellation className="h-full w-full opacity-60" />
        </div>
        <div className="p-[18px] pt-4">
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

      {/* know your sign */}
      <section className="mt-6">
        <h2 className="mb-3.5 text-[19px]">Know your sign</h2>
        <dl className="overflow-hidden rounded-2xl border border-line">
          {[
            ['Dates', 'Oct 23 – Nov 21'],
            ['Element', SCORPIO.element],
            ['Quality', SCORPIO.modality],
            ['Ruling planets', 'Mars & Pluto'],
          ].map(([k, v], i) => (
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
      <section className="mt-7 rounded-[20px] border border-line-2 bg-gradient-to-b from-surface-2 to-surface p-5">
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

      <div className="h-4" />
    </div>
  )
}
