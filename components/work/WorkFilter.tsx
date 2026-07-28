'use client'

import { useState, type ReactNode } from 'react'
import { projectsByCategory, type ProjectCategory } from '@/content/projects'

export type FilterKey = ProjectCategory | 'all'

type Props = {
  /** Server-rendered cards, passed through so this stays a static page. */
  items: { slug: string; card: ReactNode }[]
  /** Filter keys in display order, with their translated labels. */
  filters: { key: FilterKey; label: string }[]
  groupLabel: string
}

export function WorkFilter({ items, filters, groupLabel }: Props) {
  const [active, setActive] = useState<FilterKey>('all')

  const visibleSlugs = new Set(
    projectsByCategory(active).map((project) => project.slug),
  )

  return (
    <>
      <div
        role="group"
        aria-label={groupLabel}
        className="flex flex-wrap gap-section-xs"
      >
        {filters.map(({ key, label }) => {
          const count = projectsByCategory(key).length
          const isActive = key === active

          return (
            <button
              key={key}
              type="button"
              // Categories with no work yet stay visible but inert — that keeps
              // the full taxonomy on show without needing empty-state copy.
              disabled={count === 0}
              aria-pressed={isActive}
              onClick={() => setActive(key)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:text-foreground'
              } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted-foreground`}
            >
              {label}
              <span className="tabular-nums opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      <ul className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.slug}
            className={visibleSlugs.has(item.slug) ? undefined : 'hidden'}
          >
            {item.card}
          </li>
        ))}
      </ul>
    </>
  )
}
