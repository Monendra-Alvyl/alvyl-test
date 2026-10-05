import { FeaturePanel } from '@/components/sections/FeaturePanel'
import { RichHeading } from '@/components/ui/RichHeading'
import { startupSpeed, stats } from '@/data/home'

/*
 * "Our approach" artwork, in the live alvyl.com icon language (thin orbits with nodes): a large, slow
 * outer orbit (enterprise: steady, dependable) with a tight inner orbit touching it, where one small
 * Alchemy-orange node runs fast with a short fading trail (startup speed) — speed held inside a stable
 * system. Drawn in SVG so it's crisp at any size; motion in motion.css (still under reduced motion).
 */
function OrbitArt() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 600"
      className="orbit-art pointer-events-none mx-auto aspect-square w-[300px] overflow-visible md:w-[360px] lg:absolute lg:top-1/2 lg:right-10 lg:size-[520px] lg:-translate-y-1/2"
    >
      <defs>
        <linearGradient id="orbit-node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--color-alchemy-1)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-alchemy-2)' }} />
        </linearGradient>
        <linearGradient id="orbit-trail" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--color-alchemy-1)', stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-alchemy-1)', stopOpacity: 0.9 }} />
        </linearGradient>
        <radialGradient id="orbit-glow">
          <stop offset="0" style={{ stopColor: 'var(--color-alchemy-1)', stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-alchemy-1)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Enterprise: the large, steady orbit and its nodes, turning very slowly. */}
      <g className="orbit-slow" fill="none" stroke="white" strokeWidth={1.5} vectorEffect="non-scaling-stroke">
        <circle cx={300} cy={300} r={240} strokeOpacity={0.35} vectorEffect="non-scaling-stroke" />
        {[200, 290, 115].map((deg) => {
          const a = (deg * Math.PI) / 180
          return (
            <circle
              key={deg}
              cx={300 + 240 * Math.cos(a)}
              cy={300 + 240 * Math.sin(a)}
              r={11}
              fill="black"
              strokeOpacity={0.75}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </g>

      {/* Startup: the tight inner orbit, touching the outer one at the right. */}
      <circle
        cx={420}
        cy={300}
        r={120}
        fill="none"
        stroke="white"
        strokeOpacity={0.5}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <g className="orbit-fast">
        {/* A 70° trail behind the node (the node runs clockwise, from the top). */}
        <path
          d={`M ${420 + 120 * Math.cos((-160 * Math.PI) / 180)} ${300 + 120 * Math.sin((-160 * Math.PI) / 180)} A 120 120 0 0 1 420 180`}
          fill="none"
          stroke="url(#orbit-trail)"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={420} cy={180} r={34} fill="url(#orbit-glow)" />
        <circle cx={420} cy={180} r={9} fill="url(#orbit-node)" />
      </g>
    </svg>
  )
}

/** "Startup Speed. Enterprise Impact." feature panel + stats row — Figma 17:433 / 17:445. */
export function StartupSpeed() {
  return (
    <>
      <FeaturePanel
        id="startup-speed-heading"
        eyebrow={startupSpeed.eyebrow}
        heading={<RichHeading lines={startupSpeed.headline} />}
        headingWidth="lg:w-[453px]"
        body={startupSpeed.body}
        art={<OrbitArt />}
      />

      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="border-stroke-light bg-pitch-black p-card flex flex-col justify-between gap-12 rounded-[24px] border lg:h-[420px]"
          >
            <p className="text-h1 text-text-white font-sans font-normal whitespace-nowrap">
              {stat.value}
            </p>
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-h3 text-text-white font-light">{stat.label}</h3>
              <p className="text-body-lg text-text-ultra-light font-sans font-normal">
                {stat.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
