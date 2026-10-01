/*
 * Starling murmuration (after "Flight of the Starlings", Jan van IJken / National Geographic), built
 * around Alvyl's own idea: Alchemy Village. Four parts, and nothing else:
 *   1. The flock — the village. One body of thousands of individuals, each with its own place and its
 *      own small wandering, together tracing one wandering course across the whole card. Its outline
 *      is never a clean shape. Scrolling the pinned Home hero tells its story: loose and scattered at
 *      the headline, one close-knit body by the finale (LOOSE → GATHERED).
 *   2. The orb — the alchemy. The visitor's cursor, as a quiet point of energy (drawn by lib/sun; its
 *      position arrives here through setPointer / clearPointer). It never moves a bird.
 *   3. Influence — the synergy. Near the orb, birds deepen toward red and stray less from their place:
 *      the energy doesn't steer anyone, it helps them move as one.
 *   4. The pulse — the village answering. A tap sends a soft wave out; birds lean toward its source
 *      together as it passes, then ease back.
 *
 * Fully procedural in the vertex shader (one draw call, no library, no per-frame CPU work beyond a few
 * uniforms): each bird has a fixed home in the flock's body (along / radius / angle), and the body is
 * laid along the leader's recent path, so every turn of the leader sweeps through the flock as a wave.
 */

/** The flock's two moods, eased between by scroll progress: [lag, width, rough, speed]. Both span
    the card: the story is the flock drawing together, not shrinking away. */
const LOOSE = [26, 0.56, 0.5, 0.8] as const // the headline: individuals, loose and scattered
const GATHERED = [18, 0.42, 0.08, 0.6] as const // the finale: one close-knit body, the village

export const STAGE_COUNT = 6

type Options = {
  /** The flock adds its own canvas here, filling it. */
  container: HTMLElement
  /** The first frame is on screen (fade the flock in now). */
  onReady?: () => void
  /** WebGL turned out to be unavailable in the worker (keep the static card). */
  onError?: () => void
  /** [alchemy-1, alchemy-2] as CSS colours (read from the design tokens). */
  colors: [string, string]
  /** 'hero': beside/above the Home headline. 'center': centred in its panel (service pages). */
  layout?: 'hero' | 'center'
  /** Hold this mood (0 … STAGE_COUNT - 1) instead of following setProgress. */
  stage?: number
  /** Draw solid birds in this CSS colour over a light sky, instead of glowing Alchemy on dark. */
  ink?: string
  /** Brightness of the glowing birds (default 1); the Home story, whose card they light, uses more. */
  glow?: number
  /** Visitors who asked for reduced motion: the same flock, flying at a third of the pace. */
  calm?: boolean
}

export type Murmuration = {
  /** Continuous story position, 0 … STAGE_COUNT - 1. The flock's mood eases toward it. */
  setProgress(progress: number): void
  /** Pauses rendering while off screen. */
  setActive(active: boolean): void
  /** The visitor's pause control (WCAG 2.2.2): freezes the flock where it is. */
  setPaused(paused: boolean): void
  /** Sends a soft pulse through the flock from this point (a tap or click). */
  burst(clientX: number, clientY: number): void
  /** Where the orb (the cursor) is, −1 … 1 across the canvas. The only way the flock learns of it. */
  setPointer(x: number, y: number): void
  /** The orb has gone (the cursor left the card): its light fades from the flock. */
  clearPointer(): void
  destroy(): void
}

