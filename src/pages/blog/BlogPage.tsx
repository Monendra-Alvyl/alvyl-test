import { useState } from 'react'
import { Seo } from '@/components/layout/Seo'
import { ContactSection } from '@/components/sections/ContactSection'
import { Chip } from '@/components/ui/Chip'
import { Panel } from '@/components/ui/Panel'
import { blogCategories, blogHeading, blogPosts } from '@/data/blog'
import { blogMeta } from '@/data/seo'
import { PostCard, PostHero } from './PostCard'

/*
 * Blog list (/blog), as the Figma blog frame (pg/blog Desktop.png): the newest post as the hero,
 * centred topic chips (the design system's Chip), then the other posts three to a row, and the
 * contact section. The chips filter the grid in place; the prerendered page lists every post, so
 * crawlers and no-JS visitors get them all.
 */
export function BlogPage() {
  const [topic, setTopic] = useState<string | null>(null)
  const [featured, ...rest] = blogPosts
  const posts = topic ? rest.filter((p) => p.categories.some((c) => c.id === topic)) : rest
  const topicTitle = blogCategories.find((c) => c.id === topic)?.title

  return (
    <>
      <Seo {...blogMeta} />
      <h1 className="sr-only">{blogHeading.pageTitle}</h1>

      {!featured ? (
        <Panel className="p-section-inner">
          <p className="text-body-lg text-text-ultra-light font-sans font-normal">
            {blogHeading.empty}
          </p>
        </Panel>
      ) : (
        <>
          <section aria-label={blogHeading.latestLabel}>
            <PostHero post={featured} />
          </section>

          <section aria-labelledby="posts-heading" className="flex flex-col gap-8 md:gap-12">
            <h2 id="posts-heading" className="sr-only">
              {topicTitle ? `${topicTitle} posts` : blogHeading.morePosts}
            </h2>
            {blogCategories.length > 0 && (
              <div
                role="group"
                aria-label={blogHeading.filterLabel}
                className="flex flex-wrap justify-center gap-4"
              >
                <Chip selected={topic === null} onClick={() => setTopic(null)}>
                  {blogHeading.allTopics}
                </Chip>
                {blogCategories.map((category) => (
                  <Chip
                    key={category.id}
                    selected={topic === category.id}
                    onClick={() => setTopic(topic === category.id ? null : category.id)}
                  >
                    {category.title}
                  </Chip>
                ))}
              </div>
            )}
            <p aria-live="polite" className="sr-only">
              {topicTitle
                ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} about ${topicTitle}`
                : ''}
            </p>

            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </ul>
            {topic && posts.length === 0 && (
              <p className="text-body-lg text-text-ultra-light text-center font-sans font-normal">
                {blogHeading.emptyTopic}
              </p>
            )}
          </section>
        </>
      )}

      <ContactSection />
    </>
  )
}
