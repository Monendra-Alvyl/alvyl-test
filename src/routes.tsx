import type { ComponentType } from 'react'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { useLocation } from '@/lib/router'
import { AboutPage } from '@/pages/about/AboutPage'
import { ContactPage } from '@/pages/contact/ContactPage'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { OfferingsPage } from '@/pages/offerings/OfferingsPage'

/** Page for each app path; unknown paths show the 404 page. */
const pages: Record<string, ComponentType> = {
  '/': HomePage,
  '/about': AboutPage,
  '/offerings': OfferingsPage,
  '/contact-us': ContactPage,
}

/** Renders the site shell with the page for the current location (browser and prerender). */
export function AppRoutes() {
  const { pathname } = useLocation()
  const Page = pages[pathname] ?? NotFoundPage
  return (
    <SiteLayout>
      <Page />
    </SiteLayout>
  )
}
