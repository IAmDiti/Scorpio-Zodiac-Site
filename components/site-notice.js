'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const KEY = 'scorpio-cookie-notice'

export function SiteNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (!localStorage.getItem(KEY)) setShow(true)
      } catch {
        /* storage blocked — don't nag */
      }
    }, 0)
    return () => clearTimeout(id)
  }, [])

  if (!show) return null

  function dismiss() {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  return (
    <>
      {/* keeps the fixed bar from covering the footer */}
      <div aria-hidden className="h-[92px] sm:h-[64px]" />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line-2 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="font-ui text-[12px] leading-relaxed text-ink-3">
            Scorpio Daily uses only the cookies needed to keep you signed in, plus cookieless
            analytics — no ad tracking.{' '}
            <Link href="/privacy" className="text-lilac underline-offset-2 hover:underline">
              Privacy
            </Link>
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 self-start rounded-full bg-garnet px-4 py-1.5 font-ui text-[12px] font-bold text-white sm:self-auto"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  )
}
