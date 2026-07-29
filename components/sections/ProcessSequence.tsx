'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useIsomorphicLayoutEffect,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'

export type ProcessStep = { step: string; title: string; body: string }

/** Below this the pin is never used — a phone has no room to scroll sideways. */
const WIDE_QUERY = '(min-width: 1024px)'

function StepBody({ step }: { step: ProcessStep }) {
  return (
    <>
      {/* tabular-nums keeps the 01–05 counters optically aligned */}
      <span className="block text-sm font-semibold tabular-nums text-accent-blue">
        {step.step}
      </span>
      <h3 className="mt-section-xs text-lg font-semibold text-balance">
        {step.title}
      </h3>
      <p className="mt-section-xs leading-relaxed text-pretty text-muted-foreground">
        {step.body}
      </p>
    </>
  )
}

type Props = {
  steps: ProcessStep[]
  /** Rendered on the server and passed down, so it stays a Server Component. */
  header: React.ReactNode
}

function VerticalProcess({ steps, header }: Props) {
  return (
    <section className="scroll-mt-20 bg-surface px-6 py-section-2xl lg:px-8">
      <div className="mx-auto max-w-7xl">
        {header}
        <StaggerGroup
          as="ol"
          className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step) => (
            <StaggerItem
              key={step.step}
              as="li"
              className="border-t border-border pt-section-md"
            >
              <StepBody step={step} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

/**
 * Split out deliberately. `useScroll` binds to its target once, on the mount of
 * the component that calls it — so it cannot live in the parent, where the
 * first mount happens while the fallback is showing and the ref is attached to
 * nothing. Motion reports exactly that ("Target ref is defined but not
 * hydrated") and the track never moves. Mounting this only once pinning is
 * active means the ref is live from its own first commit.
 */
function PinnedProcess({ steps, header }: Props) {
  const [overflow, setOverflow] = useState(0)
  const [rtl, setRtl] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const paneRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)

  // How far the track must travel for its last card to reach the pane's edge.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current
    const pane = paneRef.current
    if (!track || !pane) return

    const measure = () => {
      setRtl(document.documentElement.dir === 'rtl')
      setOverflow(Math.max(0, track.scrollWidth - pane.clientWidth))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(pane)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 0 when the section's top meets the viewport top, 1 when its bottom meets
    // the viewport bottom — exactly the span the pane spends stuck.
    offset: ['start start', 'end end'],
  })

  /*
   * In RTL the row is laid out right-to-left, so the cards overflow past the
   * *left* edge and the track has to travel right (positive x) to bring them
   * in — the mirror image of LTR.
   */
  const x = useTransform(scrollYProgress, [0, 1], [0, rtl ? overflow : -overflow])

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-20 bg-surface"
      // The extra height *is* the scroll budget: each pixel of it advances the
      // track by one, so the pin lasts exactly as long as it needs to.
      style={{ height: `calc(100dvh + ${overflow}px)` }}
    >
      {/*
        overflow-hidden sits on the sticky element itself, never on an ancestor
        — an ancestor with clipped overflow would stop `sticky` working.
      */}
      <div
        ref={paneRef}
        className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">{header}</div>

        <motion.ol
          ref={trackRef}
          style={{ x }}
          className="mt-section-xl flex gap-section-md"
        >
          {steps.map((step) => (
            <li
              key={step.step}
              className="w-[min(78vw,360px)] shrink-0 rounded-2xl border border-border bg-background p-section-md"
            >
              <StepBody step={step} />
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}

/**
 * The five steps as a horizontally-pinned scroll sequence.
 *
 * Built as progressive enhancement, not as a branch. The vertical stack is what
 * the server renders and what the first client render produces, so hydration
 * always matches; the pin is switched on afterwards and only when it's
 * appropriate — wide viewport, motion allowed. Anyone on a phone, with reduced
 * motion set, or with JS disabled simply keeps the stack, which is why there's
 * no separate no-JS story to get wrong.
 *
 * Scroll-linked motion is inherently bidirectional, so unlike the reveal
 * primitives this does replay when scrolling back up — that's the nature of a
 * pin rather than an oversight.
 */
export function ProcessSequence({ steps, header }: Props) {
  const reduce = useReducedMotion()
  const [pinned, setPinned] = useState(false)

  // Runs after mount only. `pinned` is false during SSR and on the first client
  // render, which is what keeps hydration consistent.
  useEffect(() => {
    const wide = window.matchMedia(WIDE_QUERY)
    const sync = () => setPinned(wide.matches && !reduce)
    sync()
    wide.addEventListener('change', sync)
    return () => wide.removeEventListener('change', sync)
  }, [reduce])

  return pinned ? (
    <PinnedProcess steps={steps} header={header} />
  ) : (
    <VerticalProcess steps={steps} header={header} />
  )
}
