// routes/streak.js
// Handles daily login streak: record daily checkin, compute streak, award free reading at 30

const express      = require('express')
const router       = express.Router()
const { getDB }    = require('../db')
const { requireAuth } = require('../middleware/auth')

// ── POST /api/streak/checkin ───────────────────────────────
// Call once per day when a logged-in user loads the horoscope.
// Returns { streak, milestone, alreadyDone }
router.post('/checkin', requireAuth, async (req, res) => {
  try {
    const db     = getDB()
    const userId = req.user.id
    const today  = new Date().toISOString().split('T')[0] // YYYY-MM-DD UTC

    // Check if already checked in today
    const { data: existing } = await db
      .from('streak_checkins')
      .select('id')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .maybeSingle()

    if (existing) {
      // Already done today — just return current streak
      const streak = await getStreak(db, userId)
      return res.json({ ok: true, streak, alreadyDone: true })
    }

    // Record today's checkin
    await db.from('streak_checkins').insert({ user_id: userId, checkin_date: today })

    // Compute current streak (consecutive days ending today)
    const streak = await getStreak(db, userId)

    // Milestone check — every 30 days
    let milestone = null
    if (streak > 0 && streak % 30 === 0) {
      // Check we haven't already awarded this milestone
      const { data: awarded } = await db
        .from('streak_rewards')
        .select('id')
        .eq('user_id', userId)
        .eq('streak_count', streak)
        .maybeSingle()

      if (!awarded) {
        // Record reward
        await db.from('streak_rewards').insert({ user_id: userId, streak_count: streak })

        // Mark the user as having a free reading pending
        await db.from('users').update({ free_reading_pending: true }).eq('id', userId)

        // Send the reward email
        try {
          const { data: user } = await db.from('users').select('name, email').eq('id', userId).maybeSingle()
          if (user) await sendMilestoneEmail(user, streak)
        } catch (e) {
          console.error('[streak] milestone email error:', e.message)
        }

        milestone = { streak, reward: 'free_reading' }
      }
    }

    res.json({ ok: true, streak, alreadyDone: false, milestone })
  } catch (err) {
    console.error('[streak] checkin error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/streak ────────────────────────────────────────
// Returns current streak + whether free reading is pending
router.get('/', requireAuth, async (req, res) => {
  try {
    const db     = getDB()
    const userId = req.user.id

    const streak = await getStreak(db, userId)

    const { data: user } = await db
      .from('users')
      .select('free_reading_pending')
      .eq('id', userId)
      .maybeSingle()

    const today = new Date().toISOString().split('T')[0]
    const { data: todayCheck } = await db
      .from('streak_checkins')
      .select('id')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .maybeSingle()

    res.json({
      ok:                   true,
      streak,
      checkedInToday:       !!todayCheck,
      freeReadingPending:   user?.free_reading_pending || false,
      nextMilestone:        30 - (streak % 30),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/streak/history ────────────────────────────────
// Returns last 35 checkin dates for the calendar UI
router.get('/history', requireAuth, async (req, res) => {
  try {
    const db     = getDB()
    const userId = req.user.id

    const { data } = await db
      .from('streak_checkins')
      .select('checkin_date')
      .eq('user_id', userId)
      .order('checkin_date', { ascending: false })
      .limit(35)

    res.json({ ok: true, dates: (data || []).map(r => r.checkin_date) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/streak/claim-reading ────────────────────────
// User clicks "Claim My Free Reading" — redirects to form prefilled
router.post('/claim-reading', requireAuth, async (req, res) => {
  try {
    const db     = getDB()
    const userId = req.user.id

    const { data: user } = await db
      .from('users')
      .select('name, email, free_reading_pending')
      .eq('id', userId)
      .maybeSingle()

    if (!user?.free_reading_pending)
      return res.status(400).json({ error: 'No free reading pending.' })

    // Clear the pending flag
    await db.from('users').update({ free_reading_pending: false }).eq('id', userId)

    res.json({ ok: true, email: user.email, name: user.name })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── HELPER: compute streak ─────────────────────────────────
async function getStreak(db, userId) {
  // Get all checkin dates sorted descending
  const { data } = await db
    .from('streak_checkins')
    .select('checkin_date')
    .eq('user_id', userId)
    .order('checkin_date', { ascending: false })

  if (!data || data.length === 0) return 0

  const dates = data.map(r => r.checkin_date)
  const today = new Date().toISOString().split('T')[0]

  // Streak must include today or yesterday (allow 1 day grace)
  const mostRecent = dates[0]
  const daysSinceLast = diffDays(today, mostRecent)
  if (daysSinceLast > 1) return 0 // streak broken

  let streak = 0
  let expected = mostRecent

  for (const date of dates) {
    if (date === expected) {
      streak++
      // Next expected date is one day before
      expected = subtractDay(expected)
    } else {
      break
    }
  }

  return streak
}

function diffDays(a, b) {
  const da = new Date(a), db = new Date(b)
  return Math.round((da - db) / (1000 * 60 * 60 * 24))
}

function subtractDay(dateStr) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

// ── Milestone email ────────────────────────────────────────
async function sendMilestoneEmail(user, streak) {
  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0d0b14;font-family:Georgia,serif;color:#f2eeff">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#e879a0;margin:0 0 10px">✦ Astranoxis ✦</p>
      <h1 style="font-size:26px;font-weight:700;color:#f2eeff;margin:0 0 8px;line-height:1.2">${streak} Days. You showed up.</h1>
      <p style="font-size:14px;color:#7a6a9a;margin:0">That's pure Scorpio energy.</p>
    </div>
    <div style="text-align:center;font-size:56px;margin:24px 0">🔥</div>
    <p style="font-size:16px;color:#c0aedd;line-height:1.8;margin-bottom:24px">
      ${user.name}, you've checked in for <strong style="color:#f2eeff">${streak} days in a row</strong>. That kind of consistency is rare — and we see it.
    </p>
    <p style="font-size:16px;color:#c0aedd;line-height:1.8;margin-bottom:32px">
      As a reward for your dedication, you've earned a <strong style="color:#e879a0">free personalized Scorpio Love Reading</strong> — normally €9, yours at no cost.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${process.env.APP_URL}/reading?free=1&email=${encodeURIComponent(user.email)}"
         style="display:inline-block;padding:16px 40px;border-radius:50px;background:linear-gradient(135deg,#7c3aed,#e879a0);color:#fff;font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 4px 24px rgba(200,80,180,0.4)">
        ✦ Claim My Free Reading
      </a>
    </div>
    <p style="font-size:13px;color:#4a3f65;text-align:center;margin-top:24px">
      This link is personal to you and expires in 7 days.
    </p>
    <div style="border-top:1px solid rgba(124,58,237,0.15);margin-top:36px;padding-top:20px;text-align:center">
      <p style="font-size:11px;color:#4a3f65">© ${new Date().getFullYear()} Astranoxis · <a href="${process.env.APP_URL}/privacy" style="color:#7c3aed;text-decoration:none">Privacy</a></p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from:    'Astranoxis <readings@astranoxis.com>',
    to:      [user.email],
    subject: `🔥 ${user.name}, your ${streak}-day streak just earned you a free reading`,
    html,
    text:    `${user.name}, you've hit ${streak} days in a row on Astranoxis! As a reward, you've earned a free personalized Scorpio Love Reading. Claim it here: ${process.env.APP_URL}/reading?free=1&email=${encodeURIComponent(user.email)}`
  })
}

module.exports = router
