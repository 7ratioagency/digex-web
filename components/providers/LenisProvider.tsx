'use client'

import { useEffect } from 'react'
import { useReducedMotion } from 'motion/react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Smooth scroll, opt-out aware.
 *
 * Lenis drives the scroll position itself, so `scroll-behavior: smooth` must
 * NOT be set in CSS — the two fight each other. Anchor smoothness comes from
 * Lenis's `anchors` option instead, and it reads each target's
 * `scroll-margin-top` (our `scroll-mt-24`) so headings clear the sticky header.
 *
 * `useReducedMotion()` is reactive, so flipping the OS preference re-runs this
 * effect and tears Lenis down (or brings it back) without a manual media-query
 * listener.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    // Reduced motion: never start Lenis, leave scrolling to the browser.
    if (reduce) return

    const lenis = new Lenis({
      autoRaf: true,
      // Intercepts same-page hash links, honouring scroll-margin on targets.
      anchors: true,
      // Kills leftover inertia when following a link to another route.
      stopInertiaOnNavigate: true,
    })

    return () => lenis.destroy()
  }, [reduce])

  return <>{children}</>
}
