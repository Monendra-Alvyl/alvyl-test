import type { ComponentType } from 'react'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { useLocation } from '@/lib/router'
import { AboutPage } from '@/pages/about/AboutPage'
import { BlogPage } from '@/pages/blog/BlogPage'
import { BlogPostPage } from '@/pages/blog/BlogPostPage'
import { ContactPage } from '@/pages/contact/ContactPage'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { OfferingsPage } from '@/pages/offerings/OfferingsPage'
import { ServicePage } from '@/pages/services/ServicePage'
import { blogPosts } from '@/data/blog'
import { servicePath, services } from '@/data/services'

/** Page for each app path (blog posts come from the CMS, data/blog.ts); unknown paths show the 404 page. */
const pages: Record<string, ComponentType> = {
  '/': HomePage,
  '/about': AboutPage,
  '/offerings': OfferingsPage,
  '/contact-us': ContactPage,
  '/blog': BlogPage,
  ...Object.fromEntries(
    services.map((service) => [
      servicePath(service.slug),
      function Service() {
        return <ServicePage service={service} />
      },
    ]),
  ),
  ...Object.fromEntries(
    blogPosts.map((post) => [
      post.path,
      function Post() {
        return <BlogPostPage post={post} />
      },
    ]),
  ),
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
