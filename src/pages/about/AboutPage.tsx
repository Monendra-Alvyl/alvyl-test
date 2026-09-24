import { Seo } from '@/components/layout/Seo'
import { pageMeta } from '@/data/seo'
import { ContactSection } from '@/components/sections/ContactSection'
import { Team } from '@/components/sections/Team'
import { TechIntent } from '@/components/sections/TechIntent'
import { AboutIntro } from './sections/AboutIntro'
import { Careers } from './sections/Careers'
import { OurPromise } from './sections/OurPromise'
import { WhyWeStarted } from './sections/WhyWeStarted'

/*
 * About — built from pg/About *.png. Shared sections (Tech, team, contact, header, footer) follow the
 * Home implementation where the About design differs.
 */
export function AboutPage() {
  return (
    <>
      <Seo {...pageMeta.about} />
      <AboutIntro />
      <WhyWeStarted />
      <OurPromise />
      <div className="flex flex-col gap-4">
        <TechIntent />
        <Team />
      </div>
      <Careers />
      <ContactSection />
    </>
  )
}
