import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const url = process.argv[2] || 'http://localhost:3000/'
const out = process.argv[3] || 'shot.png'
const width = Number(process.argv[4] || 390)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width, height: 900, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle0' })

const metrics = await page.evaluate(() => {
  const de = document.documentElement
  const offenders = []
  const vw = de.clientWidth
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.right > vw + 1 || r.left < -1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 90),
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
      })
    }
  })
  return {
    viewport: vw,
    scrollWidth: de.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenders: offenders.slice(0, 25),
  }
})
console.log(JSON.stringify(metrics, null, 2))

await page.screenshot({ path: out, fullPage: true })
console.log('wrote', out)
await browser.close()
