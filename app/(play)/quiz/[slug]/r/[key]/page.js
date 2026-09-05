import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getQuiz, allResultParams } from '@/lib/quizzes/index.js'
import { QuizResultCard } from '@/components/quiz-result-card'
import { PlayHeader, PlayFooter } from '@/components/play-chrome'

export const revalidate = 604800

export function generateStaticParams() {
  return allResultParams()
}

export async function generateMetadata({ params }) {
  const { slug, key } = await params
  const quiz = getQuiz(slug)
  const result = quiz?.results?.[key]
  if (!result) return {}

  const description = result.shareLine || result.blurb
  return {
    title: `${result.title} · ${quiz.title}`,
    description,
    openGraph: { title: result.title, description },
    twitter: { card: 'summary_large_image', title: result.title, description },
  }
}

export default async function PublicResultPage({ params }) {
  const { slug, key } = await params
  const quiz = getQuiz(slug)
  if (!quiz || !quiz.results[key]) notFound()

  const count = Object.keys(quiz.results).length

  return (
    <>
      <PlayHeader />
      <div className="mx-auto w-full max-w-[26rem] px-5 py-8">
        <QuizResultCard
          quiz={quiz}
          resultKey={key}
          eyebrow={`${quiz.title} · 1 of ${count}`}
          footer={
            <div className="flex flex-col gap-2.5">
              <p className="font-ui text-[13px] text-ink-3">Which one are you?</p>
              <Link
                href={`/quiz/${slug}`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-garnet px-6 font-ui text-[13px] font-bold text-white"
              >
                Take the quiz
              </Link>
            </div>
          }
        />
      </div>
      <PlayFooter />
    </>
  )
}
