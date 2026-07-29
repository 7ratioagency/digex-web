import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ContactForm } from '@/components/contact/ContactForm'
import { ArrowIcon } from '@/components/icons'
import { contactDetails } from '@/content/services'
import { whatsappUrl } from '@/lib/whatsapp'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return buildMetadata({
    locale,
    path: '/contact',
    title: `${t('title')} — Digex`,
    description: t('lead'),
  })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  const waUrl = whatsappUrl(t('whatsappPrefill'))

  return (
    <main className="flex flex-1 flex-col">
      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
            {t('eyebrow')}
          </p>
          <h1 className="mt-section-xs text-4xl font-semibold text-balance sm:text-5xl ltr:tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-section-sm text-lg leading-relaxed text-pretty text-muted-foreground">
            {t('lead')}
          </p>
        </div>

        <div className="mt-section-xl grid grid-cols-1 gap-section-xl lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2">
            <dl className="grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  {t('phoneLabel')}
                </dt>
                {contactDetails.phones.map((phone) => (
                  <dd key={phone} className="mt-1">
                    {/* dir="ltr" keeps the leading "+" attached at /ar */}
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

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  {t('locationLabel')}
                </dt>
                <dd className="mt-1">{t('locationValue')}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  {t('hoursLabel')}
                </dt>
                <dd className="mt-1">{t('hoursValue')}</dd>
              </div>
            </dl>

            <div className="mt-section-lg rounded-2xl border border-border bg-surface p-section-md">
              <h2 className="text-lg font-semibold">{t('whatsappTitle')}</h2>
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
        </div>
      </Section>
    </main>
  )
}
