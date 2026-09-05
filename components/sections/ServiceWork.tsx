import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Highlight } from '@/components/ui/Highlight'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { ProjectCover } from '@/components/ui/ProjectCover'
import { ArrowIcon } from '@/components/icons'
import { projectsByCategory, type Locale, type ProjectLinkKind } from '@/content/projects'
import type { Service } from '@/content/services'

/** Each link kind gets its own verb — "Visit the site" vs "View on Behance". */
const linkLabelKey: Record<ProjectLinkKind, string> = {
  live: 'viewLive',
  behance: 'viewBehance',
  youtube: 'viewVideo',
}

/**
 * The fuller half of the per-service portfolio, for /services/[slug].
 *
 * Built as feature rows rather than the card grid /work uses, because the
 * catalogue presents a project as a spread and not as a tile: a short yellow
 * rule, the client's name, the service set under it in caps ("EVE / BRAND
 * DESIGN"), the story in running text, and the work itself bled off the outer
 * edge. Rows alternate which side the cover sits on, exactly as the catalogue
 * alternates its spreads.
 *
 * `lg:order-last` and nothing else handles RTL here: CSS `order` runs along
 * the inline axis, so the alternation mirrors itself at /ar with no direction
 * check.
 *
 * Renders nothing when the service has no matching projects — five of the
 * eight, and `video` holds no projects yet — rather than an empty state.
 */
export async function ServiceWork({
  service,
  alt = false,
}: {
  service: Service
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
}) {
  const projects = service.projectCategory
    ? projectsByCategory(service.projectCategory)
    : []
  if (projects.length === 0) return null

  const t = await getTranslations('work')
  const tServices = await getTranslations('services')
  const locale = (await getLocale()) as Locale

  return (
    <Section
      // `isolate` scopes the colour fields' `-z-10` to this section.
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // `overflow-hidden` — the fields sit on negative insets so they bleed
        // in from off-section; unclipped they extend the document and produce
        // a horizontal scrollbar. Same clip `DecorLayer` applies.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/*
            Required, not decorative: the covers below are `.glass`, and a
            backdrop-filter with nothing behind it is an invisible rectangle —
            DESIGN.md §2f rule 5. Placed inside the section rather than on its
            edges for exactly that reason: the covers sit in the middle of the
            rows, so fields bleeding in from off-section had nothing under them
            to tint and the panels rendered as flat grey.
          */}
          <div className="colour-field colour-field-blue top-[22%] inset-e-[6%] size-120" />
          <div className="colour-field colour-field-violet bottom-[14%] inset-s-[4%] size-112" />
        </div>
      }
    >
      <Reveal>
        <p className="text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
          {t('eyebrow')}
        </p>
        <h2 className="mt-section-xs text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
          {/* Same key and variant as the homepage Work section. */}
          {t.rich('title', {
            mark: (chunks) => <Highlight variant="block">{chunks}</Highlight>,
          })}
        </h2>
      </Reveal>

      {/*
        Real clients, real links — every row carries the client's actual name
        and a live URL from content/projects.ts. No placeholders.
      */}
      <StaggerGroup as="ul" className="mt-section-2xl flex flex-col gap-section-3xl">
        {projects.map((project, index) => (
          <StaggerItem
            key={project.slug}
            as="li"
            className="grid items-center gap-section-lg lg:grid-cols-2 lg:gap-section-2xl"
          >
            <ProjectCover
              project={project}
              className={index % 2 === 1 ? 'lg:order-last' : ''}
            />

            <div>
              <span
                aria-hidden="true"
                className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
              />
              <h3 className="mt-section-md text-2xl font-semibold text-balance ltr:tracking-tight sm:text-3xl">
                {project.client}
              </h3>
              {/*
                The catalogue sets the service, not the sector, under the
                client's name — the page is about what this service produced.
                `t.markup` drops the title's `<mark>`; a caps label is not the
                place for a marker swipe.
              */}
              <p className="mt-section-xs text-sm font-medium uppercase text-accent-blue ltr:tracking-wide">
                {tServices.markup(`items.${service.key}.title`, {
                  mark: (chunks) => chunks,
                })}
              </p>

              <p className="mt-section-md leading-relaxed text-pretty text-muted-foreground">
                {project.summary[locale]}
              </p>

              <p className="mt-section-lg text-xs font-medium text-muted-foreground">
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

              <div className="mt-section-lg flex flex-wrap items-center gap-section-md">
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium transition-colors hover:text-accent-blue motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                >
                  {t('viewCase')}
                  <ArrowIcon className="size-4" />
                </Link>
                <a
                  href={project.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                >
                  {t(linkLabelKey[project.link.kind])}
                </a>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-section-2xl">
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
        >
          {t('cta')}
          <ArrowIcon className="size-4" />
        </Link>
      </div>
    </Section>
  )
}
