import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  signFromLongitude,
  formatPosition,
  isInScorpio,
  angularSeparation,
  moonPhaseName,
  findAspects,
} from './zodiac.js'

test('signFromLongitude maps degrees to signs', () => {
  assert.equal(signFromLongitude(0).name, 'Aries')
  assert.equal(signFromLongitude(215).name, 'Scorpio')
  assert.equal(signFromLongitude(359.9).name, 'Pisces')
  assert.equal(signFromLongitude(-10).name, 'Pisces') // wraps
  assert.equal(Math.round(signFromLongitude(215).degreeInSign), 5)
})

test('formatPosition is human-readable', () => {
  assert.equal(formatPosition(210), "0°00' Scorpio")
  assert.equal(formatPosition(222.5), "12°30' Scorpio")
})

test('isInScorpio covers the 210-240 band only', () => {
  assert.equal(isInScorpio(210), true)
  assert.equal(isInScorpio(239.99), true)
  assert.equal(isInScorpio(240), false)
  assert.equal(isInScorpio(209.99), false)
})

test('angularSeparation handles wraparound', () => {
  assert.equal(angularSeparation(10, 350), 20)
  assert.equal(angularSeparation(0, 180), 180)
  assert.equal(angularSeparation(200, 200), 0)
})

test('moonPhaseName bins the elongation angle', () => {
  assert.equal(moonPhaseName(0), 'New Moon')
  assert.equal(moonPhaseName(180), 'Full Moon')
  assert.equal(moonPhaseName(90), 'First Quarter')
  assert.equal(moonPhaseName(270), 'Last Quarter')
})

test('findAspects detects a trine within orb and tags motion', () => {
  const now = { sun: 10, moon: 130, mars: 250 }
  const later = { sun: 11, moon: 143, mars: 250.5 }
  const aspects = findAspects(now, later)
  const sunMoon = aspects.find((a) => a.a === 'moon' && a.b === 'sun')
  assert.equal(sunMoon.aspect, 'trine')
  assert.equal(sunMoon.motion, 'separating') // moon pulling away from exact 120
})
