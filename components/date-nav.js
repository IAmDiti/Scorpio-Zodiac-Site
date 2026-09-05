import Link from 'next/link'
import { IconChevronLeft, IconChevronRight } from '@/components/icons'
import { formatWeekday } from '@/lib/dates'

export function DateNav({ prev, next, label }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-void/50 px-3 py-2.5 font-ui">
      {prev ? (
        <Link
          href={`/horoscope/${prev}`}
          className="flex items-center gap-1 text-xs text-ink-3 transition-colors hover:text-ink"
        >
          <IconChevronLeft className="h-4 w-4" />
          {formatWeekday(prev)}
        </Link>
      ) : (
        <span className="w-12" />
      )}

      <span className="text-[13px] font-bold text-ink">{label}</span>

      {next ? (
        <Link
          href={`/horoscope/${next}`}
          className="flex items-center gap-1 text-xs text-ink-3 transition-colors hover:text-ink"
        >
          {formatWeekday(next)}
          <IconChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="w-12" />
      )}
    </div>
  )
}
