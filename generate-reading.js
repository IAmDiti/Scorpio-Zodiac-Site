// generate-reading.js
// Generates a styled PDF love reading using Claude API + PDFKit
// PDFKit is pure Node.js — no browser or Chrome required

// ── Call Claude API to generate reading content ──────────
async function generateReadingContent({ name, birthDate, status, problem }) {
  const prompt = `You are creating a premium personalized astrology reading for a paying user.
This content will be delivered as a PDF product, so it must feel deeply personal, emotionally accurate, specific to the user's situation, and worth paying for.
Avoid generic astrology phrases. Every section must feel intentional.

User Data:
- Name: ${name}
- Zodiac Sign: Scorpio (fixed)
- Birth Date: ${birthDate}
- Relationship Status: ${status}
- Their Love Challenge: ${problem}

Writing Instructions:
- Address the user by their name naturally throughout the text
- Write like you understand their emotional world
- Be specific depending on their relationship status
- Use a calm, confident tone (not exaggerated, not fake mystical)

OUTPUT FORMAT — write each section with its heading followed by the content. Use these exact section headings:

OPENING
[Start with a strong emotional sentence using their name. Make the reader feel immediately understood.]

YOUR EMOTIONAL NATURE
[Explain how they process emotions, why they feel deeper than others, their hidden intensity. Make it feel like "this is exactly me".]

YOUR LOVE PATTERN
[Explain how they behave in love, what they truly seek deep down, why their relationships are intense or complicated. Include psychological insight.]

YOUR CURRENT SITUATION
[This is the most important section. Adapt fully based on their relationship status: "${status}". Be very specific and relevant, not general. Address their specific love challenge: "${problem}"]

WHAT'S COMING NEXT
[Emotional shifts, opportunities in love, what they should watch for in the next 30-60 days. Keep it realistic, not fantasy predictions.]

GUIDANCE
[Give 3-5 clear, direct insights. What they should stop doing. What they should start doing. Make it actionable and grounded.]

CLOSING MESSAGE
[End with calm confidence, sense of control over their future, emotional clarity.]

STRICT RULES:
- Do NOT use generic astrology cliches
- Do NOT repeat the same ideas
- Do NOT sound robotic
- Every sentence must feel purposeful
- Write in flowing paragraphs, not bullet points (except in the Guidance section where a short list is fine)
- Minimum 150 words per section`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model:      'claude-opus-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  if (!data.content || !data.content[0]) throw new Error('Claude API returned no content')

  // Clean up special characters
  return data.content[0].text
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2026/g, '...')
}

// ── Parse Claude output into sections ───────────────────
function parseSections(text) {
  const sectionNames = [
    'OPENING',
    'YOUR EMOTIONAL NATURE',
    'YOUR LOVE PATTERN',
    'YOUR CURRENT SITUATION',
    "WHAT'S COMING NEXT",
    'GUIDANCE',
    'CLOSING MESSAGE'
  ]

  const sections = {}
  for (let i = 0; i < sectionNames.length; i++) {
    const current = sectionNames[i]
    const next    = sectionNames[i + 1]
    const regex   = next
      ? new RegExp(`${current}\\s*\\n([\\s\\S]*?)(?=${next})`, 'i')
      : new RegExp(`${current}\\s*\\n([\\s\\S]*)`, 'i')
    const match = text.match(regex)
    sections[current] = match ? match[1].trim() : ''
  }
  return sections
}

