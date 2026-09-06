import { SIGNS } from './astro/zodiac.js'

export const SITE_NAME = 'Scorpio Daily'
export const SITE_DESCRIPTION =
  'A free daily Scorpio horoscope drawn from the real sky, plus compatibility with every sign and quizzes worth arguing about. For entertainment purposes only.'

export const SITE_TZ = process.env.SITE_TZ || 'Europe/Rome'

// The sign this site is built around.
export const HOME_SIGN = 'scorpio'

// Re-export the shared zodiac data (single source of truth lives in astro/zodiac.js).
export const ZODIAC_SIGNS = SIGNS
export const SCORPIO = SIGNS.find((s) => s.key === HOME_SIGN)

/** Every sign Scorpio can be paired with — including another Scorpio. */
export const PARTNER_SIGNS = SIGNS

export const NAV_LINKS = [
  { href: '/horoscope', label: 'Horoscope' },
  { href: '/compatibility', label: 'Compatibility' },
  { href: '/quizzes', label: 'Quizzes' },
  { href: '/blog', label: 'Blog' },
  { href: '/about-scorpio', label: 'The sign' },
]

/** Slug used for a Scorpio-and-X compatibility page. */
export const pairSlug = (signKey) => `scorpio-and-${signKey}`
