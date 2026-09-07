'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { IconMenu } from '@/components/icons'
import { createClient } from '@/lib/supabase/client'

// Logged-out visitors are the ones we're trying to convert, so the default
// (and server-rendered) state shows "Log in / Join free". If the browser
// session says they're already in, swap to a single "Account" link.
function useAuthed() {
  const [authed, setAuthed] = useState(false)
  useEffect(() => {
    let active = true
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        if (active) setAuthed(Boolean(data?.user))
      })
    } catch {
      /* Supabase not configured — stay logged-out */
    }
    return () => {
      active = false
    }
  }, [])
  return authed
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const authed = useAuthed()

  return (
    <header className="relative z-20">
      <div className="mx-auto flex w-full max-w-[26rem] items-center justify-between px-5 py-4 sm:max-w-3xl sm:px-8 lg:max-w-6xl lg:py-5">
        <Link href="/" className="flex items-baseline gap-1.5" onClick={() => setOpen(false)}>
          <span className="font-display text-base font-bold tracking-[0.16em] text-ink lg:text-lg">
            {SITE_NAME.split(' ')[0].toUpperCase()}
          </span>
          <span className="font-body text-sm italic text-ink-3 lg:text-[15px]">
            {SITE_NAME.split(' ')[1]?.toLowerCase()}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-ui text-[13px] text-ink-3 sm:flex lg:gap-8 lg:text-sm">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
          {authed ? (
            <Link
              href="/account"
              className="rounded-full border border-line-2 px-3.5 py-1.5 text-ink transition-colors hover:border-lilac"
            >
              Account
            </Link>
          ) : (
            <span className="flex items-center gap-3">
              <Link href="/login" className="text-ink-2 transition-colors hover:text-ink">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-garnet px-3.5 py-1.5 font-bold text-white transition-opacity hover:opacity-90"
              >
                Join free
              </Link>
            </span>
          )}
        </nav>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-lilac sm:hidden"
        >
          <IconMenu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="mx-auto w-full max-w-[26rem] px-5 pb-4 sm:hidden">
          <nav className="flex flex-col gap-1 rounded-2xl border border-line bg-surface/95 p-2 font-ui text-sm backdrop-blur">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            {authed ? (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-bold text-lilac transition-colors hover:bg-surface-2"
              >
                Account
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-0.5 rounded-xl bg-garnet px-3 py-2.5 text-center font-bold text-white"
                >
                  Join free
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
