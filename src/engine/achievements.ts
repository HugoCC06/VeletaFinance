/**
 * Achievement definitions. Unlock conditions are evaluated by the backend
 * (veleta_private.evaluate_achievements in SQL; LocalBackend in demo mode)
 * from recorded progress — never from client claims.
 */
export interface AchievementStats {
  lessonsCompleted: number
  perfectLessons: number
  longestStreak: number
  coursesCompleted: string[]
  revisionSessions: number
  goalDays: number
  friends: number
  perfectCheckpoints: number
}

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  tone: 'violet' | 'mint' | 'sun' | 'coral' | 'sky'
  test: (s: AchievementStats) => boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_lesson', title: 'First Lesson', description: 'Complete your first lesson.', icon: 'spark', tone: 'violet', test: (s) => s.lessonsCompleted >= 1 },
  { id: 'perfect_lesson', title: 'First Perfect Quiz', description: 'Finish a lesson without a single mistake.', icon: 'target', tone: 'mint', test: (s) => s.perfectLessons >= 1 },
  { id: 'ten_lessons', title: 'Getting Serious', description: 'Complete 10 lessons.', icon: 'book', tone: 'sky', test: (s) => s.lessonsCompleted >= 10 },
  { id: 'fifty_lessons', title: 'Half-Century', description: 'Complete 50 lessons.', icon: 'stack', tone: 'sun', test: (s) => s.lessonsCompleted >= 50 },
  { id: 'streak_7', title: 'Seven-Day Streak', description: 'Meet your daily goal 7 days in a row.', icon: 'flame', tone: 'coral', test: (s) => s.longestStreak >= 7 },
  { id: 'streak_30', title: 'Thirty-Day Streak', description: 'Meet your daily goal 30 days in a row.', icon: 'flame', tone: 'sun', test: (s) => s.longestStreak >= 30 },
  { id: 'consistent', title: 'Consistent Learner', description: 'Meet your daily goal on 14 different days.', icon: 'calendar', tone: 'mint', test: (s) => s.goalDays >= 14 },
  { id: 'checkpoint_ace', title: 'Checkpoint Ace', description: 'Score 100% on a unit checkpoint.', icon: 'flag', tone: 'violet', test: (s) => s.perfectCheckpoints >= 1 },
  { id: 'revision_champion', title: 'Revision Champion', description: 'Complete 10 revision sessions.', icon: 'refresh', tone: 'sky', test: (s) => s.revisionSessions >= 10 },
  { id: 'first_course', title: 'First Course Completed', description: 'Pass a final exam and complete a course.', icon: 'trophy', tone: 'sun', test: (s) => s.coursesCompleted.length >= 1 },
  { id: 'foundations', title: 'Financial Foundations Mastered', description: 'Complete Investing Fundamentals.', icon: 'seed', tone: 'mint', test: (s) => s.coursesCompleted.includes('c1') },
  { id: 'company_analyst', title: 'Company Analyst', description: 'Complete Company Financial Analysis.', icon: 'chart', tone: 'violet', test: (s) => s.coursesCompleted.includes('c3') },
  { id: 'portfolio_builder', title: 'Portfolio Builder', description: 'Complete ETFs, Index Funds and Portfolio Construction.', icon: 'pie', tone: 'sky', test: (s) => s.coursesCompleted.includes('c4') },
  { id: 'valuation_explorer', title: 'Valuation Explorer', description: 'Complete Valuation and Company Analysis.', icon: 'scale', tone: 'coral', test: (s) => s.coursesCompleted.includes('c5') },
  { id: 'all_courses', title: 'Veleta Graduate', description: 'Complete all eight courses.', icon: 'crown', tone: 'sun', test: (s) => s.coursesCompleted.length >= 8 },
  { id: 'first_friend', title: 'Study Buddy', description: 'Add your first friend.', icon: 'users', tone: 'mint', test: (s) => s.friends >= 1 },
]

export const achievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)

export function newlyUnlocked(stats: AchievementStats, already: Set<string>): string[] {
  return ACHIEVEMENTS.filter((a) => !already.has(a.id) && a.test(stats)).map((a) => a.id)
}
