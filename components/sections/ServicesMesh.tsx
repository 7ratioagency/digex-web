'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Ambient gradient mesh for the Services section — DESIGN.md §3, muted like
 * Problem's (0.07 opacity there; 0.065/0.055 here, the same order of
 * magnitude, "lower" as asked rather than a fixed rule).
 *
 * A separate file, not a function inside Services.tsx, for one reason:
 * Services.tsx is a Server Component by its own explicit design — its
 * comment on `HoverSlider` states plainly that `ServiceCard`'s copy and icon
 * "never enter the client bundle," and the drift here needs `motion.div` +
 * `useReducedMotion()`, which need `'use client'`. A directive is file-scoped,
 * not per-function, so the only way to keep that guarantee intact is to give
 * the animated part its own client boundary and import it — the same reason
 * `HoverSlider.tsx` exists as its own file already.
 *
 * Rendered as a *child* of `.panel-grow` (globals.css) rather than as an
 * independent backdrop layer: that div already scales in (0.92 → 1) and
 * rounds its corners down to square as the section scrolls into view, and
 * children inherit both — the mesh grows and clips in step with the panel for
 * free, no coordinating code needed.
 *
 * Blob choice is deliberately the mirror of Problem's, not a repeat of it:
 * Problem runs brand-400 on top / brand-700 on bottom at 27s/33s. This runs
 * brand-700 on top / brand-400 on bottom, at different drift amplitudes and
 * duration. Two sections back to back with the identical beat would read as
 * repetition rather than the alternating rhythm asked for, even at low
 * opacity. Positioning keeps the same *shape* as Problem's for the same
 * reason theirs does: vertical-only offsets don't mirror under RTL, so this
 * needs no direction-specific rule either.
 *
 * These opacities are the light values of what used to be a light/dark pair;
 * the dark half went with dark mode. Note this mesh now sits inside an
 * `.section-alt` section, so it reads as texture *on* the navy band rather than
 * as the section's own background — the colour fields (DESIGN.md §2a) are
 * what the glass cards here actually pick up.
 */
export function ServicesMesh() {
  const reduce = useReducedMotion()

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-50%] mx-auto size-124 rounded-full opacity-[0.065]"
        style={{
          background:
            'radial-gradient(circle at center, var(--brand-700) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -18, 22, 0], y: [0, 10, -14, 0], scale: [1, 0.96, 1.03, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 29, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
        }
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-50%] mx-auto size-112 rounded-full opacity-[0.055]"
        style={{
          background:
            'radial-gradient(circle at center, var(--brand-400) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 16, -20, 0], y: [0, -10, 12, 0], scale: [1, 1.03, 0.97, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 35, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
        }
      />

      {/*
        Scrim, aimed at `.panel-grow`'s own resolved background (globals.css)
        rather than the shared `.contrast-scrim`, which fades to plain
        `--background` — `.panel-grow` is that same token with 6% brand-500
        mixed in, so fading to the bare token would leave a faint seam right
        at this scrim's edges. Kept in sync with `.panel-grow`'s own formula,
        including its 55% mix with transparent, so the scrim's "opaque" band
        is exactly as opaque as the panel actually is now that both are part
        of the shared canvas rather than a flat, fully-opaque surface.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, var(--brand-500) 6%, var(--background)) 55%, transparent) 94%, transparent) 14%,
            color-mix(in srgb, color-mix(in srgb, color-mix(in srgb, var(--brand-500) 6%, var(--background)) 55%, transparent) 94%, transparent) 86%,
            transparent 100%
          )`,
        }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grain" />

      {/*
        Colour behind the glass — DESIGN.md §2f (a). No negative z-index here,
        unlike Problem's and Process's: this renders *inside* `.panel-grow`,
        which is itself already at `z-index: -1` with its own background, so
        going negative again would drop these behind that background and
        they would never be seen. Default stacking puts them above the
        panel's fill and still below the section's content.
      */}
      <div
        aria-hidden="true"
        className="colour-field colour-field-violet top-[10%] inset-e-[2%] size-136"
      />
      <div
        aria-hidden="true"
        className="colour-field colour-field-blue bottom-[6%] inset-e-[24%] size-112"
      />
    </>
  )
}
