import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { compound, dcf, dcfSensitivity, dividends, evEbitdaValue, inflation, InputError, multipleValue, portfolioVolatility, realReturnPct, stockReturn, concentration } from '../../tools/finance'
import { BLOCKS, correlationFor, PRESETS } from '../../tools/portfolioData'
import { parseNumberInput } from '../../engine/grading'
import { LineChart } from '../../charts/LineChart'
import { BarChart } from '../../charts/BarChart'
import { Donut } from '../../charts/Donut'
import { compact } from '../../charts/scale'
import { Field, SelectField } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Alert, Button, EmptyState, LinkButton } from '../../components/ui'
import { readJSON, writeJSON } from '../../lib/storage'
import { useToast } from '../../components/Toast'
import { formatMoney, formatNumber } from '../../lib/format'
import { useMeta } from '../../lib/useMeta'
import { TOOLS } from './ToolsHub'

type Cur = 'GBP' | 'USD'
const SYM: Record<Cur, string> = { GBP: '£', USD: '$' }

function useNum(initial: string) {
  const [raw, setRaw] = useState(initial)
  const value = parseNumberInput(raw)
  return { raw, setRaw, value, error: raw.trim() === '' ? 'Required.' : value === null ? 'Enter a number.' : null }
}
type Num = ReturnType<typeof useNum>

function NumField({ label, n, prefix, suffix, hint }: { label: string; n: Num; prefix?: string; suffix?: string; hint?: string }) {
  return <Field label={label} value={n.raw} onChange={(e) => n.setRaw(e.target.value)} inputMode="decimal" prefix={prefix} suffix={suffix} hint={hint} error={n.error} autoComplete="off" />
}

function compute<T>(fn: () => T): { ok: T | null; error: string | null } {
  try {
    return { ok: fn(), error: null }
  } catch (e) {
    return { ok: null, error: e instanceof InputError ? e.message : 'Check your inputs.' }
  }
}

function ToolFrame({ title, intro, inputs, results, explain, related }: { title: string; intro: string; inputs: ReactNode; results: ReactNode; explain: ReactNode; related?: { href: string; label: string } }) {
  return (
    <div className="container page tool">
      <nav className="small" aria-label="Breadcrumb"><Link to="/tools">Finance tools</Link> / <span aria-current="page">{title}</span></nav>
      <header className="page-header mt-4">
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <div className="tool__grid">
        <section className="card stack tool__inputs" aria-labelledby="inputs-h"><h2 id="inputs-h" className="card-title"><Icon name="settings" />Inputs</h2>{inputs}</section>
        <section className="stack tool__results" aria-labelledby="results-h" aria-live="polite"><h2 id="results-h" className="sr-only">Results</h2>{results}</section>
      </div>
      <section className="card stack mt-6" aria-labelledby="explain-h">
        <h2 id="explain-h" className="card-title"><Icon name="info" />How it works</h2>
        {explain}
        {related && <p className="small mb-0">Learn more: <Link to={related.href}>{related.label}</Link></p>}
      </section>
      <p className="tiny muted mt-4">Educational illustration only — not a forecast, a recommendation or financial advice. Real returns vary, can be negative, and are affected by fees, taxes and inflation.</p>
    </div>
  )
}

function ResultTiles({ items }: { items: { label: string; value: string; tone?: string; sub?: string }[] }) {
  return (
    <div className="result-tiles">
      {items.map((i) => (
        <div key={i.label} className={`result-tile${i.tone ? ` result-tile--${i.tone}` : ''}`}>
          <span className="result-tile__label">{i.label}</span>
          <span className="result-tile__value tabular">{i.value}</span>
          {i.sub && <span className="result-tile__sub">{i.sub}</span>}
        </div>
      ))}
    </div>
  )
}

function CurrencySelect({ cur, setCur }: { cur: Cur; setCur: (c: Cur) => void }) {
  return <SelectField label="Currency" value={cur} onChange={(v) => setCur(v as Cur)} options={[{ value: 'GBP', label: 'Pounds (£)' }, { value: 'USD', label: 'Dollars ($)' }]} />
}

