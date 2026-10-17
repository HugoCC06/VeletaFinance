/**
 * Renders public/og-image.png (1200×630) and public/apple-touch-icon.png
 * (180×180) from the brand SVGs. Run manually after brand changes:
 *   PLAYWRIGHT_CHROMIUM_PATH=... npx tsx scripts/render-social-images.ts
 */
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const logo = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined })
const page = await browser.newPage()

await page.setViewportSize({ width: 180, height: 180 })
await page.setContent(`<body style="margin:0">${logo.replace('<svg ', '<svg width="180" height="180" ')}</body>`)
await page.screenshot({ path: 'public/apple-touch-icon.png', omitBackground: true })

await page.setViewportSize({ width: 1200, height: 630 })
await page.setContent(`<body style="margin:0;width:1200px;height:630px;font-family:system-ui,sans-serif;background:linear-gradient(135deg,#6B4EFF,#4226C4);color:#fff;display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box">
  <div style="background:#fff;border-radius:44px;padding:20px;box-shadow:0 20px 50px rgba(0,0,0,.25)">${logo.replace('<svg ', '<svg width="220" height="220" ')}</div>
  <div><div style="font-size:84px;font-weight:800;letter-spacing:-2px;line-height:1">Veleta Finance</div>
  <div style="font-size:42px;margin-top:18px;font-weight:700;color:#FFC83D">Learn to invest. One lesson at a time.</div>
  <div style="font-size:28px;margin-top:22px;opacity:.9">Free interactive lessons · XP, streaks &amp; certificates</div></div></body>`)
await page.screenshot({ path: 'public/og-image.png' })
await browser.close()
console.log('Rendered public/og-image.png and public/apple-touch-icon.png')
