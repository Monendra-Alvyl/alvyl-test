import manifest from '@/data/images.generated.json'
import { asset } from './asset'

export type ImageEntry = { width: number; height: number; variants: [number, string][] }
const images = manifest as unknown as Record<string, ImageEntry>

/** Looks up the generated WebP variants (npm run images) for a /public path, with or without the base. */
export function imageEntry(src: string): ImageEntry | undefined {
  const base = import.meta.env.BASE_URL
  const key = src.startsWith(base) ? `/${src.slice(base.length)}` : src
  return images[key]
}

/** `srcset` of WebP variants for a /public image, for <img> and <source> elements. */
export function webpSrcSet(src: string): string | undefined {
  return imageEntry(src)
    ?.variants.map(([w, url]) => `${asset(url)} ${w}w`)
    .join(', ')
}
