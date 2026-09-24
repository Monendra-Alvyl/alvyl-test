/*
 * Minimal client router for this static site (3 pages). Replaces react-router (~30 KB gzipped):
 * History API navigation that respects the Vite base (e.g. /alvyl-test on GitHub Pages),
 * back/forward, scroll-to-top or #hash on navigation, and a fixed path for build-time prerendering.
 */
/* eslint-disable react-refresh/only-export-components -- the router module exports its hook and helpers alongside components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

/** Deploy base without the trailing slash: "" locally, "/alvyl-test" on GitHub Pages. */
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

type Location = { pathname: string; hash: string }

/** Maps a browser path ("/alvyl-test/about/", "/about.html") to an app path ("/about"). */
export function toAppPath(browserPath: string): string {
  let path = browserPath.startsWith(base) ? browserPath.slice(base.length) : browserPath
  path = path.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '')
  return path || '/'
}

const hrefFor = (to: string) => base + to

const readLocation = (): Location => ({
  pathname: toAppPath(window.location.pathname),
  hash: window.location.hash,
})

type RouterValue = { location: Location; navigate: (to: string) => void }
const RouterContext = createContext<RouterValue | null>(null)

/* useLayoutEffect warns during server rendering; the effect only matters in the browser. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Provides the current location. `path` fixes it for prerendering (no window on the server). */
export function Router({ path, children }: { path?: string; children: ReactNode }) {
  const [location, setLocation] = useState<Location>(() =>
    typeof window === 'undefined' ? { pathname: path ?? '/', hash: '' } : readLocation(),
  )
  const navigated = useRef(false)

  useEffect(() => {
    const onPop = () => setLocation(readLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, 'http://app')
    const next = { pathname: toAppPath(url.pathname), hash: url.hash }
    window.history.pushState(null, '', hrefFor(next.pathname) + next.hash)
    navigated.current = true
    setLocation(next)
  }, [])

  /* After a Link navigation: jump to the #target, or to the top of the new page. */
  useIsomorphicLayoutEffect(() => {
    if (!navigated.current) return
    navigated.current = false
    const target = location.hash && document.getElementById(location.hash.slice(1))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [location])

  const value = useMemo(() => ({ location, navigate }), [location, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useLocation(): Location {
  const router = useContext(RouterContext)
  if (!router) throw new Error('useLocation must be used inside <Router>')
  return router.location
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

/** In-app link: a real <a href> (base-prefixed) that navigates without a page reload. */
export function Link({ to, onClick, target, ...props }: LinkProps) {
  const router = useContext(RouterContext)
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (!router || event.defaultPrevented || event.button !== 0 || modified || target) return
    event.preventDefault()
    router.navigate(to)
  }
  return <a href={hrefFor(to)} target={target} onClick={handleClick} {...props} />
}
