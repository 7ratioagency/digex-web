import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

type ProblemItem = { title: string; body: string }

export async function Problem() {
  const t = await getTranslations('problem')
  const items = t.raw('items') as ProblemItem[]

  return (
    <Section className="bg-surface">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <ul className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.title}
            className="border-t border-border pt-section-md"
          >
            <h3 className="text-lg font-semibold text-balance">{item.title}</h3>
            <p className="mt-section-xs leading-relaxed text-pretty text-muted-foreground">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
