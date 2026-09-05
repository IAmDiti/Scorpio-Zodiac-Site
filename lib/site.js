// The canonical origin for the site, resolved once and defensively:
// a missing value falls back to localhost, and a value without a scheme
// (a common mistake when pasting a Railway/host URL) gets https:// prepended.

function resolveSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return 'http://localhost:3000'
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(candidate).origin
  } catch {
    return 'http://localhost:3000'
  }
}

export const SITE_URL = resolveSiteUrl()
