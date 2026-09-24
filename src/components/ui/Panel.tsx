import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PanelProps = {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article' | 'footer'
  id?: string
  'aria-labelledby'?: string
}

/** Bordered section container used throughout the design (black, #1E1E1E stroke, 24px radius). */
export function Panel({ children, className, as: Tag = 'div', ...rest }: PanelProps) {
  return (
    <Tag
      className={cn(
        'border-stroke-light bg-pitch-black relative overflow-clip rounded-[24px] border',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
