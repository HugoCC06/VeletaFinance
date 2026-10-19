/**
 * Reference implementation of Veleta's trusted progression rules, operating on
 * a plain learner record. LocalBackend (demo mode) runs it in the browser;
 * the Supabase backend runs the equivalent PL/pgSQL in
 * supabase/migrations/*_functions.sql, where the browser cannot tamper with it.
 * Keep the two in step — supabase/tests mirrors the scenarios in rules.test.ts.
 */
import type { AnswerValue, Course } from '../content/types'
import { getAssessment, getCourse, getLesson, getQuestion, lessonQuestions, COURSES } from '../content'
import { dayInTimeZone, weekStart, type Day } from '../engine/dates'
import { gradeAnswer } from '../engine/grading'
import { updateStat, type QuestionStat } from '../engine/mastery'
import { XP } from '../engine/rewards'
import { initialStreak, recordGoalMet, viewStreak, type StreakState } from '../engine/streak'
import { applyMissionEvent, missionsFor, type MissionEvent, type MissionProgress } from '../engine/missions'
import { newlyUnlocked, type AchievementStats } from '../engine/achievements'
import { certificateEligibility, isAssessmentUnlocked, isLessonUnlocked, type ProgressSnapshot } from '../engine/progression'
import {
  BackendError,
  type AssessmentRecord,
  type AuthUser,
  type CertificateRecord,
  type LessonRecord,
  type LessonResult,
  type AssessmentResult,
  type Preferences,
  type Profile,
  type RevisionResult,
  type RewardSummary,
  type UserState,
} from './types'

export interface XpEvent {
  key: string
  amount: number
  label: string
  at: string
  day: Day
}

export interface AttemptRecord {
  id: string
  assessmentId: string
  score: number
  correct: number
  total: number
  passed: boolean
  at: string
}

export interface LearnerRecord {
  user: AuthUser
  profile: Profile
  prefs: Preferences
  xpEvents: XpEvent[]
  lessons: Record<string, LessonRecord>
  attempts: AttemptRecord[]
  stats: Record<string, QuestionStat>
  streak: StreakState
  days: Record<Day, { activities: number; xp: number; goalMet: boolean }>
  achievements: Record<string, string>
  missions: Record<string, MissionProgress>
  certificates: CertificateRecord[]
  processed: Record<string, unknown>
  counters: { revisionSessions: number; perfectLessons: number; perfectCheckpoints: number; friends: number }
}

export function newLearner(user: AuthUser, displayName: string, username: string, now: Date, timezone: string): LearnerRecord {
  return {
    user,
    profile: { userId: user.id, username, displayName, avatar: 'vane', bio: '', isPublic: false, createdAt: now.toISOString() },
    prefs: {
      experience: 'none',
      interests: [],
      dailyGoal: 2,
      intensity: 'balanced',
      market: 'both',
      timezone,
      onboarded: false,
      showOnLeaderboard: true,
      recommendedCourse: null,
    },
    xpEvents: [],
    lessons: {},
    attempts: [],
    stats: {},
    streak: initialStreak(),
    days: {},
    achievements: {},
    missions: {},
    certificates: [],
    processed: {},
    counters: { revisionSessions: 0, perfectLessons: 0, perfectCheckpoints: 0, friends: 0 },
  }
}

const today = (r: LearnerRecord, now: Date) => dayInTimeZone(now, r.prefs.timezone)

export function snapshot(r: LearnerRecord): ProgressSnapshot {
  return {
    completedLessons: new Set(Object.keys(r.lessons)),
    passedAssessments: new Set(r.attempts.filter((a) => a.passed).map((a) => a.assessmentId)),
  }
}

const totalXp = (r: LearnerRecord) => r.xpEvents.reduce((n, e) => n + e.amount, 0)

/** Context collecting the side-effects of one submission. */
class Tx {
  breakdown: { label: string; amount: number }[] = []
  missionsCompleted: string[] = []
  goalMetNow = false
  streakExtended = false
  freezesUsed = 0
  freezeEarned = false
  constructor(readonly r: LearnerRecord, readonly now: Date, readonly day: Day) {}

  award(key: string, amount: number, label: string): number {
    if (amount <= 0 || this.r.xpEvents.some((e) => e.key === key)) return 0
    this.r.xpEvents.push({ key, amount, label, at: this.now.toISOString(), day: this.day })
    const d = this.dayRow()
    d.xp += amount
    this.breakdown.push({ label, amount })
    if (!key.startsWith('mission:')) this.mission({ xp: amount })
    return amount
  }

