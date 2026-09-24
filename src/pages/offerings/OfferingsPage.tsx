import { Seo } from '@/components/layout/Seo'
import { pageMeta } from '@/data/seo'
import { ContactSection } from '@/components/sections/ContactSection'
import { PartnersStrip } from '@/components/sections/PartnersStrip'
import { Team } from '@/components/sections/Team'
import { TechIntent } from '@/components/sections/TechIntent'
import { Estimate } from './sections/Estimate'
import { Goals } from './sections/Goals'
import { OfferHero } from './sections/OfferHero'
import { OfferNumbers } from './sections/OfferNumbers'
import { Ordinary } from './sections/Ordinary'

/*
 * Offerings — built from pg/Offer *.png. Shared sections (partners, Tech, team, contact form,
 * header, footer) follow the Home implementation where the Offer design differs.
 */
export function OfferingsPage() {
  return (
    <>
      <Seo {...pageMeta.offerings} />
      <OfferHero />
      <OfferNumbers />
      <Ordinary />
      <Goals />
      <PartnersStrip />
      <div className="flex flex-col gap-4">
        <TechIntent />
        <Team />
      </div>
      <div className="flex flex-col gap-4">
        <ContactSection />
        <Estimate />
      </div>
    </>
  )
}
