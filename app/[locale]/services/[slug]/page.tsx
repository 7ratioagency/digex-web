import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Link } from '@/lib/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { ArrowIcon } from '@/components/icons'
import { services, getService } from '@/content/services'
import { projectsByCategory } from '@/content/projects'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const service = getService(slug)
  if (!service) return {}

  const t = await getTranslations({ locale, namespace: 'services.items' })

  return buildMetadata({
    locale,
    path: `/services/${service.slug}`,
    title: `${t(`${service.key}.title`)} — Digex`,
    description: t(`${service.key}.body`),
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const service = getService(slug)
  if (!service) notFound()

  const t = await getTranslations('services')
  const tWork = await getTranslations('work')

  const related = service.projectCategory
    ? projectsByCategory(service.projectCategory)
    : []
  const otherServices = services.filter((s) => s.key !== service.key)
  const { Icon, accent, key } = service

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <Section>
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {/*
            The wrapper reverses whatever direction ArrowIcon resolved to, so
            "back" points start-ward in both LTR and RTL.
          */}
          <span className="inline-flex -scale-x-100">
            <ArrowIcon className="size-4" />
          </span>
          {t('viewAll')}
        </Link>

        <div className="mt-section-lg max-w-3xl">
          <Icon className="size-10" style={{ color: accent }} />
          <h1 className="mt-section-md text-4xl font-semibold text-balance sm:text-5xl ltr:tracking-tight">
            {t(`items.${key}.title`)}
          </h1>
          <p
            className="mt-section-sm text-lg font-medium"
            style={{ color: accent }}
          >
            {t(`items.${key}.tagline`)}
          </p>
          <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
            {t(`items.${key}.body`)}
          </p>
        </div>
      </Section>

      {/*
        Real projects from this service's portfolio category. Rendered only when
        the category has entries — no empty state, no invented filler.
      */}
      {related.length > 0 && (
        <Section className="bg-surface">
          <h2 className="text-2xl font-semibold sm:text-3xl ltr:tracking-tight">
            {tWork('eyebrow')}
          </h2>
          <ul className="mt-section-lg grid grid-cols-1 gap-section-lg sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Cross-navigation to the remaining services */}
      <Section>
        <h2 className="text-2xl font-semibold sm:text-3xl ltr:tracking-tight">
          {t('eyebrow')}
        </h2>
        <ul className="mt-section-lg grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-4">
          {otherServices.map((other) => (
            <li key={other.key}>
              <ServiceCard service={other} />
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </main>
  )
}
