import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Panel } from '@/components/ui/Panel'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { team, type TeamMember } from '@/data/home'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { cn } from '@/lib/cn'

const cardSize = 'h-[480px] w-[334px] shrink-0 snap-start lg:h-[600px] lg:w-[416px]'
const face = 'absolute inset-0 flex flex-col overflow-clip rounded-[16px] backface-hidden'

function Caption({ person }: { person: TeamMember }) {
  return (
    <div className="from-light-grey/50 to-light-grey/0 p-card-nested relative flex items-end justify-between gap-4 bg-linear-to-t">
      {/* Roles are hidden for now (not yet wanted from the CMS). */}
      <p className="text-h3 text-text-dark min-w-0 font-sans font-medium">{person.name}</p>
      {/* Sits above the full-card flip button so it stays clickable. */}
      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label={`${person.name} on LinkedIn`}
          className="relative z-10 mb-[5px] shrink-0 text-white"
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
    <article aria-label={person.name} className={cn(cardSize, 'relative perspective-[1600px]')}>
      <div
        className={cn(
          'relative size-full transition-transform duration-700 ease-in-out transform-3d motion-reduce:transition-none',
          flipped && 'rotate-y-180',
        )}
      >
        <Face hidden={flipped} className={cn('justify-end', !person.image && 'bg-dark-grey')}>
          {person.image && (
            <img
              src={person.image}
              alt={person.imageAlt}
              loading="lazy"
              decoding="async"
              className="absolute size-full max-w-none object-cover"
            />
          )}
          {flipButton}
          <Caption person={person} />
        </Face>

        <Face hidden={!flipped} className="bg-pitch-black rotate-y-180 justify-between">
          {flipButton}
          <div className="px-card-nested pointer-events-none relative flex flex-col gap-6 pt-12">
            <img
              src="/assets/home/quote-mark.png"
              alt=""
              aria-hidden
              className="h-[68px] w-[87px] -translate-x-px"
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

/** Team carousel — flip cards (photo ↔ quote), with a scroll-progress indicator. */
export function Team() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <Panel as="section" aria-label="Our team" className="p-section-inner flex flex-col gap-12">
      <div
        ref={ref}
        className="-mr-section-inner flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {team.map((person) => (
          <FlipCard key={person.id} person={person} />
        ))}
      </div>
      <ProgressIndicator progress={progress} />
    </Panel>
  )
}
