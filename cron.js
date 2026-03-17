// cron.js
// Runs every day at 6:00 AM server time
// Calls Claude API → saves horoscope as published → live on site

const cron  = require('node-cron')
const fetch = require('node-fetch')
const { getDB } = require('./db')

function log(msg) {
  console.log(`[CRON ${new Date().toISOString()}] ${msg}`)
}

async function generateDailyHoroscope() {
  log('Starting daily horoscope generation...')

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      log('✗ ANTHROPIC_API_KEY not set — skipping')
      return
    }

    const today    = new Date().toISOString().split('T')[0]
    const dateNice = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    // Check if today's horoscope already exists
    const { data: existing } = await getDB()
      .from('horoscopes')
      .select('id, status')
      .eq('date', today)
      .maybeSingle()

    if (existing) {
      log(`✓ Horoscope for ${today} already exists (${existing.status}) — skipping`)
      return
    }

    log(`Calling Claude API for ${dateNice}...`)

    const prompt = `You are an elite astrologer, behavioral psychologist, and high-level copywriter specializing in Scorpio personality.

Your task is to write a DAILY Scorpio horoscope that feels deeply personal, emotionally precise, and psychologically intense — never generic.

DATE: [INSERT DATE]

CORE GOAL:
The reader must feel:
- “This is exactly about me”
- slightly exposed (in a good way)
- emotionally engaged
- compelled to come back tomorrow

---

MANDATORY RULES:

- Write in second person ("you")
- Do NOT use em dashes (—) or long dashes
- Tone: intense, observant, emotionally sharp, slightly confrontational
- Avoid ALL clichés (no “good things are coming”, no “stay positive”)
- Every sentence must feel specific and intentional
- Total length: 120–180 words
- Do NOT repeat the same theme every day (rotate: power, desire, confidence, clarity, transformation, control, emotional depth — not only betrayal)

---

PSYCHOLOGICAL ELEMENTS (must include at least 3):

- A subtle behavioral detail (pause, tone, silence, distance, look, timing)
- Internal conflict (what you feel vs what you admit)
- Power dynamic (who is in control / losing control)
- Hidden truth or realization
- Emotional tension (attraction, doubt, resistance)

---

STRUCTURE:

1. ✦ OVERALL ENERGY (2–3 sentences)
- Start with a bold, intrusive insight (hook)
- Make something unavoidable or already happening

2. ♥ LOVE & RELATIONSHIPS (2–3 sentences)
- Focus on emotional tension or subtle signals
- Include one micro-specific observation

3. ◈ CAREER & AMBITION (2–3 sentences)
- Focus on positioning, strategy, or hidden dynamics
- Make it feel like something is shifting

4. ◉ HEALTH & BODY (1–2 sentences)
- Connect physical sensation to emotional resistance

5. ☽ SPIRITUAL GUIDANCE (1–2 sentences)
- Reveal a deeper truth the reader already senses

6. ⚡ POWER MOVE (1 sentence — REQUIRED)
- Give a clear, specific behavioral action
- Must feel like insider advice

7. 🎯 FINAL LINE (1 sentence — REQUIRED)
- Cinematic, sharp, memorable
- Should feel like a truth hitting directly

---

STYLE REQUIREMENTS:

- At least ONE “ego-trigger” line:
  Example style: “You’re not confused—you’re avoiding the answer.”
  
- At least ONE “micro-specific moment”:
  Example: “that pause before they answered”, “the way their tone changed”

- Avoid repeating “someone is fake” every day — vary themes

---

FORBIDDEN:

- No vague statements
- No repetition
- No soft, safe endings
- No filler sentences

---

QUALITY CHECK (before finishing):

Ask yourself:
- Would a Scorpio screenshot this?
- Does at least one line feel slightly uncomfortable but true?
- Is there a clear action (Power Move)?
- Is the ending strong enough to stay in their mind?

If not — rewrite.

---

Write like you understand something about them they haven’t admitted yet.

Return ONLY valid JSON, no markdown:
{
  "cosmic_weather":"🌙 Moon in X · ♂ aspect · ♀ aspect",
  "energy":{"love":75,"career":70,"health":72,"spirit":80},
  "daily_overall":"2-3 sentences max",
  "daily_love":"2-3 sentences max",
  "daily_career":"2-3 sentences max",
  "daily_health":"2-3 sentences max",
  "daily_spiritual":"2-3 sentences max",
  "lucky_numbers":"8 · 17 · 23",
  "lucky_color":"one color",
  "lucky_crystal":"one crystal",
  "best_hour":"one time",
  "affirmation":"one punchy sentence in quotes",
  "reflection":"one sharp question",
  "weekly_overview":"2-3 sentences",
  "weekly_love":"2-3 sentences",
  "weekly_career":"2-3 sentences",
  "weekly_affirmation":"one sentence in quotes",
  "weekly_reflection":"one question",
  "monthly_overview":"2-3 sentences",
  "monthly_love":"2-3 sentences",
  "monthly_career":"2-3 sentences",
  "monthly_power_dates":"3 dates",
  "monthly_theme":"one word",
  "monthly_crystal":"one crystal",
  "monthly_mantra":"two words",
  "monthly_affirmation":"one sentence in quotes",
  "monthly_reflection":"one question"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages:   [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Claude API ${response.status}: ${err}`)
    }

    const body  = await response.json()
    const raw   = (body.content?.[0]?.text || '').replace(/```json|```/g, '').trim()
    const d     = JSON.parse(raw)
    const e     = d.energy || {}

    const row = {
      date:                today,
      status:              'published',   // goes live immediately
      cosmic_weather:      d.cosmic_weather      || '',
      love_score:          Math.min(95, Math.max(45, parseInt(e.love)   || 75)),
      career_score:        Math.min(95, Math.max(45, parseInt(e.career) || 70)),
      health_score:        Math.min(95, Math.max(45, parseInt(e.health) || 72)),
      spirit_score:        Math.min(95, Math.max(45, parseInt(e.spirit) || 80)),
      daily_overall:       d.daily_overall       || '',
      daily_love:          d.daily_love          || '',
      daily_career:        d.daily_career        || '',
      daily_health:        d.daily_health        || '',
      daily_spiritual:     d.daily_spiritual     || '',
      lucky_numbers:       d.lucky_numbers       || '',
      lucky_color:         d.lucky_color         || '',
      lucky_crystal:       d.lucky_crystal       || '',
      best_hour:           d.best_hour           || '',
      affirmation:         d.affirmation         || '',
      reflection:          d.reflection          || '',
      weekly_overview:     d.weekly_overview     || '',
      weekly_love:         d.weekly_love         || '',
      weekly_career:       d.weekly_career       || '',
      weekly_affirmation:  d.weekly_affirmation  || '',
      weekly_reflection:   d.weekly_reflection   || '',
      monthly_overview:    d.monthly_overview    || '',
      monthly_love:        d.monthly_love        || '',
      monthly_career:      d.monthly_career      || '',
      monthly_power_dates: d.monthly_power_dates || '',
      monthly_theme:       d.monthly_theme       || '',
      monthly_crystal:     d.monthly_crystal     || '',
      monthly_mantra:      d.monthly_mantra      || '',
      monthly_affirmation: d.monthly_affirmation || '',
      monthly_reflection:  d.monthly_reflection  || '',
    }

    const { error } = await getDB()
      .from('horoscopes')
      .upsert(row, { onConflict: 'date' })

    if (error) throw error

    log(`✓ Horoscope for ${today} generated and published successfully`)

  } catch (err) {
    log(`✗ Error: ${err.message}`)
  }
}

// ── Schedule: every day at 6:00 AM ───────────────────────
// Cron format: second(optional) minute hour day month weekday
// '0 6 * * *' = at 06:00 every day
function startCron() {
  cron.schedule('0 6 * * *', () => {
    generateDailyHoroscope()
  }, {
    timezone: 'UTC'   // change to your timezone e.g. 'Europe/Skopje'
  })

  log('✓ Daily horoscope cron scheduled — runs every day at 06:00 UTC')

  // Also run immediately on startup if no horoscope exists today
  checkAndGenerateToday()
}

async function checkAndGenerateToday() {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await getDB()
    .from('horoscopes')
    .select('id')
    .eq('date', today)
    .eq('status', 'published')
    .maybeSingle()

  if (!data) {
    log('No published horoscope for today — generating now...')
    await generateDailyHoroscope()
  } else {
    log(`✓ Horoscope for today (${today}) already exists`)
  }
}

module.exports = { startCron, generateDailyHoroscope }
