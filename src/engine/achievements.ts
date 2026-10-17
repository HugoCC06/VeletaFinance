/**
 * Achievement definitions — data, not code. Each achievement unlocks when a
 * metric reaches a threshold. The same list is seeded into the database
 * (veleta_private.achievements via `npm run content:sql`) and evaluated by the
 * server in veleta_private.evaluate_achievements, so the browser never grants
 * achievements itself. IDs are permanent: never rename or reuse one.
 */
import { COURSES } from '../content'
import { xpForLevel } from './rewards'

export type AchievementMetric =
  | 'lessons'
  | 'perfect_lessons'
  | 'streak'
  | 'goal_days'
  | 'revisions'
  | 'friends'
  | 'perfect_checkpoints'
  | 'checkpoints'
  | 'courses'
  | 'course' // completed the course in `courseId` (value 0/1)
  | 'course_lessons' // lessons completed in `courseId`
  | 'xp'
  | 'missions'
  | 'correct'
  | 'mastered'

export type AchievementCategory = 'Learning' | 'Streaks' | 'Mastery' | 'Courses' | 'Milestones' | 'Social'
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  tone: 'violet' | 'mint' | 'sun' | 'coral' | 'sky'
  category: AchievementCategory
  tier: AchievementTier
  metric: AchievementMetric
  threshold: number
  courseId?: string
}

export type AchievementStats = Record<Exclude<AchievementMetric, 'course' | 'course_lessons'>, number> & {
  coursesCompleted: string[]
  courseLessons: Record<string, number>
}

const tierFor = (i: number, n: number): AchievementTier => {
  const f = n <= 1 ? 0.5 : i / (n - 1)
  return f < 0.3 ? 'bronze' : f < 0.6 ? 'silver' : f < 0.9 ? 'gold' : 'platinum'
}

type SeriesStep = [threshold: number, id: string, title: string]
function series(
  metric: AchievementMetric,
  category: AchievementCategory,
  icon: string,
  tone: AchievementDef['tone'],
  describe: (n: number) => string,
  steps: SeriesStep[],
): AchievementDef[] {
  return steps.map(([threshold, id, title], i) => ({ id, title, description: describe(threshold), icon, tone, category, tier: tierFor(i, steps.length), metric, threshold }))
}

