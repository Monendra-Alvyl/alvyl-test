/*
 * Per-page <title> and meta description — used by <Seo> in the browser and written into the
 * prerendered HTML by scripts/prerender.mjs, so crawlers see them without running JavaScript.
 */
export type PageMeta = { path: string; title: string; description: string }

export const pageMeta = {
  home: {
    path: '/',
    title: 'Alvyl',
    description:
      'Alvyl is a team of builders delivering end-to-end product design, site reliability engineering, agentic AI and IoT & machine learning — startup speed with enterprise impact.',
  },
  about: {
    path: '/about',
    title: 'About us | Alvyl',
    description:
      'Meet Alvyl: launched in 2020, 40+ people who believe technology should simplify life — why we started, our promise and the team behind the work.',
  },
  offerings: {
    path: '/offerings',
    title: 'Offerings | Alvyl',
    description:
      'Alvyl’s digital design studio: UX/UI design, development, brand identity and ongoing support — with measurable results and 24/7 priority care.',
  },
} satisfies Record<string, PageMeta>
