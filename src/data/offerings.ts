/*
 * Offerings page content — copied from pg/Offer Desktop.png (tablet/mobile use the same copy).
 * Heading segments marked `accent` render in the Alchemy italic style.
 */
import type { HeadingSegment } from './home'
import { asset } from '@/lib/asset'

export const offerHero = {
  titleLines: ['Digital', 'Design', 'Studio'],
  body: 'Clarity, empathy, and rhythm — built into everything we touch.',
  cta: { label: 'Send us a proposal', href: '#' },
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
  footnote: 'Data from tests conducted on products designed and delivered by Alvyl',
} as const

export const ordinary = {
  headline: [
    [{ text: 'From ordinary' }],
    [{ text: 'to ' }, { text: 'extraordinary', accent: true }],
  ] satisfies HeadingSegment[][],
  body: 'Design that’s built to last and grow with your business',
  mockups: [
    { src: asset('/assets/offerings/mockup-stack.jpg'), alt: 'Investment app screen on a phone' },
    {
      src: asset('/assets/offerings/mockup-wealth.jpg'),
      alt: 'Asset allocation app screen held in a hand',
    },
    { src: asset('/assets/offerings/mockup-hand.jpg'), alt: 'Alvyl website shown on a phone' },
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
      tone: 'dark',
      /* Broken onto two lines on desktop only, as in the designs. */
      titleLines: ['24/7', 'priority care'],
      body: 'Get top-tier support for urgent tasks, ensuring a response within 24 hours for our high-priority clients.',
      image: asset('/assets/home/offer-sphere-large.png'),
    },
    {
      tone: 'alchemy',
      titleLines: ['Tailored tweaks', 'for perfection'],
      body: 'Get a complete branding toolkit, including logos, color schemes, and typography. Download assets or share with your team.',
      image: asset('/assets/home/offer-sphere-small.png'),
    },
    {
      tone: 'dark',
      titleLines: ['Brand kit at your', 'fingertips'],
      body: 'Request custom revisions at any time. We provide up to 5 minor revisions post-launch to keep things looking fresh.',
      image: asset('/assets/home/offer-sphere-small.png'),
    },
  ],
} as const

export const estimate = {
  headline: [
    [{ text: 'Calculate your ' }, { text: 'project', accent: true }],
    [{ text: 'estimate', accent: true }, { text: ' with our new tool' }],
  ] satisfies HeadingSegment[][],
  cta: { label: 'Calculate Estimate', href: '#' },
  image: asset('/assets/offerings/calculator.jpg'),
}
