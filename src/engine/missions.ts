/**
 * Daily and weekly missions. Missions are generated deterministically from
 * templates and the learner's calendar day / ISO week, so they never reshuffle
 * mid-day. Progress is advanced by backend-recorded events only.
 */
import { daysBetween, weekStart, type Day } from './dates'

export type MissionMetric = 'lessons' | 'revisions' | 'correct' | 'perfect' | 'checkpoints' | 'goal_days'

export interface MissionTemplate {
  id: string
  period: 'daily' | 'weekly'
  metric: MissionMetric
  target: number
  title: string
}

export const MISSION_TEMPLATES: MissionTemplate[] = [
  { id: 'd_lessons2', period: 'daily', metric: 'lessons', target: 2, title: 'Complete 2 lessons' },
  { id: 'd_revise1', period: 'daily', metric: 'revisions', target: 1, title: 'Finish a revision session' },
  { id: 'd_correct15', period: 'daily', metric: 'correct', target: 15, title: 'Answer 15 questions right first time' },
  { id: 'd_perfect1', period: 'daily', metric: 'perfect', target: 1, title: 'Finish a lesson with no mistakes' },
  { id: 'w_lessons8', period: 'weekly', metric: 'lessons', target: 8, title: 'Complete 8 lessons this week' },
  { id: 'w_revise4', period: 'weekly', metric: 'revisions', target: 4, title: 'Finish 4 revision sessions this week' },
  { id: 'w_checkpoint1', period: 'weekly', metric: 'checkpoints', target: 1, title: 'Pass a unit checkpoint this week' },
  { id: 'w_goal5', period: 'weekly', metric: 'goal_days', target: 5, title: 'Meet your daily goal on 5 days' },
]

const tpl = (id: string) => MISSION_TEMPLATES.find((t) => t.id === id)!

export const DAILY_ROTATION = [
  ['d_lessons2', 'd_revise1', 'd_correct15'],
  ['d_lessons2', 'd_perfect1', 'd_revise1'],
  ['d_lessons2', 'd_correct15', 'd_perfect1'],
]
export const WEEKLY_ROTATION = [
  ['w_lessons8', 'w_goal5', 'w_revise4'],
  ['w_lessons8', 'w_goal5', 'w_checkpoint1'],
]

const EPOCH = '2024-01-01' // a Monday

export interface MissionSlot {
  /** Unique per learner per period, e.g. 'daily:2026-10-16:d_lessons2' */
  key: string
  template: MissionTemplate
  periodStart: Day
}

export function missionsFor(today: Day): MissionSlot[] {
  const dayIdx = ((daysBetween(EPOCH, today) % 3) + 3) % 3
  const ws = weekStart(today)
  const weekIdx = ((Math.floor(daysBetween(EPOCH, ws) / 7) % 2) + 2) % 2
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
