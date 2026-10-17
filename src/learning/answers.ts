import type { AnswerValue, Question } from '../content/types'
import { matchKey, parseNumberInput, seededOrder } from '../engine/grading'
import { formatNumber } from '../lib/format'

/** What the learner has entered so far, before it is normalised for grading. */
export type RawAnswer = number | null | number[] | string | (number | null)[]

export function initialRaw(q: Question, seed = ''): RawAnswer {
  switch (q.kind) {
    case 'mcq':
    case 'tf':
      return null
    case 'multi':
      return []
    case 'numeric':
      return ''
    case 'match':
      return q.left.map(() => null)
    case 'order': {
      // Start from a shuffled order that is never already correct.
      let o = seededOrder(q.items.length, `${q.id}:${seed}`)
      if (o.every((v, i) => v === i)) o = [...o.slice(1), o[0]]
      return o
    }
  }
}

export function isAnswered(q: Question, raw: RawAnswer): boolean {
  switch (q.kind) {
    case 'mcq':
    case 'tf':
      return typeof raw === 'number'
    case 'multi':
      return Array.isArray(raw) && raw.length > 0
    case 'numeric':
      return typeof raw === 'string' && parseNumberInput(raw) !== null
    case 'match':
      return Array.isArray(raw) && raw.every((v) => typeof v === 'number')
    case 'order':
      return Array.isArray(raw)
  }
}

export function normalise(q: Question, raw: RawAnswer): AnswerValue | null {
  if (!isAnswered(q, raw)) return null
  switch (q.kind) {
    case 'numeric':
      return parseNumberInput(raw as string)
    case 'multi':
      return [...(raw as number[])].sort((a, b) => a - b)
    default:
      return raw as AnswerValue
  }
}

export function formatNumeric(q: Extract<Question, { kind: 'numeric' }>, n: number): string {
  const money = q.prefix === '£' || q.prefix === '$' || q.prefix === '€'
  const digits = Number.isInteger(n) ? 0 : money ? 2 : Math.min(2, (String(n).split('.')[1] ?? '').length)
  const body = formatNumber(n, digits)
  const suffix = q.suffix ? (q.suffix.length <= 2 && !/^[a-z]/i.test(q.suffix) ? q.suffix : ` ${q.suffix}`) : ''
  return `${q.prefix ?? ''}${body}${suffix}`
}

/** Human-readable correct answer, shown after a miss and in reviews. */
export function describeCorrect(q: Question): string {
  switch (q.kind) {
    case 'mcq':
    case 'tf':
      return q.options[q.answer]
    case 'multi':
      return q.answer.map((i) => q.options[i]).join('; ')
    case 'numeric':
      return formatNumeric(q, q.answer)
    case 'match':
      return q.left.map((l, i) => `${l} → ${q.right[i]}`).join('; ')
    case 'order':
      return q.items.join(' → ')
  }
}

export function describeGiven(q: Question, a: AnswerValue | null | undefined): string {
  if (a === null || a === undefined) return 'No answer'
  switch (q.kind) {
    case 'mcq':
    case 'tf':
      return q.options[a as number] ?? 'No answer'
    case 'multi':
      return (a as number[]).map((i) => q.options[i]).join('; ')
    case 'numeric':
      return formatNumeric(q, a as number)
    case 'match':
      return q.left.map((l, i) => `${l} → ${q.right[(a as number[])[i]] ?? '?'}`).join('; ')
    case 'order':
      return (a as number[]).map((i) => q.items[i]).join(' → ')
  }
}

/** Distinct right-hand options for a match question (first index of each text). */
export function matchOptions(q: Extract<Question, { kind: 'match' }>, seed = ''): { value: number; label: string }[] {
  const firsts = [...new Set(matchKey(q.right))]
  return seededOrder(firsts.length, `${q.id}:${seed}:r`).map((i) => ({ value: firsts[i], label: q.right[firsts[i]] }))
}
