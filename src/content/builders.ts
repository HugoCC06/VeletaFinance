/**
 * Small authoring helpers that keep course files readable. They only build
 * plain objects matching ./types — there is no runtime magic.
 */
import type {
  CalloutVariant,
  ChoiceQuestion,
  Course,
  Diagram,
  Difficulty,
  Lesson,
  MatchQuestion,
  MultiQuestion,
  NumericQuestion,
  OrderQuestion,
  Question,
  QuestionContext,
  Source,
  Step,
  Unit,
} from './types'

type Extra = { scenario?: string; concept?: string; final?: boolean; context?: QuestionContext }
/** A question before its id is namespaced and its concept defaulted. */
export type DraftQuestion = Omit<Question, 'concept'> & { concept?: string }
type DraftStep = Exclude<Step, { kind: 'question' }> | { kind: 'question'; question: DraftQuestion }

export const text = (title: string | undefined, body: string): DraftStep => ({ kind: 'text', title, body })
export const callout = (variant: CalloutVariant, title: string, body: string): DraftStep => ({ kind: 'callout', variant, title, body })
export const key = (title: string, body: string) => callout('key', title, body)
export const example = (title: string, body: string) => callout('example', title, body)
export const warn = (title: string, body: string) => callout('warning', title, body)
export const ukus = (title: string, body: string) => callout('ukus', title, body)
export const analogy = (title: string, body: string) => callout('analogy', title, body)
export const diagram = (d: Diagram, caption?: string, title?: string): DraftStep => ({ kind: 'diagram', diagram: d, caption, title })
export const numbers = (title: string, rows: [string, string][], note?: string): DraftStep => ({ kind: 'numbers', title, rows, note })
export const recap = (...points: string[]): DraftStep => ({ kind: 'recap', points })

const q = (question: DraftQuestion): DraftStep => ({ kind: 'question', question })

export function mcqQ(id: string, prompt: string, options: string[], answer: number, explanation: string, extra: Extra = {}): DraftQuestion {
  return { id, kind: 'mcq', prompt, options, answer, explanation, ...extra } as ChoiceQuestion
}
export function tfQ(id: string, statement: string, isTrue: boolean, explanation: string, extra: Extra = {}): DraftQuestion {
  return { id, kind: 'tf', prompt: statement, options: ['True', 'False'], answer: isTrue ? 0 : 1, explanation, ...extra } as ChoiceQuestion
}
export function multiQ(id: string, prompt: string, options: string[], answer: number[], explanation: string, extra: Extra = {}): DraftQuestion {
  return { id, kind: 'multi', prompt, options, answer: [...answer].sort((a, b) => a - b), explanation, ...extra } as MultiQuestion
}
export function numQ(
  id: string,
  prompt: string,
  answer: number,
  explanation: string,
  opts: { tolerance?: number; prefix?: string; suffix?: string; working?: string } & Extra = {},
): DraftQuestion {
  const { tolerance = 0, prefix, suffix, working, ...extra } = opts
  return { id, kind: 'numeric', prompt, answer, tolerance, prefix, suffix, working, explanation, ...extra } as NumericQuestion
}
export function matchQ(id: string, prompt: string, pairs: [string, string][], explanation: string, extra: Extra = {}): DraftQuestion {
  return { id, kind: 'match', prompt, left: pairs.map((p) => p[0]), right: pairs.map((p) => p[1]), explanation, ...extra } as MatchQuestion
}
export function orderQ(id: string, prompt: string, items: string[], explanation: string, extra: Extra = {}): DraftQuestion {
  return { id, kind: 'order', prompt, items, explanation, ...extra } as OrderQuestion
}

/** Step versions (inline in a lesson). */
export const mcq = (...a: Parameters<typeof mcqQ>) => q(mcqQ(...a))
export const tf = (...a: Parameters<typeof tfQ>) => q(tfQ(...a))
export const multi = (...a: Parameters<typeof multiQ>) => q(multiQ(...a))
export const num = (...a: Parameters<typeof numQ>) => q(numQ(...a))
export const match = (...a: Parameters<typeof matchQ>) => q(matchQ(...a))
export const order = (...a: Parameters<typeof orderQ>) => q(orderQ(...a))

