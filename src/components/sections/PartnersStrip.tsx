import { Eyebrow } from '@/components/ui/Eyebrow'
import { partners } from '@/data/home'
import { cn } from '@/lib/cn'
import { Img } from '@/components/ui/Img'

function LogoList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={cn('flex shrink-0 items-center gap-16 pr-16', duplicate && 'motion-reduce:hidden')}
    >
      {partners.logos.map((logo) => (
        <li key={logo.name} className="relative h-10 shrink-0" style={{ width: logo.width }}>
          <Img
            src={logo.src}
            alt={duplicate ? '' : logo.name}
            className={cn('absolute inset-0 size-full max-w-none object-cover', logo.opacity)}
            sizes="160px"
          />
        </li>
      ))}
      <li className="flex shrink-0 items-center gap-[2px]">
        <Img
          src={partners.reverie.mark}
          alt=""
          className="h-10 w-14 object-cover object-bottom opacity-20"
          sizes="56px"
        />
        <Img
          src={partners.reverie.word}
          alt={duplicate ? '' : partners.reverie.name}
          className="h-10 w-24 object-cover object-bottom opacity-50"
          sizes="96px"
        />
      </li>
    </ul>
  )
}

/** "More partners" logo strip — Figma 17:505 (also appears on the Contact Us frames). */
export function PartnersStrip() {
  return (
    <section
      aria-label="Partners"
      className="border-stroke-light bg-pitch-black p-card flex items-center gap-8 overflow-clip rounded-[24px] border"
    >
      <Eyebrow className="shrink-0">{partners.eyebrow}</Eyebrow>
      {/*
        Infinite marquee: the logo list is rendered twice and the track slides by one copy (-50%).
        Pauses on hover; with reduced motion it becomes a static, swipeable row.
      */}
      <div className="min-w-0 flex-1 overflow-hidden motion-reduce:[scrollbar-width:none] motion-reduce:overflow-x-auto">
        <div className="animate-marquee flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none">
          <LogoList />
          <LogoList duplicate />
        </div>
      </div>
    </section>
  )
}
