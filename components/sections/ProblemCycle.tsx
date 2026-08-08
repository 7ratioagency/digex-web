'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useIsomorphicLayoutEffect,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'

export type ProblemItem = { title: string; body: string }

type Props = {
  items: ProblemItem[]
  /** Rendered on the server and passed down, so Problem stays a Server Component. */
  header: React.ReactNode
}

/** Below this the travel is skipped — a phone has no room for a focus band. */
const WIDE_QUERY = '(min-width: 1024px)'

/**
 * Distance, in list positions, over which a line fades from lit to dim.
 *
 * Exactly 1 — one whole step — so the two adjacent lines' opacities always sum
 * to 1: there is a single unambiguous "current" problem at every scroll
 * position, handing over linearly to the next. Tighter values leave a dead zone
 * mid-step where nothing is meaningfully lit; looser ones let a third line bleed
 * in and the highlight stops reading as a single focus.
 */
const FALLOFF = 1

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

/**
 * How lit a given index is at the current scroll position.
 *
 * Progress maps onto the list so index 0 is centred at progress 0 and the last
 * index at progress 1 — the same value that drives the travel below, so the
 * highlight and the movement can never disagree.
 */
function useLit(progress: MotionValue<number>, index: number, count: number) {
  return useTransform(progress, (p) => {
    const position = p * Math.max(1, count - 1)
    return clamp01(1 - Math.abs(position - index) / FALLOFF)
  })
}

/**
 * One problem: its title and its own supporting line, as a single block.
 *
 * The two used to be split — titles travelling in the stack, bodies crossfading
 * in a separate slot underneath. That read as disorganised for a concrete
 * reason: the lit title and its body ended up separated by one or two *other*,
 * dimmed titles, so the subtitle looked like it belonged to whichever line
 * happened to sit above it. Keeping the pair in one block makes the grouping
 * unambiguous — proximity does the work, no reading required.
 *
 * The colour change is a crossfade between two stacked copies rather than an
 * interpolated colour: both ends are design tokens (`--muted-foreground`,
 * `--brand-500`) and Motion cannot interpolate `var(...)` — it needs literal
 * values, which would mean hard-coding hex in a component or re-reading
 * computed styles on every theme toggle.
 *
 * Only `opacity` animates here, and only `y` on the list itself — both
 * compositor-only, no layout and no paint.
 */
