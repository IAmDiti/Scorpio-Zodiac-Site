import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

const FOOTER_LINKS = [
  { href: '/about-scorpio', label: 'About Scorpio' },
  { href: '/compatibility', label: 'Compatibility' },
  { href: '/quizzes', label: 'Quizzes' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/disclaimer', label: 'Disclaimer' },
]

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-10 border-t border-line/70 lg:mt-16">
      <div className="mx-auto w-full max-w-[26rem] px-5 py-7 sm:max-w-3xl sm:px-8 sm:py-9 lg:max-w-6xl lg:flex lg:items-center lg:justify-between">
        <div className="mb-3 flex flex-wrap gap-x-3.5 gap-y-2 font-ui text-xs text-ink-4 sm:text-[13px] lg:mb-0 lg:gap-x-6">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink-2">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="font-ui text-[11px] text-ink-5 sm:text-xs">
          For entertainment purposes only. &copy; {new Date().getFullYear()} {SITE_NAME}.
        </p>
      </div>
    </footer>
  )
}
