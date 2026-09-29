/*
 * Public origin of the site (including the deploy base), for the blog's canonical links, Open Graph
 * URLs and JSON-LD. Set VITE_SITE_URL at build time (the GitHub Pages workflow sets it to the Pages
 * URL); it defaults to the production domain.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.alvyl.com').replace(
  /\/+$/,
  '',
)

/** Absolute URL for an app path ("/blog") or a /public file ("/assets/home/hero-desktop.jpg"). */
export const absoluteUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : SITE_URL + path)

/** Share image when a page has none of its own (the same one <Seo> uses on every other page). */
export const DEFAULT_SHARE_IMAGE = '/assets/home/hero-desktop.jpg'