/* ------------------------------------------------------------------ */
function CompoundTool() {
  const [cur, setCur] = useState<Cur>('GBP')
  const initial = useNum('1000')
  const contribution = useNum('100')
  const rate = useNum('5')
  const years = useNum('20')
  const [freq, setFreq] = useState<'monthly' | 'annually'>('monthly')
  const [comp, setComp] = useState<'monthly' | 'annually'>('annually')
  const toast = useToast()
  const r = compute(() => compound({ initial: initial.value ?? NaN, contribution: contribution.value ?? NaN, contributionFrequency: freq, annualRatePct: rate.value ?? NaN, years: years.value ?? NaN, compounding: comp }))
  const s = SYM[cur]
  const save = () => {
    if (!r.ok) return
    const list = readJSON<unknown[]>('veleta.savedCalcs', [])
    const ok = writeJSON('veleta.savedCalcs', [{ at: new Date().toISOString(), tool: 'compound', initial: initial.value, contribution: contribution.value, rate: rate.value, years: years.value, endValue: r.ok.endValue }, ...list].slice(0, 10))
    toast.show(ok ? 'Scenario saved on this device.' : 'This browser blocked saving.', ok ? 'success' : 'danger')
  }
  return (
    <ToolFrame
      title="Compound interest calculator"
      intro="See how money could grow when returns are reinvested. The chart separates what you put in from hypothetical growth."
      inputs={
        <>
          <CurrencySelect cur={cur} setCur={setCur} />
          <NumField label="Initial investment" n={initial} prefix={s} />
          <NumField label="Regular contribution" n={contribution} prefix={s} />
          <SelectField label="Contribution frequency" value={freq} onChange={(v) => setFreq(v as typeof freq)} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'annually', label: 'Annually' }]} />
          <NumField label="Assumed annual return" n={rate} suffix="%" hint="Before inflation. Real returns vary year to year." />
          <NumField label="Time horizon" n={years} suffix="years" />
          <SelectField label="Compounding" value={comp} onChange={(v) => setComp(v as typeof comp)} options={[{ value: 'annually', label: 'Annually' }, { value: 'monthly', label: 'Monthly' }]} />
        </>
      }
      results={r.error ? <Alert tone="warning">{r.error}</Alert> : r.ok && (
        <>
          <ResultTiles items={[
            { label: 'Ending value (hypothetical)', value: formatMoney(r.ok.endValue, cur), tone: 'violet' },
            { label: 'Your contributions', value: formatMoney(r.ok.totalContributions, cur), tone: 'sky' },
            { label: 'Estimated growth', value: formatMoney(r.ok.growth, cur), tone: 'mint', sub: r.ok.endValue > 0 ? `${Math.round((r.ok.growth / r.ok.endValue) * 100)}% of the final value` : undefined },
          ]} />
          <div className="card">
            <LineChart
              title="Projected value versus contributions"
              xLabel="Year"
              area
              formatY={(v) => `${s}${compact(v)}`}
              formatX={(x) => String(x)}
              series={[
                { id: 'value', label: 'Projected value', tone: 'violet', points: r.ok.schedule.map((y) => [y.year, Math.round(y.value * 100) / 100]) },
                { id: 'contrib', label: 'Total contributions', tone: 'sky', points: r.ok.schedule.map((y) => [y.year, y.contributions]) },
              ]}
            />
          </div>
          <div><Button size="sm" icon="download" onClick={save}>Save this scenario</Button></div>
        </>
      )}
      explain={
        <>
          <p>Each month the balance grows at the monthly rate, then contributions are added at the end of each contribution period. With <strong>monthly compounding</strong> the monthly rate is r ÷ 12; with <strong>annual compounding</strong> we use the equivalent monthly rate (1 + r)<sup>1/12</sup> − 1, so year-end values match the textbook formula FV = PV × (1 + r)<sup>n</sup>.</p>
          <p className="mb-0">This assumes the same return every year. Real investment returns are volatile and can be negative, and fees, taxes and inflation reduce real outcomes. The result is not a forecast.</p>
        </>
      }
      related={{ href: '/curriculum/investing-fundamentals', label: 'Investing Fundamentals: The power of compounding' }}
    />
  )
}

