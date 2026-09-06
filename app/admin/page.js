import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin.js'
import { SIGNS } from '@/lib/astro/zodiac'
import { Card } from '@/components/admin/ui'

export const metadata = { title: 'Dashboard · Admin' }

async function count(table, filter) {
  try {
    const db = createAdminClient()
    let q = db.from(table).select('*', { count: 'exact', head: true })
    if (filter) q = filter(q)
    const { count: n } = await q
    return n ?? 0
  } catch {
    return null
  }
}

const tile = 'rounded-xl border border-line bg-void px-4 py-3.5'

export default async function AdminDashboard() {
  await requireAdmin()

  const [posts, published, horoscopes, compatibility, quizzes] = await Promise.all([
    count('posts'),
    count('posts', (q) => q.eq('status', 'published')),
    count('daily_horoscopes'),
    count('compatibility'),
    count('quizzes'),
  ])

  const stats = [
    { label: 'Blog posts', value: posts, sub: published == null ? null : `${published} published`, href: '/admin/posts' },
    { label: 'Horoscope days', value: horoscopes, href: '/admin/horoscopes' },
    { label: 'Compatibility', value: compatibility, sub: `of ${SIGNS.length}`, href: '/admin/compatibility' },
    { label: 'Quizzes', value: quizzes, href: '/admin/quizzes' },
  ]

  const notConfigured = posts == null && quizzes == null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] text-ink-bright">Dashboard</h1>
        <p className="mt-1 font-ui text-[13px] text-ink-3">
          Everything you can publish and edit on the site.
        </p>
      </div>

      {notConfigured ? (
        <Card className="border-garnet/40 bg-garnet/5">
          <p className="font-ui text-[13px] text-[#f0a9b8]">
            The <code>posts</code> / <code>quizzes</code> tables aren’t there yet. Run
            <code className="mx-1">supabase/migrations/0005_admin_blog_quizzes.sql</code>
            in the Supabase SQL editor, then <code className="mx-1">npm run quizzes:seed</code>.
          </p>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`${tile} transition-colors hover:border-line-2`}>
            <p className="font-ui text-[11px] uppercase tracking-[0.06em] text-ink-4">{s.label}</p>
            <p className="mt-1 font-display text-[26px] text-ink-bright">
              {s.value == null ? '—' : s.value}
            </p>
            {s.sub ? <p className="font-ui text-[11px] text-ink-4">{s.sub}</p> : null}
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="text-[15px]">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2 font-ui text-[13px]">
          <Link href="/admin/posts/new" className="rounded-full bg-garnet px-4 py-2 font-bold text-white">
            Write a post
          </Link>
          <Link href="/admin/media" className="rounded-full border border-line-2 px-4 py-2 text-ink-2 hover:text-ink">
            Upload an image
          </Link>
          <Link href="/admin/horoscopes" className="rounded-full border border-line-2 px-4 py-2 text-ink-2 hover:text-ink">
            Edit today’s horoscope
          </Link>
        </div>
      </Card>
    </div>
  )
}
