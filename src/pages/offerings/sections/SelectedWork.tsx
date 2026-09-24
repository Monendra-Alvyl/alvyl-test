import { FeaturePanel } from '@/components/sections/FeaturePanel'
import { Img } from '@/components/ui/Img'
import { RichHeading } from '@/components/ui/RichHeading'
import { selectedWork } from '@/data/offerings'

/** "Selected work — Proven results, stunning designs": statement beside the 3D sphere art. */
export function SelectedWork() {
  return (
    <FeaturePanel
      id="selected-work-heading"
      eyebrow={selectedWork.eyebrow}
      heading={<RichHeading lines={selectedWork.headline} accentWeight="italic" />}
      headingWidth="lg:w-[560px]"
      body={selectedWork.body}
      compact
      art={
        <Img
          src={selectedWork.image}
          alt=""
          aria-hidden
          sizes="(min-width: 1033px) 550px, 340px"
          className="pointer-events-none mx-auto w-[340px] max-w-none lg:absolute lg:right-0 lg:bottom-0 lg:w-[550px]"
        />
      }
    />
  )
}