  dayRow() {
    return (this.r.days[this.day] ??= { activities: 0, xp: 0, goalMet: false })
  }

  activity() {
    const d = this.dayRow()
    d.activities += 1
    this.mission({ activities: 1 })
    if (!d.goalMet && d.activities >= this.r.prefs.dailyGoal) {
      d.goalMet = true
      this.goalMetNow = true
      const u = recordGoalMet(this.r.streak, this.day)
      this.r.streak = u.state
      this.streakExtended = u.extended
      this.freezesUsed = u.freezesUsed.length
      this.freezeEarned = u.freezeEarned
      this.mission({ goal_days: 1 })
    }
  }

  mission(event: MissionEvent) {
    const { next, completed } = applyMissionEvent(this.day, this.r.missions, event)
    this.r.missions = next
    for (const slot of completed) {
      const xp = slot.template.period === 'daily' ? XP.dailyMission : XP.weeklyMission
      this.award(`mission:${slot.key}`, xp, `Mission: ${slot.template.title}`)
      this.missionsCompleted.push(slot.template.title)
    }
  }

  finish(): RewardSummary {
    const newAchievements = evaluateAchievements(this.r, this.now)
    return {
      xpAwarded: this.breakdown.reduce((n, b) => n + b.amount, 0),
      xpBreakdown: this.breakdown,
      totalXp: totalXp(this.r),
      streak: { current: viewStreak(this.r.streak, this.day).current, extended: this.streakExtended, freezesUsed: this.freezesUsed, freezeEarned: this.freezeEarned },
      goalMetNow: this.goalMetNow,
      newAchievements,
      missionsCompleted: this.missionsCompleted,
    }
  }
}

export function achievementStats(r: LearnerRecord): AchievementStats {
  const courseLessons: Record<string, number> = {}
  for (const id of Object.keys(r.lessons)) {
    const c = getLesson(id)?.course.id
    if (c) courseLessons[c] = (courseLessons[c] ?? 0) + 1
  }
  const stats = Object.values(r.stats)
  const passed = new Set(r.attempts.filter((a) => a.passed && getAssessment(a.assessmentId)?.assessment.kind === 'checkpoint').map((a) => a.assessmentId))
  const coursesCompleted = r.certificates.filter((c) => !c.revoked).map((c) => c.courseId)
  return {
    lessons: Object.keys(r.lessons).length,
    perfect_lessons: r.counters.perfectLessons,
    streak: r.streak.longest,
    goal_days: Object.values(r.days).filter((d) => d.goalMet).length,
    revisions: r.counters.revisionSessions,
    friends: r.counters.friends,
    perfect_checkpoints: r.counters.perfectCheckpoints,
    checkpoints: passed.size,
    courses: coursesCompleted.length,
    xp: totalXp(r),
    missions: r.xpEvents.filter((e) => e.key.startsWith('mission:')).length,
    correct: stats.reduce((n, s) => n + s.correct, 0),
    mastered: stats.filter((s) => s.box >= 5).length,
    coursesCompleted,
    courseLessons,
  }
}

export function evaluateAchievements(r: LearnerRecord, now: Date): string[] {
  const ids = newlyUnlocked(achievementStats(r), new Set(Object.keys(r.achievements)))
  for (const id of ids) r.achievements[id] = now.toISOString()
  return ids
}

function requireAnswers(ids: string[], answers: Record<string, AnswerValue>) {
  for (const id of ids) {
    const a = answers[id]
    const ok = typeof a === 'number' ? Number.isFinite(a) : Array.isArray(a) && a.length <= 20 && a.every((v) => Number.isInteger(v))
    if (!ok) throw new BackendError('validation', 'Please answer every question before submitting.')
  }
}

function idempotent<T>(r: LearnerRecord, attemptId: string, run: () => T): T {
  if (!/^[0-9a-f-]{16,64}$/i.test(attemptId)) throw new BackendError('validation', 'Invalid attempt id.')
  if (attemptId in r.processed) return r.processed[attemptId] as T
  const result = run()
  r.processed[attemptId] = result
  return result
}

