import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { ArrowIcon } from '@/components/icons'
import type { Service } from '@/content/services'

/** Renders an <li> — the caller must provide the surrounding <ul>. */
export async function ServiceCard({ service }: { service: Service }) {
  const t = await getTranslations('services')
  const { key, slug, Icon, accent } = service

  return (
    <li>
      <Link
        href={`/services/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-border p-section-md transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
      >
        {/* accent comes from the token declared in content/services.ts */}
        <Icon className="size-7" style={{ color: accent }} />

        <h3 className="mt-section-md text-lg font-semibold">
          {t(`items.${key}.title`)}
        </h3>
        <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
          {t(`items.${key}.tagline`)}
        </p>
        <p className="mt-section-sm flex-1 text-sm leading-relaxed text-pretty text-muted-foreground">
          {t(`items.${key}.body`)}
        </p>

        <span className="mt-section-md inline-flex items-center gap-section-xs text-sm font-medium">
          {t('cta')}
          <ArrowIcon className="size-4" />
        </span>
      </Link>
    </li>
  )
}