function finishQuestion(prefix: string, defaultConcept: string, d: DraftQuestion): Question {
  return { ...d, id: `${prefix}.${d.id}`, concept: d.concept ?? defaultConcept } as Question
}

/** Wording that means a question depends on lesson material shown earlier. */
export const REFERS_TO_MATERIAL = /(\b(table|chart|diagram|order book|example|payslip|case|figures|data|ask|(fund|portfolio|company) \w+) above\b|\b(using|in|from|based on) the (table|chart|diagram|order book|example|payslip|case|figures|data)\b)/i

/**
 * Lessons show one step at a time, and questions also reappear in revision
 * without their lesson. A lesson question that refers to a table, chart or
 * example therefore carries the nearest earlier one with it.
 */
function withContext(q: DraftQuestion, before: DraftStep[]): DraftQuestion {
  if (q.context || !REFERS_TO_MATERIAL.test(`${q.scenario ?? ''} ${q.prompt}`)) return q
  for (let i = before.length - 1; i >= 0; i--) {
    const s = before[i]
    if (s.kind === 'diagram' || s.kind === 'numbers' || (s.kind === 'callout' && s.variant === 'example')) return { ...q, context: s }
  }
  return q
}

export interface LessonMeta {
  title: string
  description: string
  minutes?: number
  difficulty?: Difficulty
  objectives: string[]
  tags: string[]
  sources?: Source[]
}

export type LessonFactory = (courseId: string, unitId: string, id: string) => Lesson

export function lesson(meta: LessonMeta, steps: DraftStep[]): LessonFactory {
  return (courseId, unitId, id) => ({
    id,
    courseId,
    unitId,
    title: meta.title,
    description: meta.description,
    minutes: meta.minutes ?? 5,
    difficulty: meta.difficulty ?? 1,
    objectives: meta.objectives,
    tags: meta.tags,
    sources: meta.sources,
    steps: steps.map((s, i) => (s.kind === 'question' ? { kind: 'question', question: finishQuestion(id, meta.tags[0], withContext(s.question, steps.slice(0, i))) } : s)),
  })
}

export interface UnitDraft {
  title: string
  description: string
  lessons: LessonFactory[]
  checkpoint: { questions: DraftQuestion[]; passMark?: number; concept: string }
}

export interface CourseDraft {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  colour: string
  icon: string
  outcomes: string[]
  passMark?: number
  units: UnitDraft[]
  exam: { questions: DraftQuestion[]; concept: string }
}

export function course(d: CourseDraft): Course {
  const passMark = d.passMark ?? 0.8
  const units: Unit[] = d.units.map((u, ui) => {
    const unitId = `${d.id}-u${ui + 1}`
    const cpId = `${unitId}-cp`
    return {
      id: unitId,
      courseId: d.id,
      title: u.title,
      description: u.description,
      lessons: u.lessons.map((f, li) => f(d.id, unitId, `${unitId}-l${li + 1}`)),
      checkpoint: {
        id: cpId,
        kind: 'checkpoint',
        courseId: d.id,
        unitId,
        title: `Checkpoint: ${u.title}`,
        description: `Show what you learned in “${u.title}”.`,
        passMark: u.checkpoint.passMark ?? 0.7,
        questions: u.checkpoint.questions.map((qq) => finishQuestion(cpId, u.checkpoint.concept, qq)),
      },
    }
  })
  const examId = `${d.id}-exam`
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    tagline: d.tagline,
    description: d.description,
    colour: d.colour,
    icon: d.icon,
    outcomes: d.outcomes,
    passMark,
    units,
    exam: {
      id: examId,
      kind: 'exam',
      courseId: d.id,
      title: `${d.title}: final exam`,
      description: `Pass with ${Math.round(passMark * 100)}% or more to complete the course and earn your certificate.`,
      passMark,
      questions: d.exam.questions.map((qq) => finishQuestion(examId, d.exam.concept, qq)),
    },
  }
}
