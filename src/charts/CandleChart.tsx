import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { simpleMovingAverage, type Candle } from '../data/datasets'
import { linear, niceTicks } from './scale'
import { useWidth } from './useWidth'

export function CandleChart({ candles, title, unit = '', sma = 0, height = 300 }: { candles: Candle[]; title: string; unit?: string; sma?: number; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [cursor, setCursor] = useState<number | null>(null)
  const pad = { l: 48, r: 12, t: 12, b: 70 }
  const volH = 44
  const priceBottom = height - pad.b
  const lows = candles.map((c) => c.l)
  const highs = candles.map((c) => c.h)
  const ticks = niceTicks(Math.min(...lows), Math.max(...highs), 5)
  const sy = linear(ticks[0], ticks[ticks.length - 1], priceBottom, pad.t)
  const slot = (width - pad.l - pad.r) / candles.length
  const bw = Math.max(2, Math.min(12, slot * 0.65))
  const maxV = Math.max(...candles.map((c) => c.v))
  const smaVals = sma > 0 ? simpleMovingAverage(candles.map((c) => c.c), sma) : []
  const cxAt = (i: number) => pad.l + slot * i + slot / 2
  const onPointer = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width
    setCursor(Math.max(0, Math.min(candles.length - 1, Math.floor((x - pad.l) / slot))))
  }
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setCursor((c) => Math.min(candles.length - 1, (c ?? -1) + 1)) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setCursor((c) => Math.max(0, (c ?? candles.length) - 1)) }
    if (e.key === 'Escape') setCursor(null)
  }
  const c = cursor !== null ? candles[cursor] : null
  return (
    <figure className="chart" ref={ref}>
      <svg width={width} height={height} role="img" tabIndex={0} aria-label={`${title}. ${candles.length} candles. Use arrow keys to read open, high, low and close.`}
        onPointerMove={onPointer} onPointerDown={onPointer} onPointerLeave={() => setCursor(null)} onKeyDown={onKey} onBlur={() => setCursor(null)} className="chart__svg">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={width - pad.r} y1={sy(t)} y2={sy(t)} stroke="#E2E0EE" strokeDasharray="3 4" />
            <text x={pad.l - 6} y={sy(t)} textAnchor="end" dominantBaseline="middle" className="chart__tick">{t}{unit}</text>
          </g>
        ))}
        {candles.map((k, i) => {
          const up = k.c >= k.o
          const col = up ? '#12A375' : '#E0444A'
          const top = sy(Math.max(k.o, k.c))
          const vh = (k.v / maxV) * volH
          return (
            <g key={k.t}>
              <line x1={cxAt(i)} x2={cxAt(i)} y1={sy(k.h)} y2={sy(k.l)} stroke={col} strokeWidth={1.5} />
              <rect x={cxAt(i) - bw / 2} y={top} width={bw} height={Math.max(1.5, sy(Math.min(k.o, k.c)) - top)} fill={up ? col : '#fff'} stroke={col} strokeWidth={1.5} rx={1.5} />
              <rect x={cxAt(i) - bw / 2} y={height - 18 - vh} width={bw} height={vh} fill={col} opacity={0.35} />
            </g>
          )
        })}
        {sma > 0 && (
          <path d={smaVals.map((v, i) => (v === null ? '' : `${smaVals[i - 1] == null ? 'M' : 'L'}${cxAt(i).toFixed(1)},${sy(v).toFixed(1)}`)).join('')} fill="none" stroke="#6B4EFF" strokeWidth={2.5} />
        )}
        <text x={pad.l} y={height - 4} className="chart__axis-label">Volume</text>
        {cursor !== null && <line x1={cxAt(cursor)} x2={cxAt(cursor)} y1={pad.t} y2={height - 18} stroke="#3D3A58" strokeDasharray="2 3" />}
      </svg>
      {c && (
        <div className="chart__tooltip" role="status" aria-live="polite" style={{ left: Math.min(Math.max(cxAt(cursor!), 90), width - 90) }}>
          <div className="bold">Day {c.t} · {c.c >= c.o ? 'Rising' : 'Falling'} candle</div>
          <div>Open {c.o}{unit} · Close {c.c}{unit}</div>
          <div>High {c.h}{unit} · Low {c.l}{unit}</div>
          <div>Volume {c.v.toLocaleString('en-GB')}</div>
          {sma > 0 && smaVals[cursor!] != null && <div>{sma}-day SMA {smaVals[cursor!]!.toFixed(2)}{unit}</div>}
        </div>
      )}
      <figcaption className="chart__legend">
        <span className="chart__legend-item"><i style={{ background: '#12A375' }} />Rising (filled)</span>
        <span className="chart__legend-item"><i style={{ background: '#fff', border: '2px solid #E0444A' }} />Falling (hollow)</span>
        {sma > 0 && <span className="chart__legend-item"><i style={{ background: '#6B4EFF' }} />{sma}-period moving average</span>}
      </figcaption>
    </figure>
  )
}
