import type { AnswerValue } from '../content/types'
import type { Day } from '../engine/dates'
import type { QuestionStat } from '../engine/mastery'
import type { StreakView } from '../engine/streak'

export type BackendMode = 'supabase' | 'local'

export interface AuthUser {
  id: string
  email: string
  emailConfirmed: boolean
}

export interface Profile {
  userId: string
  username: string
  displayName: string
  avatar: string
  bio: string
  isPublic: boolean
  createdAt: string
}

export type Experience = 'none' | 'some' | 'experienced'
export type Intensity = 'relaxed' | 'balanced' | 'challenge'

export interface Preferences {
  experience: Experience
  interests: string[]
  dailyGoal: number
  intensity: Intensity
  market: 'uk' | 'us' | 'both'
  timezone: string
  onboarded: boolean
  showOnLeaderboard: boolean
  recommendedCourse: string | null
}

export interface LessonRecord {
  lessonId: string
  completedAt: string
  firstAccuracy: number
  bestAccuracy: number
  completions: number
}

export interface AssessmentRecord {
  assessmentId: string
  attempts: number
  passed: boolean
  bestScore: number
  lastScore: number
  lastAttemptAt: string
  passedAt: string | null
}

export interface CertificateRecord {
  id: string
  courseId: string
  recipientName: string
  score: number
  issuedAt: string
  revoked: boolean
  /** True for certificates issued in local demo mode (not verifiable). */
  demo: boolean
}

export interface MissionState {
  key: string
  templateId: string
  title: string
  period: 'daily' | 'weekly'
  progress: number
  target: number
  completed: boolean
  xp: number
}

export interface DayActivity {
  day: Day
  xp: number
  activities: number
  goalMet: boolean
}

export interface UserState {
  user: AuthUser
  profile: Profile
  prefs: Preferences
  today: Day
  xp: { total: number; today: number; week: number }
  streak: StreakView
  todayActivities: number
  lessons: Record<string, LessonRecord>
  assessments: Record<string, AssessmentRecord>
  achievements: Record<string, string>
  missions: MissionState[]
  stats: QuestionStat[]
  certificates: CertificateRecord[]
  activity: DayActivity[]
  counters: { revisionSessions: number; goalDays: number; friends: number }
}

export interface RewardSummary {
  xpAwarded: number
  xpBreakdown: { label: string; amount: number }[]
  totalXp: number
  streak: { current: number; extended: boolean; freezesUsed: number; freezeEarned: boolean }
  goalMetNow: boolean
  newAchievements: string[]
  missionsCompleted: string[]
}

export interface LessonResult extends RewardSummary {
  firstCompletion: boolean
  correct: number
  total: number
  perfect: boolean
}

export interface AssessmentResult extends RewardSummary {
  attemptId: string
  score: number
  correct: number
  total: number
  passed: boolean
  passMark: number
  /** Per-question correctness — returned for checkpoints only; exams return missed concepts instead. */
  results: Record<string, boolean> | null
  missedConcepts: string[]
  courseCompleted: boolean
  certificateId: string | null
}

export interface RevisionResult extends RewardSummary {
  correct: number
  total: number
  results: Record<string, boolean>
}

export interface UserSummary {
  userId: string
  username: string
  displayName: string
  avatar: string
}

export interface FriendEntry extends UserSummary {
  friendshipId: string
  status: 'accepted' | 'incoming' | 'outgoing'
  since: string
}

export interface LeaderboardRow extends UserSummary {
  xp: number
  isMe: boolean
}

export interface PublicProfile extends UserSummary {
  bio: string
  level: number
  xpTotal: number
  longestStreak: number
  lessonsCompleted: number
  achievements: string[]
  completedCourses: string[]
  certificates: { id: string; courseId: string; issuedAt: string }[]
  isMe: boolean
}

export interface CertificateVerification {
  id: string
  status: 'valid' | 'revoked'
  recipientName: string
  courseId: string
  score: number
  issuedAt: string
  demo: boolean
}

export interface OnboardingInput {
  displayName: string
  username: string
  avatar: string
  experience: Experience
  interests: string[]
  dailyGoal: number
  intensity: Intensity
  market: 'uk' | 'us' | 'both'
  recommendedCourse: string | null
  timezone: string
}

export type ProfilePatch = Partial<Pick<Profile, 'displayName' | 'username' | 'avatar' | 'bio' | 'isPublic'>>
export type PreferencesPatch = Partial<Omit<Preferences, 'onboarded'>>

export interface Backend {
  readonly mode: BackendMode
  /** Whether friends, leaderboards and public profiles are available. */
  readonly social: boolean
  getUser(): Promise<AuthUser | null>
  onAuthChange(cb: (user: AuthUser | null, event?: string) => void): () => void
  signUp(email: string, password: string, displayName: string): Promise<{ needsEmailConfirmation: boolean }>
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  updatePassword(newPassword: string): Promise<void>
  resendConfirmation(email: string): Promise<void>

  loadState(): Promise<UserState>
  saveOnboarding(input: OnboardingInput): Promise<void>
  updateProfile(patch: ProfilePatch): Promise<void>
  updatePreferences(patch: PreferencesPatch): Promise<void>
  isUsernameAvailable(username: string): Promise<boolean>

  submitLesson(lessonId: string, answers: Record<string, AnswerValue>, attemptId: string): Promise<LessonResult>
  submitAssessment(assessmentId: string, answers: Record<string, AnswerValue>, attemptId: string): Promise<AssessmentResult>
  submitRevision(answers: Record<string, AnswerValue>, attemptId: string): Promise<RevisionResult>

  searchUsers(query: string): Promise<UserSummary[]>
  listFriends(): Promise<FriendEntry[]>
  sendFriendRequest(username: string): Promise<void>
  respondFriendRequest(friendshipId: string, accept: boolean): Promise<void>
  removeFriend(friendshipId: string): Promise<void>
  leaderboard(period: 'week' | 'all'): Promise<LeaderboardRow[]>
  getPublicProfile(username: string): Promise<PublicProfile | null>

  verifyCertificate(id: string): Promise<CertificateVerification | null>
  deleteAccount(): Promise<void>
}

export type BackendErrorCode =
  | 'network'
  | 'auth'
  | 'session_expired'
  | 'not_found'
  | 'forbidden'
  | 'validation'
  | 'conflict'
  | 'rate_limited'
  | 'unavailable'
  | 'unsupported'
  | 'locked'
  | 'unknown'

export class BackendError extends Error {
  readonly code: BackendErrorCode
  constructor(code: BackendErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'BackendError'
  }
}

export const USERNAME_RE = /^[a-z0-9_]{3,20}$/

export function validateUsername(u: string): string | null {
  if (!USERNAME_RE.test(u)) return 'Use 3–20 lowercase letters, numbers or underscores.'
  return null
}

export function validateDisplayName(n: string): string | null {
  const t = n.trim()
  if (t.length < 1 || t.length > 40) return 'Display name must be 1–40 characters.'
  if (/[<>]/.test(t)) return 'Display name cannot contain < or >.'
  return null
}

export function validatePassword(p: string): string | null {
  if (p.length < 8) return 'Use at least 8 characters.'
  if (p.length > 72) return 'Use at most 72 characters.'
  return null
}

export function validateEmail(e: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()) ? null : 'Enter a valid email address.'
}
