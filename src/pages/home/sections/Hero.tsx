import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Icon } from '@/components/ui/Icon'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { hero, whatWeOffer } from '@/data/home'
import { cn } from '@/lib/cn'
import { createMurmuration, STAGE_COUNT, type Murmuration } from '@/lib/murmuration'
import { Link } from '@/lib/router'
import { animateSun, type SunAnimation } from '@/lib/sun'

/*
 * Home hero — hero-section-design.md, hero-motion-patterns.md. A night-sky card where a murmuration
 * of starlings flies behind "We're a team of builders". In story mode (index.html sets [data-story]
 * when motion is allowed and WebGL exists) the section is 400% of the viewport tall and the card is
 * pinned inside it: 6 screens (headline, 4 services, finale), the one flock easing from loose to
 * gathered as they pass. The orb (lib/sun draws it) is the mouse cursor over the card; it only ever
 * lights the flock, never moves it. A click or tap sends a pulse through the flock. In calm mode
 * ([data-calm]: reduced motion asked for)
 * the static card keeps the flock, flying slowly, with no orb, pulse or story. Without WebGL, or if
 * the flock fails, it is the static card alone.
 */

const SCREENS = STAGE_COUNT

const pad = 'px-6 md:px-[clamp(24px,9vw,72px)]'
const bigType =
  'font-display text-text-white text-[28px] leading-8 font-light md:text-[clamp(40px,8.1vw,65px)]'

/* ------------------------------------------------------------ motion flags */

type Motion = 'story' | 'calm' | 'none'

const subscribeMotion = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-story', 'data-calm'],
  })
  return () => observer.disconnect()
}
const readMotion = (): Motion => {
  const root = document.documentElement
  return root.hasAttribute('data-story') ? 'story' : root.hasAttribute('data-calm') ? 'calm' : 'none'
}
const leaveMotion = () => {
  document.documentElement.removeAttribute('data-story')
  document.documentElement.removeAttribute('data-calm')
}

/* ------------------------------------------------------------ scroll → screen + flight style */

/**
 * §9.2: q (0 … 1 through the pinned range) → s = q × 5. The story is continuous: the flock's flight
 * style follows s directly (it eases toward it per frame, so it never snaps), and each screen's text
 * is scrubbed by its distance from s (textStyle). The current screen (links, eyebrow, inert) is the
 * nearest one.
 */
function mapScroll(q: number) {
  const s = q * (SCREENS - 1)
  return { s, screen: Math.round(s), stage: s }
}

/*
 * A screen's text at distance d = s − i from the scroll position: fully shown while |d| ≤ 0.2, then
 * fading out. It zooms, not slides: a screen approaching (d < 0) starts a little larger and settles to
 * its true size as it arrives; once passed (d > 0) it keeps shrinking slightly as it fades, as if the
 * camera were pushing on through the story. The first screen is fully shown and at its true size at
 * the very top, and the last at the very end.
 *
 * Not every screen carries the same weight: the headline (arrival) and the invitation (return) are the
 * story's two emotional beats, so they get the full, slower zoom; the four service names in between
 * are information, not drama, so they resolve sooner and barely zoom at all — one bold gesture, held
 * at the ends, rather than the same flourish repeated six times.
 */
const HOLD = 0.2

function textStyle(d: number, first: boolean, last: boolean) {
  const bold = first || last
  const zoom = bold ? 0.12 : 0.045
  const fade = bold ? 0.56 : 0.46
  const edge = (first && d < 0) || (last && d > 0) ? 0 : Math.abs(d)
  const t = Math.min(1, Math.max(0, (edge - HOLD) / (fade - HOLD)))
  const eased = t * t * (3 - 2 * t)
  return { opacity: 1 - eased, scale: 1 + (d < 0 ? zoom : -zoom) * eased }
}

/* Where the sun gives way to the normal cursor: text, links and buttons in the card. */
const SUN_YIELDS_TO = 'a, button, h1, h2, p, [role="button"]'

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/* ------------------------------------------------------------ eyebrow that decodes */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+'

