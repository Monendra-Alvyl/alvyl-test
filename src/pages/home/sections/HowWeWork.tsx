import { Eyebrow } from '@/components/ui/Eyebrow'
import { Img } from '@/components/ui/Img'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { howWeWork } from '@/data/home'
import { asset } from '@/lib/asset'

/**
 * "How we work" — the original site's builders story (www.alvyl.com) beside the founder's quote.
 * Uses the site's panel, heading and quote styles; the quote card matches the back of the team cards.
 */
export function HowWeWork() {
  const { quote } = howWeWork
  return (
    <Panel
      as="section"
      aria-labelledby="how-we-work-heading"
      className="p-section-inner flex flex-col gap-12"
    >
      <Eyebrow>{howWeWork.eyebrow}</Eyebrow>
      <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <h2
            id="how-we-work-heading"
            className="font-display text-h2 text-text-dark font-light md:max-w-[520px]"
          >
            <RichHeading lines={[howWeWork.headline]} accentWeight="italic" />
          </h2>
          {howWeWork.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-body-lg text-text-ultra-light max-w-[520px] font-sans font-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <figure className="bg-dark-grey p-card flex flex-col gap-8 rounded-[16px] lg:min-h-[400px] lg:justify-between">
          {/* The mark's PNG has a black background; lighten lets the card colour show through it. */}
          <Img
            src={asset('/assets/home/quote-mark.png')}
            alt=""
            aria-hidden
            className="h-[51px] w-[65px] mix-blend-lighten md:h-[68px] md:w-[87px]"
            sizes="87px"
          />
          <blockquote className="text-h3 text-text-white max-w-[440px] font-sans font-normal">
            {quote.text}
          </blockquote>
          <figcaption className="text-body-lg text-text-dark font-sans font-normal">
            {quote.name} <span className="text-text-ultra-light">· {quote.role}</span>
          </figcaption>
        </figure>
      </div>
    </Panel>
  )
}
