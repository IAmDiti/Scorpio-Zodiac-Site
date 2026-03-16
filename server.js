// ── Load .env FIRST ───────────────────────────────────────
require('dotenv').config()

const express      = require('express')
const cookieParser = require('cookie-parser')
const path         = require('path')

const app  = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Static files ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')))

// ── API routes ────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'))
app.use('/auth',          require('./routes/auth'))  // for /auth/callback
app.use('/api/horoscope', require('./routes/horoscope'))
app.use('/api/blog',      require('./routes/blog'))
app.use('/api/admin',     require('./routes/admin'))

// ── Debug ────────────────────────────────────────────────
app.get('/api/debug', (_req, res) => {
  res.json({
    status:       '✓ running',
    supabaseUrl:  process.env.SUPABASE_URL        ? '✓' : '✗ MISSING',
    supabaseKey:  process.env.SUPABASE_SERVICE_KEY ? '✓' : '✗ MISSING',
    jwtSecret:    process.env.JWT_SECRET           ? '✓' : '✗ MISSING',
    anthropic:    process.env.ANTHROPIC_API_KEY    ? '✓' : '✗ MISSING',
  })
})

// ── Catch-all → index.html ────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' })
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`\n♏  Scorpio Zodiac → http://localhost:${PORT}`)
  console.log(`   Debug  → http://localhost:${PORT}/api/debug\n`)

  // ── Start daily horoscope cron ──────────────────────────
  // Generates a new horoscope every day at 6:00 AM UTC
  // Also checks on startup — generates today's if missing
  const { startCron } = require('./cron')
  startCron()
})
