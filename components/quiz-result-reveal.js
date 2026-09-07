'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { QuizResultCard } from '@/components/quiz-result-card'
import { QuizShare } from '@/components/quiz-share'
import { unlockQuizResult } from '@/app/(play)/quiz/[slug]/actions'

const STORE_KEY = (slug) => `scorpio:quiz-unlock:${slug}`

/**
 * Shown in place of the quiz once it's finished. The result headline and
 * blurb are free; the traits, matches and share card sit behind one email
 * field. A prior unlock is remembered per-quiz in localStorage.
 */
export function QuizResultReveal({ quiz, resultKey, answers }) {
  const result = quiz.results[resultKey]
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORE_KEY(quiz.slug)))
    } catch {
      return false
    }
  })

  function onUnlock() {
    setUnlocked(true)
    try {
      localStorage.setItem(STORE_KEY(quiz.slug), '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
      <QuizResultCard
        quiz={quiz}
        resultKey={resultKey}
        eyebrow={quiz.title}
        locked={!unlocked}
        footer={
          unlocked ? (
            <UnlockedActions quiz={quiz} resultKey={resultKey} result={result} />
          ) : (
            <UnlockGate quiz={quiz} resultKey={resultKey} result={result} answers={answers} onUnlock={onUnlock} />
          )
        }
      />
    </div>
  )
}

function UnlockGate({ quiz, resultKey, result, answers, onUnlock }) {
  const [pending, start] = useTransition()
  const [error, setError] = useState(null)

  function submit(e) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')?.toString()
    setError(null)
    start(async () => {
      const res = await unlockQuizResult({ slug: quiz.slug, resultKey, answers, email })
      if (res?.error) setError(res.error)
      else onUnlock()
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line-2 bg-gradient-to-b from-surface-2 to-surface p-5 text-left">
      <p className="font-ui text-[13px] leading-relaxed text-ink-2">
        <strong className="text-ink-bright">Unlock your full {result.title} profile</strong> — your
        traits, your best matches and a card to share. Plus one short Scorpio reading each morning.
      </p>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className="min-h-[48px] flex-1 rounded-full border border-line-2 bg-void px-4 font-ui text-[13px] text-ink placeholder:text-ink-4 focus:border-lilac focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-[48px] shrink-0 rounded-full bg-garnet px-5 font-ui text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {pending ? 'Unlocking…' : 'Reveal my full result'}
        </button>
      </form>
      {error ? (
        <p className="font-ui text-[11px] text-[#f0a9b8]">{error}</p>
      ) : (
        <p className="font-ui text-[11px] text-ink-4">No password. Unsubscribe any time.</p>
      )}
    </div>
  )
}

const ghost =
  'flex min-h-[46px] flex-1 items-center justify-center rounded-full border border-line-2 font-ui text-[13px] text-ink-2 transition-colors hover:text-ink'

function UnlockedActions({ quiz, resultKey, result }) {
  return (
    <div className="flex flex-col gap-3">
      <QuizShare path={`/quiz/${quiz.slug}/r/${resultKey}`} text={result.shareLine} />
      <div className="flex gap-2.5">
        <Link href={`/quiz/${quiz.slug}`} className={ghost}>
          Retake
        </Link>
        <Link href="/quizzes" className={ghost}>
          More quizzes
        </Link>
      </div>
      <Link
        href="/horoscope"
        className="mt-1 text-center font-ui text-[12px] font-bold text-lilac"
      >
        Now read today&rsquo;s real Scorpio horoscope &rarr;
      </Link>
    </div>
  )
}
