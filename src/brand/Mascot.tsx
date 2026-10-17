export type MascotMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wave' | 'sleep'

interface MascotProps {
  mood?: MascotMood
  size?: number
  /** Accessible description; omit when purely decorative. */
  label?: string
  className?: string
}

const ARROW_ANGLE: Record<MascotMood, number> = { happy: -20, cheer: -45, think: 10, oops: 35, wave: -10, sleep: 60 }

/**
 * Vane — Veleta's mascot. A round, cheerful character with a weathervane on its
 * head that points up when things are going well. Original artwork.
 */
export function Mascot({ mood = 'happy', size = 120, label, className }: MascotProps) {
  const pupil = mood === 'think' ? { dx: 2, dy: -3 } : mood === 'oops' ? { dx: 0, dy: 1 } : { dx: 1, dy: 0 }
  const armsUp = mood === 'cheer'
  return (
    <svg
      className={className}
      width={size}
      height={(size * 140) / 120}
      viewBox="0 0 120 140"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* weathervane */}
      <line x1="60" y1="40" x2="60" y2="14" stroke="#1D1A35" strokeWidth="3" strokeLinecap="round" />
      <g transform={`rotate(${ARROW_ANGLE[mood]} 60 14)`}>
        <path d="M42 14 H76" stroke="#6B4EFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M74 7 L84 14 L74 21 Z" fill="#6B4EFF" />
        <path d="M42 14 L36 8 M42 14 L36 20" stroke="#6B4EFF" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="14" r="4" fill="#FFC83D" stroke="#1D1A35" strokeWidth="1.5" />
      {/* arms */}
      {armsUp ? (
        <>
          <ellipse cx="18" cy="62" rx="8" ry="14" fill="#18B482" transform="rotate(-35 18 62)" />
          <ellipse cx="102" cy="62" rx="8" ry="14" fill="#18B482" transform="rotate(35 102 62)" />
        </>
      ) : mood === 'wave' ? (
        <>
          <ellipse cx="16" cy="96" rx="8" ry="13" fill="#18B482" transform="rotate(20 16 96)" />
          <ellipse cx="104" cy="64" rx="8" ry="14" fill="#18B482" transform="rotate(40 104 64)" />
        </>
      ) : (
        <>
          <ellipse cx="16" cy="96" rx="8" ry="13" fill="#18B482" transform="rotate(20 16 96)" />
          <ellipse cx="104" cy="96" rx="8" ry="13" fill="#18B482" transform="rotate(-20 104 96)" />
        </>
      )}
      {/* feet */}
      <ellipse cx="44" cy="130" rx="12" ry="7" fill="#F5B01B" />
      <ellipse cx="76" cy="130" rx="12" ry="7" fill="#F5B01B" />
      {/* body */}
      <ellipse cx="60" cy="84" rx="45" ry="46" fill="#1FC48E" />
      <ellipse cx="60" cy="98" rx="29" ry="27" fill="#D4F6E8" />
      <path d="M33 54 Q60 40 87 54" fill="none" stroke="#3FD8A2" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* eyes */}
      {mood === 'sleep' ? (
        <>
          <path d="M36 72 Q44 78 52 72" fill="none" stroke="#1D1A35" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M68 72 Q76 78 84 72" fill="none" stroke="#1D1A35" strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="44" cy="71" r="11" fill="#fff" />
          <circle cx="76" cy="71" r="11" fill="#fff" />
          <circle cx={44 + pupil.dx} cy={72 + pupil.dy} r="5.5" fill="#1D1A35" />
          <circle cx={76 + pupil.dx} cy={72 + pupil.dy} r="5.5" fill="#1D1A35" />
          <circle cx={46 + pupil.dx} cy={70 + pupil.dy} r="1.8" fill="#fff" />
          <circle cx={78 + pupil.dx} cy={70 + pupil.dy} r="1.8" fill="#fff" />
        </>
      )}
      {mood === 'oops' && (
        <>
          <path d="M35 58 L50 62" stroke="#1D1A35" strokeWidth="3" strokeLinecap="round" />
          <path d="M85 58 L70 62" stroke="#1D1A35" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* cheeks */}
      <ellipse cx="33" cy="88" rx="7" ry="4.5" fill="#FF7D81" opacity="0.55" />
      <ellipse cx="87" cy="88" rx="7" ry="4.5" fill="#FF7D81" opacity="0.55" />
      {/* mouth */}
      {mood === 'cheer' ? (
        <path d="M48 88 Q60 104 72 88 Z" fill="#1D1A35" />
      ) : mood === 'oops' ? (
        <ellipse cx="60" cy="92" rx="5" ry="6" fill="#1D1A35" />
      ) : mood === 'think' ? (
        <path d="M53 92 Q60 89 67 92" fill="none" stroke="#1D1A35" strokeWidth="3" strokeLinecap="round" />
      ) : mood === 'sleep' ? (
        <path d="M55 92 Q60 95 65 92" fill="none" stroke="#1D1A35" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M50 88 Q60 98 70 88" fill="none" stroke="#1D1A35" strokeWidth="3.5" strokeLinecap="round" />
      )}
    </svg>
  )
}
