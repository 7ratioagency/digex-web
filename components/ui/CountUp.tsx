'use client'

import { useRef } from 'react'
import {
  animate,
  motion,
  useIsomorphicLayoutEffect,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { EASE } from '@/lib/motion'

type Props = {
  value: number
  /** Rendered verbatim after the number, e.g. "+". */
  suffix?: string
  className?: string
  /** Seconds. Ignored under reduced motion. */
  duration?: number
}

/**
 * Counts up to `value` once, when scrolled into view.
 *
 * The counter starts at 0 on both server and client so hydration matches — the
 * motion preference can't be known during SSR, so it must not decide what gets
 * rendered. Reduced motion jumps straight to the final value in a layout
 * effect, which commits before paint so there's no visible tick. (CSS can't
 * help here the way it does for the other primitives: this is text content.)
 *
 * Trigger is a plain IntersectionObserver rather than Framer's viewport props.
 * Neither `useInView` nor `onViewportEnter` fired for this element in practice
 * — `onViewportEnter` appears to need an accompanying `whileInView` to switch
 * the viewport feature on — and this is explicit and self-contained.
 *
 * `tabular-nums` is applied here rather than left to the caller — proportional
 * digits change width as the number climbs, jittering the layout throughout.
 */
export function CountUp({
  value,
  suffix = '',
  className,
  duration = 1.2,
}: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)

  const count = useMotionValue(0)
  const display = useTransform(count, (latest) => Math.round(latest).toString())

  useIsomorphicLayoutEffect(() => {
    if (reduce) {
      count.set(value)
      return
    }

    const element = ref.current
    if (!element) return

    let controls: ReturnType<typeof animate> | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        // Count once, then stop watching.
        observer.disconnect()
        controls = animate(count, value, { duration, ease: EASE })
      },
      // Fires once the element is ~10% into the viewport.
      { rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      controls?.stop()
    }
  }, [count, duration, reduce, value])

  return (
    <span
      ref={ref}
      // The ticking digits are hidden from AT, which gets the final value.
      aria-label={`${value}${suffix}`}
      className={`tabular-nums ${className ?? ''}`}
    >
      <span aria-hidden="true">
        <motion.span>{display}</motion.span>
        {suffix}
      </span>
    </span>
  )
}
