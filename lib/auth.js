import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'

/** The signed-in user, or null (also null if Supabase isn't configured). */
export async function getUser() {
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

/** The signed-in user with their profile row, or nulls. */
export async function getSession() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { user: null, profile: null }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    return { user, profile: profile ?? null }
  } catch {
    return { user: null, profile: null }
  }
}

/** Redirect to login (preserving where the user was headed) unless signed in. */
export async function requireUser(next = '/account') {
  const user = await getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`)
  return user
}

/** Where to send someone straight after authenticating. */
export function postAuthDestination(profile, next) {
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account'
  if (!profile?.onboarded) {
    return `/onboarding?next=${encodeURIComponent(safeNext)}`
  }
  return safeNext
}
