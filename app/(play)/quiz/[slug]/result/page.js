import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getQuiz } from '@/lib/quizzes/index.js'
import { getLatestResult } from '@/lib/quiz-results'
import { QuizResultCard } from '@/components/quiz-result-card'
import { QuizShare } from '@/components/quiz-share'
import { PlayHeader, PlayFooter } from '@/components/play-chrome'
import { ClaimPendingResult } from './claim-pending'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const quiz = getQuiz(slug)
  if (!quiz) return {}
  return { title: `Your result · ${quiz.title}`, robots: { index: false } }
}

const ghost =
  'flex min-h-[46px] flex-1 items-center justify-center rounded-full border border-line-2 font-ui text-[13px] text-ink-2 transition-colors hover:text-ink'

export default async function QuizResultPage({ params }) {
  const { slug } = await params
  const quiz = getQuiz(slug)
  if (!quiz) notFound()

  const row = await getLatestResult(slug)

  if (!row || !quiz.results[row.result_key]) {
    return (
      <>
        <PlayHeader />
        <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
          <ClaimPendingResult slug={slug} />
        </div>
        <PlayFooter />
      </>
    )
  }

  const result = quiz.results[row.result_key]

  return (
    <>
      <PlayHeader />
      <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-14">
        <QuizResultCard
          quiz={quiz}
          resultKey={row.result_key}
          eyebrow="Your result"
          footer={
            <div className="flex flex-col gap-3">
              <QuizShare path={`/quiz/${slug}/r/${row.result_key}`} text={result.shareLine} />
              <div className="flex gap-2.5">
                <Link href={`/quiz/${slug}`} className={ghost}>
                  Retake
                </Link>
                <Link href="/quizzes" className={ghost}>
                  More quizzes
                </Link>
              </div>
              <Link
                href="/horoscope"
                className="mt-1 text-center font-ui text-[12px] font-bold text-lilac"
              >
                Now read today&rsquo;s real Scorpio horoscope →
              </Link>
            </div>
          }
        />
      </div>
      <PlayFooter />
    </>
  )
}
