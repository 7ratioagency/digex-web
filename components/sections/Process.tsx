import { getTranslations } from 'next-intl/server'
import { SectionHeader } from '@/components/ui/SectionHeader'
import {
  ProcessSequence,
  type ProcessStep,
} from '@/components/sections/ProcessSequence'

export async function Process() {
  const t = await getTranslations('process')
  const steps = t.raw('steps') as ProcessStep[]

  return (
    <ProcessSequence
      steps={steps}
      // Rendered here so the header stays server-rendered even though the
      // sequence itself has to be a Client Component.
      header={
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
        />
      }
    />
  )
}
