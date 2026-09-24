import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'

const icons = {
  arrow: asset('/assets/icons/arrow-forward.svg'),
  arrowCircle: asset('/assets/icons/arrow-circle.svg'),
  send: asset('/assets/icons/send.svg'),
  linkedin: asset('/assets/icons/linkedin.svg'),
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
