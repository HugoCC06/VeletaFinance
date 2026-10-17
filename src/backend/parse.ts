/**
 * Defensive parsing of backend responses. The server is trusted for
 * correctness, but responses still cross the network, so we validate shapes
 * and fall back to safe defaults instead of letting a malformed payload crash
 * the UI.
 */
import {
  BackendError,
  type AssessmentResult,
  type AuthUser,
  type CertificateVerification,
  type LessonResult,
  type PublicProfile,
  type RevisionResult,
  type RewardSummary,
  type UserState,
} from './types'

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const obj = (v: unknown): Obj => (isObj(v) ? v : {})
const str = (v: unknown, d = ''): string => (typeof v === 'string' ? v : d)
const num = (v: unknown, d = 0): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
  return Number.isFinite(n) ? n : d
}
const bool = (v: unknown): boolean => v === true
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const strs = (v: unknown): string[] => arr(v).filter((x): x is string => typeof x === 'string')
const dayStr = (v: unknown, d = ''): string => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : d)

function reward(o: Obj): RewardSummary {
  const s = obj(o.streak)
  return {
    xpAwarded: num(o.xpAwarded),
    xpBreakdown: arr(o.xpBreakdown).map((b) => ({ label: str(obj(b).label), amount: num(obj(b).amount) })),
    totalXp: num(o.totalXp),
    streak: { current: num(s.current), extended: bool(s.extended), freezesUsed: num(s.freezesUsed), freezeEarned: bool(s.freezeEarned) },
    goalMetNow: bool(o.goalMetNow),
    newAchievements: strs(o.newAchievements),
    missionsCompleted: strs(o.missionsCompleted),
  }
}

function requireObj(v: unknown, what: string): Obj {
  if (!isObj(v)) throw new BackendError('unknown', `Unexpected response from the server (${what}).`)
  return v
}

export function parseLessonResult(v: unknown): LessonResult {
  const o = requireObj(v, 'lesson')
  return { ...reward(o), firstCompletion: bool(o.firstCompletion), correct: num(o.correct), total: num(o.total), perfect: bool(o.perfect) }
}

export function parseAssessmentResult(v: unknown): AssessmentResult {
  const o = requireObj(v, 'assessment')
  const results = isObj(o.results) ? Object.fromEntries(Object.entries(o.results).map(([k, x]) => [k, x === true])) : null
  return {
    ...reward(o),
    attemptId: str(o.attemptId),
    score: num(o.score),
    correct: num(o.correct),
    total: num(o.total),
    passed: bool(o.passed),
    passMark: num(o.passMark, 0.8),
    results,
    missedConcepts: strs(o.missedConcepts),
    courseCompleted: bool(o.courseCompleted),
    certificateId: typeof o.certificateId === 'string' ? o.certificateId : null,
  }
}

export function parseRevisionResult(v: unknown): RevisionResult {
  const o = requireObj(v, 'revision')
  const r = obj(o.results)
  return { ...reward(o), correct: num(o.correct), total: num(o.total), results: Object.fromEntries(Object.entries(r).map(([k, x]) => [k, x === true])) }
}

