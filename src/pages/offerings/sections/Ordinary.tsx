import { Panel } from '@/components/ui/Panel'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { RichHeading } from '@/components/ui/RichHeading'
import { ordinary } from '@/data/offerings'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { Img } from '@/components/ui/Img'

/**
 * "From ordinary to extraordinary". Desktop: centred statement with an Alchemy disc over the end of
 * the headline, two phone mockups in opposite corners. Where the headline crosses the disc its letters
 * turn black: a black copy of the headline sits on top, clipped to the disc's circle.
 * Tablet/phone: statement, then a swipeable mockup carousel.
 */

/* Disc size and position relative to the headline box (its top edge, near its right end). */
const DISC = 180
const discLeft = 'calc(100% - 50px)'
const discTop = '-2px'
const discClip = `circle(${DISC / 2}px at calc(${discLeft} + ${DISC / 2}px) calc(${discTop} + ${DISC / 2}px))`
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
      <div className="relative flex flex-col gap-4 lg:items-center lg:gap-6 lg:text-center">
        <div className="relative">
          <div
            aria-hidden
            className="bg-alchemy absolute rounded-full max-lg:hidden"
            style={{ left: discLeft, top: discTop, width: DISC, height: DISC }}
          />
          <h2
            id="ordinary-heading"
            className="font-display text-h1 text-text-dark relative font-light"
          >
            <RichHeading lines={ordinary.headline} />
          </h2>
          <p
            aria-hidden
            className="font-display text-h1 text-pitch-black absolute inset-0 font-light max-lg:hidden"
            style={{ clipPath: discClip }}
          >
            <RichHeading lines={ordinary.headline} />
          </p>
        </div>
        <p className="text-body-lg text-text-ultra-light relative font-sans font-light">
          {ordinary.body}
        </p>
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
