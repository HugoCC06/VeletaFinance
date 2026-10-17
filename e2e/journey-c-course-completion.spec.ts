import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { COURSES } from '../src/content/index.ts'
import { completeOnboarding, playAssessment, playLesson, signUp } from './helpers'

test('Journey C: complete a course, fail and retake the exam, earn and verify a certificate', async ({ page }) => {
  test.setTimeout(900_000)
  const course = COURSES[0]
  await signUp(page, 'Grace Hopper')
  await completeOnboarding(page)

  // Exam is locked at the start
  await page.goto(`#/app/assessment/${course.exam.id}`)
  await expect(page.getByRole('heading', { name: 'Final exam locked' })).toBeVisible()

  for (const unit of course.units) {
    // 1. Complete the required lessons
    for (const lesson of unit.lessons) {
      await page.goto(`#/app/lesson/${lesson.id}`)
      await playLesson(page)
    }
    // 2. Pass the unit checkpoint
    await page.goto(`#/app/assessment/${unit.checkpoint.id}`)
    await playAssessment(page)
    await expect(page.getByRole('heading', { name: 'Passed!' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Answer review' })).toBeVisible()
  }

  // 3–4. Take the final exam and fail it (4 wrong out of 15 = 73% < 80%)
  await page.goto(`#/app/assessment/${course.exam.id}`)
  await playAssessment(page, 4)
  await expect(page.getByRole('heading', { name: 'Not passed yet' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'What to revise' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Answer review' })).toHaveCount(0) // exams don't reveal answers

  // 5–7. Retake and pass
  await page.getByRole('button', { name: 'Retake' }).click()
  for (let i = 0; i < course.exam.questions.length; i++) {
    const { answerVisibleQuestion } = await import('./helpers')
    await answerVisibleQuestion(page, true)
    const next = page.getByRole('button', { name: /^(Next|Skip for now)$/ })
    if (await next.isVisible()) await next.click()
  }
  await page.getByRole('button', { name: 'Review answers' }).click()
  await page.getByRole('button', { name: 'Submit exam' }).click()
  await expect(page.getByRole('heading', { name: 'Course complete!' })).toBeVisible()
  await expect(page.locator('.reward').getByText('Final exam passed: Investing Fundamentals')).toBeVisible()
  await expect(page.getByText('Achievement unlocked: First Course Completed')).toBeVisible()

  // 8. Certificate
  await page.getByRole('link', { name: 'View certificate' }).click()
  await expect(page.getByRole('heading', { name: 'Investing Fundamentals' })).toBeVisible()
  await expect(page.locator('.certificate__name')).toHaveText('Grace Hopper')
  const certId = (await page.locator('.certificate__meta strong').last().textContent())!.trim()
  expect(certId).toMatch(/^DEMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/)

  // 9. Download the PDF
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download PDF' }).click()])
  expect(download.suggestedFilename()).toBe(`veleta-certificate-${certId}.pdf`)
  const pdf = readFileSync((await download.path())!)
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  expect(pdf.length).toBeGreaterThan(5000)

  // 10. Verify the certificate record
  await page.goto(`#/verify/${certId}`)
  await expect(page.getByText('Demo certificate (found on this device only)')).toBeVisible()
  await expect(page.locator('.verify-dl')).toContainText('Grace Hopper')
  await expect(page.locator('.verify-dl')).toContainText('Investing Fundamentals')
  await page.goto('#/verify/VF-ZZZZ-ZZZZ')
  await expect(page.getByRole('heading', { name: /No certificate found/ })).toBeVisible()

  // Course shows as completed
  await page.goto('#/app/courses')
  await expect(page.locator('.card', { hasText: 'Investing Fundamentals' }).getByText('Certificate earned')).toBeVisible()
})