function CycleItem({
  item,
  index,
  count,
  progress,
  registerTitleRef,
}: {
  item: ProblemItem
  index: number
  count: number
  progress: MotionValue<number>
  registerTitleRef: (el: HTMLHeadingElement | null, index: number) => void
}) {
  const lit = useLit(progress, index, count)

  return (
    <li>
      {/*
        Glass card — DESIGN.md §2, same recipe as the header pill and the
        service cards. Gives each problem visual weight against the new mesh
        background instead of bare text sitting on it.

        The focus-band centring in the parent measures this title's live
        position via `getBoundingClientRect`, not a fixed assumption, so the
        padding this card adds doesn't need any compensating change there —
        whatever the card's actual rendered position is gets picked up
        automatically.

        `dark:[--glass-bg:...]` overrides the recipe's dark alpha from 5% down
        to 1%, scoped to just this card. The lit title is `--brand-500`
        (rgb(59,99,255)), and measured, even the *unmodified* 5% white wash
        was enough to lighten dark mode's effective card background from
        rgb(11,14,26) to rgb(23,26,37) — dropping lit-title contrast from
        4.04:1 to 3.68:1.

        That 4.04:1 is a ceiling, not a target passed on the way to 4.5 —
        solved analytically, `--brand-500` text tops out at ~4.09:1 on this
        surface even with *zero* white wash at all, glass or none. It was
        already under the WCAG AA text minimum before any change in this
        pass, which is a pre-existing gap between this token and
        `--accent-blue` (the safe alternative used elsewhere) rather than
        something this pass introduces or is scoped to fix. The goal here is
        narrower and achievable: this card must not make an already-known
        weak spot worse. 1% brings measured contrast to 4.01:1, at parity
        with the ceiling rather than below it, while the border, blur and
        shadow — the parts of the recipe DESIGN.md §2 actually asks for —
        stay exactly as specified.

        Not the mesh: halving its opacity changed the measured contrast by
        nothing, since blobs are kept off the text on purpose (see
        ProblemMesh) — the glass wash itself is the whole effect. Scoped
        locally rather than changed in the shared `.glass` recipe globally,
        since nothing else on the site sits `--brand-500` text directly on
        dark glass the way this one does.
      */}
      <div className="glass p-section-lg dark:[--glass-bg:rgba(255,255,255,0.01)]">
        {/* `relative` anchors the lit copy. Both copies inherit alignment and
            direction from the ancestor, so this needs no RTL-specific rule. */}
        <h3
          ref={(el) => registerTitleRef(el, index)}
          className="relative text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight"
        >
          <span className="text-muted-foreground">{item.title}</span>
          <motion.span
            aria-hidden="true"
            style={{ opacity: lit }}
            className="absolute inset-0 text-brand-500"
          >
            {item.title}
          </motion.span>
        </h3>

        {/*
          Sits tight under its own title — `mt-section-sm` against the
          `gap-section-2xl` between items. That ratio is the grouping: a reader
          never has to work out which subtitle goes with which problem.

          Left at full `--muted-foreground` rather than faded with the
          highlight, so every body stays readable wherever it sits in the
          stack. The title's colour carries the focus; dimming the prose as
          well would cost legibility for no extra clarity.
        */}
        <p className="mt-section-sm max-w-prose leading-relaxed text-pretty text-muted-foreground">
          {item.body}
        </p>
      </div>
    </li>
  )
}

/** One step marker on the rail, lighting as its problem takes focus. */
function RailTick({
  index,
  count,
  progress,
}: {
  index: number
  count: number
  progress: MotionValue<number>
}) {
  const lit = useLit(progress, index, count)
  const opacity = useTransform(lit, [0, 1], [0.3, 1])
  const scale = useTransform(lit, [0, 1], [0.7, 1])

  return (
    <motion.span
      aria-hidden="true"
      style={{
        top: `${((index + 0.5) / count) * 100}%`,
        opacity,
        scale,
      }}
      // Centred on the 1px rail: half the dot's width back along the inline axis.
      className="absolute -inset-s-0.75 size-1.75 -translate-y-1/2 rounded-full bg-brand-500"
    />
  )
}

/**
 * Ambient gradient mesh for this section — DESIGN.md §3.
 *
 * Muted relative to the hero's version: 0.07 opacity here against Hero's 0.32.
 * A second full-strength mesh two sections down would compete with the hero's
 * rather than read as the same restrained system DESIGN.md §6 asks for.
 *
 * Same defence Hero's mesh needed, for the same reason: the lit title in this
 * section is `--brand-500`, so a brand-blue blob sitting behind it would fail
 * contrast exactly the way Hero's did — blue-on-blue tops out well under 7:1
 * regardless of opacity, because the two colours are too close in luminance to
 * separate by dimming alone. Blobs stay anchored to the vertical edges — an
 * axis that doesn't mirror under RTL — with a scrim enforced as the last
 * layer rather than left to opacity tuning; see HeroBackdrop.tsx for the full
 * story of why vertical separation alone still wasn't sufficient there.
 *
 * 0.07, not the 0.12 first tried, because the lit title sits inside a
 * `.glass` card, and dark mode's card is only 5% white — thin enough that
 * most of what's behind it still shows through. Measured: at 0.12 the mesh
 * lightened dark mode's effective card background just enough to drop the
 * lit title from its already-thin 4.04:1 baseline (a pre-existing,
 * `--brand-500`-vs-`--accent-blue` tradeoff, not something this pass is
 * scoped to fix) down to 3.68:1 — a real regression, since this addition is
 * responsible for not making an existing weak spot worse. 0.07 restores it to
 * 4.06:1, back at baseline, while dim text still clears 7.7:1 either way.
 *
 * Now uses the shared `.contrast-scrim` rather than a local one aimed at
 * `--surface`: this section no longer carries its own opaque `bg-surface` —
 * the page background is the single fixed canvas in the root layout (DESIGN.md
 * §3), and this section is transparent over it, so the token to fade toward
 * is the same `--background` every other section now shares.
 *
 * `dark:opacity-[0.1]` is this section's local accent, on top of the shared
 * canvas's own glow — deliberately far short of Services/Process's. This is
 * the one section where that isn't just restraint: 0.12 is already measured,
 * above, as the point where the lit title regresses from its already-thin
 * 4.04:1 ceiling to 3.68:1. 0.1 stays under that documented failure point
 * rather than retesting it blind.
 */
