// personal-cron.js
// Runs at 6:30 AM — after the generic horoscope generates at 6:00 AM
// Loops through users with birth dates and generates personalized readings

const fetch  = require('node-fetch')
const { getDB }         = require('./db')
const { getChartSummary } = require('./astro')

function log(msg) {
  console.log(`[PERSONAL-CRON ${new Date().toISOString()}] ${msg}`)
}

async function generatePersonalHoroscopes() {
  log('Starting personalized horoscope generation...')

  if (!process.env.ANTHROPIC_API_KEY) {
    log('✗ ANTHROPIC_API_KEY not set — skipping')
    return
  }

  const today    = new Date().toISOString().split('T')[0]
  const dateNice = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  try {
    // Get all users with birth dates
    const { data: users, error } = await getDB()
      .from('users')
      .select('id, name, birth_date')
      .not('birth_date', 'is', null)

    if (error) throw error
    if (!users?.length) { log('No users with birth dates found'); return }

    log(`Found ${users.length} users with birth dates`)

    let generated = 0
    let skipped   = 0

    for (const user of users) {
      try {
        // Check if already generated today
        const { data: existing } = await getDB()
          .from('personal_horoscopes')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle()

        if (existing) { skipped++; continue }

        // Get chart summary
        const chart = getChartSummary(user.birth_date)
        if (!chart) { skipped++; continue }

        // Generate personalized reading
        const horoscope = await generateForUser(user, chart, dateNice)
        if (!horoscope) { skipped++; continue }

        // Save to database
        const { error: saveError } = await getDB()
          .from('personal_horoscopes')
          .upsert({
            user_id:    user.id,
            date:       today,
            moon_sign:  chart.moon,
            venus_sign: chart.venus,
            mars_sign:  chart.mars,
            overall:    horoscope.overall    || '',
            love:       horoscope.love       || '',
            career:     horoscope.career     || '',
            health:     horoscope.health     || '',
            spiritual:  horoscope.spiritual  || '',
            power_move: horoscope.power_move || '',
            final_line: horoscope.final_line || '',
            affirmation:horoscope.affirmation|| '',
            reflection: horoscope.reflection || '',
          }, { onConflict: 'user_id,date' })

        if (saveError) throw saveError

        generated++
        log(`✓ Generated for user ${user.id} (Moon ${chart.moon}, Venus ${chart.venus}, Mars ${chart.mars})`)

        // Small delay between API calls to avoid rate limiting
        await new Promise(r => setTimeout(r, 500))

      } catch (userErr) {
        log(`✗ Error for user ${user.id}: ${userErr.message}`)
      }
    }

    log(`✓ Done — Generated: ${generated}, Skipped: ${skipped}`)

  } catch (err) {
    log(`✗ Fatal error: ${err.message}`)
  }
}

async function generateForUser(user, chart, dateNice) {
  const prompt = `You are an elite astrologer and behavioral psychologist specializing in Scorpio.
Today is ${dateNice}.

Write a PERSONALIZED daily horoscope for this specific Scorpio:
- Moon in ${chart.moon} (${chart.moonElement} — ${chart.summary.split(',')[0].replace('Moon in '+chart.moon+' (','').replace(')','')})
- Venus in ${chart.venus} (${chart.venusElement})
- Mars in ${chart.mars} (${chart.marsElement})

This person has Scorpio Sun. Their Moon in ${chart.moon} means their emotional world is ${getMoonMeaning(chart.moon)}. Their Venus in ${chart.venus} means they love ${getVenusMeaning(chart.venus)}. Their Mars in ${chart.mars} means they act ${getMarsMeaning(chart.mars)}.

RULES:
- Write in second person ("you")
- Reference their specific Moon/Venus/Mars placements naturally — don't just list them
- Tone: intense, psychologically sharp, slightly confrontational
- Every sentence must feel written for THIS person specifically
- Include at least one ego-trigger line and one micro-specific behavioral detail
- Vary the theme daily (power, desire, clarity, transformation, control, depth)

Return ONLY valid JSON, no markdown:
{
  "overall":"2-3 sentences — hook with a bold insight specific to their chart",
  "love":"2-3 sentences — reference their Venus sign naturally",
  "career":"2-3 sentences — reference their Mars sign naturally",
  "health":"1-2 sentences",
  "spiritual":"1-2 sentences — reference their Moon sign",
  "power_move":"1 sentence — specific action tailored to their placements",
  "final_line":"1 cinematic sentence that hits like a truth",
  "affirmation":"one punchy sentence in quotes",
  "reflection":"one sharp question specific to their chart"
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages:   [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) throw new Error(`Claude API ${response.status}`)

    const body = await response.json()
    const raw  = (body.content?.[0]?.text || '').replace(/```json|```/g, '').trim()
    return JSON.parse(raw)

  } catch (err) {
    log(`API error for user ${user.id}: ${err.message}`)
    return null
  }
}

// Moon sign emotional meanings for the prompt
function getMoonMeaning(sign) {
  const meanings = {
    Aries:       'reactive, quick to feel and quick to move on',
    Taurus:      'deeply sensory, needs security and consistency',
    Gemini:      'intellectually restless, processes feelings through words',
    Cancer:      'deeply intuitive, protective, emotionally intense',
    Leo:         'expressive, needs recognition and warmth',
    Virgo:       'analytical about feelings, tends to overthink emotions',
    Libra:       'needs harmony, emotionally affected by others\' moods',
    Scorpio:     'emotionally magnetic, feels everything deeply and privately',
    Sagittarius: 'emotionally free-spirited, avoids heaviness',
    Capricorn:   'emotionally controlled, slow to show vulnerability',
    Aquarius:    'emotionally detached, processes feelings intellectually',
    Pisces:      'deeply empathetic, absorbs others\' emotions easily',
  }
  return meanings[sign] || 'complex and layered'
}

function getVenusMeaning(sign) {
  const meanings = {
    Aries:       'boldly and impulsively',
    Taurus:      'through physical presence and loyalty',
    Gemini:      'through words and intellectual stimulation',
    Cancer:      'with deep protectiveness and nurturing',
    Leo:         'dramatically and with total devotion',
    Virgo:       'through acts of service and attention to detail',
    Libra:       'with charm, balance, and aesthetic appreciation',
    Scorpio:     'with consuming intensity and absolute loyalty',
    Sagittarius: 'freely and adventurously',
    Capricorn:   'with commitment and long-term thinking',
    Aquarius:    'unconventionally and with intellectual connection',
    Pisces:      'with fantasy, depth, and spiritual connection',
  }
  return meanings[sign] || 'deeply and completely'
}

function getMarsMeaning(sign) {
  const meanings = {
    Aries:       'impulsively and directly',
    Taurus:      'slowly but with unstoppable persistence',
    Gemini:      'through strategy and multiple approaches',
    Cancer:      'defensively and with emotional fuel',
    Leo:         'boldly and with need for recognition',
    Virgo:       'methodically and with precision',
    Libra:       'diplomatically, often avoiding direct conflict',
    Scorpio:     'with calculated intensity and total focus',
    Sagittarius: 'enthusiastically and without hesitation',
    Capricorn:   'with long-term strategy and discipline',
    Aquarius:    'in unconventional and rebellious ways',
    Pisces:      'intuitively and often indirectly',
  }
  return meanings[sign] || 'with Scorpionic intensity'
}

module.exports = { generatePersonalHoroscopes }