const VERTEX = /* glsl */ `
attribute vec4 aSeed; // along (0 head … 1 tail), radius, angle, rank (0 … 1, unique per bird)

uniform float uTime;        // the flock's own clock, for wingbeats (never jumps, slows when calm)
uniform float uFlight;      // the flock's clock along its course (advances at the mood's speed)
uniform float uLag;         // body length, in seconds of the leader's course
uniform float uWidth;       // body radius
uniform float uRough;       // how far each bird strays from its home: far when loose, little together
uniform float uKeep;        // share of birds drawn (the frame-rate guard lowers it, fading, not cutting)
uniform float uScale;
uniform vec2 uOffset;
uniform vec2 uMouse;        // the orb, world units on the z = 0 plane
uniform float uMouseStrength;
uniform vec2 uBurst[3];     // the last three taps (world units)…
uniform float uBurstAge[3]; // …and seconds since each, so a new tap never cuts an earlier one off
uniform float uBurstSize;   // the card's size relative to a desktop card (the pulse scales with it)
uniform float uAspect;
uniform float uFocal;
uniform float uPointSize;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorInk;
uniform float uInk;         // 1: solid ink birds on a light sky
uniform float uGlow;        // brightness of the glowing birds

varying vec3 vColor;
varying float vAlpha;
varying vec2 vHead;  // the bird's "up" on screen (point-sprite space, y down)
varying float vFlap; // wingbeat, -1 … 1

const float CAMERA_Z = 10.0;

// Decorrelated per-bird randomness (neighbouring seeds must not line up into curves).
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

// Smooth random value noise over a plane (for shapes that must look random, not patterned).
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), u.x),
             mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x), u.y);
}

// The flock's own course (object units, x ±1.15, y ±0.5, z ±0.6): five slow sines whose periods
// never line up, sweeping the one body across the whole card. It answers to nothing — not the
// scroll, not the orb — so the village always has a life of its own. Where the course slows into a
// turn the body bunches up, and where it speeds up the body thins: density waves, for free.
vec3 leader(float t) {
  return vec3(
    sin(t * 0.23) * 0.85 + sin(t * 0.37 + 1.3) * 0.3,
    sin(t * 0.29 + 0.7) * 0.36 + sin(t * 0.53) * 0.14,
    sin(t * 0.19 + 2.1) * 0.6
  );
}

void main() {
  float along = aSeed.x;
  float radius = aSeed.y;
  float angle = aSeed.z * 6.2831853;
  float rank = aSeed.w;
  float t = uFlight;

  // 1 · The flock. Each bird's home: where the course was "its place × body length" ago, set out
  // from the centre line in a soft, round volume (never a flat sheet). The volume's outline is pushed
  // in and out by slow noise at two scales, so it bulges, thins and frays unevenly as it flies.
  float tp = t - along * uLag;
  vec3 c = leader(tp);
  vec3 T = normalize(leader(tp + 0.05) - c);
  vec3 N = normalize(cross(T, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 0.0, 1e-4));
  vec3 B = cross(N, T);
  vec2 dir = vec2(cos(angle), sin(angle));
  float taper = 0.35 + 0.65 * pow(sin(3.14159 * along), 0.6);
  float lump = 0.25 + 1.05 * noise2(dir * 1.3 + vec2(along * 3.0 - t * 0.06, t * 0.05))
                    + 0.35 * noise2(dir * 3.1 + vec2(along * 6.0, -t * 0.11));
  float reach = radius * uWidth * taper * lump;
  vec3 pos = c + N * (dir.x * reach) + B * (dir.y * reach * 0.7);

  // 3 · Influence, part one: how close this bird's home is to the orb.
  vec2 home = pos.xy * uScale + uOffset;
  vec2 toOrbHome = home - uMouse;
  float unison = exp(-dot(toOrbHome, toOrbHome) / 1.2) * uMouseStrength;

  // Each bird strays from its home on its own slow course — far while the flock is loose, barely once
  // it has gathered, and less near the orb, where the flock moves as one.
  vec3 stray = vec3(
    noise2(vec2(hash(rank + 21.0) * 50.0, t * 0.09)),
    noise2(vec2(hash(rank + 22.0) * 50.0, t * 0.07)),
    noise2(vec2(hash(rank + 23.0) * 50.0, t * 0.05))
  ) - 0.5;
  pos += stray * uRough * (1.0 - unison * 0.6);

  pos = pos * uScale + vec3(uOffset, 0.0);

  // 4 · The pulse: each tap's soft wave reaches near birds first; they lean toward its source together
  // as it passes, then ease back as it fades.
  float pulse = 0.0;
  vec2 lean = vec2(0.0);
  for (int i = 0; i < 3; i++) {
    vec2 fromTap = pos.xy - uBurst[i];
    float pd = length(fromTap) / uBurstSize; // desktop-card units, so a tap feels the same on a phone
    float pa = max(uBurstAge[i] - pd / 8.0, 0.0) / 0.55;
    float p = pa * exp(1.0 - pa) * exp(-pd * pd / 18.0);
    pulse += p;
    lean -= normalize(fromTap + 1e-4) * p;
  }
  float answer = 0.6 + 0.8 * hash(rank + 11.0); // each bird answers in its own measure
  pos.xy += lean * answer * 0.16;

  // 3 · Influence, part two: birds nearest the orb (or caught in a pulse) carry a little of its light,
  // each a little differently.
  vec2 toOrb = pos.xy - uMouse;
  float nerve = 0.5 + hash(rank + 14.0);
  float lit = (exp(-dot(toOrb, toOrb) / (0.5 * nerve)) * uMouseStrength + pulse * answer * 0.6)
    * (1.0 - uInk);

  float dist = CAMERA_Z - pos.z;
  gl_Position = vec4(pos.x * uFocal / uAspect, pos.y * uFocal, 0.0, dist);
  gl_PointSize = uPointSize * (0.6 + hash(rank + 7.0) * 0.8) * (CAMERA_Z / dist);

  // The Alchemy gradient across the screen (Alchemy 1 top left, Alchemy 2 bottom right). Near the orb
  // a bird deepens toward red, never toward anything paler: orange and red only, everywhere.
  vec2 screen = pos.xy * uFocal / dist;
  float tint = clamp(0.5 + (screen.x / uAspect - screen.y) * 0.35, 0.0, 1.0);
  vec3 hue = mix(uColorA, uColorB, tint);
  vColor = mix(mix(hue, uColorB, lit * 0.7), uColorInk, uInk);

  // Seen from below, wings spread across the view, banking a little as the flock turns.
  vHead = normalize(vec2(T.x * 0.45, -1.0));
  vFlap = sin(uTime * (8.0 + hash(rank + 8.0) * 5.0) + hash(rank + 9.0) * 6.2831853);

  // Far birds sink into the dark (down to 15% of a near bird). Each bird's light is capped, so where
  // many overlap and their light adds up, a dense spot becomes a richer red, never a wash of white.
  float nearness = smoothstep(-1.4, 1.0, pos.z / uScale);
  float kept = 1.0 - smoothstep(uKeep - 0.05, uKeep, rank);
  vAlpha = min(mix(0.075, 0.5, nearness) * (1.0 + uInk * 0.5) * uGlow * (1.0 + lit * 0.5), 0.85) * kept;
}
`

