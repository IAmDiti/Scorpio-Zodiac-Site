// routes/reading.js
const express = require('express')
const router  = express.Router()
const { getDB } = require('../db')

// POST /api/reading — save form submission, return checkout URL
router.post('/api/reading', async (req, res) => {
  const { name, birthdate, status, problem, email } = req.body

  // ── Validation ──
  if (!name || name.trim().length < 2)
    return res.status(400).json({ error: 'Please enter your name.' })
  if (!birthdate)
    return res.status(400).json({ error: 'Please enter your birth date.' })
  if (!status)
    return res.status(400).json({ error: 'Please select your relationship status.' })
  if (!problem || problem.trim().length < 10)
    return res.status(400).json({ error: 'Please describe your love challenge.' })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address.' })

  // Age gate (18+)
  const dob = new Date(birthdate)
  const age = Math.floor((Date.now() - dob) / (365.25 * 24 * 60 * 60 * 1000))
  if (age < 18)
    return res.status(400).json({ error: 'You must be 18 or older.' })

  // Scorpio gate
  const m   = dob.getMonth() + 1
  const day = dob.getDate()
  const isScorpio = (m === 10 && day >= 23) || (m === 11 && day <= 21)
  if (!isScorpio)
    return res.status(400).json({ error: 'This reading is for Scorpios (Oct 23 – Nov 21).' })

  // ── Save to Supabase ──
  try {
    const db = getDB()
    await db.from('reading_requests').insert({
      name:      name.trim(),
      birthdate,
      status,
      problem:   problem.trim(),
      email:     email.toLowerCase().trim(),
      paid:      false,
      delivered: false,
    })
  } catch (err) {
    console.error('[reading] DB insert error:', err.message)
    // Don't block checkout if DB fails — still send them to pay
  }

  // ── Send confirmation email ──
  try {
    const { sendReadingConfirmationEmail } = require('../email')
    await sendReadingConfirmationEmail({ name: name.trim(), email: email.toLowerCase().trim() })
  } catch (err) {
    console.error('[EMAIL] Reading confirmation error:', err.message)
  }

  // ── Build Lemon Squeezy checkout URL ──
  const baseUrl = process.env.LEMONSQUEEZY_CHECKOUT_URL
  if (!baseUrl) {
    // No checkout URL configured yet — go straight to success (dev mode)
    return res.json({
      checkoutUrl: `/reading/success?name=${encodeURIComponent(name.trim())}&email=${encodeURIComponent(email.toLowerCase().trim())}`
    })
  }

  const checkoutUrl = new URL(baseUrl)
  checkoutUrl.searchParams.set('checkout[email]', email.toLowerCase().trim())
  checkoutUrl.searchParams.set('checkout[name]',  name.trim())
  // Pass email as custom data so webhook can find the request
  checkoutUrl.searchParams.set('checkout[custom][email]', email.toLowerCase().trim())

  return res.json({ checkoutUrl: checkoutUrl.toString() })
})

// GET /reading — serve the form page
router.get('/reading', (_req, res) => {
  res.sendFile(require('path').join(__dirname, '..', 'public', 'reading.html'))
})

// GET /reading/success — serve the success page
router.get('/reading/success', (_req, res) => {
  res.sendFile(require('path').join(__dirname, '..', 'public', 'reading-success.html'))
})

// GET /horoscope — serve the horoscope page
router.get('/horoscope', (_req, res) => {
  res.sendFile(require('path').join(__dirname, '..', 'public', 'horoscope.html'))
})

module.exports = router