function InflationTool() {
  const [cur, setCur] = useState<Cur>('GBP')
  const amount = useNum('1000')
  const rate = useNum('3')
  const years = useNum('10')
  const nominal = useNum('6')
  const r = compute(() => inflation(amount.value ?? NaN, rate.value ?? NaN, years.value ?? NaN))
  const real = compute(() => realReturnPct(nominal.value ?? NaN, rate.value ?? NaN))
  const s = SYM[cur]
  return (
    <ToolFrame
      title="Inflation calculator"
      intro="Explore how a constant inflation rate changes what money can buy, and turn a nominal return into a real return."
      inputs={
        <>
          <CurrencySelect cur={cur} setCur={setCur} />
          <NumField label="Amount today" n={amount} prefix={s} />
          <NumField label="Assumed annual inflation" n={rate} suffix="%" hint="For reference, the Bank of England and the Federal Reserve both target 2% inflation (CPI and PCE respectively)." />
          <NumField label="Years" n={years} suffix="years" />
          <NumField label="Nominal investment return (for real return)" n={nominal} suffix="%" />
        </>
      }
      results={r.error ? <Alert tone="warning">{r.error}</Alert> : r.ok && (
        <>
          <ResultTiles items={[
            { label: `What ${formatMoney(amount.value!, cur, 0)} buys in today’s money after ${years.value} years`, value: formatMoney(r.ok.realValue, cur), tone: 'coral' },
            { label: `Cost then of something costing ${formatMoney(amount.value!, cur, 0)} today`, value: formatMoney(r.ok.futureCost, cur), tone: 'violet' },
            { label: 'Purchasing power lost', value: `${r.ok.purchasingPowerLossPct.toFixed(1)}%`, tone: 'sun' },
            { label: 'Real return (exact)', value: real.ok !== null ? `${real.ok.toFixed(2)}%` : '—', tone: 'mint', sub: real.ok !== null ? `Approximation: ${((nominal.value ?? 0) - (rate.value ?? 0)).toFixed(2)}%` : real.error ?? undefined },
          ]} />
          <div className="card">
            <LineChart title="Nominal versus real value" xLabel="Year" formatY={(v) => `${s}${compact(v)}`} formatX={(x) => String(x)} series={[
              { id: 'cost', label: 'Future cost of today’s basket', tone: 'violet', points: r.ok.schedule.map((y) => [y.year, Math.round(y.futureCost * 100) / 100]) },
              { id: 'real', label: 'Real value of the amount', tone: 'coral', points: r.ok.schedule.map((y) => [y.year, Math.round(y.realValue * 100) / 100]) },
            ]} />
          </div>
        </>
      )}
      explain={
        <>
          <p><strong>Nominal</strong> values are in pounds or dollars of the day; <strong>real</strong> values adjust for inflation. Real value after n years = amount ÷ (1 + i)<sup>n</sup>; future cost = amount × (1 + i)<sup>n</sup>.</p>
          <p className="mb-0">Real return = (1 + nominal) ÷ (1 + inflation) − 1. The quick approximation (nominal − inflation) is close for small rates. This calculator uses a constant assumed rate, not historical inflation data.</p>
        </>
      }
      related={{ href: '/curriculum/investing-fundamentals', label: 'Investing Fundamentals: Inflation and purchasing power' }}
    />
  )
}

