import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Icon, type IconName } from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { levelInfo } from '../engine/rewards'
import { useApp } from '../state/AppContext'
import { DemoBanner } from './DemoBanner'
import { OfflineBanner } from './OfflineBanner'

const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/app', label: 'Home', icon: 'home', end: true },
  { to: '/app/learn', label: 'Learn', icon: 'map' },
  { to: '/app/courses', label: 'Courses', icon: 'book' },
  { to: '/app/practice', label: 'Practice', icon: 'refresh' },
  { to: '/tools', label: 'Finance tools', icon: 'tools' },
  { to: '/charts', label: 'Charts & cases', icon: 'chart' },
  { to: '/app/achievements', label: 'Achievements', icon: 'trophy' },
  { to: '/app/friends', label: 'Friends', icon: 'users' },
  { to: '/app/profile', label: 'Profile', icon: 'user' },
  { to: '/app/settings', label: 'Settings', icon: 'settings' },
]
const MOBILE_PRIMARY = ['/app', '/app/learn', '/app/practice', '/tools']

export function TopStats() {
  const { state } = useApp()
  if (!state) return null
  const lvl = levelInfo(state.xp.total)
  return (
    <div className="top-stats" aria-label="Your progress">
      <Link to="/app/achievements" className="top-stat" title={`Level ${lvl.level}: ${lvl.name}`}>
        <span className="top-stat__level" aria-hidden="true">{lvl.level}</span>
        <span className="sr-only">Level {lvl.level}</span>
      </Link>
      <Link to="/app" className="top-stat top-stat--streak" title={`${state.streak.current}-day streak`}>
        <Icon name="flame" size={20} />
        <span className="tabular">{state.streak.current}</span>
        <span className="sr-only">day streak</span>
      </Link>
      <Link to="/app/achievements" className="top-stat top-stat--xp" title={`${state.xp.total} XP`}>
        <Icon name="bolt" size={20} />
        <span className="tabular">{state.xp.total}</span>
        <span className="sr-only">XP</span>
      </Link>
    </div>
  )
}

export function AppLayout() {
  const { state, backend } = useApp()
  const [moreOpen, setMoreOpen] = useState(false)
  const loc = useLocation()
  const navigate = useNavigate()
  const sheetRef = useRef<HTMLDivElement>(null)
  useEffect(() => setMoreOpen(false), [loc.pathname])
  useEffect(() => {
    if (!moreOpen) return
    sheetRef.current?.querySelector<HTMLElement>('a,button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [moreOpen])

  const signOut = async () => {
    await backend?.signOut()
    navigate('/')
  }

  return (
    <div className="app-layout has-bottom-nav">
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="sidebar" aria-label="App navigation">
        <Link to="/app" className="sidebar__brand" aria-label="Veleta Finance home"><Logo size={38} /></Link>
        <nav className="sidebar__nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="sidebar__link">
              <Icon name={n.icon} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        {state && (
          <Link to="/app/profile" className="sidebar__me">
            <Avatar id={state.profile.avatar} size={36} />
            <span className="sidebar__me-name">{state.profile.displayName}</span>
          </Link>
        )}
      </aside>
      <div className="app-main">
        <DemoBanner />
        <OfflineBanner />
        <header className="app-topbar">
          <Link to="/app" className="app-topbar__brand" aria-label="Veleta Finance home"><Logo size={32} compact /></Link>
          <TopStats />
        </header>
        <main id="main" tabIndex={-1} className="app-content">
          <Outlet />
        </main>
      </div>
      <nav className="bottom-nav" aria-label="App navigation">
        {NAV.filter((n) => MOBILE_PRIMARY.includes(n.to)).map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className="bottom-nav__link">
            <Icon name={n.icon} />
            <span>{n.label === 'Finance tools' ? 'Tools' : n.label}</span>
          </NavLink>
        ))}
        <button type="button" className="bottom-nav__link" aria-expanded={moreOpen} aria-controls="more-sheet" onClick={() => setMoreOpen((o) => !o)}>
          <Icon name="menu" />
          <span>More</span>
        </button>
      </nav>
      {moreOpen && (
        <div className="sheet-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="sheet" id="more-sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-label="More navigation" onClick={(e) => e.stopPropagation()}>
            <nav className="stack-sm">
              {NAV.filter((n) => !MOBILE_PRIMARY.includes(n.to)).map((n) => (
                <NavLink key={n.to} to={n.to} className="sheet__link">
                  <Icon name={n.icon} />
                  {n.label}
                </NavLink>
              ))}
              <button type="button" className="sheet__link" onClick={signOut}>
                <Icon name="logout" />
                Sign out
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
