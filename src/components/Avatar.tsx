import type { ReactNode } from 'react'
import { Mascot } from '../brand/Mascot'

/**
 * Original illustrated avatars (64×64 SVG). IDs are stable and stored on the
 * profile; earlier icon-style IDs (rocket, coins, leaf, …) map to characters.
 */
export const AVATARS: { id: string; label: string; bg: string }[] = [
  { id: 'vane', label: 'Vane the mascot', bg: '#D4F6E8' },
  { id: 'bull', label: 'Bull', bg: '#FFE1E2' },
  { id: 'bear', label: 'Bear', bg: '#ECE8FF' },
  { id: 'chart', label: 'Fox', bg: '#FFF1C7' },
  { id: 'star', label: 'Cat', bg: '#FDE7F3' },
  { id: 'coins', label: 'Piggy bank', bg: '#FFE1E2' },
  { id: 'leaf', label: 'Frog', bg: '#D4F6E8' },
  { id: 'globe', label: 'Penguin', bg: '#DBECFF' },
  { id: 'brain', label: 'Robot', bg: '#E2E0EE' },
  { id: 'rocket', label: 'Astronaut', bg: '#1D1A35' },
  { id: 'lion', label: 'Lion', bg: '#FFF1C7' },
  { id: 'panda', label: 'Panda', bg: '#D4F6E8' },
  { id: 'koala', label: 'Koala', bg: '#DBECFF' },
  { id: 'rabbit', label: 'Rabbit', bg: '#ECE8FF' },
  { id: 'dog', label: 'Dog', bg: '#FFF1C7' },
  { id: 'tiger', label: 'Tiger', bg: '#FFE6D5' },
  { id: 'hedgehog', label: 'Hedgehog', bg: '#D4F6E8' },
  { id: 'whale', label: 'Whale', bg: '#DBECFF' },
]

const INK = '#1D1A35'
const eyes = (y = 34, dx = 9, r = 3.2) => (
  <>
    <circle cx={32 - dx} cy={y} r={r} fill={INK} />
    <circle cx={32 + dx} cy={y} r={r} fill={INK} />
    <circle cx={32 - dx + 1} cy={y - 1.2} r={1} fill="#fff" />
    <circle cx={32 + dx + 1} cy={y - 1.2} r={1} fill="#fff" />
  </>
)
const smile = (y = 42, w = 5) => <path d={`M${32 - w} ${y} Q32 ${y + 4.5} ${32 + w} ${y}`} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
const cheeks = (y = 40, dx = 15, c = '#FF7D81') => (
  <>
    <ellipse cx={32 - dx} cy={y} rx="3.6" ry="2.3" fill={c} opacity="0.55" />
    <ellipse cx={32 + dx} cy={y} rx="3.6" ry="2.3" fill={c} opacity="0.55" />
  </>
)

