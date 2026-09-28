/*
 * The Home hero's sun pointer, drawn live so it never has a regular shape (see .sun in motion.css
 * for the halo). Everything about it is random and never repeats:
 *   - the white-hot core is a blob whose edge points each drift toward new random radii, and the
 *     whole core wanders slightly off-centre;
 *   - rays of light are born at random angles, lengths, widths and strengths, flare up, fade out and
 *     are replaced by new ones;
 *   - the halo's outline and the sun's size drift toward new random targets.
 * It only animates while the sun is on screen (the pointer is over the hero).
 */

const TAU = Math.PI * 2
const SVG = 'http://www.w3.org/2000/svg'
const CORE_POINTS = 9
const RAY_COUNT = 10

const rand = (min: number, max: number) => min + Math.random() * (max - min)

type Drift = { value: number; target: number; min: number; max: number; rate: number }
/** A value that eases toward a random target, and picks a new one when it gets there. */
const drift = (min: number, max: number): Drift => {
  const value = rand(min, max)
  return { value, target: rand(min, max), min, max, rate: rand(1.5, 4) }
}
const step = (d: Drift, dt: number) => {
  d.value += (d.target - d.value) * Math.min(1, d.rate * dt)
  if (Math.abs(d.target - d.value) < (d.max - d.min) * 0.04) {
    d.target = rand(d.min, d.max)
    d.rate = rand(1.2, 4.5)
  }
  return d.value
}

type Ray = {
  el: SVGPathElement
  angle: number
  inner: number
  length: number
  width: number
  peak: number
  age: number
  life: number
}

/** Closed smooth path through points (Catmull-Rom as cubic Béziers). */
function blobPath(points: [number, number][]) {
  const n = points.length
  let d = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const [x0, y0] = points[(i - 1 + n) % n]
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % n]
    const [x3, y3] = points[(i + 2) % n]
    const c1x = x1 + (x2 - x0) / 6
    const c1y = y1 + (y2 - y0) / 6
    const c2x = x2 - (x3 - x1) / 6
    const c2y = y2 - (y3 - y1) / 6
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`
  }
  return d + 'Z'
}

export type SunAnimation = { play(): void; pause(): void; destroy(): void }

/** Builds the sun's core and rays inside `root` (the .sun element) and animates them. */
export function animateSun(root: HTMLElement): SunAnimation {
  const svg = document.createElementNS(SVG, 'svg')
  svg.setAttribute('viewBox', '-65 -65 130 130')
  svg.setAttribute('aria-hidden', 'true')
  svg.classList.add('sun-art')
  svg.innerHTML = `
    <defs>
      <radialGradient id="sun-core-fill" cx="0.45" cy="0.42" r="0.6">
        <stop offset="0.6" style="stop-color: var(--color-text-white)" />
        <stop offset="0.82" style="stop-color: color-mix(in srgb, var(--color-alchemy-1) 25%, white)" />
        <stop offset="1" style="stop-color: var(--color-alchemy-1)" />
      </radialGradient>
    </defs>
    <g class="sun-rays"></g>
    <path class="sun-core" style="fill: url(#sun-core-fill)" />`
  root.append(svg)
  const raysGroup = svg.querySelector('.sun-rays')!
  const core = svg.querySelector<SVGPathElement>('.sun-core')!

  const radii = Array.from({ length: CORE_POINTS }, () => drift(6.2, 9.8))
  const offsetX = drift(-1.6, 1.6)
  const offsetY = drift(-1.6, 1.6)
  const size = drift(0.94, 1.1)
  const halo = Array.from({ length: 8 }, () => drift(38, 62)) // border-radius %, 8 values

  const tint = (el: SVGPathElement) =>
    (el.style.fill = Math.random() < 0.6 ? 'var(--color-alchemy-1)' : 'var(--color-alchemy-2)')
  const spawn = (ray: Ray, fresh = false) => {
    ray.angle = Math.random() * TAU
    ray.inner = rand(8, 12)
    ray.length = rand(14, 50)
    ray.width = rand(0.7, 2.8)
    ray.peak = rand(0.2, 0.75)
    ray.life = rand(0.7, 2.8)
    ray.age = fresh ? Math.random() * ray.life : 0 // the first set starts at random points in life
  }
  const rays: Ray[] = Array.from({ length: RAY_COUNT }, () => {
    const el = document.createElementNS(SVG, 'path')
    tint(el)
    raysGroup.append(el)
    const ray = { el } as Ray
    spawn(ray, true)
    return ray
  })

  let frame = 0
  let last = 0
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
    last = now

    const cx = step(offsetX, dt)
    const cy = step(offsetY, dt)
    const points = radii.map((d, i): [number, number] => {
      const a = (i / CORE_POINTS) * TAU
      const r = step(d, dt)
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
    })
    core.setAttribute('d', blobPath(points))

    for (const ray of rays) {
      ray.age += dt
      if (ray.age >= ray.life) {
        spawn(ray)
        tint(ray.el)
      }
      const t = ray.age / ray.life
      const strength = ray.peak * Math.sin(Math.PI * t) // flares up, then fades
      const c = Math.cos(ray.angle)
      const s = Math.sin(ray.angle)
      const r0 = ray.inner
      const r1 = ray.inner + ray.length * (0.6 + 0.4 * Math.sin(Math.PI * t))
      const w = ray.width
      // A tapered spike: wide at its base on the core, sharp at its tip.
      ray.el.setAttribute(
        'd',
        `M${(c * r0 - s * w).toFixed(2)},${(s * r0 + c * w).toFixed(2)}` +
          `L${(c * r1).toFixed(2)},${(s * r1).toFixed(2)}` +
          `L${(c * r0 + s * w).toFixed(2)},${(s * r0 - c * w).toFixed(2)}Z`,
      )
      ray.el.setAttribute('opacity', strength.toFixed(3))
    }

    const h = halo.map((d) => step(d, dt).toFixed(1) + '%')
    root.style.borderRadius = `${h[0]} ${h[1]} ${h[2]} ${h[3]} / ${h[4]} ${h[5]} ${h[6]} ${h[7]}`
    root.style.scale = step(size, dt).toFixed(3)
  }

  return {
    play() {
      if (frame) return
      last = 0
      frame = requestAnimationFrame(tick)
    },
    pause() {
      cancelAnimationFrame(frame)
      frame = 0
    },
    destroy() {
      cancelAnimationFrame(frame)
      frame = 0
      svg.remove()
    },
  }
}
