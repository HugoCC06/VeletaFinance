import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LINE_DATASETS, OHLC_DATASETS, filterRange, maxDrawdown, toPercentChange } from '../../data/datasets'
import { CASE_STUDIES, CASE_STUDIES_WRITTEN } from '../../data/caseStudies'
import { LineChart } from '../../charts/LineChart'
import { CandleChart } from '../../charts/CandleChart'
import { DatasetBadge } from '../../charts/Diagram'
import { compact } from '../../charts/scale'
import { SelectField } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Alert } from '../../components/ui'
import { useMeta } from '../../lib/useMeta'

export function Charts() {
  useMeta('Charts & case studies', { description: 'Interactive, clearly labelled educational charts and qualitative case studies of well-known UK and US companies.' })
  const [dsId, setDsId] = useState('synthetic-two-stocks')
  const ds = LINE_DATASETS.find((d) => d.id === dsId)!
  const xs = ds.series.flatMap((s) => s.points.map((p) => p[0]))
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const [range, setRange] = useState<[number, number] | null>(null)
  const [from, to] = range && range[0] >= minX && range[1] <= maxX ? range : [minX, maxX]
  const [view, setView] = useState<'value' | 'pct'>('value')
  const [hidden, setHidden] = useState<string[]>([])
  const [sma, setSma] = useState(true)
  const [days, setDays] = useState(60)
  const series = useMemo(
    () => ds.series.filter((s) => !hidden.includes(s.id)).map((s) => {
      const pts = filterRange(s.points, from, to)
      return { ...s, points: view === 'pct' ? toPercentChange(pts) : pts }
    }),
    [ds, hidden, from, to, view],
  )
  const money = ds.unit === '£' || ds.unit === '$'
  const step = ds.xType === 'maturity' ? 0.25 : (maxX - minX) / 40 || 1
  const candles = OHLC_DATASETS[0]

  return (
    <div className="container page">
      <header className="page-header">
        <span className="eyebrow">Explore</span>
        <h1>Charts &amp; case studies</h1>
        <p>Practise reading charts and analysing businesses. Veleta doesn’t yet include licensed historical market data, so every chart here is <strong>synthetic</strong> (randomly generated) or <strong>illustrative</strong> (calculated from stated assumptions) — and labelled as such.</p>
      </header>

      <section className="card stack" aria-labelledby="line-h">
        <div className="spread">
          <h2 id="line-h" className="mb-0">Line chart explorer</h2>
          <DatasetBadge kind={ds.kind} />
        </div>
        <div className="grid-3">
          <SelectField label="Dataset" value={dsId} onChange={(v) => { setDsId(v); setRange(null); setHidden([]) }} options={LINE_DATASETS.map((d) => ({ value: d.id, label: d.title }))} />
          <SelectField label="View" value={view} onChange={(v) => setView(v as 'value' | 'pct')} options={[{ value: 'value', label: `Value (${ds.unit})` }, { value: 'pct', label: 'Percentage change from start' }]} />
          {ds.series.length > 1 && (
            <fieldset className="fieldset">
              <legend className="field__label">Series</legend>
              <div className="cluster-sm">
                {ds.series.map((s) => (
                  <label key={s.id} className="check small">
                    <input type="checkbox" checked={!hidden.includes(s.id)} onChange={() => setHidden((h) => (h.includes(s.id) ? h.filter((x) => x !== s.id) : [...h, s.id]))} />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
        <div className="range-row">
          <label className="field__label" htmlFor="from">From {ds.xLabel.toLowerCase()} {from}</label>
          <input id="from" type="range" min={minX} max={maxX} step={step} value={from} onChange={(e) => setRange([Math.min(Number(e.target.value), to - step), to])} />
          <label className="field__label" htmlFor="to">To {to}</label>
          <input id="to" type="range" min={minX} max={maxX} step={step} value={to} onChange={(e) => setRange([from, Math.max(Number(e.target.value), from + step)])} />
        </div>
        {series.length === 0 ? <Alert tone="info">Select at least one series.</Alert> : (
          <LineChart
            title={ds.title}
            series={series}
            xLabel={ds.xLabel}
            events={ds.events}
            baseline={view === 'pct' ? 0 : undefined}
            formatX={(x) => (ds.xType === 'maturity' ? `${x}y` : String(Math.round(x * 10) / 10))}
            formatY={(v) => (view === 'pct' ? `${v.toFixed(0)}%` : money ? `${ds.unit}${compact(v)}` : ds.unit === '%' ? `${v.toFixed(1)}%` : compact(v))}
          />
        )}
        {ds.kind === 'synthetic' && series.length > 0 && view === 'value' && (
          <div className="cluster-sm">
            {series.map((s) => <span key={s.id} className="pill">{s.label}: largest fall from a peak {Math.round(maxDrawdown(s.points.map((p) => p[1])) * -100)}%</span>)}
          </div>
        )}
        <dl className="dataset-meta small">
          <dt>Description</dt><dd>{ds.description}</dd>
          <dt>Frequency</dt><dd>{ds.frequency}</dd>
          <dt>Units</dt><dd>{ds.unit}{ds.currency ? ` (${ds.currency})` : ''}</dd>
          <dt>Provenance</dt><dd>{ds.provenance}</dd>
          <dt>Limitations</dt><dd>{ds.limitations}</dd>
        </dl>
      </section>

      <section className="card stack mt-6" aria-labelledby="candle-h">
        <div className="spread">
          <h2 id="candle-h" className="mb-0">Candlestick chart</h2>
          <DatasetBadge kind={candles.kind} />
        </div>
        <div className="cluster">
          <label className="check"><input type="checkbox" checked={sma} onChange={(e) => setSma(e.target.checked)} />Show 10-period moving average</label>
          <SelectField label="Days shown" value={String(days)} onChange={(v) => setDays(Number(v))} options={[{ value: '20', label: 'Last 20' }, { value: '40', label: 'Last 40' }, { value: '60', label: 'All 60' }]} />
        </div>
        <CandleChart candles={candles.candles.slice(-days)} title={candles.title} unit={candles.unit} sma={sma ? 10 : 0} />
        <p className="small muted mb-0">{candles.limitations} Learn to read these in <Link to="/curriculum/trading-and-psychology">Trading, Technical Analysis and Investor Psychology</Link>.</p>
      </section>

      <section className="mt-8" aria-labelledby="cases-h">
        <h2 id="cases-h">Company case studies</h2>
        <p className="muted">Qualitative overviews of well-known UK and US companies, written in {CASE_STUDIES_WRITTEN} from the companies’ own public descriptions. They contain no reported figures — each one shows you where to find them.</p>
        <div className="grid-auto">
          {CASE_STUDIES.map((c) => (
            <Link key={c.id} to={`/charts/case/${c.id}`} className="card card--interactive stack-sm">
              <div className="cluster-sm"><span className="pill">{c.market}</span><span className="pill pill--violet">{c.ticker}</span></div>
              <h3 className="mb-0">{c.company}</h3>
              <span className="subtle">{c.sector} · {c.exchange}</span>
              <p className="small muted mb-0">{c.summary}</p>
              <span className="small bold">Read case study <Icon name="arrowRight" size={14} /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
