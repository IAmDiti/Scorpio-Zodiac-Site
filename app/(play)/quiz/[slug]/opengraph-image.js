import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og-card'
import { getQuiz, allQuizzes } from '@/lib/quizzes/index.js'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = OG_ALT

export function generateStaticParams() {
  return allQuizzes().map((q) => ({ slug: q.slug }))
}

export default async function Image({ params }) {
  const { slug } = await params
  const quiz = getQuiz(slug)

  return new ImageResponse(
    <OgCard
      eyebrow="Scorpio Quiz"
      title={quiz?.title || 'Scorpio quizzes'}
      subtitle={quiz?.description}
    />,
    { ...OG_SIZE }
  )
}
