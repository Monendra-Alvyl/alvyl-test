import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { caseStudies, type CaseStudySlide } from '@/data/home'
import { useScrollProgress } from '@/hooks/useScrollProgress'

const slideBox =
  'relative flex h-[440px] w-[85%] shrink-0 snap-start flex-col overflow-clip rounded-[16px] md:h-[604px] lg:w-[1080px]'

function Slide({ slide }: { slide: CaseStudySlide }) {
  if (slide.kind === 'image') {
    return (
      <div className={`${slideBox} border-light-grey border lg:w-[1074px]`}>
        <img
          src={slide.image}
          alt={slide.alt}
          className="absolute size-full max-w-none rounded-[16px] object-cover"
        />
        <div className="absolute inset-0 rounded-[16px] bg-black/40" />
      </div>
    )
  }

  return (
    <article className={slideBox}>
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <img
          src={slide.image}
          alt=""
          className="absolute top-[-10.75%] left-0 h-[120%] w-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative flex flex-col gap-[11px] p-8">
        <Eyebrow>{slide.category}</Eyebrow>
        <h3 className="font-display text-h1 text-text-dark font-light whitespace-nowrap">
          {slide.title}
        </h3>
      </div>

      <div className="from-light-grey/50 to-light-grey/0 p-card-nested absolute inset-x-0 bottom-0 flex flex-col items-start gap-6 rounded-b-[8px] bg-linear-to-t backdrop-blur-[24px] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-body flex items-center gap-[14.578px] font-sans font-medium whitespace-nowrap">
            <span className="text-text-ultra-light">Focus</span>
            <span aria-hidden className="bg-stroke-dark size-[3.644px] rounded-full" />
            <span className="text-text-dark">{slide.focus}</span>
          </p>
          <p className="text-h4 max-w-[485px] font-sans font-medium text-white">{slide.summary}</p>
        </div>
        <Button href={slide.cta.href}>{slide.cta.label}</Button>
      </div>
    </article>
  )
}

/** Case-study carousel — Figma 17:461. */
export function CaseStudies() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <Panel as="section" aria-label="Case studies" className="p-section-inner flex flex-col gap-12">
      <div
        ref={ref}
        className="-mr-section-inner flex snap-x snap-mandatory [scrollbar-width:none] items-center gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {caseStudies.map((slide, i) => (
          <Slide key={i} slide={slide} />
        ))}
      </div>
      <ProgressIndicator progress={progress} track="black" />
    </Panel>
  )
}
