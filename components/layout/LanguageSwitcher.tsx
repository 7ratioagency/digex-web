'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n/navigation'
import { routing } from '@/lib/i18n/routing'

const labels: Record<(typeof routing.locales)[number], string> = {
  ar: 'ع',
  fr: 'FR',
  en: 'EN',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('nav')

  return (
    <div className="flex items-center gap-section-xs" aria-label={t('language')}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-section-xs">
          {i > 0 && (
            <span aria-hidden="true" className="text-border">
              /
            </span>
          )}
          <Link
            href={pathname}
            locale={loc}
            aria-current={loc === locale ? 'true' : undefined}
            className={`text-sm transition-colors ${
              loc === locale
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {labels[loc]}
          </Link>
        </span>
      ))}
    </div>
  )
}
