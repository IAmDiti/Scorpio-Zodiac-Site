import { createAdminClient } from '@/lib/supabase/admin.js'

// Admin helpers for the compatibility table. Generation reuses
// lib/compatibility.js (generateCompatibility, getCompatibility).

export const SCORE_KEYS = ['passion', 'trust', 'communication', 'friendship', 'overall']

export async function listCompatibility() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('compatibility')
    .select('partner_sign, headline, model, generated_at')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function saveCompatibilityEdits(partnerKey, patch) {
  const db = createAdminClient()
  const { error } = await db.from('compatibility').update(patch).eq('partner_sign', partnerKey)
  if (error) throw new Error(error.message)
}

export async function deleteCompatibility(partnerKey) {
  const db = createAdminClient()
  const { error } = await db.from('compatibility').delete().eq('partner_sign', partnerKey)
  if (error) throw new Error(error.message)
}
