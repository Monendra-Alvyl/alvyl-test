import type { MouseEvent } from 'react'
import { toAppPath, useNavigate } from '@/lib/router'

/**
 * Blog post body: HTML rendered from the post's Markdown at build time (scripts/cms-content.mjs),
 * styled by .post-body in src/styles/index.css. The content comes from the repo (edited in the
 * CMS by the team), not from visitors. Links to other pages of the site navigate client-side,
 * like <Link>.
 */
export function PostBody({ html }: { html: string }) {
  const navigate = useNavigate()
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as Element).closest('a')
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (!link || link.target || event.button !== 0 || modified) return
    if (link.origin !== window.location.origin || link.hash) return
    event.preventDefault()
    navigate(toAppPath(link.pathname))
  }
  return <div className="post-body" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}
