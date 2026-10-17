import { describe, expect, it } from 'vitest'
import { addDays, dayInTimeZone, daysBetween, isValidDay, weekStart } from './dates'
import { levelInfo, xpForLevel, levelCost } from './rewards'
import { initialStreak, recordGoalMet, viewStreak, MAX_FREEZES } from './streak'
import { buildRevisionQueue, masteryFor, updateStat, type QuestionStat } from './mastery'
import { gradeAnswer, parseNumberInput, scoreAnswers, seededOrder } from './grading'
import { applyMissionEvent, missionsFor } from './missions'
import { newlyUnlocked, type AchievementStats } from './achievements'
import type { Question } from '../content/types'

describe('dates', () => {
  it('handles month, year and DST boundaries', () => {
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30') // UK clocks change 29 March 2026
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
    expect(daysBetween('2026-10-24', '2026-10-26')).toBe(2) // across UK DST end
    expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2) // leap year
  })
  it('computes ISO week start (Monday)', () => {
    expect(weekStart('2026-10-16')).toBe('2026-10-12') // Friday -> Monday
    expect(weekStart('2026-10-18')).toBe('2026-10-12') // Sunday -> previous Monday
    expect(weekStart('2026-10-12')).toBe('2026-10-12')
  })
  it('uses the learner time zone for the learning day', () => {
    const instant = new Date('2026-10-16T23:30:00Z')
    expect(dayInTimeZone(instant, 'Europe/London')).toBe('2026-10-17')
    expect(dayInTimeZone(instant, 'America/New_York')).toBe('2026-10-16')
  })
  it('validates day strings', () => {
    expect(isValidDay('2026-02-29')).toBe(false)
    expect(isValidDay('2028-02-29')).toBe(true)
    expect(isValidDay('16/10/2026')).toBe(false)
  })
})

describe('levels', () => {
  it('has an increasing cost curve', () => {
    expect(xpForLevel(1)).toBe(0)
    expect(xpForLevel(2)).toBe(100)
    expect(xpForLevel(3)).toBe(250)
    expect(levelCost(3)).toBe(200)
  })
  it('computes level boundaries exactly', () => {
    expect(levelInfo(0).level).toBe(1)
    expect(levelInfo(99).level).toBe(1)
    expect(levelInfo(100).level).toBe(2)
    expect(levelInfo(249).level).toBe(2)
    expect(levelInfo(250).level).toBe(3)
    expect(levelInfo(175).progress).toBeCloseTo(0.5)
    expect(levelInfo(-50).level).toBe(1)
  })
  it('caps at the maximum level', () => {
    const info = levelInfo(10_000_000)
    expect(info.level).toBe(60)
    expect(info.nextLevelXp).toBeNull()
    expect(info.progress).toBe(1)
  })
})

describe('streaks', () => {
  it('starts, extends and ignores same-day repeats', () => {
    let s = recordGoalMet(initialStreak(), '2026-10-01').state
    expect(s.current).toBe(1)
    const again = recordGoalMet(s, '2026-10-01')
    expect(again.extended).toBe(false)
    expect(again.state.current).toBe(1)
    s = recordGoalMet(s, '2026-10-02').state
    expect(s.current).toBe(2)
  })
  it('uses one freeze per missed day and never twice for the same day', () => {
    const s0 = { ...initialStreak(), current: 3, longest: 3, lastDay: '2026-10-01', freezes: 2 }
    const r = recordGoalMet(s0, '2026-10-03')
    expect(r.freezesUsed).toEqual(['2026-10-02'])
    expect(r.state.freezes).toBe(1)
    expect(r.state.current).toBe(4)
    // A forged replay of the same gap cannot consume the frozen day again
    const replay = recordGoalMet({ ...r.state, lastDay: '2026-10-01' }, '2026-10-03')
    expect(replay.freezesUsed).toEqual([])
    expect(replay.state.freezes).toBe(1)
  })
  it('resets when missed days exceed freezes', () => {
    const s0 = { ...initialStreak(), current: 10, longest: 10, lastDay: '2026-10-01', freezes: 1 }
    const r = recordGoalMet(s0, '2026-10-04')
    expect(r.reset).toBe(true)
    expect(r.state.current).toBe(1)
    expect(r.state.longest).toBe(10)
    expect(r.state.freezes).toBe(1)
  })
  it('earns a freeze every 7 days up to the cap', () => {
    let s = { ...initialStreak(), freezes: 0 }
    for (let i = 0; i < 21; i++) s = recordGoalMet(s, addDays('2026-01-01', i)).state
    expect(s.current).toBe(21)
    expect(s.freezes).toBe(MAX_FREEZES)
  })
  it('ignores a clock moving backwards', () => {
    const s0 = { ...initialStreak(), current: 5, longest: 5, lastDay: '2026-10-05' }
    expect(recordGoalMet(s0, '2026-10-03').state).toEqual(s0)
  })
  it('views lapsed and protected streaks', () => {
    const s = { ...initialStreak(), current: 5, longest: 5, lastDay: '2026-10-05', freezes: 1 }
    expect(viewStreak(s, '2026-10-05')).toMatchObject({ current: 5, doneToday: true })
    expect(viewStreak(s, '2026-10-06')).toMatchObject({ current: 5, doneToday: false, missedDays: 0 })
    expect(viewStreak(s, '2026-10-07')).toMatchObject({ current: 5, missedDays: 1 })
    expect(viewStreak(s, '2026-10-08').current).toBe(0)
  })
})

