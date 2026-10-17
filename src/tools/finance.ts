/**
 * Financial formulas behind Veleta's educational calculators. Pure functions,
 * unit-tested in finance.test.ts. Rates are given as percentages (5 = 5%).
 * All results are hypothetical illustrations under the stated assumptions.
 */

export class InputError extends Error {}

function req(cond: boolean, msg: string) {
  if (!cond) throw new InputError(msg)
}
const finite = (...xs: number[]) => xs.every((x) => Number.isFinite(x))

/* ------------------------------------------------------------ compound */
export interface CompoundInput {
  initial: number
  contribution: number
  contributionFrequency: 'monthly' | 'annually'
  annualRatePct: number
  years: number
  compounding: 'monthly' | 'annually'
}

export interface CompoundYear { year: number; contributions: number; value: number; growth: number }

export interface CompoundResult {
  totalContributions: number
  endValue: number
  growth: number
  schedule: CompoundYear[]
  monthlyRate: number
}

/**
 * Simulates month by month. Monthly compounding uses r/12 per month; annual
 * compounding uses the equivalent monthly rate (1 + r)^(1/12) − 1, so the
 * value at each year end equals the textbook annual-compounding result.
 * Contributions are made at the end of each contribution period.
 */
export function compound(input: CompoundInput): CompoundResult {
  const { initial, contribution, annualRatePct, years } = input
  req(finite(initial, contribution, annualRatePct, years), 'Enter numbers in every field.')
  req(initial >= 0 && contribution >= 0, 'Amounts cannot be negative.')
  req(initial + contribution > 0, 'Enter an initial investment or a regular contribution.')
  req(annualRatePct > -100 && annualRatePct <= 50, 'Use an annual return between -99% and 50%.')
  req(Number.isInteger(years) && years >= 1 && years <= 70, 'Use a whole number of years between 1 and 70.')
  const r = annualRatePct / 100
  const monthlyRate = input.compounding === 'monthly' ? r / 12 : Math.pow(1 + r, 1 / 12) - 1
  let value = initial
  let contributions = initial
  const schedule: CompoundYear[] = [{ year: 0, contributions: initial, value: initial, growth: 0 }]
  for (let m = 1; m <= years * 12; m++) {
    value *= 1 + monthlyRate
    const pays = input.contributionFrequency === 'monthly' || m % 12 === 0
    if (pays && contribution > 0) {
      value += contribution
      contributions += contribution
    }
    if (m % 12 === 0) schedule.push({ year: m / 12, contributions, value, growth: value - contributions })
  }
  return { totalContributions: contributions, endValue: value, growth: value - contributions, schedule, monthlyRate }
}

/* ----------------------------------------------------------- inflation */
export interface InflationResult {
  futureCost: number
  realValue: number
  purchasingPowerLossPct: number
  schedule: { year: number; futureCost: number; realValue: number }[]
}

export function inflation(amount: number, ratePct: number, years: number): InflationResult {
  req(finite(amount, ratePct, years), 'Enter numbers in every field.')
  req(amount > 0, 'Enter an amount greater than zero.')
  req(ratePct > -50 && ratePct <= 100, 'Use an inflation rate between -50% and 100%.')
  req(Number.isInteger(years) && years >= 0 && years <= 100, 'Use a whole number of years between 0 and 100.')
  const f = 1 + ratePct / 100
  const schedule = Array.from({ length: years + 1 }, (_, y) => ({ year: y, futureCost: amount * f ** y, realValue: amount / f ** y }))
  const last = schedule[years]
  return { futureCost: last.futureCost, realValue: last.realValue, purchasingPowerLossPct: (1 - last.realValue / amount) * 100, schedule }
}

/** Exact real return in %: (1 + nominal) / (1 + inflation) − 1. */
export function realReturnPct(nominalPct: number, inflationPct: number): number {
  req(finite(nominalPct, inflationPct) && inflationPct > -100, 'Enter valid rates.')
  return ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100
}

