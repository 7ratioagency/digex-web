import type { Metadata } from 'next'
import { routing, type AppLocale } from '@/lib/i18n/routing'
import { contactDetails } from '@/content/services'

/**
 * Absolute origin, used for canonicals, hreflang, OG URLs and the sitemap.
 * Getting this wrong points canonicals at the wrong host, so it is configurable
 * — set NEXT_PUBLIC_SITE_URL in the environment. The default is inferred from
 * the contact address in content/services.ts.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://digex.agency'
).replace(/\/$/, '')

export const SITE_NAME = 'Digex'

/** og:locale wants language_TERRITORY, not the bare route segment. */
const OG_LOCALE: Record<AppLocale, string> = {
  ar: 'ar_DZ',
  fr: 'fr_FR',
  en: 'en_US',
}

/** Absolute URL for a locale + route, e.g. ("fr", "/work") -> /fr/work */
export function localeUrl(locale: string, path = '') {
  return `${SITE_URL}/${locale}${path}`
}

/**
 * hreflang map for a route. Every locale points at its own copy, and x-default
 * points at the default locale (Arabic) so crawlers have a fallback for
 * languages we don't publish.
 */
export function languageAlternates(path = '') {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, localeUrl(locale, path)]),
    ),
    'x-default': localeUrl(routing.defaultLocale, path),
  }
}

type BuildMetadataArgs = {
  locale: string
  /** Route path without the locale prefix, "" for the homepage. */
  path?: string
  title: string
  description: string
}

/**
 * Shared page metadata: canonical, hreflang alternates, Open Graph and Twitter.
 *
 * `openGraph.images` is deliberately not set — leaving it out lets Next attach
 * the generated opengraph-image route automatically. Setting it here would
 * override that for every page.
 */
export function buildMetadata({
  locale,
  path = '',
  title,
  description,
}: BuildMetadataArgs): Metadata {
  const url = localeUrl(locale, path)

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: OG_LOCALE[locale as AppLocale] ?? OG_LOCALE.ar,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/**
 * LocalBusiness schema built from the single source of truth in
 * content/services.ts. Only facts already stated in the repo are included —
 * there is no street address or geo in the content, so none is asserted.
 */
export function localBusinessJsonLd({
  locale,
  description,
  areaServed,
}: {
  locale: string
  description: string
  areaServed: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    description,
    url: localeUrl(locale),
    email: contactDetails.email,
    telephone: [...contactDetails.phones],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DZ',
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    sameAs: Object.values(contactDetails.social),
    inLanguage: locale,
  }
}
