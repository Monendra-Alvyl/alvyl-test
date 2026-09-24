import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { whyWeStarted } from '@/data/about'
import { Img } from '@/components/ui/Img'

/** "Why we started?" — two-paragraph statement beside a photo (photo first below desktop). */
export function WhyWeStarted() {
  return (
    <Panel
      as="section"
      aria-labelledby="why-we-started-heading"
      className="p-section-inner flex flex-col gap-12"
    >
      <Eyebrow>{whyWeStarted.eyebrow}</Eyebrow>
      <div className="flex flex-col-reverse gap-12 lg:flex-row lg:gap-14">
        <h2
          id="why-we-started-heading"
          className="font-display text-h2 text-text-dark flex flex-1 flex-col gap-[1lh] font-light"
        >
          {whyWeStarted.paragraphs.map((paragraph) => (
            <span key={paragraph}>{paragraph}</span>
          ))}
        </h2>
        <Img
          src={whyWeStarted.image}
          alt={whyWeStarted.imageAlt}
          className="aspect-[614/598] w-full shrink-0 rounded-[16px] object-cover lg:h-[600px] lg:w-[614px]"
          sizes="(min-width: 1033px) 614px, 100vw"
        />
      </div>
    </Panel>
  )
}
