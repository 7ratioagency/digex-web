'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { CloseIcon, MenuIcon } from '@/components/icons'
import { LanguageSwitcher } from './LanguageSwitcher'

type NavLink = { href: string; label: string }

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const t = useTranslations('nav')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    function onClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  return (
    <div ref={panelRef} className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
      >
        <span className="sr-only">{t('menu')}</span>
        {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            /*
              Detached from the pill by a small gap so it reads as a second
              floating surface rather than a square panel hanging off a rounded
              bar. Shares the pill's shape language — generous radius, hairline
              border, soft shadow — but is opaque, for two reasons.

              Legibility first: `.glass` at 0.55 alpha is tuned for a small pill
              with almost nothing behind it, and across a full menu panel the
              page read straight through, with the links colliding with the
              headings underneath.

              And translucency here cannot work anyway. This panel renders
              inside the pill, and an element with `backdrop-filter` becomes the
              backdrop root for its descendants — so any blur set here samples
              the pill, never the page behind it. Making it translucent would
              buy the readability cost without the effect it was paying for.
            */
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-3xl border border-border bg-surface px-section-md py-section-md shadow-lg"
          >
            <ul className="flex flex-col gap-section-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-base font-medium text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-section-md border-t border-border pt-section-md">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
