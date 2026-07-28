'use client'

import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { MoonIcon, SunIcon } from '@/components/icons'

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
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
    >
      <span className="sr-only">{t('theme')}</span>
      {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  )
}
