import { Icon } from './Icon'
import { Mascot } from '../brand/Mascot'

export const AVATARS: { id: string; label: string; bg: string; fg: string; icon?: string }[] = [
  { id: 'vane', label: 'Vane the mascot', bg: '#D4F6E8', fg: '#0B7A57' },
  { id: 'bull', label: 'Bull', bg: '#FFE1E2', fg: '#B42B31', icon: 'bull' },
  { id: 'bear', label: 'Bear', bg: '#ECE8FF', fg: '#4226C4', icon: 'bear' },
  { id: 'rocket', label: 'Rocket', bg: '#DBECFF', fg: '#0F5EA8', icon: 'rocket' },
  { id: 'coins', label: 'Coins', bg: '#FFF1C7', fg: '#8A5A00', icon: 'coins' },
  { id: 'leaf', label: 'Leaf', bg: '#D4F6E8', fg: '#0B7A57', icon: 'leaf' },
  { id: 'globe', label: 'Globe', bg: '#DBECFF', fg: '#0F5EA8', icon: 'globe' },
  { id: 'chart', label: 'Chart', bg: '#ECE8FF', fg: '#4226C4', icon: 'chart' },
  { id: 'star', label: 'Star', bg: '#FFF1C7', fg: '#8A5A00', icon: 'star' },
  { id: 'brain', label: 'Brain', bg: '#FFE1E2', fg: '#B42B31', icon: 'brain' },
]

export function Avatar({ id, size = 44, label }: { id: string; size?: number; label?: string }) {
  const a = AVATARS.find((x) => x.id === id) ?? AVATARS[0]
  return (
    <span className="avatar" style={{ width: size, height: size, background: a.bg, color: a.fg }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {a.icon ? <Icon name={a.icon} size={Math.round(size * 0.55)} /> : <span style={{ marginTop: size * 0.18 }}><Mascot size={size * 0.85} /></span>}
    </span>
  )
}
