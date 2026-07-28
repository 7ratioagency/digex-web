import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

type ProcessStep = { step: string; title: string; body: string }

export async function Process() {
  const t = await getTranslations('process')
  const steps = t.raw('steps') as ProcessStep[]

  return (
    <Section className="bg-surface">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <ol className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <li key={step.step} className="border-t border-border pt-section-md">
            {/* tabular-nums keeps the 01–05 counters optically aligned */}
            <span className="block text-sm font-semibold tabular-nums text-accent-blue">
              {step.step}
            </span>
            <h3 className="mt-section-xs text-lg font-semibold text-balance">
              {step.title}
            </h3>
            <p className="mt-section-xs leading-relaxed text-pretty text-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