export function processLesson(r: LearnerRecord, lessonId: string, answers: Record<string, AnswerValue>, attemptId: string, now: Date): LessonResult {
  return idempotent(r, attemptId, () => {
    const ref = getLesson(lessonId)
    if (!ref) throw new BackendError('not_found', 'Lesson not found.')
    if (!r.lessons[lessonId] && !isLessonUnlocked(ref.course, lessonId, snapshot(r)))
      throw new BackendError('locked', 'Complete the previous lesson first.')
    const qs = lessonQuestions(ref.lesson)
    requireAnswers(qs.map((q) => q.id), answers)
    const tx = new Tx(r, now, today(r, now))
    let correct = 0
    for (const q of qs) {
      const ok = gradeAnswer(q, answers[q.id])
      if (ok) correct++
      r.stats[q.id] = updateStat(r.stats[q.id], q.id, q.concept, ok, tx.day)
    }
    const accuracy = correct / qs.length
    const perfect = correct === qs.length
    const prev = r.lessons[lessonId]
    const firstCompletion = !prev
    r.lessons[lessonId] = prev
      ? { ...prev, completions: prev.completions + 1, bestAccuracy: Math.max(prev.bestAccuracy, accuracy) }
      : { lessonId, completedAt: now.toISOString(), firstAccuracy: accuracy, bestAccuracy: accuracy, completions: 1 }
    if (firstCompletion) {
      tx.mission({ new_lessons: 1 })
      tx.award(`lesson:${lessonId}`, XP.lessonFirstCompletion, `Lesson: ${ref.lesson.title}`)
      if (perfect) tx.award(`lesson-perfect:${lessonId}`, XP.lessonPerfectBonus, 'Perfect first attempt')
    }
    if (perfect) r.counters.perfectLessons += 1
    tx.mission({ lessons: 1, correct, perfect: perfect ? 1 : 0 })
    tx.activity()
    return { ...tx.finish(), firstCompletion, correct, total: qs.length, perfect }
  })
}

function issueCertificate(r: LearnerRecord, course: Course, score: number, now: Date, makeId: () => string): string | null {
  const existing = r.certificates.find((c) => c.courseId === course.id && !c.revoked)
  if (existing) return existing.id
  if (!certificateEligibility(course, snapshot(r)).eligible) return null
  const cert: CertificateRecord = { id: makeId(), courseId: course.id, recipientName: r.profile.displayName, score, issuedAt: now.toISOString(), revoked: false, demo: true }
  r.certificates.push(cert)
  return cert.id
}

export function processAssessment(
  r: LearnerRecord,
  assessmentId: string,
  answers: Record<string, AnswerValue>,
  attemptId: string,
  now: Date,
  makeCertificateId: () => string,
): AssessmentResult {
  return idempotent(r, attemptId, () => {
    const ref = getAssessment(assessmentId)
    if (!ref) throw new BackendError('not_found', 'Assessment not found.')
    const { course, assessment } = ref
    if (!isAssessmentUnlocked(course, assessmentId, snapshot(r)))
      throw new BackendError('locked', assessment.kind === 'exam' ? 'Pass every unit checkpoint to unlock the final exam.' : 'Finish the unit’s lessons to unlock this checkpoint.')
    requireAnswers(assessment.questions.map((q) => q.id), answers)
    const tx = new Tx(r, now, today(r, now))
    const results: Record<string, boolean> = {}
    let correct = 0
    for (const q of assessment.questions) {
      results[q.id] = gradeAnswer(q, answers[q.id])
      if (results[q.id]) correct++
    }
    const total = assessment.questions.length
    const score = correct / total
    const passed = score + 1e-9 >= assessment.passMark
    const alreadyPassed = r.attempts.some((a) => a.assessmentId === assessmentId && a.passed)
    r.attempts.push({ id: attemptId, assessmentId, score, correct, total, passed, at: now.toISOString() })

    let certificateId: string | null = null
    let courseCompleted = false
    if (passed && assessment.kind === 'checkpoint') {
      tx.award(`checkpoint:${assessmentId}`, XP.checkpointPass, `Checkpoint passed: ${ref.unit?.title ?? ''}`)
      if (!alreadyPassed) tx.mission({ checkpoints: 1 })
      if (score === 1) r.counters.perfectCheckpoints += 1
    }
    if (passed && assessment.kind === 'exam') {
      tx.award(`exam:${assessmentId}`, XP.examPass, `Final exam passed: ${course.title}`)
      certificateId = issueCertificate(r, course, score, now, makeCertificateId)
      courseCompleted = certificateId !== null
    }
    tx.mission({ correct })
    tx.activity()
    const missedConcepts = [...new Set(assessment.questions.filter((q) => !results[q.id]).map((q) => q.concept))]
    return {
      ...tx.finish(),
      attemptId,
      score,
      correct,
      total,
      passed,
      passMark: assessment.passMark,
      results: assessment.kind === 'checkpoint' ? results : null,
      missedConcepts,
      courseCompleted,
      certificateId,
    }
  })
}

