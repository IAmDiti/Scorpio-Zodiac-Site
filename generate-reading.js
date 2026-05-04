// generate-reading.js
// Generates a styled PDF love reading using Claude API + html-pdf-node

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
- Do NOT use generic astrology clichés
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
  // Clean up special characters that don't render well in PDF
  return data.content[0].text
    .replace(/\u2014/g, '-')   // em dash —
    .replace(/\u2013/g, '-')   // en dash –
    .replace(/\u2018/g, "'")   // left single quote
    .replace(/\u2019/g, "'")   // right single quote
    .replace(/\u201C/g, '"')   // left double quote
    .replace(/\u201D/g, '"')   // right double quote
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

// ── Build HTML for the PDF ───────────────────────────────
function buildHTML({ name, birthDate, status, sections }) {
  const dob = new Date(birthDate)
  const formattedDate = dob.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const firstName = name.split(' ')[0]

  function renderParagraphs(content) {
    return content.split('\n').filter(p => p.trim()).map(p =>
      `<p>${p.trim()}</p>`
    ).join('')
  }

  function section(title, content, accent = false) {
    return `
      <div class="section ${accent ? 'accent' : ''}">
        <div class="section-label">${title}</div>
        <div class="section-content">${renderParagraphs(content)}</div>
      </div>
    `
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0e0c17;
    color: #d8d0e8;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.85;
  }

  .page {
    width: 100%;
    padding: 60px 70px;
  }

  .cover {
    min-height: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-bottom: 1px solid #2e2a42;
    padding-bottom: 60px;
    margin-bottom: 60px;
    page-break-after: always;
  }

  .scorpio-symbol {
    font-size: 64pt;
    color: #a897c8;
    margin-bottom: 24px;
    line-height: 1;
  }

  .cover-label {
    font-family: 'Courier New', monospace;
    font-size: 7pt;
    letter-spacing: 0.3em;
    color: #6b6384;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .cover-title {
    font-size: 32pt;
    font-weight: bold;
    color: #e8e0f5;
    margin-bottom: 8px;
  }

  .cover-subtitle {
    font-size: 14pt;
    font-style: italic;
    color: #9d94b4;
    margin-bottom: 48px;
  }

  .cover-divider {
    width: 120px;
    height: 1px;
    background: #5c4a82;
    margin: 32px auto;
  }

  .cover-meta {
    font-family: 'Courier New', monospace;
    font-size: 7.5pt;
    letter-spacing: 0.2em;
    color: #4a4460;
    text-transform: uppercase;
    line-height: 2.4;
  }

  .cover-meta span { color: #7d6fa0; }

  .section {
    margin-bottom: 44px;
    padding-bottom: 44px;
    border-bottom: 1px solid #1e1b2e;
  }

  .section:last-child { border-bottom: none; }

  .section.accent {
    background: #13101f;
    border: 1px solid #2e2a42;
    border-radius: 8px;
    padding: 28px 32px;
    margin-bottom: 44px;
  }

  .section-label {
    font-family: 'Courier New', monospace;
    font-size: 7pt;
    letter-spacing: 0.35em;
    color: #6b5f8a;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .section-content p {
    margin-bottom: 12px;
    color: #c8c0d8;
    font-size: 11.5pt;
  }

  .section-content p:last-child { margin-bottom: 0; }

  .opening-text p {
    font-size: 13pt;
    font-style: italic;
    color: #d8d0e8;
    line-height: 2;
  }

  .footer {
    margin-top: 60px;
    padding-top: 24px;
    border-top: 1px solid #1e1b2e;
    text-align: center;
    font-family: 'Courier New', monospace;
    font-size: 6.5pt;
    letter-spacing: 0.25em;
    color: #2e2a42;
    text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="page">

  <div class="cover">
    <div class="scorpio-symbol">&#9890;</div>
    <div class="cover-label">Personal Love Reading</div>
    <div class="cover-title">${firstName}</div>
    <div class="cover-subtitle">Your Scorpio Love Reading</div>
    <div class="cover-divider"></div>
    <div class="cover-meta">
      Birth Date: <span>${formattedDate}</span><br>
      Relationship: <span>${status}</span><br>
      Prepared: <span>${generatedDate}</span><br><br>
      Scorpio Zodiac &middot; Astranoxis.com
    </div>
  </div>

  <div class="section">
    <div class="section-label">Opening</div>
    <div class="section-content opening-text">
      ${sections['OPENING'].split('\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('')}
    </div>
  </div>

  ${section('Your Emotional Nature', sections['YOUR EMOTIONAL NATURE'])}
  ${section('Your Love Pattern', sections['YOUR LOVE PATTERN'])}
  ${section('Your Current Situation', sections['YOUR CURRENT SITUATION'], true)}
  ${section("What's Coming Next", sections["WHAT'S COMING NEXT"])}
  ${section('Guidance', sections['GUIDANCE'])}
  ${section('Closing Message', sections['CLOSING MESSAGE'])}

  <div class="footer">
    Scorpio Zodiac &middot; Astranoxis.com &middot; Personal &amp; Confidential
  </div>

</div>
</body>
</html>`
}

// ── Generate PDF using html-pdf-node ────────────────────
async function generatePDF(html, outputPath) {
  const htmlPdf = require('html-pdf-node')
  const options = {
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
  }
  const pdfBuffer = await htmlPdf.generatePdf({ content: html }, options)
  require('fs').writeFileSync(outputPath, pdfBuffer)
}

// ── Main export ──────────────────────────────────────────
async function generateLoveReadingPDF({ name, birthDate, status, problem, outputPath }) {
  console.log(`[PDF] Generating reading for ${name}...`)
  const rawText  = await generateReadingContent({ name, birthDate, status, problem })
  const sections = parseSections(rawText)
  const html     = buildHTML({ name, birthDate, status, sections })
  await generatePDF(html, outputPath)
  console.log(`[PDF] Reading saved to ${outputPath}`)
  return outputPath
}

module.exports = { generateLoveReadingPDF }