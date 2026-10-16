import { beforeEach, describe, expect, it } from 'vitest'
import { LocalBackend, type KeyValueStorage } from './local'
import { COURSES, lessonQuestions } from '../content'
import { correctAnswer } from '../engine/grading'
import type { AnswerValue, Question } from '../content/types'
import { BackendError } from './types'

const c1 = COURSES[0]
const allLessons = c1.units.flatMap((u) => u.lessons)
const right = (qs: Question[]) => Object.fromEntries(qs.map((q) => [q.id, correctAnswer(q)])) as Record<string, AnswerValue>
const wrong = (q: Question): AnswerValue => {
  switch (q.kind) {
    case 'mcq': case 'tf': return (q.answer + 1) % q.options.length
    case 'multi': return q.answer.length === q.options.length ? [0] : [...Array(q.options.length).keys()].filter((i) => !q.answer.includes(i)).slice(0, 1)
    case 'numeric': return q.answer + 1000
    case 'match': return [...correctAnswer(q) as number[]].reverse()
    case 'order': return [...Array(q.items.length).keys()].reverse()
  }
}
let n = 0
const aid = () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`

function mem(): KeyValueStorage {
  const m = new Map<string, string>()
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }
}

describe('LocalBackend rules', () => {
  let now = new Date('2026-10-12T10:00:00Z')
  let be: LocalBackend
  beforeEach(async () => {
    now = new Date('2026-10-12T10:00:00Z')
    be = new LocalBackend({ storage: mem(), clock: () => now })
    await be.signUp('a@example.com', 'password123', 'Ada')
    await be.updatePreferences({ timezone: 'Europe/London', dailyGoal: 1 })
  })

  it('awards first-completion XP once, never for replays or duplicate submissions', async () => {
    const l = allLessons[0]
    const answers = right(lessonQuestions(l))
    const id = aid()
    const r1 = await be.submitLesson(l.id, answers, id)
    expect(r1.firstCompletion).toBe(true)
    expect(r1.perfect).toBe(true)
    expect(r1.xpBreakdown.find((b) => b.label.startsWith('Lesson'))?.amount).toBe(20)
    const dup = await be.submitLesson(l.id, answers, id)
    expect(dup).toEqual(r1) // idempotent replay of the same request
    const before = (await be.loadState()).xp.total
    const r2 = await be.submitLesson(l.id, answers, aid())
    expect(r2.firstCompletion).toBe(false)
    expect(r2.xpBreakdown.filter((b) => b.label.startsWith('Lesson') || b.label.startsWith('Perfect'))).toEqual([])
    const after = (await be.loadState()).xp.total
    expect(after - before).toBe(r2.xpAwarded) // only mission XP, if any
  })

  it('rejects locked lessons and incomplete submissions', async () => {
    await expect(be.submitLesson(allLessons[1].id, right(lessonQuestions(allLessons[1])), aid())).rejects.toMatchObject({ code: 'locked' })
    await expect(be.submitLesson(allLessons[0].id, {}, aid())).rejects.toBeInstanceOf(BackendError)
  })

  it('records mistakes for revision and caps revision XP per day', async () => {
    const l = allLessons[0]
    const qs = lessonQuestions(l)
    const answers = right(qs)
    answers[qs[0].id] = wrong(qs[0])
    const res = await be.submitLesson(l.id, answers, aid())
    expect(res.perfect).toBe(false)
    let s = await be.loadState()
    expect(s.stats.find((x) => x.questionId === qs[0].id)?.box).toBe(0)
    const xps: number[] = []
    for (let i = 0; i < 5; i++) xps.push((await be.submitRevision({ [qs[0].id]: correctAnswer(qs[0]) }, aid())).xpBreakdown.filter((b) => b.label === 'Revision session').reduce((a, b) => a + b.amount, 0))
    expect(xps).toEqual([10, 10, 10, 0, 0])
    s = await be.loadState()
    expect(s.stats.find((x) => x.questionId === qs[0].id)?.box).toBe(1) // same-day answers don't keep promoting
    await expect(be.submitRevision({ [lessonQuestions(allLessons[5])[0].id]: 0 }, aid())).rejects.toMatchObject({ code: 'forbidden' })
  })

  it('extends the streak once per day and uses a freeze for one missed day', async () => {
    const r1 = await be.submitLesson(allLessons[0].id, right(lessonQuestions(allLessons[0])), aid())
    expect(r1.goalMetNow).toBe(true)
    expect(r1.streak.current).toBe(1)
    const r2 = await be.submitLesson(allLessons[1].id, right(lessonQuestions(allLessons[1])), aid())
    expect(r2.goalMetNow).toBe(false)
    now = new Date('2026-10-14T10:00:00Z') // skipped the 13th
    const r3 = await be.submitLesson(allLessons[2].id, right(lessonQuestions(allLessons[2])), aid())
    expect(r3.streak).toMatchObject({ current: 2, freezesUsed: 1 })
  })

  it('runs the full course: checkpoint gating, exam fail then pass, one certificate', async () => {
    for (const u of c1.units) {
      for (const l of u.lessons) await be.submitLesson(l.id, right(lessonQuestions(l)), aid())
      await expect(be.submitAssessment(c1.exam.id, right(c1.exam.questions), aid())).rejects.toMatchObject({ code: 'locked' })
      const cp = await be.submitAssessment(u.checkpoint.id, right(u.checkpoint.questions), aid())
      expect(cp.passed).toBe(true)
      expect(cp.results).not.toBeNull()
    }
    const failing = right(c1.exam.questions)
    for (const q of c1.exam.questions.slice(0, 4)) failing[q.id] = wrong(q)
    const fail = await be.submitAssessment(c1.exam.id, failing, aid())
    expect(fail.passed).toBe(false)
    expect(fail.results).toBeNull() // exams don't reveal per-question answers
    expect(fail.missedConcepts.length).toBeGreaterThan(0)
    expect(fail.certificateId).toBeNull()
    const pass = await be.submitAssessment(c1.exam.id, right(c1.exam.questions), aid())
    expect(pass.passed).toBe(true)
    expect(pass.courseCompleted).toBe(true)
    expect(pass.certificateId).toMatch(/^DEMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    expect(pass.newAchievements).toEqual(expect.arrayContaining(['first_course', 'foundations']))
    const again = await be.submitAssessment(c1.exam.id, right(c1.exam.questions), aid())
    expect(again.certificateId).toBe(pass.certificateId)
    expect(again.xpBreakdown.some((b) => b.label.startsWith('Final exam'))).toBe(false)
    const s = await be.loadState()
    expect(s.certificates).toHaveLength(1)
    expect(s.assessments[c1.exam.id]).toMatchObject({ attempts: 3, passed: true })
    const v = await be.verifyCertificate(pass.certificateId!)
    expect(v).toMatchObject({ status: 'valid', courseId: 'c1', demo: true })
  })

  it('keeps profiles private by default and hides them from others', async () => {
    const s = await be.loadState()
    expect(s.profile.isPublic).toBe(false)
    await be.signOut()
    expect(await be.getPublicProfile(s.profile.username)).toBeNull()
  })

  it('deletes the account and its data', async () => {
    await be.deleteAccount()
    expect(await be.getUser()).toBeNull()
    await expect(be.signIn('a@example.com', 'password123')).rejects.toMatchObject({ code: 'auth' })
  })
})
