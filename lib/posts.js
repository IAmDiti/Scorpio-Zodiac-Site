import { marked } from 'marked'
import { createAdminClient } from '@/lib/supabase/admin.js'

// Public blog reads. Like lib/horoscope.js, these go through the service-role
// client with an explicit `status = 'published'` filter (works at build time,
// where a cookie-scoped client would not) rather than relying on RLS.
//
// Post bodies are Markdown authored only by allow-listed admins (see
// lib/admin/auth.js), so the rendered HTML is trusted and used with
// dangerouslySetInnerHTML without a separate sanitizer.

marked.setOptions({ gfm: true, breaks: false })

export function renderMarkdown(md) {
  return marked.parse(md || '')
}

function normalize(row) {
  if (!row) return null
  return { ...row, html: renderMarkdown(row.body) }
}

/** Published posts, newest first. Returns [] if the table doesn't exist yet. */
export async function listPublishedPosts({ limit = 50 } = {}) {
  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('posts')
      .select('id, slug, title, excerpt, cover_url, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

/** One published post by slug, with rendered `html`, or null. */
export async function getPublishedPost(slug) {
  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (error) throw error
    return normalize(data)
  } catch {
    return null
  }
}
