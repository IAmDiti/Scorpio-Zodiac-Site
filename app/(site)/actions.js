'use server'

import { revalidatePath } from 'next/cache'
import { captureSubscriber } from '@/lib/subscribers'

/**
 * Hero / footer email capture. One field, no password. Returns a serializable
 * result for useActionState so the form can show an inline confirmation.
 */
export async function subscribeAction(_prev, formData) {
  const email = formData.get('email')?.toString()
  const source = formData.get('source')?.toString() || 'hero'

  const res = await captureSubscriber({ email, source })
  if (res.error) return { error: res.error }

  // Keep the homepage subscriber counter roughly fresh.
  revalidatePath('/', 'page')
  return { ok: true }
}
