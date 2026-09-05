'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

export default function SiteError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[26rem] flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow mb-3">Something went wrong</p>
      <h1 className="text-[26px] text-ink-bright">The stars misaligned</h1>
      <p className="mt-3 text-ink-2">This page hit an error. Try again, or head back home.</p>
      <div className="mt-6 flex gap-2.5">
        <button
          onClick={reset}
          className="rounded-full bg-garnet px-5 py-2.5 font-ui text-[13px] font-bold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-line-2 px-5 py-2.5 font-ui text-[13px] font-bold text-ink"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
