import { chromium } from '@playwright/test'
import { signUp, completeOnboarding, playLesson } from './e2e/helpers.ts'
const base = 'http://localhost:5173/VeletaFinance/'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
for (const [w, h] of [[1280, 900], [390, 844]]) {
  const ctx = await browser.newContext({ baseURL: base, viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const errs: string[] = []
  page.on('pageerror', (e) => errs.push(e.message))
  await signUp(page)
  if (w === 390) await page.screenshot({ path: `/tmp/claude-0/shots/onboarding_${w}.png` })
  await completeOnboarding(page)
  await page.goto(base + '#/app/lesson/c1-u1-l1')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `/tmp/claude-0/shots/lesson_intro_${w}.png` })
  await playLesson(page, { wrongFirst: ['c1-u1-l1.q1'] })
  await page.screenshot({ path: `/tmp/claude-0/shots/lesson_done_${w}.png`, fullPage: true })
  for (const r of ['/app', '/app/learn/c1', '/app/practice', '/app/achievements', '/app/settings', '/app/profile', '/app/courses']) {
    await page.goto(base + '#' + r)
    await page.waitForTimeout(600)
    const of = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    if (of) console.log('OVERFLOW', w, r)
    await page.screenshot({ path: `/tmp/claude-0/shots/${r.replace(/\W+/g, '_')}_${w}.png`, fullPage: true })
  }
  console.log(w, 'errors', errs)
  await ctx.close()
}
await browser.close()
