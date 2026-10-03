import { Button } from '@/components/ui/Button'
import { Img } from '@/components/ui/Img'
import { Panel } from '@/components/ui/Panel'
import { formatDate, type BlogPost } from '@/data/blog'
import { Link } from '@/lib/router'
import { cn } from '@/lib/cn'

/*
 * Blog building blocks, from the Figma blog frame (pg/blog Desktop.png): the "AI • 25 March 2025 •
 * Written by …" meta line, the hero (image beside the title, used for the featured post on /blog
 * and as the header of a post) and the post card. Cards are one link each (a stretched ::after over
 * the card) with the site's Alchemy hover.
 */

const dot = <span aria-hidden className="bg-text-ultra-light size-1 shrink-0 rounded-full" />

/** Author photo, or their initial on a grey circle when there is no photo. */
export function AuthorAvatar({ post, size }: { post: BlogPost; size: 32 | 64 }) {
  const className = cn('shrink-0 rounded-full', size === 32 ? 'size-8' : 'size-16')
  if (post.author?.photo)
    return (
      <Img
        src={post.author.photo}
        alt=""
        className={cn(className, 'object-cover object-top')}
        sizes={`${size}px`}
      />
    )
  return (
    <span
      aria-hidden
      className={cn(
        className,
        'bg-light-grey text-text-white flex items-center justify-center font-sans text-[14px] font-normal',
      )}
    >
      {(post.author?.name ?? 'Alvyl').charAt(0)}
    </span>
  )
}

const authorName = (post: BlogPost) => post.author?.name ?? 'Alvyl'

/** "AI • 25 March 2025", plus "• Written by Hari Krishna" and the reading time in the hero. */
export function PostMeta({
  post,
  withAuthor = false,
  className,
}: {
  post: BlogPost
  withAuthor?: boolean
  className?: string
}) {
  const topic = post.categories[0]
  return (
    <p
      className={cn(
        'text-body text-text-ultra-light flex flex-wrap items-center gap-x-3 gap-y-1 font-sans font-normal',
        className,
      )}
    >
      {topic && (
        <>
          <span>{topic.title}</span>
          {dot}
        </>
      )}
      <time dateTime={post.publishedAt} className="text-text-white">
        {formatDate(post.publishedAt)}
      </time>
      {withAuthor && (
        <>
          {dot}
          <span>
            Written by <span className="text-text-white">{authorName(post)}</span>
          </span>
          {dot}
          <span>{post.readingMinutes} min read</span>
        </>
      )}
    </p>
  )
}

/** Avatar and "Written by Hari Krishna", at the foot of a card. */
function Byline({ post }: { post: BlogPost }) {
  return (
    <p className="text-body text-text-ultra-light flex items-center gap-3 font-sans font-normal transition-colors group-hover:text-white">
      <AuthorAvatar post={post} size={32} />
      <span>
        Written by <span className="text-text-white">{authorName(post)}</span>
      </span>
    </p>
  )
}

/**
 * Image beside the title in one panel (stacked on phones). On /blog it shows the newest post with a
 * "Read Blog" button; on a post page it is the header, with the title as the page's h1.
 */
export function PostHero({ post, as = 'feature' }: { post: BlogPost; as?: 'feature' | 'header' }) {
  const Title = as === 'header' ? 'h1' : 'h2'
  return (
    <Panel
      className={cn(
        'p-section-inner grid grid-cols-1 items-center gap-8 lg:gap-10',
        post.cover && 'lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)]',
      )}
    >
      {/* The whole cover at its own shape: never cropped, no backdrop. */}
      {post.cover && (
        <Img
          src={post.cover.src}
          alt={as === 'header' ? post.cover.alt : ''}
          priority
          className="h-auto w-full rounded-[16px]"
          sizes="(min-width: 1033px) 620px, calc(100vw - 64px)"
        />
      )}
      <div className="flex flex-col items-start gap-8 lg:pr-8">
        <div className="flex flex-col gap-6">
          <PostMeta post={post} withAuthor />
          <Title
            id={as === 'header' ? 'post-heading' : undefined}
            className="font-display text-h2 text-text-dark font-light"
          >
            {post.title}
          </Title>
          {post.excerpt && (
            <p className="text-body-lg text-text-ultra-light line-clamp-4 font-sans font-normal">
              {post.excerpt}
            </p>
          )}
        </div>
        {as === 'feature' && (
          <Button href={post.path} size="responsive-lg">
            Read Blog
          </Button>
        )}
      </div>
    </Panel>
  )
}

/** Blog card: topic and date, cover, title, author. The whole card is the link. */
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <li className="flex">
      <Panel as="article" className="group hover-alchemy p-card-nested flex w-full flex-col gap-6">
        <PostMeta post={post} className="transition-colors group-hover:text-white" />
        {/* The whole cover at its own shape: never cropped, no backdrop. */}
        {post.cover && (
          <div className="overflow-clip rounded-[16px]">
            <Img
              src={post.cover.src}
              alt=""
              className="block h-auto w-full transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
              sizes="(min-width: 1033px) 380px, (min-width: 450px) 45vw, calc(100vw - 96px)"
            />
          </div>
        )}
        <h3 className="text-h4 text-text-white font-sans font-light">
          {/* Stretched link: the ::after covers the card, so the card is one tab stop. */}
          <Link
            to={post.path}
            className="after:absolute after:inset-0 after:z-10 after:rounded-[24px]"
          >
            {post.title}
          </Link>
        </h3>
        <div className="mt-auto">
          <Byline post={post} />
        </div>
      </Panel>
    </li>
  )
}
