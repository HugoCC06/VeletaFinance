import { expect, test } from '@playwright/test'
import { completeOnboarding, playLesson, signUp } from './helpers'

test('Journey A: a new learner signs up, completes onboarding and their first lesson', async ({ page }) => {
  // 1–2. Public landing page and curriculum
  await page.goto('./')
  await expect(page.getByRole('heading', { name: /Learn to invest/ })).toBeVisible()
  await expect(page.getByText('Demo mode:')).toBeVisible()
  await page.getByRole('link', { name: 'Explore the curriculum' }).first().click()
  await expect(page.getByRole('heading', { name: 'Everything you can learn on Veleta' })).toBeVisible()
  await expect(page.locator('.curriculum-course')).toHaveCount(8)

  // 3–4. Create an account and onboard
  await signUp(page)
  await completeOnboarding(page)

  // 5. Start the first lesson from the path
  await page.getByRole('button', { name: /Lesson: What is investing\? — up next/ }).click()
  await page.getByRole('link', { name: 'Start lesson' }).click()
  await expect(page.getByText('Investing Fundamentals · Why invest?')).toBeVisible()

  // 6–7. Answer questions (one deliberately wrong first) and complete the lesson
  await playLesson(page, { wrongFirst: ['c1-u1-l1.q1'] })
  await expect(page.getByText('You’ll see this question again', { exact: false })).toHaveCount(0)

  // 8. Correct XP: 20 for first completion, no perfect bonus because of the miss
  const reward = page.locator('.reward')
  await expect(reward.getByText('+20 XP')).toBeVisible()
  await expect(reward.getByText('Lesson: What is investing?')).toBeVisible()
  await expect(reward.getByText('Perfect first attempt')).toHaveCount(0)
  await expect(page.getByText('Achievement unlocked: First Lesson')).toBeVisible()
  await expect(page.getByText(/Daily goal met — your streak is 1 day/)).toBeVisible()

  // 9. Dashboard reflects progress
  await page.getByRole('link', { name: 'Back to path' }).click()
  await page.goto('#/app')
  await expect(page.getByText('Saving versus investing')).toBeVisible()
  await expect(page.getByText(/1\/1/).first()).toBeVisible()
  await expect(page.locator('.top-stat--xp')).toContainText('20')
  await expect(page.locator('.top-stat--streak')).toContainText('1')
})
