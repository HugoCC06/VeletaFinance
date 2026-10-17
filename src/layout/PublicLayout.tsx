import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Icon } from '../components/Icon'
import { LinkButton } from '../components/ui'
import { useApp } from '../state/AppContext'
import { DemoBanner } from './DemoBanner'

export function PublicHeader() {
  const { user } = useApp()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const links = [
    { to: '/curriculum', label: 'Curriculum' },
    { to: '/#features', label: 'Features' },
    { to: '/tools', label: 'Finance tools' },
    { to: '/about', label: 'About' },
  ]
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label="Veleta Finance home">
          <Logo size={36} />
        </Link>
        <nav aria-label="Main" className={`site-nav${open ? ' is-open' : ''}`} id="site-nav">
          {links.map((l) =>
            l.to.includes('#') ? (
              <Link key={l.to} to={l.to} className="site-nav__link" onClick={() => setOpen(false)}>{l.label}</Link>
            ) : (
              <NavLink key={l.to} to={l.to} className="site-nav__link" onClick={() => setOpen(false)}>{l.label}</NavLink>
            ),
          )}
          <div className="site-nav__actions">
            {user ? (
              <LinkButton to="/app" variant="primary" size="sm" iconRight="arrowRight">Continue learning</LinkButton>
            ) : (
              <>
                <LinkButton to={`/signin${loc.pathname !== '/' ? `?next=${encodeURIComponent(loc.pathname)}` : ''}`} variant="ghost" size="sm">Sign in</LinkButton>
                <LinkButton to="/signup" variant="primary" size="sm">Create free account</LinkButton>
              </>
            )}
          </div>
        </nav>
        <button type="button" className="btn btn--ghost btn--icon site-header__menu" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? 'x' : 'menu'} />
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="stack-sm">
            <Logo size={32} />
            <p className="subtle" style={{ maxWidth: '36ch' }}>Make finance simple. Free, interactive lessons on investing and financial markets.</p>
          </div>
          <nav aria-label="Footer: learn" className="stack-sm">
            <span className="bold">Learn</span>
            <Link to="/curriculum">Curriculum</Link>
            <Link to="/tools">Finance tools</Link>
            <Link to="/charts">Charts &amp; case studies</Link>
            <Link to="/verify">Verify a certificate</Link>
          </nav>
          <nav aria-label="Footer: Veleta" className="stack-sm">
            <span className="bold">Veleta</span>
            <Link to="/about">About Veleta</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/disclaimer">Educational disclaimer</Link>
          </nav>
        </div>
        <p className="tiny muted mt-6">
          Veleta Finance provides general financial education, not personalised financial, investment, tax or legal advice. Investing involves risk, including the possible loss of capital. Past performance and illustrative calculations do not guarantee future results.
        </p>
      </div>
    </footer>
  )
}

export function PublicLayout() {
  return (
    <div className="public-layout">
      <a className="skip-link" href="#main">Skip to content</a>
      <DemoBanner />
      <PublicHeader />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
