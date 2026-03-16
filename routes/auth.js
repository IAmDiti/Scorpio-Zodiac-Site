const express  = require('express')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')
const { getDB }       = require('../db')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

// ── helpers ───────────────────────────────────────────────
function setToken(res, user) {
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.cookie('sz_token', token, {
    httpOnly: true, sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return token
}

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY)
}

// ── POST /api/auth/signup ─────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })

    const { data: existing } = await getDB()
      .from('users').select('id').eq('email', email.toLowerCase()).maybeSingle()
    if (existing)
      return res.status(409).json({ error: 'This email is already registered. Please sign in.' })

    const hash = await bcrypt.hash(password, 10)
    const { data: user, error } = await getDB()
      .from('users')
      .insert({ name: name.trim(), email: email.toLowerCase().trim(), password_hash: hash, birth_date: birthDate || null })
      .select('id, name, email, birth_date').single()
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
      console.log(`\n🔑 Reset link for ${email}:\n${process.env.APP_URL || 'http://localhost:3000'}/reset.html?token=${token}\n`)
    }

    res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/auth/google-url ──────────────────────────────
router.get('/google-url', async (req, res) => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) throw error
    res.json({ ok: true, url: data.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /auth/callback ────────────────────────────────────
router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code
    if (!code) return res.redirect('/?error=no_code')

    const supabase = getSupabase()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.user) return res.redirect('/?error=auth_failed')

    const googleUser = data.user
    const email = googleUser.email
    const name  = googleUser.user_metadata?.full_name || googleUser.user_metadata?.name || email.split('@')[0]

    let { data: existing } = await getDB()
      .from('users').select('*').eq('email', email.toLowerCase()).maybeSingle()

    if (!existing) {
      const { data: newUser, error: insertError } = await getDB()
        .from('users')
        .insert({ name, email: email.toLowerCase(), password_hash: 'google-' + crypto.randomBytes(16).toString('hex') })
        .select('*').single()
      if (insertError) return res.redirect('/?error=db_error')
      existing = newUser
    }

    setToken(res, existing)
    res.redirect('/')
  } catch (err) {
    console.error('Google callback error:', err.message)
    res.redirect('/?error=server_error')
  }
})

// ── POST /api/auth/verify-captcha ─────────────────────────
router.post('/verify-captcha', async (req, res) => {
  try {
    const { token } = req.body
    if (!token || !process.env.RECAPTCHA_SECRET_KEY) {
      return res.json({ ok: true, score: 1 })
    }
    const fetch = require('node-fetch')
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    )
    const data = await response.json()
    res.json({ ok: data.success, score: data.score || 0 })
  } catch (err) {
    res.json({ ok: true, score: 1 })
  }
})

module.exports = router
