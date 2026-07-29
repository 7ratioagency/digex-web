import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { ArrowIcon } from '@/components/icons'
import { services } from '@/content/services'

export async function Services() {
  const t = await getTranslations('services')

  return (
    <Section id="services">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <StaggerGroup
        as="ul"
        className="mt-section-xl grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <StaggerItem key={service.key} as="li">
            <ServiceCard service={service} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-section-lg">
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('viewAll')}
          <ArrowIcon className="size-4" />
        </Link>
      </div>
    </Section>
  )
}
