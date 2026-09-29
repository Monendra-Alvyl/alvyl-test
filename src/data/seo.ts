/*
 * SEO for every page: <title> (keyword first, "| Alvyl" last, ≤ 60 characters), meta description
 * (≤ 160), canonical URL, share image and structured data (JSON-LD). Used by <Seo> in the browser
 * and written into the prerendered HTML by scripts/prerender.mjs (sitePages), so crawlers see it all
 * without running JavaScript. Descriptions keep the Webflow site's copy where it fits.
 */
import { absoluteUrl, DEFAULT_SHARE_IMAGE } from '@/lib/siteUrl'
import { blogPosts, type BlogPost } from './blog'
import { servicePath, services } from './services'
import { footer } from './site'

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
    title: 'Alvyl | Product Design, Agentic AI, IoT & SRE Studio',
    description:
      'We create genuine experiences that meet real needs. From MVPs to enterprise solutions—Site Reliability, Agentic AI, IoT & Machine Learning.',
  },
  about: {
    path: '/about',
    title: 'About Alvyl | A People-First Tech Studio Since 2018',
    description:
      'Founded in 2018 with 40+ employees, Alvyl builds product design, site reliability, agentic AI and IoT solutions for startups and enterprises.',
  },
  offerings: {
    path: '/offerings',
    title: 'Offerings | UX/UI Design, Development & Branding | Alvyl',
    description:
      'Clarity, empathy, and rhythm built into everything we touch. Explore our UX/UI design, development, brand identity, and ongoing support services.',
  },
  contact: {
    path: '/contact-us',
    title: 'Contact Alvyl | Start Your Project With Us',
    description:
      'Have a question, idea, or project? Contact Alvyl Consulting today. Reach us at hello@alvyl.com or +91 98278 28912 to discuss your unique success story.',
  },
  ...serviceMeta,
} satisfies Record<string, PageMeta>

/* Unknown URLs — not in pageMeta, so it isn't prerendered as a regular page (see scripts/prerender.mjs). */
export const notFound = {
  path: '/404',
  title: 'Page not found | Alvyl',
  description: 'The page you’re looking for doesn’t exist or has moved.',
} satisfies PageMeta

/** A prerendered page's full SEO (scripts/prerender.mjs). */
export type SeoPage = PageMeta & {
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
  title: 'Alvyl Blog | Notes on Design, AI, IoT & Reliability',
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

/** /blog and one page per published post. */
const blogPages: SeoPage[] = [
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

/* ── Every other page: Organization + WebSite on Home, a typed WebPage and breadcrumb elsewhere ── */

/*
 * The Organization (name, logo, contact details) that every page's publisher and every post's author
 * point at by @id. Add "sameAs" (LinkedIn, etc.) and "address" here when the site lists them.
 */
function organization() {
  const telephone = footer.phone.replace(/\s/g, '')
  return {
    ...organizationRef,
    alternateName: 'Alvyl',
    description: pageMeta.home.description,
    email: footer.email,
    telephone,
    foundingDate: '2018',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: footer.email,
      telephone,
      availableLanguage: ['en'],
    },
  }
}

const website = {
  '@type': 'WebSite',
  '@id': absoluteUrl('/#website'),
  url: absoluteUrl('/'),
  name: 'Alvyl',
  publisher: { '@id': organizationRef['@id'] },
  inLanguage: 'en',
}

/** A page of the site (AboutPage, ContactPage, …) with its breadcrumb. */
function webPageJsonLd(page: PageMeta, type: string, name: string, extra: object[] = []) {
  const url = absoluteUrl(page.path)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': type,
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': website['@id'] },
        about: { '@id': organizationRef['@id'] },
        inLanguage: 'en',
      },
      breadcrumbJsonLd([{ name, path: page.path }]),
      ...extra,
    ],
  }
}

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    organization(),
    website,
    {
      '@type': 'WebPage',
      '@id': `${absoluteUrl('/')}#webpage`,
      url: absoluteUrl('/'),
      name: pageMeta.home.title,
      description: pageMeta.home.description,
      isPartOf: { '@id': website['@id'] },
      about: { '@id': organizationRef['@id'] },
      inLanguage: 'en',
    },
  ],
}

/** A service page: the Service Alvyl provides, on its WebPage. */
const serviceJsonLd = (service: (typeof services)[number]) => {
  const page = {
    path: servicePath(service.slug),
    title: service.seoTitle,
    description: service.seoDescription,
  }
  return webPageJsonLd(page, 'WebPage', service.title, [
    {
      '@type': 'Service',
      '@id': `${absoluteUrl(page.path)}#service`,
      name: service.title,
      serviceType: service.title,
      description: service.seoDescription,
      provider: { '@id': organizationRef['@id'] },
      areaServed: 'Worldwide',
      url: absoluteUrl(page.path),
    },
  ])
}

/** Every indexable page, in sitemap order, for scripts/prerender.mjs. */
export const sitePages: SeoPage[] = [
  { ...pageMeta.home, jsonLd: homeJsonLd },
  { ...pageMeta.about, jsonLd: webPageJsonLd(pageMeta.about, 'AboutPage', 'About') },
  { ...pageMeta.offerings, jsonLd: webPageJsonLd(pageMeta.offerings, 'WebPage', 'Offerings') },
  { ...pageMeta.contact, jsonLd: webPageJsonLd(pageMeta.contact, 'ContactPage', 'Contact') },
  ...services.map((service) => ({
    path: servicePath(service.slug),
    title: service.seoTitle,
    description: service.seoDescription,
    jsonLd: serviceJsonLd(service),
  })),
  ...blogPages,
]

/*
 * Old addresses of blog posts on the current site (www.alvyl.com/post/<slug>). Each is prerendered
 * as a permanent redirect to /blog/<slug> (meta refresh + canonical), so links and search ranking
 * carry over once this site replaces it.
 */
export const legacyRedirects = blogPosts.map((post) => ({
  from: `/post/${post.slug}`,
  to: post.path,
}))
