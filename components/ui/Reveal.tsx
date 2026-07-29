'use client'

import { motion, useReducedMotion } from 'motion/react'
import { DURATION, EASE, RISE, VIEWPORT } from '@/lib/motion'

const tags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  p: motion.p,
} as const

type Props = {
  children: React.ReactNode
  className?: string
  /** Seconds to wait before starting. Ignored under reduced motion. */
  delay?: number
  as?: keyof typeof tags
}

/**
 * Fade + rise once, when scrolled into view.
 *
 * `initial` is deliberately NOT branched on the motion preference: that value
 * is rendered into the markup, and the server can't know the preference, so
 * branching it desyncs hydration. Only `transition` — which never reaches the
 * DOM — varies. The visible final state for reduced motion comes from the
 * `data-reduce-safe` rule in globals.css.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Tag = tags[as]

  return (
    <Tag
      className={className}
      data-reduce-safe=""
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: DURATION, ease: EASE, delay }
      }
    >
      {children}
    </Tag>
  )
}
