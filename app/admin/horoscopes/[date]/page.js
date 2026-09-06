import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getHoroscope } from '@/lib/horoscope'
import { isValidDateISO, formatLong } from '@/lib/dates'
import { Card } from '@/components/admin/ui'
import { HoroscopeEditor } from './horoscope-editor'

export const metadata = { title: 'Edit horoscope · Admin' }

export default async function EditHoroscopePage({ params }) {
  await requireAdmin()
  const { date } = await params
  if (!isValidDateISO(date)) notFound()

  const row = await getHoroscope(date)

  if (!row) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <h1 className="text-[20px] text-ink-bright">{formatLong(date)}</h1>
        <p className="font-ui text-[13px] text-ink-3">
          No horoscope is stored for this day. Generate one from the{' '}
          <Link href="/admin/horoscopes" className="text-lilac">
            horoscopes list
          </Link>
          .
        </p>
      </Card>
    )
  }

  return <HoroscopeEditor dateISO={date} dateLabel={formatLong(date)} row={row} />
}
