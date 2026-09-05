// Pure quiz scoring — safe to run on the client (preview) and the server
// (authoritative). Two scoring styles:
//
//   tally  — each chosen option adds points to one or more result keys;
//            the highest-scoring key wins (ties break by results order).
//   scale  — each chosen option has a numeric `points` value; the total
//            maps to the first band whose `max` it does not exceed.

export function isCompleteAnswerSet(quiz, answers) {
  return (
    Array.isArray(answers) &&
    answers.length === quiz.questions.length &&
    answers.every((a, i) => Number.isInteger(a) && a >= 0 && a < quiz.questions[i].options.length)
  )
}

export function scoreQuiz(quiz, answers) {
  if (!isCompleteAnswerSet(quiz, answers)) return null

  if (quiz.scoring === 'scale') {
    let total = 0
    quiz.questions.forEach((question, i) => {
      total += question.options[answers[i]].points ?? 0
    })
    const band = quiz.bands.find((b) => total <= b.max) ?? quiz.bands[quiz.bands.length - 1]
    return band.key
  }

  // tally
  const tally = {}
  quiz.questions.forEach((question, i) => {
    const scores = question.options[answers[i]].scores || {}
    for (const [key, value] of Object.entries(scores)) {
      tally[key] = (tally[key] || 0) + value
    }
  })

  const keys = Object.keys(quiz.results)
  let bestKey = keys[0]
  let bestScore = -Infinity
  for (const key of keys) {
    const s = tally[key] || 0
    if (s > bestScore) {
      bestScore = s
      bestKey = key
    }
  }
  return bestKey
}

export function getResult(quiz, resultKey) {
  return quiz.results[resultKey] ?? null
}
