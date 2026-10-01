/*
 * Starling murmuration (after "Flight of the Starlings", Jan van IJken / National Geographic):
 * thousands of specks in three flocks that fill the card, each flying as one body, coloured
 * with the Alchemy gradient (or solid ink over a light sky) — a ribbon that stretches, folds into
 * twisting sheets, ripples with density waves, splits and rejoins. No fixed shapes: the flock's
 * form comes from following a wandering leader through time. The pointer is a falcon the flock
 * parts around, and birds near it catch its light. Scrolling the pinned Home hero changes how the
 * flock flies (see STAGES).
 *
 * Fully procedural in the vertex shader (one draw call, no library, no per-frame CPU work beyond
 * a few uniforms): each bird has a fixed place in the flock's body (along / across / depth), and the
 * body is laid along the leader's recent path, so every turn of the leader sweeps through the flock.
 */

/** Flight styles, one per story stage: [lag, width, twist, split, ball, speed]. */
const STAGES = [
  [16, 0.75, 5.0, 0, 0, 1.0], // long ribbon (the headline)
  [10, 1.2, 9.0, 0, 0, 0.8], // wide folding sheet
  [12, 0.65, 5.0, 1, 0, 1.1], // two flocks
  [6, 0.75, 4.0, 0, 1, 0.7], // dense, swirling ball
  [22, 0.5, 3.0, 0, 0, 1.3], // long stream
  [9, 0.55, 6.0, 0, 0.32, 0.7], // gathering — warmer and closer together, not the opening ribbon again
] as const

export const STAGE_COUNT = STAGES.length

type Options = {
  /** The flock adds its own canvas here, filling it. */
  container: HTMLElement
  /** The first frame is on screen (fade the flock in now). */
  onReady?: () => void
  /** WebGL turned out to be unavailable in the worker (keep the static card). */
  onError?: () => void
  /** [alchemy-1, alchemy-2, light text] as CSS colours (read from the design tokens). */
  colors: [string, string, string]
  /** 'hero': beside/above the Home headline. 'center': centred in its panel (service pages). */
  layout?: 'hero' | 'center'
  /** Hold this flight style instead of following setProgress. */
  stage?: number
  /** Draw solid birds in this CSS colour over a light sky, instead of glowing Alchemy on dark. */
  ink?: string
  /** Brightness of the glowing birds (default 1); the Home story, whose card they light, uses more. */
  glow?: number
  /** A CSS colour the birds shade into in the sky's far bottom-right corner (the Home hero). */
  green?: string
}

export type Murmuration = {
  /** Continuous stage position, 0 … STAGE_COUNT - 1. The flight style eases toward it. */
  setProgress(progress: number): void
  /** Pauses rendering while off screen. */
  setActive(active: boolean): void
  /** The visitor's pause control (WCAG 2.2.2): freezes the flock where it is. */
  setPaused(paused: boolean): void
  /** Scatters the flock from this point on screen (a tap or click); it regroups by itself. */
  burst(clientX: number, clientY: number): void
  destroy(): void
}

