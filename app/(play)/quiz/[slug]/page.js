import { notFound } from 'next/navigation'
import { QuizRunner } from './quiz-runner'
import { getQuiz, allQuizzes } from '@/lib/quizzes/index.js'

export function generateStaticParams() {
  return allQuizzes().map((q) => ({ slug: q.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const quiz = getQuiz(slug)
  if (!quiz) return {}
  return {
    title: quiz.title,
    description: quiz.description,
  }
}

export default async function QuizPage({ params }) {
  const { slug } = await params
  const quiz = getQuiz(slug)
  if (!quiz) notFound()

  return <QuizRunner quiz={quiz} />
}
