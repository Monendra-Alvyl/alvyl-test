/*
 * Per-page <title> and meta description (copied from the live Webflow site) — used by <Seo> in the browser and written into the
 * prerendered HTML by scripts/prerender.mjs, so crawlers see them without running JavaScript.
 */
import { absoluteUrl, DEFAULT_SHARE_IMAGE } from '@/lib/siteUrl'
import { blogPosts, type BlogPost } from './blog'
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

/* ── Blog (/blog and /blog/<slug>): prerendered with canonical links, article tags and JSON-LD ── */

export type BlogPageMeta = PageMeta & {
  /** Absolute share-image URL; defaults to DEFAULT_SHARE_IMAGE. */
  image?: string
  /** Alt text of the share image. */
  imageAlt?: string
  /** Structured data written into the prerendered <head>. */
  jsonLd: object
  /** Open Graph article details (posts): og:type "article" and article:* tags. */
  article?: {
    publishedTime: string
    modifiedTime: string
    author?: string
    section?: string
    tags: string[]
  }
}

export const blogMeta = {
  path: '/blog',
  title: 'Alvyl - Blog',
  description:
    'Notes from the Alvyl team on product design, site reliability, agentic AI, IoT and machine learning.',
} satisfies PageMeta

/** The post's cover as its Open Graph / Twitter image (absoluteUrl adds the base back). */
export const postShareImage = (post: BlogPost) =>
  post.cover ? absoluteUrl('/' + post.cover.src.slice(import.meta.env.BASE_URL.length)) : undefined

const organizationRef = {
  '@type': 'Organization',
  '@id': absoluteUrl('/#organization'),
  name: 'Alvyl Consulting',
  url: absoluteUrl('/'),
  logo: absoluteUrl('/favicon.png'),
}

/** Home → Blog (→ post) trail, for the breadcrumb Google shows in place of the URL. */
function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** A post: BlogPosting (headline, author, dates, image, publisher) and its breadcrumb. */
function blogPostingJsonLd(post: BlogPost) {
  const url = absoluteUrl(post.path)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        mainEntityOfPage: url,
        url,
        headline: post.title,
        description: post.seo.description,
        image: postShareImage(post) ?? absoluteUrl(DEFAULT_SHARE_IMAGE),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: post.author
          ? {
              '@type': 'Person',
              name: post.author.name,
              ...(post.author.role && { jobTitle: post.author.role }),
              ...(post.author.linkedin && {
                url: post.author.linkedin,
                sameAs: [post.author.linkedin],
              }),
              worksFor: { '@id': organizationRef['@id'] },
            }
          : organizationRef,
        publisher: organizationRef,
        ...(post.categories.length && {
          articleSection: post.categories[0].title,
          keywords: post.categories.map((category) => category.title).join(', '),
        }),
        wordCount: post.words,
        inLanguage: 'en',
        isPartOf: { '@type': 'Blog', '@id': absoluteUrl('/blog#blog') },
      },
      breadcrumbJsonLd([
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: post.path },
      ]),
    ],
  }
}

/** The blog index: Blog with its posts, and its breadcrumb. */
function blogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': absoluteUrl('/blog#blog'),
        url: absoluteUrl('/blog'),
        name: 'Alvyl Blog',
        description: blogMeta.description,
        publisher: organizationRef,
        inLanguage: 'en',
        blogPost: blogPosts.map((post) => ({
          '@type': 'BlogPosting',
          '@id': `${absoluteUrl(post.path)}#post`,
          headline: post.title,
          url: absoluteUrl(post.path),
          datePublished: post.publishedAt,
        })),
      },
      breadcrumbJsonLd([{ name: 'Blog', path: '/blog' }]),
    ],
  }
}

/** /blog and one page per published post, for scripts/prerender.mjs. */
export const blogPages: BlogPageMeta[] = [
  { ...blogMeta, jsonLd: blogJsonLd() },
  ...blogPosts.map((post) => ({
    path: post.path,
    ...post.seo,
    image: postShareImage(post),
    imageAlt: post.cover?.alt,
    jsonLd: blogPostingJsonLd(post),
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      author: post.author?.name,
      section: post.categories[0]?.title,
      tags: post.categories.map((category) => category.title),
    },
  })),
]
