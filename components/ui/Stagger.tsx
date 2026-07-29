'use client'

import { motion, useReducedMotion } from 'motion/react'
import { DURATION, EASE, RISE, STAGGER, VIEWPORT } from '@/lib/motion'

const groupTags = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  dl: motion.dl,
  section: motion.section,
} as const

const itemTags = {
  div: motion.div,
  li: motion.li,
  span: motion.span,
} as const

type GroupProps = {
  children: React.ReactNode
  className?: string
  as?: keyof typeof groupTags
}

type ItemProps = {
  children: React.ReactNode
  className?: string
  as?: keyof typeof itemTags
}

/**
 * Parent of a staggered reveal. Wrap each child in <StaggerItem>; the offset
 * between them comes from `staggerChildren`, so items take no explicit delay.
 *
 * As in <Reveal>, only transition values branch on the motion preference —
 * markup stays identical so hydration matches. See globals.css.
 */
export function StaggerGroup({ children, className, as = 'div' }: GroupProps) {
  const reduce = useReducedMotion()
  const Tag = groupTags[as]

  return (
    <Tag
      className={className}
      initial="stagger-hidden"
      whileInView="stagger-visible"
      viewport={VIEWPORT}
      variants={{
        'stagger-hidden': {},
        'stagger-visible': {
          transition: { staggerChildren: reduce ? 0 : STAGGER },
        },
      }}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({ children, className, as = 'div' }: ItemProps) {
  const reduce = useReducedMotion()
  const Tag = itemTags[as]

  return (
    <Tag
      className={className}
      data-reduce-safe=""
      variants={{
        'stagger-hidden': { opacity: 0, y: RISE },
        'stagger-visible': {
          opacity: 1,
          y: 0,
          transition: reduce
            ? { duration: 0 }
            : { duration: DURATION, ease: EASE },
        },
      }}
    >
      {children}
    </Tag>
  )
}
