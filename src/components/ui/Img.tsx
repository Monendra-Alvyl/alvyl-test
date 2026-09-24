import type { ImgHTMLAttributes } from 'react'
import { imageEntry, webpSrcSet } from '@/lib/images'

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  /** Above-the-fold image (LCP candidate): loads eagerly with high fetch priority. */
  priority?: boolean
}

/**
 * Responsive image: serves the optimised WebP variants from `npm run images` via srcset, sets the
 * intrinsic width/height (no layout shift) and lazy-loads unless `priority` is set.
 * `sizes` should describe the rendered width; it defaults to the full viewport.
 */
export function Img({ src, priority = false, sizes = '100vw', alt, ...props }: ImgProps) {
  const entry = imageEntry(src)
  return (
    <img
      src={src}
      srcSet={entry ? webpSrcSet(src) : undefined}
      sizes={entry ? sizes : undefined}
      width={entry?.width}
      height={entry?.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      {...props}
    />
  )
}
