'use server'

import { saveQuizResult } from '@/lib/quiz-results'
import { getQuiz } from '@/lib/quizzes/index.js'
import { scoreQuiz } from '@/lib/quizzes/score.js'
import { captureSubscriber } from '@/lib/subscribers'

/** Best-effort persist for a signed-in user. Returns { needsAuth } otherwise. */
export async function submitQuiz({ slug, answers }) {
  return saveQuizResult(slug, answers)
}

/**
 * The email gate on the result screen. Verifies the result server-side (never
 * trusts the client's claimed key), records the address, and unlocks the full
 * write-up. Also persists the result for a signed-in user, best effort.
 */
export async function unlockQuizResult({ slug, resultKey, answers, email }) {
  const quiz = await getQuiz(slug)
  if (!quiz) return { error: 'That quiz no longer exists.' }

  const scored = scoreQuiz(quiz, answers)
  const key = quiz.results[resultKey] ? resultKey : scored
  if (!key || !quiz.results[key]) return { error: 'We couldn’t score that. Try retaking it.' }

  const res = await captureSubscriber({
    email,
    source: 'quiz',
    quizSlug: slug,
    resultKey: key,
  })
  if (res.error) return { error: res.error }

  try {
    await saveQuizResult(slug, answers)
  } catch {
    /* not signed in — the subscriber row is what matters here */
  }

  return { ok: true, resultKey: key }
}
