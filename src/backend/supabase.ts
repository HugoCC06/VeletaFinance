/**
 * SupabaseBackend — production backend. Authentication uses Supabase Auth
 * (email + password, PKCE flow); every progress-changing operation is a
 * SECURITY DEFINER Postgres function (see supabase/migrations), so the
 * browser never decides XP, scores, streaks or certificates.
 */
import { createClient, type AuthError, type PostgrestError, type SupabaseClient } from '@supabase/supabase-js'
import type { AnswerValue } from '../content/types'
import {
  BackendError,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername,
  type AssessmentResult,
  type AuthUser,
  type Backend,
  type CertificateVerification,
  type FriendEntry,
  type LeaderboardRow,
  type LessonResult,
  type OnboardingInput,
  type PreferencesPatch,
  type ProfilePatch,
  type PublicProfile,
  type RevisionResult,
  type UserState,
  type UserSummary,
} from './types'
import { parseAssessmentResult, parseLessonResult, parsePublicProfile, parseRevisionResult, parseUserState, parseVerification } from './parse'

function mapError(e: PostgrestError | AuthError | Error | null | undefined, fallback = 'Something went wrong. Please try again.'): BackendError {
  if (!e) return new BackendError('unknown', fallback)
  if (e instanceof BackendError) return e
  const code = (e as PostgrestError).code ?? ''
  const msg = e.message || fallback
  if (/Failed to fetch|NetworkError|network|fetch failed|Load failed/i.test(msg)) return new BackendError('network', 'You appear to be offline. Check your connection and try again — your answers are saved on this device.')
  switch (code) {
    case 'VL001': return new BackendError('locked', msg)
    case 'VL002': return new BackendError('validation', msg)
    case 'VL003': return new BackendError('not_found', msg)
    case 'VL004': return new BackendError('forbidden', msg)
    case 'VL005': return new BackendError('conflict', msg)
    case 'VL006': return new BackendError('rate_limited', msg)
    case '28000':
    case 'PGRST301':
    case 'PGRST303':
      return new BackendError('session_expired', 'Your session has expired. Please sign in again.')
    case '23505': return new BackendError('conflict', 'That username is already taken.')
    case '23514': return new BackendError('validation', 'Some details are not in the right format.')
    case '42501': return new BackendError('forbidden', 'You do not have permission to do that.')
  }
  const status = (e as AuthError).status
  if (status === 429) return new BackendError('rate_limited', 'Too many attempts. Please wait a moment and try again.')
  if (status && status >= 500) return new BackendError('unavailable', 'Veleta’s servers are unavailable right now. Please try again shortly.')
  if ((e as AuthError).name === 'AuthApiError' || (e as AuthError).name === 'AuthWeakPasswordError') return new BackendError('auth', msg)
  return new BackendError('unknown', msg)
}

function toUser(u: { id: string; email?: string; email_confirmed_at?: string | null } | null | undefined): AuthUser | null {
  return u ? { id: u.id, email: u.email ?? '', emailConfirmed: !!u.email_confirmed_at } : null
}

