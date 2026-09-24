import { cn } from '@/lib/cn'

type ProgressIndicatorProps = {
  /** 0–1 scroll progress of the carousel it belongs to. */
  progress: number
  /** Track colour differs between sections in the design (17:352 vs 17:503). */
  track?: 'very-light' | 'black'
  className?: string
}

const THUMB_WIDTH = 57

/** Carousel indicator: 4px track with a 57px Alchemy thumb. */
export function ProgressIndicator({
  progress,
  track = 'very-light',
  className,
}: ProgressIndicatorProps) {
  const clamped = Math.min(1, Math.max(0, progress))
  return (
    <div
      aria-hidden
      className={cn(
        'relative h-1 shrink-0 overflow-clip rounded-[2px]',
        track === 'black' ? 'bg-stroke-dark-black w-[115px]' : 'bg-stroke-very-light w-[116px]',
        className,
      )}
    >
      <div
        className="bg-alchemy absolute top-0 h-1 rounded-[10px]"
        style={{ width: THUMB_WIDTH, left: `calc((100% - ${THUMB_WIDTH}px) * ${clamped})` }}
      />
    </div>
  )
}
