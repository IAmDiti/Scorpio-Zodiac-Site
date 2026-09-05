// Geocentric, tropical (true equinox of date) ephemeris for astrology.
// Verified against known ephemerides: the March 2020 equinox returns the
// Sun at exactly 0.000 deg Aries, and 2025-01-01 positions match published
// tables to < 0.2 deg for every body.
//
// Server-only: pulls in astronomy-engine. Do not import from a Client Component.

import * as Astronomy from 'astronomy-engine'
import {
  norm360,
  signFromLongitude,
  formatPosition,
  isInScorpio,
  moonPhaseName,
  isWaxing,
  findAspects,
} from './zodiac.js'

const PLANETS = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

const ALL_BODIES = ['Sun', 'Moon', ...PLANETS]

/** Geocentric apparent ecliptic longitude (deg), true equinox of date. */
function eclipticLongitude(bodyName, date) {
  if (bodyName === 'Sun') {
    return norm360(Astronomy.SunPosition(date).elon)
  }
  if (bodyName === 'Moon') {
    return norm360(Astronomy.EclipticGeoMoon(date).lon)
  }
  const eqj = Astronomy.GeoVector(Astronomy.Body[bodyName], date, true)
  const ecl = Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECT(date), eqj)
  return norm360(Astronomy.SphereFromVector(ecl).lon)
}

const DAY_MS = 86400000

/** Apparent longitude motion in deg/day (negative = retrograde). */
function dailyMotion(bodyName, date) {
  const before = eclipticLongitude(bodyName, new Date(date.getTime() - DAY_MS / 2))
  const after = eclipticLongitude(bodyName, new Date(date.getTime() + DAY_MS / 2))
  let d = after - before
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return d
}

/** Find when the Moon next crosses into a new sign, scanning up to 3 days. */
function nextMoonIngress(date) {
  const startLon = eclipticLongitude('Moon', date)
  const startSign = Math.floor(startLon / 30)
  let lo = 0
  let hi = 72 // hours
  // coarse scan
  let crossHour = null
  for (let h = 1; h <= 72; h++) {
    const lon = eclipticLongitude('Moon', new Date(date.getTime() + h * 3600000))
    if (Math.floor(lon / 30) !== startSign) {
      crossHour = h
      lo = h - 1
      hi = h
      break
    }
  }
  if (crossHour == null) return null
  // bisection to the minute
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    const lon = eclipticLongitude('Moon', new Date(date.getTime() + mid * 3600000))
    if (Math.floor(lon / 30) !== startSign) hi = mid
    else lo = mid
  }
  const at = new Date(date.getTime() + hi * 3600000)
  const intoSign = signFromLongitude(eclipticLongitude('Moon', new Date(at.getTime() + 60000)))
  return { at: at.toISOString(), intoSign: intoSign.name, inHours: Number(hi.toFixed(1)) }
}

function bodyReport(name, date) {
  const lon = eclipticLongitude(name, date)
  const motion = name === 'Sun' || name === 'Moon' ? null : dailyMotion(name, date)
  const sign = signFromLongitude(lon)
  return {
    body: name.toLowerCase(),
    longitude: Number(lon.toFixed(2)),
    position: formatPosition(lon),
    sign: sign.name,
    degreeInSign: Number(sign.degreeInSign.toFixed(1)),
    retrograde: motion != null && motion < 0,
    speedDegPerDay: motion == null ? null : Number(motion.toFixed(3)),
    inScorpio: isInScorpio(lon),
  }
}

/**
 * Full snapshot of the sky for a given instant, shaped for an astrologer
 * (human or model) to interpret. All longitudes are geocentric tropical.
 */
export function computeSky(date = new Date()) {
  const later = new Date(date.getTime() + DAY_MS)

  const bodies = ALL_BODIES.map((n) => bodyReport(n, date))
  const positions = Object.fromEntries(bodies.map((b) => [b.body, b.longitude]))
  const positionsLater = Object.fromEntries(
    ALL_BODIES.map((n) => [n.toLowerCase(), eclipticLongitude(n, later)])
  )

  const moonPhaseAngle = norm360(Astronomy.MoonPhase(date))
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, date)
  const moon = bodies.find((b) => b.body === 'moon')

  const aspects = findAspects(positions, positionsLater)

  const retrogrades = bodies.filter((b) => b.retrograde).map((b) => `${cap(b.body)} in ${b.sign}`)

  const inScorpio = bodies.filter((b) => b.inScorpio).map((b) => cap(b.body))

  return {
    date: date.toISOString(),
    sun: bodies.find((b) => b.body === 'sun'),
    moon: {
      ...moon,
      phase: moonPhaseName(moonPhaseAngle),
      illuminationPercent: Math.round(illum.phase_fraction * 100),
      waxing: isWaxing(moonPhaseAngle),
      nextIngress: nextMoonIngress(date),
    },
    planets: bodies.filter((b) => !['sun', 'moon'].includes(b.body)),
    bodies,
    aspects,
    retrogrades,
    planetsInScorpio: inScorpio,
  }
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
