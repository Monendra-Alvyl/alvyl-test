/*
 * Offerings page content — copy matches the live Webflow site (alvyl-revamp-site.webflow.io/offerings).
 * Heading segments marked `accent` render in the Alchemy italic style.
 */
import type { HeadingSegment } from './home'
import { asset } from '@/lib/asset'

export const offerHero = {
  titleLines: ['Digital', 'Design', 'Studio'],
  body: 'Clarity, empathy, and rhythm — built into everything we touch.',
  cta: { label: 'Start a Project', href: '/contact-us' },
  image: asset('/assets/offerings/hero-studio.jpg'),
  imageAlt: 'Two designers reviewing work on a tablet',
  tags: ['UX/UI Design', 'Development', 'Brand Identity Design', 'Ongoing Support'],
}

export const offerNumbers = {
  eyebrow: 'How can we help?',
  headline: [
    [{ text: 'Our work speaks through numbers.' }],
    [{ text: 'Here’s what ' }, { text: 'we’ve achieved', accent: true }, { text: ' so far.' }],
  ] satisfies HeadingSegment[][],
  stats: [
    {
      trend: 'up',
      value: '52%',
      label: 'User Retention Rate',
      body: 'Through trust-building UI and simplified navigation.',
    },
    {
      trend: 'up',
      value: '24%',
      label: 'Conversion Lift',
      body: 'Driven by emotional brand storytelling and frictionless CTAs.',
    },
    {
      trend: null,
      value: '100%',
      label: 'Design System Adoption',
      body: 'Cross-team alignment achieved within 6 weeks of rollout.',
    },
  ],
} as const

export const ordinary = {
  headline: [
    [{ text: 'From ordinary' }],
    [{ text: 'to ' }, { text: 'extraordinary', accent: true }],
  ] satisfies HeadingSegment[][],
  body: 'Design that’s built to last and grow with your business',
  /* [top-left, bottom-right] in the desktop collage; a swipeable row below desktop. */
  mockups: [
    {
      src: asset('/assets/offerings/ordinary-investments.jpg'),
      alt: 'The Alvyl website shown on a phone',
    },
    {
      src: asset('/assets/offerings/ordinary-allocation.jpg'),
      alt: 'A phone showing the “Ideas. Designed. Impactful.” screen',
    },
  ],
}

export const goals = {
  eyebrow: 'Work that speaks',
  headline: [
    { text: 'Your goals, ' },
    { text: 'our priority', accent: true },
  ] satisfies HeadingSegment[],
  body: 'From concept to launch, we’re committed to your success with rapid response times and personalized attention to detail.',
  cards: [
    {
      /* Broken onto two lines on desktop only, as in the designs. */
      titleLines: ['24/7', 'priority care'],
      body: 'Get top-tier support for urgent tasks, ensuring a response within 24 hours for our high-priority clients.',
      image: asset('/assets/home/offer-sphere-large.png'),
    },
    {
      titleLines: ['Tailored tweaks', 'for perfection'],
      body: 'Get a complete branding toolkit, including logos, color schemes, and typography. Download assets or share with your team.',
      image: asset('/assets/home/offer-sphere-small.png'),
    },
    {
      titleLines: ['Brand kit at your', 'fingertips'],
      body: 'Request custom revisions at any time. We provide up to 5 minor revisions post-launch to keep things looking fresh.',
      image: asset('/assets/home/offer-sphere-small.png'),
    },
  ],
} as const

export const selectedWork = {
  eyebrow: 'Selected work',
  headline: [
    [{ text: 'Proven ' }, { text: 'results', accent: true }, { text: ',' }],
    [{ text: 'stunning designs' }],
  ] satisfies HeadingSegment[][],
  body: 'We move with the agility of a startup and the precision of an enterprise partner — designing, building, and scaling ideas that make a lasting mark.',
  image: asset('/assets/offerings/selected-work.png'),
}
