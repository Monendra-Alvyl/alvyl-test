import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type AccentWeight = 'italic' | 'light-italic' | 'thin-italic'

const weights: Record<AccentWeight, string> = {
  italic: 'font-normal',
  'light-italic': 'font-light',
  'thin-italic': 'font-thin',
}

type AlchemyTextProps = {
  children: ReactNode
  /** IvyMode italic cut used by the design: "Italic" (400), "Light Italic" (300) or "Thin Italic" (100). */
  weight?: AccentWeight
}

/** Accent words in headings, filled with the Alchemy gradient. */
export function AlchemyText({ children, weight = 'thin-italic' }: AlchemyTextProps) {
  /*
   * data-accent lets src/lib/accentFonts.ts load the italic faces only when accents are near view.
   * The gradient is only painted inside the span's box, so tall italic ascenders ("d", "l"), the
   * slant past the last letter and descenders that swing left under the first ("g" in "great") were
   * cut off. The padding enlarges the painted area; the negative margins keep the layout unchanged
   * (vertical inline padding doesn't affect line height).
   */
  return (
    <span
      data-accent
      className={cn(
        'text-alchemy font-display -mx-[0.15em] box-decoration-clone px-[0.15em] pt-[0.15em] pb-[0.25em] italic',
        weights[weight],
      )}
    >
      {children}
    </span>
  )
}
