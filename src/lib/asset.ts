/**
 * Prefixes a path from /public with the deploy base (Vite `base`), e.g. "/alvyl-test/" on
 * GitHub Pages. Absolute URLs (Webflow CDN, mailto:, …) are returned unchanged.
 */
export function asset(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  return import.meta.env.BASE_URL + path.slice(1)
}
