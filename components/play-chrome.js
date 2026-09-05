import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

/** Slim header + footer for quiz result pages (which live outside the site chrome). */
export function PlayHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[26rem] items-center justify-between px-5 py-4 sm:max-w-2xl sm:px-8">
      <Link href="/" className="flex items-baseline gap-1.5">
        <span className="font-display text-[15px] font-bold tracking-[0.16em] text-ink">
          {SITE_NAME.split(' ')[0].toUpperCase()}
        </span>
        <span className="font-body text-[13px] italic text-ink-3">
          {SITE_NAME.split(' ')[1]?.toLowerCase()}
        </span>
      </Link>
      <Link href="/quizzes" className="font-ui text-[12px] text-ink-3 hover:text-ink">
        All quizzes
      </Link>
    </header>
  )
}

export function PlayFooter() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-[26rem] border-t border-line/70 px-5 py-6 sm:max-w-2xl sm:px-8">
      <div className="mb-2 flex flex-wrap gap-x-3.5 gap-y-1 font-ui text-[12px] text-ink-4">
        <Link href="/horoscope" className="hover:text-ink-2">
          Horoscope
        </Link>
        <Link href="/compatibility" className="hover:text-ink-2">
          Compatibility
        </Link>
        <Link href="/quizzes" className="hover:text-ink-2">
          Quizzes
        </Link>
        <Link href="/account" className="hover:text-ink-2">
          Account
        </Link>
      </div>
      <p className="font-ui text-[11px] text-ink-5">For entertainment purposes only.</p>
    </footer>
  )
}
