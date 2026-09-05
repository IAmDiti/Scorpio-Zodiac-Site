// Client-only: stashes in-progress quiz answers so they survive the
// sign-up redirect and get claimed on the result page.

const key = (slug) => `scorpio-quiz:${slug}`

export function stashAnswers(slug, answers) {
  try {
    localStorage.setItem(key(slug), JSON.stringify({ answers, at: Date.now() }))
  } catch {
    // private mode / storage disabled — the result just won't survive a redirect
  }
}

export function readStash(slug) {
  try {
    const raw = localStorage.getItem(key(slug))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed?.answers) ? parsed.answers : null
  } catch {
    return null
  }
}

export function clearStash(slug) {
  try {
    localStorage.removeItem(key(slug))
  } catch {
    /* ignore */
  }
}
