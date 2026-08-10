import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Highlight } from '@/components/ui/Highlight'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { services } from '@/content/services'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })

  return buildMetadata({
    locale,
    // `services.title` carries a `<mark>` — `t()` throws FORMATTING_ERROR on
    // a string with an unhandled tag, and metadata can't take JSX anyway, so
    // `t.markup` (not `t.rich`) resolves it to a plain string.
    title: `${t.markup('title', { mark: (chunks) => chunks })} — Digex`,
    description: t('lead'),
  })
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('services')

  return (
    <main className="flex flex-1 flex-col">
      <Section>
        <SectionHeader
          eyebrow={t('eyebrow')}
          // Same key, same `mark` render prop as the homepage Services
          // section — this page is that section's full listing, not a
          // different piece of copy.
          title={t.rich('title', {
            mark: (chunks) => <Highlight variant="block">{chunks}</Highlight>,
          })}
          lead={t('lead')}
        />

        <ul className="mt-section-xl grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.key}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </main>
  )
}
