import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { ArrowIcon } from '@/components/icons'
import { featuredProjects } from '@/content/projects'

export async function SelectedWork() {
  const t = await getTranslations('work')

  return (
    <Section id="work">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <ul className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      <div className="mt-section-lg">
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('cta')}
          <ArrowIcon className="size-4" />
        </Link>
      </div>
    </Section>
  )
}
