import { aboutIntro } from '@/data/about'

/** About intro — Alchemy statement card and two stat cards beside a team photo. */
export function AboutIntro() {
  return (
    <section aria-label="About Alvyl" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h1 className="bg-alchemy font-display text-h2 text-text-white md:p-card flex items-center rounded-[16px] p-6 font-light lg:h-[515px]">
          {aboutIntro.headline}
        </h1>
        <ul className="grid grid-cols-2 gap-4">
          {aboutIntro.stats.map((stat) => (
            <li
              key={stat.label}
              className="bg-dark-grey md:p-card flex flex-col gap-6 rounded-[16px] p-6 lg:h-[249px] lg:gap-12"
            >
              <p className="font-display text-h3 text-text-ultra-light font-light">{stat.label}</p>
              <p className="text-h1 text-text-white font-sans font-medium">{stat.value}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* The <picture> itself is the grid cell; the image fills it (portrait crop on desktop). */}
      <picture className="relative block overflow-clip rounded-[16px]">
        <source media="(min-width: 1024px)" srcSet={aboutIntro.image} />
        <img
          src={aboutIntro.imageWide}
          alt={aboutIntro.imageAlt}
          className="aspect-square w-full object-cover md:aspect-[752/383] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
        />
      </picture>
    </section>
  )
}
