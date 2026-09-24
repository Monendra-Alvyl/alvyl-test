import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { offerNumbers } from '@/data/offerings'

function TrendUp() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-[0.8em] w-[0.6em] shrink-0">
      <path
        d="M12 22V3M4 10.5 12 3l8 7.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="square"
      />
    </svg>
  )
}

/** "Our work speaks through numbers" — three result cards and a source footnote. */
export function OfferNumbers() {
  return (
    <div className="flex flex-col gap-4">
      <Panel
        as="section"
        aria-labelledby="numbers-heading"
        className="p-section-inner flex flex-col gap-12"
      >
        <Eyebrow>{offerNumbers.eyebrow}</Eyebrow>
        <h2 id="numbers-heading" className="font-display text-h2 text-text-dark font-light">
          <RichHeading lines={offerNumbers.headline} accentWeight="italic" />
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:mt-4 lg:mt-8 lg:grid-cols-3">
          {offerNumbers.stats.map((stat) => (
            <li
              key={stat.label}
              className="bg-dark-grey p-card flex flex-col gap-10 rounded-[16px]"
            >
              <p className="text-h1 text-text-white flex items-center gap-2 font-sans font-medium">
                {stat.trend === 'up' && (
                  <>
                    <TrendUp />
                    <span className="sr-only">Up</span>
                  </>
                )}
                {stat.value}
              </p>
              <div className="border-light-grey flex flex-col gap-4 border-t pt-10">
                <h3 className="font-display text-h3 text-text-dark font-light">{stat.label}</h3>
                <p className="text-body-lg text-text-ultra-light font-sans font-medium">
                  {stat.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <p className="text-body-sm md:text-body text-text-light text-center font-sans font-medium">
        {offerNumbers.footnote}
      </p>
    </div>
  )
}
