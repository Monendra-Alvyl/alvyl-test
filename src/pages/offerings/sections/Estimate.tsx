import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { estimate } from '@/data/offerings'

/** "Calculate your project estimate" call-out with the calculator render bleeding off the bottom. */
export function Estimate() {
  return (
    <Panel
      as="section"
      aria-labelledby="estimate-heading"
      className="p-section-inner flex min-h-[380px] flex-col items-start justify-between gap-12 md:min-h-[300px] lg:h-[400px]"
    >
      <img
        src={estimate.image}
        alt=""
        aria-hidden
        className="absolute right-6 bottom-0 w-[150px] md:right-12 md:w-[190px] lg:right-[89px] lg:w-[322px]"
      />
      <h2
        id="estimate-heading"
        className="font-display text-h2 text-text-dark relative max-w-[640px] font-light"
      >
        <RichHeading lines={estimate.headline} accentWeight="italic" />
      </h2>
      <Button href={estimate.cta.href} size="responsive-lg" className="relative">
        {estimate.cta.label}
      </Button>
    </Panel>
  )
}
