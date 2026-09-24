import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { promise } from '@/data/about'
import { cn } from '@/lib/cn'

/** "Our promise" — heading, body and the two promise cards (Alchemy "to…", dark "NOT to…"). */
export function OurPromise() {
  return (
    <Panel
      as="section"
      aria-labelledby="promise-heading"
      className="p-section-inner flex flex-col gap-12"
    >
      <Eyebrow>{promise.eyebrow}</Eyebrow>
      <div className="flex flex-col gap-4">
        <h2 id="promise-heading" className="font-display text-h2 text-text-dark font-light">
          <RichHeading lines={[promise.headline]} accentWeight="italic" />
        </h2>
        <p className="text-body-lg text-text-ultra-light max-w-[560px] font-sans font-medium">
          {promise.body}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {promise.cards.map((card) => (
          <li
            key={card.title}
            className={cn(
              'flex flex-col gap-12 rounded-[16px] p-6 md:p-8 lg:h-[600px] lg:justify-between',
              card.tone === 'alchemy' ? 'bg-alchemy' : 'bg-dark-grey',
            )}
          >
            <img
              src={card.image}
              alt=""
              aria-hidden
              className="size-[178px] md:mt-4 md:ml-3 md:size-[262px]"
            />
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-h2 text-text-white font-light">{card.title}</h3>
              <p
                className={cn(
                  'text-body-lg font-sans font-medium',
                  card.tone === 'alchemy' ? 'text-white/80' : 'text-text-light',
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