/** URL Supabase should redirect back to (keeps the deployment base path). */
export function appRedirectUrl(next: string): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}?next=${encodeURIComponent(next)}`
}

export class SupabaseBackend implements Backend {
  readonly mode = 'supabase' as const
  readonly social = true
  private sb: SupabaseClient
  private email = ''

  constructor(url: string, anonKey: string) {
    this.sb = createClient(url, anonKey, {
      auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  }

  private async rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
    try {
      const { data, error } = await this.sb.rpc(fn, args)
      if (error) throw mapError(error)
      return data as T
    } catch (e) {
      throw e instanceof BackendError ? e : mapError(e as Error)
    }
  }

  private async uid(): Promise<string> {
    const { data } = await this.sb.auth.getSession()
    const id = data.session?.user.id
    if (!id) throw new BackendError('session_expired', 'Please sign in again.')
    this.email = data.session?.user.email ?? this.email
    return id
  }

  async getUser() {
    const { data, error } = await this.sb.auth.getSession()
    if (error) throw mapError(error)
    return toUser(data.session?.user)
  }

  onAuthChange(cb: (u: AuthUser | null, event?: string) => void) {
    const { data } = this.sb.auth.onAuthStateChange((event, session) => cb(toUser(session?.user), event))
    return () => data.subscription.unsubscribe()
  }

  async signUp(email: string, password: string, displayName: string) {
    const err = validateEmail(email) ?? validatePassword(password) ?? validateDisplayName(displayName)
    if (err) throw new BackendError('validation', err)
    const { data, error } = await this.sb.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() }, emailRedirectTo: appRedirectUrl('onboarding') },
    })
    if (error) throw mapError(error)
    // With email confirmation enabled Supabase returns a user but no session.
    return { needsEmailConfirmation: !data.session }
  }

  async signIn(email: string, password: string) {
    const { error } = await this.sb.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      if (/email not confirmed/i.test(error.message)) throw new BackendError('auth', 'Please confirm your email address first — check your inbox for the link.')
      if (/invalid login credentials/i.test(error.message)) throw new BackendError('auth', 'Email or password is incorrect.')
      throw mapError(error)
    }
  }

  async signOut() {
    const { error } = await this.sb.auth.signOut()
    if (error) throw mapError(error)
  }

  async requestPasswordReset(email: string) {
    const err = validateEmail(email)
    if (err) throw new BackendError('validation', err)
    const { error } = await this.sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: appRedirectUrl('reset-password') })
    if (error) throw mapError(error)
  }

  async updatePassword(newPassword: string) {
    const err = validatePassword(newPassword)
    if (err) throw new BackendError('validation', err)
    const { error } = await this.sb.auth.updateUser({ password: newPassword })
    if (error) throw mapError(error)
  }

  async resendConfirmation(email: string) {
    const { error } = await this.sb.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: appRedirectUrl('onboarding') } })
    if (error) throw mapError(error)
  }

  async loadState(): Promise<UserState> {
    const { data } = await this.sb.auth.getSession()
    const user = toUser(data.session?.user)
    if (!user) throw new BackendError('session_expired', 'Please sign in again.')
    const raw = await this.rpc<unknown>('get_my_state')
    return parseUserState(raw, user)
  }

  async isUsernameAvailable(username: string) {
    return this.rpc<boolean>('is_username_available', { p_username: username })
  }

  async saveOnboarding(input: OnboardingInput) {
    const err = validateDisplayName(input.displayName) ?? validateUsername(input.username)
    if (err) throw new BackendError('validation', err)
    const id = await this.uid()
    const p = await this.sb.from('profiles').update({ display_name: input.displayName.trim(), username: input.username, avatar: input.avatar }).eq('id', id)
    if (p.error) throw mapError(p.error)
    const q = await this.sb
      .from('preferences')
      .update({
        experience: input.experience,
        interests: input.interests.slice(0, 8),
        daily_goal: input.dailyGoal,
        intensity: input.intensity,
        market: input.market,
        recommended_course: input.recommendedCourse,
        timezone: input.timezone,
        onboarded: true,
      })
      .eq('user_id', id)
    if (q.error) throw mapError(q.error)
  }

  async updateProfile(patch: ProfilePatch) {
    const id = await this.uid()
    const row: Record<string, unknown> = {}
    if (patch.displayName !== undefined) {
      const e = validateDisplayName(patch.displayName)
      if (e) throw new BackendError('validation', e)
      row.display_name = patch.displayName.trim()
    }
    if (patch.username !== undefined) {
      const e = validateUsername(patch.username)
      if (e) throw new BackendError('validation', e)
      row.username = patch.username
    }
    if (patch.avatar !== undefined) row.avatar = patch.avatar
    if (patch.bio !== undefined) row.bio = patch.bio.slice(0, 160)
    if (patch.isPublic !== undefined) row.is_public = patch.isPublic
    const { error } = await this.sb.from('profiles').update(row).eq('id', id)
    if (error) throw mapError(error)
  }

  async updatePreferences(patch: PreferencesPatch) {
    const id = await this.uid()
    const map: Record<string, string> = {
      experience: 'experience', interests: 'interests', dailyGoal: 'daily_goal', intensity: 'intensity', market: 'market',
      timezone: 'timezone', showOnLeaderboard: 'show_on_leaderboard', recommendedCourse: 'recommended_course',
    }
    const row: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(patch)) if (map[k] && v !== undefined) row[map[k]] = v
    const { error } = await this.sb.from('preferences').update(row).eq('user_id', id)
    if (error) throw mapError(error)
  }

  async submitLesson(lessonId: string, answers: Record<string, AnswerValue>, attemptId: string): Promise<LessonResult> {
    return parseLessonResult(await this.rpc('submit_lesson', { p_lesson_id: lessonId, p_answers: answers, p_attempt_id: attemptId }))
  }

  async submitAssessment(assessmentId: string, answers: Record<string, AnswerValue>, attemptId: string): Promise<AssessmentResult> {
    return parseAssessmentResult(await this.rpc('submit_assessment', { p_assessment_id: assessmentId, p_answers: answers, p_attempt_id: attemptId }))
  }

  async submitRevision(answers: Record<string, AnswerValue>, attemptId: string): Promise<RevisionResult> {
    return parseRevisionResult(await this.rpc('submit_revision', { p_answers: answers, p_attempt_id: attemptId }))
  }

  async searchUsers(query: string): Promise<UserSummary[]> {
    const rows = await this.rpc<{ user_id: string; username: string; display_name: string; avatar: string }[]>('search_users', { p_query: query })
    return (rows ?? []).map((r) => ({ userId: r.user_id, username: r.username, displayName: r.display_name, avatar: r.avatar }))
  }

  async listFriends(): Promise<FriendEntry[]> {
    const rows = await this.rpc<{ friendship_id: string; user_id: string; username: string; display_name: string; avatar: string; status: FriendEntry['status']; since: string }[]>('list_friends')
    return (rows ?? []).map((r) => ({ friendshipId: r.friendship_id, userId: r.user_id, username: r.username, displayName: r.display_name, avatar: r.avatar, status: r.status, since: r.since }))
  }

  async sendFriendRequest(username: string) {
    await this.rpc('send_friend_request', { p_username: username })
  }

  async respondFriendRequest(friendshipId: string, accept: boolean) {
    await this.rpc('respond_friend_request', { p_friendship_id: friendshipId, p_accept: accept })
  }

  async removeFriend(friendshipId: string) {
    await this.rpc('remove_friend', { p_friendship_id: friendshipId })
  }

  async leaderboard(period: 'week' | 'all'): Promise<LeaderboardRow[]> {
    const rows = await this.rpc<{ user_id: string; username: string; display_name: string; avatar: string; xp: number; is_me: boolean }[]>('friend_leaderboard', { p_period: period })
    return (rows ?? []).map((r) => ({ userId: r.user_id, username: r.username, displayName: r.display_name, avatar: r.avatar, xp: Number(r.xp), isMe: r.is_me }))
  }

  async getPublicProfile(username: string): Promise<PublicProfile | null> {
    const raw = await this.rpc<unknown>('get_public_profile', { p_username: username })
    return raw ? parsePublicProfile(raw) : null
  }

  async verifyCertificate(id: string): Promise<CertificateVerification | null> {
    const raw = await this.rpc<unknown>('verify_certificate', { p_id: id })
    return raw ? parseVerification(raw) : null
  }

  async deleteAccount() {
    await this.rpc('delete_my_account')
    await this.sb.auth.signOut().catch(() => undefined)
  }
}
