import { FeaturePanel } from '@/components/sections/FeaturePanel'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { RichHeading } from '@/components/ui/RichHeading'
import { whatWeOffer } from '@/data/home'
import { asset } from '@/lib/asset'
import { Img } from '@/components/ui/Img'

/**
 * Sphere art (image 6 / image 5 / image 3), vertically flipped as in Figma 17:366.
 * Desktop: a column at the right of the panel. Tablet/phone: a centred row that bleeds past the
 * panel padding and is clipped by the panel edge (pg/Home Tablet, Phone).
 */
function SphereArt() {
  const small = (
    <div className="relative size-[140px] shrink-0 -scale-y-100 md:size-[180px] lg:size-[236px]">
      <Img
        alt=""
        src={asset('/assets/home/offer-sphere-small.png')}
        className="absolute size-full max-w-none object-cover opacity-50"
        sizes="(min-width: 1033px) 236px, (min-width: 450px) 180px, 140px"
      />
      <Img
        alt=""
        src={asset('/assets/home/offer-sphere-small.png')}
        className="absolute size-full max-w-none object-cover opacity-50"
        sizes="(min-width: 1033px) 236px, (min-width: 450px) 180px, 140px"
      />
    </div>
  )
  return (
    <div
      aria-hidden
      className="-mx-section-inner pointer-events-none flex items-center justify-center gap-[41px] md:gap-[57px] lg:absolute lg:top-1/2 lg:right-[197px] lg:mx-0 lg:-translate-y-1/2 lg:flex-col lg:gap-[65px]"
    >
      {small}
      <div className="relative size-[175px] shrink-0 -scale-y-100 md:size-[230px] lg:size-[310px]">
        <Img
          alt=""
          src={asset('/assets/home/offer-sphere-large.png')}
          className="absolute size-full max-w-none object-cover"
          sizes="(min-width: 1033px) 310px, (min-width: 450px) 230px, 175px"
        />
      </div>
      {small}
    </div>
  )
}

/** "What we offer" — Figma 17:354: feature panel + 2×2 service cards. */
export function WhatWeOffer() {
  return (
    <div className="flex flex-col gap-4">
      <FeaturePanel
        id="what-we-offer-heading"
        eyebrow={whatWeOffer.eyebrow}
        heading={<RichHeading lines={[whatWeOffer.headline]} />}
        headingWidth="lg:w-[627px]"
        body={whatWeOffer.body}
        cta={whatWeOffer.cta}
        art={<SphereArt />}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {whatWeOffer.services.map((service) => (
          <ServiceCard key={service.number} {...service} />
        ))}
      </div>
    </div>
  )
}