/* -------------------------------------------------------- stock return */
export interface StockReturnInput { buyPrice: number; sellPrice: number; shares: number; dividendsPerShare: number; costs: number; years: number }
export interface StockReturnResult {
  invested: number
  capitalGain: number
  dividendIncome: number
  totalGain: number
  priceReturnPct: number
  totalReturnPct: number
  annualisedPct: number | null
}

export function stockReturn(i: StockReturnInput): StockReturnResult {
  req(finite(i.buyPrice, i.sellPrice, i.shares, i.dividendsPerShare, i.costs, i.years), 'Enter numbers in every field.')
  req(i.buyPrice > 0, 'The purchase price must be greater than zero.')
  req(i.sellPrice >= 0 && i.dividendsPerShare >= 0 && i.costs >= 0, 'Prices, dividends and costs cannot be negative.')
  req(i.shares > 0, 'Enter at least one share (fractions are fine).')
  req(i.years >= 0 && i.years <= 100, 'Use a holding period between 0 and 100 years.')
  const invested = i.buyPrice * i.shares + i.costs
  const capitalGain = (i.sellPrice - i.buyPrice) * i.shares
  const dividendIncome = i.dividendsPerShare * i.shares
  const totalGain = capitalGain + dividendIncome - i.costs
  const totalReturn = totalGain / invested
  return {
    invested,
    capitalGain,
    dividendIncome,
    totalGain,
    priceReturnPct: ((i.sellPrice - i.buyPrice) / i.buyPrice) * 100,
    totalReturnPct: totalReturn * 100,
    annualisedPct: i.years >= 1 && totalReturn > -1 ? (Math.pow(1 + totalReturn, 1 / i.years) - 1) * 100 : null,
  }
}

/* ------------------------------------------------------------ dividend */
export interface DividendInput { dividendPerPayment: number; paymentsPerYear: number; shares: number; price: number | null; growthPct: number; years: number }
export interface DividendResult {
  incomePerPayment: number
  annualIncome: number
  annualDividendPerShare: number
  yieldPct: number | null
  projection: { year: number; income: number }[]
}

export function dividends(i: DividendInput): DividendResult {
  req(finite(i.dividendPerPayment, i.paymentsPerYear, i.shares, i.growthPct, i.years), 'Enter numbers in every field.')
  req(i.dividendPerPayment >= 0, 'The dividend cannot be negative.')
  req([1, 2, 4, 12].includes(i.paymentsPerYear), 'Choose a payment frequency.')
  req(i.shares > 0, 'Enter the number of shares.')
  req(i.price === null || (Number.isFinite(i.price) && i.price > 0), 'The share price must be greater than zero.')
  req(i.growthPct > -100 && i.growthPct <= 50, 'Use a growth rate between -99% and 50%.')
  req(Number.isInteger(i.years) && i.years >= 0 && i.years <= 50, 'Use 0–50 years for the projection.')
  const annualDividendPerShare = i.dividendPerPayment * i.paymentsPerYear
  const annualIncome = annualDividendPerShare * i.shares
  return {
    incomePerPayment: i.dividendPerPayment * i.shares,
    annualIncome,
    annualDividendPerShare,
    yieldPct: i.price ? (annualDividendPerShare / i.price) * 100 : null,
    projection: Array.from({ length: i.years + 1 }, (_, y) => ({ year: y, income: annualIncome * Math.pow(1 + i.growthPct / 100, y) })),
  }
}

/* ----------------------------------------------------------- valuation */
export function multipleValue(metricPerShare: number, multiple: number): number {
  req(finite(metricPerShare, multiple), 'Enter numbers in every field.')
  req(multiple >= 0, 'The multiple cannot be negative.')
  return metricPerShare * multiple
}

export interface EvInput { ebitda: number; multiple: number; netDebt: number; shares: number }
export function evEbitdaValue(i: EvInput) {
  req(finite(i.ebitda, i.multiple, i.netDebt, i.shares), 'Enter numbers in every field.')
  req(i.shares > 0, 'Shares outstanding must be greater than zero.')
  req(i.multiple >= 0, 'The multiple cannot be negative.')
  const ev = i.ebitda * i.multiple
  const equity = ev - i.netDebt
  return { enterpriseValue: ev, equityValue: equity, perShare: equity / i.shares }
}

