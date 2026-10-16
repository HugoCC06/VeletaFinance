import type { Assessment, Course, Lesson, Question, Unit } from './types'
import { c1 } from './courses/c1-fundamentals'
import { c2 } from './courses/c2-stocks'
import { c3 } from './courses/c3-analysis'
import { c4 } from './courses/c4-portfolios'
import { c5 } from './courses/c5-valuation'
import { c6 } from './courses/c6-macro'
import { c7 } from './courses/c7-dividends'
import { c8 } from './courses/c8-trading'

export const COURSES: Course[] = [c1, c2, c3, c4, c5, c6, c7, c8]

interface LessonRef { course: Course; unit: Unit; lesson: Lesson; index: number }
interface AssessmentRef { course: Course; unit?: Unit; assessment: Assessment }
interface QuestionRef { question: Question; course: Course; lesson?: Lesson; assessment?: Assessment }

const lessonMap = new Map<string, LessonRef>()
const assessmentMap = new Map<string, AssessmentRef>()
const questionMap = new Map<string, QuestionRef>()

for (const course of COURSES) {
  let index = 0
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      lessonMap.set(lesson.id, { course, unit, lesson, index: index++ })
      for (const s of lesson.steps) if (s.kind === 'question') questionMap.set(s.question.id, { question: s.question, course, lesson })
    }
    assessmentMap.set(unit.checkpoint.id, { course, unit, assessment: unit.checkpoint })
    for (const q of unit.checkpoint.questions) questionMap.set(q.id, { question: q, course, assessment: unit.checkpoint })
  }
  assessmentMap.set(course.exam.id, { course, assessment: course.exam })
  for (const q of course.exam.questions) questionMap.set(q.id, { question: q, course, assessment: course.exam })
}

export const getCourse = (id: string) => COURSES.find((c) => c.id === id || c.slug === id)
export const getLesson = (id: string) => lessonMap.get(id)
export const getAssessment = (id: string) => assessmentMap.get(id)
export const getQuestion = (id: string) => questionMap.get(id)
export const allLessons = () => [...lessonMap.values()]
export const allQuestionRefs = () => [...questionMap.values()]

export const lessonQuestions = (lesson: Lesson): Question[] =>
  lesson.steps.flatMap((s) => (s.kind === 'question' ? [s.question] : []))

export const courseLessonQuestionIds = (course: Course): string[] =>
  course.units.flatMap((u) => u.lessons.flatMap((l) => lessonQuestions(l).map((q) => q.id)))

export const CURRICULUM_STATS = {
  courses: COURSES.length,
  units: COURSES.reduce((n, c) => n + c.units.length, 0),
  lessons: lessonMap.size,
  questions: questionMap.size,
}

/** Concept tag -> human readable label (derived from the first lesson that uses it). */
export function conceptLabel(tag: string): string {
  for (const { lesson } of lessonMap.values()) if (lesson.tags.includes(tag)) return lesson.title
  return tag.replace(/-/g, ' ')
}

/** The lesson that best teaches a concept, for revision recommendations. */
export function lessonForConcept(tag: string): Lesson | undefined {
  for (const { lesson } of lessonMap.values()) if (lesson.tags.includes(tag)) return lesson
  return undefined
}
