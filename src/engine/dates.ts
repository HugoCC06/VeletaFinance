/**
 * Calendar-day helpers. Days are ISO strings (YYYY-MM-DD) in the learner's
 * time zone. Arithmetic is done on UTC midnights so daylight-saving changes
 * never create 23- or 25-hour "days".
 */
export type Day = string

export function dayInTimeZone(date: Date, timeZone: string): Day {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  } catch {
    return date.toISOString().slice(0, 10)
  }
}

export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

function toUtc(day: Day): number {
  const [y, m, d] = day.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export function addDays(day: Day, n: number): Day {
  return new Date(toUtc(day) + n * 86_400_000).toISOString().slice(0, 10)
}

/** Whole days from a to b (b - a). */
export function daysBetween(a: Day, b: Day): number {
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000)
}

/** Monday of the ISO week containing `day`. */
export function weekStart(day: Day): Day {
  const dow = new Date(toUtc(day)).getUTCDay() // 0 = Sunday
  return addDays(day, -((dow + 6) % 7))
}

export function isValidDay(day: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(toUtc(day)) && new Date(toUtc(day)).toISOString().startsWith(day)
}
