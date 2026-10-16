/**
 * LocalBackend — Veleta's demo mode, used when no Supabase project is
 * configured. Everything is stored in this browser's localStorage, which the
 * UI states clearly. Rules are identical to the server (see ./rules.ts), but
 * because the browser controls the data, demo-mode certificates are marked as
 * demo credentials and cannot be verified by anyone else.
 */
import type { AnswerValue } from '../content/types'
import { localTimeZone } from '../engine/dates'
import { levelInfo } from '../engine/rewards'
import {
  buildState,
  newLearner,
  processAssessment,
  processLesson,
  processRevision,
  type LearnerRecord,
} from './rules'
import {
  BackendError,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername,
  type AuthUser,
  type Backend,
  type CertificateVerification,
  type OnboardingInput,
  type PreferencesPatch,
  type ProfilePatch,
  type PublicProfile,
} from './types'

const STORE_KEY = 'veleta.demo.v1'

interface StoredAccount {
  record: LearnerRecord
  salt: string
  hash: string
}

interface Store {
  accounts: Record<string, StoredAccount>
  sessionUserId: string | null
}

export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function memoryStorage(): KeyValueStorage {
  const m = new Map<string, string>()
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }
}

function defaultStorage(): KeyValueStorage {
  try {
    const t = '__veleta_test__'
    window.localStorage.setItem(t, t)
    window.localStorage.removeItem(t)
    return window.localStorage
  } catch {
    return memoryStorage()
  }
}

function randomHex(bytes: number): string {
  const a = new Uint8Array(bytes)
  crypto.getRandomValues(a)
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100_000, hash: 'SHA-256' }, key, 256)
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const CERT_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function demoCertificateId(): string {
  const a = new Uint8Array(8)
  crypto.getRandomValues(a)
  const chars = [...a].map((b) => CERT_ALPHABET[b % CERT_ALPHABET.length]).join('')
  return `DEMO-${chars.slice(0, 4)}-${chars.slice(4)}`
}

export class LocalBackend implements Backend {
  readonly mode = 'local' as const
  readonly social = false
  private listeners = new Set<(u: AuthUser | null, e?: string) => void>()
  private storage: KeyValueStorage
  private clock: () => Date

  constructor(opts: { storage?: KeyValueStorage; clock?: () => Date } = {}) {
    this.storage = opts.storage ?? defaultStorage()
    this.clock = opts.clock ?? (() => new Date())
  }

  private read(): Store {
    try {
      const raw = this.storage.getItem(STORE_KEY)
      if (raw) {
        const s = JSON.parse(raw) as Store
        if (s && typeof s === 'object' && s.accounts) return s
      }
    } catch {
      /* corrupted storage: start fresh rather than crash */
    }
    return { accounts: {}, sessionUserId: null }
  }

  private write(s: Store) {
    try {
      this.storage.setItem(STORE_KEY, JSON.stringify(s))
    } catch {
      throw new BackendError('unavailable', 'This browser could not save your progress (storage may be full or blocked).')
    }
  }

  private emit(u: AuthUser | null, e?: string) {
    for (const l of this.listeners) l(u, e)
  }

  private current(): { store: Store; account: StoredAccount } {
    const store = this.read()
    const account = store.sessionUserId ? store.accounts[store.sessionUserId] : undefined
    if (!account) throw new BackendError('session_expired', 'Please sign in again.')
    return { store, account }
  }

  private mutate<T>(fn: (r: LearnerRecord) => T): T {
    const { store, account } = this.current()
    const result = fn(account.record)
    this.write(store)
    return result
  }

  async getUser() {
    const s = this.read()
    return s.sessionUserId ? s.accounts[s.sessionUserId]?.record.user ?? null : null
  }

  onAuthChange(cb: (u: AuthUser | null, e?: string) => void) {
    this.listeners.add(cb)
    return () => void this.listeners.delete(cb)
  }

