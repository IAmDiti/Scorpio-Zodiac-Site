'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateProfile, sanitizeProfileInput, toggleSavedItem } from '@/lib/profile'

export async function saveProfile(_prev, formData) {
  try {
    await updateProfile(sanitizeProfileInput(formData))
  } catch (e) {
    return { error: e?.message || 'Could not save.' }
  }
  revalidatePath('/account')
  return { ok: true }
}

export async function completeOnboarding(_prev, formData) {
  const next = formData.get('next')?.toString()
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account'
  try {
    await updateProfile({ ...sanitizeProfileInput(formData), onboarded: true })
  } catch (e) {
    return { error: e?.message || 'Could not save.' }
  }
  redirect(safeNext)
}

export async function skipOnboarding(formData) {
  const next = formData.get('next')?.toString()
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account'
  try {
    await updateProfile({ onboarded: true })
  } catch {
    // ignore — worst case they see onboarding again
  }
  redirect(safeNext)
}

/**
 * Toggle a saved horoscope / compatibility report for the current user.
 * Returns { needsAuth: true } for signed-out visitors so the client can
 * send them to sign up.
 */
export async function toggleSavedAction({ kind, ref, label }) {
  if (!['horoscope', 'compatibility'].includes(kind) || !ref) {
    return { error: 'bad request' }
  }
  try {
    const result = await toggleSavedItem({ kind, ref, label })
    revalidatePath('/account')
    return result
  } catch {
    return { needsAuth: true }
  }
}
