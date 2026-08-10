'use client'

import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { MoonIcon, SunIcon } from '@/components/icons'

/**
 * Light/dark toggle.
 *
 * The source of truth is the `dark` class on `<html>` itself, not React
 * state, and it is read through `useSyncExternalStore` rather than a
 * `useState` mirror. That matters because something else already wrote that
 * class before React existed: the inline script in the root layout runs
 * before first paint to avoid a flash. A `useState(false)` mirror would
 * disagree with the DOM on the very first render for anyone who had chosen
 * dark, and the icon would start wrong and then flip.
 *
 * `getServerSnapshot` returns false because the server has no way to know the
 * stored preference — the class is applied on the client, pre-hydration.
 */

type Listener = () => void
const listeners = new Set<Listener>()

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function getServerSnapshot() {
  return false
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function setDark(next: boolean) {
  document.documentElement.classList.toggle('dark', next)
  localStorage.setItem('theme', next ? 'dark' : 'light')
  listeners.forEach((listener) => listener())
}

export function ThemeToggle() {
  const t = useTranslations('nav')
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <button
      type="button"
      onClick={() => setDark(!isDark)}
      aria-pressed={isDark}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
    >
      <span className="sr-only">{t('theme')}</span>
      {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  )
}
