// email.js — sends emails via Resend (resend.com)
// Free tier: 3,000 emails/month

function getResend() {
  try {
    const { Resend } = require('resend')
    return new Resend(process.env.RESEND_API_KEY)
  } catch (e) {
    return null
  }
}

const FROM = 'Scorpio Zodiac <readings@zodiacsignzone.com>'
const SITE = process.env.APP_URL || 'https://www.zodiacsignzone.com'

// ── Daily reading notification ────────────────────────────
async function sendDailyReadingEmail(user) {
  if (!process.env.RESEND_API_KEY) return
  const resend = getResend()
  if (!resend) return
  try {
    const firstName = (user.name || 'Scorpio').split(' ')[0]
    const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })

    await resend.emails.send({
      from:    FROM,
      to:      user.email,
      subject: `Your Scorpio reading for ${today} is ready`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#12101a;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:2.5rem;color:#a897c8;margin-bottom:8px;">♏</div>
      <h1 style="font-size:1.4rem;color:#e8e0d5;margin:0 0 4px;font-weight:600;">Scorpio Zodiac</h1>
      <p style="font-family:'Courier New',monospace;font-size:.7rem;color:#6b6384;text-transform:uppercase;letter-spacing:.12em;margin:0;">${today}</p>
    </div>

    <!-- Main card -->
    <div style="background:#1e1b2e;border:1px solid #2e2a42;border-radius:16px;padding:28px;margin-bottom:20px;">
      <p style="color:#9d94b4;font-size:1rem;line-height:1.75;margin:0 0 20px;">
        ${firstName}, your reading for today is ready.
      </p>
      <p style="color:#9d94b4;font-size:.95rem;line-height:1.75;margin:0 0 24px;font-style:italic;">
        The cosmic currents shift daily. Yours is waiting.
      </p>
      <div style="text-align:center;">
        <a href="${SITE}" style="display:inline-block;background:linear-gradient(135deg,#5c4a82,#7d5c70);color:#e8e0d5;text-decoration:none;padding:12px 32px;border-radius:40px;font-family:'Courier New',monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;">
          Read My Horoscope
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:20px;border-top:1px solid #2e2a42;">
      <p style="font-family:'Courier New',monospace;font-size:.6rem;color:#3a354a;text-transform:uppercase;letter-spacing:.1em;margin:0 0 8px;">
        Scorpio Zodiac · Daily Readings
      </p>
      <p style="font-family:'Courier New',monospace;font-size:.58rem;color:#3a354a;margin:0;">
        <a href="${SITE}/contact.html" style="color:#5c4a82;text-decoration:none;">Unsubscribe</a>
        &nbsp;·&nbsp;
        <a href="${SITE}/privacy.html" style="color:#5c4a82;text-decoration:none;">Privacy</a>
      </p>
    </div>

  </div>
</body>
</html>`
    })
    return true
  } catch (err) {
    console.error(`[EMAIL] Failed to send to ${user.email}:`, err.message)
    return false
  }
}

// ── Welcome email after signup ────────────────────────────
async function sendWelcomeEmail(user) {
  if (!process.env.RESEND_API_KEY) return
  const resend = getResend()
  if (!resend) return
  try {
    const firstName = (user.name || 'Scorpio').split(' ')[0]

    await resend.emails.send({
      from:    FROM,
      to:      user.email,
      subject: `Welcome to Scorpio Zodiac, ${firstName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#12101a;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:2.5rem;color:#a897c8;margin-bottom:8px;">♏</div>
      <h1 style="font-size:1.4rem;color:#e8e0d5;margin:0;font-weight:600;">Welcome, ${firstName}</h1>
    </div>
    <div style="background:#1e1b2e;border:1px solid #2e2a42;border-radius:16px;padding:28px;margin-bottom:20px;">
      <p style="color:#9d94b4;font-size:1rem;line-height:1.8;margin:0 0 16px;">
        You're now part of Scorpio Zodiac — a space built exclusively for Scorpios who want more than generic readings.
      </p>
      <p style="color:#9d94b4;font-size:.95rem;line-height:1.8;margin:0 0 24px;">
        Add your birth date in your profile to unlock a daily horoscope written specifically for your chart — your Moon, Venus, and Mars signs.
      </p>
      <div style="text-align:center;">
        <a href="${SITE}" style="display:inline-block;background:linear-gradient(135deg,#5c4a82,#7d5c70);color:#e8e0d5;text-decoration:none;padding:12px 32px;border-radius:40px;font-family:'Courier New',monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;">
          Read Today's Horoscope
        </a>
      </div>
    </div>
    <div style="text-align:center;padding-top:20px;border-top:1px solid #2e2a42;">
      <p style="font-family:'Courier New',monospace;font-size:.6rem;color:#3a354a;text-transform:uppercase;letter-spacing:.1em;margin:0;">
        Scorpio Zodiac · For Scorpios Only
      </p>
    </div>
  </div>
</body>
</html>`
    })
    return true
  } catch (err) {
    console.error(`[EMAIL] Welcome email failed for ${user.email}:`, err.message)
    return false
  }
}

module.exports = { sendDailyReadingEmail, sendWelcomeEmail }
