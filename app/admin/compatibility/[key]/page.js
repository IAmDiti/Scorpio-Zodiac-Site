import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getCompatibility, partnerSign } from '@/lib/compatibility'
import { Card } from '@/components/admin/ui'
import { CompatEditor } from './compat-editor'

export const metadata = { title: 'Edit compatibility · Admin' }

export default async function EditCompatibilityPage({ params }) {
  await requireAdmin()
  const { key } = await params
  const sign = partnerSign(key)
  if (!sign) notFound()

  const row = await getCompatibility(key)
  if (!row) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <h1 className="text-[20px] text-ink-bright">Scorpio &amp; {sign.name}</h1>
        <p className="font-ui text-[13px] text-ink-3">
          Not generated yet. Use the{' '}
          <Link href="/admin/compatibility" className="text-lilac">
            Generate
          </Link>{' '}
          button on the list.
        </p>
      </Card>
    )
  }

  return <CompatEditor partnerKey={key} partnerName={sign.name} row={row} />
}
