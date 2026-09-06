'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import {
  upsertQuiz,
  deleteQuiz,
  getQuizRow,
  slugifyQuiz,
  blankDefinition,
} from '@/lib/admin/quizzes'

function revalidateQuiz(slug) {
  revalidatePath('/admin/quizzes')
  revalidatePath('/quizzes')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/quiz/${slug}`, 'layout')
}

export async function createQuizAction(_prev, formData) {
  await requireAdmin()
  const title = formData.get('title')?.toString().trim()
  if (!title) return { error: 'A title is required.' }
  const slug = slugifyQuiz(formData.get('slug')?.toString() || title)
  if (!slug) return { error: 'Could not make a slug from that title.' }
  if (await getQuizRow(slug)) return { error: `A quiz with slug "${slug}" already exists.` }

  const definition = { ...blankDefinition(), title }
  try {
    await upsertQuiz({ slug, definition, status: 'draft', sort_order: 99 })
  } catch (e) {
    return { error: e?.message || 'Could not create the quiz.' }
  }
  revalidateQuiz(slug)
  redirect(`/admin/quizzes/${slug}`)
}

export async function saveQuizAction(slug, _prev, formData) {
  await requireAdmin()

  let definition
  try {
    definition = JSON.parse(formData.get('definition')?.toString() || '{}')
  } catch {
    return { error: 'The definition is not valid JSON.' }
  }

  const patch = {
    slug,
    definition,
    image_url: formData.get('image_url')?.toString() || null,
    status: formData.get('status')?.toString() || 'draft',
    sort_order: parseInt(formData.get('sort_order')?.toString() || '99', 10),
  }

  try {
    await upsertQuiz(patch)
  } catch (e) {
    return { error: e?.message || 'Could not save.', problems: e?.problems }
  }
  revalidateQuiz(slug)
  return { ok: true, message: 'Saved.' }
}

export async function deleteQuizAction(slug) {
  await requireAdmin()
  try {
    await deleteQuiz(slug)
  } catch (e) {
    return { error: e?.message || 'Could not delete.' }
  }
  revalidateQuiz(slug)
  redirect('/admin/quizzes')
}
