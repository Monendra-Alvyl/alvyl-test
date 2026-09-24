import { Panel } from '@/components/ui/Panel'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { RichHeading } from '@/components/ui/RichHeading'
import { ordinary } from '@/data/offerings'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { Img } from '@/components/ui/Img'

/**
 * "From ordinary to extraordinary". Desktop: centred statement over an Alchemy disc with two
 * phone mockups in opposite corners. Tablet/phone: statement, then a swipeable mockup carousel.
 */
export function Ordinary() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const [topLeft, bottomRight] = ordinary.mockups

  return (
    <Panel
      as="section"
      aria-labelledby="ordinary-heading"
      className="p-section-inner flex flex-col gap-12 lg:h-[780px] lg:items-center lg:justify-center"
    >
      {/* Desktop collage */}
      <Img
        src={topLeft.src}
        alt={topLeft.alt}
        className="absolute top-[40px] left-[48px] size-[374px] rounded-[16px] object-cover max-lg:hidden"
        sizes="374px"
      />
      <Img
        src={bottomRight.src}
        alt={bottomRight.alt}
        className="absolute right-[48px] bottom-[23px] size-[403px] rounded-[16px] object-cover max-lg:hidden"
        sizes="403px"
      />
      <div
        aria-hidden
        className="bg-alchemy absolute top-[309px] left-[calc(50%+127px)] size-[180px] rounded-full max-lg:hidden"
      />

      <div className="relative flex flex-col gap-4 lg:items-center lg:gap-6 lg:text-center">
        <h2 id="ordinary-heading" className="font-display text-h1 text-text-dark font-light">
          <RichHeading lines={ordinary.headline} accentWeight="italic" />
        </h2>
        <p className="text-body-lg text-text-ultra-light font-sans font-medium">{ordinary.body}</p>
      </div>

      {/* Tablet / phone carousel */}
      <div className="flex flex-col gap-8 lg:hidden">
        <div
          ref={ref}
          className="-mr-section-inner flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {ordinary.mockups.map((mockup) => (
            <Img
              key={mockup.src}
              src={mockup.src}
              alt={mockup.alt}
              className="size-[240px] shrink-0 snap-start rounded-[16px] object-cover md:h-[320px] md:w-[329px]"
              sizes="329px"
            />
          ))}
        </div>
        <ProgressIndicator progress={progress} />
      </div>
    </Panel>
  )
}
