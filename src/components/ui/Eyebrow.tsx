import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'

type EyebrowProps = {
  children: string
  /** `section` — section label (#B5B5B5); `card` — numbered card label (white 70%). */
  tone?: 'section' | 'card'
  className?: string
}

/** Small uppercase label with the Alchemy dot, e.g. "WHY WE EXSIST", "01". */
export function Eyebrow({ children, tone = 'section', className }: EyebrowProps) {
  return (
    <div className={cn('flex items-center gap-2 rounded-[8px] opacity-80', className)}>
      <img
        alt=""
        width={12}
        height={12}
        className="size-3 shrink-0"
        src={
          tone === 'card'
            ? asset('/assets/icons/card-dot.png')
            : asset('/assets/icons/eyebrow-dot.png')
        }
      />
      <span
        className={cn(
          'text-caption font-sans font-medium tracking-[0.08em] whitespace-nowrap uppercase',
          tone === 'card' ? 'pt-[2px] text-white/70' : 'text-text-ultra-light',
        )}
      >
        {children}
      </span>
    </div>
  )
}
