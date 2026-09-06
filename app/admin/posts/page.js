import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { listPosts } from '@/lib/admin/posts'

export const metadata = { title: 'Blog · Admin' }

function StatusPill({ status }) {
  const published = status === 'published'
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-[0.06em] ${
        published ? 'bg-violet/20 text-lilac' : 'border border-line-2 text-ink-4'
      }`}
    >
      {status}
    </span>
  )
}

export default async function AdminPostsPage() {
  await requireAdmin()

  let posts = []
  let error = null
  try {
    posts = await listPosts()
  } catch (e) {
    error = e?.message || 'Could not load posts.'
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] text-ink-bright">Blog</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-garnet px-4 py-2 font-ui text-[13px] font-bold text-white"
        >
          New post
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg border border-garnet/40 bg-garnet/10 px-3 py-2 font-ui text-[12px] text-[#f0a9b8]">
          {error} — run migration 0005 to create the <code>posts</code> table.
        </p>
      ) : posts.length === 0 ? (
        <p className="font-ui text-[13px] text-ink-4">No posts yet. Write your first one.</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/posts/${p.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <span className="min-w-0 flex-1 truncate font-ui text-[13px] text-ink">
                  {p.title}
                </span>
                <StatusPill status={p.status} />
                <span className="hidden font-ui text-[11px] text-ink-5 sm:inline">
                  {new Date(p.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
