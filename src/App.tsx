import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { AboutPage } from '@/pages/about/AboutPage'
import { HomePage } from '@/pages/home/HomePage'
import { OfferingsPage } from '@/pages/offerings/OfferingsPage'

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'offerings', element: <OfferingsPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
