'use client'

import { useEffect, useState } from 'react'

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,backdrop-filter,box-shadow] duration-300 motion-reduce:transition-none ${
        scrolled
          ? 'border-border bg-background/70 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      {children}
    </header>
  )
}
