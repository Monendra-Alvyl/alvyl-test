import { useEffect, useRef } from 'react'

/**
 * Thin Alchemy bar along the top of the window that fills as the article is read. It is scaled with
 * a transform on each animation frame after scrolling (no layout work), and hidden from assistive
 * technology, which has its own sense of position.
 */
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const article = document.getElementById(target)
      if (!article || !bar.current) return
      const { top, height } = article.getBoundingClientRect()
      const read = (window.innerHeight - top) / (height + window.innerHeight * 0.1)
      bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, read))})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [target])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={bar} className="bg-alchemy h-full origin-left scale-x-0" />
    </div>
  )
}
