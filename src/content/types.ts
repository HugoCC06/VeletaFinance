/**
 * Veleta curriculum content model.
 *
 * Content is authored in TypeScript (src/content/courses/*) and kept separate
 * from presentation. Stable IDs are used everywhere so user progress stored in
 * the backend survives content edits. The answer keys for every gradable
 * question are exported to SQL (scripts/generate-content-sql.ts) so the
 * backend can grade submissions itself instead of trusting the browser.
 */

export type Difficulty = 1 | 2 | 3
export type Market = 'uk' | 'us' | 'both'

export interface Course {
  id: string // 'c1'
  slug: string
  title: string
  tagline: string
  description: string
  colour: string // CSS colour token name, e.g. 'violet'
  icon: string // icon id from components/Icon
  outcomes: string[] // learning outcomes printed on the certificate
  /** Final examination pass mark as a fraction, e.g. 0.8 */
  passMark: number
  units: Unit[]
  exam: Assessment
}

export interface Unit {
  id: string // 'c1-u1'
  courseId: string
  title: string
  description: string
  lessons: Lesson[]
  checkpoint: Assessment
}

export interface Lesson {
  id: string // 'c1-u1-l1'
  courseId: string
  unitId: string
  title: string
  description: string
  minutes: number
  difficulty: Difficulty
  objectives: string[]
  /** Concept tags used for mastery and revision. */
  tags: string[]
  steps: Step[]
  /** Sources for factual claims made in this lesson. */
  sources?: Source[]
}

export interface Source {
  label: string
  url?: string
  note?: string
}

export type CalloutVariant = 'key' | 'example' | 'warning' | 'ukus' | 'analogy'

export type Step =
  | { kind: 'text'; title?: string; body: string }
  | { kind: 'callout'; variant: CalloutVariant; title: string; body: string }
  | { kind: 'diagram'; title?: string; diagram: Diagram; caption?: string }
  | { kind: 'numbers'; title: string; rows: [string, string][]; note?: string }
  | { kind: 'question'; question: Question }
  | { kind: 'recap'; points: string[] }

/** Declarative diagram specs rendered by src/charts/Diagram.tsx */
export type Diagram =
  | { type: 'bars'; unit?: string; bars: { label: string; value: number; tone?: Tone; segments?: { value: number; tone: Tone; label: string }[] }[] }
  | { type: 'flow'; nodes: { label: string; sub?: string; tone?: Tone }[] }
  | { type: 'stack'; left: { title: string; items: { label: string; value: number; tone?: Tone }[] }; right: { title: string; items: { label: string; value: number; tone?: Tone }[] } }
  | { type: 'donut'; slices: { label: string; value: number; tone?: Tone }[]; centre?: string }
  | { type: 'line'; datasetId: string; seriesIds?: string[] }
  | { type: 'compare'; columns: { title: string; tone?: Tone; points: string[] }[] }
  | { type: 'scale'; left: string; right: string; items: { label: string; position: number; tone?: Tone }[] }
  | { type: 'candles'; datasetId: string; overlay?: 'sma' | 'none' }
  | { type: 'ladder'; bids: [number, number][]; asks: [number, number][]; currency: string }

export type Tone = 'violet' | 'mint' | 'sun' | 'coral' | 'sky' | 'ink' | 'grey'

export type QuestionKind = 'mcq' | 'tf' | 'multi' | 'numeric' | 'match' | 'order'

interface QuestionBase {
  id: string // globally unique and stable, e.g. 'c1-u1-l1.q1'
  kind: QuestionKind
  prompt: string
  /** Optional scenario text shown above the prompt (scenario/case-study questions). */
  scenario?: string
  explanation: string
  /** Concept tag for mastery; defaults to the lesson's first tag. */
  concept: string
  /** Marks a lesson's final challenge. */
  final?: boolean
}

export interface ChoiceQuestion extends QuestionBase {
  kind: 'mcq' | 'tf'
  options: string[]
  answer: number // index into options (authoring order)
}

export interface MultiQuestion extends QuestionBase {
  kind: 'multi'
  options: string[]
  answer: number[] // sorted indices
}

export interface NumericQuestion extends QuestionBase {
  kind: 'numeric'
  answer: number
  /** Absolute tolerance. */
  tolerance: number
  prefix?: string // e.g. '£'
  suffix?: string // e.g. '%'
  /** Worked calculation shown with feedback. */
  working?: string
}

export interface MatchQuestion extends QuestionBase {
  kind: 'match'
  left: string[]
  right: string[] // right[i] is the correct match for left[i] (authoring order)
}

export interface OrderQuestion extends QuestionBase {
  kind: 'order'
  items: string[] // in the correct order (authoring order)
}

export type Question = ChoiceQuestion | MultiQuestion | NumericQuestion | MatchQuestion | OrderQuestion

/**
 * Normalised answer shapes (identical on client and server):
 * - mcq/tf: number (option index)
 * - multi: number[] sorted ascending
 * - numeric: number
 * - match: number[] where value[i] is the index of the right-hand item chosen for left[i]
 * - order: number[] of item indices in the order the learner placed them
 */
export type AnswerValue = number | number[]

export interface Assessment {
  id: string // 'c1-u1-cp' or 'c1-exam'
  kind: 'checkpoint' | 'exam'
  courseId: string
  unitId?: string
  title: string
  description: string
  /** Fraction, e.g. 0.8 */
  passMark: number
  questions: Question[]
}
