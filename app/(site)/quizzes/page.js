import { QuizCatalog } from '@/components/quiz-catalog'
import { allQuizzes } from '@/lib/quizzes/index.js'

export const metadata = {
  title: 'Scorpio Quizzes',
  description:
    'Quick, a little addictive, occasionally too accurate. Free Scorpio personality, love and just-for-fun quizzes.',
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
    <div className="mx-auto w-full max-w-[26rem] px-5 py-8">
      <p className="eyebrow mb-2 text-eyebrow">Play · Discover · Share</p>
      <h1 className="text-[30px] text-ink-bright">Scorpio quizzes</h1>
      <p className="mt-2 text-[14px] text-ink-3">
        Quick, a little addictive, occasionally too accurate.
      </p>

      <QuizCatalog quizzes={quizzes} />

      <p className="mt-8 rounded-2xl border border-line bg-surface p-4 text-center font-ui text-[13px] text-ink-3">
        Take any quiz free. A free account unlocks your result and keeps your history.
      </p>
    </div>
  )
}
