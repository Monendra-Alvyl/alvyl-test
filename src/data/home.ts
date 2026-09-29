import teamMembers from './team.generated.json'
import cmsContent from './cms.generated.json'
import { asset } from '@/lib/asset'
import { servicePath, services } from './services'

/*
 * Home page content — copy matches the live Webflow site (alvyl-revamp-site.webflow.io).
 * Heading segments marked `accent` render in the Alchemy italic style.
 */

export type HeadingSegment = { text: string; accent?: boolean }

export const hero = {
  /* One line on mobile; broken after "team" from the tablet breakpoint. */
  titleLines: ['We’re a team', 'of builders'],
  /* Says what Alvyl does, under the headline. */
  subheadline: 'Product design, SRE, agentic AI and IoT for startups and enterprises.',
  actions: [{ label: 'Schedule a discovery call', href: '/contact-us', variant: 'primary' }],
  /* The murmuration story's service screens use whatWeOffer.services; this is its last screen. */
  serviceEyebrow: 'What we offer',
  finale: {
    headline: 'Let’s build something together',
    action: { label: 'Schedule a discovery call', href: '/contact-us' },
  },
  controls: {
    scroll: 'Scroll',
    skip: 'Skip intro',
    pause: 'Pause background animation',
    play: 'Play background animation',
  },
} as const

export const whyWeExist = {
  eyebrow: 'Why we exist',
  headline: [
    { text: 'Alvyl believes technology should ' },
    { text: 'simplify life', accent: true },
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
  body: 'We take pride in our work and it’s about bringing ideas to life! It’s all about turning dreams into reality.',
  cta: { label: 'Learn more about us', href: '/about' },
  /* Each card links to its own service page (data/services.ts). */
  services: services.map(({ number, title, slug, image }) => ({
    number,
    title,
    href: servicePath(slug),
    image,
  })),
}

export const startupSpeed = {
  eyebrow: 'Our approach',
  headline: [
    [{ text: 'Startup ' }, { text: 'Speed', accent: true }, { text: '.' }],
    [{ text: 'Enterprise ' }, { text: 'Impact', accent: true }, { text: '.' }],
  ] satisfies HeadingSegment[][],
  body: 'We move with the agility of a startup and the precision of an enterprise partner by designing, building, and scaling ideas that make a lasting mark.',
  image: asset('/assets/home/cubes.png'),
}

export const stats = [
  {
    value: '100+',
    label: 'Projects',
    body: 'From MVPs to full-scale ecosystems we’ve helped ideas grow into sustainable products.',
  },
  {
    value: '50+',
    label: 'Clients',
    body: 'Startups, enterprises, and everything in between are united by trust and shared outcomes.',
  },
  {
    value: '100%',
    label: 'Commitment',
    body: 'Every project is personal. We don’t stop until it’s something we’d be proud to use ourselves.',
  },
]

export const techIntent = {
  eyebrow: 'What drives us',
  headline: [
    [{ text: 'Tech', accent: true }, { text: ' is our language.' }],
    [{ text: 'Humanity', accent: true }, { text: ' is intent.' }],
  ] satisfies HeadingSegment[][],
  /* "People first tech studio" is the tagline of the original site (www.alvyl.com). */
  body: 'We’re a people first tech studio. Technology is how we build; people are why — so what we make feels simple, human and genuinely useful.',
  image: asset('/assets/home/offer-sphere-large.png'),
}

/*
 * Team members are JSON files in the CMS content repo (team/), edited in Sveltia CMS (/admin/hr) and
 * read at build time by scripts/cms-content.mjs, in their sort order. People switched off with "Show
 * in the carousel" are left out here (they can still be blog authors). If there are none, the
 * Webflow "Teams" snapshot (scripts/webflow-team.mjs) is used. Roles show when the CMS has one.
 */
/*
 * The CMS has no quote field and the design only has Raghava's quote, so it stands in on the back of
 * every card until real quotes are available (see README open questions).
 */
/*
 * Personal quotes from the original site (www.alvyl.com), keyed by the name in the Webflow Teams
 * collection. People without a quote here get a card that doesn't flip. The original site's "Sanjay"
 * quote ("All you gotta do is chill out. Let go of control and chill.") is left out until we know which
 * of the two Sanjays said it. A quote filled in the CMS (`quote` field) takes precedence.
 */
const teamQuotes: Record<string, string> = {
  'Hari Krishna': 'Culture is not a perk. It’s the operating system.',
  'Navya Ganduri': 'Success is often achieved by those who don’t know that failure is inevitable.',
  Raghavan: 'Take things easy – don’t get stressed out.',
  Pallavi:
    'You cannot mandate productivity; you must provide the tools to let people become their best.',
}

/** Flip card: photo on the front, quote on the back. */
export type TeamMember = {
  id: string
  name: string
  /** Job role from the CMS; shown only when set (e.g. "Founder"). */
  role: string | null
  image: string | null
  imageAlt: string
  linkedin: string | null
  /** The person's own quote (back of the card); null when we don't have one. */
  quote: string | null
}

export const teamHeading = 'Our People'

/** A team member as scripts/cms-content.mjs writes it. */
type CmsTeamMember = {
  id: string
  name: string
  role: string | null
  photo: string | null
  photoAlt: string | null
  quote: string | null
  linkedin: string | null
  showOnWebsite: boolean
}

const cmsTeam = cmsContent.team as unknown as CmsTeamMember[]

export const team: TeamMember[] = cmsTeam.length
  ? cmsTeam
      .filter((member) => member.showOnWebsite)
      .map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        image: member.photo ? asset(member.photo) : null,
        imageAlt: member.photoAlt || member.name,
        linkedin: member.linkedin,
        quote: member.quote || teamQuotes[member.name] || null,
      }))
  : teamMembers.map((member) => ({
      ...member,
      quote: teamQuotes[member.name] ?? null,
    }))

