import { Seo } from '@/components/layout/Seo'
import { pageMeta } from '@/data/seo'
import { ContactSection } from '@/components/sections/ContactSection'
import { PartnersStrip } from '@/components/sections/PartnersStrip'
import { Hero } from './sections/Hero'
import { StartupSpeed } from './sections/StartupSpeed'
import { Team } from '@/components/sections/Team'
import { TechIntent } from '@/components/sections/TechIntent'
import { WhatWeOffer } from './sections/WhatWeOffer'
import { WhyWeExist } from './sections/WhyWeExist'

/* Home — built from the PNG exports in /pg (desktop 1440, tablet 800, phone 390); content is capped at 1700px wide. */
export function HomePage() {
  return (
    <>
      <Seo {...pageMeta.home} />
      <Hero />
      <WhyWeExist />
      <WhatWeOffer />
      <div className="flex flex-col gap-4">
        <StartupSpeed />
        <PartnersStrip />
      </div>
      <div className="flex flex-col gap-4">
        <TechIntent />
        <Team />
      </div>
      <ContactSection />
    </>
  )
}