export const REVISION_MAX_QUESTIONS = 12

export function processRevision(r: LearnerRecord, answers: Record<string, AnswerValue>, attemptId: string, now: Date): RevisionResult {
  return idempotent(r, attemptId, () => {
    const ids = Object.keys(answers)
    if (ids.length < 1 || ids.length > REVISION_MAX_QUESTIONS) throw new BackendError('validation', 'A revision session needs 1–12 questions.')
    const qs = ids.map((id) => {
      const ref = getQuestion(id)
      if (!ref || !ref.lesson) throw new BackendError('validation', 'Revision can only include lesson questions.')
      if (!r.lessons[ref.lesson.id]) throw new BackendError('forbidden', 'You can only revise lessons you have completed.')
      return ref.question
    })
    requireAnswers(ids, answers)
    const tx = new Tx(r, now, today(r, now))
    const results: Record<string, boolean> = {}
    let correct = 0
    for (const q of qs) {
      const ok = gradeAnswer(q, answers[q.id])
      results[q.id] = ok
      if (ok) correct++
      r.stats[q.id] = updateStat(r.stats[q.id], q.id, q.concept, ok, tx.day)
    }
    const sessionsToday = r.xpEvents.filter((e) => e.key.startsWith(`revision:${tx.day}:`)).length
    if (sessionsToday < XP.revisionSessionsPerDay) tx.award(`revision:${tx.day}:${sessionsToday + 1}`, XP.revisionSession, 'Revision session')
    r.counters.revisionSessions += 1
    tx.mission({ revisions: 1, correct })
    tx.activity()
    return { ...tx.finish(), correct, total: qs.length, results }
  })
}

export function buildState(r: LearnerRecord, now: Date): UserState {
  const day = today(r, now)
  const ws = weekStart(day)
  const assessments: Record<string, AssessmentRecord> = {}
  for (const a of r.attempts) {
    const prev = assessments[a.assessmentId]
    assessments[a.assessmentId] = {
      assessmentId: a.assessmentId,
      attempts: (prev?.attempts ?? 0) + 1,
      passed: (prev?.passed ?? false) || a.passed,
      bestScore: Math.max(prev?.bestScore ?? 0, a.score),
      lastScore: a.score,
      lastAttemptAt: a.at,
      passedAt: prev?.passedAt ?? (a.passed ? a.at : null),
    }
  }
  const missions = missionsFor(day).map((slot) => {
    const p = r.missions[slot.key]
    return {
      key: slot.key,
      templateId: slot.template.id,
      title: slot.template.title,
      period: slot.template.period,
      progress: p?.progress ?? 0,
      target: slot.template.target,
      completed: p?.completed ?? false,
      xp: slot.template.period === 'daily' ? XP.dailyMission : XP.weeklyMission,
    }
  })
  const activity = Object.entries(r.days)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-28)
    .map(([d, v]) => ({ day: d, xp: v.xp, activities: v.activities, goalMet: v.goalMet }))
  return {
    user: r.user,
    profile: r.profile,
    prefs: r.prefs,
    today: day,
    xp: {
      total: totalXp(r),
      today: r.xpEvents.filter((e) => e.day === day).reduce((n, e) => n + e.amount, 0),
      week: r.xpEvents.filter((e) => e.day >= ws).reduce((n, e) => n + e.amount, 0),
    },
    streak: viewStreak(r.streak, day),
    todayActivities: r.days[day]?.activities ?? 0,
    lessons: r.lessons,
    assessments,
    achievements: r.achievements,
    missions,
    stats: Object.values(r.stats),
    certificates: r.certificates,
    activity,
    counters: {
      revisionSessions: r.counters.revisionSessions,
      goalDays: Object.values(r.days).filter((d) => d.goalMet).length,
      friends: r.counters.friends,
      perfectLessons: r.counters.perfectLessons,
      perfectCheckpoints: r.counters.perfectCheckpoints,
      missions: r.xpEvents.filter((e) => e.key.startsWith('mission:')).length,
    },
  }
}

/** Placement recommendation from onboarding answers (shared by both backends' onboarding UI). */
export function recommendCourse(experience: string, quizScore: number | null): string {
  if (experience === 'experienced' && (quizScore ?? 0) >= 0.8) return 'c3'
  if (experience !== 'none' && (quizScore ?? 0) >= 0.6) return 'c2'
  return 'c1'
}

export const courseIds = () => COURSES.map((c) => c.id)
export { getCourse }
