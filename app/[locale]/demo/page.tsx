import { setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/ui/tailwind-css-background-snippet'

type Props = {
  params: Promise<{ locale: string }>
}

/**
 * Standalone render of the pasted radial-gradient background snippet,
 * unmodified — the live site's own background lives in `.site-canvas`
 * (globals.css) and is a separate, deliberately different thing. This route
 * exists so the original reference component is inspectable on its own.
 *
 * Nested under `[locale]` rather than a bare `/demo` at the app root: this
 * project has no root `app/layout.tsx` — `[locale]/layout.tsx` is the only
 * place `<html>`/`<body>` are rendered, and only routes nested under it get
 * that wrapper. A root-level `/demo` would have no layout to render inside
 * at all.
 */
export default async function DemoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <Hero />
}
