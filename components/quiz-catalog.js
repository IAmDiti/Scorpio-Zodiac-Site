'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QUIZ_CATEGORIES } from '@/lib/quizzes/categories.js'

export function QuizCatalog({ quizzes }) {
  const [category, setCategory] = useState('All')
  const shown = category === 'All' ? quizzes : quizzes.filter((q) => q.category === category)

  return (
    <>
      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {QUIZ_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3.5 py-2 font-ui text-xs transition-colors ${
              category === c
                ? 'bg-lilac font-bold text-void'
                : 'border border-line-2 bg-surface-2 text-ink-2 hover:text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {shown.map((quiz) => (
          <Link
            key={quiz.slug}
            href={`/quiz/${quiz.slug}`}
            className="group overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-2"
          >
            <div
              className="relative h-28 overflow-hidden sm:h-32"
              style={{
                backgroundImage: `linear-gradient(135deg, ${quiz.cover.from}, ${quiz.cover.to})`,
              }}
            >
              {quiz.image ? (
                <img
                  src={quiz.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              ) : null}
            </div>
            <div className="p-3 pb-3.5 sm:p-4">
              <p className="eyebrow mb-1.5 text-[10.5px] text-gold">{quiz.category}</p>
              <h3 className="mb-2 text-[14.5px] leading-snug sm:text-base">{quiz.title}</h3>
              <p className="font-ui text-[11px] text-ink-4">
                {quiz.questionCount} questions · {quiz.minutes} min
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
