import { useEffect } from 'react'
import { asset } from '@/lib/asset'
import { absoluteUrl } from '@/lib/siteUrl'

type SeoProps = {
  title: string
  description: string
  noindex?: boolean
  /** App path, for the canonical link and og:url (blog pages; other pages have neither). */
  canonicalPath?: string
  /** Absolute share-image URL (a post's cover); defaults to the Home hero image. */
  image?: string
  /** og:type "article" (blog posts) instead of "website". */
  article?: boolean
}

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

/** Sets the canonical link, or removes it (null). */
function setCanonical(href: string | null) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) return link?.remove()
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.append(link)
  }
  link.href = href
}

/**
 * Per-page document metadata. index.html carries the site-wide defaults (for crawlers that don't
 * run JavaScript); each page updates the same tags so there are never duplicates.
 */
export function Seo({
  title,
  description,
  noindex = false,
  canonicalPath,
  image,
  article = false,
}: SeoProps) {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta(
      'property',
      'og:image',
      image ?? new URL(asset('/assets/home/hero-desktop.jpg'), location.href).href,
    )
    setMeta('property', 'og:type', article ? 'article' : 'website')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    /* Keep error pages (404) out of search results; remove the tag again on normal pages. */
    if (noindex) setMeta('name', 'robots', 'noindex')
    else document.head.querySelector('meta[name="robots"]')?.remove()
    /* Blog pages set these; leaving a blog page removes them again. */
    const url = canonicalPath ? absoluteUrl(canonicalPath) : null
    if (url) setMeta('property', 'og:url', url)
    else document.head.querySelector('meta[property="og:url"]')?.remove()
    setCanonical(url)
  }, [title, description, noindex, canonicalPath, image, article])

  return null
}
