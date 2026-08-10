import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Highlight } from '@/components/ui/Highlight'
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

  return buildMetadata({
    locale,
    path: '/work',
    // `work.title` carries a `<mark>` — `t()` throws FORMATTING_ERROR on a
    // string with an unhandled tag, and metadata can't take JSX anyway, so
    // `t.markup` (not `t.rich`) resolves it to a plain string.
    title: `${t.markup('title', { mark: (chunks) => chunks })} — Digex`,
    description: t('lead'),
  })
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
          // Same key, same `mark` render prop as the homepage Work section —
          // this page is that section's full listing, not different copy.
          title={t.rich('title', {
            mark: (chunks) => <Highlight variant="block">{chunks}</Highlight>,
          })}
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
