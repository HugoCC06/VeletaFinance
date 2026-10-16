import type { AnswerValue, Question } from '../content/types'

const sameArray = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i])
const identity = (n: number) => Array.from({ length: n }, (_, i) => i)

/** Returns true when `answer` is correct for `q`. Mirrors veleta_private.grade() in SQL. */
export function gradeAnswer(q: Question, answer: AnswerValue | null | undefined): boolean {
  if (answer === null || answer === undefined) return false
  switch (q.kind) {
    case 'mcq':
    case 'tf':
      return typeof answer === 'number' && answer === q.answer
    case 'multi':
      return Array.isArray(answer) && sameArray([...answer].sort((a, b) => a - b), q.answer)
    case 'numeric':
      return typeof answer === 'number' && Number.isFinite(answer) && Math.abs(answer - q.answer) <= q.tolerance + 1e-9
    case 'match':
      return Array.isArray(answer) && sameArray(answer, matchKey(q.right))
    case 'order':
      return Array.isArray(answer) && sameArray(answer, identity(q.items.length))
  }
}

/**
 * Canonical match answer: for each left item, the index of the FIRST right-hand
 * item with the correct text. This lets one category (e.g. "Asset") be the
 * right answer for several left items; the UI shows each distinct right-hand
 * text once and reports that first index.
 */
export function matchKey(right: string[]): number[] {
  return right.map((r) => right.indexOf(r))
}

/** The canonical correct answer, used to show the solution after a miss. */
export function correctAnswer(q: Question): AnswerValue {
  switch (q.kind) {
    case 'mcq':
    case 'tf':
    case 'multi':
    case 'numeric':
      return q.answer
    case 'match':
      return matchKey(q.right)
    case 'order':
      return identity(q.items.length)
  }
}

/** Parses a learner's typed number: accepts commas, currency symbols, % and k/m suffixes. */
export function parseNumberInput(raw: string): number | null {
  let s = raw.trim().toLowerCase().replace(/[£$€,\s]/g, '').replace(/%$/, '')
  if (!s) return null
  let mult = 1
  if (s.endsWith('k')) { mult = 1e3; s = s.slice(0, -1) }
  else if (s.endsWith('m')) { mult = 1e6; s = s.slice(0, -1) }
  else if (s.endsWith('bn')) { mult = 1e9; s = s.slice(0, -2) }
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return null
  const n = Number(s) * mult
  return Number.isFinite(n) ? n : null
}

export interface ScoreSummary {
  correct: number
  total: number
  score: number // 0..1
  results: Record<string, boolean>
}

export function scoreAnswers(questions: Question[], answers: Record<string, AnswerValue | undefined>): ScoreSummary {
  const results: Record<string, boolean> = {}
  let correct = 0
  for (const q of questions) {
    const ok = gradeAnswer(q, answers[q.id])
    results[q.id] = ok
    if (ok) correct++
  }
  return { correct, total: questions.length, score: questions.length ? correct / questions.length : 0, results }
}

/** Deterministic pseudo-random permutation, so option order is stable per question. */
export function seededOrder(n: number, seed: string): number[] {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  const rand = () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const arr = identity(n)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