// A tiny bird silhouette: two tapered, swept-back wings and a small body, flapping.
const FRAGMENT = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
varying vec2 vHead;
varying float vFlap;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float x = dot(p, vec2(-vHead.y, vHead.x)); // along the wings
  float y = dot(p, vHead);                   // along the body, forward positive
  float u = min(abs(x) / 0.46, 1.0);
  float wingLine = (-0.2 * u + vFlap * 0.17) * u;
  float thick = mix(0.09, 0.02, u);
  float wing = (1.0 - smoothstep(thick * 0.5, thick, abs(y - wingLine))) * step(abs(x), 0.46);
  float body = 1.0 - smoothstep(0.05, 0.09, length(vec2(x * 1.8, y - 0.03)));
  float a = max(wing, body) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor * a, a);
}
`

/** Deterministic PRNG, so the flock is the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed')
  }
  return shader
}

type Rgb = [number, number, number]

function toRgb(color: string): Rgb {
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.fillStyle = color
  const hex = ctx.fillStyle.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as Rgb
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Everything the renderer needs, as plain data: it usually runs in a worker, without the DOM. */
export type FlockConfig = {
  colors: [Rgb, Rgb]
  ink?: Rgb
  glow: number
  layout: 'hero' | 'center'
  stage?: number
  calm: boolean
  /** Phone/tablet: fewer birds, lower resolution. */
  small: boolean
}

/** What the page tells the renderer (sizes, orb, scroll), since a worker can't see the page. */
export type FlockCommand =
  | { type: 'resize'; width: number; height: number; dpr: number; wide: boolean }
  | { type: 'pointer'; x: number; y: number } // −1 … 1 across the canvas
  | { type: 'pointerleave' }
  | { type: 'burst'; x: number; y: number } // −1 … 1 across the canvas
  | { type: 'progress'; value: number }
  | { type: 'run'; run: boolean }
  | { type: 'destroy' }

const PULSES = 3

/**
 * Draws the flock into a canvas it owns (an OffscreenCanvas in lib/murmuration.worker, or the
 * page's canvas where workers can't draw). Returns null when WebGL is unavailable.
 */
export function createFlockRenderer(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  { colors, ink, glow, layout, stage, calm, small }: FlockConfig,
  onFirstFrame: () => void,
): ((command: FlockCommand) => void) | null {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: true,
    premultipliedAlpha: true,
  }) as WebGLRenderingContext | null
  if (!gl) return null
  // Workers have requestAnimationFrame in Chromium and Firefox; a timer elsewhere.
  const raf: (cb: (now: number) => void) => number =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number
  const cancelRaf: (id: number) => void =
    typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout

  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  // Fewer birds on phones and low-core machines, so it starts at frame rate; the guard in render()
  // thins the flock further, gradually, if frames still run long.
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 4
  const count = Math.round((small ? 5000 : 10000) * (lowEnd ? 0.5 : 1))
  const rand = mulberry32(3)
  const seeds = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    // Denser toward the middle of the body and its centre line, like a real flock. Rank follows the
    // order, so drawing the first n birds is an even thinning of the whole flock.
    const along = 0.5 + (rand() - 0.5) * (0.6 + 0.4 * rand())
    const radius = Math.abs(rand() - 0.5) * (1 + rand())
    seeds.set([along, radius, rand(), (i + 0.5) / count], i * 4)
  }
  const buffer = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'aSeed')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0)

  const u = (name: string) => gl.getUniformLocation(program, name)
  const uniforms = {
    time: u('uTime'),
    flight: u('uFlight'),
    lag: u('uLag'),
    width: u('uWidth'),
    rough: u('uRough'),
    keep: u('uKeep'),
    scale: u('uScale'),
    offset: u('uOffset'),
    mouse: u('uMouse'),
    mouseStrength: u('uMouseStrength'),
    burst: u('uBurst'),
    burstAge: u('uBurstAge'),
    burstSize: u('uBurstSize'),
    aspect: u('uAspect'),
    focal: u('uFocal'),
    pointSize: u('uPointSize'),
  }
  gl.uniform3fv(u('uColorA'), colors[0])
  gl.uniform3fv(u('uColorB'), colors[1])
  if (ink) gl.uniform3fv(u('uColorInk'), ink)
  gl.uniform1f(u('uInk'), ink ? 1 : 0)
  gl.uniform1f(u('uGlow'), glow)
  gl.enable(gl.BLEND)
  if (ink)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // ink: where the flock is dense, it darkens
  else gl.blendFunc(gl.ONE, gl.ONE) // additive: where the flock is dense, it glows
  gl.disable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  const FOV = (35 * Math.PI) / 180
  const focal = 1 / Math.tan(FOV / 2)
  const view = { halfW: 1, halfH: 1 }
  const pace = calm ? 0.3 : 1

  const state = {
    target: stage ?? 0,
    progress: stage ?? 0,
    flight: 20, // start mid-flight, not at the course's origin
    clock: 0,
    scale: 1,
    scaleTarget: 1,
    offset: [0, 0] as [number, number],
    offsetTarget: [0, 0] as [number, number],
    mouse: [0, 0] as [number, number],
    mouseTarget: [0, 0] as [number, number],
    strength: 0,
    strengthTarget: 0,
    bursts: new Float32Array(PULSES * 2),
    burstAt: Array<number>(PULSES).fill(-1e4), // seconds (performance.now clock); long ago = none
    nextBurst: 0,
    // The frame-rate guard: a running average of frame time, and how much of the flock to draw.
    frameAvg: 1 / 60,
    watched: 0,
    lastCut: 0,
    keep: 1.05,
    keepTarget: 1.05,

    running: false,
    sized: false,
    firstFrame: true,
    frame: 0,
    last: performance.now(),
  }
  const ages = new Float32Array(PULSES)

  function resize(w: number, h: number, deviceDpr: number, wide: boolean) {
    const dpr = Math.min(deviceDpr || 1, small ? 1.5 : 2)
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    gl!.viewport(0, 0, canvas.width, canvas.height)
    view.halfH = 10 / focal // half the visible height at z = 0 (camera at z = 10)
    view.halfW = view.halfH * (w / Math.max(1, h))
    if (layout === 'center') {
      state.scaleTarget = Math.min(view.halfW * 0.85, view.halfH * 1.4)
      state.offsetTarget = [0, 0]
    } else if (wide) {
      // Desktop: the flock covers the card edge to edge, behind the headline.
      state.scaleTarget = Math.min(view.halfW * 0.78, view.halfH * 1.5)
      state.offsetTarget = [0, 0]
    } else {
      // Tablet/phone: covers the card, weighted toward the space above the headline.
      state.scaleTarget = Math.min(view.halfW * 1.0, view.halfH * 0.8)
      state.offsetTarget = [0, view.halfH * 0.2]
    }
    // The first size is taken as is; later ones (a resize, a phone turning) ease in, never snap.
    if (!state.sized) {
      state.scale = state.scaleTarget
      state.offset = [...state.offsetTarget]
    }
    gl!.uniform1f(uniforms.aspect, w / Math.max(1, h))
    gl!.uniform1f(uniforms.focal, focal)
    gl!.uniform1f(uniforms.burstSize, Math.min(view.halfW, view.halfH) / view.halfH) // 1 when wider than tall
    gl!.uniform1f(uniforms.pointSize, (small ? 5.5 : 6.5) * dpr)
    state.sized = true
  }

  /*
   * Mastery: a steady frame rate over a full flock. If frames run long on average (over ~18 ms, past
   * the first 3 s), a tenth of the flock fades out over about a second — never more than once every
   * 2 s, never below 55%, and never back up during the visit, so it can't flicker between the two.
   */
  function guardFrameRate(dt: number, now: number) {
    state.frameAvg += (dt - state.frameAvg) * 0.05
    state.watched += dt
    if (
      state.watched > 3 &&
      state.frameAvg > 0.0185 &&
      state.keepTarget > 0.6 &&
      now - state.lastCut > 2000
    ) {
      state.keepTarget = Math.max(0.55, state.keepTarget - 0.1)
      state.lastCut = now
    }
    state.keep += (state.keepTarget - state.keep) * Math.min(1, dt * 2.5)
  }

  function render(now: number) {
    state.frame = raf(render)
    const dt = Math.min((now - state.last) / 1000, 0.05)
    state.last = now
    const ease = 1 - Math.pow(0.001, dt) // frame-rate independent smoothing
    state.progress += (state.target - state.progress) * ease * 0.9
    state.mouse[0] += (state.mouseTarget[0] - state.mouse[0]) * ease * 1.5
    state.mouse[1] += (state.mouseTarget[1] - state.mouse[1]) * ease * 1.5
    state.strength += (state.strengthTarget - state.strength) * ease
    state.scale += (state.scaleTarget - state.scale) * ease
    state.offset[0] += (state.offsetTarget[0] - state.offset[0]) * ease
    state.offset[1] += (state.offsetTarget[1] - state.offset[1]) * ease
    guardFrameRate(dt, now)

    // One shape throughout; the story only eases its mood from loose (0) to gathered (1).
    const mood = state.progress / (STAGE_COUNT - 1)
    state.flight += dt * lerp(LOOSE[3], GATHERED[3], mood) * pace
    state.clock += dt * pace
    for (let i = 0; i < PULSES; i++) ages[i] = Math.min(now / 1000 - state.burstAt[i], 1e3)

    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.uniform1f(uniforms.time, state.clock)
    gl!.uniform1f(uniforms.flight, state.flight)
    gl!.uniform1f(uniforms.lag, lerp(LOOSE[0], GATHERED[0], mood))
    gl!.uniform1f(uniforms.width, lerp(LOOSE[1], GATHERED[1], mood))
    gl!.uniform1f(uniforms.rough, lerp(LOOSE[2], GATHERED[2], mood))
    gl!.uniform1f(uniforms.keep, state.keep)
    gl!.uniform1f(uniforms.scale, state.scale)
    gl!.uniform2fv(uniforms.offset, state.offset)
    gl!.uniform2fv(uniforms.mouse, state.mouse)
    gl!.uniform1f(uniforms.mouseStrength, state.strength)
    gl!.uniform2fv(uniforms.burst, state.bursts)
    gl!.uniform1fv(uniforms.burstAge, ages)
    gl!.drawArrays(gl!.POINTS, 0, Math.min(count, Math.ceil(count * state.keep)))
    if (state.firstFrame) {
      state.firstFrame = false
      onFirstFrame()
    }
  }

  let destroyed = false
  function setRunning(run: boolean) {
    run &&= !destroyed
    if (run === state.running) return
    state.running = run
    cancelRaf(state.frame)
    if (run) {
      state.last = performance.now()
      state.frame = raf(render)
    }
  }

  return (command) => {
    switch (command.type) {
      case 'resize':
        resize(command.width, command.height, command.dpr, command.wide)
        break
      case 'pointer':
        state.mouseTarget = [command.x * view.halfW, command.y * view.halfH]
        state.strengthTarget = Math.abs(command.x) <= 1 && Math.abs(command.y) <= 1 ? 1 : 0
        break
      case 'pointerleave':
        state.strengthTarget = 0
        break
      case 'burst': {
        const i = state.nextBurst
        state.bursts[i * 2] = command.x * view.halfW
        state.bursts[i * 2 + 1] = command.y * view.halfH
        state.burstAt[i] = performance.now() / 1000
        state.nextBurst = (i + 1) % PULSES
        break
      }
      case 'progress':
        if (stage === undefined)
          state.target = Math.min(STAGE_COUNT - 1, Math.max(0, command.value))
        break
      case 'run':
        setRunning(command.run && state.sized)
        break
      case 'destroy':
        setRunning(false)
        destroyed = true
        gl!.deleteBuffer(buffer)
        gl!.deleteProgram(program)
        break
    }
  }
}

/**
 * Starts a flock in `container` (it adds its own canvas, filling the container). The flock is
 * drawn in a worker on an OffscreenCanvas where the browser supports it, so neither WebGL setup
 * nor the per-frame drawing ever blocks the page's main thread; elsewhere it draws on the page.
 * Returns null when WebGL is unavailable; with a worker, that can only be known later (`onError`).
 */
export function createMurmuration({
  container,
  colors,
  layout = 'hero',
  stage,
  ink,
  glow = 1,
  calm = false,
  onReady,
  onError,
}: Options): Murmuration | null {
  const config: FlockConfig = {
    colors: colors.map(toRgb) as FlockConfig['colors'],
    ink: ink ? toRgb(ink) : undefined,
    glow,
    layout,
    stage,
    calm,
    small: window.matchMedia('(max-width: 1032px)').matches,
  }
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'display:block;width:100%;height:100%'
  container.append(canvas)

  let send: (command: FlockCommand) => void
  let worker: Worker | null = null
  if ('transferControlToOffscreen' in canvas && typeof Worker === 'function') {
    worker = new Worker(new URL('./murmuration.worker.ts', import.meta.url), { type: 'module' })
    const offscreen = canvas.transferControlToOffscreen()
    worker.postMessage({ type: 'init', canvas: offscreen, config }, [offscreen])
    worker.onmessage = ({ data }) => (data === 'ready' ? onReady?.() : onError?.())
    worker.onerror = () => onError?.()
    send = (command) => worker!.postMessage(command)
  } else {
    const draw = createFlockRenderer(canvas, config, () => onReady?.())
    if (!draw) {
      canvas.remove()
      return null
    }
    send = draw
  }

  const wide = window.matchMedia('(min-width: 1033px)') // matches the lg layout
  const sizeUp = () =>
    send({
      type: 'resize',
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      dpr: window.devicePixelRatio,
      wide: wide.matches,
    })

  /* Renders only while on screen, the tab is visible and the visitor hasn't paused it. */
  const run = { inView: true, paused: false }
  const update = () =>
    send({
      type: 'run',
      run: run.inView && !run.paused && document.visibilityState === 'visible',
    })

  document.addEventListener('visibilitychange', update)
  const observer = new ResizeObserver(sizeUp)
  observer.observe(canvas)
  sizeUp()
  update()

  return {
    setProgress: (value) => send({ type: 'progress', value }),
    setPointer: (x, y) => send({ type: 'pointer', x, y }),
    clearPointer: () => send({ type: 'pointerleave' }),
    burst(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      send({
        type: 'burst',
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((clientY - rect.top) / rect.height) * 2 - 1),
      })
    },
    setActive(active) {
      run.inView = active
      update()
    },
    setPaused(paused) {
      run.paused = paused
      update()
    },
    destroy() {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      send({ type: 'destroy' })
      worker?.terminate()
      canvas.remove()
    },
  }
}
