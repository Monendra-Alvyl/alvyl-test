import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Panel } from '@/components/ui/Panel'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { team, teamHeading, type TeamMember } from '@/data/home'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'
import { Img } from '@/components/ui/Img'

/* On phones the card is narrowed to leave a peek of the next one (and keep the LinkedIn icon on screen). */
const cardSize =
  'h-[480px] w-[min(334px,calc(100vw-80px))] shrink-0 snap-start lg:h-[600px] lg:w-[416px]'
const face = 'absolute inset-0 flex flex-col overflow-clip rounded-[16px] backface-hidden'

function Caption({ person }: { person: TeamMember }) {
  return (
    <div className="from-light-grey/50 to-light-grey/0 p-card-nested relative flex items-end justify-between gap-4 bg-linear-to-t">
      <div className="flex min-w-0 flex-col gap-2">
        {person.role && (
          <p className="text-body-sm text-text-ultra-light font-sans font-medium">{person.role}</p>
        )}
        <p className="text-h3 text-text-dark font-sans font-medium">{person.name}</p>
      </div>
      {/* Sits above the full-card flip button so it stays clickable. */}
      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label={`${person.name} on LinkedIn`}
          className="tap-target z-10 mb-[5px] shrink-0 text-white"
        >
          <Icon name="linkedin" size={28} />
        </a>
      )}
    </div>
  )
}

function Face({
  hidden,
  className,
  children,
}: {
  hidden: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn(face, className)} inert={hidden} aria-hidden={hidden || undefined}>
      {children}
    </div>
  )
}

/** Person card: photo on the front, quote on the back. Clicking the card flips it. */
function FlipCard({ person }: { person: TeamMember }) {
  const [flipped, setFlipped] = useState(false)

  const flipButton = (
    <button
      type="button"
      aria-pressed={flipped}
      aria-label={flipped ? `Show ${person.name}'s photo` : `Show ${person.name}'s quote`}
      onClick={() => setFlipped((value) => !value)}
      className="absolute inset-0 cursor-pointer rounded-[16px]"
    />
  )

  return (
    <article
      aria-label={person.name}
      className={cn(cardSize, 'hover-grow relative perspective-[1600px]')}
    >
      <div
        className={cn(
          'relative size-full transition-transform duration-700 ease-in-out transform-3d motion-reduce:transition-none',
          flipped && 'rotate-y-180',
        )}
      >
        <Face hidden={flipped} className={cn('justify-end', !person.image && 'bg-dark-grey')}>
          {person.image && (
            <Img
              src={person.image}
              alt={person.imageAlt}
              decoding="async"
              className="absolute size-full max-w-none object-cover"
              sizes="(min-width: 1033px) 416px, 334px"
            />
          )}
          {flipButton}
          <Caption person={person} />
        </Face>

        <Face hidden={!flipped} className="bg-pitch-black rotate-y-180 justify-between">
          {flipButton}
          <div className="px-card-nested pointer-events-none relative flex flex-col gap-6 pt-12">
            <Img
              src={asset('/assets/home/quote-mark.png')}
              alt=""
              aria-hidden
              className="h-[68px] w-[87px] -translate-x-px"
              sizes="87px"
            />
            <blockquote className="text-h3 text-text-white max-w-[330px] font-sans font-medium">
              {person.quote}
            </blockquote>
          </div>
          <Caption person={person} />
        </Face>
      </div>
    </article>
  )
}

/** Long thin arrow used by the carousel controls (points right; flipped for "previous"). */
function LongArrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 38 14"
      fill="none"
      className={cn('h-[14px] w-[38px]', flip && '-scale-x-100')}
    >
      <path d="M0 7h36M30 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/** "Our People" carousel — flip cards (photo ↔ quote), progress indicator and prev/next arrows. */
export function Team() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  /** Scrolls the track by one card (card width + 16px gap). */
  const step = (direction: 1 | -1) => {
    const track = ref.current
    const card = track?.querySelector('article')
    if (!track || !card) return
    track.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: 'smooth' })
  }

  const arrow =
    'tap-target text-white opacity-60 transition-[opacity,transform] duration-200 hover:opacity-100 disabled:pointer-events-none disabled:opacity-25'

  return (
    <Panel
      as="section"
      aria-label={teamHeading}
      className="p-section-inner flex flex-col gap-8 md:gap-12"
    >
      <Eyebrow>{teamHeading}</Eyebrow>
      {/* Extra padding keeps cards from being clipped while they grow on hover. */}
      <div
        ref={ref}
        className="-mr-section-inner -my-4 -ml-3 flex snap-x snap-mandatory scroll-pl-3 [scrollbar-width:none] gap-4 overflow-x-auto py-4 pl-3 [&::-webkit-scrollbar]:hidden"
      >
        {team.map((person) => (
          <FlipCard key={person.id} person={person} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <ProgressIndicator progress={progress} />
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Previous team members"
            onClick={() => step(-1)}
            disabled={progress <= 0.001}
            className={cn(arrow, 'hover:-translate-x-[3px]')}
          >
            <LongArrow flip />
          </button>
          <button
            type="button"
            aria-label="Next team members"
            onClick={() => step(1)}
            disabled={progress >= 0.999}
            className={cn(arrow, 'hover:translate-x-[3px]')}
          >
            <LongArrow />
          </button>
        </div>
      </div>
    </Panel>
  )
}
