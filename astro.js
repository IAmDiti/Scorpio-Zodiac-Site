// astro.js
// Calculates approximate moon, venus, mars signs from birth date
// These are approximate (±1 sign) without birth time, but good enough for personalization

// Sign names
const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

const SIGN_TRAITS = {
  Aries:       { element:'Fire',  mode:'Cardinal', keyword:'bold and impulsive'         },
  Taurus:      { element:'Earth', mode:'Fixed',    keyword:'sensual and stubborn'        },
  Gemini:      { element:'Air',   mode:'Mutable',  keyword:'curious and restless'        },
  Cancer:      { element:'Water', mode:'Cardinal', keyword:'protective and emotional'    },
  Leo:         { element:'Fire',  mode:'Fixed',    keyword:'proud and magnetic'          },
  Virgo:       { element:'Earth', mode:'Mutable',  keyword:'analytical and precise'      },
  Libra:       { element:'Air',   mode:'Cardinal', keyword:'charming and indecisive'     },
  Scorpio:     { element:'Water', mode:'Fixed',    keyword:'intense and perceptive'      },
  Sagittarius: { element:'Fire',  mode:'Mutable',  keyword:'free and philosophical'      },
  Capricorn:   { element:'Earth', mode:'Cardinal', keyword:'ambitious and controlled'    },
  Aquarius:    { element:'Air',   mode:'Fixed',    keyword:'detached and original'       },
  Pisces:      { element:'Water', mode:'Mutable',  keyword:'dreamy and empathetic'       },
}

// Julian Day Number calculation
function julianDay(year, month, day) {
  if (month <= 2) { year -= 1; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5
}

// ── MOON SIGN ─────────────────────────────────────────────
// Moon moves ~13.18°/day, full cycle ~27.32 days
function getMoonSign(birthDate) {
  const d    = new Date(birthDate)
  const year = d.getUTCFullYear()
  const month= d.getUTCMonth() + 1
  const day  = d.getUTCDate()

  // Known reference: Moon was in Aries at J2000.0 (Jan 1.5, 2000) at ~218.3°
  const JD   = julianDay(year, month, day)
  const J2000 = 2451545.0

  // Moon's mean longitude at J2000: 218.3165°
  // Daily motion: 13.17639646°/day
  const moonLon = (218.3165 + 13.17639646 * (JD - J2000)) % 360
  const lon     = moonLon < 0 ? moonLon + 360 : moonLon

  return SIGNS[Math.floor(lon / 30)]
}

// ── VENUS SIGN ────────────────────────────────────────────
// Venus moves ~1.6°/day on average, cycle ~224.7 days
function getVenusSign(birthDate) {
  const d    = new Date(birthDate)
  const year = d.getUTCFullYear()
  const month= d.getUTCMonth() + 1
  const day  = d.getUTCDate()

  const JD    = julianDay(year, month, day)
  const J2000 = 2451545.0

  // Venus mean longitude at J2000: 181.979801°
  // Daily motion: 1.60213°/day
  const venusLon = (181.979801 + 1.60213 * (JD - J2000)) % 360
  const lon      = venusLon < 0 ? venusLon + 360 : venusLon

  return SIGNS[Math.floor(lon / 30)]
}

// ── MARS SIGN ─────────────────────────────────────────────
// Mars moves ~0.524°/day, cycle ~686.97 days
function getMarsSign(birthDate) {
  const d    = new Date(birthDate)
  const year = d.getUTCFullYear()
  const month= d.getUTCMonth() + 1
  const day  = d.getUTCDate()

  const JD    = julianDay(year, month, day)
  const J2000 = 2451545.0

  // Mars mean longitude at J2000: 355.433275°
  // Daily motion: 0.52402680°/day
  const marsLon = (355.433275 + 0.52402680 * (JD - J2000)) % 360
  const lon     = marsLon < 0 ? marsLon + 360 : marsLon

  return SIGNS[Math.floor(lon / 30)]
}

// ── MAIN: get full chart summary ──────────────────────────
function getChartSummary(birthDate) {
  if (!birthDate) return null

  try {
    const moon  = getMoonSign(birthDate)
    const venus = getVenusSign(birthDate)
    const mars  = getMarsSign(birthDate)

    const moonT  = SIGN_TRAITS[moon]
    const venusT = SIGN_TRAITS[venus]
    const marsT  = SIGN_TRAITS[mars]

    return {
      moon,  venus, mars,
      moonElement:   moonT.element,
      venusElement:  venusT.element,
      marsElement:   marsT.element,
      summary: `Moon in ${moon} (${moonT.keyword}), Venus in ${venus} (${venusT.keyword}), Mars in ${mars} (${marsT.keyword})`
    }
  } catch (e) {
    return null
  }
}

module.exports = { getChartSummary, getMoonSign, getVenusSign, getMarsSign, SIGNS, SIGN_TRAITS }
