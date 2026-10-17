import { expect, type Page } from '@playwright/test'
import { getQuestion } from '../src/content/index.ts'
import { correctAnswer } from '../src/engine/grading.ts'
import type { AnswerValue, Question } from '../src/content/types.ts'

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function signUp(page: Page, name = 'Ada Learner', email = `ada${Date.now()}@example.com`, password = 'correct-horse-1') {
  await page.goto('#/signup')
  await page.getByLabel('Display name').fill(name)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/#\/onboarding/)
  return { email, password }
}

export async function completeOnboarding(page: Page, opts: { goal?: 'Casual' | 'Regular' | 'Serious' | 'Intense'; skipPlacement?: boolean } = {}) {
  await expect(page.getByRole('heading', { name: 'Welcome to Veleta!' })).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByText('I’m completely new').click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByText('Stocks & markets').click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.locator('.choice-tile', { hasText: opts.goal ?? 'Casual' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Skip' }).click()
  await expect(page.getByRole('heading', { name: 'Your recommended start' })).toBeVisible()
  await page.getByRole('button', { name: 'Start learning' }).click()
  await expect(page).toHaveURL(/#\/app\/learn\/c1/)
}

/** Answers the visible question. `correct=false` deliberately answers wrongly. */
export async function answerVisibleQuestion(page: Page, correct = true): Promise<Question> {
  const box = page.locator('.question').first()
  const qid = (await box.getAttribute('data-qid'))!
  const q = getQuestion(qid)!.question
  const value: AnswerValue = correctAnswer(q)
  switch (q.kind) {
    case 'mcq':
    case 'tf': {
      const idx = correct ? (value as number) : ((value as number) + 1) % q.options.length
      await box.locator('.option').filter({ has: page.locator('.option__text', { hasText: new RegExp(`^${esc(q.options[idx])}$`) }) }).click()
      break
    }
    case 'multi': {
      const picks = correct ? (value as number[]) : [...Array(q.options.length).keys()].filter((i) => !(value as number[]).includes(i)).slice(0, 1)
      for (const i of picks.length ? picks : [0]) await box.locator('.option').filter({ has: page.locator('.option__text', { hasText: new RegExp(`^${esc(q.options[i])}$`) }) }).click()
      break
    }
    case 'numeric':
      await box.locator('input').fill(String(correct ? q.answer : q.answer + 1000))
      break
    case 'match': {
      const rights = q.right
      for (let i = 0; i < q.left.length; i++) {
        const target = correct ? rights[i] : rights.find((r) => r !== rights[i])!
        await box.getByLabel(q.left[i], { exact: true }).selectOption({ label: target })
      }
      break
    }
    case 'order': {
      if (correct) {
        for (let pos = 0; pos < q.items.length; pos++) {
          const texts = await box.locator('.order__text').allTextContents()
          let cur = texts.indexOf(q.items[pos])
          while (cur > pos) {
            await box.getByRole('button', { name: `Move “${q.items[pos]}” up` }).click()
            cur--
          }
        }
      }
      break
    }
  }
  return q
}

/** Plays through an open lesson. Missed questions (if any) are answered correctly on the retry. */
export async function playLesson(page: Page, opts: { wrongFirst?: string[] } = {}) {
  const wrongOnce = new Set(opts.wrongFirst ?? [])
  const done = page.getByRole('heading', { name: /Lesson complete!/ })
  const check = page.getByRole('button', { name: 'Check', exact: true })
  const cont = page.locator('.lesson__footer').getByRole('button', { name: 'Continue' })
  for (let guard = 0; guard < 60; guard++) {
    await expect(done.or(check).or(cont).first()).toBeVisible()
    if (await done.isVisible()) return
    if (await check.isVisible()) {
      const qid = await page.locator('.question').first().getAttribute('data-qid')
      const wrong = qid !== null && wrongOnce.has(qid)
      if (wrong) wrongOnce.delete(qid!)
      await answerVisibleQuestion(page, !wrong)
      await check.click()
      await page.locator('.feedback').getByRole('button', { name: 'Continue' }).click()
    } else {
      await cont.click()
    }
  }
  throw new Error('Lesson did not finish')
}

/** Answers every question in an open assessment, wrongly for the first `wrong` questions. */
export async function playAssessment(page: Page, wrong = 0) {
  await page.getByRole('button', { name: /^(Start|Continue)$/ }).click()
  for (let i = 0; ; i++) {
    await answerVisibleQuestion(page, i >= wrong)
    const next = page.getByRole('button', { name: /^(Next|Skip for now)$/ })
    if (await next.isVisible()) await next.click()
    else {
      await page.getByRole('button', { name: 'Review answers' }).click()
      break
    }
  }
  await page.getByRole('button', { name: /Submit (exam|checkpoint)/ }).click()
}
