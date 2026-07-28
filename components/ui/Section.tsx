import type { ReactNode } from 'react'

type SectionProps = {
  /** Anchor target for header nav links (#services, #work, #contact) */
  id?: string
  children: ReactNode
  /** Extra classes on the <section>, e.g. a surface background */
  className?: string
}

/**
 * Page section wrapper: consistent vertical rhythm, gutters and max width.
 * `scroll-mt` offsets the sticky header so anchor jumps don't hide the heading.
 */
export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 px-6 py-section-2xl lg:px-8 ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}
