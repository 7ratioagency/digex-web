'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Ambient gradient mesh for the hero — DESIGN.md §3.
 *
 * 0.16, not the 0.32 this ran at before the root layout grew a single fixed
 * canvas (DESIGN.md §3, `app/[locale]/layout.tsx`) that now sits behind
 * every section, including this one. This mesh's job changed with it: it
 * used to *be* the hero's background; now the canvas is, and this is that
 * canvas's own accent for this one section — motion and colour unchanged
 * (DESIGN.md §5 still wants the hero feeling "alive"), just no longer
 * carrying the section alone. Halving it only helps the contrast guarantee
 * below, never hurts it: the measurements it documents were taken at 0.32
 * and 0.25, both above this.
 *
 * ─── Why every blob sits in the end-side / edge margin ──────────────────────
 * The headline's accent word is brand blue, and the blobs are brand blue. Blue
 * text on a blue wash tops out around 4.9:1 in light and 5.5:1 in dark *at only
 * 25% blob opacity*, and falls from there — no opacity is low enough to reach
 * the 7:1 DESIGN.md §1 demands, because the two colours are too close in
 * luminance to separate. Dimming cannot fix a hue problem.
 *
 * So the mesh is kept out of the text column instead of merely faded. Blobs are
 * anchored to the inline-end half and the vertical edges, with drift amplitudes
 * small enough that none crosses into the headline's box at any viewport. Text
 * therefore composites against the flat base, where the accent measures
 * 7.48:1 (light) and 7.69:1 (dark).
 */

type Blob = {
  /** Logical placement — `start`/`end` so the mesh mirrors in RTL. */
  position: string
  color: string
  drift: { x: number[]; y: number[]; scale: number[] }
  duration: number
}

/*
 * Separation is VERTICAL, not horizontal, and that is the whole trick.
 *
 * The first attempt anchored blobs to `start`/`end`, which looks like the
 * RTL-correct choice — but the text column is anchored inline-start too, so
 * both mirror together and the blobs landed straight on the Arabic headline.
 * Measured: LTR held at 7.28:1 while RTL dropped to 5.68:1, with the pixels
 * behind "أكثر" reading rgb(210,216,247) instead of the near-base LTR value.
 *
 * Vertical offsets don't mirror. Anchoring every blob above the eyebrow or
 * below the CTA row — each mostly outside the section, so only its soft falloff
 * shows — keeps the headline band clear in both directions by construction
 * rather than by tuning.
 */
const BLOBS: Blob[] = [
  {
    // Mostly above the section; only the lower falloff reaches the eyebrow.
    position: 'inset-x-0 mx-auto top-[-78%] size-[46rem]',
    color: 'var(--brand-400)',
    drift: { x: [0, 34, -22, 0], y: [0, 18, -12, 0], scale: [1, 1.05, 0.97, 1] },
    duration: 27,
  },
  {
    // Mostly below; rises no further than the CTA row's lower margin.
    position: 'inset-x-0 mx-auto bottom-[-82%] size-[40rem]',
    color: 'var(--brand-700)',
    drift: { x: [0, -28, 20, 0], y: [0, -14, 10, 0], scale: [1, 0.96, 1.04, 1] },
    duration: 33,
  },
  {
    // High and off the top corner — vertically clear of the text as well.
    position: 'end-[-18%] top-[-70%] size-[30rem]',
    color: 'var(--brand-700)',
    drift: { x: [0, 20, -14, 0], y: [0, 12, -8, 0], scale: [1, 1.04, 0.98, 1] },
    duration: 39,
  },
]

export function HeroBackdrop() {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      // Decorative only, and never a scroll/pointer target.
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((blob) => (
        <motion.div
          key={blob.position}
          className={`absolute rounded-full opacity-[0.16] ${blob.position}`}
          style={{
            background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 70%)`,
          }}
          // Reduced motion: the mesh still renders, it just stops drifting.
          animate={
            reduce
              ? undefined
              : { x: blob.drift.x, y: blob.drift.y, scale: blob.drift.scale }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }
          }
        />
      ))}

      {/*
        Scrim — the thing that actually makes the 7:1 guarantee hold.

        Vertical separation alone wasn't enough: the section is too short for
        off-canvas blobs to clear the headline's second line, and every locale
        measured 6.35–6.98:1. Pushing the blobs further out would have deleted
        the mesh rather than fixed it.

        `.contrast-scrim` in globals.css — shared with FloatingLogos, which
        needs the identical fade for the same reason.
      */}
      <div className="absolute inset-0 contrast-scrim" />

      {/*
        Grain sits above the mesh but still inside this -z-10 layer, so it
        never blends with the headline. See the .grain note in globals.css.
      */}
      <div className="absolute inset-0 grain" />
    </div>
  )
}
