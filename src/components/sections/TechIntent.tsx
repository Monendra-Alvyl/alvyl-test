import { FeaturePanel } from '@/components/sections/FeaturePanel'
import { RichHeading } from '@/components/ui/RichHeading'
import { techIntent } from '@/data/home'
import { Img } from '@/components/ui/Img'

/** "Tech is our language. Humanity is intent." — sphere art bleeds off the right/bottom edge. */
export function TechIntent() {
  return (
    <FeaturePanel
      id="tech-intent-heading"
      eyebrow={techIntent.eyebrow}
      heading={<RichHeading lines={techIntent.headline} accentWeight="italic" />}
      headingWidth="lg:w-[453px]"
      body={techIntent.body}
      art={
        <div
          aria-hidden
          className="-mx-section-inner -mb-section-inner pointer-events-none relative h-[300px] md:h-[360px] lg:contents"
        >
          <Img
            src={techIntent.image}
            alt=""
            className="absolute top-0 left-[120px] size-[260px] max-w-none md:right-[-120px] md:left-auto md:size-[420px] lg:top-[72px] lg:right-[-147px] lg:size-[715px]"
            sizes="(min-width: 1033px) 715px, (min-width: 450px) 420px, 260px"
          />
        </div>
      }
    />
  )
}
