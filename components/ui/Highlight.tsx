'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE, VIEWPORT } from '@/lib/motion'

/**
 * Marker highlights on key words — DESIGN.md §2c.
 *
 * Three variants, matching the three treatments seen across the posters: a
 * yellow marker swipe, a solid blue block with the word knocked out white,
 * and a heavy blue underline. Each draws itself in once when scrolled into
 * view, which §2c calls out as "a cheap, very high-impact signature".
 *
 * ─── Why the wipe is `scaleX` and not `clip-path` or `width` ────────────────
 * `width` is out — CLAUDE.md forbids animating it, and it would reflow the
 * headline every frame. `clip-path` reads more naturally for a wipe, but its
 * `inset()` values are physical (top/right/bottom/left), so an RTL variant
 * would need the direction resolved in JS — and `document.dir` can only be
 * read after mount, which means either a hydration mismatch or a frame of
 * wrong-direction wipe on above-the-fold headlines. `scaleX` sidesteps it
 * entirely: `origin-left rtl:origin-right` is pure CSS, correct on the very
 * first paint in both directions, and compositor-only.
 *
 * Reduced motion is handled by `data-reduce-safe` (globals.css), which forces
 * `transform: none` — for a `scaleX(0)` bar that resolves to its finished,
 * full-width state, which is exactly the "render the final state instantly"
 * behaviour CLAUDE.md asks for. `initial` is never branched on the
 * preference, for the reason spelled out in `Reveal.tsx`: it is written into
 * the server markup, and branching it desyncs hydration.
 */

type Variant = 'marker' | 'block' | 'underline'

type Props = {
  children: React.ReactNode
  variant?: Variant
  /** Seconds to wait before the wipe starts. Ignored under reduced motion. */
  delay?: number
  className?: string
}

const DURATION = 0.55

/**
 * A real highlighter doesn't lay down a clean rectangle — the felt tip leaves
 * a wavering edge and the ink pools unevenly. This polygon wobbles the top and
 * bottom edges by a few percent while keeping the ends roughly square, which
 * is what stops the marker variant reading as a plain `<mark>` background.
 */
const MARKER_CLIP =
  'polygon(0% 14%, 7% 5%, 23% 10%, 42% 3%, 64% 9%, 83% 2%, 96% 8%, 100% 17%, 99% 83%, 91% 95%, 73% 88%, 54% 97%, 32% 89%, 13% 96%, 4% 88%, 0% 79%)'

export function Highlight({
  children,
  variant = 'marker',
  delay = 0,
  className = '',
}: Props) {
  const reduce = useReducedMotion()
  /*
   * Only the `block` variant needs this: its word turns white, and it must
   * not do so before the blue is actually behind it or the word would vanish
   * against paper mid-wipe. Set from Motion's own viewport callback, which
   * still fires under reduced motion (only the transition duration changes),
   * so the reduced-motion path lands on white without a separate branch.
   */
  const [swept, setSwept] = useState(false)

  const transition = reduce
    ? { duration: 0 }
    : { duration: DURATION, ease: EASE, delay }

  const wipe = {
    'data-reduce-safe': '',
    initial: { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: VIEWPORT,
    transition,
    // Grows from the reading-start edge in both directions — see the note above.
    className: 'origin-left rtl:origin-right',
  } as const

  if (variant === 'underline') {
    return (
      <span className={`relative inline-block ${className}`}>
        <span className="relative">{children}</span>
        <motion.span
          {...wipe}
          aria-hidden="true"
          className={`${wipe.className} absolute inset-x-0 bottom-[-0.08em] h-[0.13em] rounded-full bg-blue-500 dark:bg-brand-300`}
        />
      </span>
    )
  }

  if (variant === 'block') {
    return (
      <span
        className={`relative inline-block ${className}`}
        // Padding is on the wrapper, not the block, so the blue extends past
        // the glyphs without the word shifting when the animation runs.
        style={{ paddingInline: '0.22em' }}
      >
        <motion.span
          {...wipe}
          aria-hidden="true"
          onViewportEnter={() => setSwept(true)}
          className={`${wipe.className} absolute inset-y-[-0.08em] inset-x-0 rounded-[0.12em] bg-blue-500`}
        />
        {/*
          `text-white` only once the block is actually there. The delay is a
          little over half the wipe, so the word flips as the blue passes it
          rather than before it arrives — and until then it keeps the
          headline's own colour, so it is never invisible.

          `transitionDelay` is NOT branched on the motion preference, even
          though a delay is meaningless under reduced motion. It is a rendered
          style attribute, and `useReducedMotion()` resolves false on the
          server and true on the client — branching it here produced a real
          hydration mismatch ("some attributes of the server rendered HTML
          didn't match"), the exact failure `Reveal.tsx` warns about.
          `motion-reduce:transition-none` already removes the transition
          entirely for those users, which makes the delay moot without the
          markup ever disagreeing.
        */}
        <span
          className={`relative transition-colors duration-200 motion-reduce:transition-none ${
            swept ? 'text-white' : ''
          }`}
          style={{ transitionDelay: `${(delay + DURATION * 0.55) * 1000}ms` }}
        >
          {children}
        </span>
      </span>
    )
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        {...wipe}
        aria-hidden="true"
        style={{ clipPath: MARKER_CLIP, rotate: '-1.4deg' }}
        /*
         * `multiply` is what makes this read as ink on paper rather than a
         * coloured box behind the word: the yellow darkens what is under it
         * instead of replacing it, exactly like a highlighter over print.
         * It also means the word on top keeps its own colour — measured,
         * `--ink` on `--highlight-yellow` is 15.7:1.
         *
         * Sized past the glyph box on both axes so the swipe overshoots the
         * word the way a hand-drawn one does.
         */
        /*
         * Bottom bleed is a token (`--marker-bleed-bottom`, globals.css), not
         * a fixed inset: on paper the word stays `--ink` and is legible even
         * where the swipe's wavy clip misses it, but on navy the word turns
         * `--ink` against an opaque yellow, so anything the swipe misses is
         * near-black on navy. Dark mode re-points the token to clear
         * descenders; the top edge is the same in both.
         */
        className={`${wipe.className} absolute inset-x-[-0.16em] top-[var(--marker-bleed-top)] bottom-[var(--marker-bleed-bottom)] bg-highlight-yellow mix-blend-multiply dark:mix-blend-normal`}
      />
      <span className="relative dark:text-ink">{children}</span>
    </span>
  )
}
