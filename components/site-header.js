'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { IconMenu } from '@/components/icons'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-20">
      <div className="mx-auto flex w-full max-w-[26rem] items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-1.5" onClick={() => setOpen(false)}>
          <span className="font-display text-base font-bold tracking-[0.16em] text-ink">
            {SITE_NAME.split(' ')[0].toUpperCase()}
          </span>
          <span className="font-body text-sm italic text-ink-3">
            {SITE_NAME.split(' ')[1]?.toLowerCase()}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-ui text-[13px] text-ink-3 sm:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="rounded-full border border-line-2 px-3.5 py-1.5 text-ink transition-colors hover:border-lilac"
          >
            Account
          </Link>
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
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 font-bold text-lilac transition-colors hover:bg-surface-2"
            >
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
