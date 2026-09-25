import { cn } from '@/lib/cn'

/** Chip look (Figma 16:1210) for the Chip button and for non-interactive tags. */
export type ChipSize = 'large' | 'small'

export function chipClasses(selected: boolean, size: ChipSize = 'large') {
  return cn(
    'inline-flex items-center rounded-[8px] border border-white p-3 font-sans leading-none font-medium tracking-[0.16em] whitespace-nowrap uppercase',
    size === 'large' ? 'text-[14px]' : 'text-[12px]',
    selected ? 'bg-btn-primary text-btn-primary-text' : 'bg-btn-secondary text-text-ultra-light',
  )
}
