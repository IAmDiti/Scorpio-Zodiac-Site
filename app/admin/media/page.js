import { requireAdmin } from '@/lib/admin/auth'
import { listMedia } from '@/lib/admin/media'
import { MediaManager } from './media-manager'

export const metadata = { title: 'Media · Admin' }

export default async function MediaPage() {
  await requireAdmin()

  let items = []
  let error = null
  try {
    items = await listMedia()
  } catch (e) {
    error = e?.message || 'Could not list media.'
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[24px] text-ink-bright">Media</h1>
        <p className="mt-1 font-ui text-[13px] text-ink-3">
          Images in the shared <code>media</code> bucket. Upload here, or straight from a
          post or quiz editor.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-garnet/40 bg-garnet/10 px-3 py-2 font-ui text-[12px] text-[#f0a9b8]">
          {error} — the <code>media</code> bucket may not exist yet (migration 0005).
        </p>
      ) : (
        <MediaManager items={items} />
      )}
    </div>
  )
}
