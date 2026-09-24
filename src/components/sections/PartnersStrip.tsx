import { Eyebrow } from '@/components/ui/Eyebrow'
import { partners } from '@/data/home'
import { cn } from '@/lib/cn'

/** "More partners" logo strip — Figma 17:505 (also appears on the Contact Us frames). */
export function PartnersStrip() {
  return (
    <section
      aria-label="Partners"
      className="border-stroke-light bg-pitch-black p-card flex items-center gap-8 overflow-clip rounded-[24px] border lg:justify-between"
    >
      <Eyebrow className="shrink-0">{partners.eyebrow}</Eyebrow>
      <ul className="flex flex-1 [scrollbar-width:none] items-center gap-16 overflow-x-auto lg:justify-end [&::-webkit-scrollbar]:hidden">
        {partners.logos.map((logo) => (
          <li key={logo.name} className="relative h-10 shrink-0" style={{ width: logo.width }}>
            <img
              src={logo.src}
              alt={logo.name}
              className={cn('absolute inset-0 size-full max-w-none object-cover', logo.opacity)}
            />
          </li>
        ))}
        <li className="flex shrink-0 items-center gap-[2px]">
          <img
            src={partners.reverie.mark}
            alt=""
            className="h-10 w-14 object-cover object-bottom opacity-20"
          />
          <img
            src={partners.reverie.word}
            alt={partners.reverie.name}
            className="h-10 w-24 object-cover object-bottom opacity-50"
          />
        </li>
      </ul>
    </section>
  )
}
