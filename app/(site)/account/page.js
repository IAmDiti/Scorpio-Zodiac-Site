import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'
import { Container } from '@/components/container'
import { signOut } from '@/app/(auth)/actions'
import { getSession } from '@/lib/auth'
import { getSavedItems } from '@/lib/profile'
import { getQuizHistory } from '@/lib/quiz-results'
import { allQuizzes } from '@/lib/quizzes/index.js'
import { sunSign } from '@/lib/astro/sky'
import { IconClock, IconHeart, IconChevronRight, IconQuiz } from '@/components/icons'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My Account' }

const KIND_ICON = { horoscope: IconClock, compatibility: IconHeart }

export default async function AccountPage() {
  const { user, profile } = await getSession()
  if (!user) redirect('/login?next=%2Faccount')

  // A profile row is created by a DB trigger; treat a missing one gracefully.
  const p = profile ?? { display_name: null, created_at: user.created_at }
  const initial = (p.display_name || user.email || '?').trim().charAt(0).toUpperCase()
  const sun = sunSign(p.birth_date)
  const joined = p.created_at
    ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null

  const saved = await getSavedItems()
  const quizHistory = await getQuizHistory()
  const quizzesBySlug = new Map((await allQuizzes()).map((q) => [q.slug, q]))

  return (
    <Container size="prose" className="py-6 sm:py-10">
      {/* header */}
      <div className="flex items-center gap-3.5 pb-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#3a2b4e] bg-gradient-to-br from-[#3a1440] to-[#1c1336]">
          <span className="font-display text-[22px] text-gold">{initial}</span>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[20px]">{p.display_name || 'Your account'}</h1>
          <p className="font-ui text-[12px] text-ink-3">
            {sun ? `Sun in ${sun.name}` : 'Add a birth date for your Sun sign'}
            {joined ? ` · joined ${joined}` : ''}
          </p>
        </div>
      </div>

      <AccountForm profile={p} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* saved */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px]">Saved readings</h2>
            <span className="font-ui text-[12px] text-ink-4">{saved.length}</span>
          </div>
          {saved.length ? (
            <ul className="flex flex-col gap-2.5">
              {saved.map((item) => {
                const Icon = KIND_ICON[item.kind] || IconClock
                const href =
                  item.kind === 'horoscope'
                    ? `/horoscope/${item.ref}`
                    : `/compatibility/scorpio-and-${item.ref}`
                return (
                  <li key={item.id}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3"
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0 text-lilac" />
                      <span className="min-w-0 flex-1 truncate font-ui text-[13px] text-ink">
                        {item.label}
                      </span>
                      <IconChevronRight className="h-4 w-4 shrink-0 text-ink-4" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="rounded-xl border border-line bg-surface p-4 font-ui text-[13px] text-ink-3">
              Nothing saved yet. Tap the heart on any horoscope or match report.
            </p>
          )}
        </section>

        {/* quiz history */}
        <section>
          <h2 className="mb-3 text-[15px]">Quiz history</h2>
          {quizHistory.length ? (
            <ul className="flex flex-col gap-2.5">
              {quizHistory.map((entry) => {
                const quiz = quizzesBySlug.get(entry.quiz_slug)
                const result = quiz?.results?.[entry.result_key]
                return (
                  <li key={entry.id}>
                    <Link
                      href={`/quiz/${entry.quiz_slug}/result`}
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3"
                    >
                      <IconQuiz className="h-[18px] w-[18px] shrink-0 text-lilac" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-ui text-[13px] text-ink">
                          {quiz?.title || entry.quiz_slug}
                        </span>
                        <span className="block truncate font-ui text-[11px] text-ink-4">
                          {result?.title || entry.result_key}
                        </span>
                      </span>
                      <IconChevronRight className="h-4 w-4 shrink-0 text-ink-4" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="rounded-xl border border-line bg-surface p-4">
              <p className="font-ui text-[13px] text-ink-3">No quizzes taken yet.</p>
              <Link
                href="/quizzes"
                className="mt-2 inline-block font-ui text-[12px] font-bold text-lilac"
              >
                Browse the quizzes
              </Link>
            </div>
          )}
        </section>
      </div>

      <form action={signOut} className="mx-auto max-w-sm pb-6 pt-8">
        <button
          type="submit"
          className="min-h-[46px] w-full rounded-full border border-line-2 font-ui text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          Sign out
        </button>
      </form>
    </Container>
  )
}