  async signUp(email: string, password: string, displayName: string) {
    const e = email.trim().toLowerCase()
    const err = validateEmail(e) ?? validatePassword(password) ?? validateDisplayName(displayName)
    if (err) throw new BackendError('validation', err)
    const store = this.read()
    if (Object.values(store.accounts).some((a) => a.record.user.email === e)) throw new BackendError('conflict', 'An account with this email already exists on this device. Try signing in.')
    const id = crypto.randomUUID()
    const salt = randomHex(16)
    const user: AuthUser = { id, email: e, emailConfirmed: true }
    const base = displayName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 14) || 'learner'
    const record = newLearner(user, displayName.trim(), `${base}_${randomHex(2)}`, this.clock(), localTimeZone())
    store.accounts[id] = { record, salt, hash: await hashPassword(password, salt) }
    store.sessionUserId = id
    this.write(store)
    this.emit(user, 'SIGNED_IN')
    return { needsEmailConfirmation: false }
  }

  async signIn(email: string, password: string) {
    const e = email.trim().toLowerCase()
    const store = this.read()
    const acct = Object.values(store.accounts).find((a) => a.record.user.email === e)
    if (!acct || (await hashPassword(password, acct.salt)) !== acct.hash) throw new BackendError('auth', 'Email or password is incorrect.')
    store.sessionUserId = acct.record.user.id
    this.write(store)
    this.emit(acct.record.user, 'SIGNED_IN')
  }

  async signOut() {
    const store = this.read()
    store.sessionUserId = null
    this.write(store)
    this.emit(null, 'SIGNED_OUT')
  }

  async requestPasswordReset(): Promise<void> {
    throw new BackendError('unsupported', 'Demo accounts are stored only in this browser, so there is no email to reset from. You can create a new demo account instead.')
  }

  async updatePassword(newPassword: string) {
    const err = validatePassword(newPassword)
    if (err) throw new BackendError('validation', err)
    const { store, account } = this.current()
    account.salt = randomHex(16)
    account.hash = await hashPassword(newPassword, account.salt)
    this.write(store)
  }

  async resendConfirmation(): Promise<void> {
    /* demo accounts never need confirmation */
  }

  async loadState() {
    const { account } = this.current()
    return buildState(account.record, this.clock())
  }

  async isUsernameAvailable(username: string) {
    const store = this.read()
    const me = store.sessionUserId
    return !Object.values(store.accounts).some((a) => a.record.profile.username === username && a.record.user.id !== me)
  }

  async saveOnboarding(input: OnboardingInput) {
    const err = validateDisplayName(input.displayName) ?? validateUsername(input.username)
    if (err) throw new BackendError('validation', err)
    if (!(await this.isUsernameAvailable(input.username))) throw new BackendError('conflict', 'That username is taken.')
    this.mutate((r) => {
      r.profile = { ...r.profile, displayName: input.displayName.trim(), username: input.username, avatar: input.avatar }
      r.prefs = {
        ...r.prefs,
        experience: input.experience,
        interests: input.interests.slice(0, 8),
        dailyGoal: clampGoal(input.dailyGoal),
        intensity: input.intensity,
        market: input.market,
        recommendedCourse: input.recommendedCourse,
        timezone: input.timezone || r.prefs.timezone,
        onboarded: true,
      }
    })
  }

  async updateProfile(patch: ProfilePatch) {
    if (patch.displayName !== undefined) {
      const e = validateDisplayName(patch.displayName)
      if (e) throw new BackendError('validation', e)
    }
    if (patch.username !== undefined) {
      const e = validateUsername(patch.username)
      if (e) throw new BackendError('validation', e)
      if (!(await this.isUsernameAvailable(patch.username))) throw new BackendError('conflict', 'That username is taken.')
    }
    if (patch.bio !== undefined && patch.bio.length > 160) throw new BackendError('validation', 'Bio must be 160 characters or fewer.')
    this.mutate((r) => {
      r.profile = { ...r.profile, ...patch }
    })
  }

  async updatePreferences(patch: PreferencesPatch) {
    this.mutate((r) => {
      r.prefs = { ...r.prefs, ...patch, dailyGoal: patch.dailyGoal !== undefined ? clampGoal(patch.dailyGoal) : r.prefs.dailyGoal }
    })
  }

  async submitLesson(lessonId: string, answers: Record<string, AnswerValue>, attemptId: string) {
    return this.mutate((r) => processLesson(r, lessonId, answers, attemptId, this.clock()))
  }

  async submitAssessment(assessmentId: string, answers: Record<string, AnswerValue>, attemptId: string) {
    return this.mutate((r) => processAssessment(r, assessmentId, answers, attemptId, this.clock(), demoCertificateId))
  }

  async submitRevision(answers: Record<string, AnswerValue>, attemptId: string) {
    return this.mutate((r) => processRevision(r, answers, attemptId, this.clock()))
  }

  private unsupported(): never {
    throw new BackendError('unsupported', 'Friends and leaderboards need an online Veleta account. They are not available in demo mode.')
  }
  async searchUsers(): Promise<never> { this.unsupported() }
  async listFriends() { return [] }
  async sendFriendRequest(): Promise<never> { this.unsupported() }
  async respondFriendRequest(): Promise<never> { this.unsupported() }
  async removeFriend(): Promise<never> { this.unsupported() }
  async leaderboard() { return [] }

  async getPublicProfile(username: string): Promise<PublicProfile | null> {
    // In demo mode only the signed-in learner's own profile exists on this device.
    const store = this.read()
    const acct = Object.values(store.accounts).find((a) => a.record.profile.username === username)
    if (!acct) return null
    const isMe = acct.record.user.id === store.sessionUserId
    if (!isMe && !acct.record.profile.isPublic) return null
    const r = acct.record
    const xp = r.xpEvents.reduce((n, e) => n + e.amount, 0)
    return {
      userId: r.user.id,
      username: r.profile.username,
      displayName: r.profile.displayName,
      avatar: r.profile.avatar,
      bio: r.profile.bio,
      level: levelInfo(xp).level,
      xpTotal: xp,
      longestStreak: r.streak.longest,
      lessonsCompleted: Object.keys(r.lessons).length,
      achievements: Object.keys(r.achievements),
      completedCourses: r.certificates.filter((c) => !c.revoked).map((c) => c.courseId),
      certificates: r.certificates.filter((c) => !c.revoked).map((c) => ({ id: c.id, courseId: c.courseId, issuedAt: c.issuedAt })),
      isMe,
    }
  }

  async verifyCertificate(id: string): Promise<CertificateVerification | null> {
    const store = this.read()
    for (const a of Object.values(store.accounts)) {
      const c = a.record.certificates.find((x) => x.id === id.trim().toUpperCase())
      if (c) return { id: c.id, status: c.revoked ? 'revoked' : 'valid', recipientName: c.recipientName, courseId: c.courseId, score: c.score, issuedAt: c.issuedAt, demo: true }
    }
    return null
  }

  async deleteAccount() {
    const store = this.read()
    if (!store.sessionUserId) throw new BackendError('session_expired', 'Please sign in again.')
    delete store.accounts[store.sessionUserId]
    store.sessionUserId = null
    this.write(store)
    this.emit(null, 'SIGNED_OUT')
  }
}

function clampGoal(g: number) {
  return [1, 2, 3, 5].includes(g) ? g : 2
}
