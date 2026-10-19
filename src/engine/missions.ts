/**
 * Daily and weekly missions. Missions are generated deterministically from
 * templates and the learner's calendar day / ISO week, so they never reshuffle
 * mid-day. Progress is advanced by backend-recorded events only.
 */
import { daysBetween, weekStart, type Day } from './dates'

/**
 * - lessons: lesson completions (replays count)
 * - new_lessons: lessons completed for the first time
 * - activities: lessons, revision sessions and assessments
 * - xp: XP earned, not counting XP from missions themselves
 */
export type MissionMetric = 'lessons' | 'new_lessons' | 'revisions' | 'correct' | 'perfect' | 'checkpoints' | 'goal_days' | 'activities' | 'xp'

export interface MissionTemplate {
  id: string
  period: 'daily' | 'weekly'
  metric: MissionMetric
  target: number
  title: string
}

const d = (id: string, metric: MissionMetric, target: number, title: string): MissionTemplate => ({ id, period: 'daily', metric, target, title })
const w = (id: string, metric: MissionMetric, target: number, title: string): MissionTemplate => ({ id, period: 'weekly', metric, target, title })

export const MISSION_TEMPLATES: MissionTemplate[] = [
  d('d_lessons1', 'lessons', 1, 'Complete a lesson'),
  d('d_lessons2', 'lessons', 2, 'Complete 2 lessons'),
  d('d_lessons3', 'lessons', 3, 'Complete 3 lessons'),
  d('d_new1', 'new_lessons', 1, 'Finish a lesson you haven’t done before'),
  d('d_new2', 'new_lessons', 2, 'Finish 2 lessons you haven’t done before'),
  d('d_revise1', 'revisions', 1, 'Finish a revision session'),
  d('d_revise2', 'revisions', 2, 'Finish 2 revision sessions'),
  d('d_correct10', 'correct', 10, 'Answer 10 questions right first time'),
  d('d_correct15', 'correct', 15, 'Answer 15 questions right first time'),
  d('d_correct25', 'correct', 25, 'Answer 25 questions right first time'),
  d('d_perfect1', 'perfect', 1, 'Finish a lesson with no mistakes'),
  d('d_perfect2', 'perfect', 2, 'Finish 2 lessons with no mistakes'),
  d('d_activities2', 'activities', 2, 'Do 2 activities: lessons, revision or checkpoints'),
  d('d_activities3', 'activities', 3, 'Do 3 activities: lessons, revision or checkpoints'),
  d('d_xp30', 'xp', 30, 'Earn 30 XP'),
  d('d_xp50', 'xp', 50, 'Earn 50 XP'),
  d('d_goal1', 'goal_days', 1, 'Meet your daily goal'),

  w('w_lessons5', 'lessons', 5, 'Complete 5 lessons this week'),
  w('w_lessons8', 'lessons', 8, 'Complete 8 lessons this week'),
  w('w_lessons12', 'lessons', 12, 'Complete 12 lessons this week'),
  w('w_new4', 'new_lessons', 4, 'Finish 4 new lessons this week'),
  w('w_new8', 'new_lessons', 8, 'Finish 8 new lessons this week'),
  w('w_revise3', 'revisions', 3, 'Finish 3 revision sessions this week'),
  w('w_revise4', 'revisions', 4, 'Finish 4 revision sessions this week'),
  w('w_revise6', 'revisions', 6, 'Finish 6 revision sessions this week'),
  w('w_checkpoint1', 'checkpoints', 1, 'Pass a unit checkpoint this week'),
  w('w_checkpoint2', 'checkpoints', 2, 'Pass 2 unit checkpoints this week'),
  w('w_goal3', 'goal_days', 3, 'Meet your daily goal on 3 days'),
  w('w_goal5', 'goal_days', 5, 'Meet your daily goal on 5 days'),
  w('w_goal7', 'goal_days', 7, 'Meet your daily goal every day this week'),
  w('w_correct75', 'correct', 75, 'Answer 75 questions right first time this week'),
  w('w_correct150', 'correct', 150, 'Answer 150 questions right first time this week'),
  w('w_perfect3', 'perfect', 3, 'Finish 3 lessons with no mistakes this week'),
  w('w_xp300', 'xp', 300, 'Earn 300 XP this week'),
  w('w_xp600', 'xp', 600, 'Earn 600 XP this week'),
  w('w_activities10', 'activities', 10, 'Do 10 activities this week'),
]

