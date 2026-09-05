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
      <Section
        // `isolate` scopes the colour fields' `-z-10` to this section.
        className="isolate"
        backdrop={
          // `overflow-hidden` is load-bearing, not tidiness: the fields sit on
          // negative insets so they bleed in from outside the section, and
          // unclipped that extends the document and produces a horizontal
          // scrollbar. Same clip `DecorLayer` carries.
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {/*
              Required by the glass recipe, not decoration — DESIGN.md §2f (a)
              and rule 5. This page had none at all, so every card on it was
              `backdrop-filter` with nothing to filter: a white pane on white
              paper, and on navy an 8% wash over a flat ground, which is the
              "frosted glass over flat navy looks like nothing" case exactly.

              Three rather than the usual two because this grid is three rows
              deep — two fields at the section's ends leave the middle row
              with nothing behind it. Staggered start/end/start so no column
              is consistently the one that misses out, and so they read as a
              diagonal drift rather than a stack.
            */}
            <div className="colour-field colour-field-blue top-[10%] inset-s-[-6%] size-120" />
            <div className="colour-field colour-field-violet top-[40%] inset-e-[-4%] size-112" />
            <div className="colour-field colour-field-blue bottom-[4%] inset-s-[14%] size-112" />
          </div>
        }
      >
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
