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

/*
 * Home hero — hero-section-design.md, hero-motion-patterns.md. A night-sky card where a murmuration
 * of starlings flies behind "We're a team of builders". In story mode (index.html sets [data-story]
 * when motion is allowed and WebGL exists) the section is 400% of the viewport tall and the card is
 * pinned inside it: 6 screens (headline, 4 services, finale), the one flock easing from loose to
 * gathered as they pass. The mouse over the card lights the birds near it (the orb itself is hidden
 * for now), never moves them. A mouse press or a tap sends a pulse through the flock. In calm mode
 * ([data-calm]: reduced motion asked for)
 * the static card keeps the flock, flying slowly, with no orb, pulse or story. Without WebGL, or if
 * the flock fails, it is the static card alone.
 */

const SCREENS = STAGE_COUNT

const pad = 'px-6 md:px-[clamp(24px,9vw,72px)]'
const bigType =
  'font-display text-text-white text-[36px] leading-10 font-light md:text-[clamp(40px,8.1vw,65px)]'

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
 * §9.2: q (0 … 1 through the pinned range) → s = q × 5. The flock's flight style follows s directly
 * (it eases toward it per frame, so it never snaps); the text shows one whole screen at a time, the
 * nearest one (pickScreen).
 */
function mapScroll(q: number) {
  const s = q * (SCREENS - 1)
  return { s, screen: Math.round(s), stage: s }
}

/*
 * Which screen's text is showing. Scrolling never leaves the card empty or two titles on top of each
 * other: one whole screen is always shown, and passing the midpoint to the next plays a short handoff
 * (motion.css: the old one zooms on and fades, then the new one settles in from a little larger, as
 * if the camera pushed on through the story). It changes a little past the midpoint (HYSTERESIS), so
 * resting right on the midpoint can't flicker between the two.
 */
const HYSTERESIS = 0.08

function pickScreen(s: number, current: number) {
  return Math.abs(s - current) > 0.5 + HYSTERESIS ? Math.round(s) : current
}

/*
 * How quickly the progress bar catches up with the scroll position (ms, exponential), so each
 * mouse-wheel step glides rather than jumps, at any frame rate.
 */
const FOLLOW_MS = 150

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/* ------------------------------------------------------------ eyebrow that fades in */

