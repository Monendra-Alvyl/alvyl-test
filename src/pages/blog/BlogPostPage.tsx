import { Seo } from '@/components/layout/Seo'
import { ContactSection } from '@/components/sections/ContactSection'
import { chipClasses } from '@/components/ui/chipClasses'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Icon } from '@/components/ui/Icon'
import { Panel } from '@/components/ui/Panel'
import { blogHeading, relatedPosts, type BlogPost } from '@/data/blog'
import { postShareImage } from '@/data/seo'
import { Link } from '@/lib/router'
import { iconButton } from './iconButton'
import { AuthorAvatar, PostCard, PostHero } from './PostCard'
import { PostBody } from './PostBody'
import { ReadingProgress } from './ReadingProgress'
import { ShareLinks } from './ShareLinks'

/*
 * Blog post (/blog/<slug>), in the blog frame's style and the site's design system: the hero as the
 * header (cover beside the title and the "topic • date • written by" line), then the body in a Panel,
 * left-aligned in a 720px measure, with "On this page", the author and share links beside it (sticky
 * on desktop, below on phones). Labels are the site's Eyebrow, topics its Chip tags, and "Keep
 * reading" follows the service pages' "Other services". A thin Alchemy bar shows reading progress.
 */
export function BlogPostPage({ post }: { post: BlogPost }) {
  const next = relatedPosts(post)
  const toc = post.toc.filter((item) => item.level === 2)

  return (
    <>
      <Seo canonicalPath={post.path} {...post.seo} image={postShareImage(post)} article />
      <ReadingProgress target="post-body" />

      <article aria-labelledby="post-heading" className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="px-2">
          <ol className="text-caption text-text-ultra-light flex items-center gap-2 font-sans font-medium tracking-[0.08em] uppercase">
            <li>
              <Link to="/blog" className="tap-target">
                Blog
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="max-w-[60ch] min-w-0 truncate">
              {post.title}
            </li>
          </ol>
        </nav>

        <PostHero post={post} as="header" />

        <Panel className="p-section-inner">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:gap-16">
            <div id="post-body" className="flex min-w-0 flex-col gap-12">
              {toc.length >= 2 && (
                <details className="bg-dark-grey group rounded-[16px] lg:hidden">
                  <summary className="p-card-nested flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    <Eyebrow>{blogHeading.onThisPage}</Eyebrow>
                    <Icon
                      name="arrow"
                      size={14.578}
                      className="text-white transition-transform group-open:rotate-90 motion-reduce:transition-none"
                    />
                  </summary>
                  <TableOfContents items={toc} className="px-card-nested pb-card-nested" />
                </details>
              )}
              {post.html && <PostBody html={post.html} />}
              {post.categories.length > 0 && (
                <ul
                  aria-label="Topics"
                  className="border-stroke-light flex flex-wrap gap-3 border-t pt-8"
                >
                  {post.categories.map((category) => (
                    <li key={category.id} className={chipClasses(false, 'small')}>
                      {category.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside aria-label="About this post" className="lg:w-[320px] lg:justify-self-end">
              <div className="flex flex-col gap-4 lg:sticky lg:top-32">
                {toc.length >= 2 && (
                  <nav
                    aria-label={blogHeading.onThisPage}
                    className="bg-dark-grey p-card-nested hidden flex-col gap-6 rounded-[16px] lg:flex"
                  >
                    <Eyebrow>{blogHeading.onThisPage}</Eyebrow>
                    <TableOfContents items={toc} />
                  </nav>
                )}
                <div className="bg-dark-grey p-card-nested flex flex-col gap-6 rounded-[16px]">
                  <Eyebrow>{blogHeading.writtenBy}</Eyebrow>
                  <div className="flex items-center gap-4">
                    <AuthorAvatar post={post} size={64} />
                    {/* The site's attribution style (as under the Home founder quote). */}
                    <p className="text-body-lg text-text-dark flex min-w-0 flex-1 flex-col gap-1 font-sans font-medium">
                      {post.author?.name ?? 'The Alvyl team'}
                      {post.author?.role && (
                        <span className="text-body-sm text-text-ultra-light">
                          {post.author.role}
                        </span>
                      )}
                    </p>
                    {post.author?.linkedin && (
                      <a
                        href={post.author.linkedin}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${post.author.name} on LinkedIn`}
                        className={iconButton}
                      >
                        <Icon name="linkedin" size={18} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="bg-dark-grey p-card-nested flex flex-col gap-6 rounded-[16px]">
                  <Eyebrow>{blogHeading.share}</Eyebrow>
                  <ShareLinks post={post} />
                </div>
              </div>
            </aside>
          </div>
        </Panel>
      </article>

      {next.length > 0 && (
        <section aria-label={blogHeading.readNext} className="flex flex-col gap-6 md:gap-8">
          <Eyebrow className="px-2">{blogHeading.readNext}</Eyebrow>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {next.map((other) => (
              <PostCard key={other.id} post={other} />
            ))}
          </ul>
        </section>
      )}

      <ContactSection />
    </>
  )
}

/** Links to the body's section headings. */
function TableOfContents({ items, className }: { items: BlogPost['toc']; className?: string }) {
  return (
    <ol className={`flex flex-col gap-3 ${className ?? ''}`}>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="text-body text-text-light font-sans font-medium">
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  )
}
