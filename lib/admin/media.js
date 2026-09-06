import { createAdminClient } from '@/lib/supabase/admin.js'

// Every uploaded image lives in one public Supabase Storage bucket. Reads are
// public (a bucket policy, see migration 0005); writes and deletes go through
// the service-role client from trusted admin code only.
export const MEDIA_BUCKET = 'media'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

function slugifyName(name) {
  return (
    name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'image'
  )
}

/** Public URL for a stored object path. */
export function mediaPublicUrl(path) {
  const db = createAdminClient()
  const { data } = db.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Store one uploaded File. Returns { path, url } or throws a friendly Error.
 * The stored name is `<slug>-<8 hex>.<ext>` so re-uploading never clobbers.
 */
export async function uploadMedia(file, { prefix = '' } = {}) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('No file provided.')

  const ext = ALLOWED[file.type]
  if (!ext) throw new Error('Use a JPG, PNG, WebP, GIF or AVIF image.')
  if (file.size > MAX_BYTES) throw new Error('That image is over 8 MB. Compress it first.')

  const hash = Math.random().toString(16).slice(2, 10)
  const dir = prefix ? `${prefix.replace(/^\/+|\/+$/g, '')}/` : ''
  const path = `${dir}${slugifyName(file.name)}-${hash}.${ext}`

  const db = createAdminClient()
  const { error } = await db.storage
    .from(MEDIA_BUCKET)
    .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false })
  if (error) throw new Error(error.message)

  return { path, url: mediaPublicUrl(path) }
}

/** List stored objects, newest first. */
export async function listMedia({ limit = 100 } = {}) {
  const db = createAdminClient()
  const { data, error } = await db.storage.from(MEDIA_BUCKET).list('', {
    limit,
    sortBy: { column: 'created_at', order: 'desc' },
  })
  if (error) throw new Error(error.message)

  return (data ?? [])
    .filter((o) => o.id) // folders have a null id
    .map((o) => ({
      name: o.name,
      path: o.name,
      url: mediaPublicUrl(o.name),
      size: o.metadata?.size ?? null,
      createdAt: o.created_at ?? null,
    }))
}

export async function deleteMedia(path) {
  if (!path) throw new Error('No path.')
  const db = createAdminClient()
  const { error } = await db.storage.from(MEDIA_BUCKET).remove([path])
  if (error) throw new Error(error.message)
}
