import type { Diagram as DiagramSpec } from '../content/types'
import { getLineDataset, getOhlcDataset } from '../data/datasets'
import { BarChart } from './BarChart'
import { CandleChart } from './CandleChart'
import { Donut } from './Donut'
import { LineChart } from './LineChart'
import { compact, TONE_COLOURS, TONE_SOFT } from './scale'
import { Icon } from '../components/Icon'

export function DatasetBadge({ kind }: { kind: 'synthetic' | 'illustrative' | 'historical' }) {
  if (kind === 'historical') return <span className="pill pill--sky">Historical data</span>
  return (
    <span className={`pill ${kind === 'synthetic' ? 'pill--coral' : 'pill--sun'}`} title={kind === 'synthetic' ? 'Randomly generated — not real market history' : 'Calculated from stated assumptions — not real market data'}>
      <Icon name="info" size={14} />
      {kind === 'synthetic' ? 'Synthetic data — not real market history' : 'Illustrative calculation'}
    </span>
  )
}

export function Diagram({ spec, title }: { spec: DiagramSpec; title: string }) {
  switch (spec.type) {
    case 'bars':
      return <BarChart bars={spec.bars} title={title} unit={spec.unit} />
    case 'donut':
      return <Donut slices={spec.slices} title={title} centre={spec.centre} />
    case 'line': {
      const d = getLineDataset(spec.datasetId)
      if (!d) return null
      const series = spec.seriesIds ? d.series.filter((s) => spec.seriesIds!.includes(s.id)) : d.series
      const money = d.unit === '£' || d.unit === '$'
      return (
        <div className="stack-sm">
          <DatasetBadge kind={d.kind} />
          <LineChart series={series} title={d.title} xLabel={d.xLabel} events={d.events} formatY={(v) => (money ? `${d.unit}${compact(v)}` : d.unit === '%' ? `${v.toFixed(1)}%` : compact(v))} formatX={(x) => (d.xType === 'maturity' ? `${x}y` : String(Math.round(x * 10) / 10))} />
        </div>
      )
    }
    case 'candles': {
      const d = getOhlcDataset(spec.datasetId)
      if (!d) return null
      return (
        <div className="stack-sm">
          <DatasetBadge kind={d.kind} />
          <CandleChart candles={d.candles} title={d.title} unit={d.unit} sma={spec.overlay === 'sma' ? 10 : 0} />
        </div>
      )
    }
    case 'flow':
      return (
        <ol className="flow" aria-label={title}>
          {spec.nodes.map((n, i) => (
            <li key={i} className="flow__node" style={{ background: TONE_SOFT[n.tone ?? 'violet'], borderColor: TONE_COLOURS[n.tone ?? 'violet'] }}>
              <span className="flow__label">{n.label}</span>
              {n.sub && <span className="flow__sub">{n.sub}</span>}
            </li>
          ))}
        </ol>
      )
    case 'compare':
      return (
        <div className="compare">
          {spec.columns.map((c) => (
            <div key={c.title} className="compare__col" style={{ borderColor: TONE_COLOURS[c.tone ?? 'violet'], background: TONE_SOFT[c.tone ?? 'violet'] }}>
              <h4>{c.title}</h4>
              <ul>{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      )
    case 'stack': {
      const total = Math.max(spec.left.items.reduce((n, i) => n + i.value, 0), spec.right.items.reduce((n, i) => n + i.value, 0))
      const col = (side: typeof spec.left) => (
        <div className="stack-diagram__col">
          <div className="stack-diagram__title">{side.title}</div>
          <div className="stack-diagram__bar">
            {side.items.map((it) => (
              <div key={it.label} className="stack-diagram__block" style={{ flexGrow: it.value / total, background: TONE_SOFT[it.tone ?? 'violet'], borderColor: TONE_COLOURS[it.tone ?? 'violet'] }}>
                <span>{it.label}</span>
                <strong>{compact(it.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      )
      return (
        <div className="stack-diagram" role="group" aria-label={title}>
          {col(spec.left)}
          <div className="stack-diagram__equals" aria-hidden="true">=</div>
          {col(spec.right)}
        </div>
      )
    }
    case 'scale':
      return (
        <div className="scale-diagram" role="group" aria-label={title}>
          <div className="scale-diagram__track">
            {spec.items.map((it) => (
              <div key={it.label} className="scale-diagram__item" style={{ left: `${it.position}%` }}>
                <span className="scale-diagram__dot" style={{ background: TONE_COLOURS[it.tone ?? 'violet'] }} />
                <span className="scale-diagram__label">{it.label}</span>
              </div>
            ))}
          </div>
          <div className="spread small muted"><span>← {spec.left}</span><span>{spec.right} →</span></div>
          <ul className="sr-only">{spec.items.map((it) => <li key={it.label}>{it.label}: position {it.position} of 100</li>)}</ul>
        </div>
      )
    case 'ladder':
      return (
        <div className="table-wrap ladder">
          <table className="table">
            <caption className="sr-only">{title}</caption>
            <thead><tr><th scope="col">Side</th><th scope="col" className="num">Price</th><th scope="col" className="num">Shares</th></tr></thead>
            <tbody>
              {[...spec.asks].reverse().map(([p, q]) => <tr key={`a${p}`} className="ladder__ask"><td>Ask (sellers)</td><td className="num">{p}{spec.currency}</td><td className="num">{q.toLocaleString('en-GB')}</td></tr>)}
              {spec.bids.map(([p, q]) => <tr key={`b${p}`} className="ladder__bid"><td>Bid (buyers)</td><td className="num">{p}{spec.currency}</td><td className="num">{q.toLocaleString('en-GB')}</td></tr>)}
            </tbody>
          </table>
        </div>
      )
  }
}
