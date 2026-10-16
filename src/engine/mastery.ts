/**
 * Transparent, deterministic spaced-revision model (a Leitner system).
 *
 * Every lesson question has a box from 0 to 5.
 * - First correct answer: box 1. First wrong answer: box 0.
 * - A correct answer moves the question up one box, but at most once per day
 *   (tracked by promotedDay), so answering the same question repeatedly in one
 *   sitting cannot inflate mastery. A question missed earlier the same day can
 *   still be promoted once when you get it right.
 * - A wrong answer drops it two boxes.
 * - Each box has a review interval; questions whose due day has arrived form
 *   the revision queue.
 * Mastery for a course or concept is the average box weight across ALL its
 * lesson questions (unseen questions count as 0), so it reflects coverage and
 * retention rather than activity.
 */
import { addDays, daysBetween, type Day } from './dates'

export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30] as const
export const BOX_WEIGHTS = [0, 0.4, 0.6, 0.75, 0.9, 1] as const
export const MAX_BOX = 5

export interface QuestionStat {
  questionId: string
  concept: string
  box: number
  attempts: number
  correct: number
  lastDay: Day
  dueDay: Day
  /** Day of the most recent promotion (null if never promoted). */
  promotedDay: Day | null
}

export function updateStat(prev: QuestionStat | undefined, questionId: string, concept: string, correct: boolean, today: Day): QuestionStat {
  let box: number
  let promotedDay = prev?.promotedDay ?? null
  if (!prev) box = correct ? 1 : 0
  else if (correct) box = prev.promotedDay === today ? prev.box : Math.min(MAX_BOX, prev.box + 1)
  else box = Math.max(0, prev.box - 2)
  if (correct && box > (prev?.box ?? 0)) promotedDay = today
  return {
    questionId,
    concept,
    box,
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    lastDay: today,
    dueDay: addDays(today, REVIEW_INTERVALS[box]),
    promotedDay,
  }
}

/** 0..100 mastery over a set of question ids. */
export function masteryFor(questionIds: string[], stats: Map<string, QuestionStat>): number {
  if (!questionIds.length) return 0
  let sum = 0
  for (const id of questionIds) {
    const s = stats.get(id)
    if (s) sum += BOX_WEIGHTS[s.box] ?? 0
  }
  return Math.round((sum / questionIds.length) * 100)
}

export function masteryLabel(pct: number): string {
  if (pct >= 90) return 'Mastered'
  if (pct >= 70) return 'Strong'
  if (pct >= 40) return 'Learned'
  if (pct > 0) return 'Started'
  return 'Not started'
}

export interface RevisionPick {
  questionId: string
  reason: 'missed' | 'due' | 'practice'
}

/**
 * Builds a revision session. Missed questions (box 0) come first, then due
 * questions with the lowest box, then — if the queue is short — practice
 * questions with the weakest boxes that were not already answered today.
 */
export function buildRevisionQueue(stats: QuestionStat[], today: Day, size = 8, allowedIds?: Set<string>): RevisionPick[] {
  const pool = allowedIds ? stats.filter((s) => allowedIds.has(s.questionId)) : stats
  const due = pool
    .filter((s) => daysBetween(s.dueDay, today) >= 0)
    .sort((a, b) => a.box - b.box || a.dueDay.localeCompare(b.dueDay) || a.questionId.localeCompare(b.questionId))
  const picks: RevisionPick[] = due.slice(0, size).map((s) => ({ questionId: s.questionId, reason: s.box === 0 ? 'missed' : 'due' }))
  if (picks.length < size) {
    const taken = new Set(picks.map((p) => p.questionId))
    const extra = pool
      .filter((s) => !taken.has(s.questionId) && s.lastDay !== today)
      .sort((a, b) => a.box - b.box || a.dueDay.localeCompare(b.dueDay) || a.questionId.localeCompare(b.questionId))
      .slice(0, size - picks.length)
    picks.push(...extra.map((s) => ({ questionId: s.questionId, reason: 'practice' as const })))
  }
  return picks
}

export function dueCount(stats: QuestionStat[], today: Day): number {
  return stats.filter((s) => daysBetween(s.dueDay, today) >= 0).length
}
