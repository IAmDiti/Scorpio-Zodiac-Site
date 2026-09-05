import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og-card'
import { getQuiz } from '@/lib/quizzes/index.js'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = OG_ALT

export default async function Image({ params }) {
  const { slug, key } = await params
  const quiz = getQuiz(slug)
  const result = quiz?.results?.[key]

  return new ImageResponse(
    <OgCard
      eyebrow={quiz?.title || 'Scorpio Daily'}
      title={result?.title || 'Take the quiz'}
      subtitle={result?.shareLine}
    />,
    { ...OG_SIZE }
  )
}
