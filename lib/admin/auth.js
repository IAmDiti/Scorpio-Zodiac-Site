import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Who is allowed into /admin. A comma-separated allowlist in the environment,
// checked against the signed-in Supabase user's email. No allowlist ⇒ nobody
// is an admin, so the whole area 404s until it is configured (see DEPLOY.md).
function adminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  )
}

export function isAdminEmail(email) {
  if (!email) return false
  return adminEmails().has(email.toLowerCase())
}

export function isAdmin(user) {
  return isAdminEmail(user?.email)
}

/** The signed-in user, or null. */
export async function getAdminUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user ?? null
  } catch {
    return null
  }
}

/**
 * Gate a page, layout or Server Action. Not signed in ⇒ bounce to login and
 * come back here. Signed in but not on the allowlist ⇒ 404 (don't reveal that
 * an admin area exists).
 */
export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) redirect('/login?next=%2Fadmin')
  if (!isAdmin(user)) notFound()
  return user
}
