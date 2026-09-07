import { createAdminClient } from '@/lib/supabase/admin.js'

// Email capture that isn't a full account. Every write is server-side, after
// the address has been validated. See migration 0006.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const SOURCES = new Set(['hero', 'quiz', 'compat', 'preview', 'footer'])

export function isEmail(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value)
}

/**
 * Record a subscriber. Idempotent on email — a repeat submit is a no-op, not
 * an error, so the UI can always show success. Returns { ok } or { error }.
 */
export async function captureSubscriber({ email, source = 'hero', quizSlug, resultKey }) {
  const clean = (email || '').toString().trim().toLowerCase()
  if (!isEmail(clean)) return { error: 'Enter a valid email address.' }

  try {
    const db = createAdminClient()
    const { error } = await db.from('subscribers').upsert(
      {
        email: clean,
        source: SOURCES.has(source) ? source : 'hero',
        marketing_opt_in: true,
        ref_quiz_slug: quizSlug || null,
        ref_result_key: resultKey || null,
      },
      { onConflict: 'email', ignoreDuplicates: true }
    )
    if (error) throw error
    return { ok: true }
  } catch (e) {
    console.error('captureSubscriber failed', e)
    return { error: 'Something went wrong. Try again in a moment.' }
  }
}

/** Total subscribers, for the social-proof counter. Never throws. */
export async function subscriberCount() {
  try {
    const db = createAdminClient()
    const { count } = await db
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
    return count ?? 0
  } catch {
    return 0
  }
}
