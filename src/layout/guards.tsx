import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { ErrorState, LoadingState } from '../components/ui'
import { AppLayout } from './AppLayout'
import { PublicLayout } from './PublicLayout'

/** Protects learner pages: requires a session and a completed onboarding. */
export function RequireAuth({ children }: { children?: ReactNode }) {
  const { authReady, user, state, stateLoading, stateError, refresh } = useApp()
  const loc = useLocation()
  if (!authReady) return <LoadingState label="Loading Veleta…" />
  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  if (!state) {
    if (stateError && !stateLoading) return <ErrorState title="We couldn’t load your progress" message={stateError.message} onRetry={() => void refresh()} />
    return <LoadingState label="Loading your progress…" />
  }
  if (!state.prefs.onboarded && loc.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />
  return <>{children ?? <Outlet />}</>
}

/** Uses the app shell for signed-in learners and the public shell for visitors. */
export function AdaptiveLayout() {
  const { authReady, user, state } = useApp()
  if (!authReady) return <LoadingState />
  return user && state?.prefs.onboarded ? <AppLayout /> : <PublicLayout />
}

export function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const { authReady, user } = useApp()
  const loc = useLocation()
  if (!authReady) return <LoadingState />
  if (user) {
    const next = new URLSearchParams(loc.search).get('next')
    return <Navigate to={next && next.startsWith('/') && !next.startsWith('//') ? next : '/app'} replace />
  }
  return <>{children}</>
}

export { Outlet }
