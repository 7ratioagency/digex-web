import { getLocale, getTranslations } from 'next-intl/server'
import type { Locale, Project, ProjectLinkKind } from '@/content/projects'

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
 * Each entry is the catalogue's own project block in miniature. Its project
 * spreads (p19 EVE, p21 Delmoosh, p23 Shuttle Click) all open the same way — a
 * short yellow rule, the client's name, then a second line under it in small
 * bold caps. That three-line stack is the whole block here, minus the
 * narrative and the photography those pages have room for; the service page
 * carries the full-size version.
 *
 * The catalogue's second line is the service ("EVE / BRAND DESIGN"), which
 * works there because its projects live in a chapter of their own, pages away
 * from the service that produced them. Inside a service card it would be the
 * card's own title repeated three times down the block, so the line carries
 * the client's sector instead — real, per-locale, already in
 * content/projects.ts, and it says something the card has not already said.
 *
 * Capped at three. This sits inside a card whose subject is still the service,
 * and digital solutions alone would otherwise turn its card into six links.
 *
 * Each block links straight out to the client's live site, Behance gallery or
 * video — the real URL from content/projects.ts, never a placeholder. The
 * accessible name says which, because "EVE" alone does not tell a screen
 * reader user they are leaving the site.
 *
 * WHERE THE CLIENT'S DATA GOES. Per-service figures and pricing are coming
 * from the client; when they land, prices belong in content/pricing.ts (empty
 * by design until then, and read only through `displayPrice`), and anything
 * per-project belongs in content/projects.ts. Neither should be typed into
 * this component — it renders whatever those two files hold.
 */
export async function ServiceWorkStrip({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  const t = await getTranslations('services')
  const tWork = await getTranslations('work')
  const locale = (await getLocale()) as Locale
  const shown = projects.slice(0, 3)

  return (
    /*
     * `relative z-10` is load-bearing: ServiceCard's own link is stretched
     * across the whole card with an `::after` overlay, and without a stacking
     * context above it these blocks would be unclickable.
     */
    <div className="relative z-10 mt-section-md border-t border-border pt-section-md">
      <p className="text-xs font-medium uppercase text-muted-foreground ltr:tracking-wide">
        {t('workLabel')}
      </p>

      <ul className="mt-section-sm grid gap-section-sm sm:grid-cols-2">
        {shown.map((project) => (
          <li key={project.slug}>
            <a
              href={project.link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.client} — ${tWork(linkLabelKey[project.link.kind])}`}
              className="block h-full rounded-xl border border-border p-section-sm transition-colors duration-200 hover:border-accent-blue motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            >
              {/* The rule the catalogue sets above every project title. */}
              <span
                aria-hidden="true"
                className="block h-1 w-6 rounded-full bg-highlight-yellow"
              />
              <span className="mt-section-xs block text-sm font-semibold">
                {project.client}
              </span>
              {/*
                Wraps rather than truncating — "Ride-hailing & mobility" is
                three times the length of "Pet care", and a clipped label reads
                as a bug rather than as a label.
              */}
              <span className="mt-0.5 block text-[0.6875rem] font-medium uppercase leading-snug text-accent-blue ltr:tracking-wide">
                {project.sector[locale]}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
