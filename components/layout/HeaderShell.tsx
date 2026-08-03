'use client'

import { useEffect, useState } from 'react'

/**
 * A floating glass pill rather than a full-width bar.
 *
 * At the top of the page the pill is completely invisible — transparent
 * background and border — so the hero reads edge to edge and nothing competes
 * with the headline. Past the first few pixels it resolves into the site's
 * signature glass (DESIGN.md §2) and floats over the content scrolling beneath
 * it.
 *
 * `.glass` is used rather than a hand-rolled translucent background plus
 * backdrop-blur because the tokens behind it are already resolved per theme —
 * a fixed dark tint would look right in dark mode and wrong in light. The
 * reference this is modelled on is dark-only, so it can hard-code one; this
 * site cannot. `rounded-full` overrides the
 * utility's default `--radius-glass`, and the blur is nudged up locally: the
 * 20px house value is tuned for panels sitting on a known surface, while this
 * passes over every section on the page and needs more separation to stay
 * legible. Scoped to this element, so the token itself is untouched.
 *
 * `pointer-events-none` on the header with `pointer-events-auto` on the pill is
 * load-bearing, not tidiness: the header spans the full width but only the pill
 * is visible, so without it the transparent gutter either side would swallow
 * clicks meant for the page behind it.
 *
 * No `useReducedMotion()` here, deliberately. What transitions is colour, blur
 * and shadow — nothing moves, so there is no vestibular trigger — and it's a
 * plain CSS transition rather than a motion/react animation.
 * `motion-reduce:transition-none` is the correct guard for that, and it applies
 * before JS runs; routing it through a hook would be strictly worse.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="pointer-events-none sticky top-0 z-50 flex justify-center px-4 py-section-sm">
      <div
        className={`pointer-events-auto w-full max-w-5xl rounded-full border transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500 motion-reduce:transition-none ${
          scrolled
            ? 'glass [--glass-blur:32px]'
            : 'border-transparent bg-transparent'
        }`}
      >
        {children}
      </div>
    </header>
  )
}
