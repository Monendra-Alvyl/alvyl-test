import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { BlogPost } from '@/data/blog'
import { absoluteUrl } from '@/lib/siteUrl'
import { cn } from '@/lib/cn'
import { iconButton } from './iconButton'

/**
 * Share a post on LinkedIn, X or WhatsApp (plain links, so they work before JavaScript loads), or
 * copy its address. The previews those apps show come from the post's Open Graph tags.
 */
export function ShareLinks({ post, className }: { post: BlogPost; className?: string }) {
  const [copied, setCopied] = useState(false)
  const url = absoluteUrl(post.path)
  const links = [
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'X',
      icon: 'x',
      href: `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`,
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`,
    },
  ] as const

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* Clipboard blocked: the address bar still has the link. */
    }
  }

  return (
    <ul aria-label="Share this post" className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Share on ${link.name}`}
            className={iconButton}
          >
            <Icon name={link.icon} size={18} />
          </a>
        </li>
      ))}
      <li className="flex items-center gap-2">
        <button type="button" onClick={copy} aria-label="Copy link" className={iconButton}>
          <Icon name="link" size={20} />
        </button>
        <span
          role="status"
          className={cn(
            'text-body-sm text-text-ultra-light font-sans font-normal transition-opacity',
            copied ? 'opacity-100' : 'opacity-0',
          )}
        >
          {copied ? 'Link copied' : ''}
        </span>
      </li>
    </ul>
  )
}
