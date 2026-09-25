/*
 * Build-time prerender entry (vite build --ssr). scripts/prerender.mjs calls render() for each page
 * and writes the HTML into dist, so pages paint before JavaScript loads; the browser then hydrates.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Router } from '@/lib/router'
import { notFound, pageMeta } from './data/seo'
import { AppRoutes } from './routes'

export { notFound, pageMeta }

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <Router path={path}>
        <AppRoutes />
      </Router>
    </StrictMode>,
  )
}
