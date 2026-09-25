import { Seo } from '@/components/layout/Seo'
import { ContactSection } from '@/components/sections/ContactSection'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { Button } from '@/components/ui/Button'
import { chipClasses } from '@/components/ui/chipClasses'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Img } from '@/components/ui/Img'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { pageMeta } from '@/data/seo'
import { servicePage, servicePath, services, type Service } from '@/data/services'
import { asset } from '@/lib/asset'

/*
 * Service page (/services/<slug>), one per Home service card. Built from the site's existing patterns:
 * the Offerings hero (Alchemy title card + art card), Chip tags, Goals-style cards with the Alchemy
 * hover, the Home service cards and the shared contact section. Content: data/services.ts.
 */

function ServiceHero({ service }: { service: Service }) {
  return (
    <section aria-label="Introduction" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="bg-alchemy p-section-inner flex min-h-[351px] flex-col items-start justify-between gap-8 rounded-[16px] md:min-h-[380px] lg:h-[600px] lg:justify-end">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-h1 text-text-white font-light">
            {service.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-body-lg text-text-white max-w-[520px] font-sans font-medium">
            {service.intro}
          </p>
        </div>
        <Button href={servicePage.heroCta.href} size="responsive-lg">
          {servicePage.heroCta.label}
        </Button>
      </div>

      <div className="bg-dark-grey p-section-inner flex min-h-[320px] items-center justify-center rounded-[16px] lg:h-[600px]">
        <Img
          src={service.image}
          alt=""
          aria-hidden
          className="size-[200px] object-contain md:size-[240px] lg:size-[320px]"
          sizes="(min-width: 1033px) 320px, 240px"
          priority
        />
      </div>
    </section>
  )
}

function Capabilities({ service }: { service: Service }) {
  return (
    <Panel
      as="section"
      aria-labelledby="capabilities-heading"
      className="p-section-inner flex flex-col gap-8 md:gap-12"
    >
      <Eyebrow>{servicePage.capabilitiesEyebrow}</Eyebrow>
      <h2 id="capabilities-heading" className="font-display text-h2 text-text-dark font-light">
        <RichHeading lines={[servicePage.capabilitiesHeading]} accentWeight="italic" />
      </h2>
      <ul className="flex flex-wrap gap-3">
        {service.capabilities.map((capability) => (
          <li key={capability} className={chipClasses(false, 'small') + ' md:text-[14px]'}>
            {capability}
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function Benefits({ service }: { service: Service }) {
  return (
    <Panel
      as="section"
      aria-labelledby="benefits-heading"
      className="p-section-inner flex flex-col gap-8 md:gap-12"
    >
      <Eyebrow>{servicePage.benefitsEyebrow}</Eyebrow>
      <h2 id="benefits-heading" className="font-display text-h2 text-text-dark font-light">
        <RichHeading lines={[servicePage.benefitsHeading]} accentWeight="italic" />
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {service.benefits.map((benefit, i) => (
          <li
            key={benefit.title}
            className="group bg-dark-grey hover-alchemy flex flex-col gap-8 rounded-[16px] p-6 md:p-8 lg:gap-12"
          >
            <Eyebrow tone="card">{String(i + 1).padStart(2, '0')}</Eyebrow>
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-h3 text-text-white font-light">{benefit.title}</h3>
              <p className="text-body-lg text-text-light font-sans font-medium transition-colors group-hover:text-white">
                {benefit.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function Testimonial({ testimonial }: { testimonial: NonNullable<Service['testimonial']> }) {
  return (
    <Panel as="section" aria-label={servicePage.testimonialEyebrow} className="p-section-inner">
      <figure className="flex flex-col gap-8 md:gap-12">
        <Eyebrow>{servicePage.testimonialEyebrow}</Eyebrow>
        <Img
          src={asset('/assets/home/quote-mark.png')}
          alt=""
          aria-hidden
          className="h-[51px] w-[65px] md:h-[68px] md:w-[87px]"
          sizes="87px"
        />
        {/* Figma quote style (as on the team cards): Forma DJR Micro Medium, H3 size. */}
        <blockquote className="text-h3 text-text-white max-w-[640px] font-sans font-medium">
          {testimonial.quote}
        </blockquote>
        <figcaption className="text-body-lg text-text-ultra-light font-sans font-medium">
          {testimonial.name}
        </figcaption>
      </figure>
    </Panel>
  )
}

function OtherServices({ current }: { current: Service }) {
  return (
    <section aria-label={servicePage.otherEyebrow} className="flex flex-col gap-6 md:gap-8">
      <Eyebrow className="px-2">{servicePage.otherEyebrow}</Eyebrow>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {services
          .filter((service) => service.slug !== current.slug)
          .map((service) => (
            <ServiceCard
              key={service.slug}
              number={service.number}
              title={service.title}
              href={servicePath(service.slug)}
              image={service.image}
              compact
            />
          ))}
      </div>
    </section>
  )
}

export function ServicePage({ service }: { service: Service }) {
  const meta = pageMeta[`service-${service.slug}` as keyof typeof pageMeta]
  return (
    <>
      <Seo {...meta} />
      <ServiceHero service={service} />
      <Capabilities service={service} />
      <Benefits service={service} />
      {service.testimonial && <Testimonial testimonial={service.testimonial} />}
      <OtherServices current={service} />
      <ContactSection />
    </>
  )
}
