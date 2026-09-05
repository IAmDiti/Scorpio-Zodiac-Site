export const SITE_NAME = 'Scorpio Daily'
export const SITE_DESCRIPTION =
  'A free daily Scorpio horoscope drawn from the real sky, plus compatibility with every sign and quizzes worth arguing about. For entertainment purposes only.'

export const SITE_TZ = process.env.SITE_TZ || 'Europe/Rome'

// The sign this site is built around.
export const HOME_SIGN = 'scorpio'

// Scorpio occupies 210deg-240deg of the ecliptic.
export const SCORPIO_START_DEG = 210
export const SCORPIO_END_DEG = 240

export const ZODIAC_SIGNS = [
  { key: 'aries', name: 'Aries', element: 'Fire', modality: 'Cardinal', symbol: 'The Ram' },
  { key: 'taurus', name: 'Taurus', element: 'Earth', modality: 'Fixed', symbol: 'The Bull' },
  { key: 'gemini', name: 'Gemini', element: 'Air', modality: 'Mutable', symbol: 'The Twins' },
  { key: 'cancer', name: 'Cancer', element: 'Water', modality: 'Cardinal', symbol: 'The Crab' },
  { key: 'leo', name: 'Leo', element: 'Fire', modality: 'Fixed', symbol: 'The Lion' },
  { key: 'virgo', name: 'Virgo', element: 'Earth', modality: 'Mutable', symbol: 'The Maiden' },
  { key: 'libra', name: 'Libra', element: 'Air', modality: 'Cardinal', symbol: 'The Scales' },
  { key: 'scorpio', name: 'Scorpio', element: 'Water', modality: 'Fixed', symbol: 'The Scorpion' },
  {
    key: 'sagittarius',
    name: 'Sagittarius',
    element: 'Fire',
    modality: 'Mutable',
    symbol: 'The Archer',
  },
  {
    key: 'capricorn',
    name: 'Capricorn',
    element: 'Earth',
    modality: 'Cardinal',
    symbol: 'The Goat',
  },
  {
    key: 'aquarius',
    name: 'Aquarius',
    element: 'Air',
    modality: 'Fixed',
    symbol: 'The Water Bearer',
  },
  { key: 'pisces', name: 'Pisces', element: 'Water', modality: 'Mutable', symbol: 'The Fish' },
]

export const SCORPIO = ZODIAC_SIGNS.find((s) => s.key === 'scorpio')

export const PARTNER_SIGNS = ZODIAC_SIGNS

export const NAV_LINKS = [
  { href: '/horoscope', label: 'Horoscope' },
  { href: '/compatibility', label: 'Compatibility' },
  { href: '/quizzes', label: 'Quizzes' },
  { href: '/about-scorpio', label: 'The sign' },
]
