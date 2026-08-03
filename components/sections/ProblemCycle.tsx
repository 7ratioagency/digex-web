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

        Left at full `--muted-foreground` rather than faded with the highlight,
        so every body stays readable (7.7:1) wherever it sits in the stack. The
        title's colour carries the focus; dimming the prose as well would cost
        legibility for no extra clarity.
      */}
      <p className="mt-section-sm max-w-prose leading-relaxed text-pretty text-muted-foreground">
        {item.body}
      </p>
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
    <section className="scroll-mt-24 bg-surface px-6 py-section-2xl lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-section-xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-section-2xl">
        <ul className="flex flex-col gap-section-xl lg:order-1">
          {items.map((item, index) => (
            <li key={item.title}>
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
            </li>
          ))}
        </ul>
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
   */
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const next = titlesRef.current.map((el) =>
        el ? el.offsetTop + el.offsetHeight / 2 : 0,
      )
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
      className="scroll-mt-24 h-[300vh] bg-surface"
    >
      {/* overflow-hidden belongs on the sticky element itself — on an ancestor
          it would stop `sticky` working. */}
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-section-2xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
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
