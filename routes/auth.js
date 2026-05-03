const express  = require('express')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')
const router   = express.Router()

const { getDB }       = require('../db')
const { requireAuth } = require('../middleware/auth')

// ── Set JWT cookie ────────────────────────────────────────
function setToken(res, user, req) {
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  const isHttps = req && req.headers['x-forwarded-proto'] === 'https'
  res.cookie('sz_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   isHttps,
    maxAge:   7 * 24 * 60 * 60 * 1000,
  })
  return token
}

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
  )
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
      return res.status(409).json({ error: 'This email is already registered.' })

    const hash = await bcrypt.hash(password, 10)
    const { data: user, error } = await getDB()
      .from('users')
      .insert({ name: name.trim(), email: email.toLowerCase().trim(), password_hash: hash, birth_date: birthDate || null })
      .select('id, name, email, birth_date').single()
    if (error) throw error

    setToken(res, user, req)

    // Welcome email
    try {
      const { sendWelcomeEmail } = require('../email')
      await sendWelcomeEmail(user)
    } catch (e) {
      console.error('[EMAIL] Welcome email error:', e.message)
    }

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
      .from('users').select('*').eq('email', email.toLowerCase().trim()).maybeSingle()
    if (!user)
      return res.status(401).json({ error: 'No account found with that email.' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok)
      return res.status(401).json({ error: 'Wrong password.' })

    setToken(res, user, req)
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

    setToken(res, user, req)
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
    if (!user) return res.json({ ok: true }) // don't reveal if email exists

    const token  = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 3600000).toISOString()

    await getDB().from('users').update({ reset_token: token, reset_expiry: expiry }).eq('id', user.id)

    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/?reset_token=${token}`
    console.log(`\n🔑 Password reset for ${email}:\n${resetUrl}\n`)

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/auth/google-url ──────────────────────────────
router.get('/google-url', async (req, res) => {
  try {
    const clientId   = process.env.GOOGLE_CLIENT_ID
    const redirectTo = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`

    if (!clientId) return res.status(500).json({ error: 'Google OAuth not configured.' })

    const params = new URLSearchParams({
      client_id:     clientId,
      redirect_uri:  redirectTo,
      response_type: 'code',
      scope:         'openid email profile',
      access_type:   'offline',
      prompt:        'consent'
    })

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    res.json({ ok: true, url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/auth/google-token ───────────────────────────
router.post('/google-token', async (req, res) => {
  try {
    const { access_token } = req.body
    const supabase = getSupabase()
    const { data: { user: supaUser }, error } = await supabase.auth.getUser(access_token)
    if (error || !supaUser) return res.status(401).json({ error: 'Invalid token.' })

    const email = supaUser.email?.toLowerCase()
    const name  = supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || email

    let { data: existing } = await getDB().from('users').select('*').eq('email', email).maybeSingle()
    if (!existing) {
      const { data: newUser, error: insertError } = await getDB()
        .from('users')
        .insert({ name, email, password_hash: 'google-oauth', birth_date: null })
        .select('id, name, email, birth_date').single()
      if (insertError) throw insertError
      existing = newUser
    }

    setToken(res, existing, req)
    res.json({ ok: true, user: { id: existing.id, name: existing.name, email: existing.email, birth_date: existing.birth_date } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /auth/callback ────────────────────────────────────
router.get('/callback', async (req, res) => {
  try {
    const { code, error, returnUrl } = req.query
    if (error) return res.redirect('/?error=' + encodeURIComponent(error))
    if (!code)  return res.redirect('/?error=no_code')

    const clientId     = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri  = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret,
        redirect_uri: redirectUri, grant_type: 'authorization_code'
      })
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) return res.redirect('/?error=token_failed')

    // Get user info from Google
    const userRes  = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const googleUser = await userRes.json()
    if (!googleUser.email) return res.redirect('/?error=no_email')

    const email = googleUser.email.toLowerCase()
    const name  = googleUser.name || googleUser.email

    // Find or create user in DB
    let { data: existing } = await getDB()
      .from('users').select('*').eq('email', email).maybeSingle()

    if (!existing) {
      const { data: newUser, error: insertError } = await getDB()
        .from('users')
        .insert({ name, email, password_hash: 'google-oauth', birth_date: null })
        .select('id, name, email, birth_date').single()
      if (insertError) return res.redirect('/?error=db_error')
      existing = newUser
    }

    setToken(res, existing, req)

    // Redirect back to quiz page if returnUrl provided, otherwise home
    const destination = (returnUrl && returnUrl.startsWith('/')) ? returnUrl : '/'
    res.redirect(destination)
  } catch (err) {
    console.error('callback error:', err.message)
    res.redirect('/?error=callback_failed')
  }
})

// ── POST /api/auth/verify-captcha ─────────────────────────
router.post('/verify-captcha', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.json({ ok: false, score: 0 })

    const secret = process.env.RECAPTCHA_SECRET_KEY
    if (!secret) return res.json({ ok: true, score: 1 })

    const r = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, { method: 'POST' })
    const d = await r.json()
    res.json({ ok: d.success, score: d.score || 0 })
  } catch (err) {
    res.json({ ok: true, score: 1 })
  }
})

module.exports = router
