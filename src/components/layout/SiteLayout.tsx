import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

/**
 * Page shell. In every frame the header sits at the side padding, content starts 32px below it,
 * and top-level sections are separated by "Section Padding Large" (120 / 80 / 48).
 */
export function SiteLayout() {
  const { pathname, hash } = useLocation()

  /* Scroll to in-page targets such as /about#careers after navigating. */
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [pathname, hash])

  return (
    <div className="px-side pt-side pb-side mx-auto w-full max-w-[1700px]">
      <ScrollRestoration />
      <Header />
      <main className="gap-section-lg mt-8 flex flex-col">
        <Outlet />
      </main>
      <div className="mt-section-lg">
        <Footer />
      </div>
    </div>
  )
}
