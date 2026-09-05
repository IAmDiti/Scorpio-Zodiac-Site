'use server'

import { saveQuizResult } from '@/lib/quiz-results'

export async function submitQuiz({ slug, answers }) {
  return saveQuizResult(slug, answers)
}
