import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { WorkFilter, type FilterKey } from '@/components/work/WorkFilter'
import { projects } from '@/content/projects'

const filterOrder: FilterKey[] = [
  'all',
  'websites',
  'branding',
  'design',
  'print',
  'video',
]

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'work' })

  return {
    title: `${t('title')} — Digex`,
    description: t('lead'),
  }
}

export default async function WorkPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('work')

  // Cards are rendered here on the server and handed to the client filter as
  // props, so filtering is instant and the page still prerenders statically.
  const items = projects.map((project) => ({
    slug: project.slug,
    card: <ProjectCard project={project} />,
  }))

  const filters = filterOrder.map((key) => ({
    key,
    label: t(`filters.${key}`),
  }))

  return (
    <main className="flex flex-1 flex-col">
      <Section>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
        />

        <div className="mt-section-xl">
          <WorkFilter
            items={items}
            filters={filters}
            groupLabel={t('eyebrow')}
          />
        </div>
      </Section>

      <ContactCTA />
    </main>
  )
}
