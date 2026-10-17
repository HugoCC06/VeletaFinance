import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getBackend } from '../backend'
import { BackendError, type AuthUser, type Backend, type UserState } from '../backend/types'
import { listPending, removePending } from './pending'

interface AppContextValue {
  backend: Backend | null
  /** True once the initial auth check has finished. */
  authReady: boolean
  user: AuthUser | null
  state: UserState | null
  stateLoading: boolean
  stateError: BackendError | null
  online: boolean
  authEvent: string | null
  refresh: () => Promise<UserState | null>
  /** Retries queued offline submissions; returns how many were synced. */
  syncPending: () => Promise<number>
}

const Ctx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<Backend | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [state, setState] = useState<UserState | null>(null)
  const [stateLoading, setStateLoading] = useState(false)
  const [stateError, setStateError] = useState<BackendError | null>(null)
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [authEvent, setAuthEvent] = useState<string | null>(null)
  const loadSeq = useRef(0)

  const load = useCallback(async (b: Backend, u: AuthUser | null) => {
    const seq = ++loadSeq.current
    if (!u) {
      setState(null)
      setStateError(null)
      return null
    }
    setStateLoading(true)
    try {
      const s = await b.loadState()
      if (seq === loadSeq.current) {
        setState(s)
        setStateError(null)
      }
      return s
    } catch (e) {
      const err = e instanceof BackendError ? e : new BackendError('unknown', (e as Error).message)
      if (seq === loadSeq.current) setStateError(err)
      if (err.code === 'session_expired') {
        await b.signOut().catch(() => undefined)
      }
      return null
    } finally {
      if (seq === loadSeq.current) setStateLoading(false)
    }
  }, [])

  useEffect(() => {
    let unsub = () => {}
    let cancelled = false
    ;(async () => {
      const b = await getBackend()
      if (cancelled) return
      setBackend(b)
      let u: AuthUser | null
      try {
        u = await b.getUser()
      } catch {
        u = null
      }
      if (cancelled) return
      setUser(u)
      setAuthReady(true)
      void load(b, u)
      unsub = b.onAuthChange((nu, event) => {
        if (event) setAuthEvent(event)
        setUser((prev) => {
          if (prev?.id !== nu?.id || prev?.emailConfirmed !== nu?.emailConfirmed) void load(b, nu)
          return nu
        })
      })
    })()
    return () => {
      cancelled = true
      unsub()
    }
  }, [load])

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const refresh = useCallback(async () => (backend ? load(backend, user) : null), [backend, user, load])

  const syncPending = useCallback(async () => {
    if (!backend || !user) return 0
    let synced = 0
    for (const p of listPending(user.id)) {
      try {
        if (p.kind === 'lesson') await backend.submitLesson(p.targetId, p.answers, p.attemptId)
        else if (p.kind === 'assessment') await backend.submitAssessment(p.targetId, p.answers, p.attemptId)
        else await backend.submitRevision(p.answers, p.attemptId)
        removePending(user.id, p.attemptId)
        synced++
      } catch (e) {
        const code = e instanceof BackendError ? e.code : 'unknown'
        // Permanent problems (e.g. content no longer valid) are dropped; transient ones stay queued.
        if (!['network', 'unavailable', 'rate_limited', 'session_expired', 'unknown'].includes(code)) removePending(user.id, p.attemptId)
        if (code === 'network' || code === 'unavailable') break
      }
    }
    if (synced) await refresh()
    return synced
  }, [backend, user, refresh])

  useEffect(() => {
    if (online && user && backend) void syncPending()
  }, [online, user, backend, syncPending])

  const value = useMemo(
    () => ({ backend, authReady, user, state, stateLoading, stateError, online, authEvent, refresh, syncPending }),
    [backend, authReady, user, state, stateLoading, stateError, online, authEvent, refresh, syncPending],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppContextValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside AppProvider')
  return v
}
