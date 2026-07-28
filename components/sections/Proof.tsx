import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { clients } from '@/content/projects'

type Stat = { value: string; suffix: string; label: string }

export async function Proof() {
  const t = await getTranslations('proof')
  const stats = t.raw('stats') as Stat[]

  return (
    <Section className="bg-surface">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <dl className="mt-section-xl grid grid-cols-2 gap-section-lg lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-t border-border pt-section-md">
            {/*
              dir="ltr" so the digits and their "+" suffix keep their order at
              /ar — bidi would otherwise flip "16+" to "+16".
            */}
            <dt
              dir="ltr"
              className="text-4xl font-semibold tabular-nums text-start"
            >
              {stat.value}
              {stat.suffix}
            </dt>
            <dd className="mt-section-xs text-sm text-pretty text-muted-foreground">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>

      {/*
        Client names as text, not logos — /public/clients/*.webp doesn't exist
        yet. Names are real, so this is accurate rather than placeholder copy.
      */}
      <ul className="mt-section-xl flex flex-wrap gap-section-sm border-t border-border pt-section-lg">
        {clients.map((client) => (
          <li
            key={client.name}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
          >
            {client.name}
          </li>
        ))}
      </ul>
    </Section>
  )
}
