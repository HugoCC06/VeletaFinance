import { describe, expect, it } from 'vitest'
import { compound, concentration, dcf, dcfSensitivity, dividends, evEbitdaValue, inflation, InputError, multipleValue, portfolioVolatility, realReturnPct, stockReturn } from './finance'

const base = { initial: 0, contribution: 0, contributionFrequency: 'monthly' as const, annualRatePct: 5, years: 10, compounding: 'annually' as const }

describe('compound', () => {
  it('matches the textbook lump-sum result for annual compounding', () => {
    const r = compound({ ...base, initial: 1000 })
    expect(r.endValue).toBeCloseTo(1628.89, 2)
    expect(r.schedule[1].value).toBeCloseTo(1050, 6)
    expect(r.totalContributions).toBe(1000)
  })
  it('matches monthly compounding', () => {
    expect(compound({ ...base, initial: 1000, compounding: 'monthly' }).endValue).toBeCloseTo(1000 * (1 + 0.05 / 12) ** 120, 6)
  })
  it('matches the future value of an annuity', () => {
    expect(compound({ ...base, contribution: 1000, contributionFrequency: 'annually' }).endValue).toBeCloseTo(12577.89, 2)
    expect(compound({ ...base, contribution: 200, annualRatePct: 6, years: 30, compounding: 'monthly' }).endValue).toBeCloseTo(200903.01, 1)
  })
  it('separates contributions from growth', () => {
    const r = compound({ ...base, initial: 500, contribution: 50 })
    expect(r.totalContributions).toBe(500 + 50 * 120)
    expect(r.growth).toBeCloseTo(r.endValue - r.totalContributions, 9)
  })
  it('handles zero and negative returns', () => {
    expect(compound({ ...base, initial: 1000, annualRatePct: 0 }).endValue).toBeCloseTo(1000, 9)
    expect(compound({ ...base, initial: 1000, annualRatePct: -10, years: 1 }).endValue).toBeCloseTo(900, 6)
  })
  it('rejects invalid input', () => {
    expect(() => compound({ ...base })).toThrow(InputError)
    expect(() => compound({ ...base, initial: -1 })).toThrow(InputError)
    expect(() => compound({ ...base, initial: 1, years: 0 })).toThrow(InputError)
    expect(() => compound({ ...base, initial: 1, years: 2.5 })).toThrow(InputError)
    expect(() => compound({ ...base, initial: Number.NaN })).toThrow(InputError)
  })
})

describe('inflation', () => {
  it('computes purchasing power and future cost', () => {
    const r = inflation(1000, 3, 10)
    expect(r.realValue).toBeCloseTo(744.09, 2)
    expect(r.futureCost).toBeCloseTo(1343.92, 2)
    expect(r.purchasingPowerLossPct).toBeCloseTo(25.59, 2)
    expect(inflation(100, 0, 5).realValue).toBe(100)
  })
  it('computes exact real returns', () => {
    expect(realReturnPct(7, 3)).toBeCloseTo(3.883, 3)
    expect(realReturnPct(10, 10)).toBeCloseTo(0, 9)
  })
  it('validates', () => {
    expect(() => inflation(0, 3, 10)).toThrow(InputError)
    expect(() => inflation(100, 3, -1)).toThrow(InputError)
  })
})

describe('stock return', () => {
  it('splits price return and total return', () => {
    const r = stockReturn({ buyPrice: 20, sellPrice: 22, shares: 10, dividendsPerShare: 1, costs: 0, years: 1 })
    expect(r.capitalGain).toBe(20)
    expect(r.dividendIncome).toBe(10)
    expect(r.priceReturnPct).toBeCloseTo(10, 9)
    expect(r.totalReturnPct).toBeCloseTo(15, 9)
    expect(r.annualisedPct).toBeCloseTo(15, 9)
  })
  it('includes costs and annualises', () => {
    const r = stockReturn({ buyPrice: 100, sellPrice: 121, shares: 1, dividendsPerShare: 0, costs: 0, years: 2 })
    expect(r.annualisedPct).toBeCloseTo(10, 9)
    const c = stockReturn({ buyPrice: 100, sellPrice: 100, shares: 1, dividendsPerShare: 0, costs: 5, years: 0 })
    expect(c.totalGain).toBe(-5)
    expect(c.annualisedPct).toBeNull()
  })
  it('validates against division by zero', () => {
    expect(() => stockReturn({ buyPrice: 0, sellPrice: 1, shares: 1, dividendsPerShare: 0, costs: 0, years: 1 })).toThrow(InputError)
  })
})

