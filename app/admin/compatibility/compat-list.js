'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { generateCompatibilityAndOpen } from './actions'

export function CompatList({ signs }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {signs.map((s) => (
        <li key={s.key} className="flex items-center gap-3 px-4 py-3">
          <span className="w-24 shrink-0 font-ui text-[13px] text-ink">{s.name}</span>
          {s.row ? (
            <>
              <span className="min-w-0 flex-1 truncate font-ui text-[12px] text-ink-4">
                {s.row.headline}
              </span>
              <Link
                href={`/admin/compatibility/${s.key}`}
                className="rounded-full border border-line-2 px-3 py-1 font-ui text-[11px] text-ink-2 hover:text-ink"
              >
                Edit
              </Link>
            </>
          ) : (
            <>
              <span className="min-w-0 flex-1 font-ui text-[12px] text-ink-5">not generated</span>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await generateCompatibilityAndOpen(s.key)
                    router.refresh()
                  })
                }
                className="rounded-full bg-garnet px-3 py-1 font-ui text-[11px] font-bold text-white disabled:opacity-60"
              >
                {pending ? '…' : 'Generate'}
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}
