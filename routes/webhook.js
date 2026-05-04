// routes/webhook.js
// Handles Lemon Squeezy payment webhooks
// On successful payment: generate PDF reading → email to customer

const express = require('express')
const crypto  = require('crypto')
const path    = require('path')
const fs      = require('fs')
const router  = express.Router()

const { getDB } = require('../db')

// ── Verify Lemon Squeezy webhook signature ───────────────
function verifySignature(payload, signature) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) return true // skip verification in dev
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return hash === signature
}

// ── Send reading email with PDF attachment ───────────────
async function sendReadingDeliveryEmail({ name, email, pdfPath }) {
  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const firstName = name.split(' ')[0]
  const SITE = process.env.APP_URL || 'https://www.astranoxis.com'

  const pdfBuffer = fs.readFileSync(pdfPath)
  const pdfBase64 = pdfBuffer.toString('base64')

  await resend.emails.send({
    from: 'Scorpio Zodiac <readings@astranoxis.com>',
    to:   email,
    subject: `${firstName}, your Scorpio Love Reading is here`,
    attachments: [{
      filename: `${firstName}-Scorpio-Love-Reading.pdf`,
      content:  pdfBase64,
    }],
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#12101a;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:2.5rem;color:#a897c8;margin-bottom:8px;">♏</div>
      <h1 style="font-size:1.4rem;color:#e8e0d5;margin:0 0 4px;font-weight:600;">Your Reading Has Arrived</h1>
      <p style="font-family:'Courier New',monospace;font-size:.7rem;color:#6b6384;text-transform:uppercase;letter-spacing:.12em;margin:0;">Personal Love Reading</p>
    </div>
    <div style="background:#1e1b2e;border:1px solid #2e2a42;border-radius:16px;padding:28px;margin-bottom:20px;">
      <p style="color:#9d94b4;font-size:1rem;line-height:1.8;margin:0 0 16px;">
        ${firstName}, your personalized Scorpio Love Reading is attached to this email as a PDF.
      </p>
      <p style="color:#9d94b4;font-size:.95rem;line-height:1.8;margin:0 0 24px;font-style:italic;">
        Read it somewhere quiet. This is personal. Take your time with it.
      </p>
      <div style="text-align:center;">
        <a href="${SITE}" style="display:inline-block;background:linear-gradient(135deg,#5c4a82,#7d5c70);color:#e8e0d5;text-decoration:none;padding:12px 32px;border-radius:40px;font-family:'Courier New',monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;">
          Visit Astranoxis
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
}

// ── POST /api/webhook/lemonsqueezy ───────────────────────
router.post('/lemonsqueezy', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-signature']
    const payload   = req.body

    // Verify signature
    if (!verifySignature(payload, signature)) {
      console.error('[WEBHOOK] Invalid signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const event = JSON.parse(payload.toString())
    const eventName = event.meta?.event_name

    console.log(`[WEBHOOK] Received event: ${eventName}`)

    // Only handle successful orders
    if (eventName !== 'order_created') {
      return res.json({ ok: true, skipped: true })
    }

    const order = event.data?.attributes
    if (!order) return res.status(400).json({ error: 'No order data' })

    // Extract customer info
    const customerEmail = order.user_email || event.meta?.custom_data?.email
    const customerName  = order.user_name  || event.meta?.custom_data?.name || 'Scorpio'

    if (!customerEmail) {
      console.error('[WEBHOOK] No customer email in order')
      return res.status(400).json({ error: 'No customer email' })
    }

    // Find their reading request in DB
    const db = getDB()
    const { data: readingRequest } = await db
      .from('reading_requests')
      .select('*')
      .eq('email', customerEmail.toLowerCase())
      .eq('paid', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!readingRequest) {
      console.error(`[WEBHOOK] No reading request found for ${customerEmail}`)
      // Still return 200 so Lemon Squeezy doesn't retry
      return res.json({ ok: true, warning: 'No reading request found' })
    }

    // Mark as paid immediately
    await db.from('reading_requests').update({ paid: true }).eq('id', readingRequest.id)

    // Respond to webhook immediately (Lemon Squeezy has a 10s timeout)
    res.json({ ok: true })

    // Generate PDF and send email in background
    setImmediate(async () => {
      const tmpDir  = path.join(__dirname, '..', 'tmp')
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

      const fileName = `reading-${readingRequest.id}-${Date.now()}.pdf`
      const pdfPath  = path.join(tmpDir, fileName)

      try {
        const { generateLoveReadingPDF } = require('../generate-reading')
        await generateLoveReadingPDF({
          name:      readingRequest.name,
          birthDate: readingRequest.birthdate,
          status:    readingRequest.status,
          problem:   readingRequest.problem,
          outputPath: pdfPath
        })

        // Send email with PDF
        await sendReadingDeliveryEmail({
          name:    readingRequest.name,
          email:   customerEmail,
          pdfPath
        })

        // Mark as delivered
        await db.from('reading_requests')
          .update({ delivered: true, delivered_at: new Date().toISOString() })
          .eq('id', readingRequest.id)

        console.log(`[WEBHOOK] Reading delivered to ${customerEmail}`)
      } catch (err) {
        console.error(`[WEBHOOK] Failed to generate/send reading for ${customerEmail}:`, err.message)
      } finally {
        // Clean up temp PDF
        try { fs.unlinkSync(pdfPath) } catch {}
      }
    })

  } catch (err) {
    console.error('[WEBHOOK] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
