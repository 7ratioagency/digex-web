'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { Link } from '@/lib/i18n/navigation'
import { ArrowIcon, EyeIcon } from '@/components/icons'
import { DURATION, EASE, RISE, STAGGER, VIEWPORT } from '@/lib/motion'

/**
 * Everything this section needs about one project, already localised on the
 * server. The component never touches `content/projects.ts` directly, so no
 * copy and no locale lookup crosses into the client bundle.
 */
export type WorkItem = {
  slug: string
  client: string
  sector: string
  summary: string
  delivered: string[]
  href: string
  externalUrl: string
  externalLabel: string
}

type Labels = {
  /** Small strip label above the overview slider. */
  overview: string
  /** Link out of the strip to the full portfolio. */
  viewAll: string
  /** Button on each cover. */
  viewCase: string
  /** "What we delivered" heading. */
  delivered: string
  /** Accessible name for the strip's back/forward controls. */
  slidePrev: string
  slideNext: string
}

type Props = {
  /** First three get the full-height cinematic treatment. */
  heroes: WorkItem[]
  /** The remainder ride the horizontal overview strip. */
  rest: WorkItem[]
  labels: Labels
  header: React.ReactNode
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

/**
 * Tolerance around 0/1 for the overview strip's scroll-ratio boundary check,
 * absorbing sub-pixel rounding in `scrollWidth - clientWidth` so the buttons
 * don't stay disabled — or re-enable — a pixel short of the true edge.
 */
const EDGE_EPSILON = 0.02

/*
 * ─── On the covers ──────────────────────────────────────────────────────────
 * The reference reveals a colour photograph out of a greyscale one. There are
 * no project photographs in this repo yet — `/public/work/` does not exist, and
 * `ProjectCard` still carries a TODO about it — so the same reveal runs on a
 * typographic cover instead: a neutral plate that resolves into a brand-tinted
 * one. The mechanic, timing and direction are identical, so dropping real
 * exports in later means swapping these two plates for two <Image> layers and
 * changing nothing else.
 *
 * Stock photography was deliberately not used to fill the gap. These are real
 * Algerian clients; an Unsplash photo sitting under "EVE Accessoires" would be
 * fabricated evidence of work, which is a different and worse problem than an
 * unstyled placeholder.
 */

/** The dimmed, "before" state of a cover. */
function CoverBase({ item }: { item: WorkItem }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-section-sm bg-surface px-section-md text-center">
      <span className="text-xs font-medium uppercase text-muted-foreground ltr:tracking-wide">
        {item.sector}
      </span>
      <span className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight font-semibold text-balance text-muted-foreground tracking-display">
        {item.client}
      </span>
    </div>
  )
}

/** The lit, "after" state — same layout, brand tint, so the reveal reads. */
function CoverLit({ item }: { item: WorkItem }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-section-sm px-section-md text-center"
      style={{
        background: `color-mix(in srgb, var(--brand-500) 10%, var(--surface))`,
      }}
    >
      <span className="text-xs font-medium uppercase text-accent-blue ltr:tracking-wide">
        {item.sector}
      </span>
      <span className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight font-semibold text-balance text-foreground tracking-display">
        {item.client}
      </span>
    </div>
  )
}

/**
 * One staged block of copy on the content side. Fades and rises once scroll
 * progress passes its threshold, matching the reference's `data-progress`
 * steps at 0.2 / 0.4 / 0.6 / 0.8.
 */
