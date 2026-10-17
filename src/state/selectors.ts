import type { UserState } from '../backend/types'
import type { ProgressSnapshot } from '../engine/progression'
import { COURSES, courseLessonQuestionIds } from '../content'
import { masteryFor, type QuestionStat } from '../engine/mastery'
import { courseProgress, nextStep } from '../engine/progression'

export function snapshotFromState(state: UserState | null): ProgressSnapshot {
  return {
    completedLessons: new Set(state ? Object.keys(state.lessons) : []),
    passedAssessments: new Set(state ? Object.values(state.assessments).filter((a) => a.passed).map((a) => a.assessmentId) : []),
  }
}

export function statMap(state: UserState | null): Map<string, QuestionStat> {
  return new Map((state?.stats ?? []).map((s) => [s.questionId, s]))
}

export function courseMastery(state: UserState | null, courseId: string): number {
  const c = COURSES.find((x) => x.id === courseId)
  return c ? masteryFor(courseLessonQuestionIds(c), statMap(state)) : 0
}

/** The course the learner should continue: most recently active unfinished course, else the recommended one. */
export function currentCourse(state: UserState | null) {
  const snap = snapshotFromState(state)
  const lastLesson = Object.values(state?.lessons ?? {}).sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0]
  const fromLast = lastLesson ? COURSES.find((c) => lastLesson.lessonId.startsWith(`${c.id}-`)) : undefined
  if (fromLast && !courseProgress(fromLast, snap).complete) return fromLast
  const rec = COURSES.find((c) => c.id === state?.prefs.recommendedCourse)
  if (rec && !courseProgress(rec, snap).complete) return rec
  return COURSES.find((c) => !courseProgress(c, snap).complete) ?? COURSES[0]
}

export function nextFor(state: UserState | null) {
  const course = currentCourse(state)
  return { course, step: nextStep(course, snapshotFromState(state)) }
}

/** Achievement metrics derived from the loaded state (used to show progress towards locked achievements). */
export function achievementStatsFromState(state: UserState): import('../engine/achievements').AchievementStats {
  const courseLessons: Record<string, number> = {}
  for (const id of Object.keys(state.lessons)) {
    const c = id.split('-')[0]
    courseLessons[c] = (courseLessons[c] ?? 0) + 1
  }
  const coursesCompleted = state.certificates.filter((c) => !c.revoked).map((c) => c.courseId)
  return {
    lessons: Object.keys(state.lessons).length,
    perfect_lessons: state.counters.perfectLessons,
    streak: Math.max(state.streak.longest, state.streak.current),
    goal_days: state.counters.goalDays,
    revisions: state.counters.revisionSessions,
    friends: state.counters.friends,
    perfect_checkpoints: state.counters.perfectCheckpoints,
    checkpoints: Object.values(state.assessments).filter((a) => a.passed && a.assessmentId.endsWith('-cp')).length,
    courses: coursesCompleted.length,
    xp: state.xp.total,
    missions: state.counters.missions,
    correct: state.stats.reduce((n, s) => n + s.correct, 0),
    mastered: state.stats.filter((s) => s.box >= 5).length,
    coursesCompleted,
    courseLessons,
  }
}
