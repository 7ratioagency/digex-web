import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { Button } from '@/components/ui/Button'
import { ArrowIcon } from '@/components/icons'
import { contactDetails } from '@/content/services'

type Feature = { title: string; body: string }

export async function Parfio() {
  const t = await getTranslations('parfio')
  const features = t.raw('features') as Feature[]

  return (
    <Section>
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <StaggerGroup
        as="ul"
        className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-3"
      >
        {features.map((feature) => (
          <StaggerItem
            key={feature.title}
            as="li"
            className="border-t border-border pt-section-md"
          >
            <h3 className="text-lg font-semibold text-balance">
              {feature.title}
            </h3>
            <p className="mt-section-xs leading-relaxed text-pretty text-muted-foreground">
              {feature.body}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-section-lg flex flex-col gap-section-sm sm:flex-row sm:items-center">
        <Button href={contactDetails.parfio.page}>
          {t('ctaPrimary')}
          <ArrowIcon className="size-4" />
        </Button>
        <Button href={contactDetails.parfio.telegram} variant="secondary">
          {t('ctaSecondary')}
        </Button>
      </div>
    </Section>
  )
}