/** Design-system Eyebrow that fades and settles in each time its screen becomes active. */
function DecodeEyebrow({ text, active }: { text: string; active: boolean }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <div 
        aria-hidden 
        className={cn(
          "transition-all duration-700 ease-out",
          active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        )}
      >
        <Eyebrow>{text}</Eyebrow>
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
  const flockRef = useRef<Murmuration | null>(null)
  const screenRef = useRef(0)
  const pausedRef = useRef(false)
  const mousePressRef = useRef(false) // the current press is a mouse (it pulsed on button down)

  const screensRef = useRef<HTMLDivElement>(null)

  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [screen, setScreen] = useState(0)
  const [progress, setProgress] = useState(0)

  /* Start the flock (story or calm mode). The flock adds its own canvas;
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

    return () => {
      observer.disconnect()
      flock.destroy()
      flockRef.current = null
    }
  }, [story, calm])

  /* Pause freezes everything that moves on its own. */
  useEffect(() => {
    pausedRef.current = paused
    flockRef.current?.setPaused(paused)
    cardRef.current?.toggleAttribute('data-paused', paused)
  }, [paused])

  /* Scroll position → text of every screen, current screen, progress bar and flight style. */
  useEffect(() => {
    if (!story) return
    let frame = 0
    let lastStage = -1
    let shown = -1 // the progress bar's story position (s), easing toward the scroll position
    let lastTime = 0
    /* The pinned range: from where the card first sticks to where it un-pins. */
    const range = () => {
      const wrap = wrapRef.current!
      const card = cardRef.current!
      const top = parseFloat(getComputedStyle(card).top) || 0
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY
      const start = Math.max(0, wrapTop - top)
      return { start, end: wrapTop + wrap.offsetHeight - card.offsetHeight - top }
    }
    const update = (now: number) => {
      frame = 0
      const { start, end } = range()
      const q = end > start ? Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) : 0
      const m = mapScroll(q)
      /* The very first frame lands exactly; after that the bar follows (a fresh start counts as one
         frame, so it never jumps after a pause in scrolling). */
      const dt = lastTime ? Math.min(100, now - lastTime) : 16.7
      shown = shown < 0 ? m.s : shown + (m.s - shown) * (1 - Math.exp(-dt / FOLLOW_MS))
      if (Math.abs(m.s - shown) < 0.0005) shown = m.s
      setProgress(Math.round(shown * 1000) / ((SCREENS - 1) * 1000))
      const next = pickScreen(m.s, screenRef.current)
      if (next !== screenRef.current) {
        screenRef.current = next
        setScreen(next)
      }
      /* The flock answers scrolling down only: scrolling up leaves it exactly as it is (the user's
         rule), and the next scroll down picks up from wherever the story is then (the engine eases). */
      if (m.stage > lastStage) flockRef.current?.setProgress(m.stage)
      lastStage = m.stage
      /* Keep going until the text has caught up with the scroll. */
      if (shown !== m.s) {
        lastTime = now
        frame = requestAnimationFrame(update)
      } else lastTime = 0
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    /* Page Down / Page Up / Space step exactly one screen while the story is pinned (a page-sized
       jump would skip service names); past either end the browser scrolls as usual. Presses during
       the glide count on from the screen already aimed at. Wheel and touch are untouched. */
    let aim = -1
    let aimAt = 0
    const onKey = (event: KeyboardEvent) => {
      const space = event.key === ' '
      const down = event.key === 'PageDown' || (space && !event.shiftKey)
      const up = event.key === 'PageUp' || (space && event.shiftKey)
      if (!(down || up) || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
        return
      const target = event.target as Element
      if (target.closest?.('input, textarea, select, [contenteditable]')) return
      if (space && target.closest?.('button, [role="button"], summary')) return
      const { start, end } = range()
      if (end <= start || window.scrollY < start - 1 || window.scrollY > end + 1) return
      const from =
        performance.now() - aimAt < 800
          ? aim
          : Math.round(mapScroll((window.scrollY - start) / (end - start)).s)
      const next = from + (down ? 1 : -1)
      if (next < 0 || next > SCREENS - 1) return
      event.preventDefault()
      aim = next
      aimAt = performance.now()
      window.scrollTo({ top: start + ((end - start) * next) / (SCREENS - 1), behavior: 'smooth' })
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('keydown', onKey)
    }
  }, [story])

  /* ---------------------------------------------------------- the pointer's light and the pulse */

  /* The mouse over the card lights the birds near it (no orb is drawn for now); touch and pen don't. */
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!story || event.pointerType !== 'mouse') return
    const rect = cardRef.current!.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    flockRef.current?.setPointer((x / rect.width) * 2 - 1, 1 - (y / rect.height) * 2)
  }
  const onPointerLeave = () => flockRef.current?.clearPointer()

  /* A press on the sky (not a link or button) sends a pulse through the flock; nothing while paused.
     No hint is offered for this — it's there to be found, not announced. A mouse pulses on button
     down and releasing it does nothing; touch and pen pulse on the tap (click), so a swipe to scroll
     never sends one. */
  const pulse = (target: EventTarget, clientX: number, clientY: number) => {
    if (!story || pausedRef.current || (target as Element).closest('a, button')) return
    flockRef.current?.burst(clientX, clientY)
  }
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    mousePressRef.current = event.pointerType === 'mouse'
    if (mousePressRef.current && event.button === 0) pulse(event.target, event.clientX, event.clientY)
  }
  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (!mousePressRef.current) pulse(event.target, event.clientX, event.clientY)
  }

  /* Glide past the whole story to the next section ("Why we exist"). */
  const skipIntro = () => {
    const wrap = wrapRef.current!
    const card = cardRef.current!
    const next = wrap.nextElementSibling?.querySelector('section') ?? wrap.nextElementSibling
    /* "Why we exist" waits (sticky) under the pinned card until the story ends (motion.css), so: scroll
       the rest of the story, then on until that section is 96px from the top. */
    const storyLeft = Math.max(0, wrap.getBoundingClientRect().bottom - card.getBoundingClientRect().bottom)
    const top = next
      ? window.scrollY + storyLeft + next.getBoundingClientRect().top - 96
      : wrap.offsetTop + wrap.offsetHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  /* ---------------------------------------------------------- screens */

  /* The current screen is 'active'; the others wait on the side they'll come from ('passed' ones
     have zoomed on, the rest are still a little larger), so a handoff always zooms the same way. */
  const screenProps = (i: number) => ({
    'data-state': i === screen ? 'active' : i < screen ? 'passed' : undefined,
    inert: i !== screen,
    className: 'hero-screen flex flex-col items-start gap-6 [grid-area:1/1] md:gap-7',
  })

  return (
    /* Story mode starts already pinned, just below the header (never under it; see motion.css). */
    <div ref={wrapRef} className="hero-wrap">
      <section
        ref={cardRef}
        aria-label="Introduction"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onClick={onClick}
        className="hero-card from-sky-top to-sky-bottom border-stroke-light relative h-[634px] overflow-clip rounded-[24px] border bg-linear-to-b md:h-[772px]"
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
                className="hero-fade-up text-body-lg text-text-light -mt-2 max-w-[520px] font-sans font-normal md:-mt-3"
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

        {/* The story's own controls, bottom-left under the text: Skip intro, then progress through the
            story. Skip is laid out from the start (invisible until the flock is up) so nothing shifts.
            On desktop the bar waits for the second screen, leaving the "Scroll" cue as the first
            screen's only prompt. (A wrapper positions them: the indicator itself is `relative`.) */}
        <div className="hero-story-only absolute bottom-5 left-6 flex items-center gap-5 md:bottom-9 md:left-[clamp(24px,9vw,72px)]">
          <button
            type="button"
            onClick={skipIntro}
            className={cn(
              'tap-target text-text-ultra-light font-sans text-[14px] transition-colors hover:text-white',
              !ready && 'invisible',
            )}
          >
            {hero.controls.skip}
          </button>
          <ProgressIndicator
            progress={progress}
            className={cn('transition-opacity duration-500', screen === 0 && 'lg:opacity-0')}
          />
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

        {/* Pause/Play (story and calm), once the flock has started: on its own, bottom-right, quiet
            (no ring until hover) but always readable; tap-target keeps its hit area 44px. */}
        {ready && (
          <div className="hero-motion-only absolute right-6 bottom-3 md:right-[clamp(24px,9vw,72px)] md:bottom-7">
            <button
              type="button"
              aria-pressed={paused}
              aria-label={paused ? hero.controls.play : hero.controls.pause}
              onClick={() => setPaused((value) => !value)}
              className="tap-target flex size-9 items-center justify-center rounded-full border border-transparent text-white/70 transition-colors hover:border-white/60 hover:bg-white/5 hover:text-white"
            >
              <PauseIcon paused={paused} />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
