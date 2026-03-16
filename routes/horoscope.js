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

    const prompt = `You are a professional astrologer for Scorpio Zodiac. Today is ${dateNice}.
Write a complete horoscope package for Scorpio. Be deep, psychological, poetic.
Return ONLY valid JSON, no markdown, no explanation:
{
  "cosmic_weather":"🌙 Moon in X · ♂ aspect · ♀ aspect",
  "energy":{"love":75,"career":70,"health":72,"spirit":80},
  "daily_overall":"2 paragraphs",
  "daily_love":"2 paragraphs",
  "daily_career":"2 paragraphs",
  "daily_health":"1-2 paragraphs",
  "daily_spiritual":"2 paragraphs",
  "lucky_numbers":"8 · 17 · 23",
  "lucky_color":"Deep rose",
  "lucky_crystal":"Obsidian",
  "best_hour":"9 PM",
  "affirmation":"Your affirmation",
  "reflection":"Your question",
  "weekly_overview":"2 paragraphs",
  "weekly_love":"1-2 paragraphs",
  "weekly_career":"1-2 paragraphs",
  "weekly_affirmation":"affirmation",
  "weekly_reflection":"question",
  "monthly_overview":"2 paragraphs",
  "monthly_love":"1-2 paragraphs",
  "monthly_career":"1-2 paragraphs",
  "monthly_power_dates":"12 · 20 · 28",
  "monthly_theme":"Emergence",
  "monthly_crystal":"Black Tourmaline",
  "monthly_mantra":"I Transform",
  "monthly_affirmation":"affirmation",
  "monthly_reflection":"question"
}
Energy scores: integers 45–95, vary daily.`

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
