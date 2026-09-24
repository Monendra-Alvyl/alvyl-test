import type { ComponentType } from 'react'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { useLocation } from '@/lib/router'
import { AboutPage } from '@/pages/about/AboutPage'
import { HomePage } from '@/pages/home/HomePage'
import { OfferingsPage } from '@/pages/offerings/OfferingsPage'

/** Page for each app path; unknown paths fall back to Home. */
const pages: Record<string, ComponentType> = {
  '/': HomePage,
  '/about': AboutPage,
  '/offerings': OfferingsPage,
}

/** Renders the site shell with the page for the current location (browser and prerender). */
export function AppRoutes() {
  const { pathname } = useLocation()
  const Page = pages[pathname] ?? HomePage
  return (
    <SiteLayout>
      <Page />
    </SiteLayout>
  )
}