// ── Generate PDF using PDFKit ────────────────────────────
async function generatePDF({ name, birthDate, status, sections, outputPath }) {
  const PDFDocument = require('pdfkit')
  const fs          = require('fs')

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size:    'A4',
      margins: { top: 60, bottom: 60, left: 70, right: 70 },
      info: {
        Title:   `${name} - Scorpio Love Reading`,
        Author:  'Astranoxis',
        Subject: 'Personal Astrology Reading'
      }
    })

    const stream = fs.createWriteStream(outputPath)
    doc.pipe(stream)

    // Colors
    const bg       = '#0e0c17'
    const lavender = '#a897c8'
    const ivory    = '#e8e0f5'
    const muted    = '#9d94b4'
    const dimmed   = '#6b5f8a'

    const dob = new Date(birthDate)
    const formattedDate = dob.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const firstName = name.split(' ')[0]
    const pageW = doc.page.width
    const pageH = doc.page.height
    const marginL = 70

    // ── COVER PAGE ──────────────────────────────────────
    // Background
    doc.rect(0, 0, pageW, pageH).fill(bg)

    // Scorpio symbol
    doc.fontSize(72).fillColor(lavender).font('Helvetica')
       .text('M', 0, pageH * 0.28, { align: 'center', width: pageW })

    // Divider line top
    const lineY = pageH * 0.52
    doc.moveTo(marginL + 80, lineY).lineTo(pageW - marginL - 80, lineY)
       .strokeColor(dimmed).lineWidth(0.5).stroke()

    // Title
    doc.fontSize(28).fillColor(ivory).font('Helvetica-Bold')
       .text(firstName, 0, lineY + 20, { align: 'center', width: pageW })

    doc.fontSize(14).fillColor(muted).font('Helvetica-Oblique')
       .text('Your Scorpio Love Reading', 0, lineY + 60, { align: 'center', width: pageW })

    // Divider line bottom
    const line2Y = lineY + 96
    doc.moveTo(marginL + 80, line2Y).lineTo(pageW - marginL - 80, line2Y)
       .strokeColor(dimmed).lineWidth(0.5).stroke()

    // Meta info
    doc.fontSize(8).fillColor(dimmed).font('Helvetica')
       .text(`BIRTH DATE: ${formattedDate.toUpperCase()}`, 0, line2Y + 24, { align: 'center', width: pageW })
       .text(`RELATIONSHIP: ${status.toUpperCase()}`, 0, line2Y + 40, { align: 'center', width: pageW })
       .text(`PREPARED: ${generatedDate.toUpperCase()}`, 0, line2Y + 56, { align: 'center', width: pageW })

    // Footer
    doc.fontSize(7).fillColor('#2e2a42').font('Helvetica')
       .text('ASTRANOXIS.COM  |  PERSONAL & CONFIDENTIAL', 0, pageH - 50, { align: 'center', width: pageW })

    // ── CONTENT PAGES ───────────────────────────────────
    const sectionTitles = {
      'OPENING':               'Opening',
      'YOUR EMOTIONAL NATURE': 'Your Emotional Nature',
      'YOUR LOVE PATTERN':     'Your Love Pattern',
      'YOUR CURRENT SITUATION':'Your Current Situation',
      "WHAT'S COMING NEXT":    "What's Coming Next",
      'GUIDANCE':              'Guidance',
      'CLOSING MESSAGE':       'Closing Message'
    }

    const sectionKeys = Object.keys(sectionTitles)

    for (let i = 0; i < sectionKeys.length; i++) {
      const key     = sectionKeys[i]
      const title   = sectionTitles[key]
      const content = sections[key] || ''

      doc.addPage()
      doc.rect(0, 0, pageW, pageH).fill(bg)

      // Section label
      doc.fontSize(7).fillColor(dimmed).font('Helvetica')
         .text(title.toUpperCase(), marginL, 70, { characterSpacing: 2 })

      // Divider
      doc.moveTo(marginL, 88).lineTo(pageW - marginL, 88)
         .strokeColor(dimmed).lineWidth(0.4).stroke()

      // Content
      const isOpening = key === 'OPENING'
      const paragraphs = content.split('\n').filter(p => p.trim())

      let y = 108
      for (const para of paragraphs) {
        const fontSize  = isOpening ? 13 : 11.5
        const lineColor = isOpening ? ivory : muted
        const fontName  = isOpening ? 'Helvetica-Oblique' : 'Helvetica'

        doc.fontSize(fontSize).fillColor(lineColor).font(fontName)

        const textHeight = doc.heightOfString(para.trim(), {
          width: pageW - marginL * 2,
          lineGap: 4
        })

        if (y + textHeight > pageH - 80) {
          doc.addPage()
          doc.rect(0, 0, pageW, pageH).fill(bg)
          doc.fontSize(7).fillColor(dimmed).font('Helvetica')
             .text(title.toUpperCase(), marginL, 70, { characterSpacing: 2 })
          doc.moveTo(marginL, 88).lineTo(pageW - marginL, 88)
             .strokeColor(dimmed).lineWidth(0.4).stroke()
          y = 108
        }

        doc.fontSize(fontSize).fillColor(lineColor).font(fontName)
           .text(para.trim(), marginL, y, {
             width:   pageW - marginL * 2,
             lineGap: 4,
             align:   'left'
           })

        y += textHeight + 14
      }

      // Footer on each page
      doc.fontSize(6.5).fillColor('#2e2a42').font('Helvetica')
         .text('ASTRANOXIS.COM  |  PERSONAL & CONFIDENTIAL', 0, pageH - 40, { align: 'center', width: pageW })
    }

    doc.end()
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}

// ── Main export ──────────────────────────────────────────
async function generateLoveReadingPDF({ name, birthDate, status, problem, outputPath }) {
  console.log(`[PDF] Generating reading for ${name}...`)

  const rawText  = await generateReadingContent({ name, birthDate, status, problem })
  const sections = parseSections(rawText)

  await generatePDF({ name, birthDate, status, sections, outputPath })

  console.log(`[PDF] Reading saved to ${outputPath}`)
  return outputPath
}

module.exports = { generateLoveReadingPDF }