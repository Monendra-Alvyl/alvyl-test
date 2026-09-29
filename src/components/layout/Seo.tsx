import { useEffect } from 'react'
import { absoluteUrl, DEFAULT_SHARE_IMAGE } from '@/lib/siteUrl'

type SeoProps = {
  title: string
  description: string
  noindex?: boolean
  /** App path, for the canonical link and og:url (every page except the 404). */
  path?: string
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

/*
 * The same robots value scripts/prerender.mjs writes: indexable, with large image previews and full
 * snippets allowed in search results.
 */
const INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

/**
 * Per-page document metadata. scripts/prerender.mjs writes the same tags into each page's HTML (for
 * crawlers that don't run JavaScript); on client-side navigation this updates them in place, so there
 * are never duplicates.
 */
export function Seo({
  title,
  description,
  noindex = false,
  path,
  image,
  article = false,
}: SeoProps) {
  useEffect(() => {
    const shareImage = image ?? absoluteUrl(DEFAULT_SHARE_IMAGE)
    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex' : INDEX)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', shareImage)
    setMeta('property', 'og:type', article ? 'article' : 'website')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', shareImage)
    /* The 404 page has no address of its own: no canonical or og:url there. */
    const url = path && !noindex ? absoluteUrl(path) : null
    if (url) setMeta('property', 'og:url', url)
    else document.head.querySelector('meta[property="og:url"]')?.remove()
    setCanonical(url)
  }, [title, description, noindex, path, image, article])

  return null
}
