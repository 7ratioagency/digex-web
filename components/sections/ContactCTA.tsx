import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { ArrowIcon } from '@/components/icons'
import { contactDetails } from '@/content/services'
import { whatsappUrl } from '@/lib/whatsapp'

export async function ContactCTA() {
  const t = await getTranslations('contact')

  const waUrl = whatsappUrl(t('whatsappPrefill'))

  const details = [
    { label: t('locationLabel'), value: t('locationValue') },
    { label: t('hoursLabel'), value: t('hoursValue') },
  ]

  return (
    <Section id="contact">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <div className="mt-section-xl grid grid-cols-1 gap-section-lg lg:grid-cols-2">
        <dl className="grid grid-cols-1 gap-section-md sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              {t('phoneLabel')}
            </dt>
            {contactDetails.phones.map((phone) => (
              <dd key={phone} className="mt-1">
                {/*
                  dir="ltr" keeps the leading "+" attached to the number — in an
                  RTL paragraph bidi renders "+213…" as "213…+".
                */}
                <a
                  href={`tel:${phone}`}
                  dir="ltr"
                  className="inline-block text-start transition-colors hover:text-accent-blue"
                >
                  {phone}
                </a>
              </dd>
            ))}
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              {t('emailLabel')}
            </dt>
            <dd className="mt-1">
              <a
                href={`mailto:${contactDetails.email}`}
                dir="ltr"
                className="inline-block text-start transition-colors hover:text-accent-blue"
              >
                {contactDetails.email}
              </a>
            </dd>
          </div>

          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-sm font-medium text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="mt-1">{detail.value}</dd>
            </div>
          ))}
        </dl>

        <div className="rounded-2xl border border-border bg-background p-section-md">
          <h3 className="text-lg font-semibold">{t('whatsappTitle')}</h3>
          <p className="mt-section-xs text-sm leading-relaxed text-muted-foreground">
            {t('whatsappBody')}
          </p>
          <div className="mt-section-md">
            <Button href={waUrl}>
              {t('whatsappCta')}
              <ArrowIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
