// ── Load .env FIRST ───────────────────────────────────────
require('dotenv').config()

const express      = require('express')
const cookieParser = require('cookie-parser')
const path         = require('path')

const app  = express()
const PORT = process.env.PORT || 3000

// ── Force HTTPS in production ─────────────────────────────
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' &&
      req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, 'https://' + req.headers.host + req.url)
  }
  next()
})
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Clean URLs (no .html) ─────────────────────────────────
app.get('/blog',        (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog.html')))
app.get('/quiz',        (req, res) => res.sendFile(path.join(__dirname, 'public', 'quiz.html')))
app.get('/post',        (req, res) => res.sendFile(path.join(__dirname, 'public', 'post.html')))
app.get('/quiz-play',   (req, res) => res.sendFile(path.join(__dirname, 'public', 'quiz-play.html')))
app.get('/admin',       (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')))
app.get('/privacy',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'privacy.html')))
app.get('/terms',       (req, res) => res.sendFile(path.join(__dirname, 'public', 'terms.html')))
app.get('/contact',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')))
app.get('/auth/callback', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth', 'callback.html')))

// ── Redirect old .html URLs to clean URLs ─────────────────
app.get('/blog.html',       (req, res) => res.redirect(301, '/blog'))
app.get('/quiz.html',       (req, res) => res.redirect(301, '/quiz'))
app.get('/post.html',       (req, res) => res.redirect(301, '/post' + (req.query.slug ? '?slug=' + req.query.slug : '')))
app.get('/quiz-play.html',  (req, res) => res.redirect(301, '/quiz-play' + (req.query.q ? '?q=' + req.query.q : '')))
app.get('/admin.html',      (req, res) => res.redirect(301, '/admin'))
app.get('/privacy.html',    (req, res) => res.redirect(301, '/privacy'))
app.get('/terms.html',      (req, res) => res.redirect(301, '/terms'))
app.get('/contact.html',    (req, res) => res.redirect(301, '/contact'))

// ── Static files ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')))

// ── API routes ────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'))
app.use('/auth',          require('./routes/auth'))
app.use('/api/horoscope', require('./routes/horoscope'))
app.use('/api/personal',  require('./routes/personal'))
app.use('/api/blog',      require('./routes/blog'))
app.use('/api/quizzes',   require('./routes/quizzes'))
app.use('/api/contact',   require('./routes/contact'))
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

  // ── Start personal horoscope cron (6:30 AM UTC) ─────────
  // Generates personalized reading for each user with a birth date
  const nodeCron = require('node-cron')
  const { generatePersonalHoroscopes } = require('./personal-cron')
  nodeCron.schedule('30 6 * * *', generatePersonalHoroscopes, { timezone: 'UTC' })
  console.log('✓ Personal horoscope cron scheduled — runs at 06:30 UTC\n')
})