const tpl = (id: string) => MISSION_TEMPLATES.find((t) => t.id === id)!

/**
 * One set per day, cycling every two weeks. Each set starts with an easy
 * mission anyone can finish, then two different kinds of challenge.
 */
export const DAILY_ROTATION = [
  ['d_lessons2', 'd_revise1', 'd_correct15'],
  ['d_lessons1', 'd_perfect1', 'd_xp30'],
  ['d_activities2', 'd_new1', 'd_correct10'],
  ['d_goal1', 'd_lessons3', 'd_perfect1'],
  ['d_lessons1', 'd_revise1', 'd_xp50'],
  ['d_activities2', 'd_correct25', 'd_new1'],
  ['d_lessons2', 'd_perfect2', 'd_revise1'],
  ['d_goal1', 'd_new2', 'd_correct15'],
  ['d_lessons1', 'd_activities3', 'd_perfect1'],
  ['d_activities2', 'd_revise2', 'd_xp30'],
  ['d_lessons2', 'd_new1', 'd_correct25'],
  ['d_goal1', 'd_perfect1', 'd_xp50'],
  ['d_lessons1', 'd_correct10', 'd_revise1'],
  ['d_activities2', 'd_lessons3', 'd_new1'],
]
/** One set per week, cycling every eight weeks. */
export const WEEKLY_ROTATION = [
  ['w_lessons8', 'w_goal5', 'w_revise4'],
  ['w_lessons5', 'w_goal3', 'w_checkpoint1'],
  ['w_new4', 'w_xp300', 'w_perfect3'],
  ['w_lessons12', 'w_goal5', 'w_correct75'],
  ['w_activities10', 'w_revise3', 'w_checkpoint1'],
  ['w_new8', 'w_goal7', 'w_perfect3'],
  ['w_lessons8', 'w_xp600', 'w_revise6'],
  ['w_lessons5', 'w_correct150', 'w_checkpoint2'],
]

const EPOCH = '2024-01-01' // a Monday

export interface MissionSlot {
  /** Unique per learner per period, e.g. 'daily:2026-10-16:d_lessons2' */
  key: string
  template: MissionTemplate
  periodStart: Day
}

export function missionsFor(today: Day): MissionSlot[] {
  const nd = DAILY_ROTATION.length
  const nw = WEEKLY_ROTATION.length
  const dayIdx = ((daysBetween(EPOCH, today) % nd) + nd) % nd
  const ws = weekStart(today)
  const weekIdx = ((Math.floor(daysBetween(EPOCH, ws) / 7) % nw) + nw) % nw
  return [
    ...DAILY_ROTATION[dayIdx].map((id) => ({ key: `daily:${today}:${id}`, template: tpl(id), periodStart: today })),
    ...WEEKLY_ROTATION[weekIdx].map((id) => ({ key: `weekly:${ws}:${id}`, template: tpl(id), periodStart: ws })),
  ]
}

export type MissionEvent = Partial<Record<MissionMetric, number>>

export interface MissionProgress {
  key: string
  templateId: string
  progress: number
  target: number
  completed: boolean
}

/** Applies an event; returns updated progress and keys of missions completed by this event. */
export function applyMissionEvent(
  today: Day,
  current: Record<string, MissionProgress>,
  event: MissionEvent,
): { next: Record<string, MissionProgress>; completed: MissionSlot[] } {
  const next = { ...current }
  const completed: MissionSlot[] = []
  for (const slot of missionsFor(today)) {
    const prev = next[slot.key] ?? { key: slot.key, templateId: slot.template.id, progress: 0, target: slot.template.target, completed: false }
    const inc = event[slot.template.metric] ?? 0
    if (!inc || prev.completed) { next[slot.key] = prev; continue }
    const progress = Math.min(slot.template.target, prev.progress + inc)
    const done = progress >= slot.template.target
    next[slot.key] = { ...prev, progress, completed: done }
    if (done) completed.push(slot)
  }
  return { next, completed }
}
