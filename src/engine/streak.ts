/**
 * Daily streak rules (documented in docs/GAME_RULES.md):
 * - A learning day is a calendar day in the learner's time zone.
 * - The streak counts days on which the daily goal was met.
 * - Meeting the goal again on the same day changes nothing.
 * - Missed days are covered by streak freezes, one per missed day, if enough
 *   are held; otherwise the streak restarts at 1.
 * - A freeze is earned every 7 streak days (max held: MAX_FREEZES). New
 *   learners start with STARTER_FREEZES.
 * - Each missed day can consume at most one freeze (tracked in frozenDays).
 */
import { addDays, daysBetween, type Day } from './dates'

export const MAX_FREEZES = 2
export const STARTER_FREEZES = 1
export const FREEZE_EVERY = 7

export interface StreakState {
  current: number
  longest: number
  lastDay: Day | null
  freezes: number
  frozenDays: Day[]
}

export const initialStreak = (): StreakState => ({ current: 0, longest: 0, lastDay: null, freezes: STARTER_FREEZES, frozenDays: [] })

export interface StreakUpdate {
  state: StreakState
  extended: boolean
  reset: boolean
  freezesUsed: Day[]
  freezeEarned: boolean
}

export function recordGoalMet(prev: StreakState, day: Day): StreakUpdate {
  const s: StreakState = { ...prev, frozenDays: [...prev.frozenDays] }
  const none = { state: prev, extended: false, reset: false, freezesUsed: [], freezeEarned: false }
  if (s.lastDay !== null && daysBetween(s.lastDay, day) <= 0) return none // same day or clock went backwards

  let reset = false
  const freezesUsed: Day[] = []
  if (s.lastDay === null) {
    s.current = 1
  } else {
    const missed = daysBetween(s.lastDay, day) - 1
    if (missed === 0) s.current += 1
    else if (missed <= s.freezes) {
      for (let i = 1; i <= missed; i++) {
        const d = addDays(s.lastDay, i)
        if (!s.frozenDays.includes(d)) {
          s.frozenDays.push(d)
          freezesUsed.push(d)
        }
      }
      s.freezes -= freezesUsed.length
      s.current += 1
    } else {
      s.current = 1
      reset = true
    }
  }
  s.lastDay = day
  let freezeEarned = false
  if (s.current % FREEZE_EVERY === 0 && s.freezes < MAX_FREEZES) {
    s.freezes += 1
    freezeEarned = true
  }
  s.longest = Math.max(s.longest, s.current)
  s.frozenDays = s.frozenDays.slice(-60)
  return { state: s, extended: true, reset, freezesUsed, freezeEarned }
}

export interface StreakView {
  /** Streak as it stands today (0 if it has lapsed beyond available freezes). */
  current: number
  longest: number
  freezes: number
  doneToday: boolean
  /** Days missed so far that a freeze would need to cover. */
  missedDays: number
}

export function viewStreak(s: StreakState, today: Day): StreakView {
  if (!s.lastDay) return { current: 0, longest: s.longest, freezes: s.freezes, doneToday: false, missedDays: 0 }
  const gap = daysBetween(s.lastDay, today)
  const missed = Math.max(0, gap - 1)
  const alive = gap <= 1 || missed <= s.freezes
  return { current: alive ? s.current : 0, longest: s.longest, freezes: s.freezes, doneToday: gap === 0, missedDays: missed }
}
