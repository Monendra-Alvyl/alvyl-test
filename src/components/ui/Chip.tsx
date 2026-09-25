import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { chipClasses, type ChipSize } from './chipClasses'

/*
 * Chip — Figma 16:1210.
 *   Status: Active (selected) | Inactive (unselected)
 *   Sizes:  Large (14px) | Small (12px)
 * `chipClasses` (./chipClasses.ts) gives the same look to non-interactive tags (e.g. service capability lists).
 */

type ChipProps = {
  selected: boolean
  size?: ChipSize
  children: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function Chip({ selected, size = 'large', className, children, ...buttonProps }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(chipClasses(selected, size), className)}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
