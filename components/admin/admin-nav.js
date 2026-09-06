'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/posts', label: 'Blog' },
  { href: '/admin/horoscopes', label: 'Horoscopes' },
  { href: '/admin/compatibility', label: 'Compatibility' },
  { href: '/admin/quizzes', label: 'Quizzes' },
  { href: '/admin/media', label: 'Media' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto font-ui text-[13px]">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`shrink-0 rounded-full px-3.5 py-2 transition-colors ${
              active
                ? 'bg-lilac font-bold text-void'
                : 'border border-line-2 text-ink-2 hover:text-ink'
            }`}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
