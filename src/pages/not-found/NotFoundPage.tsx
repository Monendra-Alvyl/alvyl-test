import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { notFound } from '@/data/seo'

/* Shown for any unknown URL (prerendered into dist/404.html, which GitHub Pages serves with status 404). */
export function NotFoundPage() {
  return (
    <>
      <Seo {...notFound} noindex />
      <Panel
        as="section"
        aria-labelledby="not-found-heading"
        className="p-section-inner flex flex-col items-start gap-8"
      >
        <Eyebrow>404</Eyebrow>
        <h1 id="not-found-heading" className="font-display text-h2 text-text-dark font-light">
          Page not found
        </h1>
        <p className="text-body text-text-ultra-light font-sans">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Button href="/">Back to Home</Button>
      </Panel>
    </>
  )
}
