import { asset } from '@/lib/asset'
import content from './cms.generated.json'

/*
 * Blog content: Markdown files in the CMS content repo (blog/), edited in Sveltia CMS (/admin), turned into
 * cms.generated.json at build time by scripts/cms-content.mjs (drafts and future posts left out,
 * bodies already rendered to HTML).
 */

/** A post as scripts/cms-content.mjs writes it. */
type CmsPost = {
  id: string
  title: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  cover: { src: string; alt: string } | null
  author: {
    name: string
    role: string | null
    photo: string | null
    linkedin: string | null
  } | null
  categories: { id: string; title: string }[]
  html: string
  words: number
  /** Headings in the body, for the post's "On this page" list. */
  toc: { id: string; label: string; level: number }[]
  /** Always set and unique per post (generated from the title and excerpt unless overridden). */
  seo: { title: string; description: string }
}

export type BlogPost = {
  id: string
  slug: string
  path: string
  title: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  /** Cover image (base-prefixed /public path). */
  cover: { src: string; alt: string } | null
  author: {
    name: string
    role: string | null
    photo: string | null
    linkedin: string | null
  } | null
  categories: { id: string; title: string }[]
  /** Body HTML, styled by .post-body (src/styles/index.css). */
  html: string
  words: number
  /** Headings in the body, for the post's "On this page" list. */
  toc: { id: string; label: string; level: number }[]
  readingMinutes: number
  seo: { title: string; description: string }
}

export const blogHeading = {
  eyebrow: 'Blog',
  headline: [{ text: 'Notes from the ' }, { text: 'team', accent: true }],
  body: 'How we design, build and run products — from agentic AI and IoT to site reliability.',
  empty: 'No posts yet. Check back soon.',
  emptyTopic: 'No other posts on this topic yet.',
  pageTitle: 'Alvyl Blog: notes from the team',
  filterLabel: 'Filter posts by topic',
  allTopics: 'All',
  latestLabel: 'Latest post',
  morePosts: 'All posts',
  readNext: 'Keep reading',
  share: 'Share this post',
  writtenBy: 'Written by',
  onThisPage: 'On this page',
}

export const postPath = (slug: string) => `/blog/${slug}`

export const blogPosts: BlogPost[] = (content.posts as unknown as CmsPost[]).map((post) => ({
  id: post.id,
  slug: post.id,
  path: postPath(post.id),
  title: post.title,
  excerpt: post.excerpt,
  publishedAt: post.publishedAt,
  updatedAt: post.updatedAt,
  cover: post.cover ? { src: asset(post.cover.src), alt: post.cover.alt } : null,
  author: post.author
    ? {
        name: post.author.name,
        role: post.author.role,
        photo: post.author.photo ? asset(post.author.photo) : null,
        linkedin: post.author.linkedin,
      }
    : null,
  categories: post.categories,
  html: post.html,
  words: post.words,
  toc: post.toc ?? [],
  /* ~200 words a minute, at least one minute. */
  readingMinutes: Math.max(1, Math.round(post.words / 200)),
  seo: { title: `${post.seo.title} | Alvyl`, description: post.seo.description },
}))

/** Categories that have at least one published post, in the order they first appear. */
export const blogCategories = [
  ...new Map(blogPosts.flatMap((post) => post.categories).map((c) => [c.id, c])).values(),
]

/** Up to `count` other posts to read next: those sharing a category first, then the newest. */
export function relatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const ids = new Set(post.categories.map((category) => category.id))
  const shared = (other: BlogPost) => other.categories.filter((c) => ids.has(c.id)).length
  return blogPosts
    .filter((other) => other.id !== post.id)
    .map((other, index) => ({ other, index, score: shared(other) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map(({ other }) => other)
}

/** "12 March 2026" — fixed locale and time zone so prerendered and hydrated HTML match. */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso))
