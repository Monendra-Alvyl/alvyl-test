import { Link } from '@/lib/router'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Img } from '@/components/ui/Img'
import { cn } from '@/lib/cn'

type ServiceCardProps = {
  number: string
  title: string
  href: string
  image: string
  /** Smaller art on desktop, for a three-column row (service pages' "Other services"). */
  compact?: boolean
}

/**
 * Service card (Home "What we offer", "Other services" on service pages): the whole card links to the
 * service page and takes the Alchemy hover (as on Webflow).
 */
export function ServiceCard({ number, title, href, image, compact = false }: ServiceCardProps) {
  return (
    <Link
      to={href}
      className="bg-dark-grey p-card hover-alchemy flex flex-1 items-start gap-4 rounded-[16px]"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Eyebrow tone="card">{number}</Eyebrow>
        <h3 className="font-display text-h3 text-text-dark max-w-[230px] font-light">{title}</h3>
      </div>
      <Img
        src={image}
        alt=""
        aria-hidden
        className={cn(
          'h-[140px] w-[148px] shrink-0 object-contain md:size-[180px]',
          compact ? 'lg:size-[160px]' : 'lg:size-[240px]',
        )}
        sizes={compact ? '180px' : '(min-width: 1033px) 240px, 180px'}
      />
    </Link>
  )
}
