import type { MetadataRoute } from 'next'
import { routing } from '@/lib/i18n/routing'
import { languageAlternates, localeUrl } from '@/lib/seo'
import { services } from '@/content/services'
import { projects } from '@/content/projects'

/** Every route, locale-agnostic. Locales are expanded below. */
function routePaths() {
  return [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    })),
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' as const },
    ...projects.map((project) => ({
      path: `/work/${project.slug}`,
      priority: 0.7,
      changeFrequency: 'yearly' as const,
    })),
    { path: '/contact', priority: 0.8, changeFrequency: 'yearly' as const },
  ]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // One entry per locale per route, each carrying the full hreflang set so
  // crawlers can see the translations without fetching each page.
  return routePaths().flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  )
}
