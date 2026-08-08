import type { ReactNode } from 'react'

/**
 * The nav pill. `.nav-pill` (globals.css) is a standalone recipe with its
 * own literal values — not `.glass` — so every property here is exactly
 * what it says: max-width 1100px, centred, 16px from the top, a full pill
 * radius, 12px/24px padding, a translucent background with a strong blur,
 * a 1px border, a soft shadow. It's a single element: `.nav-pill` already
 * centres itself (`margin: 16px auto 0` against its own `max-width`), so
 * there's no separate full-width wrapper doing that job, and nothing needs
 * a `pointer-events` split — the element's own box ends at 1100px, so the
 * page on either side of it was never covered in the first place.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  return <header className="nav-pill">{children}</header>
}
