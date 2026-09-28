import { useEffect, type ReactNode } from 'react'
import { useLocation } from '@/lib/router'
import { Footer } from './Footer'
import { loadAccentFonts } from '@/lib/accentFonts'
import { Header } from './Header'

/**
 * Page shell. In every frame the header sits at the side padding, content starts 32px below it,
 * and top-level sections are separated by "Section Padding Large" (120 / 80 / 48).
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()

  /* Load the accent italics once an accent on this page nears the viewport (see accentFonts). */
  useEffect(() => loadAccentFonts(), [pathname])

  /* Arriving on a page with a #target in the URL (e.g. a shared /about#careers link). */
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first load only; Router handles navigations
  }, [])

  return (
    /* pt-3 matches the header's sticky top-3, so it sits in the same place from the first frame. */
    <div className="px-side pb-side mx-auto w-full max-w-[1700px] pt-3">
      <Header />
      <main className="gap-section-lg mt-8 flex flex-col">{children}</main>
      <div className="mt-section-lg">
        <Footer />
      </div>
    </div>
  )
}
