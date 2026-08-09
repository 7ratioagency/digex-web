import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Highlight } from "@/components/ui/Highlight";
import {
  WorkCinematic,
  type WorkItem,
} from "@/components/sections/WorkCinematic";
import {
  featuredProjects,
  projects,
  type Locale,
  type Project,
  type ProjectLinkKind,
} from "@/content/projects";

/** Each link kind gets its own verb — "Visit the site" vs "View on Behance". */
const linkLabelKey: Record<ProjectLinkKind, string> = {
  live: "viewLive",
  behance: "viewBehance",
  youtube: "viewVideo",
};

/** How many projects get the full-height cinematic treatment. */
const HERO_COUNT = 3;

/**
 * Selected work, as a cinematic sequence.
 *
 * Stays a Server Component: every string is resolved here — including the
 * per-project link verb and the localised sector/summary/deliverables — so
 * `content/projects.ts`, the locale lookup and the message catalogue all stay
 * out of the client bundle. The client half receives plain, finished strings.
 */
export async function SelectedWork() {
  const t = await getTranslations("work");
  const locale = (await getLocale()) as Locale;

  const toItem = (project: Project): WorkItem => ({
    slug: project.slug,
    client: project.client,
    sector: project.sector[locale],
    summary: project.summary[locale],
    delivered: project.delivered[locale],
    href: `/work/${project.slug}`,
    externalUrl: project.link.url,
    externalLabel: t(linkLabelKey[project.link.kind]),
  });

  const heroes = featuredProjects.slice(0, HERO_COUNT);
  const heroSlugs = new Set(heroes.map((p) => p.slug));

  /*
   * The strip carries everything the heroes didn't, drawn from the full
   * portfolio rather than just the remaining featured entries. Featured is only
   * five, so a featured-only strip would hold two cards — not enough to scroll,
   * which would leave the track and its progress thumb pointless. The section's
   * "view all work" link still leads to the filterable /work index.
   */
  const rest = projects.filter((p) => !heroSlugs.has(p.slug));

  return (
    <WorkCinematic
      heroes={heroes.map(toItem)}
      rest={rest.map(toItem)}
      labels={{
        overview: t("eyebrow"),
        viewAll: t("cta"),
        viewCase: t("viewCase"),
        delivered: t("delivered"),
        slidePrev: t("slidePrev"),
        slideNext: t("slideNext"),
      }}
      header={
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", {
            mark: (chunks) => <Highlight variant="block">{chunks}</Highlight>,
          })}
          lead={t("lead")}
        />
      }
    />
  );
}
