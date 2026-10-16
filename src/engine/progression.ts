/**
 * Unlock rules (mirrored by veleta_private.lesson_unlocked / assessment_unlocked in SQL):
 * - Every course is open; learners choose their own path.
 * - Within a unit, lesson N unlocks when lesson N-1 is complete.
 * - The first lesson of unit U unlocks when unit U-1's checkpoint is passed.
 * - A unit checkpoint unlocks when all of the unit's lessons are complete.
 * - The final exam unlocks when every unit checkpoint is passed.
 * - A course is complete when all lessons are complete, every checkpoint is
 *   passed and the final exam is passed.
 */
import type { Course, Lesson, Unit } from '../content/types'

export interface ProgressSnapshot {
  completedLessons: Set<string>
  passedAssessments: Set<string>
}

export type NodeState = 'completed' | 'available' | 'locked'

export function lessonState(course: Course, lessonId: string, p: ProgressSnapshot): NodeState {
  if (p.completedLessons.has(lessonId)) return 'completed'
  return isLessonUnlocked(course, lessonId, p) ? 'available' : 'locked'
}

export function isLessonUnlocked(course: Course, lessonId: string, p: ProgressSnapshot): boolean {
  for (let ui = 0; ui < course.units.length; ui++) {
    const unit = course.units[ui]
    const li = unit.lessons.findIndex((l) => l.id === lessonId)
    if (li === -1) continue
    if (li > 0) return p.completedLessons.has(unit.lessons[li - 1].id)
    return ui === 0 || p.passedAssessments.has(course.units[ui - 1].checkpoint.id)
  }
  return false
}

export function checkpointState(unit: Unit, p: ProgressSnapshot): NodeState {
  if (p.passedAssessments.has(unit.checkpoint.id)) return 'completed'
  return unit.lessons.every((l) => p.completedLessons.has(l.id)) ? 'available' : 'locked'
}

export function examState(course: Course, p: ProgressSnapshot): NodeState {
  if (p.passedAssessments.has(course.exam.id)) return 'completed'
  return course.units.every((u) => p.passedAssessments.has(u.checkpoint.id)) ? 'available' : 'locked'
}

export function isAssessmentUnlocked(course: Course, assessmentId: string, p: ProgressSnapshot): boolean {
  if (course.exam.id === assessmentId) return examState(course, p) !== 'locked'
  const unit = course.units.find((u) => u.checkpoint.id === assessmentId)
  return unit ? checkpointState(unit, p) !== 'locked' : false
}

export interface CourseProgress {
  lessonsDone: number
  lessonsTotal: number
  checkpointsPassed: number
  checkpointsTotal: number
  examPassed: boolean
  /** 0..1 — every lesson, checkpoint and the exam count as one step each. */
  fraction: number
  complete: boolean
}

export function courseProgress(course: Course, p: ProgressSnapshot): CourseProgress {
  const lessons = course.units.flatMap((u) => u.lessons)
  const lessonsDone = lessons.filter((l) => p.completedLessons.has(l.id)).length
  const checkpointsPassed = course.units.filter((u) => p.passedAssessments.has(u.checkpoint.id)).length
  const examPassed = p.passedAssessments.has(course.exam.id)
  const total = lessons.length + course.units.length + 1
  const done = lessonsDone + checkpointsPassed + (examPassed ? 1 : 0)
  return {
    lessonsDone,
    lessonsTotal: lessons.length,
    checkpointsPassed,
    checkpointsTotal: course.units.length,
    examPassed,
    fraction: done / total,
    complete: done === total,
  }
}

export type NextStep =
  | { type: 'lesson'; lesson: Lesson; unit: Unit }
  | { type: 'checkpoint'; unit: Unit }
  | { type: 'exam' }
  | { type: 'done' }

export function nextStep(course: Course, p: ProgressSnapshot): NextStep {
  for (const unit of course.units) {
    for (const lesson of unit.lessons) if (!p.completedLessons.has(lesson.id)) return { type: 'lesson', lesson, unit }
    if (!p.passedAssessments.has(unit.checkpoint.id)) return { type: 'checkpoint', unit }
  }
  if (!p.passedAssessments.has(course.exam.id)) return { type: 'exam' }
  return { type: 'done' }
}

export interface Eligibility {
  eligible: boolean
  missingLessons: string[]
  missingCheckpoints: string[]
  examPassed: boolean
}

/** Certificate eligibility. The backend re-checks this itself before issuing. */
export function certificateEligibility(course: Course, p: ProgressSnapshot): Eligibility {
  const missingLessons = course.units.flatMap((u) => u.lessons).filter((l) => !p.completedLessons.has(l.id)).map((l) => l.id)
  const missingCheckpoints = course.units.filter((u) => !p.passedAssessments.has(u.checkpoint.id)).map((u) => u.checkpoint.id)
  const examPassed = p.passedAssessments.has(course.exam.id)
  return { eligible: !missingLessons.length && !missingCheckpoints.length && examPassed, missingLessons, missingCheckpoints, examPassed }
}
