import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { completeOnboarding, signUp } from './helpers'

const PUBLIC = ['/', '/curriculum', '/curriculum/investing-fundamentals', '/tools', '/tools/compound-interest', '/tools/portfolio', '/charts', '/charts/case/tesco', '/verify', '/signin', '/signup', '/disclaimer', '/try/c1-u1-l1']

for (const route of PUBLIC) {
  test(`no serious accessibility violations: ${route}`, async ({ page }) => {
    await page.goto(`#${route}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
  })
}

test('no serious accessibility violations in learner pages', async ({ page }) => {
  await signUp(page)
  await completeOnboarding(page)
  for (const route of ['/app', '/app/learn', '/app/learn/c1', '/app/practice', '/app/achievements', '/app/settings', '/app/profile', '/app/courses', '/app/lesson/c1-u1-l1']) {
    await page.goto(`#${route}`)
    await page.waitForTimeout(700)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${route} ${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
  }
})
