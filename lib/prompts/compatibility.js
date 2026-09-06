// Builds the prompt for a Scorpio-and-X compatibility write-up, with a
// baseline score derived from classic element / modality / polarity logic so
// the numbers stay consistent between signs.

import { SIGNS } from '../astro/zodiac.js'

const SCORPIO = SIGNS.find((s) => s.key === 'scorpio')

export const COMPATIBILITY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['headline', 'summary', 'spark', 'friction', 'scores'],
  properties: {
    headline: {
      type: 'string',
      description: 'A short, vivid phrase for this pairing (max ~7 words).',
    },
    summary: { type: 'string', description: '2-3 sentences on the overall dynamic.' },
    spark: { type: 'string', description: '1-2 sentences: what genuinely works between them.' },
    friction: { type: 'string', description: '1-2 sentences: where it strains, and why.' },
    scores: {
      type: 'object',
      additionalProperties: false,
      required: ['passion', 'trust', 'communication', 'friendship', 'overall'],
      properties: {
        passion: { type: 'integer', description: '0 to 100.' },
        trust: { type: 'integer', description: '0 to 100.' },
        communication: { type: 'integer', description: '0 to 100.' },
        friendship: { type: 'integer', description: '0 to 100.' },
        overall: { type: 'integer', description: '0 to 100.' },
      },
    },
  },
}

const clamp = (n) => Math.max(20, Math.min(96, Math.round(n)))

function elementBase(partnerElement) {
  if (partnerElement === 'Water') return 84 // deep emotional resonance
  if (partnerElement === 'Earth') return 74 // grounding, complementary
  if (partnerElement === 'Fire') return 60 // passionate, combustible
  return 52 // Air: a temperament gap
}

/** Baseline 0-100 scores + a one-line rationale for Scorpio + partner. */
export function scoreBaseline(partner) {
  const base = elementBase(partner.element)
  const isOpposite = partner.key === 'taurus'
  const bothFixed = partner.modality === 'Fixed'
  const sameSign = partner.key === 'scorpio'

  let passion = base + 6
  let trust = base
  let communication = base - 4
  let friendship = base + 2

  const notes = [`Water × ${partner.element}`, `Fixed × ${partner.modality}`]

  if (partner.element === 'Water') {
    trust += 4
    friendship += 4
  }
  if (partner.element === 'Air') {
    communication -= 6
    notes.push('mental vs. emotional wiring')
  }
  if (bothFixed) {
    communication -= 8
    passion += 5
    notes.push('two fixed signs: intensity and stalemates')
  }
  if (isOpposite) {
    passion += 16
    trust -= 4
    communication -= 4
    notes.push('opposite signs: magnetic pull, mirror friction')
  }
  if (sameSign) {
    passion = 90
    communication -= 4
    notes.push('mirror match: total understanding, nowhere to hide')
  }

  passion = clamp(passion)
  trust = clamp(trust)
  communication = clamp(communication)
  friendship = clamp(friendship)
  const overall = clamp((passion + trust * 1.2 + communication * 1.1 + friendship) / 4.3)

  return {
    passion,
    trust,
    communication,
    friendship,
    overall,
    rationale: notes.join('; '),
  }
}

export const COMPATIBILITY_SYSTEM = `You are an experienced astrologer writing free compatibility readings for a Scorpio audience. You work out the pairing from real astrological logic, then write it up in plain language for a reader who knows nothing about astrology.

How to think it through (for you, not for the page):
- Weigh the two signs' elements, modalities, ruling planets, and polarity (opposite signs, same sign, and so on).
- You are given a baseline score derived from that logic. Keep each final score within about 8 points of its baseline unless the pairing clearly justifies more, and make the write-up match the numbers you land on.

How to write it:
- Do not lecture the reader about astrology. Avoid the words element, modality, fixed, cardinal, mutable, polarity, and opposition. You can name the two signs and, at most once, mention a ruling planet if it truly adds something.
- Talk about how these two actually are together: how they communicate, fight, trust, want each other, spend a weekend. Concrete behaviour, not theory.
- Honest, specific, a little sharp. Name what actually goes wrong between them, not just what is nice.
- Short sentences, common words. Warm and knowing voice, written to the Scorpio ("you") about the other sign ("they").
- Entertainment only. No advice, no predictions, nothing about a specific real relationship.

Punctuation:
- Never use an em dash, and never use a dash with a space on either side. Use a comma, a period, or two shorter sentences instead.
- Straight quotes and straight punctuation only.

Keep every field tight. The headline is a phrase, not a sentence.`

export function buildCompatibilityPrompt(partner) {
  const baseline = scoreBaseline(partner)

  const user = `Pairing: Scorpio and ${partner.name}${
    partner.key === 'scorpio' ? ' (two Scorpios)' : ''
  }.

Scorpio: ${SCORPIO.element} element, ${SCORPIO.modality} modality, ruled by ${SCORPIO.ruler}.
${partner.name}: ${partner.element} element, ${partner.modality} modality, ruled by ${partner.ruler}.
Astrological note: ${baseline.rationale}.

Baseline scores (0-100): passion ${baseline.passion}, trust ${baseline.trust}, communication ${baseline.communication}, friendship ${baseline.friendship}, overall ${baseline.overall}.

Write the compatibility reading as a JSON object with keys: headline, summary, spark, friction, scores (passion, trust, communication, friendship, overall).`

  return { system: COMPATIBILITY_SYSTEM, user, baseline }
}
