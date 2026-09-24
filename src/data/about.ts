/*
 * About page content — copied from pg/About Desktop.png (tablet/mobile use the same copy).
 * Heading segments marked `accent` render in the Alchemy italic style.
 */
import type { HeadingSegment } from './home'

export const aboutIntro = {
  headline: 'At Alvyl, we’ve got each other’s backs. We team up and love to lend a hand!',
  stats: [
    { label: 'Launched', value: '2020' },
    { label: 'Employees', value: '40+' },
  ],
  /* Desktop uses a portrait crop; tablet/phone show the full landscape group photo. */
  image: '/assets/about/hero-team.jpg',
  imageWide: '/assets/home/team-1.png',
  imageAlt: 'The Alvyl team together in the office',
}

export const whyWeStarted = {
  eyebrow: 'Why we started?',
  paragraphs: [
    'We didn’t start Alvyl to create just another firm. We were frustrated with how disconnected technology often seemed.',
    'Our goal was to develop systems that truly make people feel understood and valued. Progress should feel seamless and intuitive.',
  ],
  image: '/assets/about/why-we-started.jpg',
  imageAlt: 'An Alvyl team member working at a laptop',
}

export const promise = {
  eyebrow: 'Our promise',
  headline: [{ text: 'How we ' }, { text: 'want to be', accent: true }] satisfies HeadingSegment[],
  body: 'From concept to launch, we’re committed to your success with rapid response times and personalized attention to detail.',
  cards: [
    {
      tone: 'alchemy',
      title: 'We Promise to...',
      body: 'Continuously innovate digital solutions for contract caterers, resulting in better experiences for the customer, increased profits for clients, and positive impact on the planet',
      image: '/assets/about/promise-peace.png',
    },
    {
      tone: 'dark',
      title: 'We Promise NOT to...',
      body: 'Prioritise profits at the expense of customer satisfaction and suggest solutions that don’t meet our high standards. We won’t pursue profit in ways that harm the planet. And we won’t resist new tech.',
      image: '/assets/about/promise-palm.png',
    },
  ],
} as const

export const careers = {
  eyebrow: 'Careers',
  headline: [
    { text: 'Join our community and ' },
    { text: 'make a difference', accent: true },
    { text: ' together!' },
  ] satisfies HeadingSegment[],
  image: '/assets/about/careers.jpg',
  imageAlt: 'Alvyl team members talking in the office lounge',
}
