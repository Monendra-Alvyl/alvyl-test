import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

const icons = {
  arrow: '/assets/icons/arrow-forward.svg',
  arrowCircle: '/assets/icons/arrow-circle.svg',
  send: '/assets/icons/send.svg',
  linkedin: '/assets/icons/linkedin.svg',
} as const

type IconProps = {
  name: keyof typeof icons
  /** Rendered size in px (square). */
  size: number
  className?: string
}

/** Single-colour icon from /public/assets/icons, tinted with the current text colour. */
export function Icon({ name, size, className }: IconProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    maskImage: `url(${icons[name]})`,
    WebkitMaskImage: `url(${icons[name]})`,
  }
  return <span aria-hidden className={cn('mask-icon', className)} style={style} />
}
