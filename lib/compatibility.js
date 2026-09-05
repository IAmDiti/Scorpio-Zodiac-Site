import { createAdminClient } from './supabase/admin.js'
import { completeJSON } from './anthropic.js'
import { SIGNS } from './astro/zodiac.js'
import { COMPATIBILITY_SCHEMA, buildCompatibilityPrompt } from './prompts/compatibility.js'

export function partnerSign(key) {
  return SIGNS.find((s) => s.key === key) ?? null
}

export async function getCompatibility(partnerKey) {
  const db = createAdminClient()
  const { data, error } = await db
    .from('compatibility')
    .select('*')
    .eq('partner_sign', partnerKey)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function generateCompatibility(partnerKey) {
  const partner = partnerSign(partnerKey)
  if (!partner) throw new Error(`Unknown sign: ${partnerKey}`)

  const { system, user, baseline } = buildCompatibilityPrompt(partner)
  const { data, model } = await completeJSON({
    system,
    user,
    schema: COMPATIBILITY_SCHEMA,
    effort: 'medium',
  })

  const clampScore = (n) => Math.max(0, Math.min(100, Math.round(Number(n)) || 0))
  const scores = Object.fromEntries(
    ['passion', 'trust', 'communication', 'friendship', 'overall'].map((k) => [
      k,
      clampScore(data.scores?.[k]),
    ])
  )

  return {
    partner_sign: partnerKey,
    headline: data.headline.trim(),
    summary: data.summary.trim(),
    spark: data.spark.trim(),
    friction: data.friction.trim(),
    scores,
    baseline,
    model,
    generated_at: new Date().toISOString(),
  }
}

export async function ensureCompatibility(partnerKey) {
  const existing = await getCompatibility(partnerKey)
  if (existing) return existing

  const row = await generateCompatibility(partnerKey)
  const db = createAdminClient()
  const { error } = await db
    .from('compatibility')
    .upsert(row, { onConflict: 'partner_sign', ignoreDuplicates: true })
  if (error) throw error

  return (await getCompatibility(partnerKey)) ?? row
}
