import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { careers } from '@/data/about'
import { Img } from '@/components/ui/Img'

/** Careers call-out — heading beside a photo (photo first below desktop). */
export function Careers() {
  return (
    <Panel
      as="section"
      id="careers"
      aria-labelledby="careers-heading"
      className="p-section-inner flex scroll-mt-28 flex-col gap-12"
    >
      <Eyebrow>{careers.eyebrow}</Eyebrow>
      <div className="flex flex-col-reverse gap-8 lg:flex-row lg:justify-between lg:gap-12">
        <div className="flex flex-col items-start gap-8 lg:justify-between">
          <h2
            id="careers-heading"
            className="font-display text-h2 text-text-dark max-w-[460px] font-light"
          >
            <RichHeading lines={[careers.headline]} accentWeight="italic" />
          </h2>
        </div>
        <Img
          src={careers.image}
          alt={careers.imageAlt}
          className="aspect-[488/272] w-full shrink-0 rounded-[16px] object-cover md:w-[488px]"
          sizes="(min-width: 450px) 488px, 100vw"
        />
      </div>
    </Panel>
  )
}
