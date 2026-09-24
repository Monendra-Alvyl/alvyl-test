import { FeaturePanel } from '@/components/sections/FeaturePanel'
import { RichHeading } from '@/components/ui/RichHeading'
import { startupSpeed, stats } from '@/data/home'

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
        art={
          <img
            src={startupSpeed.image}
            alt=""
            aria-hidden
            className="pointer-events-none mx-auto aspect-square w-[300px] object-cover md:w-[360px] lg:absolute lg:top-1/2 lg:right-[-1px] lg:size-[604px] lg:-translate-y-1/2"
          />
        }
      />

      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="border-stroke-light bg-pitch-black p-card flex flex-col justify-between gap-12 rounded-[24px] border lg:h-[420px]"
          >
            <p className="text-h1 text-text-white font-sans font-medium whitespace-nowrap">
              {stat.value}
            </p>
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-h3 text-text-white font-light">{stat.label}</h3>
              <p className="text-body-lg text-text-ultra-light font-sans font-medium">
                {stat.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