function RevealStep({
  at,
  progress,
  className = '',
  children,
}: {
  at: number
  progress: MotionValue<number>
  className?: string
  children: React.ReactNode
}) {
  /*
   * Function form, not the `[input] -> [output]` array form.
   *
   * The array form silently failed here: Motion wrote the step's initial
   * `opacity: 0` once and then never updated it again, even though the
   * clip-path on the same `scrollYProgress` tracked perfectly. The visible
   * result was copy that faded *out* as you scrolled instead of in. The
   * function form reads the value on every frame and behaves.
   */
  const eased = (p: number) => clamp01((p - at) / 0.12)
  const opacity = useTransform(progress, eased)
  const y = useTransform(progress, (p) => RISE * (1 - eased(p)))

  return (
    <motion.div
      // Threshold is exposed so the staging can be asserted against the exact
      // element rather than a structural guess at the DOM.
      data-reveal-step={at}
      /*
       * Never branched on the motion preference.
       *
       * Dropping the style under reduced motion looks like the safe thing to
       * do and is the opposite: Motion simply stops updating the element and
       * strands it on the last value it wrote — which, at scroll progress 0,
       * is `opacity: 0`. The copy then never appears for exactly the users who
       * can least afford to miss it. `data-reduce-safe` is how the rest of this
       * codebase solves it: identical markup on both sides, with the rule in
       * globals.css painting the finished state under `prefers-reduced-motion`.
       */
      data-reduce-safe=""
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * One project as a pinned, full-height scene: the cover resolves from neutral
 * to brand as you scroll through it, while the copy arrives a block at a time.
 *
 * The reference drives this from a raw `scroll` listener plus
 * `getBoundingClientRect`; this uses Motion's `useScroll` bound to the scene's
 * own ref, which reads the same position without a second listener and leaves
 * Lenis in sole control of scrolling.
 */
function CinematicProject({
  item,
  index,
  reversed,
  labels,
  reduce,
}: {
  item: WorkItem
  index: number
  reversed: boolean
  labels: Labels
  reduce: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 when the scene's top meets the viewport top, 1 when its bottom meets
    // the viewport bottom — exactly the span the pane spends pinned.
    offset: ['start start', 'end end'],
  })

  /*
   * Reveal runs bottom-inset → 0, i.e. top to bottom.
   *
   * The reference switches to a horizontal wipe under 768px. That axis mirrors,
   * so it would wipe from the wrong edge at /ar; keeping the wipe vertical at
   * every width sidesteps the whole problem and looks identical either way.
   */
  const clipPath = useTransform(
    scrollYProgress,
    (p) => `inset(0 0 ${(1 - p) * 100}% 0)`,
  )

  return (
    // 220vh is the scroll budget per scene — a screen of pin plus a screen and
    // a bit of travel, close to the reference's 250vh. Below `md` the scene
    // falls back to natural height and simply stacks, as the reference does.
    <div ref={ref} className="relative md:h-[220vh]" data-work-scene="">
      <div className="md:sticky md:top-0 md:h-dvh md:overflow-hidden">
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {/* ── Cover ─────────────────────────────────────────────── */}
          <div
            className={`relative min-h-[60vh] overflow-hidden md:min-h-0 ${
              reversed ? 'md:order-2' : ''
            }`}
          >
            <CoverBase item={item} />

            <motion.div
              aria-hidden="true"
              /*
               * Same rule as the copy steps: the style is never branched on the
               * motion preference, because Motion would then strand this layer
               * on its initial fully-clipped value and the cover would never
               * resolve. `data-reduce-clip` drops the clip entirely under
               * `prefers-reduced-motion`, showing the finished cover at once.
               */
              data-reduce-clip=""
              style={{ clipPath }}
              className="absolute inset-0 will-change-[clip-path]"
            >
              <CoverLit item={item} />
            </motion.div>

            {/* Decorative corner rules, straight from the reference. */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-s-0 top-0 h-px w-8 bg-foreground/25" />
              <div className="absolute inset-s-0 top-0 h-8 w-px bg-foreground/25" />
              <div className="absolute inset-e-0 bottom-0 h-px w-8 bg-foreground/25" />
              <div className="absolute inset-e-0 bottom-0 h-8 w-px bg-foreground/25" />
            </div>
          </div>

          {/* ── Copy ──────────────────────────────────────────────── */}
          <div
            className={`flex items-center justify-center px-6 py-section-xl lg:px-8 ${
              reversed ? 'md:order-1' : ''
            }`}
          >
            <div className="flex w-full max-w-md flex-col gap-section-lg">
              <RevealStep at={0.2} progress={scrollYProgress}>
                <span className="text-sm font-semibold tabular-nums text-accent-blue">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-section-xs text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
                  {item.client}
                </h3>
                <p className="mt-section-xs text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
                  {item.sector}
                </p>
              </RevealStep>

              <RevealStep at={0.4} progress={scrollYProgress}>
                <p className="border-t border-border pt-section-md leading-relaxed text-pretty text-muted-foreground">
                  {item.summary}
                </p>
              </RevealStep>

              <RevealStep at={0.6} progress={scrollYProgress}>
                <p className="text-xs font-medium uppercase text-muted-foreground ltr:tracking-wide">
                  {labels.delivered}
                </p>
                <ul className="mt-section-sm flex flex-wrap gap-section-xs">
                  {item.delivered.map((d) => (
                    <li
                      key={d}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </RevealStep>

              <RevealStep
                at={0.8}
                progress={scrollYProgress}
                className="flex flex-wrap items-center gap-section-md"
              >
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center gap-section-xs rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                >
                  {labels.viewCase}
                  <EyeIcon className="size-4" />
                </Link>
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-section-xs text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                >
                  {item.externalLabel}
                </a>
              </RevealStep>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * A card in the overview strip. Hovering (or touching) opens a circle of
 * brand-tinted cover from the exact point of contact — the reference's
 * `clip-path: circle()` reveal, kept as-is because it is the nicest detail in
 * the original.
 */
function OverviewCard({
  item,
  labels,
  reduce,
}: {
  item: WorkItem
  labels: Labels
  reduce: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  /** Anchor the circle where the pointer entered, as a percentage. */
  const anchor = (clientX: number, clientY: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--reveal-x', `${((clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty('--reveal-y', `${((clientY - rect.top) / rect.height) * 100}%`)
    setActive(true)
  }

  return (
    <div
      ref={ref}
      onMouseEnter={(e) => anchor(e.clientX, e.clientY)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={(e) => anchor(e.touches[0].clientX, e.touches[0].clientY)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border transition-colors duration-500 hover:border-accent-blue/50"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <CoverBase item={item} />

        <div
          aria-hidden="true"
          /*
           * The timing lives in classes, not in `style`, so the
           * `motion-reduce:` variant can switch it off without the markup
           * differing between server and client. Branching the inline
           * `transition` on the preference produced a hydration mismatch —
           * the server has no way to know it.
           *
           * Long, soft easing: the slow bloom is the point of the effect.
           */
          className="absolute inset-0 transition-[clip-path] duration-[1600ms] ease-[cubic-bezier(0.15,0.85,0.35,1)] motion-reduce:transition-none"
          style={{
            // `active` starts false on both sides, so this string is identical
            // at hydration; only a real pointer can change it.
            clipPath: `circle(${active && !reduce ? '150%' : '0%'} at var(--reveal-x, 50%) var(--reveal-y, 50%))`,
          }}
        >
          <CoverLit item={item} />
        </div>

        <div
          className={`absolute inset-x-0 bottom-section-md flex justify-center transition-all duration-500 motion-reduce:transition-none ${
            active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <Link
            href={item.href}
            className="glass inline-flex min-h-11 items-center gap-section-xs rounded-full px-5 text-xs font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          >
            {labels.viewCase}
            <EyeIcon className="size-4" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-section-md">
        <p className="text-xs font-medium uppercase text-muted-foreground ltr:tracking-wide">
          {item.sector}
        </p>
        <h3 className="mt-1 text-base font-semibold">{item.client}</h3>
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-section-sm inline-flex min-h-11 items-center gap-section-xs text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
        >
          {item.externalLabel}
          <ArrowIcon className="size-4" />
        </a>
      </div>
    </div>
  )
}

/** Horizontal overview strip with a snap-scrolling track and a progress thumb. */
function OverviewStrip({
  items,
  labels,
  reduce,
}: {
  items: WorkItem[]
  labels: Labels
  reduce: boolean | null
}) {
  const trackRef = useRef<HTMLUListElement>(null)
  const cardRefs = useRef<(HTMLLIElement | null)[]>([])
  const [progress, setProgress] = useState(0)
  const [scrollable, setScrollable] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const sync = () => {
      const max = track.scrollWidth - track.clientWidth
      setScrollable(max > 1)
      // `scrollLeft` runs negative in RTL on most engines; the magnitude is
      // what matters, so the same maths serves both directions.
      setProgress(max > 1 ? Math.min(1, Math.abs(track.scrollLeft) / max) : 0)
    }

    sync()
    track.addEventListener('scroll', sync, { passive: true })
    const observer = new ResizeObserver(sync)
    observer.observe(track)
    return () => {
      track.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [items.length])

  /*
   * Tracks which card is currently the leading (reading-start) one in view, so
   * a button click knows which neighbour to jump to.
   *
   * This drives *only* which card `goTo` targets, deliberately not whether the
   * buttons are disabled — `progress` (above) does that. The trailing card in
   * a track whose total width doesn't divide evenly into the viewport can
   * never reach intersection ratio 1, so `activeIndex` was measured to plateau
   * one short of the true last card once you scroll to the end: harmless for
   * picking a target (re-requesting the same card is a no-op), but it left
   * `next` permanently enabled at the actual boundary. `progress` reads the
   * real scroll position, so it doesn't share that blind spot.
   *
   * Driven by intersection rather than by reading `scrollLeft` back out: the
   * sign and starting point of `scrollLeft` under `dir="rtl"` differ across
   * browser engines (Chromium/Firefox go negative, older Safari doesn't), so
   * any arithmetic on it is a cross-browser trap. Intersection ratios carry no
   * direction at all — "which card is most visible" means the same thing
   * everywhere.
   */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    /*
     * A callback's `entries` is only the cards whose ratio crossed a threshold
     * since the *previous* callback — not every observed card. Reducing over
     * just that subset picks the most-visible card among whichever two or
     * three happened to change this tick, which mid-scroll is often the card
     * being left rather than the one arriving; measured, it left `next`
     * permanently disabled after a few clicks because the observer never again
     * reported the true trailing card as "most visible" in a single batch.
     * Keeping a ratio for every card and recomputing the max across all of
     * them, every time, is what makes this actually reflect current state.
     */
    const ratios = new Map<Element, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio))

        let bestIndex = -1
        let bestRatio = 0
        cardRefs.current.forEach((el, i) => {
          const ratio = el ? (ratios.get(el) ?? 0) : 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIndex = i
          }
        })
        if (bestIndex !== -1) setActiveIndex(bestIndex)
      },
      { root: track, threshold: [0.25, 0.5, 0.75, 1] },
    )

    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [items.length])

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    cardRefs.current[clamped]?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      inline: 'start',
      block: 'nearest',
    })
  }

  return (
    <div className="border-t border-border pt-section-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-end justify-between gap-section-md border-b border-border pb-section-sm">
          <span className="text-xs font-semibold uppercase text-muted-foreground ltr:tracking-wide">
            {labels.overview}
          </span>

          <div className="flex items-center gap-section-md">
            {/*
              Explicit controls, not just the scrollable track. Trackpad swipe
              and shift+wheel move it, but neither is discoverable — the strip
              gave no visible sign it was interactive. Hidden entirely when
              there's nothing to scroll to, same condition as the progress
              thumb below.
            */}
            {scrollable && (
              <div className="flex items-center gap-section-xs">
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={progress <= EDGE_EPSILON}
                  aria-label={labels.slidePrev}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                >
                  {/* `rotate-180` reverses the icon's own already-RTL-correct
                      "forward" direction — a point reflection, so it points
                      backward correctly in both directions without a second
                      SVG or a manual rtl: override. */}
                  <ArrowIcon className="size-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={progress >= 1 - EDGE_EPSILON}
                  aria-label={labels.slideNext}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                >
                  <ArrowIcon className="size-4" />
                </button>
              </div>
            )}

            <Link
              href="/work"
              className="group inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-foreground transition-colors hover:text-accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            >
              {labels.viewAll}
              <ArrowIcon className="size-4" />
            </Link>
          </div>
        </div>

        <motion.ul
          ref={trackRef}
          initial="strip-hidden"
          whileInView="strip-visible"
          viewport={VIEWPORT}
          variants={{
            'strip-hidden': {},
            'strip-visible': {
              transition: { staggerChildren: reduce ? 0 : STAGGER },
            },
          }}
          className="no-scrollbar mt-section-lg flex snap-x snap-mandatory gap-section-md overflow-x-auto pb-section-md"
        >
          {items.map((item, index) => (
            <motion.li
              key={item.slug}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              data-reduce-safe=""
              variants={{
                'strip-hidden': { opacity: 0, y: -RISE },
                'strip-visible': {
                  opacity: 1,
                  y: 0,
                  // A spring stands in for the reference's elastic easing —
                  // same overshoot, without pulling in a second animation
                  // library for one keyframe.
                  transition: reduce
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 220, damping: 18, mass: 0.6 },
                },
              }}
              className="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-88"
            >
              <OverviewCard item={item} labels={labels} reduce={reduce} />
            </motion.li>
          ))}
        </motion.ul>

        {/* Progress thumb. Hidden when the track has nothing to scroll. */}
        {scrollable && (
          <div className="relative mx-auto h-0.5 w-24 overflow-hidden rounded-full bg-border">
            <div
              className="absolute inset-y-0 w-8 rounded-full bg-foreground transition-[inset-inline-start] duration-75"
              // Logical offset so the thumb tracks from the reading-start edge
              // in both directions. The track is 3x the thumb, so full travel
              // is two thirds of its width.
              style={{ insetInlineStart: `${progress * 66.6}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * The work section as a cinematic sequence: the first three projects each get a
 * pinned full-height scene, and everything after them rides a horizontal
 * overview strip.
 *
 * Adapted from a GSAP-free reference that used anime.js and lucide-react;
 * neither is installed. The stagger is a Motion spring and the eye is a
 * hand-drawn icon, per the project's no-icon-library rule.
 */
export function WorkCinematic({ heroes, rest, labels, header }: Props) {
  const reduce = useReducedMotion()

  return (
    // `on-navy` (globals.css) — a navy beat in the paper rhythm, DESIGN.md
    // §3 rule 1. Background/token flip only; nothing inside changes.
    <section id="work" className="on-navy scroll-mt-24">
      <div className="px-6 pt-section-2xl lg:px-8">
        <div className="mx-auto max-w-7xl">{header}</div>
      </div>

      <div className="mt-section-xl">
        {heroes.map((item, index) => (
          <CinematicProject
            key={item.slug}
            item={item}
            index={index}
            // Alternate sides so the eye moves across the page, as the
            // reference does with its `reversed` flag.
            reversed={index % 2 !== 0}
            labels={labels}
            reduce={reduce}
          />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-section-2xl pb-section-2xl">
          <OverviewStrip items={rest} labels={labels} reduce={reduce} />
        </div>
      )}
    </section>
  )
}
