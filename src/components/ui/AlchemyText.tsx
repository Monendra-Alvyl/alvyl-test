import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type AccentWeight = 'italic' | 'light-italic' | 'thin-italic'

const weights: Record<AccentWeight, string> = {
  italic: 'font-normal',
  'light-italic': 'font-light',
  'thin-italic': 'font-thin',
}

type AlchemyTextProps = {
  children: ReactNode
  /** IvyMode italic cut used by the design: "Italic" (400), "Light Italic" (300) or "Thin Italic" (100). */
  weight?: AccentWeight
}

/** Accent words in headings, filled with the Alchemy gradient. */
export function AlchemyText({ children, weight = 'thin-italic' }: AlchemyTextProps) {
  return <span className={cn('text-alchemy font-display italic', weights[weight])}>{children}</span>
}
