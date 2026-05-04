// routes/webhook.js
// Handles Gumroad ping (webhook) on successful purchase
// Flow: payment confirmed → generate PDF reading → email to customer

const express = require('express')
const path    = require('path')
const fs      = require('fs')
const router  = express.Router()

const { getDB } = require('../db')

// ── Send reading email with PDF attachment ───────────────
async function sendReadingDeliveryEmail({ name, email, pdfPath }) {
  const { Resend } = require('resend')
  const resend    = new Resend(process.env.RESEND_API_KEY)
  const firstName = name.split(' ')[0]
  const SITE      = process.env.APP_URL || 'https://www.astranoxis.com'

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
      <div style="font-size:2.5rem;color:#a897c8;margin-bottom:8px;">&#9890;</div>
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
        Scorpio Zodiac &middot; For Scorpios Only
      </p>
    </div>
  </div>
</body>
</html>`
  })
}

// ── POST /api/webhook/gumroad ────────────────────────────
// Gumroad sends a POST with form-urlencoded data (ping)
router.post('/gumroad', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const ping = req.body

    console.log('[GUMROAD] Ping received:', JSON.stringify(ping, null, 2))

    // Verify it's a real sale
    if (ping.test !== 'true' && ping.sale_id === undefined) {
      return res.status(400).json({ error: 'Invalid ping' })
    }

    // Extract customer info from Gumroad ping
    const customerEmail = ping.email
    const customerName  = ping.full_name || ping.email?.split('@')[0] || 'Scorpio'

    if (!customerEmail) {
      console.error('[GUMROAD] No email in ping')
      return res.status(400).json({ error: 'No email' })
    }

    console.log(`[GUMROAD] Sale for: ${customerEmail}`)

    // Respond immediately — Gumroad expects fast response
    res.json({ ok: true })

    // Find their reading request in DB
    setImmediate(async () => {
      try {
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
          console.error(`[GUMROAD] No reading request found for ${customerEmail}`)
          return
        }

        // Mark as paid
        await db.from('reading_requests').update({ paid: true }).eq('id', readingRequest.id)

        // Generate PDF
        const tmpDir  = path.join(__dirname, '..', 'tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

        const fileName = `reading-${readingRequest.id}-${Date.now()}.pdf`
        const pdfPath  = path.join(tmpDir, fileName)

        const { generateLoveReadingPDF } = require('../generate-reading')
        await generateLoveReadingPDF({
          name:       readingRequest.name,
          birthDate:  readingRequest.birthdate,
          status:     readingRequest.status,
          problem:    readingRequest.problem,
          outputPath: pdfPath
        })

        // Email PDF to customer
        await sendReadingDeliveryEmail({
          name:    readingRequest.name,
          email:   customerEmail,
          pdfPath
        })

        // Mark as delivered
        await db.from('reading_requests')
          .update({ delivered: true, delivered_at: new Date().toISOString() })
          .eq('id', readingRequest.id)

        console.log(`[GUMROAD] Reading delivered to ${customerEmail}`)

      } catch (err) {
        console.error('[GUMROAD] Background error:', err.message)
      } finally {
        // Clean up temp PDF
        try {
          const tmpDir  = path.join(__dirname, '..', 'tmp')
          const fileName = `reading-${Date.now()}.pdf`
          fs.unlinkSync(path.join(tmpDir, fileName))
        } catch {}
      }
    })

  } catch (err) {
    console.error('[GUMROAD] Webhook error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router