describe('mastery', () => {
  it('only promotes once per day and demotes on mistakes', () => {
    let s = updateStat(undefined, 'q', 'c', true, '2026-10-01')
    expect(s.box).toBe(1)
    expect(s.dueDay).toBe('2026-10-02')
    s = updateStat(s, 'q', 'c', true, '2026-10-01')
    expect(s.box).toBe(1) // same-day repetition does not farm mastery
    s = updateStat(s, 'q', 'c', true, '2026-10-02')
    expect(s.box).toBe(2)
    s = updateStat(s, 'q', 'c', false, '2026-10-03')
    expect(s.box).toBe(0)
    expect(s.dueDay).toBe('2026-10-03')
    expect(s.attempts).toBe(4)
    expect(s.correct).toBe(3)
    s = updateStat(s, 'q', 'c', true, '2026-10-03') // fixing a miss promotes once…
    expect(s.box).toBe(1)
    s = updateStat(s, 'q', 'c', true, '2026-10-03') // …but not again the same day
    expect(s.box).toBe(1)
  })
  it('counts unseen questions as zero mastery', () => {
    const stats = new Map<string, QuestionStat>([['a', updateStat(undefined, 'a', 'c', true, '2026-10-01')]])
    expect(masteryFor(['a', 'b'], stats)).toBe(20)
    expect(masteryFor([], stats)).toBe(0)
  })
  it('prioritises missed questions in the revision queue', () => {
    const today = '2026-10-10'
    const stats: QuestionStat[] = [
      { questionId: 'a', concept: 'x', box: 3, attempts: 3, correct: 3, lastDay: '2026-10-01', dueDay: '2026-10-08', promotedDay: '2026-10-01' },
      { questionId: 'b', concept: 'x', box: 0, attempts: 1, correct: 0, lastDay: '2026-10-09', dueDay: '2026-10-09', promotedDay: null },
      { questionId: 'c', concept: 'x', box: 5, attempts: 5, correct: 5, lastDay: '2026-10-09', dueDay: '2026-11-08', promotedDay: '2026-10-09' },
      { questionId: 'd', concept: 'x', box: 4, attempts: 5, correct: 5, lastDay: today, dueDay: '2026-10-24', promotedDay: today },
    ]
    const q = buildRevisionQueue(stats, today, 3)
    expect(q.map((p) => p.questionId)).toEqual(['b', 'a', 'c'])
    expect(q[0].reason).toBe('missed')
    expect(q[2].reason).toBe('practice')
    expect(buildRevisionQueue(stats, today, 10).map((p) => p.questionId)).toEqual(['b', 'a', 'c', 'd'])
  })
})