export interface DcfInput {
  fcf: number // last year's free cash flow
  growthPct: number // growth for the forecast years
  years: number
  discountPct: number
  terminalGrowthPct: number
  netDebt: number
  shares: number
}

export interface DcfResult {
  rows: { year: number; fcf: number; discountFactor: number; pv: number }[]
  terminalValue: number
  pvTerminal: number
  pvForecast: number
  enterpriseValue: number
  equityValue: number
  perShare: number
  terminalShare: number
}

export function dcf(i: DcfInput): DcfResult {
  req(finite(i.fcf, i.growthPct, i.years, i.discountPct, i.terminalGrowthPct, i.netDebt, i.shares), 'Enter numbers in every field.')
  req(Number.isInteger(i.years) && i.years >= 1 && i.years <= 20, 'Forecast between 1 and 20 years.')
  req(i.discountPct > 0 && i.discountPct <= 40, 'Use a discount rate between 0% and 40%.')
  req(i.terminalGrowthPct < i.discountPct, 'Terminal growth must be lower than the discount rate, or the value becomes infinite.')
  req(i.terminalGrowthPct >= -5 && i.terminalGrowthPct <= 5, 'Keep terminal growth between -5% and 5% — no business outgrows the economy forever.')
  req(i.growthPct > -50 && i.growthPct <= 60, 'Use forecast growth between -50% and 60%.')
  req(i.shares > 0, 'Shares outstanding must be greater than zero.')
  const r = i.discountPct / 100
  const g = i.growthPct / 100
  const tg = i.terminalGrowthPct / 100
  const rows = []
  let f = i.fcf
  for (let y = 1; y <= i.years; y++) {
    f *= 1 + g
    const df = 1 / Math.pow(1 + r, y)
    rows.push({ year: y, fcf: f, discountFactor: df, pv: f * df })
  }
  const lastFcf = rows[rows.length - 1].fcf
  const terminalValue = (lastFcf * (1 + tg)) / (r - tg)
  const pvTerminal = terminalValue / Math.pow(1 + r, i.years)
  const pvForecast = rows.reduce((n, x) => n + x.pv, 0)
  const enterpriseValue = pvForecast + pvTerminal
  const equityValue = enterpriseValue - i.netDebt
  return { rows, terminalValue, pvTerminal, pvForecast, enterpriseValue, equityValue, perShare: equityValue / i.shares, terminalShare: pvTerminal / enterpriseValue }
}

export function dcfSensitivity(base: DcfInput, discountDeltas = [-1, 0, 1], growthDeltas = [-0.5, 0, 0.5]) {
  return discountDeltas.map((dd) =>
    growthDeltas.map((gd) => {
      try {
        return dcf({ ...base, discountPct: base.discountPct + dd, terminalGrowthPct: base.terminalGrowthPct + gd }).perShare
      } catch {
        return null
      }
    }),
  )
}

/* ----------------------------------------------------------- portfolio */
export interface Holding { id: string; weight: number }

/** Herfindahl–Hirschman index of weights (0–1) and its "effective number of holdings". */
export function concentration(weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0)
  req(total > 0, 'Add at least one holding with a weight above zero.')
  const w = weights.map((x) => x / total)
  const hhi = w.reduce((n, x) => n + x * x, 0)
  return { hhi, effectiveN: 1 / hhi, largest: Math.max(...w) }
}

/**
 * Portfolio volatility from weights, volatilities and a correlation matrix:
 * σp = sqrt(Σi Σj wi wj σi σj ρij). Inputs here are teaching assumptions.
 */
export function portfolioVolatility(weights: number[], vols: number[], corr: number[][]): number {
  req(weights.length === vols.length && corr.length === vols.length, 'Mismatched inputs.')
  const total = weights.reduce((a, b) => a + b, 0)
  req(total > 0, 'Weights must sum to more than zero.')
  const w = weights.map((x) => x / total)
  let v = 0
  for (let i = 0; i < w.length; i++) for (let j = 0; j < w.length; j++) v += w[i] * w[j] * vols[i] * vols[j] * corr[i][j]
  return Math.sqrt(Math.max(0, v))
}
