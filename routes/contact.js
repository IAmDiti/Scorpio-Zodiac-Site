const express = require('express')
const router  = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' })
    }

    // Log to server console (visible in Railway logs)
    console.log(`\n📬 CONTACT FORM SUBMISSION`)
    console.log(`From:    ${name} <${email}>`)
    console.log(`Subject: ${subject}`)
    console.log(`Message: ${message}`)
    console.log(`Time:    ${new Date().toISOString()}\n`)

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