function ProblemMesh() {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 top-[-55%] mx-auto size-136 rounded-full opacity-[0.07] dark:opacity-[0.1]"
        style={{
          background:
            'radial-gradient(circle at center, var(--brand-400) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 24, -16, 0], y: [0, 14, -10, 0], scale: [1, 1.04, 0.97, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 31, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
        }
      />
      <motion.div
        className="absolute inset-x-0 bottom-[-55%] mx-auto size-120 rounded-full opacity-[0.07] dark:opacity-[0.1]"
        style={{
          background:
            'radial-gradient(circle at center, var(--brand-700) 0%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -20, 14, 0], y: [0, -12, 8, 0], scale: [1, 0.97, 1.03, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 37, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
        }
      />

      <div className="absolute inset-0 contrast-scrim" />

      {/* Grain sits above the mesh but still inside this -z-10 layer, so it
          never blends with the text — see .grain in globals.css. */}
      <div className="absolute inset-0 grain" />
    </div>
  )
}

/**
 * The list with no scroll behaviour: ordinary flow, last item highlighted.
 *
 * This is what the server renders, what the first client render produces, and
 * what reduced-motion, narrow viewports and no-JS keep — so hydration always
 * matches and there is no separate fallback story to get wrong. The two-column
 * order and the title/body pairing are identical to the enhanced version, so
 * nothing regroups when it swaps.
 */
function StaticProblem({ items, header }: Props) {
  return (
    /*
      `relative isolate overflow-hidden`: this section has no sticky ancestor
      of its own to lean on for a stacking context the way the travelling
      version's pane does, so without these three the mesh's `-z-10` layer
      would escape behind whatever the page renders before this section
      instead of staying scoped to it — the same fix Hero needed on its own
      `<section>`.
    */
    <section className="relative isolate scroll-mt-24 overflow-hidden px-6 py-section-2xl lg:px-8">
      <ProblemMesh />
      {/*
        `relative` is load-bearing, not decorative — see the identical note in
        Hero.tsx. `ProblemMesh` is positioned; without this the content stays
        non-positioned and paints in an earlier stacking step regardless of
        DOM order, so the mesh (and its near-opaque scrim band) would composite
        over the text instead of behind it.
      */}
      <div className="relative mx-auto grid max-w-7xl gap-section-xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-section-2xl">
        <StaggerGroup
          as="ul"
          className="flex flex-col gap-section-xl lg:order-1"
        >
          {items.map((item, index) => (
            <StaggerItem key={item.title} as="li">
              {/*
                Same glass treatment as the travelling version's cards, including
                the same 1% dark-alpha override — see the long note on CycleItem
                for the measured reason. This path renders the identical
                `--brand-500`-on-dark-glass combination on narrow viewports and
                under reduced motion, so it needs the identical fix.
              */}
              <div className="glass p-section-lg dark:[--glass-bg:rgba(255,255,255,0.01)]">
                <h3
                  className={`text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight ${
                    // Reduced motion resolves to the end of the sequence, which is
                    // where the travelling version finishes.
                    index === items.length - 1
                      ? 'text-brand-500'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.title}
                </h3>
                <p className="mt-section-sm max-w-prose leading-relaxed text-pretty text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <div className="lg:order-2">{header}</div>
      </div>
    </section>
  )
}

/**
 * Split out deliberately: `useScroll` binds to its
 * target on the mount of the component that calls it, so it cannot live in the
 * parent — there the first mount happens while the static version is showing
 * and the ref points at nothing ("Target ref is defined but not hydrated").
 * Mounting this only once travel is active means the ref is live from its own
 * first commit.
 */
function TravellingProblem({ items, header }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const titlesRef = useRef<(HTMLHeadingElement | null)[]>([])
  const [centres, setCentres] = useState<number[]>([])

  const registerTitleRef = (el: HTMLHeadingElement | null, index: number) => {
    titlesRef.current[index] = el
  }

  /*
   * Each *title's* centre inside the list — the title, not the whole block.
   *
   * Blocks are now title + body and vary in height, so centring the block would
   * park a different part of each item on the focus band depending on how long
   * its prose is, and the highlight would visibly wander. Anchoring the title
   * keeps the lit line landing in exactly the same place every time, with its
   * body following underneath.
   *
   * Measured rather than assumed: a fixed line-height would be wrong the moment
   * a title wraps, and these wrap to different line counts in every locale —
   * Arabic and French run markedly longer than English. Measuring also has to
   * survive the webfont swap, which changes metrics after first paint, hence
   * `fonts.ready` alongside the observer.
   *
   * `getBoundingClientRect()` deltas, not `offsetTop`/`offsetParent`. Each
   * title now sits inside a `.glass` card, and `backdrop-filter` — like
   * `filter` and `transform` — makes an element establish a new containing
   * block, which is exactly what `offsetParent` resolution keys off even at
   * `position: static`. Every title's `offsetParent` silently became its own
   * card, so every `offsetTop` read the same ~40px (the card's own padding)
   * regardless of which item it was, and the whole travel calculation
   * collapsed to the same target for every title. Rect subtraction is
   * implementation-detail-free: it works in viewport coordinates, so it can't
   * be redirected by a CSS property on an intermediate ancestor. The list's
   * own Motion-driven `y` transform doesn't need special-casing here either —
   * it shifts the list and every title inside it by the same amount in the
   * same frame, so subtracting the list's rect from a title's rect cancels
   * that shift out and leaves the title's true position within the list.
   */
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current
      if (!list) return
      const listTop = list.getBoundingClientRect().top
      const next = titlesRef.current.map((el) => {
        if (!el) return 0
        const r = el.getBoundingClientRect()
        return r.top - listTop + r.height / 2
      })
      setCentres((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next,
      )
    }

    measure()

    const observer = new ResizeObserver(measure)
    titlesRef.current.forEach((el) => el && observer.observe(el))
    if (listRef.current) observer.observe(listRef.current)
    document.fonts?.ready.then(measure).catch(() => {})

    return () => observer.disconnect()
  }, [items.length])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    /*
     * Scoped to this section's own ref, never the page. 0 when the section's
     * top meets the viewport top, 1 when its bottom meets the viewport bottom —
     * exactly the span the pane spends stuck, so the sequence starts and ends
     * with the pin instead of drifting against the rest of the page.
     */
    offset: ['start start', 'end end'],
  })

  /*
   * The travel. The list is positioned with its origin on the focus band, so
   * shifting it by minus a title's centre parks that title exactly on the band
   * — the Motion equivalent of the reference's negative sticky offset, and the
   * reason lines glide through a stationary highlight rather than sitting still
   * and merely recolouring.
   *
   * Both ranges are guarded to two entries: `useTransform` needs at least two
   * stops, and on the very first commit the measurement hasn't run yet.
   */
  const hasMeasurements = centres.length > 1
  const inputRange = hasMeasurements
    ? centres.map((_, i) => i / (centres.length - 1))
    : [0, 1]
  const outputRange = hasMeasurements ? centres.map((c) => -c) : [0, 0]
  const y = useTransform(scrollYProgress, inputRange, outputRange)

  // Fill of the progress rail beside the stack.
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={sectionRef}
      /*
       * The extra height is the scroll budget for the sequence and nothing
       * more: the section scrolls normally, it just takes ~3 screens to pass.
       * It never captures or re-times the wheel, so Lenis stays in sole control
       * and the two have nothing to fight over.
       */
      className="scroll-mt-24 h-[300vh]"
    >
      {/*
        overflow-hidden belongs on the sticky element itself — on an ancestor
        it would stop `sticky` working. `isolate` is defensive rather than
        strictly required (a `position: sticky` element already establishes
        its own stacking context per spec), but it makes that containment
        explicit rather than relying on a reader knowing the spec — same
        convention Hero.tsx uses.
      */}
      <div className="sticky top-0 isolate flex h-dvh items-center overflow-hidden px-6 lg:px-8">
        <ProblemMesh />
        {/* `relative` is load-bearing — see the identical note on
            StaticProblem's content wrapper; the reasoning is the same here. */}
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-section-2xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {/* ── Problems: inline-start column ───────────────────────────── */}
          <div className="order-1 flex gap-section-md">
            {/*
              Progress rail with one tick per problem — the piece that makes the
              sequence legible as a sequence: how many there are, and which one
              you're on. Vertical, so it never mirrors; `origin-top` is a
              physical axis on purpose.
            */}
            <div
              aria-hidden="true"
              className="relative w-px shrink-0 self-stretch bg-border"
            >
              <motion.div
                style={{ scaleY: railScale }}
                className="absolute inset-0 origin-top bg-brand-500"
              />
              {items.map((item, index) => (
                <RailTick
                  key={item.title}
                  index={index}
                  count={items.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            <div className="min-w-0 flex-1">
              {/*
                The window the stack travels through. Fade zones are kept tight
                (10%/90%): wider ramps caught a single wrapped heading
                mid-gradient, so its first line sat visibly dimmer than its
                second — which reads as a rendering fault rather than as an item
                receding. The gradient runs vertically, an axis that doesn't
                mirror, so /ar needs no separate rule.
              */}
              <div className="relative h-[min(64vh,32rem)] mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                <motion.ul
                  ref={listRef}
                  style={{ y }}
                  // Origin sits on the focus band; `y` parks a title on it.
                  className="absolute inset-x-0 top-1/2 flex flex-col gap-section-2xl"
                >
                  {items.map((item, index) => (
                    <CycleItem
                      key={item.title}
                      item={item}
                      index={index}
                      count={items.length}
                      progress={scrollYProgress}
                      registerTitleRef={registerTitleRef}
                    />
                  ))}
                </motion.ul>
              </div>
            </div>
          </div>

          {/* ── Section title: inline-end column ────────────────────────── */}
          <div className="order-2">{header}</div>
        </div>
      </div>
    </section>
  )
}

/**
 * The four problems as a stack that travels through a fixed highlight band as
 * you scroll, with the section's claim held alongside it.
 *
 * Progressive enhancement, not a branch: the plain list is the baseline and the
 * travel is switched on after mount, only when it's appropriate — wide enough
 * viewport, motion allowed.
 *
 * Scroll-linked motion is bidirectional by nature, so unlike the reveal
 * primitives this replays when scrolling back up. That is what a pinned
 * sequence is, not an oversight.
 */
export function ProblemCycle({ items, header }: Props) {
  const reduce = useReducedMotion()
  const [travelling, setTravelling] = useState(false)

  // After mount only. `travelling` is false during SSR and on the first client
  // render, which is what keeps hydration consistent.
  useEffect(() => {
    const wide = window.matchMedia(WIDE_QUERY)
    const sync = () => setTravelling(wide.matches && !reduce)
    sync()
    wide.addEventListener('change', sync)
    return () => wide.removeEventListener('change', sync)
  }, [reduce])

  return travelling ? (
    <TravellingProblem items={items} header={header} />
  ) : (
    <StaticProblem items={items} header={header} />
  )
}
