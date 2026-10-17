import { useMemo } from 'react'

const COLOURS = ['#6B4EFF', '#1FC48E', '#FFC83D', '#FF5A5F', '#2E9BFF']

/** A short, decorative burst. Hidden from assistive tech; disabled by reduced-motion CSS. */
export function Confetti({ pieces = 60 }: { pieces?: number }) {
  const items = useMemo(
    () => Array.from({ length: pieces }, (_, i) => ({ left: (i * 37) % 100, delay: (i % 12) * 0.06, colour: COLOURS[i % COLOURS.length], rot: (i * 47) % 360 })),
    [pieces],
  )
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null
  return (
    <div className="confetti" aria-hidden="true">
      {items.map((p, i) => <i key={i} style={{ left: `${p.left}%`, background: p.colour, animationDelay: `${p.delay}s`, transform: `rotate(${p.rot}deg)` }} />)}
    </div>
  )
}
