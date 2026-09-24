import { Fragment } from 'react'
import type { HeadingSegment } from '@/data/home'
import { AlchemyText, type AccentWeight } from './AlchemyText'

type RichHeadingProps = {
  /** One array per line; lines are separated with <br />. */
  lines: HeadingSegment[][]
  accentWeight?: AccentWeight
}

/** Renders heading text where `accent` segments use the Alchemy italic treatment. */
export function RichHeading({ lines, accentWeight }: RichHeadingProps) {
  return lines.map((segments, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {segments.map((segment, i) =>
        segment.accent ? (
          <AlchemyText key={i} weight={accentWeight}>
            {segment.text}
          </AlchemyText>
        ) : (
          <Fragment key={i}>{segment.text}</Fragment>
        ),
      )}
    </Fragment>
  ))
}
