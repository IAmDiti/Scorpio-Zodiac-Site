import { createAdminClient } from '@/lib/supabase/admin.js'

// Admin CRUD for blog posts. Callers must have passed requireAdmin() first.

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function listPosts() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('posts')
    .select('id, slug, title, status, published_at, updated_at')
    .order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getPost(id) {
  const db = createAdminClient()
  const { data, error } = await db.from('posts').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

/** Make `base` unique in the posts table, ignoring row `exceptId`. */
async function uniqueSlug(base, exceptId) {
  const db = createAdminClient()
  let slug = base || 'post'
  for (let n = 0; n < 50; n++) {
    const candidate = n === 0 ? slug : `${slug}-${n + 1}`
    let q = db.from('posts').select('id').eq('slug', candidate)
    if (exceptId) q = q.neq('id', exceptId)
    const { data } = await q.maybeSingle()
    if (!data) return candidate
  }
  return `${slug}-${Date.now()}`
}

function cleanPatch(input) {
  const patch = {}
  if (input.title != null) patch.title = String(input.title).trim().slice(0, 200)
  if (input.excerpt != null) patch.excerpt = String(input.excerpt).trim().slice(0, 400)
  if (input.body != null) patch.body = String(input.body)
  if (input.cover_url != null) patch.cover_url = String(input.cover_url).trim() || null
  return patch
}

export async function createPost(input, authorEmail) {
  const db = createAdminClient()
  const title = String(input.title || '').trim()
  if (!title) throw new Error('A title is required.')

  const slug = await uniqueSlug(slugify(input.slug || title))
  const row = {
    ...cleanPatch(input),
    title,
    slug,
    status: 'draft',
    author_email: authorEmail || null,
  }
  const { data, error } = await db.from('posts').insert(row).select('id').single()
  if (error) throw new Error(error.message)
  return data.id
}

export async function updatePost(id, input) {
  const db = createAdminClient()
  const patch = cleanPatch(input)
  if (input.slug != null) {
    patch.slug = await uniqueSlug(slugify(input.slug), id)
  }
  const { error } = await db.from('posts').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function setPostStatus(id, status) {
  if (!['draft', 'published'].includes(status)) throw new Error('Bad status.')
  const db = createAdminClient()
  const patch = { status }
  if (status === 'published') {
    const current = await getPost(id)
    patch.published_at = current?.published_at || new Date().toISOString()
  }
  const { error } = await db.from('posts').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deletePost(id) {
  const db = createAdminClient()
  const { error } = await db.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
