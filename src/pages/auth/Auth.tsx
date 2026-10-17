import type { ReactNode } from 'react'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mascot } from '../../brand/Mascot'
import { Field } from '../../components/Field'
import { Alert, Button } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { BackendError, validateDisplayName, validateEmail, validatePassword } from '../../backend/types'
import { isSupabaseConfigured } from '../../backend'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'

function AuthCard({ title, subtitle, children, mood = 'wave' }: { title: string; subtitle?: string; children: ReactNode; mood?: 'wave' | 'happy' | 'think' }) {
  return (
    <div className="container page auth">
      <div className="auth__card card">
        <div className="center stack-sm">
          <Mascot mood={mood} size={84} />
          <h1 className="mb-0">{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

const message = (e: unknown) => (e instanceof BackendError ? e.message : 'Something went wrong. Please try again.')

export function SignIn() {
  useMeta('Sign in', { noindex: true })
  const { backend } = useApp()
  const navigate = useNavigate()
  const loc = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const next = new URLSearchParams(loc.search).get('next')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (validateEmail(email)) return setError(validateEmail(email))
    if (!password) return setError('Enter your password.')
    setBusy(true)
    try {
      await backend!.signIn(email, password)
      navigate(next && next.startsWith('/') && !next.startsWith('//') ? next : '/app', { replace: true })
    } catch (err) {
      setError(message(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue your learning path.">
      <form className="stack" onSubmit={submit} noValidate>
        {error && <Alert tone="danger">{error}</Alert>}
        <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="primary" size="lg" block loading={busy}>Sign in</Button>
        <div className="spread small">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to={`/signup${loc.search}`}>Create a free account</Link>
        </div>
      </form>
    </AuthCard>
  )
}

export function SignUp() {
  useMeta('Create your free account', { description: 'Create a free Veleta Finance account to save progress, earn XP and work towards certificates.' })
  const { backend } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = { name: validateDisplayName(name), email: validateEmail(email), password: validatePassword(password), agree: agree ? null : 'Please confirm you understand Veleta is educational.' }
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return
    setError(null)
    setBusy(true)
    try {
      const { needsEmailConfirmation } = await backend!.signUp(email, password, name)
      if (needsEmailConfirmation) navigate(`/check-email?email=${encodeURIComponent(email.trim())}`)
      else navigate('/onboarding', { replace: true })
    } catch (err) {
      setError(message(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthCard title="Create your free account" subtitle="Save your progress, earn XP, keep a streak and work towards certificates." mood="happy">
      {!isSupabaseConfigured && <Alert tone="warning" title="Demo mode">This account will exist only in this browser. No email is sent and nothing leaves your device.</Alert>}
      <form className="stack" onSubmit={submit} noValidate>
        {error && <Alert tone="danger">{error}</Alert>}
        <Field label="Display name" hint="Shown on your profile and to friends. You can change it later." autoComplete="nickname" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} maxLength={40} />
        <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Field label="Password" type="password" autoComplete="new-password" hint="At least 8 characters." value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <label className="check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} aria-invalid={errors.agree ? true : undefined} />
          <span className="small">I understand Veleta provides education, not financial advice, and I agree to the <Link to="/terms">terms</Link> and <Link to="/privacy">privacy notice</Link>.</span>
        </label>
        {errors.agree && <p className="field__error mb-0">{errors.agree}</p>}
        <Button type="submit" variant="primary" size="lg" block loading={busy}>Create account</Button>
        <p className="small center mb-0">Already have an account? <Link to="/signin">Sign in</Link></p>
      </form>
    </AuthCard>
  )
}

export function CheckEmail() {
  useMeta('Check your email', { noindex: true })
  const { backend } = useApp()
  const toast = useToast()
  const email = new URLSearchParams(useLocation().search).get('email') ?? ''
  const [busy, setBusy] = useState(false)
  const resend = async () => {
    setBusy(true)
    try {
      await backend!.resendConfirmation(email)
      toast.show('Confirmation email sent again.', 'success')
    } catch (e) {
      toast.show(message(e), 'danger')
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthCard title="Check your email" subtitle={email ? `We sent a confirmation link to ${email}.` : 'We sent you a confirmation link.'} mood="happy">
      <div className="stack">
        <p className="muted center mb-0">Open the link to activate your account, then you’ll be taken straight to setting up your learning path. The email may take a minute and can land in spam.</p>
        {email && <Button onClick={resend} loading={busy} block>Resend confirmation email</Button>}
        <p className="small center mb-0"><Link to="/signin">Back to sign in</Link></p>
      </div>
    </AuthCard>
  )
}

export function ForgotPassword() {
  useMeta('Reset your password', { noindex: true })
  const { backend } = useApp()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await backend!.requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(message(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthCard title="Reset your password" subtitle="Enter your email and we’ll send you a reset link." mood="think">
      {sent ? (
        <Alert tone="success" title="Check your inbox">If an account exists for {email}, a password reset link is on its way.</Alert>
      ) : (
        <form className="stack" onSubmit={submit} noValidate>
          {error && <Alert tone="danger">{error}</Alert>}
          <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" variant="primary" size="lg" block loading={busy}>Send reset link</Button>
        </form>
      )}
      <p className="small center mt-4 mb-0"><Link to="/signin">Back to sign in</Link></p>
    </AuthCard>
  )
}

export function ResetPassword() {
  useMeta('Choose a new password', { noindex: true })
  const { backend, user, authReady } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validatePassword(password) ?? (password !== confirm ? 'Passwords do not match.' : null)
    if (err) return setError(err)
    setBusy(true)
    try {
      await backend!.updatePassword(password)
      toast.show('Password updated.', 'success')
      navigate('/app', { replace: true })
    } catch (e2) {
      setError(message(e2))
    } finally {
      setBusy(false)
    }
  }
  if (authReady && !user) {
    return (
      <AuthCard title="Link expired" subtitle="This password reset link is invalid or has expired." mood="think">
        <p className="center"><Link to="/forgot-password">Request a new link</Link></p>
      </AuthCard>
    )
  }
  return (
    <AuthCard title="Choose a new password" mood="happy">
      <form className="stack" onSubmit={submit} noValidate>
        {error && <Alert tone="danger">{error}</Alert>}
        <Field label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 8 characters." />
        <Field label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <Button type="submit" variant="primary" size="lg" block loading={busy}>Update password</Button>
      </form>
    </AuthCard>
  )
}
