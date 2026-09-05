import { ImageResponse } from 'next/og'
import { getQuiz } from '@/lib/quizzes/index.js'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Scorpio Daily quiz result'

export default async function OpengraphImage({ params }) {
  const { slug, key } = await params
  const quiz = getQuiz(slug)
  const result = quiz?.results?.[key]
  const resultTitle = result?.title || 'Scorpio Daily'
  const quizTitle = quiz?.title || 'Scorpio Daily'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '90px',
        background:
          'radial-gradient(900px 500px at 20% 0%, #2a1740, #0b0812 60%), radial-gradient(700px 500px at 100% 100%, #3a1020, #0b0812 55%)',
        color: '#f4eef7',
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          fontSize: 30,
          letterSpacing: 8,
          textTransform: 'uppercase',
          color: '#cbb2ea',
        }}
      >
        {quizTitle}
      </div>
      <div
        style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 24, maxWidth: 960 }}
      >
        {resultTitle}
      </div>
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 28,
          color: '#a99fb8',
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 999, background: '#c02a4a' }} />
        SCORPIO DAILY · take the quiz
      </div>
    </div>,
    { ...size }
  )
}
