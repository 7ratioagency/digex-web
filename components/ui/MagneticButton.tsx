'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/** How far the button may be pulled toward the cursor, in px. */
const PULL = 10
/** Fraction of the cursor offset applied — lower is subtler. */
const STRENGTH = 0.28

const clamp = (v: number, limit: number) => Math.max(-limit, Math.min(limit, v))

/**
 * Magnetic hover + a glow that tracks the cursor — DESIGN.md §5.
 *
 * Wraps a button rather than reimplementing one, so <Button> stays the single
 * definition of what a CTA looks like.
 *
 * Pointer-driven by nature, so it is gated twice: on `useReducedMotion`, and on
 * the pointer being fine (mouse). On touch there is no hover state to enter and
 * a magnetic pull would just fight the tap.
 */
export function MagneticButton({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [glowVisible, setGlowVisible] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // Spring rather than a tween: DESIGN.md §6 asks for physical easing.
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.2 })

  // Glow position as percentages, written to CSS vars to avoid re-rendering.
  const glowX = useMotionValue('50%')
  const glowY = useMotionValue('50%')

  function handleMove(event: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current
    if (!el || reduce) return
    // Coarse pointers get neither effect.
    if (!window.matchMedia('(pointer: fine)').matches) return

    const rect = el.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)

    x.set(clamp(offsetX * STRENGTH, PULL))
    y.set(clamp(offsetY * STRENGTH, PULL))

    glowX.set(`${((event.clientX - rect.left) / rect.width) * 100}%`)
    glowY.set(`${((event.clientY - rect.top) / rect.height) * 100}%`)
    setGlowVisible(true)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
    setGlowVisible(false)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      /*
       * Not branched on `reduce`, for the same reason <Reveal> doesn't branch
       * its `initial`: this prop is rendered into the markup, and the server
       * can't know the motion preference. Branching it emitted
       * `style="transform:none"` on the server and `style=""` on the client for
       * anyone with reduced motion set — a real hydration mismatch, logged by
       * the dev server as such.
       *
       * Passing the springs unconditionally is safe because `handleMove`
       * already bails out under reduced motion, so x/y never leave 0 and the
       * button never moves.
       */
      style={{ x: springX, y: springY }}
      className="relative inline-flex"
    >
      {/*
        Halo behind the button. Sitting outside it means <Button> needs no
        changes and the glow isn't clipped by the pill radius.
      */}
      <motion.span
        aria-hidden="true"
        style={{
          // @ts-expect-error — custom properties are valid style values.
          '--glow-x': glowX,
          '--glow-y': glowY,
          background:
            'radial-gradient(circle at var(--glow-x) var(--glow-y), var(--brand-400) 0%, transparent 65%)',
        }}
        className="pointer-events-none absolute -inset-5 -z-10 rounded-full blur-lg transition-opacity duration-300 motion-reduce:transition-none"
        animate={{ opacity: glowVisible && !reduce ? 0.55 : 0 }}
        transition={{ duration: reduce ? 0 : 0.3 }}
      />
      {children}
    </motion.span>
  )
}
