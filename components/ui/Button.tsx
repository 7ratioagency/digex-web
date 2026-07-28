import type { ReactNode } from 'react'
import { Link } from '@/lib/i18n/navigation'

type ButtonProps = {
  href: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
  className?: string
}

/** `min-h-11` keeps every button at the 44px minimum touch target. */
const base =
  'inline-flex min-h-11 items-center justify-center gap-section-xs rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue'

const variants = {
  primary: 'bg-foreground text-background hover:opacity-90',
  secondary: 'border border-border text-foreground hover:bg-surface',
} as const

export function Button({
  href,
  variant = 'primary',
  children,
  className = '',
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`

  // tel:/mailto: are external but must stay in the same tab.
  const isHttp = /^https?:/.test(href)
  const isDirect = /^(tel:|mailto:)/.test(href)

  if (isHttp || isDirect) {
    return (
      <a
        href={href}
        className={classes}
        {...(isHttp && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
