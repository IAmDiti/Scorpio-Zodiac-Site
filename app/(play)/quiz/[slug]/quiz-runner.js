'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { submitQuiz } from './actions'
import { stashAnswers } from '@/lib/quiz-storage'
import { IconChevronLeft, IconArrowRight } from '@/components/icons'

export function QuizRunner({ quiz }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(() => Array(quiz.questions.length).fill(null))
  const [submitting, startSubmit] = useTransition()
  const [error, setError] = useState(null)

  const question = quiz.questions[step]
  const total = quiz.questions.length
  const chosen = answers[step]
  const isLast = step === total - 1

  function choose(optionIndex) {
    setAnswers((prev) => {
      const nextAnswers = [...prev]
      nextAnswers[step] = optionIndex
      return nextAnswers
    })
  }

  function next() {
    if (chosen == null) return
    if (!isLast) {
      setStep((s) => s + 1)
      return
    }
    finish()
  }

  function finish() {
    setError(null)
    stashAnswers(quiz.slug, answers)
    startSubmit(async () => {
      const res = await submitQuiz({ slug: quiz.slug, answers })
      if (res?.needsAuth) {
        router.push(`/signup?next=${encodeURIComponent(`/quiz/${quiz.slug}/result`)}`)
        return
      }
      if (res?.error) {
        setError('Something went wrong scoring that. Try again.')
        return
      }
      router.push(`/quiz/${quiz.slug}/result`)
      router.refresh()
    })
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[26rem] flex-col px-5 pb-8 pt-5">
      {/* progress */}
      <div className="flex items-center justify-between">
        <span className="font-ui text-[12px] text-ink-3">{quiz.title}</span>
        <Link href="/quizzes" aria-label="Leave quiz" className="text-ink-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
      </div>
      <div className="mt-3.5 flex items-center gap-2.5">
        <div className="h-1.5 flex-1 rounded-full bg-[#201830]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet to-garnet transition-all"
            style={{ width: `${((step + (chosen != null ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        <span className="whitespace-nowrap font-ui text-[11px] text-ink-4">
          {step + 1} / {total}
        </span>
      </div>

      {/* question */}
      <div className="pt-8">
        <p className="eyebrow mb-3.5">Question {step + 1}</p>
        <h1 className="text-[23px] text-ink-bright">{question.q}</h1>
      </div>

      {/* options */}
      <div className="mt-5 flex flex-col gap-2.5">
        {question.options.map((opt, i) => {
          const selected = chosen === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              className={`flex min-h-[52px] items-center gap-3 rounded-2xl px-4 py-3 text-left font-ui text-[14px] transition-colors ${
                selected
                  ? 'border border-violet bg-[#1e1636] text-ink shadow-[0_0_20px_rgba(124,92,255,0.22)]'
                  : 'border border-line bg-surface text-ink-2 hover:border-line-2'
              }`}
            >
              <span
                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
                  selected ? 'bg-violet' : 'border-[1.5px] border-line-2'
                }`}
              >
                {selected ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0b0812"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : null}
              </span>
              {opt.label}
            </button>
          )
        })}
      </div>

      {error ? <p className="mt-3 font-ui text-[12px] text-[#f0a9b8]">{error}</p> : null}

      {/* nav */}
      <div className="mt-auto flex gap-2.5 pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex h-[50px] w-[52px] items-center justify-center rounded-full border border-line-2 text-ink-3 disabled:opacity-40"
        >
          <IconChevronLeft className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={next}
          disabled={chosen == null || submitting}
          className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-full bg-garnet font-ui text-[14px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Reading your stars…' : isLast ? 'See my result' : 'Next'}
          {!submitting ? <IconArrowRight className="h-4 w-4" /> : null}
        </button>
      </div>
    </div>
  )
}
