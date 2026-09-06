import { createAdminClient } from '@/lib/supabase/admin.js'
import { SEED_QUIZZES } from '@/lib/quizzes/seed-data.js'

// Admin CRUD for the `quizzes` table. The quiz shape is validated here before
// it is stored so a bad definition can never reach the public scoring code
// (lib/quizzes/score.js).

const SCORING = ['tally', 'scale']

export function slugifyQuiz(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Check a quiz definition object. Returns an array of problem strings —
 * empty means it is safe to store.
 */
export function validateDefinition(def) {
  const problems = []
  if (!def || typeof def !== 'object') return ['Definition must be a JSON object.']

  if (!def.title?.trim()) problems.push('Missing "title".')
  if (!def.description?.trim()) problems.push('Missing "description".')
  if (!SCORING.includes(def.scoring)) problems.push('"scoring" must be "tally" or "scale".')

  const results = def.results && typeof def.results === 'object' ? def.results : null
  if (!results || Object.keys(results).length < 2) {
    problems.push('Need at least two entries in "results".')
  }
  const resultKeys = new Set(results ? Object.keys(results) : [])
  for (const [key, r] of Object.entries(results || {})) {
    if (!r?.title?.trim()) problems.push(`Result "${key}" has no title.`)
    if (!r?.blurb?.trim()) problems.push(`Result "${key}" has no blurb.`)
  }

  const questions = Array.isArray(def.questions) ? def.questions : []
  if (questions.length < 1) problems.push('Need at least one question.')

  questions.forEach((q, i) => {
    const n = i + 1
    if (!q?.q?.trim()) problems.push(`Question ${n} has no text ("q").`)
    if (!Array.isArray(q?.options) || q.options.length < 2) {
      problems.push(`Question ${n} needs at least two options.`)
      return
    }
    q.options.forEach((opt, j) => {
      const label = `Question ${n} option ${j + 1}`
      if (!opt?.label?.trim()) problems.push(`${label} has no label.`)
      if (def.scoring === 'tally') {
        const scores = opt?.scores && typeof opt.scores === 'object' ? opt.scores : {}
        if (Object.keys(scores).length === 0) problems.push(`${label} has no "scores".`)
        for (const k of Object.keys(scores)) {
          if (!resultKeys.has(k)) problems.push(`${label} scores unknown result "${k}".`)
        }
      } else if (def.scoring === 'scale') {
        if (typeof opt?.points !== 'number') problems.push(`${label} needs a numeric "points".`)
      }
    })
  })

  if (def.scoring === 'scale') {
    const bands = Array.isArray(def.bands) ? def.bands : []
    if (bands.length < 2) problems.push('"scale" quizzes need at least two "bands".')
    bands.forEach((b, i) => {
      if (!b?.key || !resultKeys.has(b.key)) {
        problems.push(`Band ${i + 1} key "${b?.key}" is not one of the results.`)
      }
      if (typeof b?.max !== 'number') problems.push(`Band ${i + 1} needs a numeric "max".`)
    })
  }

  return problems
}

export async function listQuizzes() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('quizzes')
    .select('slug, definition, image_url, status, sort_order, updated_at')
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    slug: r.slug,
    title: r.definition?.title || r.slug,
    status: r.status,
    sort_order: r.sort_order,
    updated_at: r.updated_at,
  }))
}

export async function getQuizRow(slug) {
  const db = createAdminClient()
  const { data, error } = await db.from('quizzes').select('*').eq('slug', slug).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

/** A starter definition for a brand-new quiz. */
export function blankDefinition() {
  return {
    title: 'New quiz',
    description: 'One line that sells the quiz.',
    category: 'Just fun',
    minutes: 2,
    scoring: 'tally',
    cover: { from: '#3a1030', to: '#221338' },
    questions: [
      {
        q: 'First question?',
        options: [
          { label: 'Option A', scores: { a: 2 } },
          { label: 'Option B', scores: { b: 2 } },
        ],
      },
    ],
    results: {
      a: { title: 'Result A', blurb: 'What being an A says about you.', shareLine: 'I got A.' },
      b: { title: 'Result B', blurb: 'What being a B says about you.', shareLine: 'I got B.' },
    },
  }
}

export async function upsertQuiz({ slug, definition, image_url, status, sort_order }) {
  const problems = validateDefinition(definition)
  if (problems.length) {
    const err = new Error(problems.join(' '))
    err.problems = problems
    throw err
  }

  const db = createAdminClient()
  const row = {
    slug,
    definition,
    image_url: image_url || null,
    status: ['draft', 'published'].includes(status) ? status : 'draft',
    sort_order: Number.isFinite(sort_order) ? sort_order : 99,
  }
  const { error } = await db.from('quizzes').upsert(row, { onConflict: 'slug' })
  if (error) throw new Error(error.message)
}

export async function deleteQuiz(slug) {
  const db = createAdminClient()
  const { error } = await db.from('quizzes').delete().eq('slug', slug)
  if (error) throw new Error(error.message)
}

/** The bundled quizzes, for the "reset / re-seed" affordance in the UI. */
export function seedDefinitionFor(slug) {
  return SEED_QUIZZES.find((q) => q.slug === slug) || null
}
