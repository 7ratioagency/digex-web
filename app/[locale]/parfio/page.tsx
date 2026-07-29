import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { ArrowIcon } from '@/components/icons'
import { contactDetails } from '@/content/services'

type Feature = { title: string; body: string }

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'parfio' })

  return buildMetadata({
    locale,
    path: '/parfio',
    title: `${t('title')} — Digex`,
    description: t('lead'),
  })
}

export default async function ParfioPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('parfio')
  const features = t.raw('features') as Feature[]

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
          <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
            {t('lead')}
          </p>

          {/*
            Only `ctaSecondary` (the Telegram channel) is used here —
            `ctaPrimary` reads "Explore Parfio", which is meaningless on the
            Parfio page itself. Conversion is handled by <ContactCTA/> below.
          */}
          <div className="mt-section-lg">
            <Button href={contactDetails.parfio.telegram}>
              {t('ctaSecondary')}
              <ArrowIcon className="size-4" />
            </Button>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <ul className="grid grid-cols-1 gap-section-lg sm:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="border-t border-border pt-section-md"
            >
              <h2 className="text-lg font-semibold text-balance">
                {feature.title}
              </h2>
              <p className="mt-section-xs leading-relaxed text-pretty text-muted-foreground">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </main>
  )
}
