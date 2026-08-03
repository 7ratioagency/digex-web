'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export type ProcessStep = { step: string; title: string; body: string }

type Props = {
  steps: ProcessStep[]
  /** Rendered on the server and passed down, so Process stays a Server Component. */
  header: React.ReactNode
}

/**
 * How far a panel is tilted when it first appears, in degrees.
 *
 * The reference this is modelled on uses 30°, which on a full-bleed panel
 * swings the far corner most of the way off screen and reads as a card being
 * flung in. At this type size that fights the copy for attention, and the
 * wedge it opens is large enough to show two panels down. Eight degrees keeps
 * the "falls into place" gesture while the heading stays readable throughout.
 */
const TILT = 8

/**
 * Deepest brand tint, as a percentage mixed into `--surface` on the last panel.
 *
 * DESIGN.md §7 rules out the reference's five unrelated block colours, so the
 * sequence is one hue at five depths instead: the page shifts toward brand as
 * you descend the stages.
 *
 * 6, not something punchier, because `--muted-foreground` is the binding
 * constraint. Tinting toward brand lifts the light surface's luminance, which
 * eats the body copy's contrast: measured on the deepest panel, 16% dropped it
 * to 6.20:1 and 8% to 6.92:1, both under the 7:1 the rest of the site holds.
 * 6% lands at 7.10:1 light / 7.33:1 dark. The stacking and the tilt carry this
 * section — the tint is depth cueing, not the effect.
 */
const MAX_TINT = 6

/**
 * One stage. Sticky, so it holds at the top of the viewport while the next
 * stage scrolls up and covers it — the pinned stack the reference builds with
 * ScrollTrigger's `pin`, done with CSS instead so Lenis remains the only thing
 * driving scroll position and there is no scroller to proxy.
 */
function Panel({
  step,
  index,
  total,
  rtl,
}: {
  step: ProcessStep
  index: number
  total: number
  rtl: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    // From the panel's top entering at the viewport bottom to it nearly
    // reaching the top — the window the reference tweens its rotation over.
    offset: ['start end', 'start 25%'],
  })

  /*
   * Mirrored for RTL. The tilt pivots on the panel's bottom *reading-start*
   * corner, so in Arabic that is bottom-right and the rotation runs the other
   * way. Left unmirrored, the panel would swing in from the wrong edge and
   * read as arriving from behind the text rather than alongside it.
   */
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [rtl ? -TILT : TILT, 0],
  )

  const tint = (index / Math.max(1, total - 1)) * MAX_TINT

  return (
    <div
      ref={ref}
      // Marks a stage panel, mirroring the reference's own `data-flow-section`.
      // Class-based selectors can't identify these — other sections use the
      // same sticky/full-height utilities.
      data-process-panel=""
      // overflow-hidden keeps the tilted corners from pushing the page wide.
      className="sticky top-0 h-dvh overflow-hidden"
    >
      <motion.div
        /*
         * `rotate` is never branched on the motion preference. It is written
         * into the markup, and the server cannot know the preference, so
         * branching it rendered `transform: rotate(8deg)` server-side against
         * `transform: none` on the client — a hydration mismatch for exactly
         * the reduced-motion users it was meant to help. `data-reduce-safe`
         * (globals.css) forces `transform: none` for them instead, which lands
         * the panel square without the markup ever disagreeing.
         */
        data-reduce-safe=""
        style={{
          rotate,
          transformOrigin: rtl ? 'bottom right' : 'bottom left',
          background: `color-mix(in srgb, var(--brand-500) ${tint}%, var(--surface))`,
        }}
        className="flex h-full w-full flex-col px-6 py-section-2xl lg:px-8"
      >
        {/*
          The reference's rhythm: label, rule, oversized headline, rule, and the
          supporting line pushed to the foot of the panel. At full-viewport
          height anything smaller leaves the panel looking empty — which is why
          the headline takes the DESIGN.md §4 display token rather than a plain
          text size. `tracking-display` resolves to 0 under RTL, so Arabic
          keeps its joins.
        */}
        <div className="mx-auto flex w-full max-w-7xl items-baseline justify-between gap-section-md">
          <span className="text-sm font-semibold tabular-nums text-accent-blue">
            {step.step}
          </span>
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {index + 1} / {total}
          </span>
        </div>

        <div className="mx-auto mt-section-md w-full max-w-7xl border-t border-border" />

        {/*
          Larger than `--text-display` (which tops out at 6rem) on purpose. That
          token is sized for a headline sharing a viewport with sub-copy and a
          CTA row; here a single word owns a full-height panel, and at 6rem the
          panel read as mostly empty. Still well short of the reference's 14rem,
          which at this word length would break onto two lines in French.
        */}
        <h3 className="mx-auto mt-section-lg w-full max-w-7xl font-display text-[clamp(3rem,9vw,8rem)] leading-[1.05] font-semibold text-balance tracking-display">
          {step.title}
        </h3>

        <div className="mx-auto mt-section-lg w-full max-w-7xl border-t border-border" />

        <p className="mx-auto mt-auto w-full max-w-7xl pt-section-lg text-lg leading-relaxed text-pretty text-muted-foreground">
          <span className="block max-w-prose">{step.body}</span>
        </p>
      </motion.div>
    </div>
  )
}

/**
 * The five stages as a stack of panels that tilt into place and pin behind one
 * another as you scroll.
 *
 * Adapted from a GSAP/ScrollTrigger reference rather than ported. The pin is
 * `position: sticky`, and the tilt is a Motion value bound to each panel's own
 * scroll progress — so nothing takes over the scroller, Lenis keeps sole
 * control, and there is no ScrollTrigger proxy to keep in sync.
 *
 * Scroll-linked motion is bidirectional by nature, so this replays when
 * scrolling back up. That is what a pinned sequence is, not an oversight.
 */
export function ProcessStack({ steps, header }: Props) {
  const [rtl, setRtl] = useState(false)

  // Read after mount only, so SSR and the first client render agree.
  useEffect(() => {
    setRtl(document.documentElement.dir === 'rtl')
  }, [])

  return (
    <section className="scroll-mt-24 bg-surface">
      <div className="px-6 pt-section-2xl lg:px-8">
        <div className="mx-auto max-w-7xl">{header}</div>
      </div>

      {/*
        The panels' shared containing block. Each child is sticky, so the first
        holds at the top for the whole of this box while the rest scroll up over
        it in turn — which is what produces the stack.
      */}
      <div className="relative mt-section-xl">
        {steps.map((step, index) => (
          <Panel
            key={step.step}
            step={step}
            index={index}
            total={steps.length}
            rtl={rtl}
          />
        ))}
      </div>
    </section>
  )
}
