'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin.js'
import { generateCompatibility, getCompatibility, partnerSign } from '@/lib/compatibility'
import { saveCompatibilityEdits, deleteCompatibility, SCORE_KEYS } from '@/lib/admin/compatibility'
import { tidyProse, tidyHeadline } from '@/lib/prose'
import { pairSlug } from '@/lib/constants'

const PROSE = ['summary', 'spark', 'friction']

function revalidateCompat(key) {
  revalidatePath('/admin/compatibility')
  revalidatePath('/compatibility', 'layout')
  revalidatePath(`/compatibility/${pairSlug(key)}`)
}

async function generateAndStore(key) {
  const row = await generateCompatibility(key)
  const db = createAdminClient()
  const { error } = await db
    .from('compatibility')
    .upsert(row, { onConflict: 'partner_sign', ignoreDuplicates: false })
  if (error) throw new Error(error.message)
}

export async function regenerateCompatibilityAction(key) {
  await requireAdmin()
  if (!partnerSign(key)) return { error: 'Unknown sign.' }
  try {
    await generateAndStore(key)
  } catch (e) {
    return { error: e?.message || 'Generation failed.' }
  }
  revalidateCompat(key)
  return { ok: true, message: 'Regenerated.' }
}

export async function generateCompatibilityAndOpen(key) {
  await requireAdmin()
  if (!partnerSign(key)) return { error: 'Unknown sign.' }
  try {
    await generateAndStore(key)
  } catch (e) {
    return { error: e?.message || 'Generation failed.' }
  }
  revalidateCompat(key)
  redirect(`/admin/compatibility/${key}`)
}

export async function saveCompatibilityAction(key, _prev, formData) {
  await requireAdmin()
  const existing = await getCompatibility(key)
  if (!existing) return { error: 'Nothing to edit yet. Generate it first.' }

  const patch = { headline: tidyHeadline(formData.get('headline')?.toString() || '') }
  for (const k of PROSE) patch[k] = tidyProse(formData.get(k)?.toString() || '')

  const scores = {}
  for (const k of SCORE_KEYS) {
    scores[k] = Math.max(0, Math.min(100, Math.round(Number(formData.get(`score_${k}`))) || 0))
  }
  patch.scores = scores

  try {
    await saveCompatibilityEdits(key, patch)
  } catch (e) {
    return { error: e?.message || 'Could not save.' }
  }
  revalidateCompat(key)
  return { ok: true, message: 'Saved.' }
}

export async function deleteCompatibilityAction(key) {
  await requireAdmin()
  try {
    await deleteCompatibility(key)
  } catch (e) {
    return { error: e?.message || 'Could not delete.' }
  }
  revalidateCompat(key)
  redirect('/admin/compatibility')
}
