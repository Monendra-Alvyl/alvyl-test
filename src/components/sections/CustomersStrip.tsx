import { Eyebrow } from '@/components/ui/Eyebrow'
import { Img } from '@/components/ui/Img'
import { customers } from '@/data/home'
import { cn } from '@/lib/cn'

function LogoList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={cn('flex shrink-0 items-center gap-20 pr-20', duplicate && 'motion-reduce:hidden')}
    >
      {customers.logos.map((logo) => (
        <li key={logo.name} className="shrink-0">
          <Img
            src={logo.src}
            alt={duplicate ? '' : logo.name}
            width={logo.width}
            height={logo.height}
            sizes={`${logo.width}px`}
            style={{ width: logo.width, height: logo.height }}
            className="max-w-none object-cover"
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * "Customers" logo strip — Webflow site design: label on top, logos scrolling across the full width.
 * Infinite marquee: the list is rendered twice and the track slides by one copy (-50%). Pauses on
 * hover; with reduced motion it becomes a static, swipeable row.
 */
export function CustomersStrip() {
  return (
    <section
      aria-label="Customers"
      className="border-stroke-light bg-pitch-black p-card flex flex-col gap-8 overflow-clip rounded-[24px] border md:gap-12"
    >
      <Eyebrow>{customers.eyebrow}</Eyebrow>
      <div className="-mx-card overflow-hidden motion-reduce:[scrollbar-width:none] motion-reduce:overflow-x-auto">
        <div className="animate-marquee flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none">
          <LogoList />
          <LogoList duplicate />
        </div>
      </div>
    </section>
  )
}
