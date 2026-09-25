import { useEffect } from 'react'
import { asset } from '@/lib/asset'

type SeoProps = { title: string; description: string; noindex?: boolean }

/** Sets (or creates) a <meta> tag in <head>, keyed by its name/property attribute. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.append(tag)
  }
  tag.content = content
}

/**
 * Per-page document metadata. index.html carries the site-wide defaults (for crawlers that don't
 * run JavaScript); each page updates the same tags so there are never duplicates.
 */
export function Seo({ title, description, noindex = false }: SeoProps) {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta(
      'property',
      'og:image',
      new URL(asset('/assets/home/hero-desktop.jpg'), location.href).href,
    )
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    /* Keep error pages (404) out of search results; remove the tag again on normal pages. */
    if (noindex) setMeta('name', 'robots', 'noindex')
    else document.head.querySelector('meta[name="robots"]')?.remove()
  }, [title, description, noindex])

  return null
}
