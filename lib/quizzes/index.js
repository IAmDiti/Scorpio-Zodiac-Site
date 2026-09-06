// Quiz registry. Quizzes are edited in the admin panel and stored in the
// `quizzes` table (migration 0005). When that table is missing or empty — a
// fresh database, or before `npm run quizzes:seed` has run — the six bundled
// modules in lib/quizzes/*.js are used instead, so the site never goes dark.
//
// Per-user results live in the `quiz_results` table and reference a quiz by slug.

import { cache } from 'react'
import { createAdminClient } from '../supabase/admin.js'
import { SEED_QUIZZES } from './seed-data.js'

/** A DB row → the quiz object the rest of the app expects. */
function fromRow(row) {
  const def = row.definition || {}
  return {
    ...def,
    slug: row.slug,
    image: row.image_url ?? def.image ?? null,
    order: row.sort_order ?? def.order ?? 99,
  }
}

// Loaded at most once per request.
const loadQuizzes = cache(async () => {
  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('quizzes')
      .select('slug, definition, image_url, sort_order, status')
      .eq('status', 'published')
    if (error) throw error
    if (data && data.length) {
      return data.map(fromRow).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    }
  } catch {
    // fall through to the bundled quizzes
  }
  return [...SEED_QUIZZES].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
})

export async function allQuizzes() {
  return loadQuizzes()
}

export async function getQuiz(slug) {
  const all = await loadQuizzes()
  return all.find((q) => q.slug === slug) ?? null
}

export async function quizExists(slug) {
  return (await getQuiz(slug)) != null
}

/** [{ slug, key }] for every result of every quiz — for sitemap / OG params. */
export async function allResultParams() {
  const all = await loadQuizzes()
  return all.flatMap((q) => Object.keys(q.results || {}).map((key) => ({ slug: q.slug, key })))
}

export { QUIZ_CATEGORIES } from './categories.js'
