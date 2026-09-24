import teamMembers from './team.generated.json'
import { asset } from '@/lib/asset'

/*
 * Home page content — copied verbatim from Figma frame 17:320 (Home Desktop).
 * Heading segments marked `accent` render in the Alchemy italic style.
 */

export type HeadingSegment = { text: string; accent?: boolean }

export const hero = {
  /* One line on mobile; broken after "team" from the tablet breakpoint. */
  titleLines: ['We’re a team', 'of builders'],
  /* Per-breakpoint art, cropped from the PNG exports (see README "Assets"). */
  images: {
    mobile: asset('/assets/home/hero-mobile.jpg'),
    tablet: asset('/assets/home/hero-tablet.jpg'),
    desktop: asset('/assets/home/hero-desktop.jpg'),
  },
  actions: [
    { label: 'Send us a proposal', href: '#', variant: 'primary' },
    { label: 'Schedule a discovery call', href: '#', variant: 'secondary' },
  ],
} as const

export const whyWeExist = {
  /* Spelling as in the design ("EXSIST") — see README open questions. */
  eyebrow: 'Why we exsist',
  headline: [
    { text: 'Alvyl believes technology should ' },
    { text: 'simplify life.', accent: true },
  ] satisfies HeadingSegment[],
  subheadline: 'We create genuine experiences that meet real needs.',
  cta: { label: 'Learn more about us', href: '/about' },
  slides: [{ src: asset('/assets/home/team-1.png'), alt: 'The Alvyl team', overlay: true }],
}

export const whatWeOffer = {
  eyebrow: 'what we offer',
  headline: [
    { text: 'Exceptional expertise', accent: true },
    { text: ' with cutting-edge precision.' },
  ] satisfies HeadingSegment[],
  body: 'We take pride in our work and it’s about ideas to life! It’s all about turning dreams into reality.',
  cta: { label: 'Learn more about us', href: '/about' },
  services: [
    {
      number: '01',
      title: 'End-to-End Product Design',
      href: '/offerings',
      image: asset('/assets/home/service-product-design.png'),
    },
    {
      number: '02',
      title: 'Site Reliability Engineering',
      href: '/offerings',
      image: asset('/assets/home/service-sre.png'),
    },
    {
      number: '03',
      title: 'Agentic AI',
      href: '/offerings',
      image: asset('/assets/home/service-agentic-ai.png'),
    },
    {
      number: '04',
      title: 'IoT & Machine Learning',
      href: '/offerings',
      image: asset('/assets/home/service-iot-ml.png'),
    },
  ],
}

export const startupSpeed = {
  eyebrow: 'what we offer',
  headline: [
    [{ text: 'Startup ' }, { text: 'Speed', accent: true }, { text: '.' }],
    [{ text: 'Enterprise ' }, { text: 'Impact', accent: true }, { text: '.' }],
  ] satisfies HeadingSegment[][],
  body: 'We move with the agility of a startup and the precision of an enterprise partner — designing, building, and scaling ideas that make a lasting mark.',
  image: asset('/assets/home/cubes.png'),
}

export const stats = [
  {
    value: '100+',
    label: 'Projects',
    body: 'From MVPs to full-scale ecosystems — we’ve helped ideas grow into sustainable products.',
  },
  {
    value: '50+',
    label: 'Clients',
    body: 'Startups, enterprises, and everything in between — united by trust and shared outcomes.',
  },
  {
    value: '100%',
    label: 'Commitment',
    body: 'Every project is personal. We don’t stop until it’s something we’d be proud to use ourselves.',
  },
]

export const techIntent = {
  eyebrow: 'what we offer',
  headline: [
    [{ text: 'Tech', accent: true }, { text: ' is our language.' }],
    [{ text: 'Humanity', accent: true }, { text: ' is intent.' }],
  ] satisfies HeadingSegment[][],
  body: 'We move with the agility of a startup and the precision of an enterprise partner — designing, building, and scaling ideas that make a lasting mark.',
  image: asset('/assets/home/offer-sphere-large.png'),
}

/*
 * Team members come from the Webflow "Teams" CMS collection, fetched at build time by
 * scripts/webflow-team.mjs (npm run webflow:team). Roles are not shown for now.
 */
/*
 * The CMS has no quote field and the design only has Raghava's quote, so it stands in on the back of
 * every card until real quotes are available (see README open questions).
 */
const placeholderQuote =
  "Success is often achieved by those who don't know that failure is inevitable."

/** Flip card: photo on the front, quote on the back. */
export type TeamMember = {
  id: string
  name: string
  image: string | null
  imageAlt: string
  linkedin: string | null
  quote: string
}

export const team: TeamMember[] = teamMembers.map((member) => ({
  ...member,
  quote: placeholderQuote,
}))

export const contact = {
  eyebrow: 'Get in touch',
  headline: [
    { text: 'Do you have a ' },
    { text: 'question, an idea or a project', accent: true },
    { text: ' you need help with?' },
  ] satisfies HeadingSegment[],
  fields: {
    name: 'Name',
    company: 'Company name',
    phone: 'Contact no',
    email: 'Email',
    message: 'Message',
  },
  submit: 'Send Message',
}

/* Case-study carousel content — not shown on Home (absent from the current PNG design). */
export type CaseStudySlide =
  | {
      kind: 'case-study'
      category: string
      title: string
      focus: string
      summary: string
      image: string
      cta: { label: string; href: string }
    }
  | { kind: 'image'; image: string; alt: string }

export const caseStudies: CaseStudySlide[] = [
  {
    kind: 'case-study',
    category: 'Machine learning & iot',
    title: 'Silk Worm',
    focus: 'Machine Learning & IoT',
    summary: 'Real-time monitoring and predictive maintenance of IoT printers.',
    image: asset('/assets/home/case-silkworm.png'),
    cta: { label: 'View Case Study', href: '#' },
  },
  {
    kind: 'case-study',
    category: 'Machine learning & iot',
    title: 'Pepsi Co.',
    focus: 'Agentic AI',
    /* Duplicated from Silk Worm in the design — see README open questions. */
    summary: 'Real-time monitoring and predictive maintenance of IoT printers.',
    image: asset('/assets/home/case-pepsico.png'),
    cta: { label: 'View Case Studies', href: '#' },
  },
  { kind: 'image', image: asset('/assets/home/team-1.png'), alt: 'The Alvyl team' },
]

export type Partner = { name: string; src: string; width: number; opacity?: string }

export const partners = {
  eyebrow: 'more partners',
  logos: [
    {
      name: 'cloudnine',
      src: asset('/assets/partners/cloudnine.png'),
      width: 153,
      opacity: 'opacity-60',
    },
    { name: 'Napkin', src: asset('/assets/partners/napkin.png'), width: 125 },
    { name: 'Vocera', src: asset('/assets/partners/vocera.png'), width: 153 },
    { name: 'Ratnagarba', src: asset('/assets/partners/ratnagarba.png'), width: 153 },
  ] satisfies Partner[],
  /* Reverie is two images in the design (mark + wordmark), grouped with a 2px gap. */
  reverie: {
    name: 'Reverie Language Technologies',
    mark: asset('/assets/partners/reverie-mark.png'),
    word: asset('/assets/partners/reverie-word.png'),
  },
}
