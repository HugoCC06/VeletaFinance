import { expect, test } from '@playwright/test'
import { completeOnboarding, playLesson, signUp } from './helpers'

// Runs in the "mobile" project (Pixel 7) and checks for horizontal overflow and working mobile navigation.
test('mobile: no horizontal overflow and bottom navigation works', async ({ page }) => {
  for (const r of ['/', '/curriculum', '/tools/valuation', '/tools/portfolio', '/charts', '/signup']) {
    await page.goto(`#${r}`)
    await page.waitForTimeout(400)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), r).toBe(true)
  }
  await page.goto('#/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Curriculum' })).toBeVisible()

  await signUp(page)
  await completeOnboarding(page)
  await page.goto('#/app/lesson/c1-u1-l1')
  await playLesson(page)
  for (const r of ['/app', '/app/learn', '/app/learn/c1', '/app/practice', '/app/achievements', '/app/settings']) {
    await page.goto(`#${r}`)
    await page.waitForTimeout(400)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), r).toBe(true)
  }
  const nav = page.getByRole('navigation', { name: 'App navigation' }).last()
  await nav.getByRole('link', { name: 'Practice' }).click()
  await expect(page).toHaveURL(/#\/app\/practice/)
  await nav.getByRole('button', { name: 'More' }).click()
  await page.getByRole('dialog', { name: 'More navigation' }).getByRole('link', { name: 'Achievements' }).click()
  await expect(page.getByRole('heading', { name: 'Achievements' })).toBeVisible()
})
