// routes/personal.js
// GET /api/personal/today — returns today's personalized horoscope for the logged-in user

const express  = require('express')
const { getDB }       = require('../db')
const { requireAuth } = require('../middleware/auth')
const { getChartSummary } = require('../astro')

const router = express.Router()

// Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MK7C2CQ3Q2"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-MK7C2CQ3Q2');
</script>

// ── GET /api/personal/today ───────────────────────────────
router.get('/today', requireAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Get user's birth date
    const { data: user } = await getDB()
      .from('users').select('id, name, birth_date').eq('id', req.user.id).maybeSingle()

    if (!user) return res.status(404).json({ error: 'User not found' })

    // No birth date — can't personalize
    if (!user.birth_date) {
      return res.json({ ok: true, horoscope: null, reason: 'no_birth_date' })
    }

    // Check if today's personal horoscope exists
    const { data: existing } = await getDB()
      .from('personal_horoscopes')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()

    if (existing) {
      return res.json({ ok: true, horoscope: existing })
    }

    // Not generated yet — return chart info so frontend knows to wait
    const chart = getChartSummary(user.birth_date)
    res.json({ ok: true, horoscope: null, reason: 'not_generated', chart })

  } catch (err) {
    console.error('personal today error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/personal/chart ───────────────────────────────
router.get('/chart', requireAuth, async (req, res) => {
  try {
    const { data: user } = await getDB()
      .from('users').select('birth_date').eq('id', req.user.id).maybeSingle()

    if (!user?.birth_date) return res.json({ ok: true, chart: null })

    const chart = getChartSummary(user.birth_date)
    res.json({ ok: true, chart })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
