// Pure zodiac + aspect data and math. No ephemeris here — safe to import
// anywhere (client or server).

export const SIGNS = [
  {
    key: 'aries',
    name: 'Aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    ruler: 'Mars',
  },
  {
    key: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    ruler: 'Venus',
  },
  {
    key: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    ruler: 'Mercury',
  },
  {
    key: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    ruler: 'Moon',
  },
  { key: 'leo', name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', ruler: 'Sun' },
  {
    key: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    ruler: 'Mercury',
  },
  {
    key: 'libra',
    name: 'Libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    ruler: 'Venus',
  },
  {
    key: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    ruler: 'Mars & Pluto',
  },
  {
    key: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    ruler: 'Jupiter',
  },
  {
    key: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    ruler: 'Saturn',
  },
  {
    key: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    ruler: 'Saturn & Uranus',
  },
  {
    key: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    ruler: 'Jupiter & Neptune',
  },
]

export const SCORPIO_INDEX = 7
export const SCORPIO_START_DEG = 210
export const SCORPIO_END_DEG = 240

export function norm360(deg) {
  return ((deg % 360) + 360) % 360
}

/** Longitude (deg) -> which sign, and how many degrees into it. */
export function signFromLongitude(lon) {
  const l = norm360(lon)
  const index = Math.floor(l / 30)
  const sign = SIGNS[index]
  const degreeInSign = l - index * 30
  return { ...sign, index, degreeInSign }
}

/** "12°57' Scorpio" */
export function formatPosition(lon) {
  const s = signFromLongitude(lon)
  const d = Math.floor(s.degreeInSign)
  const m = Math.round((s.degreeInSign - d) * 60)
  const dd = m === 60 ? d + 1 : d
  const mm = m === 60 ? 0 : m
  return `${dd}°${String(mm).padStart(2, '0')}' ${s.name}`
}

export function isInScorpio(lon) {
  const l = norm360(lon)
  return l >= SCORPIO_START_DEG && l < SCORPIO_END_DEG
}

// --- Moon phase ------------------------------------------------------------

const MOON_PHASES = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
]

/** angle = Moon's ecliptic elongation from the Sun, 0..360 (0 = new). */
export function moonPhaseName(angle) {
  const a = norm360(angle)
  const bin = Math.floor((a + 22.5) / 45) % 8
  return MOON_PHASES[bin]
}

export function isWaxing(angle) {
  return norm360(angle) < 180
}

// --- Aspects -------------------------------------------------------------

export const ASPECTS = [
  { key: 'conjunction', angle: 0, orb: 8, tone: 'a blend / intensification' },
  { key: 'sextile', angle: 60, orb: 4, tone: 'an easy opportunity' },
  { key: 'square', angle: 90, orb: 7, tone: 'friction that forces action' },
  { key: 'trine', angle: 120, orb: 7, tone: 'natural flow' },
  { key: 'opposition', angle: 180, orb: 8, tone: 'a pull between two poles' },
]

/** Shortest angular distance between two longitudes, 0..180. */
export function angularSeparation(a, b) {
  const d = Math.abs(norm360(a) - norm360(b)) % 360
  return d > 180 ? 360 - d : d
}

// The "bodies" for aspect-finding, fastest to slowest.
export const ASPECT_BODIES = [
  'moon',
  'mercury',
  'venus',
  'sun',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
]

/**
 * Find all aspects within orb among the given { body: longitude } map.
 * If `later` (positions one day on) is supplied, each aspect is tagged
 * applying (tightening) or separating.
 */
export function findAspects(positions, later) {
  const bodies = ASPECT_BODIES.filter((b) => positions[b] != null)
  const out = []

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i]
      const b = bodies[j]
      const sep = angularSeparation(positions[a], positions[b])

      for (const asp of ASPECTS) {
        const exactness = Math.abs(sep - asp.angle)
        if (exactness > asp.orb) continue

        let motion = null
        if (later && later[a] != null && later[b] != null) {
          const sepLater = angularSeparation(later[a], later[b])
          const exactLater = Math.abs(sepLater - asp.angle)
          motion = exactLater < exactness ? 'applying' : 'separating'
        }

        out.push({
          a,
          b,
          aspect: asp.key,
          tone: asp.tone,
          exactness: Number(exactness.toFixed(2)),
          motion,
        })
        break // one aspect per pair
      }
    }
  }

  // tightest first
  return out.sort((x, y) => x.exactness - y.exactness)
}