/*
 * "How we work" (Home). Copy from the original site (www.alvyl.com): its "Great products need great
 * builders" headline, "Amazing products…" intro and the "Why our builders?" culture line, with the
 * founder's own quote.
 */
export const howWeWork = {
  eyebrow: 'How we work',
  headline: [
    { text: 'Great products need ' },
    { text: 'great builders', accent: true },
    { text: '.' },
  ] satisfies HeadingSegment[],
  paragraphs: [
    'Amazing products are coming up every day, but often they lack the right builders to make them functional and beautiful.',
    'Our builders are friendly and passionate, ready to take up any challenge. People with whom you can code, talk football, go cycling, and watch House of the Dragon.',
  ],
  quote: { text: teamQuotes['Hari Krishna'], name: 'Hari Krishna', role: 'Founder' },
}

export const contact = {
  eyebrow: 'Get in touch',
  headline: [
    { text: 'Do you have a ' },
    { text: 'question, an idea or a project', accent: true },
    { text: ' you need help with?' },
  ] satisfies HeadingSegment[],
  /* Phones show this button instead of the form. */
  mobileCta: { label: 'Contact Us', href: '/contact-us' },
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

/** width/height: the cropped file's pixel size (printed by npm run logos); only the ratio is used. */
export type CustomerLogo = { name: string; src: string; width: number; height: number }

/* Order as on the Webflow site. The strip sizes each logo from its aspect ratio (CustomersStrip.tsx). */
export const customers = {
  eyebrow: 'Customers',
  logos: [
    { name: 'Cloudnine', src: asset('/assets/partners/cloudnine.png'), width: 429, height: 103 },
    { name: 'Napkin', src: asset('/assets/partners/napkin.png'), width: 398, height: 114 },
    { name: 'Vocera', src: asset('/assets/partners/vocera.png'), width: 540, height: 88 },
    { name: 'Ratnagarba', src: asset('/assets/partners/ratnagarba.png'), width: 192, height: 41 },
    {
      name: 'Reverie Language Technologies',
      src: asset('/assets/partners/reverie.png'),
      width: 95,
      height: 28,
    },
    { name: 'Britive', src: asset('/assets/partners/britive.png'), width: 159, height: 47 },
    { name: 'TAGBOX', src: asset('/assets/partners/tagbox.png'), width: 134, height: 57 },
    { name: 're|unify', src: asset('/assets/partners/reunify.png'), width: 150, height: 58 },
    { name: 'Brandbass', src: asset('/assets/partners/brandbass.png'), width: 168, height: 34 },
  ] satisfies CustomerLogo[],
}
