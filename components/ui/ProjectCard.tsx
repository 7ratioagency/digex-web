import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { ArrowIcon } from '@/components/icons'
import type { Locale, Project, ProjectLinkKind } from '@/content/projects'

/** Each link kind gets its own verb — "Visit the site" vs "View on Behance". */
const linkLabelKey: Record<ProjectLinkKind, string> = {
  live: 'viewLive',
  behance: 'viewBehance',
  youtube: 'viewVideo',
}

/**
 * Renders a <div> — callers supply their own wrapper (usually an <li>), so the
 * /work grid can toggle visibility per card when filtering.
 */
export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations('work')
  const locale = (await getLocale()) as Locale

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border">
      {/*
        TODO: swap for <Image src={project.cover} fill /> once the real exports
        land in /public/work/. Until then this reserves the same aspect ratio so
        adding them causes no layout shift.
      */}
      <div className="flex aspect-4/3 items-center justify-center bg-surface">
        <span className="px-section-sm text-center text-sm font-medium text-muted-foreground">
          {project.client}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-section-md">
        <p className="text-xs font-medium uppercase text-muted-foreground ltr:tracking-wide">
          {project.sector[locale]}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{project.client}</h3>
        <p className="mt-section-xs text-sm leading-relaxed text-pretty text-muted-foreground">
          {project.summary[locale]}
        </p>

        <p className="mt-section-md text-xs font-medium text-muted-foreground">
          {t('delivered')}
        </p>
        <ul className="mt-section-xs flex flex-wrap gap-section-xs">
          {project.delivered[locale].map((item) => (
            <li
              key={item}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-section-md flex flex-1 flex-wrap items-end gap-section-md">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium transition-colors hover:text-accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          >
            {t('viewCase')}
            <ArrowIcon className="size-4" />
          </Link>
          <a
            href={project.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-section-xs text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          >
            {t(linkLabelKey[project.link.kind])}
          </a>
        </div>
      </div>
    </div>
  )
}
