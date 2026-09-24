import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from '@/lib/router'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'
import { Spinner } from './Spinner'

/*
 * Button — Figma component set 16:1063.
 *   Size:  XL | S, plus two responsive sizes that switch S → XL:
 *          'responsive' at the tablet breakpoint (Home hero), 'responsive-lg' at desktop (feature panels)
 *   Type:  Primary | Secondary
 *   State: Active (default) | Clicked (:active) | Disabled | Loading
 * The design defines no hover state, so none is styled.
 */

type Variant = 'primary' | 'secondary'
type Size = 'xl' | 's' | 'responsive' | 'responsive-lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  loading?: boolean
  /** Trailing arrow icon (present on every button variant in the design). */
  arrow?: boolean
  className?: string
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined }
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const base =
  'inline-flex shrink-0 items-center justify-center rounded-[8px] text-center font-sans text-[14px] leading-none font-medium whitespace-nowrap'

const sizes: Record<Size, string> = {
  xl: 'h-[46px] gap-[10px] p-4',
  s: 'gap-1 p-3',
  responsive: 'gap-1 p-3 md:h-[46px] md:gap-[10px] md:p-4',
  'responsive-lg': 'gap-1 p-3 lg:h-[46px] lg:gap-[10px] lg:p-4',
}

const loadingSizes: Record<Size, string> = {
  xl: 'h-[46px] min-w-[120px] px-[10px] py-4',
  s: 'h-[46px] rounded-[66px] p-4',
  responsive: 'h-[46px] min-w-[120px] px-[10px] py-4',
  'responsive-lg': 'h-[46px] min-w-[120px] px-[10px] py-4',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-btn-primary text-btn-primary-text active:bg-text-light disabled:bg-text-light disabled:opacity-50',
  secondary:
    'border border-btn-secondary-stroke bg-btn-secondary text-btn-secondary-text active:border-stroke-dark disabled:border-stroke-dark disabled:text-text-ultra-light disabled:opacity-50',
}

/* Clicked text colour differs by size for Secondary (XL #E8E8E8, S #D6D6D6). */
const secondaryClicked: Record<Size, string> = {
  xl: 'active:text-text-dark',
  s: 'active:text-text-light',
  responsive: 'active:text-text-light md:active:text-text-dark',
  'responsive-lg': 'active:text-text-light lg:active:text-text-dark',
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'xl',
    loading = false,
    arrow = true,
    className,
    children,
    ...rest
  } = props

  const classes = cn(
    base,
    variants[variant],
    variant === 'secondary' && secondaryClicked[size],
    loading ? loadingSizes[size] : sizes[size],
    className,
  )

  const content = loading ? (
    <>
      <Spinner />
      <span className="sr-only">{children}</span>
    </>
  ) : (
    <>
      {children}
      {arrow && <Icon name="arrow" size={14.578} />}
    </>
  )

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink
    return href.startsWith('/') ? (
      <Link to={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    ) : (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    )
  }

  const { type = 'button', disabled, ...buttonProps } = rest as ButtonAsButton
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  )
}
