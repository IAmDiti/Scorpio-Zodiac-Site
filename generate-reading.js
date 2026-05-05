// generate-reading.js
// Generates a styled PDF love reading using Claude API + PDFKit

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

OUTPUT FORMAT — write each section with its heading followed by the content. Use these exact section headings on their own line with no formatting:

OPENING
[Start with a strong emotional sentence using their name. Make the reader feel immediately understood.]

YOUR EMOTIONAL NATURE
[Explain how they process emotions, why they feel deeper than others, their hidden intensity.]

YOUR LOVE PATTERN
[Explain how they behave in love, what they truly seek, why their relationships are intense or complicated.]

YOUR CURRENT SITUATION
[Most important section. Adapt fully based on relationship status: "${status}". Address their challenge: "${problem}"]

WHATS COMING NEXT
[Emotional shifts, opportunities in love, what to watch for in 30-60 days. Realistic, not fantasy.]

GUIDANCE
[3-5 clear direct insights. What to stop doing. What to start doing. Actionable and grounded.]

CLOSING MESSAGE
[Calm confidence, sense of control, emotional clarity.]

STRICT RULES:
- Do NOT use markdown formatting (no **, no #, no ---, no bullet points with *)
- Do NOT use dashes as dividers
- Write in plain flowing paragraphs only
- Guidance section: use numbered points like "1." "2." etc
- Do NOT repeat ideas across sections
- Minimum 150 words per section
- Every sentence must feel purposeful`

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

  return data.content[0].text
    .replace(/\*\*/g, '')
    .replace(/##/g, '')
    .replace(/---/g, '')
    .replace(/\*/g, '')
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
    'WHATS COMING NEXT',
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
      margins: { top: 60, bottom: 60, left: 72, right: 72 },
      info: {
        Title:   `${name} - Scorpio Love Reading`,
        Author:  'Astranoxis',
        Subject: 'Personal Astrology Reading'
      }
    })

    const stream = fs.createWriteStream(outputPath)
    doc.pipe(stream)

    // ── Colors ──
    const C = {
      bg:      '#0e0c17',
      lav:     '#a897c8',
      lavDark: '#7d5cb0',
      ivory:   '#e8e0f5',
      muted:   '#c0b8d4',
      dimmed:  '#6b5f8a',
      vdimmed: '#3a3450',
      accent:  '#1e1b2e',
    }

    const pageW   = doc.page.width
    const pageH   = doc.page.height
    const marginL = 72
    const marginR = 72
    const textW   = pageW - marginL - marginR

    const dob = new Date(birthDate)
    const formattedDate = dob.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const firstName = name.split(' ')[0]

    // ── Helper: draw page background ──
    function drawBg() {
      doc.rect(0, 0, pageW, pageH).fill(C.bg)
    }

    // ── Helper: draw footer ──
    function drawFooter(label) {
      doc.fontSize(6).fillColor(C.vdimmed).font('Helvetica')
         .text(
           `ASTRANOXIS.COM   |   ${label ? label.toUpperCase() + '   |   ' : ''}PERSONAL & CONFIDENTIAL`,
           0, pageH - 36, { align: 'center', width: pageW, characterSpacing: 1 }
         )
    }

    // ── Helper: draw decorative line ──
    function drawLine(y, opacity = 0.4) {
      doc.save()
         .moveTo(marginL, y).lineTo(pageW - marginR, y)
         .strokeColor(C.dimmed).lineWidth(0.5).stroke()
         .restore()
    }

    // ── Helper: draw section header ──
    function drawSectionHeader(title, y) {
      doc.fontSize(7).fillColor(C.dimmed).font('Helvetica')
         .text(title.toUpperCase(), marginL, y, { characterSpacing: 2.5, width: textW })
      drawLine(y + 16)
      return y + 28
    }

    // ── Helper: write paragraphs, paginate automatically ──
    function writeParagraphs(paragraphs, startY, sectionTitle, isItalic = false) {
      let y = startY
      const font     = isItalic ? 'Helvetica-Oblique' : 'Helvetica'
      const fontSize = isItalic ? 12.5 : 11
      const color    = isItalic ? C.ivory : C.muted
      const lineGap  = 5

      for (const para of paragraphs) {
        if (!para.trim()) continue

        doc.fontSize(fontSize).font(font)
        const h = doc.heightOfString(para.trim(), { width: textW, lineGap })

        if (y + h > pageH - 70) {
          drawFooter(sectionTitle)
          doc.addPage()
          drawBg()
          y = drawSectionHeader(sectionTitle, 60)
        }

        doc.fillColor(color).fontSize(fontSize).font(font)
           .text(para.trim(), marginL, y, { width: textW, lineGap, align: 'left' })

        y += h + 16
      }

      return y
    }

    // ════════════════════════════════════════════════════
    // COVER PAGE
    // ════════════════════════════════════════════════════
    drawBg()

    // Outer decorative ring
    doc.save()
       .circle(pageW / 2, pageH * 0.38, 110)
       .strokeColor(C.dimmed).lineWidth(0.5).stroke()
       .restore()

    doc.save()
       .circle(pageW / 2, pageH * 0.38, 130)
       .strokeColor(C.vdimmed).lineWidth(0.3).stroke()
       .restore()

    // Scorpio glyph — drawn as lines since pdfkit can't embed emoji
    // Draw stylized "M" with scorpio tail using paths
    const cx = pageW / 2
    const cy = pageH * 0.38
    const glyphSize = 52

    // Draw the scorpio symbol as text using a larger latin M with tail suggestion
    // Use a Unicode-safe approach: draw filled circle with symbol overlay
    doc.save()
       .circle(cx, cy, 58).fill(C.accent)
       .restore()
    doc.save()
       .circle(cx, cy, 58).strokeColor(C.lavDark).lineWidth(1).stroke()
       .restore()

    // Draw "M" centered in circle
    doc.fontSize(glyphSize).fillColor(C.lav).font('Helvetica-Bold')
    const mW = doc.widthOfString('M')
    doc.text('M', cx - mW / 2, cy - glyphSize * 0.42)

    // Draw scorpio tail below M
    doc.save()
       .moveTo(cx + mW / 2 - 2, cy + 4)
       .lineTo(cx + mW / 2 + 14, cy + 4)
       .lineTo(cx + mW / 2 + 14, cy + 18)
       .lineTo(cx + mW / 2 + 22, cy + 10)
       .strokeColor(C.lav).lineWidth(2.5).lineJoin('round').stroke()
       .restore()

    // Scorpio label
    doc.fontSize(7).fillColor(C.dimmed).font('Helvetica')
       .text('SCORPIO   |   PERSONAL LOVE READING', 0, pageH * 0.38 + 78, {
         align: 'center', width: pageW, characterSpacing: 2
       })

    // Thin divider
    const divY = pageH * 0.38 + 108
    doc.moveTo(marginL + 60, divY).lineTo(pageW - marginR - 60, divY)
       .strokeColor(C.vdimmed).lineWidth(0.5).stroke()

    // Name
    doc.fontSize(30).fillColor(C.ivory).font('Helvetica-Bold')
       .text(firstName, 0, divY + 20, { align: 'center', width: pageW })

    // Subtitle
    doc.fontSize(12).fillColor(C.muted).font('Helvetica-Oblique')
       .text('Your Scorpio Love Reading', 0, divY + 60, { align: 'center', width: pageW })

    // Second divider
    const div2Y = divY + 96
    doc.moveTo(marginL + 60, div2Y).lineTo(pageW - marginR - 60, div2Y)
       .strokeColor(C.vdimmed).lineWidth(0.5).stroke()

    // Meta info
    doc.fontSize(7.5).fillColor(C.dimmed).font('Helvetica')
    const metaX = pageW / 2 - 100
    const metaW = 200
    doc.text(`Birth Date`, metaX, div2Y + 22, { width: metaW, align: 'left' })
    doc.fillColor(C.muted).text(formattedDate, metaX + 70, div2Y + 22, { width: metaW, align: 'left' })
    doc.fillColor(C.dimmed).text(`Relationship`, metaX, div2Y + 38, { width: metaW, align: 'left' })
    doc.fillColor(C.muted).text(status, metaX + 70, div2Y + 38, { width: metaW, align: 'left' })
    doc.fillColor(C.dimmed).text(`Prepared`, metaX, div2Y + 54, { width: metaW, align: 'left' })
    doc.fillColor(C.muted).text(generatedDate, metaX + 70, div2Y + 54, { width: metaW, align: 'left' })

    drawFooter()

    // ════════════════════════════════════════════════════
    // CONTENT SECTIONS
    // ════════════════════════════════════════════════════
    const sectionDefs = [
      { key: 'OPENING',               title: 'Opening',             italic: true  },
      { key: 'YOUR EMOTIONAL NATURE', title: 'Your Emotional Nature', italic: false },
      { key: 'YOUR LOVE PATTERN',     title: 'Your Love Pattern',   italic: false },
      { key: 'YOUR CURRENT SITUATION',title: 'Your Current Situation', italic: false },
      { key: 'WHATS COMING NEXT',     title: "What's Coming Next",  italic: false },
      { key: 'GUIDANCE',              title: 'Guidance',            italic: false },
      { key: 'CLOSING MESSAGE',       title: 'Closing Message',     italic: true  },
    ]

    for (const { key, title, italic } of sectionDefs) {
      const content = sections[key] || ''
      const paragraphs = content.split('\n').filter(p => p.trim())

      doc.addPage()
      drawBg()

      // Accent bar on left
      doc.rect(0, 0, 4, pageH).fill(C.lavDark)

      let y = drawSectionHeader(title, 60)
      writeParagraphs(paragraphs, y, title, italic)
      drawFooter(title)
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