const ART: Record<string, ReactNode> = {
  bull: (
    <>
      <path d="M12 22 Q6 14 10 8 Q14 16 22 19Z" fill="#F5F0E6" />
      <path d="M52 22 Q58 14 54 8 Q50 16 42 19Z" fill="#F5F0E6" />
      <ellipse cx="13" cy="30" rx="6" ry="4" fill="#9A5B3C" transform="rotate(-20 13 30)" />
      <ellipse cx="51" cy="30" rx="6" ry="4" fill="#9A5B3C" transform="rotate(20 51 30)" />
      <ellipse cx="32" cy="36" rx="19" ry="21" fill="#B06A45" />
      <ellipse cx="32" cy="47" rx="13" ry="9" fill="#F2C3A6" />
      <circle cx="27" cy="47" r="2" fill="#7A3E24" />
      <circle cx="37" cy="47" r="2" fill="#7A3E24" />
      <path d="M28 20 Q32 16 36 20" fill="none" stroke="#7A3E24" strokeWidth="3" strokeLinecap="round" />
      {eyes(33, 8)}
    </>
  ),
  bear: (
    <>
      <circle cx="16" cy="18" r="8" fill="#8B5E3C" />
      <circle cx="48" cy="18" r="8" fill="#8B5E3C" />
      <circle cx="16" cy="18" r="4" fill="#D9A77C" />
      <circle cx="48" cy="18" r="4" fill="#D9A77C" />
      <circle cx="32" cy="36" r="21" fill="#8B5E3C" />
      <ellipse cx="32" cy="44" rx="10" ry="8" fill="#D9A77C" />
      <ellipse cx="32" cy="40" rx="4" ry="3" fill={INK} />
      {eyes(32, 9)}
      {smile(46, 3.5)}
    </>
  ),
  chart: (
    <>
      <path d="M10 10 L24 22 L14 28Z" fill="#E8742A" />
      <path d="M54 10 L40 22 L50 28Z" fill="#E8742A" />
      <path d="M13 13 L21 21 L16 24Z" fill="#FFD2B3" />
      <path d="M51 13 L43 21 L48 24Z" fill="#FFD2B3" />
      <path d="M32 58 L10 32 Q12 16 32 16 Q52 16 54 32Z" fill="#F08A3C" />
      <path d="M32 58 L18 38 Q26 42 32 40 Q38 42 46 38Z" fill="#FFF4EA" />
      <circle cx="32" cy="50" r="3" fill={INK} />
      {eyes(32, 9, 3)}
    </>
  ),
  star: (
    <>
      <path d="M12 26 L14 8 L26 18Z" fill="#7C7A96" />
      <path d="M52 26 L50 8 L38 18Z" fill="#7C7A96" />
      <path d="M15 22 L16 12 L23 18Z" fill="#F7B6D2" />
      <path d="M49 22 L48 12 L41 18Z" fill="#F7B6D2" />
      <ellipse cx="32" cy="36" rx="21" ry="19" fill="#9592B0" />
      <path d="M24 20 L26 26 M32 18 L32 25 M40 20 L38 26" stroke="#6E6B8A" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 40 L34 40 L32 42.5Z" fill="#F7B6D2" />
      <path d="M32 42.5 Q29 46 26 44 M32 42.5 Q35 46 38 44" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 40 L20 41 M10 45 L20 43 M54 40 L44 41 M54 45 L44 43" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="23" cy="34" rx="3.4" ry="4.2" fill="#B8E986" />
      <ellipse cx="41" cy="34" rx="3.4" ry="4.2" fill="#B8E986" />
      <ellipse cx="23" cy="34.5" rx="1.3" ry="3.2" fill={INK} />
      <ellipse cx="41" cy="34.5" rx="1.3" ry="3.2" fill={INK} />
    </>
  ),
  coins: (
    <>
      <path d="M16 20 L20 10 L27 18Z" fill="#F48FA3" />
      <path d="M48 20 L44 10 L37 18Z" fill="#F48FA3" />
      <circle cx="32" cy="36" r="21" fill="#FFADBD" />
      <rect x="27" y="13" width="10" height="3" rx="1.5" fill="#C9506B" />
      <ellipse cx="32" cy="42" rx="9" ry="6.5" fill="#F48FA3" />
      <ellipse cx="29" cy="42" rx="1.8" ry="2.6" fill="#C9506B" />
      <ellipse cx="35" cy="42" rx="1.8" ry="2.6" fill="#C9506B" />
      {eyes(31, 9)}
      <circle cx="49" cy="18" r="6" fill="#FFC83D" stroke="#F5B01B" strokeWidth="1.5" />
      <path d="M49 15 V21" stroke="#B57E00" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  leaf: (
    <>
      <circle cx="21" cy="20" r="9" fill="#4CC38A" />
      <circle cx="43" cy="20" r="9" fill="#4CC38A" />
      <circle cx="21" cy="20" r="5.5" fill="#fff" />
      <circle cx="43" cy="20" r="5.5" fill="#fff" />
      <circle cx="22" cy="21" r="3" fill={INK} />
      <circle cx="44" cy="21" r="3" fill={INK} />
      <ellipse cx="32" cy="40" rx="23" ry="17" fill="#4CC38A" />
      <ellipse cx="32" cy="46" rx="15" ry="8" fill="#B8F0D2" />
      <path d="M18 38 Q32 50 46 38" fill="none" stroke="#1E7A50" strokeWidth="2.4" strokeLinecap="round" />
      {cheeks(37, 17)}
    </>
  ),
  globe: (
    <>
      <ellipse cx="32" cy="36" rx="20" ry="22" fill="#2C2A45" />
      <path d="M32 22 Q20 22 18 36 Q18 52 32 54 Q46 52 46 36 Q44 22 32 22Z" fill="#fff" />
      {eyes(33, 7)}
      <path d="M27 40 L37 40 L32 46Z" fill="#FFB020" />
      {cheeks(42, 11)}
    </>
  ),
  brain: (
    <>
      <line x1="32" y1="8" x2="32" y2="15" stroke="#67648A" strokeWidth="2.4" />
      <circle cx="32" cy="7" r="3" fill="#FF5A5F" />
      <rect x="12" y="15" width="40" height="38" rx="11" fill="#B4B2CC" />
      <rect x="8" y="28" width="5" height="12" rx="2.5" fill="#9592B0" />
      <rect x="51" y="28" width="5" height="12" rx="2.5" fill="#9592B0" />
      <rect x="17" y="23" width="30" height="18" rx="7" fill="#2C2A45" />
      <circle cx="25" cy="32" r="4" fill="#3FD8A2" />
      <circle cx="39" cy="32" r="4" fill="#3FD8A2" />
      <rect x="24" y="45" width="16" height="3.5" rx="1.75" fill="#67648A" />
    </>
  ),
  rocket: (
    <>
      <circle cx="12" cy="14" r="1.2" fill="#FFC83D" />
      <circle cx="52" cy="10" r="1" fill="#fff" />
      <circle cx="54" cy="50" r="1.2" fill="#fff" />
      <circle cx="32" cy="34" r="22" fill="#F1F0F7" />
      <circle cx="32" cy="34" r="16" fill="#6B4EFF" />
      <path d="M22 28 Q32 20 42 28" fill="none" stroke="#B9A9FF" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="32" cy="38" rx="11" ry="9" fill="#F2C3A6" />
      {eyes(37, 5, 2.4)}
      <path d="M29 42 Q32 44 35 42" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="27" y="54" width="10" height="5" rx="2" fill="#FF5A5F" />
    </>
  ),
  lion: (
    <>
      <circle cx="32" cy="34" r="25" fill="#D9822B" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <circle key={i} cx={32 + Math.cos(a) * 22} cy={34 + Math.sin(a) * 22} r="6" fill="#C46E1B" />
      })}
      <circle cx="32" cy="35" r="17" fill="#F5B94A" />
      <ellipse cx="32" cy="43" rx="8" ry="6" fill="#FFE2A8" />
      <path d="M29 40 L35 40 L32 43Z" fill="#7A3E24" />
      {eyes(33, 7)}
      {smile(46, 3)}
    </>
  ),
  panda: (
    <>
      <circle cx="16" cy="18" r="7" fill={INK} />
      <circle cx="48" cy="18" r="7" fill={INK} />
      <circle cx="32" cy="36" r="21" fill="#fff" />
      <ellipse cx="23" cy="34" rx="6" ry="7.5" fill={INK} transform="rotate(-20 23 34)" />
      <ellipse cx="41" cy="34" rx="6" ry="7.5" fill={INK} transform="rotate(20 41 34)" />
      <circle cx="23.5" cy="33" r="2.2" fill="#fff" />
      <circle cx="40.5" cy="33" r="2.2" fill="#fff" />
      <ellipse cx="32" cy="42" rx="3.5" ry="2.5" fill={INK} />
      {smile(46, 3)}
      {cheeks(43, 14)}
    </>
  ),
  koala: (
    <>
      <circle cx="13" cy="24" r="10" fill="#9592B0" />
      <circle cx="51" cy="24" r="10" fill="#9592B0" />
      <circle cx="13" cy="24" r="6" fill="#F1F0F7" />
      <circle cx="51" cy="24" r="6" fill="#F1F0F7" />
      <circle cx="32" cy="36" r="20" fill="#B4B2CC" />
      <ellipse cx="32" cy="40" rx="5.5" ry="7.5" fill="#3D3A58" />
      {eyes(32, 9, 2.8)}
      {cheeks(42, 13)}
    </>
  ),
  rabbit: (
    <>
      <ellipse cx="23" cy="14" rx="5" ry="13" fill="#fff" />
      <ellipse cx="41" cy="14" rx="5" ry="13" fill="#fff" />
      <ellipse cx="23" cy="15" rx="2.5" ry="9" fill="#F7B6D2" />
      <ellipse cx="41" cy="15" rx="2.5" ry="9" fill="#F7B6D2" />
      <circle cx="32" cy="38" r="19" fill="#fff" />
      <path d="M30 41 L34 41 L32 43.5Z" fill="#F48FA3" />
      <path d="M32 43.5 Q29 47 27 45 M32 43.5 Q35 47 37 45" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      {eyes(35, 8)}
      {cheeks(42, 13)}
    </>
  ),
  dog: (
    <>
      <ellipse cx="13" cy="32" rx="7" ry="14" fill="#8B5E3C" transform="rotate(12 13 32)" />
      <ellipse cx="51" cy="32" rx="7" ry="14" fill="#8B5E3C" transform="rotate(-12 51 32)" />
      <circle cx="32" cy="35" r="19" fill="#E8B17A" />
      <ellipse cx="40" cy="30" rx="7" ry="6" fill="#C98C55" />
      <ellipse cx="32" cy="44" rx="9" ry="7" fill="#FFF1DE" />
      <ellipse cx="32" cy="40" rx="4" ry="3" fill={INK} />
      <path d="M32 43 V46 M28 47 Q32 50 36 47" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="32" cy="51" rx="2.5" ry="2" fill="#FF7D81" />
      {eyes(32, 8)}
    </>
  ),
  tiger: (
    <>
      <circle cx="15" cy="18" r="7" fill="#F08A3C" />
      <circle cx="49" cy="18" r="7" fill="#F08A3C" />
      <circle cx="15" cy="18" r="3.5" fill="#FFF4EA" />
      <circle cx="49" cy="18" r="3.5" fill="#FFF4EA" />
      <circle cx="32" cy="36" r="21" fill="#F08A3C" />
      <path d="M32 16 V24 M24 17 L26 23 M40 17 L38 23 M11 34 H18 M11 40 H17 M53 34 H46 M53 40 H47" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="32" cy="45" rx="10" ry="8" fill="#FFF4EA" />
      <path d="M29 41 L35 41 L32 44Z" fill="#E0444A" />
      {eyes(34, 8)}
      {smile(47, 3)}
    </>
  ),
  hedgehog: (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI + (i / 8) * Math.PI
        const x = 32 + Math.cos(a) * 20
        const y = 38 + Math.sin(a) * 20
        return <path key={i} d={`M${32 + Math.cos(a) * 12} ${38 + Math.sin(a) * 12} L${x + Math.cos(a) * 8} ${y + Math.sin(a) * 8} L${32 + Math.cos(a + 0.35) * 14} ${38 + Math.sin(a + 0.35) * 14}Z`} fill="#6E4A2E" />
      })}
      <ellipse cx="32" cy="38" rx="21" ry="18" fill="#8B5E3C" />
      <ellipse cx="32" cy="43" rx="15" ry="12" fill="#F2D3B3" />
      <circle cx="32" cy="44" r="3" fill={INK} />
      {eyes(37, 7, 2.8)}
      {cheeks(45, 11)}
    </>
  ),
  whale: (
    <>
      <path d="M32 10 Q28 4 24 6 M32 10 Q36 4 40 6 M32 10 V16" fill="none" stroke="#7CC7FF" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 40 Q8 18 32 18 Q56 18 56 40 Q56 54 32 54 Q8 54 8 40Z" fill="#2E9BFF" />
      <path d="M12 44 Q32 58 52 44 Q50 52 32 52 Q14 52 12 44Z" fill="#DBECFF" />
      {eyes(34, 11)}
      {smile(41, 6)}
      {cheeks(40, 18)}
    </>
  ),
}

export function Avatar({ id, size = 44, label }: { id: string; size?: number; label?: string }) {
  const a = AVATARS.find((x) => x.id === id) ?? AVATARS[0]
  return (
    <span className="avatar" style={{ width: size, height: size, background: a.bg }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {a.id === 'vane' ? (
        <span style={{ marginTop: size * 0.18 }}><Mascot size={size * 0.85} /></span>
      ) : (
        <svg viewBox="0 0 64 64" width={size} height={size}>{ART[a.id]}</svg>
      )}
    </span>
  )
}
