import type { AnchorHTMLAttributes } from 'react'
import { Link } from '@/lib/router'

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** Client-side route link for internal paths ("/about"); a plain anchor for "#…" and external URLs. */
export function SmartLink({ href, ...props }: SmartLinkProps) {
  return href.startsWith('/') ? <Link to={href} {...props} /> : <a href={href} {...props} />
}