function StockReturnTool() {
  const [cur, setCur] = useState<Cur>('GBP')
  const buy = useNum('20')
  const sell = useNum('22')
  const shares = useNum('50')
  const divs = useNum('1')
  const costs = useNum('0')
  const years = useNum('1')
  const r = compute(() => stockReturn({ buyPrice: buy.value ?? NaN, sellPrice: sell.value ?? NaN, shares: shares.value ?? NaN, dividendsPerShare: divs.value ?? NaN, costs: costs.value ?? NaN, years: years.value ?? NaN }))
  const s = SYM[cur]
  return (
    <ToolFrame
      title="Stock return calculator"
      intro="Work out a hypothetical share investment’s capital gain, dividend income and total return."
      inputs={
        <>
          <CurrencySelect cur={cur} setCur={setCur} />
          <NumField label="Purchase price per share" n={buy} prefix={s} />
          <NumField label="Ending (or selling) price per share" n={sell} prefix={s} />
          <NumField label="Number of shares" n={shares} />
          <NumField label="Total dividends received per share" n={divs} prefix={s} />
          <NumField label="Total dealing costs and fees" n={costs} prefix={s} hint="E.g. commissions; UK stamp duty is 0.5% of the purchase value for most UK shares." />
          <NumField label="Holding period" n={years} suffix="years" hint="Used for the annualised return (1 year or more)." />
        </>
      }
      results={r.error ? <Alert tone="warning">{r.error}</Alert> : r.ok && (
        <>
          <ResultTiles items={[
            { label: 'Capital gain or loss', value: formatMoney(r.ok.capitalGain, cur), tone: r.ok.capitalGain >= 0 ? 'mint' : 'coral', sub: `Price return ${r.ok.priceReturnPct.toFixed(2)}%` },
            { label: 'Dividend income', value: formatMoney(r.ok.dividendIncome, cur), tone: 'sun' },
            { label: 'Total gain after costs', value: formatMoney(r.ok.totalGain, cur), tone: r.ok.totalGain >= 0 ? 'violet' : 'coral', sub: `Total return ${r.ok.totalReturnPct.toFixed(2)}% on ${formatMoney(r.ok.invested, cur)} invested` },
            { label: 'Annualised total return', value: r.ok.annualisedPct === null ? 'n/a' : `${r.ok.annualisedPct.toFixed(2)}% a year`, tone: 'sky' },
          ]} />
          <div className="card"><BarChart title="Components of return" unit={s} bars={[
            { label: 'Capital gain', value: Math.round(r.ok.capitalGain * 100) / 100, tone: r.ok.capitalGain >= 0 ? 'mint' : 'coral' },
            { label: 'Dividends', value: Math.round(r.ok.dividendIncome * 100) / 100, tone: 'sun' },
            { label: 'Costs', value: -(costs.value ?? 0), tone: 'coral' },
            { label: 'Total', value: Math.round(r.ok.totalGain * 100) / 100, tone: 'violet' },
          ]} formatValue={(v) => formatMoney(v, cur, Math.abs(v) < 100 ? 2 : 0)} /></div>
        </>
      )}
      explain={
        <>
          <p><strong>Price return</strong> = (ending price − purchase price) ÷ purchase price. <strong>Total return</strong> = (capital gain + dividends − costs) ÷ amount invested (including costs). The annualised figure is (1 + total return)<sup>1/years</sup> − 1.</p>
          <p className="mb-0">Taxes are not included and depend on where you live and the account used. Reinvested dividends would compound further.</p>
        </>
      }
      related={{ href: '/curriculum/dividends-and-wealth', label: 'Dividends: Yield versus total return' }}
    />
  )
}

