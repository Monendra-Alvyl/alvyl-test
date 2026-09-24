import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { cn } from '@/lib/cn'

type FeaturePanelProps = {
  id: string
  eyebrow: string
  heading: ReactNode
  body: string
  /** Optional call to action (omitted while its destination does not exist yet). */
  cta?: { label: string; href: string }
  /** Decorative artwork, absolutely positioned by the caller. */
  art: ReactNode
  /** Heading text-box width on desktop (Figma: 627 / 453). */
  headingWidth: string
}

/**
 * 600px-tall panel with eyebrow, heading, body, CTA and artwork — Figma 17:355 / 17:433.
 * Below desktop the artwork sits in the flow between the body copy and the CTA (pg/Home Tablet, Phone).
 */
export function FeaturePanel({
  id,
  eyebrow,
  heading,
  body,
  cta,
  art,
  headingWidth,
}: FeaturePanelProps) {
  return (
    <Panel
      as="section"
      aria-labelledby={id}
      className="p-section-inner flex flex-col gap-8 md:gap-12 lg:h-[600px]"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="relative z-10 flex flex-1 flex-col items-start justify-between gap-8 max-lg:contents md:gap-12">
        <div className="flex flex-col gap-4 md:gap-6">
          <h2
            id={id}
            className={cn(
              'font-display text-h2 text-text-dark font-light md:max-w-[480px] lg:max-w-none',
              headingWidth,
            )}
          >
            {heading}
          </h2>
          <p className="text-body-lg text-text-ultra-light max-w-[463px] font-sans font-medium">
            {body}
          </p>
        </div>
        {cta && (
          <Button href={cta.href} size="responsive-lg" className="self-start max-lg:order-2">
            {cta.label}
          </Button>
        )}
      </div>
      <div className="max-lg:order-1 max-md:my-2 lg:contents">{art}</div>
    </Panel>
  )
}
