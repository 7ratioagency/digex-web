'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const COUNT = 22
/**
 * How far each mark falls per loop, in viewport-height units — the vh proxy
 * for "from -10% of the section to 110%, i.e. a 120% traversal," since a
 * transform's `%` is relative to the element's own box, not its container,
 * so vh is the only unit that can express "most of the section's height"
 * without measuring it in JS. The hero runs close to a full viewport, so
 * vh tracks it closely enough in practice.
 */
const FALL_DISTANCE_VH = 120

type Mark = {
  id: number
  insetStart: number
  top: number
  size: number
  opacity: number
  fallDuration: number
  fallDelay: number
  swayAmplitude: number
  swayDuration: number
  rotateTo: number
  rotateDuration: number
}

function between(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function makeMarks(): Mark[] {
  return Array.from({ length: COUNT }, (_, id) => ({
    id,
    insetStart: between(2, 94),
    /*
     * Random rest position across the *whole* -10%..95% band, not just
     * "above the fold" — this is what makes marks already at different
     * points in their fall the instant the page loads, instead of every
     * instance starting stacked at the top and falling in visible unison.
     * Combined with the per-mark `fallDelay` below, no two instances are
     * ever in phase.
     */
    top: between(-10, 95),
    /*
     * The mark's own alpha coverage is sparse (~19% of its bounding box —
     * it's a thin fold-bracket shape, not a filled blob), so small + faint
     * reads as imperceptible rather than intentional. 8-14% in `--brand-300`
     * (see `.logo-mark`, globals.css — one rule for both themes now that
     * the canvas is the same near-black burst in both) reads as
     * clearly-present ambient motion against black without competing with
     * the headline.
     */
    size: between(40, 90),
    opacity: between(0.08, 0.14),
    // Slow and calm, and varied enough that no two instances ever fall in sync.
    fallDuration: between(20, 40),
    fallDelay: between(0, 10),
    swayAmplitude: between(10, 26),
    swayDuration: between(7, 13),
    rotateTo: between(-50, 50),
    rotateDuration: between(30, 55),
  }))
}

/**
 * Ambient falling-logo texture behind the hero content — DESIGN.md §3's
 * "optional watermark" reinterpreted as a scattered snowfall of small marks
 * rather than one oversized shape.
 *
 * ─── Why this never renders on the server ────────────────────────────────
 * The scatter is randomised, and a client component still executes on the
 * server for the initial HTML in the App Router. Random values would differ
 * between that server pass and the client's hydration pass, and React treats
 * that mismatch as an error. Generating the marks inside `useEffect` sidesteps
 * it entirely: the server (and the client's first paint) render nothing, and
 * the marks fill in a moment after hydration. That also satisfies the "don't
 * compete with LCP" requirement for free — this layer is decorative and is
 * never part of the content the browser paints first.
 *
 * Positioned absolutely with no effect on document flow, so that appearance
 * causes zero layout shift.
 */
export function FloatingLogos() {
  const reduce = useReducedMotion()
  const [marks, setMarks] = useState<Mark[] | null>(null)

  useEffect(() => {
    setMarks(makeMarks())
  }, [])

  if (!marks) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {marks.map((mark) => (
        <motion.div
          key={mark.id}
          className="logo-mark absolute"
          style={{
            insetInlineStart: `${mark.insetStart}%`,
            top: `${mark.top}%`,
            width: mark.size,
            height: mark.size,
            // Raw value only — `.logo-mark` (globals.css) turns this into
            // the actual `opacity`, scaled by a per-theme multiplier. Light
            // mode needs roughly double the alpha to read as comparably
            // visible to dark mode at the same pigment.
            // @ts-expect-error — custom properties are valid style values.
            '--mark-opacity': mark.opacity,
          }}
          // Reduced motion: scattered, static — the mount-time position above
          // *is* the fixed layout, so there's nothing further to set.
          animate={
            reduce
              ? undefined
              : {
                  y: ['0vh', `${FALL_DISTANCE_VH}vh`],
                  x: [0, mark.swayAmplitude, -mark.swayAmplitude, 0],
                  rotate: [0, mark.rotateTo],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  y: {
                    duration: mark.fallDuration,
                    delay: mark.fallDelay,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'linear',
                  },
                  x: {
                    duration: mark.swayDuration,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  },
                  rotate: {
                    duration: mark.rotateDuration,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  },
                }
          }
        />
      ))}

      {/*
        `.contrast-scrim` (globals.css) — the marks fall straight through the
        headline band, and this layer stacks above HeroBackdrop's own copy of
        the same scrim, so that one alone can't reach them. Without a second
        copy here, a mark drifting behind the accent word measurably dropped
        contrast into the 6.7–6.9:1 range across every locale — under
        DESIGN.md's 7:1 floor.
      */}
      <div className="absolute inset-0 contrast-scrim" />
    </div>
  )
}
