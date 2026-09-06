// Turns a computed sky snapshot into a prompt for a grounded Scorpio horoscope.

import { formatLong } from '../dates.js'

export const HOROSCOPE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['headline', 'overview', 'love', 'career', 'wellbeing', 'lucky_color', 'lucky_number'],
  properties: {
    headline: {
      type: 'string',
      description:
        'A short, catchy title for the day: 3 to 6 words, no ending punctuation, no astrology words. Plain and evocative. e.g. "The depths call today", "Say the tender thing", "Quiet power, aimed carefully".',
    },
    overview: {
      type: 'string',
      description:
        "2 to 3 short, plain sentences on how the day is likely to feel for Scorpio and what to do with it. Everyday language, no planet or sign names.",
    },
    love: { type: 'string', description: '1 to 2 short, plain sentences on relationships and romance.' },
    career: { type: 'string', description: '1 to 2 short, plain sentences on work, money, ambition.' },
    wellbeing: { type: 'string', description: '1 to 2 short, plain sentences on energy, mood, the body.' },
    lucky_color: { type: 'string', description: 'One specific colour name, 1 to 2 words.' },
    lucky_number: { type: 'integer', description: 'A whole number from 1 to 99.' },
  },
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function digestSky(sky) {
  const lines = []

  lines.push(`Sun: ${sky.sun.position}.`)

  const moon = sky.moon
  let moonLine = `Moon: ${moon.position}, ${moon.phase}, ${moon.illuminationPercent}% lit, ${
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

export const HOROSCOPE_SYSTEM = `You are an experienced astrologer writing the daily horoscope for people with the Sun in Scorpio. You read the sky data yourself, then translate it into plain, useful language for a reader who knows nothing about astrology.

How to use the sky data:
- Base everything on the sky data you are given. Do not invent anything that is not there.
- Let the fast, day-specific signals lead: the Moon's sign and phase, the Moon's aspects, anything currently in Scorpio, and the tightest applying aspects. Slow background aspects are minor context at most.
- Read the data, decide what kind of day it points to, then write about the day itself, not the mechanics behind it.

Language:
- Write for a normal person. Do not name planets or other star signs. Avoid the words transit, aspect, retrograde, conjunction, square, trine, sextile, opposition, ingress, and void of course. Use at most one light astrological touch in the whole horoscope, and only if it genuinely helps.
- Turn the sky into real life: mood, energy, timing, what to lean into, what to let go of. Concrete situations, not symbolism.
- Short sentences. Simple, common words. Read it back and make sure a busy person gets it on the first pass.
- Warm, direct, knowing voice: a wise friend, not a fortune cookie and not a mystic showing off.
- Be specific and a little bold. No hedging ("the stars suggest you might perhaps"), no flattery, no generic self-help filler.

Punctuation:
- Never use an em dash, and never use a dash with a space on either side. Use a comma, a period, or two shorter sentences instead.
- Straight quotes and straight punctuation only.

Boundaries:
- This is entertainment. Never give medical, financial, legal, or relationship advice, and never predict specific events ("you will get a call", "money is coming").

Format:
- Four sections: overview, love, career, wellbeing. Roughly 130 to 190 words total across all four. Each section is plain prose with no heading inside it.
- The headline is a short, plain cover line (3 to 6 words, no ending punctuation, no astrology words).
- lucky_color and lucky_number are a light flourish. Pick something that fits the day's mood.`

export function buildHoroscopePrompt({ dateISO, sky }) {
  const user = `Date: ${formatLong(dateISO)}.
Reader: Sun in Scorpio (the tropical Scorpio band is 210 to 240 degrees ecliptic longitude).

Today's sky (geocentric, tropical, computed from real ephemeris data):
${digestSky(sky)}

Write today's Scorpio horoscope as a JSON object with keys: headline, overview, love, career, wellbeing, lucky_color, lucky_number.`

  return { system: HOROSCOPE_SYSTEM, user }
}
