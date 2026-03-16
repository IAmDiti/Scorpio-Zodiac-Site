const express  = require('express')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')
const { getDB }       = require('../db')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

// ── helper: sign JWT and set cookie ──────────────────────
function setToken(res, user) {
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.cookie('sz_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  })
  return token
}

// ── POST /api/auth/signup ─────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })

    // check duplicate
    const { data: existing } = await getDB()
      .from('users').select('id').eq('email', email.toLowerCase()).maybeSingle()
    if (existing)
      return res.status(409).json({ error: 'This email is already registered. Please sign in.' })

    const hash = await bcrypt.hash(password, 10)
    const { data: user, error } = await getDB()
      .from('users')
      .insert({ name: name.trim(), email: email.toLowerCase().trim(), password_hash: hash, birth_date: birthDate || null })
      .select('id, name, email, birth_date')
      .single()
    if (error) throw error

    setToken(res, user)
    res.status(201).json({ ok: true, user })
  } catch (err) {
    console.error('signup error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/auth/login ──────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' })

    const { data: user } = await getDB()
      .from('users').select('*').eq('email', email.toLowerCase()).maybeSingle()
    if (!user)
      return res.status(401).json({ error: 'No account found with that email.' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok)
      return res.status(401).json({ error: 'Wrong password.' })

    setToken(res, user)
    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, birth_date: user.birth_date } })
  } catch (err) {
    console.error('login error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/auth/logout ─────────────────────────────────
router.post('/logout', (_req, res) => {
  res.clearCookie('sz_token')
  res.json({ ok: true })
})

// ── GET /api/auth/me ──────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { data: user } = await getDB()
      .from('users').select('id, name, email, birth_date').eq('id', req.user.id).maybeSingle()
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json({ ok: true, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/auth/profile ─────────────────────────────────
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, email, birthDate, newPassword } = req.body
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' })

    const updates = { name: name.trim(), email: email.toLowerCase().trim(), birth_date: birthDate || null }
    if (newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' })
      updates.password_hash = await bcrypt.hash(newPassword, 10)
    }

    const { data: user, error } = await getDB()
      .from('users').update(updates).eq('id', req.user.id).select('id, name, email, birth_date').single()
    if (error) throw error

    setToken(res, user)
    res.json({ ok: true, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/auth/forgot-password ───────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required.' })

    const { data: user } = await getDB()
      .from('users').select('id, name, email').eq('email', email.toLowerCase()).maybeSingle()

    if (user) {
      const token  = crypto.randomBytes(32).toString('hex')
      const expiry = new Date(Date.now() + 3600000).toISOString()
      await getDB().from('users').update({ reset_token: token, reset_expiry: expiry }).eq('id', user.id)
      console.log(`\n🔑 Reset link for ${email}:\nhttp://localhost:${process.env.PORT||3000}/reset.html?token=${token}\n`)
    }

    res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
