const express  = require('express')
const fetch    = require('node-fetch')
const { getDB }       = require('../db')
const { requireAuth } = require('../middleware/auth')
const router   = express.Router()

// ── GET /api/horoscope/today ──────────────────────────────
router.get('/today', async (_req, res) => {
  try {
    const { data } = await getDB()
      .from('horoscopes')
      .select('*')
      .eq('status', 'published')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()
    res.json({ ok: true, horoscope: data || null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/horoscope/generate ─────────────────────────
router.post('/generate', requireAuth, async (_req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY)
      return res.status(400).json({ error: 'ANTHROPIC_API_KEY not set in .env' })

    const today    = new Date().toISOString().split('T')[0]
    const dateNice = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

    const prompt = `You are an elite astrologer and behavioral psychologist specializing in Scorpio personality.Today is ${dateNice}.

Write a DAILY horoscope specifically for Scorpio that feels deeply personal, emotionally intense, and psychologically accurate.

Instructions:

- Write in a way that makes the reader feel "this is exactly about me"
- Use second person ("you")
- Tone: intense, mysterious, slightly provocative, emotionally deep
- Avoid generic phrases like "good things are coming"
- Focus on inner thoughts, hidden emotions, power dynamics, trust, control, transformation
- Scorpio traits to emphasize: loyalty, secrecy, intuition, emotional depth, possessiveness, resilience

Structure:

1. Opening Hook (1–2 sentences)
   - Start with a powerful, attention-grabbing emotional insight
   - Make it feel personal and specific

2. Core Reading (3–5 sentences)
   - Describe internal conflict, decisions, or hidden realizations
   - Include subtle psychological tension (trust issues, control, desire, etc.)

3. Love & Relationships (2–3 sentences)
   - Focus on emotional intensity, attraction, distance, or power shifts
   - Make it slightly dramatic or intriguing

4. Career & Money (2–3 sentences)
   - Talk about control, ambition, strategy, or hidden opportunities

5. Closing Line (1 sentence)
   - End with a powerful, almost cinematic statement

Rules:
- DO NOT be generic
- DO NOT repeat common horoscope clichés
- Make every sentence feel intentional and sharp
- Keep total length under 180 words
- Make it addictive to read daily

Goal:
The reader should feel emotionally understood and want to come back every day.

Return ONLY valid JSON, no markdown:
{
  "cosmic_weather":"🌙 Moon in X · ♂ aspect · ♀ aspect",
  "energy":{"love":75,"career":70,"health":72,"spirit":80},
  "daily_overall":"2-3 sentences",
  "daily_love":"2-3 sentences",
  "daily_career":"2-3 sentences",
  "daily_health":"2-3 sentences",
  "daily_spiritual":"2-3 sentences",
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

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:4000, messages:[{ role:'user', content:prompt }] }),
    })
    if (!r.ok) throw new Error(`Claude API ${r.status}`)

    const body  = await r.json()
    const raw   = (body.content?.[0]?.text || '').replace(/```json|```/g,'').trim()
    const d     = JSON.parse(raw)
    const e     = d.energy || {}

    const row = {
      date: today, status: 'published',
      cosmic_weather:      d.cosmic_weather      || '',
      love_score:          Math.min(95,Math.max(45,parseInt(e.love)||75)),
      career_score:        Math.min(95,Math.max(45,parseInt(e.career)||70)),
      health_score:        Math.min(95,Math.max(45,parseInt(e.health)||72)),
      spirit_score:        Math.min(95,Math.max(45,parseInt(e.spirit)||80)),
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

    const { data: saved, error } = await getDB()
      .from('horoscopes').upsert(row, { onConflict: 'date' }).select().single()
    if (error) throw error

    res.json({ ok: true, horoscope: saved })
  } catch (err) {
    console.error('generate error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/horoscope/:id/publish ────────────────────────
router.put('/:id/publish', requireAuth, async (req, res) => {
  try {
    const { data, error } = await getDB()
      .from('horoscopes').update({ status:'published' }).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ ok: true, horoscope: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
