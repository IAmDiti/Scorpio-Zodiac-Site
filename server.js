require('dotenv').config()

const express      = require('express')
const cookieParser = require('cookie-parser')
const path         = require('path')

const app  = express()
const PORT = process.env.PORT || 3000

// ── Force HTTPS + www redirect ────────────────────────────
app.use((req, res, next) => {
  const host  = req.headers.host || ''
  const proto = req.headers['x-forwarded-proto']
  if (process.env.NODE_ENV === 'production') {
    if (proto && proto !== 'https') {
      return res.redirect(301, 'https://' + host + req.url)
    }
  }
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Debug route (test server is alive) ───────────────────
app.get('/api/debug', (_req, res) => {
  res.json({
    status:      'running',
    supabase:    process.env.SUPABASE_URL        ? 'ok' : 'MISSING',
    jwt:         process.env.JWT_SECRET           ? 'ok' : 'MISSING',
    anthropic:   process.env.ANTHROPIC_API_KEY    ? 'ok' : 'MISSING',
    nodeEnv:     process.env.NODE_ENV || 'not set',
    time:        new Date().toISOString()
  })
})

// ── Test login route (to verify routing works) ────────────
app.post('/api/test-login', (req, res) => {
  res.json({ ok: true, received: req.body })
})

// ── Reading funnel + streak routes ───────────────────────
app.use('/',             require('./routes/reading'))
app.use('/api/streak',   require('./routes/streak'))

// ── API routes ────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'))
app.use('/auth',         require('./routes/auth'))
app.use('/api/horoscope',require('./routes/horoscope'))
app.use('/api/personal', require('./routes/personal'))
app.use('/api/blog',     require('./routes/blog'))
app.use('/api/quizzes',  require('./routes/quizzes'))
app.use('/api/contact',  require('./routes/contact'))
app.use('/api/admin',    require('./routes/admin'))

// ── Clean URL routes ──────────────────────────────────────
const send = (f) => (_req, res) => res.sendFile(path.join(__dirname, 'public', f))
app.get('/blog',            send('blog.html'))
app.get('/quiz',            send('quiz.html'))
app.get('/post',            send('post.html'))
app.get('/quiz-play',       send('quiz-play.html'))
app.get('/admin',           send('admin.html'))
app.get('/privacy',         send('privacy.html'))
app.get('/terms',           send('terms.html'))
app.get('/contact',         send('contact.html'))
app.get('/horoscope',       send('horoscope.html'))
app.get('/auth/callback',   send('auth/callback.html'))

// ── Redirect .html to clean URLs ─────────────────────────
app.get('/blog.html',      (_req, res) => res.redirect(301, '/blog'))
app.get('/quiz.html',      (_req, res) => res.redirect(301, '/quiz'))
app.get('/admin.html',     (_req, res) => res.redirect(301, '/admin'))
app.get('/privacy.html',   (_req, res) => res.redirect(301, '/privacy'))
app.get('/terms.html',     (_req, res) => res.redirect(301, '/terms'))
app.get('/contact.html',   (_req, res) => res.redirect(301, '/contact'))
app.get('/post.html',      (req, res)  => res.redirect(301, '/post' + (req.query.slug ? '?slug=' + req.query.slug : '')))
app.get('/quiz-play.html', (req, res)  => res.redirect(301, '/quiz-play' + (req.query.q ? '?q=' + req.query.q : '')))

// ── Static files ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')))

// ── 404 for unknown API routes ────────────────────────────
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'API route not found' }))

// ── Catch-all → index.html ────────────────────────────────
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))

app.listen(PORT, () => {
  console.log(`\n♏  Scorpio Zodiac → http://localhost:${PORT}`)
  console.log(`   Debug → http://localhost:${PORT}/api/debug\n`)

  const { startCron } = require('./cron')
  startCron()

  const cron = require('node-cron')
  const { generatePersonalHoroscopes } = require('./personal-cron')
  cron.schedule('30 6 * * *', generatePersonalHoroscopes, { timezone: 'UTC' })
  console.log('✓ Personal horoscope cron scheduled\n')
})
