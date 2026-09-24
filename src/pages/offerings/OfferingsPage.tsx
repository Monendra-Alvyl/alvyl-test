import { Seo } from '@/components/layout/Seo'
import { pageMeta } from '@/data/seo'
import { ContactSection } from '@/components/sections/ContactSection'
import { CustomersStrip } from '@/components/sections/CustomersStrip'
import { Team } from '@/components/sections/Team'
import { TechIntent } from '@/components/sections/TechIntent'
import { Goals } from './sections/Goals'
import { OfferHero } from './sections/OfferHero'
import { OfferNumbers } from './sections/OfferNumbers'
import { Ordinary } from './sections/Ordinary'
import { SelectedWork } from './sections/SelectedWork'

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
      <div className="flex flex-col gap-4">
        <SelectedWork />
        <CustomersStrip />
      </div>
      <div className="flex flex-col gap-4">
        <TechIntent />
        <Team />
      </div>
      <ContactSection />
    </>
  )
}
