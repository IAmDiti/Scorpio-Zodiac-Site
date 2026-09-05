import { createClient } from './supabase/server'
import { SIGNS } from './astro/zodiac'

const SIGN_KEYS = new Set(SIGNS.map((s) => s.key))

/** Fields a user is allowed to edit on their own profile. */
export function sanitizeProfileInput(form) {
  const out = {}

  const name = (form.get('display_name') || '').toString().trim()
  if (name) out.display_name = name.slice(0, 60)

  const birthDate = (form.get('birth_date') || '').toString().trim()
  if (birthDate && /^\d{4}-\d{2}-\d{2}$/.test(birthDate)) out.birth_date = birthDate
  else if (form.has('birth_date')) out.birth_date = null

  const birthTime = (form.get('birth_time') || '').toString().trim()
  if (birthTime && /^\d{2}:\d{2}$/.test(birthTime)) out.birth_time = birthTime
  else if (form.has('birth_time')) out.birth_time = null

  const birthPlace = (form.get('birth_place') || '').toString().trim()
  if (form.has('birth_place')) out.birth_place = birthPlace ? birthPlace.slice(0, 120) : null

  const partner = (form.get('partner_sign') || '').toString().trim().toLowerCase()
  if (form.has('partner_sign')) out.partner_sign = SIGN_KEYS.has(partner) ? partner : null

  if (form.has('marketing_opt_in')) {
    out.marketing_opt_in =
      form.get('marketing_opt_in') === 'on' || form.get('marketing_opt_in') === 'true'
  }

  return out
}

export async function updateProfile(patch) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')

  const { error } = await supabase.from('profiles').update(patch).eq('id', user.id)
  if (error) throw error
}

export async function getSavedItems() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function toggleSavedItem({ kind, ref, label }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')

  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('kind', kind)
    .eq('ref', ref)
    .maybeSingle()

  if (existing) {
    await supabase.from('saved_items').delete().eq('id', existing.id)
    return { saved: false }
  }

  await supabase.from('saved_items').insert({ user_id: user.id, kind, ref, label })
  return { saved: true }
}
