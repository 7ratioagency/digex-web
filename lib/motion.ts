import type { Variants } from 'motion/react'

/** House easing and timings — see CLAUDE.md "Animation". */
export const EASE = [0.22, 1, 0.36, 1] as const
export const DURATION = 0.6
export const RISE = 24
export const STAGGER = 0.08

/**
 * Play once, and only once the element is meaningfully on screen.
 *
 * The margin shrinks the *bottom* edge only. A bare '-10%' is CSS shorthand for
 * all four sides, which also pulls the left and right edges in — anything near
 * a viewport side (the first column of a grid, say) then never intersects and
 * never animates at all.
 */
export const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' } as const

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
}

export const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
}

/**
 * Word offset is em-based so it scales with the heading it's used on, unlike
 * the fixed px rise used for whole blocks.
 */
export const wordVariants: Variants = {
  hidden: { opacity: 0, y: '0.35em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
}