function DividendTool() {
  const [cur, setCur] = useState<Cur>('GBP')
  const dps = useNum('0.35')
  const shares = useNum('200')
  const price = useNum('14')
  const growth = useNum('3')
  const [freq, setFreq] = useState('4')
  const r = compute(() => dividends({ dividendPerPayment: dps.value ?? NaN, paymentsPerYear: Number(freq), shares: shares.value ?? NaN, price: price.raw.trim() === '' ? null : price.value ?? NaN, growthPct: growth.value ?? NaN, years: 10 }))
  const s = SYM[cur]
  return (
    <ToolFrame
      title="Dividend calculator"
      intro="Estimate dividend income under the assumptions you choose. Remember: companies can cut or cancel dividends at any time."
      inputs={
        <>
          <CurrencySelect cur={cur} setCur={setCur} />
          <NumField label="Dividend per share, per payment" n={dps} prefix={s} />
          <SelectField label="Payments per year" value={freq} onChange={setFreq} options={[{ value: '1', label: 'Annually (1)' }, { value: '2', label: 'Twice a year — common in the UK (2)' }, { value: '4', label: 'Quarterly — common in the US (4)' }, { value: '12', label: 'Monthly (12)' }]} />
          <NumField label="Number of shares" n={shares} />
          <Field label="Share price (optional, for yield)" value={price.raw} onChange={(e) => price.setRaw(e.target.value)} prefix={s} inputMode="decimal" error={price.raw.trim() !== '' && price.value === null ? 'Enter a number.' : null} />
          <NumField label="Assumed annual dividend growth" n={growth} suffix="%" hint="Hypothetical. Dividends can also fall." />
        </>
      }
      results={r.error ? <Alert tone="warning">{r.error}</Alert> : r.ok && (
        <>
          <ResultTiles items={[
            { label: 'Income per payment', value: formatMoney(r.ok.incomePerPayment, cur), tone: 'sun' },
            { label: 'Annual income (current rate)', value: formatMoney(r.ok.annualIncome, cur), tone: 'mint' },
            { label: 'Dividend yield', value: r.ok.yieldPct === null ? 'Add a price' : `${r.ok.yieldPct.toFixed(2)}%`, tone: 'violet', sub: `${formatMoney(r.ok.annualDividendPerShare, cur)} a year per share` },
          ]} />
          <div className="card"><BarChart title="Hypothetical annual income with assumed growth" unit={s} bars={r.ok.projection.filter((_, i) => i % 2 === 0).map((p) => ({ label: `Year ${p.year}`, value: Math.round(p.income * 100) / 100, tone: 'sun' }))} formatValue={(v) => formatMoney(v, cur, 0)} /></div>
          <Alert tone="info">A yield is not guaranteed income. If the share price falls the yield rises, which can signal that the market expects a dividend cut.</Alert>
        </>
      )}
      explain={
        <p className="mb-0">Income per payment = dividend per share × shares. Annual income = dividend per payment × payments per year × shares. Dividend yield = annual dividend per share ÷ share price. The projection applies your assumed growth rate each year: income × (1 + g)<sup>year</sup>.</p>
      }
      related={{ href: '/curriculum/dividends-and-wealth', label: 'Dividends and Long-Term Wealth Building' }}
    />
  )
}

