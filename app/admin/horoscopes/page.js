import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { listHoroscopes } from '@/lib/admin/horoscopes'
import { todayISO, formatMedium } from '@/lib/dates'
import { Card } from '@/components/admin/ui'
import { GenerateHoroscopeForm } from './generate-form'

export const metadata = { title: 'Horoscopes · Admin' }

export default async function AdminHoroscopesPage() {
  await requireAdmin()
  const today = todayISO()

  let rows = []
  let error = null
  try {
    rows = await listHoroscopes()
  } catch (e) {
    error = e?.message || 'Could not load horoscopes.'
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[24px] text-ink-bright">Horoscopes</h1>
        <p className="mt-1 font-ui text-[13px] text-ink-3">
          Generated daily by the cron job. Edit the copy, or force a regenerate.
        </p>
      </div>

      <Card>
        <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.06em] text-ink-4">
          Generate a specific day
        </p>
        <GenerateHoroscopeForm today={today} />
      </Card>

      {error ? (
        <p className="rounded-lg border border-garnet/40 bg-garnet/10 px-3 py-2 font-ui text-[12px] text-[#f0a9b8]">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <p className="font-ui text-[13px] text-ink-4">No horoscopes stored yet.</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {rows.map((r) => (
            <li key={r.date}>
              <Link
                href={`/admin/horoscopes/${r.date}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <span className="w-28 shrink-0 font-ui text-[12px] text-ink-3">
                  {formatMedium(r.date)}
                  {r.date === today ? <span className="ml-1.5 text-gold">·today</span> : null}
                </span>
                <span className="min-w-0 flex-1 truncate font-ui text-[13px] text-ink">
                  {r.headline || <span className="text-ink-4">no headline</span>}
                </span>
                <span className="hidden font-ui text-[10px] text-ink-5 sm:inline">{r.model}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
