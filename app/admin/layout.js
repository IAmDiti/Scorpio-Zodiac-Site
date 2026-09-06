import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { signOut } from '@/app/(auth)/actions'
import { AdminNav } from '@/components/admin/admin-nav'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin', robots: { index: false, follow: false } }

export default async function AdminLayout({ children }) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-void">
      <header className="border-b border-line bg-surface/60">
        <div className="mx-auto w-full max-w-5xl px-5 py-3.5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-sm font-bold tracking-[0.16em] text-ink">
              SCORPIO <span className="font-body text-[13px] italic text-ink-3">admin</span>
            </span>
            <div className="flex items-center gap-3 font-ui text-[12px] text-ink-4">
              <Link href="/" className="hover:text-ink-2">
                View site ↗
              </Link>
              <span className="hidden sm:inline">{user.email}</span>
              <form action={signOut}>
                <button type="submit" className="hover:text-ink-2">
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <div className="mt-3">
            <AdminNav />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  )
}
