import { getTranslations } from 'next-intl/server'
import type { Project, ProjectLinkKind } from '@/content/projects'

/** Each link kind gets its own verb — "Visit the site" vs "View on Behance". */
const linkLabelKey: Record<ProjectLinkKind, string> = {
  live: 'viewLive',
  behance: 'viewBehance',
  youtube: 'viewVideo',
}

/**
 * The compact half of the per-service portfolio: real clients, named, on the
 * service card itself.
 *
 * The catalogue never lists work under a service — it keeps a separate Nos
 * Projets chapter — but it does label every project with the service that
 * produced it ("EVE / BRAND DESIGN"). This is that association read the other
 * way round, which is what a services section can actually use: the claim and
 * its evidence in the same card.
 *
 * Capped at three. This sits inside a card whose job is still the service, and
 * a service with six sites would otherwise turn its card into a list of links.
 * The service page below carries the full set.
 *
 * Each chip links straight out to the client's live site, Behance gallery or
 * video — the real URL from content/projects.ts, never a placeholder. The
 * accessible name says which, because "EVE Accessoires" alone doesn't tell a
 * screen reader user they're leaving the site.
 */
export async function ServiceWorkStrip({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  const t = await getTranslations('services')
  const tWork = await getTranslations('work')
  const shown = projects.slice(0, 3)

  return (
    /*
     * `relative z-10` is load-bearing: ServiceCard's own link is stretched
     * across the whole card with an `::after` overlay, and without a stacking
     * context above it these chips would be unclickable.
     */
    <div className="relative z-10 mt-section-md border-t border-border pt-section-md">
      <div className="flex items-center gap-section-xs">
        <span
          aria-hidden="true"
          className="h-1 w-5 shrink-0 rounded-full bg-highlight-yellow"
        />
        <p className="text-xs font-medium uppercase text-muted-foreground ltr:tracking-wide">
          {t('workLabel')}
        </p>
      </div>

      <ul className="mt-section-sm flex flex-wrap gap-section-xs">
        {shown.map((project) => (
          <li key={project.slug}>
            <a
              href={project.link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.client} — ${tWork(linkLabelKey[project.link.kind])}`}
              /*
               * `min-h-11` is the 44px touch target, not a visual choice —
               * these are the smallest interactive things on the card.
               */
              className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-xs font-medium text-muted-foreground transition-colors hover:border-accent-blue hover:text-foreground motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            >
              {project.client}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
