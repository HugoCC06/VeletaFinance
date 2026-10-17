import { expect, test } from '@playwright/test'
import { answerVisibleQuestion, completeOnboarding, playLesson, signUp } from './helpers'

test('Journey B: revision updates mastery and replaying cannot farm XP', async ({ page }) => {
  await signUp(page)
  await completeOnboarding(page)
  await page.goto('#/app/lesson/c1-u1-l1')
  await playLesson(page, { wrongFirst: ['c1-u1-l1.q2', 'c1-u1-l1.q3'] })
  await expect(page.locator('.reward').getByText('+20 XP')).toBeVisible()

  // Practice shows the missed concept and due questions
  await page.goto('#/app/practice')
  await expect(page.getByRole('heading', { name: /questions? due/ })).toBeVisible()
  await expect(page.getByText('Concepts to strengthen')).toBeVisible()
  const masteryBefore = await page.locator('.mastery-row').first().locator('[role=progressbar]').getAttribute('aria-valuenow')

  // 1–3. Revisit the completed lesson: review content and answer the previously missed questions correctly
  await page.goto('#/app/lesson/c1-u1-l1')
  await expect(page.getByText('Review', { exact: true })).toBeVisible()
  await playLesson(page)
  // 5. No XP for the replay (only an incidental mission could award XP)
  const reward = page.locator('.reward')
  await expect(reward.getByText(/Lesson:/)).toHaveCount(0)
  await expect(reward.getByText(/No new XP this time|Mission complete/).first()).toBeVisible()

  // A revision session answering correctly
  await page.goto('#/app/practice/session')
  for (let i = 0; i < 8; i++) {
    if (await page.getByRole('heading', { name: 'Revision complete' }).isVisible()) break
    await answerVisibleQuestion(page, true)
    await page.getByRole('button', { name: 'Check', exact: true }).click()
    await page.locator('.feedback').getByRole('button', { name: 'Continue' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Revision complete' })).toBeVisible()
  await expect(page.locator('.reward__breakdown').getByText('Revision session', { exact: true })).toBeVisible()

  // 4. Mastery increased
  await page.goto('#/app/practice')
  const masteryAfter = await page.locator('.mastery-row').first().locator('[role=progressbar]').getAttribute('aria-valuenow')
  expect(Number(masteryAfter)).toBeGreaterThan(Number(masteryBefore))

  // XP never increases from replaying the same lesson again
  const xpBefore = Number((await page.locator('.top-stat--xp').textContent())!.replace(/\D/g, ''))
  await page.goto('#/app/lesson/c1-u1-l1')
  await playLesson(page)
  await expect(page.locator('.reward').getByText(/Lesson:/)).toHaveCount(0)
  await page.goto('#/app')
  const xpAfter = Number((await page.locator('.top-stat--xp').textContent())!.replace(/\D/g, ''))
  const missionXp = xpAfter - xpBefore
  expect(missionXp % 15 === 0 || missionXp % 50 === 0).toBe(true) // only mission XP can appear
})
