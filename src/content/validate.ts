import type { Course, Question } from './types'
import { getLineDataset, getOhlcDataset } from '../data/datasets'
import { REFERS_TO_MATERIAL } from './builders'

/** Wording that points at something the learner may not be able to see. */
const DEPENDS_ON_ELSEWHERE = /\b(previous question|same figures|same company|that candle)\b/i

/** Returns a list of human-readable problems with the curriculum (empty = valid). */
export function validateCurriculum(courses: Course[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const seen = (id: string, where: string) => {
    if (ids.has(id)) errors.push(`Duplicate id ${id} (${where})`)
    ids.add(id)
  }
  const checkQ = (q: Question, where: string) => {
    seen(q.id, where)
    if (!q.prompt.trim()) errors.push(`${q.id}: empty prompt`)
    if (q.explanation.trim().length < 8) errors.push(`${q.id}: explanation too short`)
    if (!q.concept) errors.push(`${q.id}: missing concept`)
    const wording = `${q.scenario ?? ''} ${q.prompt}`
    if (REFERS_TO_MATERIAL.test(q.prompt) && !q.context) errors.push(`${q.id}: refers to lesson material but carries none (add context)`)
    if (DEPENDS_ON_ELSEWHERE.test(q.prompt) && !q.scenario) errors.push(`${q.id}: depends on another question; restate the figures in a scenario`)
    if (q.context && /\babove\b/i.test(wording)) errors.push(`${q.id}: the material is shown with the question, so don’t say “above”`)
    switch (q.kind) {
      case 'mcq':
      case 'tf':
        if (q.options.length < 2) errors.push(`${q.id}: needs 2+ options`)
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`${q.id}: answer out of range`)
        if (new Set(q.options).size !== q.options.length) errors.push(`${q.id}: duplicate options`)
        break
      case 'multi':
        if (!q.answer.length) errors.push(`${q.id}: multi needs at least one answer`)
        if (q.answer.some((a) => a < 0 || a >= q.options.length)) errors.push(`${q.id}: answer out of range`)
        if (new Set(q.answer).size !== q.answer.length) errors.push(`${q.id}: duplicate answers`)
        break
      case 'numeric':
        if (!Number.isFinite(q.answer) || !Number.isFinite(q.tolerance) || q.tolerance < 0) errors.push(`${q.id}: bad numeric answer`)
        break
      case 'match':
        if (q.left.length < 2 || q.left.length !== q.right.length) errors.push(`${q.id}: match needs 2+ equal pairs`)
        if (new Set(q.left).size !== q.left.length) errors.push(`${q.id}: duplicate left-hand items`)
        break
      case 'order':
        if (q.items.length < 2) errors.push(`${q.id}: order needs 2+ items`)
        if (new Set(q.items).size !== q.items.length) errors.push(`${q.id}: duplicate items`)
        break
    }
  }
  for (const c of courses) {
    seen(c.id, 'course')
    if (c.passMark <= 0 || c.passMark > 1) errors.push(`${c.id}: invalid pass mark`)
    if (c.outcomes.length < 2) errors.push(`${c.id}: needs outcomes`)
    for (const u of c.units) {
      seen(u.id, 'unit')
      if (u.lessons.length < 2) errors.push(`${u.id}: needs 2+ lessons`)
      for (const l of u.lessons) {
        seen(l.id, 'lesson')
        const qs = l.steps.filter((s) => s.kind === 'question')
        if (qs.length < 3) errors.push(`${l.id}: needs 3+ questions`)
        if (!l.objectives.length) errors.push(`${l.id}: needs objectives`)
        if (!l.tags.length) errors.push(`${l.id}: needs tags`)
        if (!l.steps.some((s) => s.kind === 'recap')) errors.push(`${l.id}: needs a recap`)
        const last = qs[qs.length - 1]
        if (!last || last.kind !== 'question' || !last.question.final) errors.push(`${l.id}: last question must be the final challenge`)
        for (const s of l.steps) {
          if (s.kind === 'question') checkQ(s.question, l.id)
          if (s.kind === 'diagram' && (s.diagram.type === 'line') && !getLineDataset(s.diagram.datasetId)) errors.push(`${l.id}: unknown dataset ${s.diagram.datasetId}`)
          if (s.kind === 'diagram' && (s.diagram.type === 'candles') && !getOhlcDataset(s.diagram.datasetId)) errors.push(`${l.id}: unknown dataset ${s.diagram.datasetId}`)
        }
      }
      seen(u.checkpoint.id, 'checkpoint')
      if (u.checkpoint.questions.length < 5) errors.push(`${u.checkpoint.id}: needs 5+ questions`)
      u.checkpoint.questions.forEach((q) => checkQ(q, u.checkpoint.id))
    }
    seen(c.exam.id, 'exam')
    if (c.exam.questions.length < 12) errors.push(`${c.exam.id}: needs 12+ questions`)
    c.exam.questions.forEach((q) => checkQ(q, c.exam.id))
  }
  return errors
}
