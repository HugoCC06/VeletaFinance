/**
 * Central XP and level configuration. The SQL backend mirrors these numbers in
 * supabase/migrations (see `veleta_private.xp_config`); tests in
 * supabase/tests assert both stay in sync.
 */
export const XP = {
  lessonFirstCompletion: 20,
  lessonPerfectBonus: 5,
  checkpointPass: 40,
  examPass: 100,
  revisionSession: 10,
  /** Revision sessions that earn XP per day; further sessions still update mastery. */
  revisionSessionsPerDay: 3,
  dailyMission: 15,
  weeklyMission: 50,
} as const

export const MAX_LEVEL = 100

/** XP needed to go from `level` to `level + 1`. */
export function levelCost(level: number): number {
  return 100 + 50 * (level - 1)
}

/** Total XP required to reach `level` (level 1 = 0 XP). */
export function xpForLevel(level: number): number {
  const n = level - 1
  return 100 * n + 25 * n * (n - 1)
}

export const LEVEL_NAMES: [number, string][] = [
  [1, 'Curious Saver'],
  [3, 'Budget Builder'],
  [5, 'Coin Collector'],
  [7, 'Market Explorer'],
  [9, 'Chart Reader'],
  [11, 'Portfolio Apprentice'],
  [14, 'Dividend Hunter'],
  [17, 'Company Analyst'],
  [20, 'Value Seeker'],
  [24, 'Index Tracker'],
  [28, 'Bond Scholar'],
  [32, 'Risk Manager'],
  [36, 'Market Strategist'],
  [40, 'Compounding Pro'],
  [45, 'Valuation Expert'],
  [50, 'Macro Thinker'],
  [55, 'Wealth Architect'],
  [60, 'Long-Term Thinker'],
  [66, 'Market Veteran'],
  [72, 'Capital Allocator'],
  [78, 'Investing Mentor'],
  [85, 'Financial Sage'],
  [92, 'Veleta Legend'],
  [100, 'Veleta Grandmaster'],
]

export function levelName(level: number): string {
  let name = LEVEL_NAMES[0][1]
  for (const [min, n] of LEVEL_NAMES) if (level >= min) name = n
  return name
}

export interface LevelInfo {
  level: number
  name: string
  xp: number
  levelStartXp: number
  nextLevelXp: number | null
  /** 0..1 progress through the current level */
  progress: number
}

export function levelInfo(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp))
  let level = 1
  while (level < MAX_LEVEL && safe >= xpForLevel(level + 1)) level++
  const start = xpForLevel(level)
  const next = level < MAX_LEVEL ? xpForLevel(level + 1) : null
  return {
    level,
    name: levelName(level),
    xp: safe,
    levelStartXp: start,
    nextLevelXp: next,
    progress: next === null ? 1 : (safe - start) / (next - start),
  }
}

export const DAILY_GOALS = [
  { value: 1, label: 'Casual', detail: '1 activity a day' },
  { value: 2, label: 'Regular', detail: '2 activities a day' },
  { value: 3, label: 'Serious', detail: '3 activities a day' },
  { value: 5, label: 'Intense', detail: '5 activities a day' },
] as const
