import { createClient } from './supabase/server'
import { getQuiz } from './quizzes/index.js'
import { scoreQuiz, isCompleteAnswerSet } from './quizzes/score.js'

/**
 * Save a completed quiz for the current user. Re-scores server-side — the
 * client's claimed result is never trusted. Returns { needsAuth } for
 * signed-out visitors, { error } for bad input, or { ok, resultKey }.
 */
export async function saveQuizResult(slug, answers) {
  const quiz = await getQuiz(slug)
  if (!quiz) return { error: 'unknown quiz' }
  if (!isCompleteAnswerSet(quiz, answers)) return { error: 'incomplete answers' }

  const resultKey = scoreQuiz(quiz, answers)
  if (!resultKey || !quiz.results[resultKey]) return { error: 'could not score' }

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return { needsAuth: true }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { needsAuth: true }

  const { error } = await supabase.from('quiz_results').insert({
    user_id: user.id,
    quiz_slug: slug,
    answers,
    result_key: resultKey,
  })
  if (error) return { error: error.message }

  return { ok: true, resultKey }
}

/** The current user's most recent result for a quiz, or null. */
export async function getLatestResult(slug) {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return null
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .eq('quiz_slug', slug)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data ?? null
}

/** All of the current user's quiz results, newest first (for /account). */
export async function getQuizHistory() {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return []
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  return data ?? []
}
