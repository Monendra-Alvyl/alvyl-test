import { asset } from './asset'

/* IvyMode italic cuts used only for accent words in headings (none are on the first screen). */
const faces = [
  { file: 'IvyMode-Italic', weight: '400' },
  { file: 'IvyMode-LightItalic', weight: '300' },
  { file: 'IvyMode-ThinItalic', weight: '100' },
]

let loaded = false

function registerFaces() {
  if (loaded) return
  loaded = true
  for (const { file, weight } of faces) {
    const url = asset(`/fonts/${file}.woff2`)
    const face = new FontFace('IvyMode', `url(${url}) format('woff2')`, {
      style: 'italic',
      weight,
      display: 'swap',
    })
    document.fonts.add(face)
    face.load().catch(() => {})
  }
}

/**
 * Registers the accent italic faces (~115 KB) only when an accent word (`[data-accent]`, rendered by
 * <AlchemyText>) scrolls into view, so they never compete with the first
 * paint. Until then accents render in the regular face.
 */
export function loadAccentFonts(): (() => void) | undefined {
  if (loaded) return
  const accents = document.querySelectorAll('[data-accent]')
  if (!('IntersectionObserver' in window) || accents.length === 0) {
    if (accents.length) registerFaces()
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        registerFaces()
        observer.disconnect()
      }
    },
    { rootMargin: '0px' },
  )
  accents.forEach((el) => observer.observe(el))
  return () => observer.disconnect()
}
