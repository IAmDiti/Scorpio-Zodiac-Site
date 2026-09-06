// The original hand-authored quizzes. Since the admin panel (migration 0005)
// these live in the `quizzes` table, but this array stays as:
//   1. the runtime fallback when the table is missing or empty
//      (see lib/quizzes/index.js), and
//   2. the source `npm run quizzes:seed` loads into the database.
//
// Editing a quiz in the admin UI changes the DB row, not this file.

import whatKind from './what-kind-of-scorpio-are-you.js'
import loveLanguage from './scorpio-love-language.js'
import soulmate from './which-sign-is-your-soulmate.js'
import intensity from './how-intense-is-your-scorpio-energy.js'
import spiritAnimal from './your-scorpio-spirit-animal.js'
import textbook from './are-you-a-textbook-scorpio.js'

export const SEED_QUIZZES = [
  whatKind,
  loveLanguage,
  soulmate,
  intensity,
  spiritAnimal,
  textbook,
]
