/*
 * Build-time prerender entry (vite build --ssr). scripts/prerender.mjs calls render() for each page
 * and writes the HTML into dist, so pages paint before JavaScript loads; the browser then hydrates.
 */
/* eslint-disable react-refresh/only-export-components -- build-only entry, never hot-reloaded */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Router } from '@/lib/router'
import { legacyRedirects, notFound, pageMeta, sitePages } from './data/seo'
import { absoluteUrl, DEFAULT_SHARE_IMAGE } from './lib/siteUrl'
import { AppRoutes } from './routes'

export { absoluteUrl, DEFAULT_SHARE_IMAGE, legacyRedirects, notFound, pageMeta, sitePages }

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <Router path={path}>
        <AppRoutes />
      </Router>
    </StrictMode>,
  )
}
