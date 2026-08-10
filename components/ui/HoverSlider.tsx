'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { Link } from '@/lib/i18n/navigation'

/**
 * A hover/focus-driven slider: a column of labels on one side, a stack of
 * panels on the other, where pointing at a label reveals its panel.
 *
 * Content-agnostic on purpose. The reference this is adapted from hard-wires
 * `<img>` into the panel, which would have meant a second component the moment
 * anything other than an image needed revealing — here the panel takes
 * children, so the services section can put a whole card in it.
 *
 * Exposed as a tablist rather than as decorative hover text. Hover alone is
 * unreachable by keyboard and absent on touch, so the labels are real buttons
 * with `role="tab"`, roving tabindex and arrow-key support, and the panels are
 * `role="tabpanel"`. Pointing, tapping and tabbing all select.
 */

type HoverSliderContextValue = {
  activeIndex: number
  setActive: (index: number) => void
  baseId: string
}

const HoverSliderContext = createContext<HoverSliderContextValue | null>(null)

function useHoverSlider() {
  const context = useContext(HoverSliderContext)
  if (!context) {
    throw new Error('HoverSlider parts must be rendered inside <HoverSlider>')
  }
  return context
}

/**
 * How a label is broken up for the staggered swap.
 *
 * `grapheme` gives the reference's per-character ripple. `word` exists because
 * Arabic is cursive: a letter's rendered form depends on its neighbours, so
 * wrapping each letter in its own element severs the joins and the word
 * visually disintegrates — the same reason `SplitText` in this codebase splits
 * on whitespace and never on letters.
 */
export type SegmentMode = 'grapheme' | 'word'

/**
 * Deliberately not `Intl.Segmenter`. Its output depends on the resolved locale,
 * which is Node's default on the server and the browser's on the client — a
 * quiet route to a hydration mismatch. Both branches below are pure string
 * operations that produce identical output everywhere.
 */
function segment(text: string, mode: SegmentMode): string[] {
  // The capturing group keeps whitespace as its own segment, so spacing
  // survives the split instead of being reconstructed.
  return mode === 'word' ? text.split(/(\s+)/) : Array.from(text)
}

export function HoverSlider({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const baseId = useId()

  const setActive = useCallback((index: number) => setActiveIndex(index), [])
  const value = useMemo(
    () => ({ activeIndex, setActive, baseId }),
    [activeIndex, setActive, baseId],
  )

  return (
    <HoverSliderContext.Provider value={value}>
      <div className={className}>{children}</div>
    </HoverSliderContext.Provider>
  )
}

/**
 * The labels' container.
 *
 * Arrow handling is vertical-only (`ArrowUp`/`ArrowDown`) on purpose: the
 * horizontal arrows swap meaning between LTR and RTL, so avoiding them removes
 * a whole class of direction bug rather than papering over it. `Home`/`End`
 * carry no direction either.
 */
export function HoverSliderTriggerList({
  children,
  className = '',
  label,
}: {
  children: React.ReactNode
  className?: string
  /** Accessible name for the tablist. */
  label: string
}) {
  const { activeIndex, setActive } = useHoverSlider()
  const listRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const handled = ['ArrowDown', 'ArrowUp', 'Home', 'End']
    if (!handled.includes(event.key)) return

    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    )
    if (tabs.length === 0) return

    event.preventDefault()

    let next = activeIndex
    if (event.key === 'ArrowDown') next = (activeIndex + 1) % tabs.length
    if (event.key === 'ArrowUp') next = (activeIndex - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1

    setActive(next)
    tabs[next]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="vertical"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {children}
    </div>
  )
}

