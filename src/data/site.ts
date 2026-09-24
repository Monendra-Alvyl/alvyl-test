/*
 * Site-wide content taken verbatim from Figma.
 * Content lives in typed data modules so it can move to Sanity later without touching components.
 */

export type NavLink = {
  label: string
  href: string
}

export const primaryNav: NavLink[] = [
  { label: 'About us', href: '/about' },
  { label: 'Offerings', href: '/offerings' },
]

export const headerCta = { label: 'Schedule a Call', href: '#' }

export const footer = {
  headline: [[{ text: "Let's create your unique" }], [{ text: 'success story.', accent: true }]],
  email: 'hello@alvyl.com',
  phone: '+91 98278 28912',
  /* Column headings only — the Home footer design shows no links under them. */
  columns: ['Services', 'Company'],
  copyright: '2025 Alvyl Consulting',
  legal: [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
}
