// Turns a computed sky snapshot into a prompt for a grounded Scorpio horoscope.

import { formatLong } from '../dates.js'

export const HOROSCOPE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['overview', 'love', 'career', 'wellbeing', 'lucky_color', 'lucky_number'],
  properties: {
    overview: {
      type: 'string',
      description:
        "2-3 sentences on the day's overall texture for Scorpio, naming the specific transit(s) it rests on.",
    },
    love: { type: 'string', description: '1-2 sentences on relationships / romance.' },
    career: { type: 'string', description: '1-2 sentences on work, money, ambition.' },
    wellbeing: { type: 'string', description: '1-2 sentences on energy, mood, the body.' },
    lucky_color: { type: 'string', description: 'One specific colour name, 1-2 words.' },
    lucky_number: { type: 'integer', description: 'A whole number from 1 to 99.' },
  },
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function digestSky(sky) {
  const lines = []

  lines.push(`Sun: ${sky.sun.position}.`)

  const moon = sky.moon
  let moonLine = `Moon: ${moon.position} — ${moon.phase}, ${moon.illuminationPercent}% lit, ${
    moon.waxing ? 'waxing' : 'waning'
  }.`
  if (moon.nextIngress) {
    moonLine += ` Moves into ${moon.nextIngress.intoSign} in about ${Math.round(
      moon.nextIngress.inHours
    )}h.`
  }
  lines.push(moonLine)

  lines.push(
    'Planets: ' +
      sky.planets
        .map((p) => `${cap(p.body)} ${p.position}${p.retrograde ? ' (retrograde)' : ''}`)
        .join('; ') +
      '.'
  )

  lines.push(
    sky.planetsInScorpio.length
      ? `In Scorpio right now: ${sky.planetsInScorpio.join(', ')}.`
      : 'No planets are currently in Scorpio.'
  )

  if (sky.retrogrades.length) {
    lines.push(`Retrograde: ${sky.retrogrades.join(', ')}.`)
  }

  const aspects = sky.aspects.slice(0, 10)
  if (aspects.length) {
    lines.push(
      'Active aspects (tightest first): ' +
        aspects
          .map(
            (a) =>
              `${cap(a.a)} ${a.aspect} ${cap(a.b)} (orb ${a.exactness}°${
                a.motion ? ', ' + a.motion : ''
              })`
          )
          .join('; ') +
        '.'
    )
  }

  return lines.join('\n')
}

export const HOROSCOPE_SYSTEM = `You are an experienced Western astrologer writing the daily horoscope for people with the Sun in Scorpio.

Rules:
- Interpret ONLY the sky data you are given. Every claim must trace to a specific transit in that data — a planet's sign, an aspect, a retrograde, the Moon's phase or sign. Do not invent transits.
- Weight the fast-moving, day-specific signals most: the Moon's sign and phase, the Moon's aspects, anything currently in Scorpio, and tight applying aspects. Mention slow background aspects only as context.
- Be concrete and a little bold. No hedging clichés ("the stars suggest you might perhaps..."), no flattery, no generic self-help.
- Warm, direct, knowing voice — a good astrologer talking to a friend, not a fortune cookie.
- This is entertainment. Never give medical, financial, legal, or relationship advice, and never predict specific external events ("you will get a call", "money is coming").
- Total length across all four sections: roughly 150-220 words. Each section is self-contained prose, no headings inside it.
- lucky_color and lucky_number are a light flourish — pick something that resonates with the day's dominant planet or element.`

export function buildHoroscopePrompt({ dateISO, sky }) {
  const user = `Date: ${formatLong(dateISO)}.
Reader: Sun in Scorpio (the tropical Scorpio band is 210°–240° ecliptic longitude).

Today's sky (geocentric, tropical, computed from real ephemeris data):
${digestSky(sky)}

Write today's Scorpio horoscope as a JSON object with keys: overview, love, career, wellbeing, lucky_color, lucky_number.`

  return { system: HOROSCOPE_SYSTEM, user }
}