export function HoverSliderTrigger({
  index,
  text,
  href,
  segmentBy = 'grapheme',
  className = '',
  leading,
  trailing,
}: {
  index: number
  text: string
  /**
   * When set, the row is a real `<Link>` to this destination instead of a
   * plain `<button>` — clicking it navigates. Hover, focus and the reveal
   * animation are unchanged either way: both render the identical markup
   * below and share the exact same handlers, so `setActive` still fires on
   * `mouseEnter`/`focus`/`click` regardless of which tag renders.
   */
  href?: string
  segmentBy?: SegmentMode
  className?: string
  /** Slot before the label — an ordinal, a bullet, an icon. */
  leading?: React.ReactNode
  /** Slot pushed to the inline-end — usually an active-state affordance. */
  trailing?: React.ReactNode
}) {
  const { activeIndex, setActive, baseId } = useHoverSlider()
  const reduce = useReducedMotion()
  const isActive = activeIndex === index
  const segments = useMemo(() => segment(text, segmentBy), [text, segmentBy])

  // Shared across both the `<Link>` and `<button>` branches below, so the
  // two can never drift apart on role, keyboard, or reveal behaviour.
  const sharedProps = {
    role: 'tab' as const,
    id: `${baseId}-tab-${index}`,
    'aria-controls': `${baseId}-panel-${index}`,
    'aria-selected': isActive,
    // Roving tabindex: one stop for the whole list, arrows move within it.
    tabIndex: isActive ? 0 : -1,
    onMouseEnter: () => setActive(index),
    onFocus: () => setActive(index),
    onClick: () => setActive(index),
    // Exposed so callers can style their own slots off the selected state
    // with `group-data-[active=true]:` variants.
    'data-active': isActive,
    className: `group flex w-full cursor-pointer items-center gap-section-md text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue ${className}`,
  }

  const content = (
    <>
      {/*
        The label is announced once, from here. Every segment below is
        aria-hidden so assistive tech reads "Web development" rather than
        spelling it out one glyph at a time.
      */}
      <span className="sr-only">{text}</span>

      {leading}

      <span aria-hidden="true" className="relative inline-block">
        {segments.map((piece, pieceIndex) => (
          <span
            key={`${piece}-${pieceIndex}`}
            className="relative inline-block overflow-hidden whitespace-pre"
          >
            {/*
              Only `transition` branches on the motion preference — it never
              reaches the DOM, so markup stays identical between server and
              client. Reduced motion gets the same swap at zero duration
              instead of a suppressed one that could strand a layer mid-slide.
            */}
            <MotionConfig
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      delay: pieceIndex * 0.025,
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }
              }
            >
              {/* Resting copy, rising out of frame when selected. */}
              <motion.span
                className="inline-block text-muted-foreground"
                initial={{ y: '0%' }}
                animate={isActive ? { y: '-110%' } : { y: '0%' }}
              >
                {piece}
              </motion.span>

              {/* Selected copy, arriving from below. */}
              <motion.span
                className="absolute inset-s-0 top-0 inline-block text-foreground"
                initial={{ y: '110%' }}
                animate={isActive ? { y: '0%' } : { y: '110%' }}
              >
                {piece}
              </motion.span>
            </MotionConfig>
          </span>
        ))}
      </span>

      {trailing && <span className="ms-auto">{trailing}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} {...sharedProps}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" {...sharedProps}>
      {content}
    </button>
  )
}

/** Stacks every panel into one grid cell so they cross-fade in place. */
export function HoverSliderPanels({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`grid *:col-start-1 *:row-start-1 ${className}`}>
      {children}
    </div>
  )
}

/*
 * A crossfade, not the reference's clip wipe.
 *
 * The reference wipes a `clip-path` open from the top edge. With photographs
 * that reads fine; with cards it does not, because the outgoing panel is still
 * clipping away from the same edge the incoming one is clipping open from —
 * measured mid-swap, the old card sat at 75.6% while the new one was at 24.3%,
 * so for roughly 400ms two different cards' headings were composited over each
 * other. Replacing the same content in the same container is exactly what a
 * crossfade is for.
 *
 * Only `opacity` and `transform` animate, both compositor-only. The incoming
 * panel also rises a few pixels, which reads as "arriving" rather than merely
 * appearing.
 */
const panelVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 10 },
}

export function HoverSliderPanel({
  index,
  children,
  className = '',
}: {
  index: number
  children: React.ReactNode
  className?: string
}) {
  const { activeIndex, baseId } = useHoverSlider()
  const reduce = useReducedMotion()
  const isActive = activeIndex === index

  return (
    <motion.div
      role="tabpanel"
      id={`${baseId}-panel-${index}`}
      aria-labelledby={`${baseId}-tab-${index}`}
      /*
       * Hidden panels still occupy the grid cell — that is what keeps the
       * container height stable — so without this their links would stay in the
       * tab order and be reachable while invisible. `inert` takes them out of
       * both focus and the accessibility tree.
       */
      inert={!isActive}
      variants={panelVariants}
      animate={isActive ? 'visible' : 'hidden'}
      /*
       * Asymmetric on purpose. The outgoing panel leaves in about 60% of the
       * time the incoming one takes, and the incoming one waits out most of
       * that exit before starting, so the two are never both legible at once.
       * Total settle is ~330ms, inside the 400ms ceiling for a transition of
       * this size; the old wipe ran 800ms.
       *
       * Easing follows the house convention: ease-out arriving, ease-in
       * leaving.
       */
      transition={
        reduce
          ? { duration: 0 }
          : isActive
            ? { duration: 0.26, delay: 0.07, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.16, ease: [0.4, 0, 1, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
