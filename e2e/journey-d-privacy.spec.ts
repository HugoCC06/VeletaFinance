import { expect, test } from '@playwright/test'
import { completeOnboarding, signUp } from './helpers'

// Demo mode has no shared server, so the two-user friend flow (requests,
// acceptance, friends-only leaderboard, cross-user RLS) is verified against a
// real PostgreSQL database in supabase/tests/01_core.test.sql instead.
test('Journey D (demo mode): profiles are private by default; public profiles expose only public fields', async ({ page, browser }) => {
  const { email, password } = await signUp(page, 'Priya Patel')
  await completeOnboarding(page)

  // Private by default
  await page.goto('#/app/settings')
  const publicSwitch = page.getByRole('switch', { name: 'Public profile' })
  await expect(publicSwitch).not.toBeChecked()
  const username = (await page.getByLabel('Username').inputValue()).trim()

  // Friends features explain that they need the online backend
  await page.goto('#/app/friends')
  await expect(page.getByRole('heading', { name: 'Friends need an online account' })).toBeVisible()

  // A signed-out visitor in the same browser cannot see the private profile
  await page.goto('#/app/settings')
  await page.getByRole('button', { name: 'Sign out' }).click()
  await page.goto(`#/u/${username}`)
  await expect(page.getByRole('heading', { name: 'This profile is private or doesn’t exist' })).toBeVisible()

  // A different browser (no shared storage) can never see demo data
  const other = await browser.newPage()
  await other.goto(`#/u/${username}`)
  await expect(other.getByRole('heading', { name: 'This profile is private or doesn’t exist' })).toBeVisible()
  await other.close()

  // Make the profile public
  await page.goto('#/signin')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.goto('#/app/settings')
  await page.getByRole('switch', { name: 'Public profile' }).check()
  await expect(page.getByText('Your profile is now public.')).toBeVisible()
  await page.getByRole('button', { name: 'Sign out' }).click()

  await page.goto(`#/u/${username}`)
  await expect(page.getByRole('heading', { name: 'Priya Patel' })).toBeVisible()
  const text = await page.locator('main').innerText()
  expect(text).not.toMatch(/@example\.com/) // no email
  expect(text).not.toMatch(/Daily goal|Time zone|Stocks & markets/) // no private settings or interests
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')

  // Private learner pages require sign-in
  await page.goto('#/app/settings')
  await expect(page).toHaveURL(/#\/signin\?next=/)
})
