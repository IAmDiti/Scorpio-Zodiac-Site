// Quiz registry. Quizzes are hand-authored data modules, not database rows —
// they change rarely and read better as code. Per-user results live in the
// `quiz_results` table.

import whatKind from './what-kind-of-scorpio-are-you.js'
import loveLanguage from './scorpio-love-language.js'
import soulmate from './which-sign-is-your-soulmate.js'
import intensity from './how-intense-is-your-scorpio-energy.js'
import spiritAnimal from './your-scorpio-spirit-animal.js'
import textbook from './are-you-a-textbook-scorpio.js'

const QUIZZES = [whatKind, loveLanguage, soulmate, intensity, spiritAnimal, textbook]

const BY_SLUG = new Map(QUIZZES.map((q) => [q.slug, q]))

export function allQuizzes() {
  return [...QUIZZES].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

export function getQuiz(slug) {
  return BY_SLUG.get(slug) ?? null
}

export function quizExists(slug) {
  return BY_SLUG.has(slug)
}

/** [{ slug, key }] for every result of every quiz — for generateStaticParams. */
export function allResultParams() {
  return QUIZZES.flatMap((q) => Object.keys(q.results).map((key) => ({ slug: q.slug, key })))
}

export { QUIZ_CATEGORIES } from './categories.js'
