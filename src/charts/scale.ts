/** Small helpers for building SVG charts without a charting dependency. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0]
  if (min === max) {
    const pad = Math.abs(min) * 0.1 || 1
    min -= pad
    max += pad
  }
  const span = max - min
  const step0 = span / Math.max(1, count)
  const mag = 10 ** Math.floor(Math.log10(step0))
  const norm = step0 / mag
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag
  const start = Math.floor(min / step) * step
  const ticks: number[] = []
  for (let v = start; v <= max + step * 0.5; v += step) ticks.push(Number(v.toFixed(10)))
  return ticks
}

export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) => (d1 === d0 ? (r0 + r1) / 2 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0))

export function compact(n: number): string {
  const a = Math.abs(n)
  if (a >= 1e9) return `${(n / 1e9).toFixed(1).replace(/\.0$/, '')}bn`
  if (a >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}m`
  if (a >= 1e4) return `${(n / 1e3).toFixed(0)}k`
  if (a >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}k`
  if (a < 10 && a !== 0 && !Number.isInteger(n)) return n.toFixed(2)
  return String(Math.round(n * 10) / 10)
}

export const TONE_COLOURS: Record<string, string> = {
  violet: '#6B4EFF',
  mint: '#12A375',
  sun: '#F5B01B',
  coral: '#E0444A',
  sky: '#1A7FE0',
  ink: '#3D3A58',
  grey: '#9592B0',
}
export const TONE_SOFT: Record<string, string> = {
  violet: '#ECE8FF',
  mint: '#D4F6E8',
  sun: '#FFF1C7',
  coral: '#FFE1E2',
  sky: '#DBECFF',
  ink: '#E2E0EE',
  grey: '#EFEEF6',
}
