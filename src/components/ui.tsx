import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import { Mascot, type MascotMood } from '../brand/Mascot'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'sun' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

function btnClass(variant: Variant, size: Size, block?: boolean, icon?: boolean, extra?: string) {
  return ['btn', variant !== 'secondary' && `btn--${variant}`, size !== 'md' && `btn--${size}`, block && 'btn--block', icon && 'btn--icon', extra].filter(Boolean).join(' ')
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  iconOnly?: boolean
  loading?: boolean
  icon?: IconName
  iconRight?: IconName
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant = 'secondary', size = 'md', block, iconOnly, loading, icon, iconRight, className, children, disabled, type = 'button', ref, ...rest }: ButtonProps) {
  return (
    <button ref={ref} type={type} className={btnClass(variant, size, block, iconOnly, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} aria-hidden="true" /> : icon && <Icon name={icon} size={20} />}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={20} />}
    </button>
  )
}

interface LinkButtonProps {
  to: string
  variant?: Variant
  size?: Size
  block?: boolean
  icon?: IconName
  iconRight?: IconName
  children: ReactNode
  className?: string
  'aria-label'?: string
}

export function LinkButton({ to, variant = 'secondary', size = 'md', block, icon, iconRight, children, className, ...rest }: LinkButtonProps) {
  return (
    <Link to={to} className={btnClass(variant, size, block, false, className)} {...rest}>
      {icon && <Icon name={icon} size={20} />}
      {children}
      {iconRight && <Icon name={iconRight} size={20} />}
    </Link>
  )
}

export function Card({ children, className, as: Tag = 'div', ...rest }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' | 'aside' } & Record<string, unknown>) {
  return (
    <Tag className={['card', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}

export function Pill({ tone, icon, children, title }: { tone?: 'violet' | 'mint' | 'sun' | 'coral' | 'sky' | 'dark'; icon?: IconName; children: ReactNode; title?: string }) {
  return (
    <span className={`pill${tone ? ` pill--${tone}` : ''}`} title={title}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  )
}

interface ProgressProps {
  value: number // 0..1
  label: string
  tone?: 'violet' | 'mint' | 'sun' | 'sky' | 'coral'
  size?: 'sm' | 'md'
  showValue?: boolean
  valueText?: string
}

export function ProgressBar({ value, label, tone = 'violet', size = 'md', valueText }: ProgressProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div
      className={`progress${size === 'sm' ? ' progress--sm' : ''}${tone !== 'violet' ? ` progress--${tone}` : ''}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={valueText ?? `${pct}%`}
    >
      <div className="progress__bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Ring({ value, size = 72, stroke = 9, colour = 'var(--violet-500)', label, children }: { value: number; size?: number; stroke?: number; colour?: string; label: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink-100)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colour} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: 'stroke-dashoffset var(--duration-slow) var(--ease-out)' }} />
      </svg>
      <div className="ring__label" aria-hidden="true">{children}</div>
    </div>
  )
}

export function Alert({ tone = 'info', title, children, icon }: { tone?: 'info' | 'warning' | 'danger' | 'success'; title?: string; children?: ReactNode; icon?: IconName }) {
  const defaultIcon: IconName = tone === 'danger' ? 'alert' : tone === 'success' ? 'check' : tone === 'warning' ? 'alert' : 'info'
  return (
    <div className={`alert alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon name={icon ?? defaultIcon} />
      <div>
        {title && <div className="alert__title">{title}</div>}
        {children}
      </div>
    </div>
  )
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="cluster-sm">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export function EmptyState({ title, children, mood = 'think', action }: { title: string; children?: ReactNode; mood?: MascotMood; action?: ReactNode }) {
  return (
    <div className="state">
      <Mascot mood={mood} size={96} />
      <h2 className="mb-0" style={{ fontSize: 'var(--text-xl)' }}>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: { title?: string; message?: string; onRetry?: () => void }) {
  return (
    <div className="state" role="alert">
      <Mascot mood="oops" size={96} />
      <h2 className="mb-0" style={{ fontSize: 'var(--text-xl)' }}>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && <Button variant="primary" icon="refresh" onClick={onRetry}>Try again</Button>}
    </div>
  )
}

export function Stat({ icon, tone, value, label }: { icon: IconName; tone: 'violet' | 'mint' | 'sun' | 'coral' | 'sky' | 'streak'; value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <span className={`icon-chip icon-chip--${tone}`}><Icon name={icon} /></span>
      <div>
        <div className="stat__value tabular">{value}</div>
        <div className="stat__label">{label}</div>
      </div>
    </div>
  )
}
