import type { ReactElement } from 'react'
import { compact, linear, niceTicks, TONE_COLOURS } from './scale'
import { useWidth } from './useWidth'

export interface Bar { label: string; value: number; tone?: string; segments?: { value: number; tone: string; label: string }[] }

export function BarChart({ bars, title, unit = '', height = 220, formatValue }: { bars: Bar[]; title: string; unit?: string; height?: number; formatValue?: (v: number) => string }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const fmt = formatValue ?? ((v: number) => (unit === '£' || unit === '$' ? `${unit}${compact(v)}` : `${compact(v)}${unit && unit !== '£m' ? (unit === '%' ? '%' : ` ${unit}`) : unit === '£m' ? 'm' : ''}`))
  const max = Math.max(...bars.map((b) => b.value), 0)
  const min = Math.min(...bars.map((b) => b.value), 0)
  const ticks = niceTicks(min, max, 4)
  const pad = { l: 8, r: 8, t: 26, b: 40 }
  const sy = linear(ticks[0], ticks[ticks.length - 1], height - pad.b, pad.t)
  const slot = (width - pad.l - pad.r) / Math.max(1, bars.length)
  const bw = Math.min(72, slot * 0.6)
  return (
    <figure className="chart" ref={ref}>
      <svg width={width} height={height} role="img" aria-label={`${title}: ${bars.map((b) => `${b.label} ${fmt(b.value)}`).join(', ')}`}>
        <line x1={pad.l} x2={width - pad.r} y1={sy(0)} y2={sy(0)} stroke="#C4C2D8" strokeWidth={2} />
        {bars.map((b, i) => {
          const x = pad.l + slot * i + (slot - bw) / 2
          const y = sy(Math.max(0, b.value))
          const h = Math.abs(sy(b.value) - sy(0))
          return (
            <g key={b.label}>
              {b.segments ? (
                b.segments.reduce<{ acc: number; els: ReactElement[] }>((s, seg, si) => {
                  const top = sy(s.acc + seg.value)
                  s.els.push(<rect key={si} x={x} y={top} width={bw} height={sy(s.acc) - top} rx={si === b.segments!.length - 1 ? 8 : 0} fill={TONE_COLOURS[seg.tone]} />)
                  s.acc += seg.value
                  return s
                }, { acc: 0, els: [] }).els
              ) : (
                <rect x={x} y={y} width={bw} height={Math.max(2, h)} rx={8} fill={TONE_COLOURS[b.tone ?? 'violet'] ?? b.tone} />
              )}
              <text x={x + bw / 2} y={(b.value >= 0 ? y : sy(b.value)) - 8 + (b.value < 0 ? h + 22 : 0)} textAnchor="middle" className="chart__value">{fmt(b.value)}</text>
              <text x={x + bw / 2} y={height - pad.b + 20} textAnchor="middle" className="chart__tick">{b.label.length > 16 && slot < 110 ? `${b.label.slice(0, 14)}…` : b.label}</text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