function ValuationTool() {
  const [mode, setMode] = useState<'multiples' | 'dcf'>('dcf')
  const [cur, setCur] = useState<Cur>('GBP')
  const eps = useNum('1.50')
  const pe = useNum('15')
  const ebitda = useNum('40')
  const evm = useNum('8')
  const netDebt = useNum('100')
  const shares = useNum('20')
  const fcf = useNum('25')
  const growth = useNum('6')
  const years = useNum('5')
  const disc = useNum('9')
  const tg = useNum('2')
  const s = SYM[cur]
  const peVal = compute(() => multipleValue(eps.value ?? NaN, pe.value ?? NaN))
  const evVal = compute(() => evEbitdaValue({ ebitda: ebitda.value ?? NaN, multiple: evm.value ?? NaN, netDebt: netDebt.value ?? NaN, shares: shares.value ?? NaN }))
  const dcfIn = { fcf: fcf.value ?? NaN, growthPct: growth.value ?? NaN, years: years.value ?? NaN, discountPct: disc.value ?? NaN, terminalGrowthPct: tg.value ?? NaN, netDebt: netDebt.value ?? NaN, shares: shares.value ?? NaN }
  const d = compute(() => dcf(dcfIn))
  const sens = d.ok ? dcfSensitivity(dcfIn) : null
  return (
    <ToolFrame
      title="Company valuation calculator"
      intro="Estimate a hypothetical company’s value with multiples or a simplified discounted cash flow. Small changes in assumptions move the answer a lot — that is the point."
      inputs={
        <>
          <div className="tabs" role="tablist" aria-label="Method">
            <button type="button" role="tab" aria-selected={mode === 'dcf'} onClick={() => setMode('dcf')}>Discounted cash flow</button>
            <button type="button" role="tab" aria-selected={mode === 'multiples'} onClick={() => setMode('multiples')}>Multiples</button>
          </div>
          <CurrencySelect cur={cur} setCur={setCur} />
          {mode === 'multiples' ? (
            <>
              <NumField label="Earnings per share (EPS)" n={eps} prefix={s} />
              <NumField label="Chosen P/E multiple" n={pe} suffix="×" hint="E.g. the average of comparable companies." />
              <hr />
              <NumField label="EBITDA (millions)" n={ebitda} prefix={s} suffix="m" />
              <NumField label="Chosen EV/EBITDA multiple" n={evm} suffix="×" />
              <NumField label="Net debt (millions)" n={netDebt} prefix={s} suffix="m" hint="Borrowings minus cash. Negative if the company has net cash." />
              <NumField label="Shares outstanding (millions)" n={shares} suffix="m" />
            </>
          ) : (
            <>
              <NumField label="Last year’s free cash flow (millions)" n={fcf} prefix={s} suffix="m" />
              <NumField label="FCF growth during forecast" n={growth} suffix="%" />
              <NumField label="Forecast years" n={years} suffix="years" />
              <NumField label="Discount rate" n={disc} suffix="%" hint="The return you require for the risk." />
              <NumField label="Terminal growth (forever)" n={tg} suffix="%" hint="Must be below the discount rate; keep it modest." />
              <NumField label="Net debt (millions)" n={netDebt} prefix={s} suffix="m" />
              <NumField label="Shares outstanding (millions)" n={shares} suffix="m" />
            </>
          )}
        </>
      }
      results={mode === 'multiples' ? (
        <>
          {peVal.error ? <Alert tone="warning">{peVal.error}</Alert> : <ResultTiles items={[{ label: 'Value per share from P/E', value: formatMoney(peVal.ok!, cur), tone: 'violet', sub: `${formatNumber(eps.value ?? 0, 2)} EPS × ${pe.value}` }]} />}
          {evVal.error ? <Alert tone="warning">{evVal.error}</Alert> : evVal.ok && (
            <ResultTiles items={[
              { label: 'Enterprise value', value: `${s}${formatNumber(evVal.ok.enterpriseValue, 1)}m`, tone: 'sky', sub: 'EBITDA × multiple' },
              { label: 'Equity value', value: `${s}${formatNumber(evVal.ok.equityValue, 1)}m`, tone: 'mint', sub: 'EV − net debt' },
              { label: 'Value per share from EV/EBITDA', value: formatMoney(evVal.ok.perShare, cur), tone: 'violet' },
            ]} />
          )}
          {evVal.ok && evVal.ok.equityValue < 0 && <Alert tone="warning">Net debt exceeds the enterprise value, so this method implies no value for shareholders.</Alert>}
        </>
      ) : d.error ? <Alert tone="warning">{d.error}</Alert> : d.ok && (
        <>
          <ResultTiles items={[
            { label: 'Estimated value per share', value: formatMoney(d.ok.perShare, cur), tone: 'violet', sub: 'Under these assumptions only' },
            { label: 'Enterprise value', value: `${s}${formatNumber(d.ok.enterpriseValue, 1)}m`, tone: 'sky' },
            { label: 'Share from terminal value', value: `${Math.round(d.ok.terminalShare * 100)}%`, tone: 'sun', sub: 'Value from years beyond the forecast' },
          ]} />
          <div className="table-wrap">
            <table className="table">
              <caption className="sr-only">DCF workings</caption>
              <thead><tr><th scope="col">Year</th><th scope="col" className="num">FCF ({s}m)</th><th scope="col" className="num">Discount factor</th><th scope="col" className="num">Present value ({s}m)</th></tr></thead>
              <tbody>
                {d.ok.rows.map((r) => <tr key={r.year}><td>{r.year}</td><td className="num">{formatNumber(r.fcf, 2)}</td><td className="num">{r.discountFactor.toFixed(4)}</td><td className="num">{formatNumber(r.pv, 2)}</td></tr>)}
                <tr><td>Terminal</td><td className="num">{formatNumber(d.ok.terminalValue, 2)}</td><td className="num">{(1 / Math.pow(1 + (disc.value ?? 0) / 100, years.value ?? 0)).toFixed(4)}</td><td className="num">{formatNumber(d.ok.pvTerminal, 2)}</td></tr>
                <tr><th scope="row">Enterprise value</th><td /><td /><td className="num bold">{formatNumber(d.ok.enterpriseValue, 2)}</td></tr>
                <tr><th scope="row">− Net debt</th><td /><td /><td className="num">{formatNumber(netDebt.value ?? 0, 2)}</td></tr>
                <tr><th scope="row">= Equity value</th><td /><td /><td className="num bold">{formatNumber(d.ok.equityValue, 2)}</td></tr>
              </tbody>
            </table>
          </div>
          {sens && (
            <div className="card stack-sm">
              <h3 className="mb-0">Sensitivity: value per share</h3>
              <div className="table-wrap">
                <table className="table">
                  <caption className="sr-only">Value per share for different discount rates (rows) and terminal growth rates (columns)</caption>
                  <thead><tr><th scope="col">Discount rate ↓ / terminal growth →</th>{[-0.5, 0, 0.5].map((g) => <th key={g} scope="col" className="num">{((tg.value ?? 0) + g).toFixed(1)}%</th>)}</tr></thead>
                  <tbody>
                    {sens.map((row, i) => (
                      <tr key={i}><th scope="row">{((disc.value ?? 0) + [-1, 0, 1][i]).toFixed(1)}%</th>{row.map((v, j) => <td key={j} className={`num${i === 1 && j === 1 ? ' bold' : ''}`}>{v === null ? 'n/a' : formatMoney(v, cur)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small muted mb-0">A one-point change in the discount rate can move the estimate substantially. Treat any single figure with scepticism.</p>
            </div>
          )}
        </>
      )}
      explain={
        <>
          <p><strong>Multiples:</strong> value per share = EPS × P/E. Enterprise value = EBITDA × EV/EBITDA; equity value = EV − net debt; per share = equity ÷ shares.</p>
          <p><strong>DCF:</strong> FCF grows at your forecast rate; each year’s cash is discounted by (1 + r)<sup>year</sup>. Terminal value = final-year FCF × (1 + g) ÷ (r − g), discounted back. Equity = enterprise value − net debt.</p>
          <p className="mb-0">These are simplified educational models using invented inputs. They ignore many real-world complexities (working capital, changing capital structure, dilution, taxes) and are not reliable price predictions.</p>
        </>
      }
      related={{ href: '/curriculum/valuation', label: 'Valuation and Company Analysis' }}
    />
  )
}

function PortfolioTool() {
  const [weights, setWeights] = useState<Record<string, number>>(PRESETS[3].weights)
  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  const active = BLOCKS.filter((b) => (weights[b.id] ?? 0) > 0)
  const analysis = useMemo(() => {
    if (total <= 0) return null
    const w = active.map((b) => weights[b.id] / total)
    const byClass: Record<string, number> = {}
    const byRegion: Record<string, number> = {}
    active.forEach((b, i) => {
      byClass[b.assetClass] = (byClass[b.assetClass] ?? 0) + w[i] * 100
      for (const [r, p] of Object.entries(b.regions)) byRegion[r] = (byRegion[r] ?? 0) + (w[i] * p)
    })
    const corr = active.map((a) => active.map((b) => correlationFor(a, b)))
    const vol = portfolioVolatility(w, active.map((b) => b.vol), corr)
    const conc = concentration(w)
    const largestRegion = Object.entries(byRegion).sort((a, b) => b[1] - a[1])[0]
    return { byClass, byRegion, vol, conc, largestRegion }
  }, [weights, total, active])
  const set = (id: string, v: number) => setWeights((w) => ({ ...w, [id]: Math.max(0, Math.min(100, Math.round(v))) }))
  return (
    <ToolFrame
      title="Portfolio diversification tool"
      intro="Build a hypothetical portfolio from sample building blocks and see how its allocation, concentration and illustrative volatility change."
      inputs={
        <>
          <div className="stack-sm">
            <span className="field__label">Start from an example</span>
            <div className="cluster-sm">{PRESETS.map((p) => <Button key={p.id} size="sm" onClick={() => setWeights(p.weights)}>{p.name}</Button>)}</div>
          </div>
          <div className="stack-sm">
            {BLOCKS.map((b) => (
              <div key={b.id} className="weight-row">
                <label htmlFor={`w-${b.id}`} className="weight-row__label">{b.name}<span className="tiny muted">{b.assetClass}</span></label>
                <input id={`w-${b.id}`} type="range" min={0} max={100} step={5} value={weights[b.id] ?? 0} onChange={(e) => set(b.id, Number(e.target.value))} aria-valuetext={`${weights[b.id] ?? 0} units`} />
                <span className="weight-row__val tabular">{weights[b.id] ?? 0}</span>
              </div>
            ))}
          </div>
          <p className="small muted mb-0">Weights are relative and normalised to 100%. Total units: {total}. <button type="button" className="link-btn" onClick={() => setWeights({})}>Clear all</button></p>
        </>
      }
      results={!analysis ? <EmptyState title="Add some holdings" mood="think">Move a slider or choose an example to begin.</EmptyState> : (
        <>
          <ResultTiles items={[
            { label: 'Illustrative volatility', value: `${(analysis.vol * 100).toFixed(1)}% a year`, tone: analysis.vol > 0.2 ? 'coral' : analysis.vol > 0.1 ? 'sun' : 'mint', sub: 'From teaching assumptions below' },
            { label: 'Effective number of holdings', value: analysis.conc.effectiveN.toFixed(1), tone: 'violet', sub: `Largest holding ${Math.round(analysis.conc.largest * 100)}%` },
            { label: 'Largest region', value: `${Math.round(analysis.largestRegion[1])}%`, tone: 'sky', sub: analysis.largestRegion[0] },
          ]} />
          {analysis.conc.largest >= 0.5 && <Alert tone="warning">More than half the portfolio is in one building block. {active.find((b) => weights[b.id] / total === analysis.conc.largest)?.id === 'single' ? 'A single company carries company-specific risk that a fund would dilute.' : 'Concentration increases exposure to that one market or asset class.'}</Alert>}
          <div className="grid-2">
            <div className="card"><h3>By asset class</h3><Donut title="Allocation by asset class" slices={Object.entries(analysis.byClass).map(([k, v]) => ({ label: k, value: v }))} /></div>
            <div className="card"><h3>By region (look-through)</h3><Donut title="Allocation by region" slices={Object.entries(analysis.byRegion).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: k, value: v }))} /></div>
          </div>
          <Alert tone="info">Diversification reduces company- and region-specific risk but cannot eliminate market risk. In a broad crisis, many assets can fall together.</Alert>
        </>
      )}
      explain={
        <>
          <p><strong>Effective number of holdings</strong> = 1 ÷ Σw² (the inverse Herfindahl index): 1 means everything is in one block; equal weights in four blocks give 4. Region figures “look through” each block using an illustrative regional mix.</p>
          <p><strong>Illustrative volatility</strong> uses σ<sub>p</sub> = √(Σ Σ w<sub>i</sub> w<sub>j</sub> σ<sub>i</sub> σ<sub>j</sub> ρ<sub>ij</sub>). The volatilities and correlations are rounded <strong>teaching assumptions</strong>, not measurements or forecasts:</p>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th scope="col">Building block</th><th scope="col">Asset class</th><th scope="col" className="num">Assumed volatility</th></tr></thead>
              <tbody>{BLOCKS.map((b) => <tr key={b.id}><td>{b.name}</td><td>{b.assetClass}</td><td className="num">{(b.vol * 100).toFixed(1)}%</td></tr>)}</tbody>
            </table>
          </div>
          <p className="small muted mb-0">Correlations assumed: developed-market shares with each other 0.9, with emerging markets 0.75, with government bonds 0.0, with corporate bonds 0.45, with property 0.7, with gold 0.1; cash is uncorrelated. Real correlations change over time and tend to rise in crises.</p>
        </>
      }
      related={{ href: '/curriculum/etfs-and-portfolios', label: 'ETFs, Index Funds and Portfolio Construction' }}
    />
  )
}

export function ToolPage() {
  const { toolId = '' } = useParams()
  const tool = TOOLS.find((t) => t.id === toolId)
  useMeta(tool?.title ?? 'Finance tool', { description: tool?.body })
  switch (toolId) {
    case 'compound-interest': return <CompoundTool />
    case 'inflation': return <InflationTool />
    case 'stock-return': return <StockReturnTool />
    case 'dividends': return <DividendTool />
    case 'valuation': return <ValuationTool />
    case 'portfolio': return <PortfolioTool />
    default:
      return <div className="container page"><EmptyState title="Tool not found" action={<LinkButton to="/tools" variant="primary">All tools</LinkButton>} /></div>
  }
}

