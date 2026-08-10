import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/lib/i18n/routing'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Literal hex, unavoidably.
 *
 * satori resolves no CSS custom properties, so the design tokens in
 * globals.css are unreachable here — these mirror them by hand and must be
 * updated alongside. Left-hand side is the token each value corresponds to.
 *
 * These are the *light* values, and that is the point: this card was still on
 * the pre-V2 near-black canvas (`#0a0a0a` ground, `#60a5fa` accent) long after
 * the site moved to paper. DESIGN.md's core realisation is that the brand is
 * light-based, so the share card — often the first Digex surface anyone sees —
 * has to be paper too, not a dark artefact of the old system.
 *
 * The accent is `--blue-600`, not `--blue-500`: DESIGN.md §1 notes 500 is only
 * 5.27:1 on paper, and 600 is the step reserved for accent *text*.
 */
const COLORS = {
  background: '#f2f2f0', // --paper  (= --background, light)
  foreground: '#0b0b0d', // --ink    (= --foreground, light)
  accent: '#1e3ae0', // --blue-600   (= --accent-blue, light)
  muted: '#4c4f5a', // --muted-foreground (light)
} as const

/**
 * Locales whose script satori can actually shape.
 *
 * Arabic is deliberately excluded. satori parses fonts with opentype.js, which
 * rejects GSUB `lookupType: 5` — and that lookup *is* the contextual
 * substitution producing Arabic initial/medial/final forms. Two unrelated
 * Arabic fonts (IBM Plex Sans Arabic, Noto Sans Arabic) both fail the build
 * with the same error, so it's a satori limitation, not a font choice. Even if
 * it parsed, the output would be unjoined letterforms — a broken-looking share
 * card is worse than a brand-only one, so /ar gets the wordmark and a Latin
 * strapline instead.
 *
 * The per-locale SEO that matters is unaffected: og:title, og:description,
 * og:locale and og:url are all localised in lib/seo.ts, and those are the text
 * social platforms render beside the image.
 */
const SHAPEABLE = new Set(['fr', 'en'])

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Per-locale `alt`, which a static `export const alt` could not provide.
 *
 * Messages are imported directly rather than via `getTranslations`: this runs
 * in a build-time context with no HTTP request, and next-intl reaches for
 * `headers()` internally, which errors there.
 */
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Guarded: an unknown segment must not resolve to a missing JSON module.
  const safe = routing.locales.includes(locale as never)
    ? locale
    : routing.defaultLocale

  const messages = (await import(`@/messages/${safe}.json`)) as {
    default: { meta: { title: string } }
  }

  return [{ id: 'og', alt: messages.default.meta.title, size, contentType }]
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  // Real copy from messages/en.json, not an invented strapline.
  const tEnHero = await getTranslations({ locale: 'en', namespace: 'hero' })

  const headline = SHAPEABLE.has(locale) ? t('title') : tEnHero('eyebrow')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: COLORS.background,
          color: COLORS.foreground,
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', fontSize: 44, color: COLORS.accent }}>
          {SITE_NAME}
        </div>

        <div style={{ display: 'flex', fontSize: 56, lineHeight: 1.25 }}>
          {headline}
        </div>

        {/* Derived from SITE_URL so it can't drift from the configured origin. */}
        <div style={{ display: 'flex', fontSize: 26, color: COLORS.muted }}>
          {new URL(SITE_URL).host}
        </div>
      </div>
    ),
    size,
  )
}
