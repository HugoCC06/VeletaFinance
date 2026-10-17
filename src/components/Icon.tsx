import type { ComponentType } from 'react'
import {
  Anchor, ArrowLeft, ArrowRight, ArrowSquareOut, ArrowsClockwise, Atom, Bank, Barbell, Bell, BookOpen, Books, Brain, Buildings,
  Calculator, Calendar, CalendarCheck, CalendarStar, CaretDown, CaretLeft, CaretRight, CaretUp, ChartBar, ChartLine, ChartLineUp,
  ChartPieSlice, Check, Clock, ClockCounterClockwise, Coins, Compass, Confetti, Copy, Crown, CrownSimple, CurrencyBtc, CurrencyGbp,
  Diamond, DownloadSimple, Eye, EyeSlash, Feather, FileText, Fire, Flag, Flask, Gift, GearSix, GlobeHemisphereWest, GraduationCap,
  HandCoins, Handshake, Heart, Hexagon, Hourglass, House, HouseLine, Infinity as InfinityIcon, Info, Leaf, Lightbulb, Lighthouse,
  Lightning, LinkSimple, List, LockSimple, MagnifyingGlass, MapTrifold, Medal, MedalMilitary, Minus, Moon, Mountains, Notebook,
  Percent, PiggyBank, Planet, Plant, Play, Plus, Ranking, Receipt, RocketLaunch, Scales, Scroll, Seal, SealCheck, ShareNetwork,
  Shield, ShieldCheck, SignOut, Snowflake, Sparkle, Stack, Star, Strategy, Student, Sun, Target, Trash, TrendDown, TrendUp, Trophy,
  User, UsersThree, Vault, Wallet, WarningCircle, X, Crosshair,
  type IconProps as PhosphorProps,
} from '@phosphor-icons/react'

/**
 * Veleta's icon set: Phosphor Icons (MIT) mapped to stable app-wide names,
 * rendered in the playful "duotone" weight by default.
 */
const ICONS: Record<string, ComponentType<PhosphorProps>> = {
  home: House, map: MapTrifold, book: BookOpen, books: Books, refresh: ArrowsClockwise, tools: Calculator, trophy: Trophy,
  users: UsersThree, user: User, settings: GearSix, flame: Fire, bolt: Lightning, snow: Snowflake, lock: LockSimple, check: Check,
  x: X, star: Star, chart: ChartLineUp, chartLine: ChartLine, pie: ChartPieSlice, scale: Scales, doc: FileText, bank: Bank,
  coins: Coins, brain: Brain, seed: Plant, spark: Sparkle, sparkles: Sparkle, target: Target, stack: Stack, calendar: CalendarCheck,
  calendarPlain: Calendar, calendarStar: CalendarStar, flag: Flag, crown: Crown, crownSimple: CrownSimple, chevronRight: CaretRight,
  chevronLeft: CaretLeft, chevronDown: CaretDown, chevronUp: CaretUp, arrowRight: ArrowRight, arrowLeft: ArrowLeft, info: Info,
  alert: WarningCircle, download: DownloadSimple, share: ShareNetwork, link: LinkSimple, search: MagnifyingGlass, menu: List,
  logout: SignOut, eye: Eye, eyeOff: EyeSlash, play: Play, clock: Clock, history: ClockCounterClockwise, plus: Plus, minus: Minus,
  globe: GlobeHemisphereWest, rocket: RocketLaunch, leaf: Leaf, bull: TrendUp, bear: TrendDown, heart: Heart, copy: Copy,
  trash: Trash, shield: ShieldCheck, shieldPlain: Shield, graduation: GraduationCap, bell: Bell, candles: ChartBar, percent: Percent,
  external: ArrowSquareOut, wallet: Wallet, piggy: PiggyBank, crypto: CurrencyBtc, pound: CurrencyGbp, buildings: Buildings,
  house: HouseLine, hourglass: Hourglass, medal: Medal, medalMilitary: MedalMilitary, bulb: Lightbulb, handshake: Handshake,
  compass: Compass, mountains: Mountains, summit: Mountains, diamond: Diamond, gift: Gift, confetti: Confetti, planet: Planet,
  moon: Moon, sun: Sun, student: Student, receipt: Receipt, strategy: Strategy, anchor: Anchor, feather: Feather,
  lighthouse: Lighthouse, infinity: InfinityIcon, hexagon: Hexagon, ranking: Ranking, seal: Seal, sealCheck: SealCheck,
  flask: Flask, handCoins: HandCoins, vault: Vault, scroll: Scroll, notebook: Notebook, atom: Atom, barbell: Barbell,
  crosshair: Crosshair,
}

/** Icons that read better in a solid or bold weight. */
const BOLD = new Set(['check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'chevronUp', 'arrowRight', 'arrowLeft', 'plus', 'minus', 'menu'])
const FILL = new Set(['flame', 'bolt', 'star', 'heart', 'play'])

export type IconName = keyof typeof ICONS

interface IconProps {
  name: IconName | string
  size?: number
  className?: string
  /** If provided the icon is announced; otherwise it is decorative. */
  label?: string
  weight?: PhosphorProps['weight']
  /** Kept for API compatibility with the previous icon set. */
  strokeWidth?: number
  fill?: string
}

export function Icon({ name, size = 22, className, label, weight }: IconProps) {
  const C = ICONS[name] ?? Sparkle
  const w = weight ?? (BOLD.has(name) ? 'bold' : FILL.has(name) ? 'fill' : 'duotone')
  return (
    <C
      className={className}
      size={size}
      weight={w}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    />
  )
}

export const ICON_NAMES = Object.keys(ICONS)