/** Design-system Eyebrow whose letters decode from random glyphs, left to right, each time it appears. */
function DecodeEyebrow({ text, active }: { text: string; active: boolean }) {
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (!active || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 700)
      const revealed = Math.floor(t * text.length)
      setShown(
        [...text]
          .map((c, i) =>
            i < revealed || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      )
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, text])

  return (
    <>
      <span className="sr-only">{text}</span>
      <div aria-hidden>
        <Eyebrow>{shown}</Eyebrow>
      </div>
    </>
  )
}

/* ------------------------------------------------------------ icons */

function PauseIcon({ paused }: { paused: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 fill-current">
      {paused ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />}
    </svg>
  )
}

/** A service name whose last word and arrow never wrap apart. */
function ServiceTitle({ title }: { title: string }) {
  const cut = title.lastIndexOf(' ')
  return (
    <>
      {cut > 0 && title.slice(0, cut + 1)}
      <span className="whitespace-nowrap">
        {title.slice(cut + 1)}{' '}
        <Icon
          name="arrow"
          size={32}
          className="inline-block align-middle transition-transform duration-300 group-hover:translate-x-1 max-md:scale-75"
        />
      </span>
    </>
  )
}

/* ------------------------------------------------------------ hero */

export function Hero() {
  const motion = useSyncExternalStore(subscribeMotion, readMotion, (): Motion => 'none')
  const story = motion === 'story'
  const calm = motion === 'calm'
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const sunArtRef = useRef<HTMLDivElement>(null)
  const flockRef = useRef<Murmuration | null>(null)
  const sunAnimRef = useRef<SunAnimation | null>(null)
  const screenRef = useRef(0)
  const pausedRef = useRef(false)

  const screensRef = useRef<HTMLDivElement>(null)

  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [screen, setScreen] = useState(0)
  const [progress, setProgress] = useState(0)

  /* Start the flock (story or calm mode) and, in story mode, the orb. The flock adds its own canvas;
     it stops while the hero is off screen, the tab is hidden or Pause is pressed. */
  useEffect(() => {
    if (!story && !calm) return
    const flock = createMurmuration({
      container: hostRef.current!,
      colors: [token('--color-alchemy-1'), token('--color-alchemy-2')],
      glow: 1.6,
      layout: 'hero',
      /* Calm mode holds one mood, part-way gathered, so the slow flock still reads as one body. */
      calm,
      stage: calm ? 3 : undefined,
      onReady: () => setReady(true),
      /* No WebGL in the worker, or it failed: fall back to the static card. */
      onError: leaveMotion,
    })
    if (!flock) return leaveMotion()
    flockRef.current = flock
    flock.setPaused(pausedRef.current)

    /* Render only while the hero is on screen. */
    const observer = new IntersectionObserver(([entry]) => flock.setActive(entry.isIntersecting))
    observer.observe(cardRef.current!)

    const sun = story ? animateSun(sunArtRef.current!) : null
    sunAnimRef.current = sun

    return () => {
      observer.disconnect()
      flock.destroy()
      sun?.destroy()
      flockRef.current = null
      sunAnimRef.current = null
    }
  }, [story, calm])

  /* Pause freezes everything that moves on its own: the flock and the orb's breathing. */
  useEffect(() => {
    pausedRef.current = paused
    flockRef.current?.setPaused(paused)
    if (paused) sunAnimRef.current?.pause()
    else if (sunRef.current?.hasAttribute('data-on')) sunAnimRef.current?.play()
    cardRef.current?.toggleAttribute('data-paused', paused)
  }, [paused])

  /* Scroll position → text of every screen, current screen, progress bar and flight style. */
  useEffect(() => {
    if (!story) return
    let frame = 0
    const update = () => {
      frame = 0
      const wrap = wrapRef.current!
      const card = cardRef.current!
      /* The pinned range: from where the card first sticks to where it un-pins. */
      const top = parseFloat(getComputedStyle(card).top) || 0
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY
      const start = Math.max(0, wrapTop - top)
      const end = wrapTop + wrap.offsetHeight - card.offsetHeight - top
      const q = end > start ? Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) : 0
      const m = mapScroll(q)
      setProgress(q)
      /* Written straight to the elements (custom properties), so scrolling never re-renders React. */
      const screens = screensRef.current?.children ?? []
      for (let i = 0; i < screens.length; i++) {
        const { opacity, scale } = textStyle(m.s - i, i === 0, i === screens.length - 1)
        const el = screens[i] as HTMLElement
        el.style.setProperty('--screen-o', opacity.toFixed(3))
        el.style.setProperty('--screen-scale', scale.toFixed(3))
      }
      if (m.screen !== screenRef.current) {
        screenRef.current = m.screen
        setScreen(m.screen)
      }
      flockRef.current?.setProgress(m.stage)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [story])

  /* ---------------------------------------------------------- the orb and its pulse */

  /* The mouse has left the card: the orb fades where it was, and its light fades from the flock. */
  const hideSun = () => {
    sunRef.current?.removeAttribute('data-on')
    sunRef.current?.removeAttribute('data-over')
    cardRef.current?.removeAttribute('data-sun')
    cardRef.current?.removeAttribute('data-over')
    sunAnimRef.current?.pause()
    flockRef.current?.clearPointer()
  }

  /*
   * The orb is the cursor: over the card it follows the mouse exactly and never moves on its own (touch
   * and pen get no orb). It fades in where the pointer is, so it never jumps in from elsewhere. Over
   * text, links and buttons it shrinks into the pointer and the normal cursor takes over (a hand on
   * links, the text cursor on copy), so everything there reads and clicks as usual.
   */
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!story || event.pointerType !== 'mouse') return
    const card = cardRef.current!
    const rect = card.getBoundingClientRect()
    const sun = sunRef.current!
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    sun.style.transform = `translate(${x}px, ${y}px)`
    const over = !!(event.target as Element).closest(SUN_YIELDS_TO)
    sun.toggleAttribute('data-over', over)
    card.toggleAttribute('data-over', over)
    if (!sun.hasAttribute('data-on')) {
      sun.setAttribute('data-on', '')
      card.setAttribute('data-sun', '')
      if (!pausedRef.current) sunAnimRef.current?.play()
    }
    flockRef.current?.setPointer((x / rect.width) * 2 - 1, 1 - (y / rect.height) * 2)
  }

  /* A click or tap on the sky (not a link or button) sends a pulse through the flock; nothing while
     paused. No hint is offered for this — it's there to be found, not announced. */
  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (!story || pausedRef.current || (event.target as Element).closest('a, button')) return
    flockRef.current?.burst(event.clientX, event.clientY)
  }

  /* Glide past the whole story to the next section ("Why we exist"). */
  const skipIntro = () => {
    const wrap = wrapRef.current!
    const next = wrap.nextElementSibling as HTMLElement | null
    const top = next
      ? next.getBoundingClientRect().top + window.scrollY - 96
      : wrap.offsetTop + wrap.offsetHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  /* ---------------------------------------------------------- screens */

  const screenProps = (i: number) => ({
    'data-state': i === screen ? 'active' : undefined,
    inert: i !== screen,
    className: 'hero-screen flex flex-col items-start gap-6 [grid-area:1/1] md:gap-7',
  })

  return (
    /* Story mode starts already pinned: pulled up under the floating header (header + gap). */
    <div ref={wrapRef} className="hero-wrap story:-mt-[110px]">
      <section
        ref={cardRef}
        aria-label="Introduction"
        onPointerMove={onPointerMove}
        onPointerLeave={hideSun}
        onClick={onClick}
        className="hero-card from-sky-top to-sky-bottom relative h-[634px] overflow-clip rounded-[24px] bg-linear-to-b md:h-[772px]"
      >
        {/* A faint warm ambient glow behind the flock, so the sky never reads as a cold void — even
            in the gap before the flock fades in. A little brighter on the headline and the invitation,
            the story's two warm, human beats. */}
        <div
          aria-hidden
          className={cn(
            'hero-story-only pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_25%_65%,rgb(206_82_29/0.16),transparent_70%)] transition-opacity duration-[1200ms]',
            screen === 0 || screen === SCREENS - 1 ? 'opacity-100' : 'opacity-60',
          )}
        />

        {/* The flock (its canvas is added on the client), fading in once its first frame is drawn. */}
        <div
          ref={hostRef}
          aria-hidden
          className={cn(
            'hero-motion-only pointer-events-none absolute inset-0 transition-opacity duration-[1500ms]',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Contrast scrim between the flock and the text. */}
        <div
          aria-hidden
          className="hero-motion-only pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(16_16_16/0.9),transparent_60%)] lg:bg-[radial-gradient(55%_60%_at_16%_52%,rgb(16_16_16/0.85),transparent_72%)]"
        />

        <div
          className={cn(
            'story:max-lg:justify-end story:max-lg:pb-24 absolute inset-0 flex flex-col justify-center',
            pad,
          )}
        >
          <div ref={screensRef} className="grid">
            {/* 1 — headline */}
            <div {...screenProps(0)} data-first>
              <h1 className={cn(bigType, 'md:leading-[1.32]')}>
                {hero.titleLines.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && ' '}
                    <span className="hero-rise inline-block md:block">{line}</span>
                  </Fragment>
                ))}
              </h1>
              <p
                className="hero-fade-up text-body-lg text-text-light -mt-2 max-w-[520px] font-sans font-medium md:-mt-3"
                style={{ animationDelay: '350ms' }}
              >
                {hero.subheadline}
              </p>
              <div
                className="hero-fade-up flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4"
                style={{ animationDelay: '500ms' }}
              >
                {hero.actions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.variant}
                    size="responsive"
                    href={action.href}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 2–5 — services */}
            {whatWeOffer.services.map((service, index) => (
              <div key={service.href} {...screenProps(index + 1)}>
                <DecodeEyebrow text={hero.serviceEyebrow} active={screen === index + 1} />
                <h2 className={cn(bigType, 'max-w-[640px] md:leading-[1.2]')}>
                  <Link to={service.href} className="group">
                    <ServiceTitle title={service.title} />
                  </Link>
                </h2>
              </div>
            ))}

            {/* 6 — invitation */}
            <div {...screenProps(SCREENS - 1)}>
              <p className={cn(bigType, 'max-w-[560px] md:leading-[1.2]')}>
                {hero.finale.headline}
              </p>
              <Button href={hero.finale.action.href} size="responsive">
                {hero.finale.action.label}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress through the story. */}
        {/* (Positioned by a wrapper: the indicator itself is `relative`.) */}
        <div className="hero-story-only absolute bottom-6 left-6 md:bottom-10 md:left-[clamp(24px,9vw,72px)]">
          <ProgressIndicator progress={progress} />
        </div>

        {/* "Scroll" cue — desktop, first screen, once the flock has started. */}
        <div
          aria-hidden
          className={cn(
            'scroll-cue hero-story-only pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-sans lg:flex',
            ready && screen === 0 ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span>{hero.controls.scroll}</span>
          <span className="scroll-cue-track" />
        </div>

        {/* Skip intro (story only) + Pause/Play (story and calm), once the flock has started. */}
        {ready && (
          <div className="hero-motion-only absolute right-6 bottom-3 flex items-center gap-4 md:right-[clamp(24px,9vw,72px)] md:bottom-7">
            {story && (
              <button
                type="button"
                onClick={skipIntro}
                className="tap-target text-text-ultra-light font-sans text-[14px] transition-colors hover:text-white"
              >
                {hero.controls.skip}
              </button>
            )}
            <button
              type="button"
              aria-pressed={paused}
              aria-label={paused ? hero.controls.play : hero.controls.pause}
              onClick={() => setPaused((value) => !value)}
              className="border-stroke-dark flex size-11 items-center justify-center rounded-full border text-white transition-colors hover:border-white hover:bg-white/5"
            >
              <PauseIcon paused={paused} />
            </button>
          </div>
        )}

        {/* The orb: the mouse cursor over the card (above the flock, ignores the pointer itself). The
            halo reaches far and very faintly; lib/sun draws the core into .sun/.sun-art. */}
        <div ref={sunRef} aria-hidden className="hero-sun hero-story-only">
          <div className="sun-halo" />
          <div ref={sunArtRef} className="sun" />
        </div>
      </section>
    </div>
  )
}
