import { Button } from '@/components/ui/Button'
import { offerHero } from '@/data/offerings'
import { Img } from '@/components/ui/Img'

/** Offerings hero — Alchemy title card beside a studio photo tagged with the service areas. */
export function OfferHero() {
  return (
    <section aria-label="Introduction" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="bg-alchemy p-section-inner flex min-h-[351px] flex-col items-start justify-between gap-8 rounded-[16px] md:min-h-[380px] lg:h-[780px] lg:justify-end">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-h1 text-text-white font-light">
            {offerHero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-body-lg text-text-white font-sans font-medium">{offerHero.body}</p>
        </div>
        <Button href={offerHero.cta.href} size="responsive-lg">
          {offerHero.cta.label}
        </Button>
      </div>

      <div className="relative overflow-clip rounded-[16px]">
        <Img
          src={offerHero.image}
          alt={offerHero.imageAlt}
          className="aspect-square w-full object-cover md:aspect-[752/382] lg:aspect-auto lg:h-[780px]"
          priority
          sizes="(min-width: 1033px) 50vw, 100vw"
        />
        <ul className="md:right-card md:bottom-card absolute right-6 bottom-6 flex flex-col items-end gap-1">
          {offerHero.tags.map((tag) => (
            <li
              key={tag}
              className="bg-alchemy text-body-lg text-text-dark rounded-[8px] px-2 py-2 font-sans font-medium"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
