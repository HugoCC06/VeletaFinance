import { TONE_COLOURS } from './scale'

export interface Slice { label: string; value: number; tone?: string }

const DEFAULT_TONES = ['violet', 'mint', 'sky', 'sun', 'coral', 'ink', 'grey']

export function Donut({ slices, title, centre, size = 200, formatValue = (v: number, total: number) => `${((v / total) * 100).toFixed(0)}%` }: { slices: Slice[]; title: string; centre?: string; size?: number; formatValue?: (v: number, total: number) => string }) {
  const total = slices.reduce((n, s) => n + Math.max(0, s.value), 0)
  const r = size / 2 - 14
  const c = 2 * Math.PI * r
  let acc = 0
  return (
    <figure className="donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${title}: ${slices.map((s) => `${s.label} ${total ? formatValue(s.value, total) : '0%'}`).join(', ')}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFEEF6" strokeWidth={24} />
        {total > 0 && slices.map((s, i) => {
          const frac = Math.max(0, s.value) / total
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={TONE_COLOURS[s.tone ?? DEFAULT_TONES[i % DEFAULT_TONES.length]]}
              strokeWidth={24}
              strokeDasharray={`${Math.max(0, frac * c - 2)} ${c}`}
              strokeDashoffset={-acc * c}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )
          acc += frac
          return el
        })}
        {centre && <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="donut__centre">{centre}</text>}
      </svg>
      <figcaption className="donut__legend">
        {slices.map((s, i) => (
          <span key={s.label} className="chart__legend-item">
            <i style={{ background: TONE_COLOURS[s.tone ?? DEFAULT_TONES[i % DEFAULT_TONES.length]] }} />
            {s.label} <strong>{total ? formatValue(s.value, total) : '0%'}</strong>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
