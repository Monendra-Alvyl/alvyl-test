import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { goals } from '@/data/offerings'
import { cn } from '@/lib/cn'

/** "Your goals, our priority" — three service-promise cards with sphere art. */
export function Goals() {
  return (
    <Panel
      as="section"
      aria-labelledby="goals-heading"
      className="p-section-inner flex flex-col gap-12"
    >
      <Eyebrow>{goals.eyebrow}</Eyebrow>
      <div className="flex flex-col gap-4">
        <h2 id="goals-heading" className="font-display text-h2 text-text-dark font-light">
          <RichHeading lines={[goals.headline]} accentWeight="italic" />
        </h2>
        <p className="text-body-lg text-text-ultra-light max-w-[560px] font-sans font-medium">
          {goals.body}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:mt-4 lg:mt-8 lg:grid-cols-3">
        {goals.cards.map((card) => (
          <li
            key={card.body}
            className={cn(
              'flex flex-col gap-8 rounded-[16px] p-6 lg:h-[600px] lg:justify-between lg:pb-10',
              card.tone === 'alchemy' ? 'bg-alchemy' : 'bg-dark-grey',
            )}
          >
            <img
              src={card.image}
              alt=""
              aria-hidden
              className="size-[120px] object-contain lg:mx-auto lg:mt-9 lg:size-[268px]"
            />
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-h3 text-text-white font-light">
                {card.titleLines.map((line, i) => (
                  <span key={line} className="lg:block">
                    {i > 0 && ' '}
                    {line}
                  </span>
                ))}
              </h3>
              <p
                className={cn(
                  'text-body-lg font-sans font-medium',
                  card.tone === 'alchemy' ? 'text-white/60' : 'text-text-light',
                )}
              >
                {card.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
