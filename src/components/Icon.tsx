import type { ReactNode } from 'react'

/** Original, minimal stroke icon set (24×24 grid). */
const P: Record<string, ReactNode> = {
  home: <><path d="M4 11 12 4l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></>,
  map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" /><path d="M4 3v5h5" /><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" /><path d="M20 21v-5h-5" /></>,
  tools: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 7h8M8 11h2M12 11h0M16 11h0M8 15h2M12 15h0M16 15v3M8 18h4" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 20h8M10 17h4" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3 6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  flame: <path d="M12 21c4 0 7-2.8 7-7 0-3.5-2.3-6-4-8 0 2.5-1.5 4-3 4 .5-3-1-6-4-7 .5 3-3 5.5-3 10 0 4.2 3 8 7 8Z" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  snow: <><path d="M12 2v20M4 7l16 10M4 17 20 7" /><path d="m9 4 3 2 3-2M9 20l3-2 3 2" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" />,
  chart: <><path d="M4 4v16h16" /><path d="m7 15 4-4 3 3 5-6" /></>,
  pie: <><path d="M12 3a9 9 0 1 0 9 9h-9V3Z" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" /></>,
  scale: <><path d="M12 4v16M7 20h10M4 8h16" /><path d="m4 8-2.5 6a3 3 0 0 0 5 0L4 8ZM20 8l-2.5 6a3 3 0 0 0 5 0L20 8Z" /></>,
  doc: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  bank: <><path d="M3 9 12 4l9 5H3Z" /><path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8M3 20h18" /></>,
  coins: <><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" /><path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.6-2.4-2.9-5.5-3" /></>,
  brain: <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1Z" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" /></>,
  seed: <><path d="M12 21v-8" /><path d="M12 13c0-4 3-7 8-7 0 5-3 7-8 7Z" /><path d="M12 15c0-3-2.5-6-7-6 0 4 2.5 6 7 6Z" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5L12 8Z" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  stack: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
  crown: <><path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z" /></>,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  chevronUp: <path d="m5 15 7-7 7 7" />,
  arrowRight: <><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></>,
  arrowLeft: <><path d="M20 12H4" /><path d="m10 6-6 6 6 6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h0" /></>,
  alert: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h0" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 20h16" /></>,
  share: <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1" /><path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  logout: <><path d="M9 21H5V3h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.8 8.5 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1" /></>,
  play: <path d="M7 4v16l13-8L7 4Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" /></>,
  rocket: <><path d="M12 15c5-2 8-6 8-12-6 0-10 3-12 8l4 4Z" /><path d="M8 11H4l3-4h4M13 16v4l4-3v-4" /><path d="M7 17c-2 0-3 2-3 3 1 0 3-1 3-3Z" /></>,
  leaf: <><path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15" /><path d="M5 19 13 11" /></>,
  bull: <><path d="M4 6c0 3 2 4 4 4M20 6c0 3-2 4-4 4" /><path d="M8 9h8l1 5a5 5 0 0 1-10 0l1-5Z" /><circle cx="10" cy="13" r=".8" /><circle cx="14" cy="13" r=".8" /><path d="M11 16h2" /></>,
  bear: <><circle cx="7" cy="6" r="2.5" /><circle cx="17" cy="6" r="2.5" /><circle cx="12" cy="13" r="7" /><circle cx="10" cy="12" r=".8" /><circle cx="14" cy="12" r=".8" /><path d="M10.5 15.5h3" /></>,
  heart: <path d="M12 20s-8-4.6-8-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.4-8 10-8 10Z" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  graduation: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z" /><path d="M10 21h4" /></>,
  candles: <><path d="M7 3v18M17 3v18" /><rect x="5" y="7" width="4" height="8" rx="1" /><rect x="15" y="10" width="4" height="6" rx="1" /></>,
  percent: <><path d="M19 5 5 19" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /></>,
  sparkles: <><path d="m9 4 1.5 4L15 9.5l-4.5 1.5L9 15l-1.5-4L3 9.5 7.5 8 9 4Z" /><path d="m17 14 .8 2.2L20 17l-2.2.8L17 20l-.8-2.2L14 17l2.2-.8L17 14Z" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 14v5H5V6h5" /></>,
}

export type IconName = keyof typeof P

interface IconProps {
  name: IconName | string
  size?: number
  className?: string
  /** If provided the icon is announced; otherwise it is decorative. */
  label?: string
  strokeWidth?: number
  fill?: string
}

export function Icon({ name, size = 22, className, label, strokeWidth = 2.2, fill = 'none' }: IconProps) {
  const body = P[name] ?? P.spark
  const filled = name === 'flame' || name === 'bolt' || name === 'star' || name === 'heart' || name === 'play'
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled && fill === 'none' ? 'currentColor' : fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {body}
    </svg>
  )
}
