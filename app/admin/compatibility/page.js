import { requireAdmin } from '@/lib/admin/auth'
import { listCompatibility } from '@/lib/admin/compatibility'
import { SIGNS } from '@/lib/astro/zodiac'
import { CompatList } from './compat-list'

export const metadata = { title: 'Compatibility · Admin' }

export default async function AdminCompatibilityPage() {
  await requireAdmin()

  let rows = []
  let error = null
  try {
    rows = await listCompatibility()
  } catch (e) {
    error = e?.message || 'Could not load.'
  }
  const byKey = new Map(rows.map((r) => [r.partner_sign, r]))
  const signs = SIGNS.map((s) => ({ key: s.key, name: s.name, row: byKey.get(s.key) || null }))

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[24px] text-ink-bright">Compatibility</h1>
        <p className="mt-1 font-ui text-[13px] text-ink-3">
          Scorpio paired with every sign. Edit the write-up and scores, or regenerate.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-garnet/40 bg-garnet/10 px-3 py-2 font-ui text-[12px] text-[#f0a9b8]">
          {error}
        </p>
      ) : (
        <CompatList signs={signs} />
      )}
    </div>
  )
}
