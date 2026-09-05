import { IconScorpio } from '@/components/icons'

/**
 * Presentation of one quiz result. `eyebrow` and `footer` differ between the
 * personal result page and the public shareable page.
 */
export function QuizResultCard({ quiz, resultKey, eyebrow, footer }) {
  const result = quiz.results[resultKey]
  if (!result) return null

  return (
    <article className="text-center">
      <p className="eyebrow mb-3.5">{eyebrow}</p>

      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-[#3a2b4e] bg-[radial-gradient(circle_at_40%_35%,#3a1440,#150f24)] shadow-[0_0_40px_rgba(192,42,74,0.3)]">
        <IconScorpio className="h-11 w-12 text-gold" />
      </div>

      <p className="font-ui text-[12px] text-ink-3">
        {quiz.scoring === 'scale' ? 'You’re' : 'You are'}
      </p>
      <h1 className="mt-0.5 text-[32px] text-ink-bright">{result.title}</h1>

      <p className="mx-auto mt-4 max-w-[22rem] text-[14.5px] text-ink-2">{result.blurb}</p>

      {result.traits?.length ? (
        <ul className="mx-auto mt-5 flex max-w-[20rem] flex-col gap-2 text-left">
          {result.traits.map((t) => (
            <li key={t} className="flex items-start gap-2.5 font-ui text-[13px] text-ink-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-violet"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      ) : null}

      {result.matches ? (
        <p className="mt-5 font-ui text-[12px] text-ink-3">
          Best matched with <span className="text-gold">{result.matches}</span>
        </p>
      ) : null}

      {footer ? <div className="mt-7">{footer}</div> : null}
    </article>
  )
}
