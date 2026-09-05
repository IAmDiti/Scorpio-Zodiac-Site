'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { submitQuiz } from '../actions'
import { readStash, clearStash } from '@/lib/quiz-storage'

export function ClaimPendingResult({ slug }) {
  const router = useRouter()
  const [status, setStatus] = useState('loading')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const answers = readStash(slug)
    const pending = answers ? submitQuiz({ slug, answers }) : Promise.resolve({ noStash: true })

    pending.then((res) => {
      if (res?.ok) {
        clearStash(slug)
        router.refresh()
        return
      }
      if (res?.noStash) {
        setStatus('none')
        return
      }
      setStatus(res?.needsAuth ? 'needsAuth' : 'error')
    })
  }, [slug, router])

  if (status === 'loading') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="font-ui text-[13px] text-ink-3">Revealing your result…</p>
      </div>
    )
  }

  if (status === 'needsAuth') {
    return (
      <div className="rounded-2xl border border-line-2 bg-gradient-to-b from-surface-2 to-surface p-6 text-center">
        <h1 className="text-[20px] text-ink-bright">One step to see it</h1>
        <p className="mt-2.5 font-ui text-[13px] text-ink-3">
          Create a free account and your result is right here waiting.
        </p>
        <Link
          href={`/signup?next=${encodeURIComponent(`/quiz/${slug}/result`)}`}
          className="mt-5 inline-flex min-h-[46px] items-center rounded-full bg-garnet px-6 font-ui text-[13px] font-bold text-white"
        >
          Create free account
        </Link>
      </div>
    )
  }

  // none / error
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 text-center">
      <h1 className="text-[20px] text-ink-bright">
        {status === 'error' ? 'That didn’t take' : 'You haven’t taken this one yet'}
      </h1>
      <Link
        href={`/quiz/${slug}`}
        className="mt-5 inline-flex min-h-[46px] items-center rounded-full bg-garnet px-6 font-ui text-[13px] font-bold text-white"
      >
        {status === 'error' ? 'Try again' : 'Take the quiz'}
      </Link>
    </div>
  )
}