describe('grading', () => {
  const mcq: Question = { id: 'm', kind: 'mcq', prompt: '', options: ['a', 'b'], answer: 1, explanation: '', concept: 'c' }
  const multi: Question = { id: 'x', kind: 'multi', prompt: '', options: ['a', 'b', 'c'], answer: [0, 2], explanation: '', concept: 'c' }
  const numQ: Question = { id: 'n', kind: 'numeric', prompt: '', answer: 1102.5, tolerance: 0.5, explanation: '', concept: 'c' }
  const orderQ: Question = { id: 'o', kind: 'order', prompt: '', items: ['1', '2', '3'], explanation: '', concept: 'c' }
  const matchQ: Question = { id: 't', kind: 'match', prompt: '', left: ['a', 'b'], right: ['A', 'B'], explanation: '', concept: 'c' }
  it('grades every kind', () => {
    expect(gradeAnswer(mcq, 1)).toBe(true)
    expect(gradeAnswer(mcq, 0)).toBe(false)
    expect(gradeAnswer(mcq, null)).toBe(false)
    expect(gradeAnswer(multi, [2, 0])).toBe(true)
    expect(gradeAnswer(multi, [0])).toBe(false)
    expect(gradeAnswer(numQ, 1102)).toBe(true)
    expect(gradeAnswer(numQ, 1103.1)).toBe(false)
    expect(gradeAnswer(numQ, Number.NaN)).toBe(false)
    expect(gradeAnswer(orderQ, [0, 1, 2])).toBe(true)
    expect(gradeAnswer(orderQ, [1, 0, 2])).toBe(false)
    expect(gradeAnswer(matchQ, [0, 1])).toBe(true)
    expect(gradeAnswer(matchQ, [1, 0])).toBe(false)
    expect(gradeAnswer(mcq, [1] as never)).toBe(false)
  })
  it('parses friendly number input', () => {
    expect(parseNumberInput('£1,102.50')).toBe(1102.5)
    expect(parseNumberInput('7%')).toBe(7)
    expect(parseNumberInput('2.5k')).toBe(2500)
    expect(parseNumberInput('-3')).toBe(-3)
    expect(parseNumberInput('abc')).toBeNull()
    expect(parseNumberInput('')).toBeNull()
    expect(parseNumberInput('1.2.3')).toBeNull()
  })
  it('scores a set of answers', () => {
    const s = scoreAnswers([mcq, multi], { m: 1, x: [0] })
    expect(s).toMatchObject({ correct: 1, total: 2, score: 0.5 })
  })
  it('produces stable permutations', () => {
    const a = seededOrder(5, 'q1')
    expect(seededOrder(5, 'q1')).toEqual(a)
    expect([...a].sort()).toEqual([0, 1, 2, 3, 4])
  })
})

describe('missions', () => {
  it('generates the same missions all day and different ones on other days', () => {
    const a = missionsFor('2026-10-16').map((m) => m.key)
    expect(missionsFor('2026-10-16').map((m) => m.key)).toEqual(a)
    expect(a.filter((k) => k.startsWith('daily:'))).toHaveLength(3)
    expect(a.filter((k) => k.startsWith('weekly:2026-10-12'))).toHaveLength(3)
    expect(missionsFor('2026-10-17').map((m) => m.key)).not.toEqual(a)
  })
  it('advances, caps and completes once', () => {
    const day = '2026-10-16'
    let r = applyMissionEvent(day, {}, { lessons: 1 })
    expect(r.completed).toHaveLength(0)
    r = applyMissionEvent(day, r.next, { lessons: 1 })
    expect(r.completed.map((c) => c.template.id)).toContain('d_lessons2')
    const again = applyMissionEvent(day, r.next, { lessons: 5 })
    expect(again.completed.map((c) => c.template.id)).not.toContain('d_lessons2')
    expect(again.next[`daily:${day}:d_lessons2`].progress).toBe(2)
  })
})

describe('achievements', () => {
  const base: AchievementStats = { lessonsCompleted: 0, perfectLessons: 0, longestStreak: 0, coursesCompleted: [], revisionSessions: 0, goalDays: 0, friends: 0, perfectCheckpoints: 0 }
  it('unlocks on thresholds and not twice', () => {
    expect(newlyUnlocked(base, new Set())).toEqual([])
    const s = { ...base, lessonsCompleted: 1, coursesCompleted: ['c1'] }
    expect(newlyUnlocked(s, new Set())).toEqual(['first_lesson', 'first_course', 'foundations'])
    expect(newlyUnlocked(s, new Set(['first_lesson']))).not.toContain('first_lesson')
  })
})
