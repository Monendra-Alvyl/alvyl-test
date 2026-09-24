import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/*
 * Chip — Figma 16:1210.
 *   Status: Active (selected) | Inactive (unselected)
 *   Sizes:  Large (14px) | Small (12px)
 */

type ChipProps = {
  selected: boolean
  size?: 'large' | 'small'
  children: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function Chip({ selected, size = 'large', className, children, ...buttonProps }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center rounded-[8px] border border-white p-3 font-sans leading-none font-medium tracking-[0.16em] whitespace-nowrap uppercase',
        size === 'large' ? 'text-[14px]' : 'text-[12px]',
        selected
          ? 'bg-btn-primary text-btn-primary-text'
          : 'bg-btn-secondary text-text-ultra-light',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
