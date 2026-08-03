import type { ReactNode } from 'react'

type SectionProps = {
  /** Anchor target for header nav links (#services, #work, #contact) */
  id?: string
  children: ReactNode
  /** Extra classes on the <section>, e.g. a surface background */
  className?: string
  /**
   * Decorative layer rendered edge-to-edge behind the content, outside the
   * `max-w-7xl` wrapper — content is centred and width-capped, a backdrop
   * usually shouldn't be. Pair it with `isolate` on `className` so a negative
   * z-index stays inside this section.
   */
  backdrop?: ReactNode
}

/**
 * Page section wrapper: consistent vertical rhythm, gutters and max width.
 * `scroll-mt` offsets the sticky header so anchor jumps don't hide the heading.
 */
export function Section({
  id,
  children,
  className = '',
  backdrop,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 px-6 py-section-2xl lg:px-8 ${className}`}
    >
      {backdrop}
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}
