import { notFound } from 'next/navigation'
import { QuizRunner } from './quiz-runner'
import { JsonLd } from '@/components/json-ld'
import { getQuiz, allQuizzes } from '@/lib/quizzes/index.js'
import { SITE_NAME } from '@/lib/constants'
import { SITE_URL } from '@/lib/site'

const siteUrl = SITE_URL

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
    alternates: { canonical: `/quiz/${slug}` },
    openGraph: { title: quiz.title, description: quiz.description },
  }
}

export default async function QuizPage({ params }) {
  const { slug } = await params
  const quiz = getQuiz(slug)
  if (!quiz) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: quiz.title,
    description: quiz.description,
    url: `${siteUrl}/quiz/${slug}`,
    educationalLevel: 'entertainment',
    about: { '@type': 'Thing', name: 'Scorpio zodiac sign' },
    numberOfQuestions: quiz.questions.length,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <QuizRunner quiz={quiz} />
    </>
  )
}
