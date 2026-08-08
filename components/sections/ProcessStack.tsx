'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'

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
 * Ambient gradient mesh behind each stage — DESIGN.md §3.
 *
 * Rendered per panel, not once for the whole stack: every panel is
 * `position: sticky` and all five stay mounted simultaneously (later ones
 * simply paint over earlier ones as they catch up), so a single mesh placed
 * behind the stack would only ever be visible behind panel one. Each stage
 * needs its own layer so the glass card in front of it always has something
 * to frost.
 *
 * Blob order is brand-400 top / brand-700 bottom — Problem's order, not
 * Services' (which runs the reverse immediately before this section). That
 * completes a Problem → Services → Process ABA rhythm down the page instead
 * of inventing a third, unrelated beat. Positioned on the vertical axis only,
 * same as those two, so RTL needs no mirrored variant.
 *
 * Opacity sits a touch below Problem/Services' 0.07: this mesh shows through
 * a glass card sitting on top of a panel that is *already* tinted toward
 * brand (up to 6%, see MAX_TINT), so the same blob strength would stack two
 * brand-leaning layers and read heavier than either section alone.
 *
 * `dark:opacity-[0.1]`/`[0.08]` is this section's local accent on top of the
 * shared canvas (root layout, DESIGN.md §3) — brought back down from an
 * earlier pass's 0.24/0.2, which was tuned for this mesh being the primary
 * dark-mode glow. It no longer is; the canvas is, and this mesh stacks on
 * top of both that and the panel's own brand tint, so the same peak opacity
 * would read heavier here than anywhere else.
 */
