import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computeSky } from './sky.js'
import { signFromLongitude } from './zodiac.js'

// Reference positions from published ephemerides (geocentric, tropical).
// Tolerance is generous (0.4 deg) to allow for time-of-day differences.
const KNOWN = {
  '2020-03-20T03:50:00Z': {
    // vernal equinox — the Sun is by definition at 0 deg Aries
    sun: 0,
  },
  '2025-01-01T00:00:00Z': {
    sun: 280.8, // ~10.8 Capricorn
    mercury: 259.9, // ~19.9 Sagittarius
    venus: 327.7, // ~27.7 Aquarius
    mars: 121.9, // ~1.9 Leo (retrograde)
    jupiter: 73.2, // ~13.2 Gemini (retrograde)
    saturn: 344.5, // ~14.5 Pisces
    uranus: 53.6, // ~23.6 Taurus
    neptune: 357.3, // ~27.3 Pisces
    pluto: 301.1, // ~1.1 Aquarius
  },
}

test('ephemeris matches known positions within 0.4 deg', () => {
  for (const [iso, expected] of Object.entries(KNOWN)) {
    const sky = computeSky(new Date(iso))
    const byBody = Object.fromEntries(sky.bodies.map((b) => [b.body, b.longitude]))
    for (const [body, deg] of Object.entries(expected)) {
      const got = byBody[body]
      const diff = Math.min(Math.abs(got - deg), 360 - Math.abs(got - deg))
      assert.ok(diff < 0.4, `${iso} ${body}: expected ~${deg}, got ${got} (off ${diff.toFixed(3)})`)
    }
  }
})

test('the March 2020 Sun sits exactly on the Aries point', () => {
  const sky = computeSky(new Date('2020-03-20T03:50:00Z'))
  assert.equal(signFromLongitude(sky.sun.longitude).name, 'Aries')
  assert.ok(sky.sun.longitude < 0.1 || sky.sun.longitude > 359.9)
})

test('2025-01 flags the real retrogrades', () => {
  const sky = computeSky(new Date('2025-01-01T00:00:00Z'))
  const retro = sky.bodies.filter((b) => b.retrograde).map((b) => b.body)
  assert.ok(retro.includes('mars'))
  assert.ok(retro.includes('jupiter'))
  assert.ok(retro.includes('uranus'))
})

test('computeSky returns a well-formed snapshot', () => {
  const sky = computeSky(new Date('2026-09-05T09:00:00Z'))
  assert.equal(sky.bodies.length, 10)
  assert.ok(sky.moon.phase)
  assert.ok(sky.moon.illuminationPercent >= 0 && sky.moon.illuminationPercent <= 100)
  assert.ok(Array.isArray(sky.aspects))
  assert.ok(sky.moon.nextIngress === null || typeof sky.moon.nextIngress.inHours === 'number')
})
