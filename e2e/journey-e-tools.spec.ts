import { expect, test } from '@playwright/test'

const tile = (page: import('@playwright/test').Page, label: string) => page.locator('.result-tile', { hasText: label }).locator('.result-tile__value')

test.describe('Journey E: finance tools', () => {
  test('compound interest responds to inputs and matches the formula', async ({ page }) => {
    await page.goto('#/tools/compound-interest')
    await page.getByLabel('Initial investment').fill('1000')
    await page.getByLabel('Regular contribution').fill('0')
    await page.getByLabel('Assumed annual return').fill('5')
    await page.getByLabel('Time horizon').fill('10')
    await expect(tile(page, 'Ending value')).toHaveText('£1,628.89') // 1000 × 1.05^10
    await expect(tile(page, 'Your contributions')).toHaveText('£1,000.00')
    await page.getByLabel('Time horizon').fill('20')
    await expect(tile(page, 'Ending value')).toHaveText('£2,653.30') // 1000 × 1.05^20
    await page.getByLabel('Currency').selectOption('USD')
    await expect(tile(page, 'Ending value')).toHaveText('$2,653.30')
    // invalid and boundary inputs
    await page.getByLabel('Time horizon').fill('0')
    await expect(page.getByText('Use a whole number of years between 1 and 70.')).toBeVisible()
    await page.getByLabel('Time horizon').fill('abc')
    await expect(page.getByText('Enter a number.')).toBeVisible()
    await page.getByLabel('Time horizon').fill('10')
    await page.getByLabel('Initial investment').fill('0')
    await expect(page.getByText('Enter an initial investment or a regular contribution.')).toBeVisible()
    // chart has an accessible alternative
    await page.getByLabel('Initial investment').fill('1000')
    await page.getByRole('button', { name: 'Show data table' }).click()
    await expect(page.locator('.chart__table tbody tr')).toHaveCount(11)
  })

  test('inflation and real return', async ({ page }) => {
    await page.goto('#/tools/inflation')
    await page.getByLabel('Amount today').fill('1000')
    await page.getByLabel('Assumed annual inflation').fill('3')
    await page.getByLabel('Years').fill('10')
    await page.getByLabel(/Nominal investment return/).fill('7')
    await expect(tile(page, 'What £1,000 buys')).toHaveText('£744.09')
    await expect(tile(page, 'Real return')).toHaveText('3.88%')
  })

  test('stock return separates price and total return', async ({ page }) => {
    await page.goto('#/tools/stock-return')
    await page.getByLabel('Purchase price per share').fill('20')
    await page.getByLabel('Ending (or selling) price per share').fill('22')
    await page.getByLabel('Number of shares').fill('10')
    await page.getByLabel('Total dividends received per share').fill('1')
    await page.getByLabel('Total dealing costs and fees').fill('0')
    await expect(tile(page, 'Capital gain')).toHaveText('£20.00')
    await expect(tile(page, 'Dividend income')).toHaveText('£10.00')
    await expect(page.getByText('Total return 15.00%')).toBeVisible()
    await page.getByLabel('Purchase price per share').fill('0')
    await expect(page.getByText('The purchase price must be greater than zero.')).toBeVisible()
  })

  test('dividend calculator', async ({ page }) => {
    await page.goto('#/tools/dividends')
    await page.getByLabel('Dividend per share, per payment').fill('0.35')
    await page.getByLabel('Payments per year').selectOption('4')
    await page.getByLabel('Number of shares').fill('100')
    await page.getByLabel(/Share price/).fill('40')
    await expect(tile(page, 'Income per payment')).toHaveText('£35.00')
    await expect(tile(page, 'Annual income')).toHaveText('£140.00')
    await expect(tile(page, 'Dividend yield')).toHaveText('3.50%')
  })

  test('valuation: DCF guards against r ≤ g and multiples work', async ({ page }) => {
    await page.goto('#/tools/valuation')
    await page.getByLabel('Terminal growth (forever)').fill('9')
    await expect(page.getByText(/Terminal growth must be lower than the discount rate/)).toBeVisible()
    await page.getByLabel('Terminal growth (forever)').fill('2')
    await expect(page.getByRole('heading', { name: 'Sensitivity: value per share' })).toBeVisible()
    await page.getByRole('tab', { name: 'Multiples' }).click()
    await page.getByLabel('Earnings per share (EPS)').fill('1.50')
    await page.getByLabel('Chosen P/E multiple').fill('18')
    await expect(tile(page, 'Value per share from P/E')).toHaveText('£27.00')
    await page.getByLabel('EBITDA (millions)').fill('40')
    await page.getByLabel('Chosen EV/EBITDA multiple').fill('10')
    await page.getByLabel(/Net debt/).fill('100')
    await page.getByLabel('Shares outstanding (millions)').fill('10')
    await expect(tile(page, 'Value per share from EV/EBITDA')).toHaveText('£30.00')
  })

  test('portfolio tool reacts to allocation', async ({ page }) => {
    await page.goto('#/tools/portfolio')
    await page.getByRole('button', { name: 'All in one company' }).click()
    await expect(tile(page, 'Effective number of holdings')).toHaveText('1.0')
    await expect(page.getByText('A single company carries company-specific risk')).toBeVisible()
    await page.getByRole('button', { name: 'Broad mix' }).click()
    const n = Number(await tile(page, 'Effective number of holdings').textContent())
    expect(n).toBeGreaterThan(3)
  })
})