describe('dividends', () => {
  it('computes income and yield', () => {
    const r = dividends({ dividendPerPayment: 0.35, paymentsPerYear: 4, shares: 100, price: 40, growthPct: 0, years: 0 })
    expect(r.incomePerPayment).toBeCloseTo(35, 9)
    expect(r.annualIncome).toBeCloseTo(140, 9)
    expect(r.yieldPct).toBeCloseTo(3.5, 9)
  })
  it('projects growth and handles missing price', () => {
    const r = dividends({ dividendPerPayment: 0.5, paymentsPerYear: 1, shares: 1, price: null, growthPct: 6, years: 5 })
    expect(r.yieldPct).toBeNull()
    expect(r.projection[5].income).toBeCloseTo(0.5 * 1.06 ** 5, 9)
  })
  it('validates', () => {
    expect(() => dividends({ dividendPerPayment: 1, paymentsPerYear: 3, shares: 1, price: 1, growthPct: 0, years: 0 })).toThrow(InputError)
    expect(() => dividends({ dividendPerPayment: 1, paymentsPerYear: 4, shares: 1, price: 0, growthPct: 0, years: 0 })).toThrow(InputError)
  })
})

describe('valuation', () => {
  it('applies multiples', () => {
    expect(multipleValue(1.5, 18)).toBeCloseTo(27, 9)
    expect(evEbitdaValue({ ebitda: 40, multiple: 10, netDebt: 100, shares: 10 })).toEqual({ enterpriseValue: 400, equityValue: 300, perShare: 30 })
  })
  it('matches the lesson DCF example', () => {
    // FCF 10, 11, 12 in the lesson ≈ growth from a base; reproduce with exact rows
    const r = dcf({ fcf: 100, growthPct: 10, years: 1, discountPct: 10, terminalGrowthPct: 0, netDebt: 0, shares: 1 })
    expect(r.rows[0].fcf).toBeCloseTo(110, 9)
    expect(r.rows[0].pv).toBeCloseTo(100, 9)
    expect(r.terminalValue).toBeCloseTo(1100, 9)
    expect(r.pvTerminal).toBeCloseTo(1000, 9)
    expect(r.enterpriseValue).toBeCloseTo(1100, 9)
  })
  it('falls as the discount rate rises', () => {
    const b = { fcf: 50, growthPct: 5, years: 5, discountPct: 9, terminalGrowthPct: 2, netDebt: 100, shares: 10 }
    const t = dcfSensitivity(b)
    expect(t[0][1]! > t[1][1]! && t[1][1]! > t[2][1]!).toBe(true)
    expect(t[1][0]! < t[1][2]!).toBe(true)
  })
  it('rejects terminal growth at or above the discount rate', () => {
    expect(() => dcf({ fcf: 1, growthPct: 0, years: 3, discountPct: 3, terminalGrowthPct: 3, netDebt: 0, shares: 1 })).toThrow(InputError)
  })
})

describe('portfolio', () => {
  it('measures concentration', () => {
    expect(concentration([1]).effectiveN).toBe(1)
    expect(concentration([25, 25, 25, 25]).effectiveN).toBeCloseTo(4, 9)
    expect(() => concentration([0, 0])).toThrow(InputError)
  })
  it('reproduces the two-asset lesson figures', () => {
    const v = (rho: number) => portfolioVolatility([50, 50], [0.2, 0.2], [[1, rho], [rho, 1]])
    expect(v(1)).toBeCloseTo(0.2, 9)
    expect(v(0.5)).toBeCloseTo(0.1732, 4)
    expect(v(0)).toBeCloseTo(0.1414, 4)
  })
})
