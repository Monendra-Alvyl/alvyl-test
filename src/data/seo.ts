/*
 * Per-page <title> and meta description (copied from the live Webflow site) — used by <Seo> in the browser and written into the
 * prerendered HTML by scripts/prerender.mjs, so crawlers see them without running JavaScript.
 */
import { servicePath, services } from './services'

export type PageMeta = { path: string; title: string; description: string }

/* One entry per service page, keyed "service-<slug>". */
const serviceMeta = Object.fromEntries(
  services.map((s) => [
    `service-${s.slug}`,
    { path: servicePath(s.slug), title: s.seoTitle, description: s.seoDescription },
  ]),
) as Record<`service-${string}`, PageMeta>

export const pageMeta = {
  home: {
    path: '/',
    title: 'Alvyl - Human & Meaningful',
    description:
      'We create genuine experiences that meet real needs. From MVPs to enterprise solutions—Site Reliability, Agentic AI, IoT & Machine Learning.',
  },
  about: {
    path: '/about',
    title: 'Alvyl - About',
    description:
      'Founded in 2018 with 40+ employees, Alvyl innovates digital solutions for contract caterers. We prioritize customer satisfaction and sustainability.',
  },
  offerings: {
    path: '/offerings',
    title: 'Alvyl - Offerings',
    description:
      'Clarity, empathy, and rhythm built into everything we touch. Explore our UX/UI design, development, brand identity, and ongoing support services.',
  },
  contact: {
    path: '/contact-us',
    title: 'Contact Us',
    description:
      'Have a question, idea, or project? Contact Alvyl Consulting today. Reach us at hello@alvyl.com or +91 98278 28912 to discuss your unique success story.',
  },
  ...serviceMeta,
} satisfies Record<string, PageMeta>

/* Unknown URLs — not in pageMeta, so it isn't prerendered as a regular page (see scripts/prerender.mjs). */
export const notFound = {
  path: '/404',
  title: 'Page not found - Alvyl',
  description: 'The page you’re looking for doesn’t exist or has moved.',
} satisfies PageMeta