export function parseUserState(v: unknown, user: AuthUser): UserState {
  const o = requireObj(v, 'state')
  const p = obj(o.profile)
  const pr = obj(o.prefs)
  const xp = obj(o.xp)
  const st = obj(o.streak)
  const c = obj(o.counters)
  const lessons: UserState['lessons'] = {}
  for (const [k, x] of Object.entries(obj(o.lessons))) {
    const l = obj(x)
    lessons[k] = { lessonId: k, completedAt: str(l.completedAt), firstAccuracy: num(l.firstAccuracy), bestAccuracy: num(l.bestAccuracy), completions: num(l.completions, 1) }
  }
  const assessments: UserState['assessments'] = {}
  for (const [k, x] of Object.entries(obj(o.assessments))) {
    const a = obj(x)
    assessments[k] = { assessmentId: k, attempts: num(a.attempts), passed: bool(a.passed), bestScore: num(a.bestScore), lastScore: num(a.lastScore), lastAttemptAt: str(a.lastAttemptAt), passedAt: typeof a.passedAt === 'string' ? a.passedAt : null }
  }
  const achievements: Record<string, string> = {}
  for (const [k, x] of Object.entries(obj(o.achievements))) achievements[k] = str(x)
  const market = str(pr.market, 'both')
  const experience = str(pr.experience, 'none')
  const intensity = str(pr.intensity, 'balanced')
  return {
    user,
    profile: {
      userId: str(p.userId, user.id),
      username: str(p.username),
      displayName: str(p.displayName, 'Learner'),
      avatar: str(p.avatar, 'vane'),
      bio: str(p.bio),
      isPublic: bool(p.isPublic),
      createdAt: str(p.createdAt),
    },
    prefs: {
      experience: (['none', 'some', 'experienced'].includes(experience) ? experience : 'none') as UserState['prefs']['experience'],
      interests: strs(pr.interests),
      dailyGoal: num(pr.dailyGoal, 2),
      intensity: (['relaxed', 'balanced', 'challenge'].includes(intensity) ? intensity : 'balanced') as UserState['prefs']['intensity'],
      market: (['uk', 'us', 'both'].includes(market) ? market : 'both') as UserState['prefs']['market'],
      timezone: str(pr.timezone, 'UTC'),
      onboarded: bool(pr.onboarded),
      showOnLeaderboard: pr.showOnLeaderboard !== false,
      recommendedCourse: typeof pr.recommendedCourse === 'string' ? pr.recommendedCourse : null,
    },
    today: dayStr(o.today, new Date().toISOString().slice(0, 10)),
    xp: { total: num(xp.total), today: num(xp.today), week: num(xp.week) },
    streak: { current: num(st.current), longest: num(st.longest), freezes: num(st.freezes), doneToday: bool(st.doneToday), missedDays: num(st.missedDays) },
    todayActivities: num(o.todayActivities),
    lessons,
    assessments,
    achievements,
    missions: arr(o.missions).map((m) => {
      const x = obj(m)
      return {
        key: str(x.key),
        templateId: str(x.templateId),
        title: str(x.title),
        period: x.period === 'weekly' ? 'weekly' : 'daily',
        progress: num(x.progress),
        target: num(x.target, 1),
        completed: bool(x.completed),
        xp: num(x.xp),
      }
    }),
    stats: arr(o.stats).map((s) => {
      const x = obj(s)
      return {
        questionId: str(x.questionId),
        concept: str(x.concept),
        box: Math.min(5, Math.max(0, num(x.box))),
        attempts: num(x.attempts),
        correct: num(x.correct),
        lastDay: dayStr(x.lastDay),
        dueDay: dayStr(x.dueDay),
        promotedDay: x.promotedDay ? dayStr(x.promotedDay) : null,
      }
    }),
    certificates: arr(o.certificates).map((cc) => {
      const x = obj(cc)
      return { id: str(x.id), courseId: str(x.courseId), recipientName: str(x.recipientName), score: num(x.score), issuedAt: str(x.issuedAt), revoked: bool(x.revoked), demo: bool(x.demo) }
    }),
    activity: arr(o.activity).map((d) => {
      const x = obj(d)
      return { day: dayStr(x.day), xp: num(x.xp), activities: num(x.activities), goalMet: bool(x.goalMet) }
    }),
    counters: { revisionSessions: num(c.revisionSessions), goalDays: num(c.goalDays), friends: num(c.friends), perfectLessons: num(c.perfectLessons), perfectCheckpoints: num(c.perfectCheckpoints), missions: num(c.missions) },
  }
}

export function parsePublicProfile(v: unknown): PublicProfile {
  const o = requireObj(v, 'profile')
  return {
    userId: str(o.userId),
    username: str(o.username),
    displayName: str(o.displayName),
    avatar: str(o.avatar, 'vane'),
    bio: str(o.bio),
    level: num(o.level, 1),
    xpTotal: num(o.xpTotal),
    longestStreak: num(o.longestStreak),
    lessonsCompleted: num(o.lessonsCompleted),
    achievements: strs(o.achievements),
    completedCourses: strs(o.completedCourses),
    certificates: arr(o.certificates).map((c) => ({ id: str(obj(c).id), courseId: str(obj(c).courseId), issuedAt: str(obj(c).issuedAt) })),
    isMe: bool(o.isMe),
  }
}

export function parseVerification(v: unknown): CertificateVerification {
  const o = requireObj(v, 'certificate')
  return {
    id: str(o.id),
    status: o.status === 'revoked' ? 'revoked' : 'valid',
    recipientName: str(o.recipientName),
    courseId: str(o.courseId),
    score: num(o.score),
    issuedAt: str(o.issuedAt),
    demo: bool(o.demo),
  }
}
