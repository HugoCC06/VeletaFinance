import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import { createHashRouter, Outlet, RouterProvider, useLocation, useNavigate, useRouteError } from 'react-router-dom'
import { AppProvider, useApp } from './state/AppContext'
import { ToastProvider } from './components/Toast'
import { ErrorState, LoadingState } from './components/ui'
import { PublicLayout } from './layout/PublicLayout'
import { AppLayout } from './layout/AppLayout'
import { AdaptiveLayout, RedirectIfSignedIn, RequireAuth } from './layout/guards'
import { Landing } from './pages/public/Landing'

const page = <T, K extends keyof T>(loader: () => Promise<T>, name: K) =>
  lazy(async () => ({ default: (await loader())[name] as unknown as ComponentType }))

const Curriculum = page(() => import('./pages/public/Curriculum'), 'Curriculum')
const CoursePublic = page(() => import('./pages/public/CoursePublic'), 'CoursePublic')
const About = page(() => import('./pages/public/Static'), 'About')
const Privacy = page(() => import('./pages/public/Static'), 'Privacy')
const Terms = page(() => import('./pages/public/Static'), 'Terms')
const Disclaimer = page(() => import('./pages/public/Static'), 'Disclaimer')
const NotFound = page(() => import('./pages/public/Static'), 'NotFound')
const SignIn = page(() => import('./pages/auth/Auth'), 'SignIn')
const SignUp = page(() => import('./pages/auth/Auth'), 'SignUp')
const ForgotPassword = page(() => import('./pages/auth/Auth'), 'ForgotPassword')
const ResetPassword = page(() => import('./pages/auth/Auth'), 'ResetPassword')
const CheckEmail = page(() => import('./pages/auth/Auth'), 'CheckEmail')
const PublicProfilePage = page(() => import('./pages/social/PublicProfile'), 'PublicProfilePage')
const Verify = page(() => import('./pages/certificates/Verify'), 'Verify')
const ToolsHub = page(() => import('./pages/tools/ToolsHub'), 'ToolsHub')
const ToolPage = page(() => import('./pages/tools/ToolPage'), 'ToolPage')
const Charts = page(() => import('./pages/charts/Charts'), 'Charts')
const CaseStudyPage = page(() => import('./pages/charts/CaseStudy'), 'CaseStudyPage')
const Onboarding = page(() => import('./pages/app/Onboarding'), 'Onboarding')
const Dashboard = page(() => import('./pages/app/Dashboard'), 'Dashboard')
const Learn = page(() => import('./pages/app/Learn'), 'Learn')
const Courses = page(() => import('./pages/app/Courses'), 'Courses')
const Practice = page(() => import('./pages/app/Practice'), 'Practice')
const Achievements = page(() => import('./pages/app/Achievements'), 'Achievements')
const Friends = page(() => import('./pages/social/Friends'), 'Friends')
const Profile = page(() => import('./pages/social/Profile'), 'Profile')
const Settings = page(() => import('./pages/app/Settings'), 'Settings')
const CertificatePage = page(() => import('./pages/certificates/CertificatePage'), 'CertificatePage')
const LessonPage = page(() => import('./pages/learning/LessonPage'), 'LessonPage')
const GuestLessonPage = page(() => import('./pages/learning/LessonPage'), 'GuestLessonPage')
const AssessmentPage = page(() => import('./pages/learning/AssessmentPage'), 'AssessmentPage')
const PracticeSession = page(() => import('./pages/learning/PracticeSession'), 'PracticeSession')

function RouteError() {
  const err = useRouteError() as Error | undefined
  return (
    <div className="container page">
      <ErrorState title="This page hit a problem" message={err?.message ? 'An unexpected error occurred. Reloading usually fixes it.' : undefined} onRetry={() => window.location.reload()} />
    </div>
  )
}

/** Handles focus/scroll on navigation and Supabase auth redirects (?next=…). */
function Root() {
  const loc = useLocation()
  const navigate = useNavigate()
  const { authReady, authEvent } = useApp()
  useEffect(() => {
    window.scrollTo({ top: 0 })
    const main = document.getElementById('main')
    if (main && loc.pathname !== '/') main.focus({ preventScroll: true })
  }, [loc.pathname])
  useEffect(() => {
    if (!authReady) return
    const params = new URLSearchParams(window.location.search)
    const next = params.get('next')
    if (!next && authEvent !== 'PASSWORD_RECOVERY') return
    window.history.replaceState(null, '', window.location.pathname + window.location.hash)
    if (authEvent === 'PASSWORD_RECOVERY' || next === 'reset-password') navigate('/reset-password', { replace: true })
    else if (next === 'onboarding') navigate('/onboarding', { replace: true })
  }, [authReady, authEvent, navigate])
  return (
    <Suspense fallback={<LoadingState />}>
      <Outlet />
    </Suspense>
  )
}

const router = createHashRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Landing /> },
          { path: '/curriculum', element: <Curriculum /> },
          { path: '/curriculum/:courseId', element: <CoursePublic /> },
          { path: '/about', element: <About /> },
          { path: '/privacy', element: <Privacy /> },
          { path: '/terms', element: <Terms /> },
          { path: '/disclaimer', element: <Disclaimer /> },
          { path: '/signin', element: <RedirectIfSignedIn><SignIn /></RedirectIfSignedIn> },
          { path: '/signup', element: <RedirectIfSignedIn><SignUp /></RedirectIfSignedIn> },
          { path: '/forgot-password', element: <ForgotPassword /> },
          { path: '/check-email', element: <CheckEmail /> },
          { path: '/reset-password', element: <ResetPassword /> },
          { path: '/u/:username', element: <PublicProfilePage /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        element: <AdaptiveLayout />,
        children: [
          { path: '/tools', element: <ToolsHub /> },
          { path: '/tools/:toolId', element: <ToolPage /> },
          { path: '/charts', element: <Charts /> },
          { path: '/charts/case/:caseId', element: <CaseStudyPage /> },
          { path: '/verify', element: <Verify /> },
          { path: '/verify/:certId', element: <Verify /> },
        ],
      },
      { path: '/try/:lessonId', element: <GuestLessonPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: '/onboarding', element: <Onboarding /> },
          { path: '/app/lesson/:lessonId', element: <LessonPage /> },
          { path: '/app/assessment/:assessmentId', element: <AssessmentPage /> },
          { path: '/app/practice/session', element: <PracticeSession /> },
          {
            element: <AppLayout />,
            children: [
              { path: '/app', element: <Dashboard /> },
              { path: '/app/learn', element: <Learn /> },
              { path: '/app/learn/:courseId', element: <Learn /> },
              { path: '/app/courses', element: <Courses /> },
              { path: '/app/practice', element: <Practice /> },
              { path: '/app/achievements', element: <Achievements /> },
              { path: '/app/friends', element: <Friends /> },
              { path: '/app/profile', element: <Profile /> },
              { path: '/app/settings', element: <Settings /> },
              { path: '/app/certificates/:certId', element: <CertificatePage /> },
            ],
          },
        ],
      },
    ],
  },
])

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AppProvider>
  )
}