function ProcessMesh() {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 top-[-55%] mx-auto size-136 rounded-full opacity-[0.06] dark:opacity-[0.1]"
        style={{
          background:
            'radial-gradient(circle at center, var(--brand-400) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 20, -14, 0], y: [0, 12, -8, 0], scale: [1, 1.04, 0.97, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 33, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
        }
      />
      <motion.div
        className="absolute inset-x-0 bottom-[-55%] mx-auto size-120 rounded-full opacity-[0.05] dark:opacity-[0.08]"
        style={{
          background:
            'radial-gradient(circle at center, var(--brand-700) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -16, 12, 0], y: [0, -10, 14, 0], scale: [1, 0.97, 1.03, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 39, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
        }
      />

      {/*
        Added alongside the panel's own background moving from an opaque
        `--surface` mix to a transparent one: the glass card's contrast
        margin on the deepest panel is already thin (see the note on
        `dark:[--glass-bg:...]` below), so now that the shared canvas's own
        glow can reach this section too, that margin needs the same
        protection every other section's mesh gives its text.
      */}
      <div className="absolute inset-0 contrast-scrim" />

      <div className="absolute inset-0 grain" />
    </div>
  )
}

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
      /*
       * The tint now lives here rather than on the rotating card below: this
       * div is a plain rectangle for the panel's whole life, while the card
       * on top of it tilts and is inset from these edges. Keeping the colour
       * on the stable element means the gap around the card — and whatever
       * peeks past its corners mid-tilt — reads as this stage's own depth,
       * not a graphic seam.
       *
       * Mixed with `transparent`, not `--surface`: this panel is no longer
       * its own opaque surface — the page's single fixed canvas (root
       * layout, DESIGN.md §3) is behind it now, and this tint is this
       * stage's accent riding on top of that shared background, same as
       * every other section. The 0-6% progression (MAX_TINT) is unchanged;
       * only what it's mixed into moved.
       *
       * overflow-hidden keeps the tilted corners (and the mesh below) from
       * pushing the page wide.
       */
      style={{
        background: `color-mix(in srgb, var(--brand-500) ${tint}%, transparent)`,
      }}
      className="sticky top-0 h-dvh overflow-hidden"
    >
      <ProcessMesh />

      <motion.div
        /*
         * `rotate` is never branched on the motion preference. It is written
         * into the markup, and the server cannot know the preference, so
         * branching it rendered `transform: rotate(8deg)` server-side against
         * `transform: none` on the client — a hydration mismatch for exactly
         * the reduced-motion users it was meant to help. `data-reduce-safe`
         * (globals.css) forces `transform: none` for them instead, which lands
         * the panel square without the markup ever disagreeing.
         *
         * `.glass` (DESIGN.md §2) replaces the flat tint this card used to
         * carry directly — the tint moved to the sticky panel behind it, so
         * this translucent surface has the mesh and that colour to frost
         * instead of nothing. Inset from the panel's true edges (rather than
         * `h-full w-full`) because a glass card flush with the viewport
         * clips its own border, radius and shadow off screen — the whole
         * point of the treatment only reads with a little air around it.
         *
         * `dark:[--glass-bg:...]` scopes the recipe's dark alpha from 5% down
         * to 1% — the same fix and the same cause as `CycleItem`'s in
         * ProblemCycle.tsx. Measured before this override: the body copy
         * (`--muted-foreground`) dropped from its documented 7.33:1 baseline
         * (see MAX_TINT above) to 6.29-6.58:1 across the five panels, because
         * the white wash lightens the dark tinted background sitting behind
         * it. 1% restores 7.05-7.60:1 on panels 0-3, and 6.94:1 on the
         * deepest, most-tinted panel — a small, disclosed dip below the
         * 7.33:1 baseline rather than a full restore, still comfortably
         * clear of the 4.5:1 AA floor. Going further (0% — no wash at all)
         * did reach 7:1 everywhere, but at that point the card had no visible
         * fill left, only a border, which undercuts the "give it visual
         * weight" goal this pass exists for.
         */
        data-reduce-safe=""
        style={{
          rotate,
          transformOrigin: rtl ? 'bottom right' : 'bottom left',
        }}
        className="glass absolute inset-3 flex flex-col px-6 py-section-2xl sm:inset-4 lg:inset-6 lg:px-8 dark:[--glass-bg:rgba(255,255,255,0.01)]"
      >
        {/*
          The reference's rhythm: label, rule, oversized headline, rule, and the
          supporting line pushed to the foot of the panel. At full-viewport
          height anything smaller leaves the panel looking empty — which is why
          the headline takes the DESIGN.md §4 display token rather than a plain
          text size. `tracking-display` resolves to 0 under RTL, so Arabic
          keeps its joins.

          Wrapped in a stagger rather than one block: unlike Services' single
          `<Reveal>` (one dense grid, one movement), a stage here is already
          broken into four visually distinct bands by its own rules, so
          revealing them in sequence reads as continuing that rhythm rather
          than as fussiness layered on top of it.
        */}
        <StaggerGroup as="div" className="flex h-full w-full flex-col">
          <StaggerItem
            as="div"
            className="mx-auto flex w-full max-w-7xl items-baseline justify-between gap-section-md"
          >
            {/*
              The step number was a `text-sm` label easy to miss against a
              full-viewport panel. `--gradient-signature` (DESIGN.md §1/§7 —
              "the one signature gradient... never a second one") is unused
              elsewhere in the codebase, so this is that one use, exactly
              where DESIGN.md §1 names "key accents" as the intended target.
            */}
            <span
              className="bg-clip-text font-display text-6xl leading-none font-bold tabular-nums text-transparent sm:text-7xl lg:text-8xl"
              style={{ backgroundImage: 'var(--gradient-signature)' }}
            >
              {step.step}
            </span>
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {index + 1} / {total}
            </span>
          </StaggerItem>

          {/*
            The two rules are plain divs, not StaggerItems: they're hairline
            dividers, not content, and `StaggerItem` requires children (it
            always has something to fade in) — these have none.
          */}
          <div className="mx-auto mt-section-md w-full max-w-7xl border-t border-border" />

          {/*
            Larger than `--text-display` (which tops out at 6rem) on purpose. That
            token is sized for a headline sharing a viewport with sub-copy and a
            CTA row; here a single word owns a full-height panel, and at 6rem the
            panel read as mostly empty. Still well short of the reference's 14rem,
            which at this word length would break onto two lines in French.
          */}
          <StaggerItem as="div" className="mx-auto mt-section-lg w-full max-w-7xl">
            <h3 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[1.05] font-semibold text-balance tracking-display">
              {step.title}
            </h3>
          </StaggerItem>

          <div className="mx-auto mt-section-lg w-full max-w-7xl border-t border-border" />

          <StaggerItem as="div" className="mx-auto mt-auto w-full max-w-7xl pt-section-lg">
            <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
              <span className="block max-w-prose">{step.body}</span>
            </p>
          </StaggerItem>
        </StaggerGroup>
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
    <section className="scroll-mt-24">
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
