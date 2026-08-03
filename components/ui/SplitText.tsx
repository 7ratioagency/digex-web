'use client'

import { motion, useReducedMotion } from 'motion/react'
import { DURATION, EASE, STAGGER, VIEWPORT } from '@/lib/motion'

const tags = {
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const

type Props = {
  text: string
  className?: string
  as?: keyof typeof tags
  /**
   * Gate the reveal on scroll-into-view, vs. rendering already-resolved on
   * the first frame.
   *
   * Default `true` suits headings further down the page, which are offscreen
   * at load and genuinely get "revealed" by scrolling. Above-the-fold text
   * (the hero) is already in view at first paint — `whileInView` still fires
   * without any scroll there, but the words still spend their real duration
   * (stagger + fade, measured 600-800ms) sitting below full opacity, which
   * reads as illegible/washed-out text on load rather than a deliberate
   * animation. Pass `false` for anything that's visible on arrival.
   */
  revealOnScroll?: boolean
}

/**
 * Reveals a heading word by word.
 *
 * ─── Why this splits on words and never on characters ───────────────────────
 * Arabic is a cursive script: a letter's shape depends on its neighbours
 * (initial / medial / final / isolated). Wrapping each *letter* in its own
 * element severs those connections, so every letter falls back to its isolated
 * form and the word visually disintegrates. Whitespace is already a joining
 * boundary, so splitting there is lossless — each token is a whole word whose
 * internal joining is untouched. Measured: word-split Arabic renders within
 * 0.1px of the same string as plain text, while a character-split of the same
 * string is ~28% wider because the joins are gone.
 *
 * Whitespace tokens are preserved and emitted as real text nodes rather than
 * being reconstructed, which keeps the original spacing and leaves the bidi
 * algorithm an ordinary run of words to lay out in RTL.
 *
 * The word spans are aria-hidden with the full string on `aria-label`, so
 * assistive tech reads one sentence rather than a stream of fragments.
 */
export function SplitText({
  text,
  className,
  as = 'span',
  revealOnScroll = true,
}: Props) {
  const reduce = useReducedMotion()
  const Tag = tags[as]

  // The capturing group keeps the separators in the result.
  const tokens = text.split(/(\s+)/)

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        /*
         * Each word is an inline-block, which bidi treats as a neutral atomic
         * box — so the words get ordered by the *page's* direction, not the
         * text's. Latin words on an RTL page therefore came out reversed
         * ("page Facebook a than..."). `dir="auto"` derives the direction from
         * the text's own first strong character, so the words lay out in the
         * same order the unsplit string would. Alignment still comes from the
         * ancestor, so an Arabic heading stays right-aligned.
         */
        dir="auto"
        /*
         * Variant labels are namespaced. Motion propagates labels down the
         * whole tree, so generic names like "hidden"/"visible" collide with any
         * other component using them — the service icons draw themselves with
         * exactly those names, and a shared label left them fighting over the
         * same state and randomly not drawing.
         *
         * When `revealOnScroll` is false, `initial` is set directly to the
         * *visible* variant instead of gating it behind `whileInView`. Motion
         * only animates a transition when the active variant changes — start
         * already on the target variant and there is nothing to tween, so
         * every word (and its child span below) paints at full opacity on the
         * very first frame instead of racing a 600-800ms fade against the
         * user actually looking at the page.
         */
        initial={revealOnScroll ? 'word-hidden' : 'word-visible'}
        {...(revealOnScroll
          ? { whileInView: 'word-visible', viewport: VIEWPORT }
          : {})}
        variants={{
          'word-hidden': {},
          'word-visible': {
            transition: { staggerChildren: reduce ? 0 : STAGGER },
          },
        }}
      >
        {tokens.map((token, index) =>
          /^\s+$/.test(token) ? (
            <span key={index} className="whitespace-pre">
              {token}
            </span>
          ) : (
            <motion.span
              key={index}
              data-reduce-safe=""
              variants={{
                'word-hidden': { opacity: 0, y: '0.35em' },
                'word-visible': {
                  opacity: 1,
                  y: 0,
                  transition: reduce
                    ? { duration: 0 }
                    : { duration: DURATION, ease: EASE },
                },
              }}
              // inline-block is required — transforms don't apply to inline
              // boxes. Applied per word, never per letter.
              className="inline-block"
            >
              {token}
            </motion.span>
          ),
        )}
      </motion.span>
    </Tag>
  )
}
