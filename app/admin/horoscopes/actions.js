'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { generateHoroscope, storeHoroscope, getHoroscope } from '@/lib/horoscope'
import { saveHoroscopeEdits, deleteHoroscope } from '@/lib/admin/horoscopes'
import { tidyProse, tidyHeadline } from '@/lib/prose'
import { isValidDateISO } from '@/lib/dates'

const PROSE = ['overview', 'love', 'career', 'wellbeing']

function revalidateHoroscope(dateISO) {
  revalidatePath('/admin/horoscopes')
  revalidatePath('/horoscope')
  revalidatePath(`/horoscope/${dateISO}`)
  revalidatePath('/', 'page')
}

export async function generateHoroscopeAction(_prev, formData) {
  await requireAdmin()
  const date = formData.get('date')?.toString().trim()
  if (!isValidDateISO(date)) return { error: 'Enter a valid date (YYYY-MM-DD).' }

  try {
    const row = await generateHoroscope(date)
    await storeHoroscope(row, { overwrite: true })
  } catch (e) {
    return { error: e?.message || 'Generation failed.' }
  }
  revalidateHoroscope(date)
  redirect(`/admin/horoscopes/${date}`)
}

export async function regenerateHoroscopeAction(dateISO) {
  await requireAdmin()
  try {
    const row = await generateHoroscope(dateISO)
    await storeHoroscope(row, { overwrite: true })
  } catch (e) {
    return { error: e?.message || 'Generation failed.' }
  }
  revalidateHoroscope(dateISO)
  return { ok: true, message: 'Regenerated.' }
}

export async function saveHoroscopeAction(dateISO, _prev, formData) {
  await requireAdmin()
  const existing = await getHoroscope(dateISO)
  if (!existing) return { error: 'That day has no row to edit. Generate it first.' }

  const patch = { headline: tidyHeadline(formData.get('headline')?.toString() || '') }
  for (const k of PROSE) patch[k] = tidyProse(formData.get(k)?.toString() || '')
  patch.lucky_color = (formData.get('lucky_color')?.toString() || '').trim().slice(0, 40)
  patch.lucky_number = String(
    Math.max(1, Math.min(99, Math.round(Number(formData.get('lucky_number'))) || 8))
  )

  try {
    await saveHoroscopeEdits(dateISO, patch)
  } catch (e) {
    return { error: e?.message || 'Could not save.' }
  }
  revalidateHoroscope(dateISO)
  return { ok: true, message: 'Saved.' }
}

export async function deleteHoroscopeAction(dateISO) {
  await requireAdmin()
  try {
    await deleteHoroscope(dateISO)
  } catch (e) {
    return { error: e?.message || 'Could not delete.' }
  }
  revalidateHoroscope(dateISO)
  redirect('/admin/horoscopes')
}
