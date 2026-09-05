import { QuizCatalog } from '@/components/quiz-catalog'
import { Container } from '@/components/container'
import { allQuizzes } from '@/lib/quizzes/index.js'

export const metadata = {
  title: 'Scorpio Quizzes',
  description:
    'Quick, a little addictive, occasionally too accurate. Free Scorpio personality, love and just-for-fun quizzes.',
  alternates: { canonical: '/quizzes' },
}

export default function QuizzesPage() {
  const quizzes = allQuizzes().map((q) => ({
    slug: q.slug,
    title: q.title,
    description: q.description,
    category: q.category,
    minutes: q.minutes,
    cover: q.cover,
    questionCount: q.questions.length,
  }))

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <div className="sm:mx-auto sm:max-w-2xl sm:text-center">
        <p className="eyebrow mb-2 text-eyebrow">Play · Discover · Share</p>
        <h1 className="text-[30px] text-ink-bright sm:text-[42px]">Scorpio quizzes</h1>
        <p className="mt-2 text-[14px] text-ink-3 sm:text-[16px]">
          Quick, a little addictive, occasionally too accurate.
        </p>
      </div>

      <QuizCatalog quizzes={quizzes} />

      <p className="mx-auto mt-8 max-w-xl rounded-2xl border border-line bg-surface p-4 text-center font-ui text-[13px] text-ink-3 sm:mt-12">
        Take any quiz free. A free account unlocks your result and keeps your history.
      </p>
    </Container>
  )
}
