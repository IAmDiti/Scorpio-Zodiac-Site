// generate-reading.js
// Premium light-design PDF love reading — Claude API + PDFKit

// ── Call Claude API ──────────────────────────────────────
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

OUTPUT FORMAT — write each section with its heading on its own line, followed by content. Use these exact headings:

OPENING
YOUR EMOTIONAL NATURE
YOUR LOVE PATTERN
YOUR CURRENT SITUATION
WHATS COMING NEXT
GUIDANCE
CLOSING MESSAGE

STRICT RULES:
- No markdown (no **, no #, no ---, no *)
- No dashes as dividers
- Plain flowing paragraphs only
- Guidance section: numbered points like "1." "2." etc
- Minimum 150 words per section
- Address user by name naturally throughout`

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
    .replace(/\*\*/g, '').replace(/##/g, '').replace(/---/g, '').replace(/\*/g, '')
    .replace(/\u2014/g, '-').replace(/\u2013/g, '-')
    .replace(/\u2018/g, "'").replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"').replace(/\u201D/g, '"')
    .replace(/\u2026/g, '...')
}

// ── Parse sections ───────────────────────────────────────
function parseSections(text) {
  const keys = [
    'OPENING', 'YOUR EMOTIONAL NATURE', 'YOUR LOVE PATTERN',
    'YOUR CURRENT SITUATION', 'WHATS COMING NEXT', 'GUIDANCE', 'CLOSING MESSAGE'
  ]
  const sections = {}
  for (let i = 0; i < keys.length; i++) {
    const cur  = keys[i]
    const next = keys[i + 1]
    const rx   = next
      ? new RegExp(`${cur}\\s*\\n([\\s\\S]*?)(?=${next})`, 'i')
      : new RegExp(`${cur}\\s*\\n([\\s\\S]*)`, 'i')
    const m = text.match(rx)
    sections[cur] = m ? m[1].trim() : ''
  }
  return sections
}

// ── Generate PDF ─────────────────────────────────────────
async function generatePDF({ name, birthDate, status, sections, outputPath }) {
  const PDFDocument = require('pdfkit')
  const fs          = require('fs')

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      autoFirstPage: false,
      info: {
        Title:  `${name} - Scorpio Love Reading`,
        Author: 'Astranoxis'
      }
    })

    const stream = fs.createWriteStream(outputPath)
    doc.pipe(stream)

    // ── Design tokens ──
    const C = {
      cream:    '#faf7f2',   // page background
      parchment:'#f0ebe0',   // accent areas
      border:   '#d4c9b8',   // lines
      purple:   '#4a2d6b',   // headings, accents
      purpleMid:'#7d5cb0',   // secondary purple
      purpleLight:'#b09fd0', // light purple
      text:     '#2a2035',   // body text
      textMid:  '#4a3f5c',   // secondary text
      textLight:'#8a7fa0',   // labels, meta
      gold:     '#c9a84c',   // gold accent
      goldLight:'#e8d5a0',   // light gold
    }

    const pageW = 595.28
    const pageH = 841.89
    const mL    = 64
    const mR    = 64
    const mT    = 56
    const mB    = 64
    const textW = pageW - mL - mR

    const dob = new Date(birthDate)
    const formattedDate = dob.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const firstName = name.split(' ')[0]

    // ── Helpers ──
    function pageBg() {
      doc.rect(0, 0, pageW, pageH).fill(C.cream)
    }

    function topBar() {
      // Thin gold top border
      doc.rect(0, 0, pageW, 3).fill(C.gold)
      // Purple bar
      doc.rect(0, 3, pageW, 18).fill(C.purple)
      // Header text
      doc.fontSize(6).fillColor(C.goldLight).font('Helvetica')
         .text('ASTRANOXIS  |  PERSONAL LOVE READING', 0, 9, { align: 'center', width: pageW, characterSpacing: 2 })
    }

    function bottomBar(label) {
      doc.rect(0, pageH - 22, pageW, 22).fill(C.purple)
      doc.rect(0, pageH - 25, pageW, 3).fill(C.gold)
      const txt = label
        ? `${label.toUpperCase()}  |  ASTRANOXIS.COM  |  CONFIDENTIAL`
        : 'ASTRANOXIS.COM  |  PERSONAL & CONFIDENTIAL'
      doc.fontSize(6).fillColor(C.goldLight).font('Helvetica')
         .text(txt, 0, pageH - 15, { align: 'center', width: pageW, characterSpacing: 1.5 })
    }

    function ornament(x, y, size = 8) {
      // Small diamond ornament
      doc.save()
         .moveTo(x, y - size / 2)
         .lineTo(x + size / 2, y)
         .lineTo(x, y + size / 2)
         .lineTo(x - size / 2, y)
         .closePath()
         .fill(C.gold)
         .restore()
    }

    function hline(y, color = C.border, width = 0.5) {
      doc.moveTo(mL, y).lineTo(pageW - mR, y)
         .strokeColor(color).lineWidth(width).stroke()
    }

    function doubleLine(y) {
      hline(y, C.gold, 0.8)
      hline(y + 4, C.border, 0.3)
    }

    // ════════════════════════════════════════════════
    // COVER PAGE
    // ════════════════════════════════════════════════
    doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
    pageBg()

    // Top decorative band
    doc.rect(0, 0, pageW, 3).fill(C.gold)
    doc.rect(0, 3, pageW, 80).fill(C.purple)
    doc.rect(0, 83, pageW, 3).fill(C.gold)

    // Header text in band
    doc.fontSize(7).fillColor(C.goldLight).font('Helvetica')
       .text('A S T R A N O X I S', 0, 22, { align: 'center', width: pageW, characterSpacing: 6 })
    doc.fontSize(6).fillColor(C.purpleLight).font('Helvetica')
       .text('FOR SCORPIOS  |  BY THE STARS', 0, 42, { align: 'center', width: pageW, characterSpacing: 3 })

    // Center decorative box
    const boxX = mL + 20
    const boxY = 110
    const boxW = textW - 40
    const boxH = 460

    // Outer border
    doc.rect(boxX, boxY, boxW, boxH).stroke(C.border).lineWidth(0.5)
    // Inner border
    doc.rect(boxX + 6, boxY + 6, boxW - 12, boxH - 12).stroke(C.goldLight).lineWidth(0.3)

    // Corner ornaments
    ornament(boxX, boxY, 10)
    ornament(boxX + boxW, boxY, 10)
    ornament(boxX, boxY + boxH, 10)
    ornament(boxX + boxW, boxY + boxH, 10)

    // Scorpio symbol — large, centered
    doc.fontSize(80).fillColor(C.purple).font('Helvetica-Bold')
    const mW = doc.widthOfString('M')
    doc.text('M', pageW / 2 - mW / 2, boxY + 52)

    // Scorpio tail
    const tailX = pageW / 2 + mW / 2 - 2
    const tailY = boxY + 122
    doc.save()
       .moveTo(tailX, tailY)
       .lineTo(tailX + 20, tailY)
       .lineTo(tailX + 20, tailY + 16)
       .lineTo(tailX + 30, tailY + 6)
       .strokeColor(C.purple).lineWidth(3).lineJoin('round').stroke()
       .restore()

    // Thin line under symbol
    doc.moveTo(pageW / 2 - 60, boxY + 164).lineTo(pageW / 2 + 60, boxY + 164)
       .strokeColor(C.gold).lineWidth(0.8).stroke()

    // "Personal Love Reading" label
    doc.fontSize(7).fillColor(C.gold).font('Helvetica')
       .text('PERSONAL LOVE READING', 0, boxY + 174, { align: 'center', width: pageW, characterSpacing: 3 })

    // Name
    doc.fontSize(36).fillColor(C.purple).font('Helvetica-Bold')
       .text(firstName, 0, boxY + 200, { align: 'center', width: pageW })

    // Subtitle
    doc.fontSize(12).fillColor(C.textMid).font('Helvetica-Oblique')
       .text('Your Scorpio Love Reading', 0, boxY + 248, { align: 'center', width: pageW })

    // Ornament row
    const ornY = boxY + 284
    for (let i = 0; i < 5; i++) {
      ornament(pageW / 2 - 32 + i * 16, ornY, 5)
    }

    // Meta info box
    const metaBoxY = boxY + 300
    doc.rect(boxX + 40, metaBoxY, boxW - 80, 100).fill(C.parchment)
    doc.rect(boxX + 40, metaBoxY, boxW - 80, 100).stroke(C.border).lineWidth(0.3)

    const metaData = [
      ['BIRTH DATE', formattedDate],
      ['RELATIONSHIP', status],
      ['PREPARED ON', generatedDate],
    ]
    metaData.forEach(([label, value], i) => {
      const ry = metaBoxY + 18 + i * 26
      doc.fontSize(6.5).fillColor(C.textLight).font('Helvetica')
         .text(label, boxX + 55, ry, { width: 80 })
      doc.fontSize(9).fillColor(C.text).font('Helvetica')
         .text(value, boxX + 55, ry + 9, { width: boxW - 120 })
    })

    // Bottom of box — tagline
    doc.fontSize(8).fillColor(C.textLight).font('Helvetica-Oblique')
       .text('Prepared exclusively for you', 0, boxY + 420, { align: 'center', width: pageW })

    // Bottom band
    doc.rect(0, pageH - 3, pageW, 3).fill(C.gold)
    doc.rect(0, pageH - 24, pageW, 21).fill(C.purple)
    doc.fontSize(6).fillColor(C.goldLight).font('Helvetica')
       .text('ASTRANOXIS.COM  |  PERSONAL & CONFIDENTIAL', 0, pageH - 15, { align: 'center', width: pageW, characterSpacing: 1.5 })

    // ════════════════════════════════════════════════
    // CONTENT PAGES
    // ════════════════════════════════════════════════
    const sectionDefs = [
      { key: 'OPENING',                title: 'Opening',                italic: true  },
      { key: 'YOUR EMOTIONAL NATURE',  title: 'Your Emotional Nature',  italic: false },
      { key: 'YOUR LOVE PATTERN',      title: 'Your Love Pattern',      italic: false },
      { key: 'YOUR CURRENT SITUATION', title: 'Your Current Situation', italic: false },
      { key: 'WHATS COMING NEXT',      title: "What's Coming Next",     italic: false },
      { key: 'GUIDANCE',               title: 'Guidance',               italic: false },
      { key: 'CLOSING MESSAGE',        title: 'Closing Message',        italic: true  },
    ]

    for (const { key, title, italic } of sectionDefs) {
      const content    = sections[key] || ''
      const paragraphs = content.split('\n').filter(p => p.trim())
      const fontSize   = italic ? 12 : 11
      const fontName   = italic ? 'Helvetica-Oblique' : 'Helvetica'
      const fontColor  = italic ? C.textMid : C.text
      const lineGap    = 6
      const paraGap    = 16

      // New page
      doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
      pageBg()
      topBar()
      bottomBar(title)

      // Section title area
      doc.rect(0, 21, pageW, 52).fill(C.parchment)
      hline(21, C.border, 0.3)
      hline(73, C.border, 0.3)

      // Section number ornament
      ornament(mL, 47, 7)

      // Section title
      doc.fontSize(16).fillColor(C.purple).font('Helvetica-Bold')
         .text(title, mL + 16, 34, { width: textW - 16 })

      // Gold underline for title
      const titleW = doc.widthOfString(title) * (16 / 12)
      doc.moveTo(mL + 16, 56).lineTo(mL + 16 + Math.min(titleW, 200), 56)
         .strokeColor(C.gold).lineWidth(1).stroke()

      let y = mT + 40

      for (const para of paragraphs) {
        if (!para.trim()) continue

        doc.fontSize(fontSize).font(fontName)
        const h = doc.heightOfString(para.trim(), { width: textW, lineGap })

        if (y + h > pageH - mB - 28) {
          bottomBar(title)
          doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } })
          pageBg()
          topBar()
          bottomBar(title)

          // Continuation header
          doc.rect(0, 21, pageW, 52).fill(C.parchment)
          hline(21, C.border, 0.3)
          hline(73, C.border, 0.3)
          ornament(mL, 47, 7)
          doc.fontSize(16).fillColor(C.purple).font('Helvetica-Bold')
             .text(title, mL + 16, 34, { width: textW - 16 })
          const tw2 = doc.widthOfString(title) * (16 / 12)
          doc.moveTo(mL + 16, 56).lineTo(mL + 16 + Math.min(tw2, 200), 56)
             .strokeColor(C.gold).lineWidth(1).stroke()

          y = mT + 40
        }

        doc.fillColor(fontColor).fontSize(fontSize).font(fontName)
           .text(para.trim(), mL, y, { width: textW, lineGap, align: 'justify' })

        y += h + paraGap
      }
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