import { Button } from '@/components/ui/Button'
import { hero } from '@/data/home'
import { Img } from '@/components/ui/Img'
import { webpSrcSet } from '@/lib/images'

/** Home hero — full-bleed art with the title and actions over it (pg/Home *.png). */
export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative flex h-[634px] flex-col justify-center overflow-clip rounded-[24px] px-6 md:h-[772px] md:px-[clamp(24px,9vw,72px)]"
    >
      <picture>
        <source
          media="(min-width: 1033px)"
          srcSet={webpSrcSet(hero.images.desktop)}
          sizes="100vw"
        />
        <source media="(min-width: 450px)" srcSet={webpSrcSet(hero.images.tablet)} sizes="100vw" />
        <Img
          src={hero.images.mobile}
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          priority
        />
      </picture>

      <div className="relative flex flex-col items-start gap-6 md:gap-7 md:pb-[34px]">
        <h1 className="font-display text-text-white text-[28px] leading-8 font-light md:text-[clamp(40px,8.1vw,65px)] md:leading-[1.32]">
          {hero.titleLines.map((line, i) => (
            <span key={line} className="md:block">
              {i > 0 && ' '}
              {line}
            </span>
          ))}
        </h1>
        <div className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
          {hero.actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="responsive"
              href={action.href}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
