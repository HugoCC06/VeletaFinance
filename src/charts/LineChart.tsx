import { useId, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { compact, linear, niceTicks, TONE_COLOURS } from './scale'
import { useWidth } from './useWidth'

export interface LineSeries {
  id: string
  label: string
  tone: string
  points: [number, number][]
}

interface LineChartProps {
  series: LineSeries[]
  title: string
  xLabel?: string
  yLabel?: string
  height?: number
  formatX?: (x: number) => string
  formatY?: (y: number) => string
  events?: { x: number; label: string }[]
  area?: boolean
  /** Show a horizontal reference line, e.g. 0 in percentage view. */
  baseline?: number
}

/** Accessible multi-series line chart with pointer and keyboard inspection plus a data-table alternative. */
export function LineChart({ series, title, xLabel, yLabel, height = 260, formatX = compact, formatY = compact, events = [], area, baseline }: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [cursor, setCursor] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)
  const tableId = useId()
  const pad = { l: 52, r: 16, t: 14, b: 38 }
  const xs = useMemo(() => [...new Set(series.flatMap((s) => s.points.map((p) => p[0])))].sort((a, b) => a - b), [series])
  const allY = series.flatMap((s) => s.points.map((p) => p[1]))
  const yMin = Math.min(...allY, baseline ?? Infinity)
  const yMax = Math.max(...allY, baseline ?? -Infinity)
  const yTicks = niceTicks(area ? Math.min(0, yMin) : yMin, yMax, 5)
  const x0 = xs[0] ?? 0
  const x1 = xs[xs.length - 1] ?? 1
  const sx = linear(x0, x1, pad.l, width - pad.r)
  const sy = linear(yTicks[0], yTicks[yTicks.length - 1], height - pad.b, pad.t)
  const xTicks = niceTicks(x0, x1, Math.max(2, Math.floor(width / 110))).filter((t) => t >= x0 && t <= x1)

  const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')
  const nearest = (px: number) => {
    let best = 0
    let bd = Infinity
    xs.forEach((x, i) => {
      const d = Math.abs(sx(x) - px)
      if (d < bd) { bd = d; best = i }
    })
    return best
  }
  const onPointer = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCursor(nearest(((e.clientX - rect.left) / rect.width) * width))
  }
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!xs.length) return
    if (e.key === 'ArrowRight') { e.preventDefault(); setCursor((c) => Math.min(xs.length - 1, (c ?? -1) + 1)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setCursor((c) => Math.max(0, (c ?? xs.length) - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); setCursor(0) }
    else if (e.key === 'End') { e.preventDefault(); setCursor(xs.length - 1) }
    else if (e.key === 'Escape') setCursor(null)
  }
  const cx = cursor !== null ? xs[cursor] : null
  const valueAt = (s: LineSeries, x: number) => s.points.find((p) => p[0] === x)?.[1]
  const tableRows = xs.length > 60 ? xs.filter((_, i) => i % Math.ceil(xs.length / 60) === 0 || i === xs.length - 1) : xs

  return (
    <figure className="chart" ref={ref}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`${title}. Use left and right arrow keys to inspect values.`}
        tabIndex={0}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={() => setCursor(null)}
        onKeyDown={onKey}
        onBlur={() => setCursor(null)}
        className="chart__svg"
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={width - pad.r} y1={sy(t)} y2={sy(t)} stroke="#E2E0EE" strokeDasharray={t === 0 ? undefined : '3 4'} />
            <text x={pad.l - 8} y={sy(t)} textAnchor="end" dominantBaseline="middle" className="chart__tick">{formatY(t)}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={sx(t)} y={height - pad.b + 18} textAnchor="middle" className="chart__tick">{formatX(t)}</text>
        ))}
        {xLabel && <text x={(pad.l + width - pad.r) / 2} y={height - 4} textAnchor="middle" className="chart__axis-label">{xLabel}</text>}
        {yLabel && <text x={12} y={pad.t + 4} className="chart__axis-label">{yLabel}</text>}
        {baseline !== undefined && <line x1={pad.l} x2={width - pad.r} y1={sy(baseline)} y2={sy(baseline)} stroke="#67648A" strokeWidth={1.5} />}
        {events.filter((ev) => ev.x >= x0 && ev.x <= x1).map((ev) => (
          <g key={ev.label}>
            <line x1={sx(ev.x)} x2={sx(ev.x)} y1={pad.t} y2={height - pad.b} stroke="#FF7D81" strokeDasharray="4 4" />
            <text x={sx(ev.x) + 4} y={pad.t + 10} className="chart__event">{ev.label}</text>
          </g>
        ))}
        {series.map((s) => (
          <g key={s.id}>
            {area && <path d={`${path(s.points)}L${sx(s.points[s.points.length - 1][0])},${sy(yTicks[0])}L${sx(s.points[0][0])},${sy(yTicks[0])}Z`} fill={TONE_COLOURS[s.tone] ?? s.tone} opacity={0.12} />}
            <path d={path(s.points)} fill="none" stroke={TONE_COLOURS[s.tone] ?? s.tone} strokeWidth={2.75} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))}
        {cx !== null && (
          <g>
            <line x1={sx(cx)} x2={sx(cx)} y1={pad.t} y2={height - pad.b} stroke="#3D3A58" strokeWidth={1} />
            {series.map((s) => {
              const v = valueAt(s, cx)
              return v === undefined ? null : <circle key={s.id} cx={sx(cx)} cy={sy(v)} r={5} fill="#fff" stroke={TONE_COLOURS[s.tone] ?? s.tone} strokeWidth={3} />
            })}
          </g>
        )}
      </svg>
      {cx !== null && (
        <div className="chart__tooltip" role="status" aria-live="polite" style={{ left: Math.min(Math.max(sx(cx), 90), width - 90) }}>
          <div className="bold">{xLabel ? `${xLabel}: ` : ''}{formatX(cx)}</div>
          {series.map((s) => {
            const v = valueAt(s, cx)
            return v === undefined ? null : (
              <div key={s.id} className="chart__tooltip-row"><i style={{ background: TONE_COLOURS[s.tone] ?? s.tone }} />{s.label}: <strong>{formatY(v)}</strong></div>
            )
          })}
        </div>
      )}
      <figcaption className="chart__legend">
        {series.length > 1 && series.map((s) => (
          <span key={s.id} className="chart__legend-item"><i style={{ background: TONE_COLOURS[s.tone] ?? s.tone }} />{s.label}</span>
        ))}
        <button type="button" className="btn btn--ghost btn--sm chart__table-toggle" aria-expanded={showTable} aria-controls={tableId} onClick={() => setShowTable((v) => !v)}>
          {showTable ? 'Hide data table' : 'Show data table'}
        </button>
      </figcaption>
      {showTable && (
        <div className="table-wrap chart__table" id={tableId}>
          <table className="table">
            <caption className="sr-only">{title}</caption>
            <thead><tr><th scope="col">{xLabel ?? 'x'}</th>{series.map((s) => <th key={s.id} scope="col" className="num">{s.label}</th>)}</tr></thead>
            <tbody>
              {tableRows.map((x) => (
                <tr key={x}><th scope="row">{formatX(x)}</th>{series.map((s) => { const v = valueAt(s, x); return <td key={s.id} className="num">{v === undefined ? '—' : formatY(v)}</td> })}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  )
}
