import { Link } from 'react-router-dom'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { footer } from '@/data/site'
import { asset } from '@/lib/asset'

/** Site footer — closing headline, contact details, column headings and legal row. */
export function Footer() {
  return (
    <Panel as="footer" className="p-section-inner flex flex-col gap-12 md:gap-20">
      <div className="flex flex-col-reverse items-start gap-10 md:flex-row md:justify-between">
        <p className="font-display text-h2 text-text-dark font-light">
          <RichHeading lines={footer.headline} accentWeight="italic" />
        </p>
        <Link to="/" aria-label="Alvyl home" className="shrink-0">
          <img
            src={asset('/assets/brand/logo.svg')}
            alt="Alvyl"
            className="h-10 w-[58px] md:h-[81px] md:w-[117.5px]"
          />
        </Link>
      </div>

      <div className="text-body-lg flex flex-col gap-10 font-sans font-medium md:gap-12 lg:grid lg:grid-cols-[320px_480px_1fr] lg:gap-0">
        <address className="flex flex-wrap gap-x-6 gap-y-6 not-italic lg:flex-col">
          <a href={`mailto:${footer.email}`} className="text-alchemy">
            {footer.email}
          </a>
          <a href={`tel:${footer.phone.replace(/\s/g, '')}`} className="text-alchemy">
            {footer.phone}
          </a>
        </address>
        <div className="grid grid-cols-2 lg:contents">
          {footer.columns.map((heading) => (
            <p key={heading} className="text-text-ultra-light">
              {heading}
            </p>
          ))}
        </div>
      </div>

      <div className="border-stroke-very-light text-body-lg flex flex-col-reverse gap-6 border-t pt-6 font-sans font-medium md:flex-row md:items-center md:justify-between">
        <p className="text-text-ultra-light">{footer.copyright}</p>
        <ul className="text-text-white flex gap-6">
          {footer.legal.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
