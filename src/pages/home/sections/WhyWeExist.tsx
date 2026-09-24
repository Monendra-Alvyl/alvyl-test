import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { RichHeading } from '@/components/ui/RichHeading'
import { whyWeExist } from '@/data/home'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { cn } from '@/lib/cn'
import { Img } from '@/components/ui/Img'

/** "Why we exist" — Figma 17:341. Photo track overflows the panel and scrolls horizontally. */
export function WhyWeExist() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <Panel
      as="section"
      aria-labelledby="why-we-exist-heading"
      className="p-section-inner flex flex-col gap-12"
    >
      <Eyebrow>{whyWeExist.eyebrow}</Eyebrow>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-14">
        <div className="flex shrink-0 flex-col justify-between gap-12 lg:h-[560px] lg:w-[389.333px]">
          <h2
            id="why-we-exist-heading"
            className="font-display text-h2 text-text-dark font-light md:max-w-[440px]"
          >
            <RichHeading lines={[whyWeExist.headline]} accentWeight="italic" />
            <br />
            <br />
            {whyWeExist.subheadline}
          </h2>
          <Button href={whyWeExist.cta.href} className="self-start max-lg:hidden">
            {whyWeExist.cta.label}
          </Button>
        </div>

        <div
          ref={ref}
          className="-mr-section-inner lg:-mr-section-inner flex snap-x snap-mandatory [scrollbar-width:none] gap-14 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {whyWeExist.slides.map((slide) => (
            <div
              key={slide.src}
              className={cn(
                'relative aspect-[996/560] h-[240px] shrink-0 snap-start overflow-clip rounded-[16px] md:h-[480px] lg:h-[560px]',
                slide.overlay && 'border-light-grey border',
              )}
            >
              <Img
                src={slide.src}
                alt={slide.alt}
                className="absolute size-full max-w-none rounded-[16px] object-cover"
                sizes="(min-width: 1033px) 996px, (min-width: 450px) 854px, 400px"
              />
              {slide.overlay && <div className="absolute inset-0 rounded-[16px] bg-black/40" />}
            </div>
          ))}
        </div>

        <Button href={whyWeExist.cta.href} size="s" className="self-start lg:hidden">
          {whyWeExist.cta.label}
        </Button>
      </div>

      <ProgressIndicator progress={progress} />
    </Panel>
  )
}
