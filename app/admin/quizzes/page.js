import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { listQuizzes } from '@/lib/admin/quizzes'
import { Card } from '@/components/admin/ui'
import { NewQuizForm } from './new-quiz-form'

export const metadata = { title: 'Quizzes · Admin' }

export default async function AdminQuizzesPage() {
  await requireAdmin()

  let quizzes = []
  let error = null
  try {
    quizzes = await listQuizzes()
  } catch (e) {
    error = e?.message || 'Could not load quizzes.'
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[24px] text-ink-bright">Quizzes</h1>
        <p className="mt-1 font-ui text-[13px] text-ink-3">
          Stored in the database. If this list is empty, run{' '}
          <code>npm run quizzes:seed</code> to import the six built-in quizzes.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-garnet/40 bg-garnet/10 px-3 py-2 font-ui text-[12px] text-[#f0a9b8]">
          {error} — run migration 0005 first.
        </p>
      ) : quizzes.length === 0 ? (
        <p className="font-ui text-[13px] text-ink-4">
          No quizzes in the database yet (the site is serving the six bundled ones).
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {quizzes.map((q) => (
            <li key={q.slug}>
              <Link
                href={`/admin/quizzes/${q.slug}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <span className="w-6 shrink-0 font-ui text-[11px] text-ink-5">{q.sort_order}</span>
                <span className="min-w-0 flex-1 truncate font-ui text-[13px] text-ink">
                  {q.title}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-ui text-[10px] font-bold uppercase ${
                    q.status === 'published'
                      ? 'bg-violet/20 text-lilac'
                      : 'border border-line-2 text-ink-4'
                  }`}
                >
                  {q.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Card>
        <h2 className="mb-3 text-[15px]">New quiz</h2>
        <NewQuizForm />
      </Card>
    </div>
  )
}