const VERTEX = /* glsl */ `
attribute vec4 aSeed; // along, across, depth, random

uniform float uTime;      // wall clock, for flutter
uniform float uFlight;    // flock clock (advances at the stage's speed)
uniform float uLag;       // body length, in seconds of the leader's path
uniform float uWidth;
uniform float uTwist;
uniform float uSplit;
uniform float uBall;
uniform float uScale;
uniform vec2 uOffset;
uniform vec2 uMouse;      // world units on the z = 0 plane
uniform float uMouseStrength;
uniform vec2 uMouseVel;   // how fast the falcon is moving (world units per second)
uniform vec3 uColorGreen; // the green of the sky's far corner…
uniform float uGreenAmount; // …and how far birds there shade into it (0 = no green)
uniform vec2 uBurst;      // where the last tap/click landed (world units)
uniform float uBurstAge;  // seconds since then
uniform float uBurstSize; // the card's size relative to a desktop card (the burst scales with it)
uniform float uAspect;
uniform float uFocal;
uniform float uPointSize;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorLight;
uniform vec3 uColorInk;
uniform float uInk;       // 1: solid ink birds on a light sky
uniform float uGlow;      // brightness of the glowing birds

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

// The leader's wandering path (object units, roughly x ±1.45, y ±0.65, z ±0.8).
vec3 leader(float t) {
  return vec3(
    sin(t * 0.23) * 1.0 + sin(t * 0.37 + 1.3) * 0.45,
    sin(t * 0.29 + 0.7) * 0.45 + sin(t * 0.53) * 0.2,
    sin(t * 0.19 + 2.1) * 0.8
  );
}

void main() {
  float along = aSeed.x;
  float across = aSeed.y * 2.0 - 1.0;
  float depth = aSeed.z * 2.0 - 1.0;
  float r = aSeed.w;
  float t = uFlight;
  // About 1% of birds are leads: a touch larger, a touch brighter, pacing fractionally ahead of the
  // body — the flock reads as individuals finding the same shape, not one anonymous mass.
  float lead = step(0.99, hash(r + 20.0));

  // Three flocks fly at once, far apart along the same wandering path, so the whole card is alive;
  // on the split stage each of them divides again.
  float flockId = floor(hash(r + 5.0) * 3.0);
  float phase = flockId * 9.0 + step(0.5, r) * uSplit * 6.0;
  float tp = t - along * uLag + phase + lead * 0.15;
  vec3 c = leader(tp);
  vec3 T = normalize(leader(tp + 0.05) - c);
  vec3 N = normalize(cross(T, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 0.0, 1e-4));
  vec3 B = cross(N, T);

  // Cross-section: tapered at both ends, breathing, and twisting along the body into folded sheets.
  // (never fully thin, so the ends feather out instead of drawing hard streaks)
  float env = 0.3 + 0.7 * pow(sin(3.14159 * along), 0.6);
  float width = uWidth * (0.6 + 0.4 * sin(along * 5.0 - t * 0.7)) * env;
  float a = along * uTwist + t * 0.3;
  float cs = cos(a), sn = sin(a);
  float qw = across * width;
  float hh = depth * width * 0.22;
  vec3 pos = c + N * (cs * qw - sn * hh) + B * (sn * qw + cs * hh);

  // Density waves running through the flock.
  pos += T * 0.06 * sin(along * 40.0 - t * 4.0);

  // Ball: the flock bunches around the middle of its path and swirls.
  vec3 dir = normalize(vec3(across, depth, sin(r * 43.7)) + 1e-4);
  float spin = t * 0.9 + r * 6.2831;
  vec3 swirl = vec3(dir.x * cos(spin) - dir.z * sin(spin), dir.y, dir.x * sin(spin) + dir.z * cos(spin));
  vec3 ball = leader(t - uLag * 0.5 + flockId * 9.0) + swirl * 0.62 * pow(r, 0.5);
  pos = mix(pos, ball, uBall);

  // Stragglers: a few birds drift loose across the whole card.
  float loose = step(hash(r + 1.0), 0.06);
  vec3 drift = vec3(
    sin(hash(r + 2.0) * 6.2831 + t * 0.07) * 1.5,
    sin(hash(r + 3.0) * 6.2831 + t * 0.05) * 0.95,
    sin(hash(r + 4.0) * 6.2831 + t * 0.03) * 0.6
  );
  pos = mix(pos, drift, loose);

  // Each bird flutters a little on its own.
  pos += 0.018 * vec3(sin(uTime * 2.1 + r * 60.0), sin(uTime * 2.7 + r * 91.0), sin(uTime * 1.9 + r * 37.0));

  pos = pos * uScale + vec3(uOffset, 0.0);

  // The clap: a tap or click sends a shock through the flock. It spreads out from that point, so
  // near birds burst first and far ones a moment later; each flies out with a little swirl and
  // depth, catches the light, then rejoins the flock over about two seconds.
  vec2 fromBurst = pos.xy - uBurst;
  float bd = length(fromBurst) / uBurstSize; // in desktop-card units, so a tap feels the same on a phone
  float ba = max(uBurstAge - bd / 8.0, 0.0) / 0.28;
  // A small settle, after the main burst has mostly faded: birds dip slightly past their place before
  // coming to rest, rather than decaying straight back — the overshoot of a real return, not a reset.
  float settle = -0.12 * sin(max(ba - 1.1, 0.0) * 2.2) * exp(-max(ba - 1.1, 0.0) * 1.4);
  float burst = (ba * exp(1.0 - ba) + settle) * exp(-bd * bd / 18.0) * (0.6 + 0.8 * hash(r + 11.0));
  vec2 bdir = normalize(fromBurst + 1e-4);
  pos.xy += (bdir + vec2(-bdir.y, bdir.x) * (hash(r + 12.0) - 0.5) * 1.2) * burst * 2.2 * uBurstSize;
  pos.z += burst * (hash(r + 13.0) - 0.3) * 1.6 * uBurstSize;

  // The falcon: birds near the pointer scatter, leaving a hole that closes as it passes;
  // birds near the sun catch its light. The hole has no regular shape: its outline comes from a
  // drifting random noise field (lumps and bays that never repeat), its centre wanders a little
  // around the pointer, each bird holds its ground at its own distance (a ragged edge), and when
  // the pointer moves the hole stretches out behind it into a wake.
  vec2 jitter = (vec2(noise2(vec2(uTime * 0.7, 3.1)), noise2(vec2(5.2, uTime * 0.8))) - 0.5) * 0.4;
  vec2 away = pos.xy - uMouse - jitter;
  float near = dot(away, away);
  vec2 heading = away / max(sqrt(near), 1e-3);
  float wobble = 0.4 + 0.85 * (0.6 * noise2(heading * 1.6 + vec2(uTime * 0.35, -uTime * 0.27))
    + 0.4 * noise2(heading * 3.7 + vec2(-uTime * 0.6, uTime * 0.5) + 7.3));
  float nerve = 0.35 + 1.3 * hash(r + 14.0);
  float speed = length(uMouseVel);
  float behind = min(dot(away, -uMouseVel / max(speed, 1e-3)), 0.0) * -1.0;
  float wake = behind * behind * clamp(speed * 0.18, 0.0, 0.75);
  float reach = 0.5 * wobble * wobble * nerve;
  float fear = exp(-max(near - wake, 0.0) / reach) * uMouseStrength;
  pos.xy += normalize(away + 1e-4) * fear * 0.8;
  pos.z += fear * 0.3;

  // Just past where fear fades out, birds ease a little toward the light instead of fleeing it — a
  // loose, wandering ring of welcome around the sun, not a predator's reach. It fades in only once
  // fear has mostly faded, and fades out again before it would ever pull a bird in too close.
  float ringIn = smoothstep(reach * 0.9, reach * 2.0, near);
  float ringOut = 1.0 - smoothstep(reach * 2.5, reach * 7.0, near);
  float warmth = ringIn * ringOut * uMouseStrength * (0.5 + 0.5 * hash(r + 15.0)) * (1.0 - uInk);
  pos.xy -= heading * warmth * 0.35;

  float lit = (exp(-near / (4.0 * wobble)) * uMouseStrength + burst * 0.6) * (1.0 - uInk) + warmth * 0.5;

  float dist = CAMERA_Z - pos.z;
  gl_Position = vec4(pos.x * uFocal / uAspect, pos.y * uFocal, 0.0, dist);
  gl_PointSize = uPointSize * (0.6 + hash(r + 7.0) * 0.8 + lead * 0.9) * (CAMERA_Z / dist);

  // The Alchemy gradient laid across the screen: Alchemy 1 at top left, Alchemy 2 at bottom right.
  vec2 screen = pos.xy * uFocal / dist;
  float tint = clamp(0.5 + (screen.x / uAspect - screen.y) * 0.35, 0.0, 1.0);
  // Seen from below, wings spread across the view, banking a little as the flock turns;
  // each bird beats its wings at its own pace.
  vHead = normalize(vec2(T.x * 0.45, -1.0));
  vFlap = sin(uTime * (8.0 + hash(r + 8.0) * 5.0) + r * 50.0);

  // …and, as in the design's original hero art, the far bottom-right of the sky turns green: birds
  // flying through that corner shade into it, so the flock carries a little green as it passes.
  // Like the art, the red warms back to orange first and then turns green (a golden step between,
  // not the brown a straight red-to-green blend would give).
  float corner = 0.5 + (screen.x / uAspect - screen.y) * 0.35; // past 1 toward the far corner
  float warm = smoothstep(0.8, 0.98, corner) * uGreenAmount;
  float verdant = smoothstep(0.92, 1.12, corner) * uGreenAmount;
  vec3 hue = mix(mix(mix(uColorA, uColorB, tint), uColorA, warm), uColorGreen, verdant);
  vColor = mix(mix(hue, uColorLight, lit * 0.7), uColorInk, uInk);
  vColor = mix(vColor, uColorLight, lead * 0.5 * (1.0 - uInk)); // leads carry a little of the light always
  vAlpha = clamp(0.42 + pos.z / uScale * 0.12, 0.25, 0.6) * (1.0 + uInk * 0.5) * uGlow * (1.0 + lit) * (1.0 + lead * 0.35);
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
  colors: [Rgb, Rgb, Rgb]
  ink?: Rgb
  glow: number
  green?: Rgb
  layout: 'hero' | 'center'
  stage?: number
  /** Phone/tablet: fewer birds, lower resolution. */
  small: boolean
}

/** What the page tells the renderer (sizes, pointer, scroll), since a worker can't see the page. */
export type FlockCommand =
  | { type: 'resize'; width: number; height: number; dpr: number; wide: boolean }
  | { type: 'pointer'; x: number; y: number } // −1 … 1 across the canvas
  | { type: 'pointerleave' }
  | { type: 'burst'; x: number; y: number } // −1 … 1 across the canvas
  | { type: 'progress'; value: number }
  | { type: 'run'; run: boolean }
  | { type: 'destroy' }

/**
 * Draws the flock into a canvas it owns (an OffscreenCanvas in lib/murmuration.worker, or the
 * page's canvas where workers can't draw). Returns null when WebGL is unavailable.
 */
export function createFlockRenderer(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  { colors, ink, glow, green, layout, stage, small }: FlockConfig,
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

  // Fewer birds on phones and low-core machines, so it stays at frame rate.
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 4
  const count = Math.round((small ? 5000 : 10000) * (lowEnd ? 0.5 : 1))
  const rand = mulberry32(3)
  const seeds = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    // Denser toward the middle of the body and its centre line, like a real flock.
    const along = 0.5 + (rand() - 0.5) * (0.6 + 0.4 * rand())
    const across = 0.5 + (rand() - 0.5) * (0.5 + 0.5 * rand())
    seeds.set([along, across, rand(), rand()], i * 4)
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
    twist: u('uTwist'),
    split: u('uSplit'),
    ball: u('uBall'),
    scale: u('uScale'),
    offset: u('uOffset'),
    mouse: u('uMouse'),
    mouseStrength: u('uMouseStrength'),
    burst: u('uBurst'),
    burstAge: u('uBurstAge'),
    burstSize: u('uBurstSize'),
    mouseVel: u('uMouseVel'),
    aspect: u('uAspect'),
    focal: u('uFocal'),
    pointSize: u('uPointSize'),
  }
  gl.uniform3fv(u('uColorA'), colors[0])
  gl.uniform3fv(u('uColorB'), colors[1])
  gl.uniform3fv(u('uColorLight'), colors[2])
  if (ink) gl.uniform3fv(u('uColorInk'), ink)
  gl.uniform1f(u('uInk'), ink ? 1 : 0)
  gl.uniform1f(u('uGlow'), glow)
  if (green) gl.uniform3fv(u('uColorGreen'), green)
  gl.uniform1f(u('uGreenAmount'), green ? 0.9 : 0)
  gl.enable(gl.BLEND)
  if (ink)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // ink: where the flock is dense, it darkens
  else gl.blendFunc(gl.ONE, gl.ONE) // additive: where the flock is dense, it glows
  gl.disable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  const FOV = (35 * Math.PI) / 180
  const focal = 1 / Math.tan(FOV / 2)
  const view = { halfW: 1, halfH: 1 }

  const state = {
    target: stage ?? 0,
    progress: stage ?? 0,
    flight: 20, // start mid-flight, not at the path's origin
    scale: 1,
    offset: [0, 0] as [number, number],
    mouse: [0, 0] as [number, number],
    mouseTarget: [0, 0] as [number, number],
    strength: 0,
    strengthTarget: 0,
    burst: [0, 0] as [number, number],
    burstAt: -1e4, // seconds (performance.now clock); long ago = no burst
    mouseVel: [0, 0] as [number, number],

    running: false,
    sized: false,
    firstFrame: true,
    frame: 0,
    last: performance.now(),
  }

  function resize(w: number, h: number, deviceDpr: number, wide: boolean) {
    const dpr = Math.min(deviceDpr || 1, small ? 1.5 : 2)
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    gl!.viewport(0, 0, canvas.width, canvas.height)
    view.halfH = 10 / focal // half the visible height at z = 0 (camera at z = 10)
    view.halfW = view.halfH * (w / Math.max(1, h))
    if (layout === 'center') {
      state.scale = Math.min(view.halfW * 0.85, view.halfH * 1.4)
      state.offset = [0, 0]
    } else if (wide) {
      // Desktop: the flock fills the card edge to edge, behind the headline.
      state.scale = Math.min(view.halfW * 0.78, view.halfH * 1.5)
      state.offset = [0, 0]
    } else {
      // Tablet/phone: fills the card, weighted toward the space above the headline.
      state.scale = Math.min(view.halfW * 1.05, view.halfH * 0.8)
      state.offset = [0, view.halfH * 0.2]
    }
    gl!.uniform1f(uniforms.aspect, w / Math.max(1, h))
    gl!.uniform1f(uniforms.focal, focal)
    gl!.uniform1f(uniforms.burstSize, Math.min(view.halfW, view.halfH) / view.halfH) // 1 when wider than tall
    gl!.uniform1f(uniforms.pointSize, (small ? 5.5 : 6.5) * dpr)
    state.sized = true
  }

  function render(now: number) {
    state.frame = raf(render)
    const dt = Math.min((now - state.last) / 1000, 0.05)
    state.last = now
    const ease = 1 - Math.pow(0.001, dt) // frame-rate independent smoothing
    state.progress += (state.target - state.progress) * ease * 0.9
    const [mx, my] = state.mouse
    state.mouse[0] += (state.mouseTarget[0] - state.mouse[0]) * ease * 1.5
    state.mouse[1] += (state.mouseTarget[1] - state.mouse[1]) * ease * 1.5
    // The falcon's velocity (smoothed), which stretches the hole into a wake behind it.
    if (dt > 0) {
      state.mouseVel[0] += ((state.mouse[0] - mx) / dt - state.mouseVel[0]) * ease
      state.mouseVel[1] += ((state.mouse[1] - my) / dt - state.mouseVel[1]) * ease
    }
    state.strength += (state.strengthTarget - state.strength) * ease

    // Blend the two neighbouring flight styles.
    const i = Math.min(Math.floor(state.progress), STAGE_COUNT - 2)
    const f = state.progress - i
    const [lag, width, twist, split, ball, speed] = STAGES[i].map((v, k) =>
      lerp(v, STAGES[i + 1][k], f),
    )
    state.flight += dt * speed

    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.uniform1f(uniforms.time, now / 1000)
    gl!.uniform1f(uniforms.flight, state.flight)
    gl!.uniform1f(uniforms.lag, lag)
    gl!.uniform1f(uniforms.width, width)
    gl!.uniform1f(uniforms.twist, twist)
    gl!.uniform1f(uniforms.split, split)
    gl!.uniform1f(uniforms.ball, ball)
    gl!.uniform1f(uniforms.scale, state.scale)
    gl!.uniform2fv(uniforms.offset, state.offset)
    gl!.uniform2fv(uniforms.mouse, state.mouse)
    gl!.uniform1f(uniforms.mouseStrength, state.strength)
    gl!.uniform2fv(uniforms.burst, state.burst)
    gl!.uniform2fv(uniforms.mouseVel, state.mouseVel)
    gl!.uniform1f(uniforms.burstAge, Math.min(now / 1000 - state.burstAt, 1e3))
    gl!.drawArrays(gl!.POINTS, 0, count)
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
      case 'burst':
        state.burst = [command.x * view.halfW, command.y * view.halfH]
        state.burstAt = performance.now() / 1000
        break
      case 'pointerleave':
        state.strengthTarget = 0
        break
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
  green,
  onReady,
  onError,
}: Options): Murmuration | null {
  const config: FlockConfig = {
    colors: colors.map(toRgb) as FlockConfig['colors'],
    ink: ink ? toRgb(ink) : undefined,
    glow,
    green: green ? toRgb(green) : undefined,
    layout,
    stage,
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

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    send({
      type: 'pointer',
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    })
  }
  const onPointerLeave = () => send({ type: 'pointerleave' })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', update)
  const observer = new ResizeObserver(sizeUp)
  observer.observe(canvas)
  sizeUp()
  update()

  return {
    setProgress: (value) => send({ type: 'progress', value }),
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
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', update)
      send({ type: 'destroy' })
      worker?.terminate()
      canvas.remove()
    },
  }
}
