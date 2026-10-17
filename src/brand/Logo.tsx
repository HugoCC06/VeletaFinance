interface LogoMarkProps {
  size?: number
  title?: string
}

/** The Veleta mark: a weathervane "V" whose right arm rises into a growth arrow, pivoting on a sun-yellow point. */
export function LogoMark({ size = 36, title }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect width="64" height="64" rx="17" fill="#6B4EFF" />
      <rect x="0" y="40" width="64" height="24" rx="0" fill="#5536E8" opacity="0.35" />
      <path d="M15 19 L28.5 45 L46 18" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37.5 14.5 L50.5 12.5 L49 25.5 Z" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="28.5" cy="46" r="5" fill="#FFC83D" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

export function Logo({ size = 36, compact = false }: { size?: number; compact?: boolean }) {
  return (
    <span className="logo" aria-label="Veleta Finance">
      <LogoMark size={size} />
      {!compact && (
        <span className="logo__word" aria-hidden="true">
          Veleta<span className="logo__sub">Finance</span>
        </span>
      )}
    </span>
  )
}
