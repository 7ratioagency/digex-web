// Destination in repo: components/icons/index.tsx
//
// Hand-drawn service icons. No icon library — this is what makes the site
// feel custom rather than assembled.
//
// Design system:
//   - 24x24 viewBox, stroke-only, no fills
//   - strokeWidth 1.5, round caps and joins
//   - stroke="currentColor" so colour is inherited from the parent
//   - pass `animate` to draw the icon in when it scrolls into view

'use client'

import {
  motion,
  useReducedMotion,
  type SVGMotionProps,
  type Variants,
} from 'motion/react'
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  /** Draw the icon in on scroll into view */
  animate?: boolean
}

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      opacity: { delay: i * 0.15, duration: 0.2 },
    },
  }),
}

function IconShell({
  animate = false,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const active = animate && !reduce

  return (
    <motion.svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial={active ? 'hidden' : false}
      whileInView={active ? 'visible' : undefined}
      // Bottom edge only. '-15%' on its own is shorthand for all four sides,
      // which shrank the box horizontally too — icons in a grid's first column
      // sat outside it and never drew.
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      {...(props as SVGMotionProps<SVGSVGElement>)}
    >
      {children}
    </motion.svg>
  )
}

/* ---------------------------------------------------------------
   Development — a browser window with a cursor, not a generic </>
   --------------------------------------------------------------- */
export function DevelopmentIcon({ animate, ...props }: IconProps) {
  return (
    <IconShell animate={animate} {...props}>
      <motion.rect
        x="2.5" y="3.5" width="19" height="14" rx="2.5"
        variants={draw} custom={0}
      />
      <motion.path d="M2.5 7.5h19" variants={draw} custom={1} />
      <motion.path d="M5.5 5.5h.01M8 5.5h.01" variants={draw} custom={1} />
      <motion.path d="M8 11l-2 2 2 2" variants={draw} custom={2} />
      <motion.path d="M13 11l2 2-2 2" variants={draw} custom={2} />
      <motion.path d="M17.5 20.5h-11" variants={draw} custom={3} />
    </IconShell>
  )
}

/* ---------------------------------------------------------------
   Brand — a bezier pen path with control points
   --------------------------------------------------------------- */
export function BrandIcon({ animate, ...props }: IconProps) {
  return (
    <IconShell animate={animate} {...props}>
      <motion.path
        d="M3 19c0-8 5-13 11-13 3 0 5 1.5 5 4 0 4-4 6-8 6"
        variants={draw} custom={0}
      />
      <motion.circle cx="3" cy="19" r="1.75" variants={draw} custom={1} />
      <motion.circle cx="19" cy="10" r="1.75" variants={draw} custom={2} />
      <motion.path d="M14 16h6M17 13v6" variants={draw} custom={3} />
    </IconShell>
  )
}

/* ---------------------------------------------------------------
   Marketing — a rising signal with a target, not a megaphone
   --------------------------------------------------------------- */
export function MarketingIcon({ animate, ...props }: IconProps) {
  return (
    <IconShell animate={animate} {...props}>
      <motion.path d="M3 20V4" variants={draw} custom={0} />
      <motion.path d="M3 20h18" variants={draw} custom={0} />
      <motion.path d="M6.5 16l4-4.5 3 2.5L19 7" variants={draw} custom={1} />
      <motion.circle cx="19" cy="7" r="2.25" variants={draw} custom={2} />
      <motion.path d="M19 3.5v1M19 9.5v1M15.5 7h1M21.5 7h1" variants={draw} custom={3} />
    </IconShell>
  )
}

/* ---------------------------------------------------------------
   Production — a camera aperture inside a frame
   --------------------------------------------------------------- */
export function ProductionIcon({ animate, ...props }: IconProps) {
  return (
    <IconShell animate={animate} {...props}>
      <motion.rect
        x="2.5" y="5.5" width="14" height="13" rx="2.5"
        variants={draw} custom={0}
      />
      <motion.path
        d="M16.5 10.5l4-2.5v8l-4-2.5z"
        variants={draw} custom={1}
      />
      <motion.circle cx="9.5" cy="12" r="3" variants={draw} custom={2} />
      <motion.path d="M9.5 9v6M6.9 10.5l5.2 3" variants={draw} custom={3} />
    </IconShell>
  )
}

/* ---------------------------------------------------------------
   Print — a printer with a sheet emerging, plus registration mark
   --------------------------------------------------------------- */
export function PrintIcon({ animate, ...props }: IconProps) {
  return (
    <IconShell animate={animate} {...props}>
      <motion.path
        d="M7 8V4.5a1 1 0 011-1h8a1 1 0 011 1V8"
        variants={draw} custom={0}
      />
      <motion.rect
        x="2.5" y="8" width="19" height="8" rx="2"
        variants={draw} custom={1}
      />
      <motion.path
        d="M7 14h10v6.5a0 0 0 010 0H7a0 0 0 010 0z"
        variants={draw} custom={2}
      />
      <motion.path d="M9.5 17h5M9.5 19.5h3" variants={draw} custom={3} />
      <motion.path d="M18.5 10.75h.01" variants={draw} custom={3} />
    </IconShell>
  )
}

/* ---------------------------------------------------------------
   Directional arrow — flips automatically in RTL
   --------------------------------------------------------------- */
export function ArrowIcon({
  className = '',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      // Merged, not spread-over: a caller passing `className` must not be able
      // to drop the RTL flip.
      className={`rtl:-scale-x-100 ${className}`}
      {...props}
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  )
}

/* ---------------------------------------------------------------
   Vertical arrow — same both directions, no RTL flip needed
   --------------------------------------------------------------- */
export function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 20V4M6 10l6-6 6 6" />
    </svg>
  )
}

/* ---------------------------------------------------------------
   Social icons — simple line-art marks, same stroke language as
   the service icons above. Not literal logo redraws.
   --------------------------------------------------------------- */
export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16.5 4h-2A3.5 3.5 0 0011 7.5V10" />
      <path d="M8 10.5h6" />
      <path d="M11 10.5V20" />
    </svg>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M16.7 7.3h.01" />
    </svg>
  )
}

export function BehanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6h4.5a2.5 2.5 0 010 5H4z" />
      <path d="M4 11h5a2.75 2.75 0 010 5.5H4z" />
      <path d="M14 8.5h6" />
      <path d="M14.3 14a3.2 3.2 0 106.2-1c-.3-1.6-1.5-2.6-3-2.6-2 0-3.5 1.6-3.5 3.9 0 2.3 1.5 3.9 3.6 3.9 1.3 0 2.3-.5 3-1.6" />
    </svg>
  )
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" />
    </svg>
  )
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M13 4v10.5a2.75 2.75 0 11-2.75-2.75c.27 0 .53.03.78.09" />
      <path d="M13 4c.3 2.1 1.8 3.6 4 3.9" />
    </svg>
  )
}

/* ---------------------------------------------------------------
   Header controls — theme toggle and mobile menu
   --------------------------------------------------------------- */
export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M3 12h2M19 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5" />
    </svg>
  )
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 14.5A8.5 8.5 0 1110.5 4a6.8 6.8 0 009.5 10.5z" />
    </svg>
  )
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}