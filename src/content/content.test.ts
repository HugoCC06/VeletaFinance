import { describe, expect, it } from 'vitest'
import { COURSES, CURRICULUM_STATS, getLesson, lessonQuestions } from './index'
import { validateCurriculum } from './validate'
import { gradeAnswer, correctAnswer } from '../engine/grading'
import { certificateEligibility, courseProgress, isLessonUnlocked, nextStep, examState, checkpointState } from '../engine/progression'

describe('curriculum', () => {
  it('passes structural validation', () => {
    expect(validateCurriculum(COURSES)).toEqual([])
  })
  it('covers all eight subject areas with substantial content', () => {
    expect(CURRICULUM_STATS.courses).toBe(8)
    expect(CURRICULUM_STATS.lessons).toBeGreaterThanOrEqual(60)
    for (const c of COURSES) expect(c.units.length).toBeGreaterThanOrEqual(3)
  })
  it('accepts every canonical answer', () => {
    for (const c of COURSES) {
      const qs = [...c.units.flatMap((u) => [...u.lessons.flatMap(lessonQuestions), ...u.checkpoint.questions]), ...c.exam.questions]
      for (const q of qs) expect(gradeAnswer(q, correctAnswer(q)), q.id).toBe(true)
    }
  })
})

describe('progression', () => {
  const c1 = COURSES[0]
  const empty = { completedLessons: new Set<string>(), passedAssessments: new Set<string>() }
  it('unlocks the first lesson only', () => {
    expect(isLessonUnlocked(c1, c1.units[0].lessons[0].id, empty)).toBe(true)
    expect(isLessonUnlocked(c1, c1.units[0].lessons[1].id, empty)).toBe(false)
    expect(isLessonUnlocked(c1, c1.units[1].lessons[0].id, empty)).toBe(false)
    expect(nextStep(c1, empty)).toMatchObject({ type: 'lesson' })
  })
  it('requires the checkpoint before the next unit, and all checkpoints before the exam', () => {
    const unit1 = new Set(c1.units[0].lessons.map((l) => l.id))
    const p = { completedLessons: unit1, passedAssessments: new Set<string>() }
    expect(checkpointState(c1.units[0], p)).toBe('available')
    expect(isLessonUnlocked(c1, c1.units[1].lessons[0].id, p)).toBe(false)
    p.passedAssessments.add(c1.units[0].checkpoint.id)
    expect(isLessonUnlocked(c1, c1.units[1].lessons[0].id, p)).toBe(true)
    expect(examState(c1, p)).toBe('locked')
  })
  it('only makes a course certificate-eligible when everything is done', () => {
    const all = new Set(c1.units.flatMap((u) => u.lessons.map((l) => l.id)))
    const passed = new Set(c1.units.map((u) => u.checkpoint.id))
    expect(certificateEligibility(c1, { completedLessons: all, passedAssessments: passed }).eligible).toBe(false)
    passed.add(c1.exam.id)
    const e = certificateEligibility(c1, { completedLessons: all, passedAssessments: passed })
    expect(e.eligible).toBe(true)
    expect(courseProgress(c1, { completedLessons: all, passedAssessments: passed }).complete).toBe(true)
  })
  it('looks up lessons by id', () => {
    expect(getLesson('c3-u1-l2')?.lesson.title).toBe('The income statement')
  })
})