const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString('en-GB')} ${n === 1 ? one : many}`

/** Short names used in course achievements. */
const COURSE_BADGES: Record<string, { done: string; start: string; icon: string }> = {
  c1: { done: 'Financial Foundations Mastered', start: 'First Steps', icon: 'seed' },
  c2: { done: 'Market Insider', start: 'Opening Bell', icon: 'chart' },
  c3: { done: 'Company Analyst', start: 'Reading the Accounts', icon: 'doc' },
  c4: { done: 'Portfolio Builder', start: 'Fund Finder', icon: 'pie' },
  c5: { done: 'Valuation Explorer', start: 'Price Detective', icon: 'scale' },
  c6: { done: 'Macro Mind', start: 'Bond Curious', icon: 'bank' },
  c7: { done: 'Income Investor', start: 'Dividend Seeker', icon: 'coins' },
  c8: { done: 'Calm Trader', start: 'Chart Watcher', icon: 'brain' },
  c9: { done: 'Money Manager', start: 'Budget Beginner', icon: 'wallet' },
  c10: { done: 'Retirement Ready', start: 'Future Planner', icon: 'hourglass' },
  c11: { done: 'Property Pro', start: 'House Hunter', icon: 'house' },
  c12: { done: 'Crypto Sceptic', start: 'Block Explorer', icon: 'crypto' },
  c13: { done: 'Market Historian', start: 'Time Traveller', icon: 'scroll' },
}

const courseAchievements: AchievementDef[] = COURSES.flatMap((c) => {
  const b = COURSE_BADGES[c.id] ?? { done: `${c.title} Graduate`, start: `${c.title} Starter`, icon: c.icon }
  const legacy: Record<string, string> = { c1: 'foundations', c3: 'company_analyst', c4: 'portfolio_builder', c5: 'valuation_explorer' }
  return [
    { id: `start_${c.id}`, title: b.start, description: `Complete your first lesson in ${c.title}.`, icon: b.icon, tone: 'sky' as const, category: 'Courses' as const, tier: 'bronze' as const, metric: 'course_lessons' as const, threshold: 1, courseId: c.id },
    { id: legacy[c.id] ?? `complete_${c.id}`, title: b.done, description: `Complete ${c.title} and pass its final exam.`, icon: b.icon, tone: 'sun' as const, category: 'Courses' as const, tier: 'gold' as const, metric: 'course' as const, threshold: 1, courseId: c.id },
  ]
})

export const ACHIEVEMENTS: AchievementDef[] = [
  ...series('lessons', 'Learning', 'book', 'violet', (n) => `Complete ${plural(n, 'lesson')}.`, [
    [1, 'first_lesson', 'First Lesson'],
    [3, 'lessons_3', 'Warming Up'],
    [5, 'lessons_5', 'High Five'],
    [10, 'ten_lessons', 'Getting Serious'],
    [20, 'lessons_20', 'Page Turner'],
    [30, 'lessons_30', 'Bookworm'],
    [50, 'fifty_lessons', 'Half-Century'],
    [75, 'lessons_75', 'Seventy-Five Strong'],
    [100, 'lessons_100', 'Centurion'],
    [125, 'lessons_125', 'Library Card Holder'],
  ]),
  ...series('perfect_lessons', 'Mastery', 'target', 'mint', (n) => `Finish ${plural(n, 'lesson')} without a single mistake.`, [
    [1, 'perfect_lesson', 'First Perfect Quiz'],
    [5, 'perfect_5', 'Sharpshooter'],
    [10, 'perfect_10', 'Flawless Ten'],
    [25, 'perfect_25', 'Precision Investor'],
    [50, 'perfect_50', 'Perfectionist'],
    [100, 'perfect_100', 'Unerring'],
  ]),
  ...series('streak', 'Streaks', 'flame', 'coral', (n) => `Meet your daily goal ${n} days in a row.`, [
    [3, 'streak_3', 'Spark'],
    [7, 'streak_7', 'Seven-Day Streak'],
    [14, 'streak_14', 'Fortnight of Focus'],
    [21, 'streak_21', 'Habit Formed'],
    [30, 'streak_30', 'Thirty-Day Streak'],
    [50, 'streak_50', 'Half-Hundred Flame'],
    [75, 'streak_75', 'Unstoppable'],
    [100, 'streak_100', 'Hundred-Day Hero'],
    [180, 'streak_180', 'Half-Year Hustle'],
    [365, 'streak_365', 'Year of Learning'],
  ]),
  ...series('goal_days', 'Streaks', 'calendar', 'mint', (n) => `Meet your daily goal on ${n} different days.`, [
    [7, 'goal_days_7', 'Good Week'],
    [14, 'consistent', 'Consistent Learner'],
    [30, 'goal_days_30', 'Monthly Regular'],
    [60, 'goal_days_60', 'Dedicated'],
    [100, 'goal_days_100', 'Hundred Good Days'],
    [200, 'goal_days_200', 'Lifelong Learner'],
  ]),
  ...series('revisions', 'Mastery', 'refresh', 'sky', (n) => `Complete ${plural(n, 'revision session')}.`, [
    [1, 'revision_1', 'Look Back'],
    [5, 'revision_5', 'Refresher'],
    [10, 'revision_champion', 'Revision Champion'],
    [25, 'revision_25', 'Memory Builder'],
    [50, 'revision_50', 'Spaced Repetition Pro'],
    [100, 'revision_100', 'Long-Term Memory'],
    [250, 'revision_250', 'Total Recall'],
  ]),
  ...series('correct', 'Mastery', 'check', 'mint', (n) => `Answer ${plural(n, 'question')} correctly.`, [
    [10, 'correct_10', 'Off the Mark'],
    [50, 'correct_50', 'Quick Thinker'],
    [100, 'correct_100', 'Century of Answers'],
    [250, 'correct_250', 'Knowledge Bank'],
    [500, 'correct_500', 'Quiz Whiz'],
    [1000, 'correct_1000', 'Thousand-Answer Club'],
    [2500, 'correct_2500', 'Walking Encyclopedia'],
    [5000, 'correct_5000', 'Oracle'],
  ]),
  ...series('mastered', 'Mastery', 'diamond', 'violet', (n) => `Fully master ${plural(n, 'question')} through spaced revision.`, [
    [1, 'mastered_1', 'Locked In'],
    [10, 'mastered_10', 'Firm Grasp'],
    [50, 'mastered_50', 'Deep Roots'],
    [100, 'mastered_100', 'Rock Solid'],
    [250, 'mastered_250', 'Master Mind'],
    [500, 'mastered_500', 'Grand Master'],
  ]),
  ...series('perfect_checkpoints', 'Mastery', 'flag', 'violet', (n) => `Score 100% on ${plural(n, 'unit checkpoint')}.`, [
    [1, 'checkpoint_ace', 'Checkpoint Ace'],
    [3, 'perfect_cp_3', 'Hat-Trick'],
    [10, 'perfect_cp_10', 'Checkpoint Royalty'],
  ]),
  ...series('checkpoints', 'Learning', 'flag', 'sky', (n) => `Pass ${plural(n, 'unit checkpoint')}.`, [
    [1, 'checkpoints_1', 'First Checkpoint'],
    [3, 'checkpoints_3', 'Unit Hopper'],
    [6, 'checkpoints_6', 'Steady Progress'],
    [12, 'checkpoints_12', 'Milestone Maker'],
    [24, 'checkpoints_24', 'Road Warrior'],
    [39, 'checkpoints_39', 'Every Checkpoint'],
  ]),
  ...series('courses', 'Courses', 'graduation', 'sun', (n) => (n === 1 ? 'Pass a final exam and complete a course.' : `Complete ${n} courses.`), [
    [1, 'first_course', 'First Course Completed'],
    [3, 'courses_3', 'Triple Graduate'],
    [5, 'courses_5', 'High Achiever'],
    [8, 'courses_8', 'Scholar'],
    [COURSES.length, 'all_courses', 'Veleta Graduate'],
  ]),
  ...courseAchievements,
  ...series('xp', 'Milestones', 'bolt', 'sun', (n) => `Earn ${n.toLocaleString('en-GB')} XP.`, [
    [100, 'xp_100', 'Pocket Change'],
    [500, 'xp_500', 'Saving Up'],
    [1000, 'xp_1000', 'Four Figures'],
    [2500, 'xp_2500', 'Growing Pot'],
    [5000, 'xp_5000', 'Compounding'],
    [10000, 'xp_10000', 'Five Figures'],
    [25000, 'xp_25000', 'Serious Capital'],
    [50000, 'xp_50000', 'Big League'],
  ]),
  ...series('xp', 'Milestones', 'crown', 'violet', () => '', [
    [xpForLevel(5), 'level_5', 'Level 5'],
    [xpForLevel(10), 'level_10', 'Level 10'],
    [xpForLevel(15), 'level_15', 'Level 15'],
    [xpForLevel(20), 'level_20', 'Level 20'],
    [xpForLevel(30), 'level_30', 'Level 30'],
    [xpForLevel(40), 'level_40', 'Level 40'],
    [xpForLevel(50), 'level_50', 'Level 50'],
    [xpForLevel(75), 'level_75', 'Level 75'],
    [xpForLevel(100), 'level_100', 'Level 100'],
  ]).map((a) => ({ ...a, description: `Reach ${a.title.toLowerCase()} (${a.threshold.toLocaleString('en-GB')} XP).` })),
  ...series('missions', 'Milestones', 'target', 'coral', (n) => `Complete ${plural(n, 'mission')}.`, [
    [1, 'missions_1', 'Mission Accepted'],
    [10, 'missions_10', 'On a Mission'],
    [25, 'missions_25', 'Task Master'],
    [50, 'missions_50', 'Mission Specialist'],
    [100, 'missions_100', 'Mission Control'],
    [250, 'missions_250', 'Mission Legend'],
  ]),
  ...series('friends', 'Social', 'users', 'mint', (n) => (n === 1 ? 'Add your first friend.' : `Have ${n} friends on Veleta.`), [
    [1, 'first_friend', 'Study Buddy'],
    [3, 'friends_3', 'Study Group'],
    [5, 'friends_5', 'Investment Club'],
    [10, 'friends_10', 'Popular Investor'],
    [25, 'friends_25', 'Community Builder'],
  ]),
]

export const achievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)

export function metricValue(a: AchievementDef, s: AchievementStats): number {
  if (a.metric === 'course') return a.courseId && s.coursesCompleted.includes(a.courseId) ? 1 : 0
  if (a.metric === 'course_lessons') return (a.courseId && s.courseLessons[a.courseId]) || 0
  return s[a.metric] ?? 0
}

export function newlyUnlocked(stats: AchievementStats, already: Set<string>): string[] {
  return ACHIEVEMENTS.filter((a) => !already.has(a.id) && metricValue(a, stats) >= a.threshold).map((a) => a.id)
}

export function emptyStats(): AchievementStats {
  return { lessons: 0, perfect_lessons: 0, streak: 0, goal_days: 0, revisions: 0, friends: 0, perfect_checkpoints: 0, checkpoints: 0, courses: 0, xp: 0, missions: 0, correct: 0, mastered: 0, coursesCompleted: [], courseLessons: {} }
}
