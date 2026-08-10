import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Link } from '@/lib/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Highlight } from '@/components/ui/Highlight'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { DecorLayer, GlassBubble, SpiralOrb } from '@/components/ui/Decor'
import { ServiceIncluded } from '@/components/sections/ServiceIncluded'
import { ProcessCompact } from '@/components/sections/ProcessCompact'
import { Pricing } from '@/components/sections/Pricing'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { ArrowIcon } from '@/components/icons'
import { services, getService } from '@/content/services'
import { getPricing } from '@/content/pricing'
import { projectsByCategory } from '@/content/projects'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

/** All five services, prerendered per locale. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const service = getService(slug)
  if (!service) return {}

  const t = await getTranslations({ locale, namespace: 'services.items' })

  return buildMetadata({
    locale,
    path: `/services/${service.slug}`,
    // `t.markup`, not `t()`: these titles carry a `<mark>` for the headline
    // below, and metadata takes a plain string.
    title: `${t.markup(`${service.key}.title`, { mark: (chunks) => chunks })} — Digex`,
    description: t(`${service.key}.body`),
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const service = getService(slug)
  if (!service) notFound()

  const t = await getTranslations('services')
  const tWork = await getTranslations('work')

  /*
   * Selected work for this service, via the category already declared on the
   * service itself (content/services.ts): development→websites,
   * brand→branding, production→video, print→print. Marketing has no
   * `projectCategory` because no marketing category exists in the portfolio —
   * so `related` is empty there and the whole section is omitted rather than
   * rendered as an empty state.
   */
  const related = service.projectCategory
    ? projectsByCategory(service.projectCategory)
    : []
  const hasWork = related.length > 0
  const hasIncluded = Boolean(getPricing(service.slug))

  /*
   * Alternating paper/navy tone down the page — DESIGN.md §3 rule 1, where
   * `.section-alt` is the in-mode tone shift rather than a jump to navy.
   *
   * Computed rather than hard-coded because two sections are conditional:
   * marketing has no related work, and a service without pricing would have
   * no "what's included" either. Sections are listed in render order, the
   * ones that actually render are indexed, and every odd index takes the alt
   * tone — so the rhythm survives whichever sections drop out.
   *
   * The last content section is forced back to base: <ContactCTA> always
   * paints `.section-alt` itself, and two alt bands touching would read as
   * one double-height band instead of a beat.
   */
  const rendered = ['hero', hasIncluded && 'included', 'process', hasWork && 'work', 'pricing'].filter(
    Boolean,
  ) as string[]
  const isAlt = (name: string) => {
    const i = rendered.indexOf(name)
    return i % 2 === 1 && i !== rendered.length - 1
  }

  const { Icon, accent, key } = service

  return (
    <main className="flex flex-1 flex-col">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <Section
        className={`isolate ${isAlt('hero') ? 'section-alt' : ''}`}
        backdrop={
          /*
            Poster composition — DESIGN.md §2a/§2b: a large bubble cropped by
            the reading-end corner, a small counterpoint, and a spiral orb
            opposite for balance. Three elements, the §2b ceiling. All placed
            on logical `inset-s`/`inset-e`, so the arrangement mirrors at /ar.
            Kept clear of the text column — the copy sits at `max-w-3xl` on
            the reading-start side.
          */
          <DecorLayer>
            <GlassBubble
              size={300}
              position="top-[-12%] inset-e-[-6%]"
              seed={`svc-${service.slug}-a`}
            />
            <GlassBubble
              size={104}
              position="bottom-[14%] inset-e-[16%]"
              opacity={0.8}
              seed={`svc-${service.slug}-b`}
            />
            <SpiralOrb
              size={200}
              position="bottom-[-14%] inset-s-[-5%]"
              opacity={0.6}
              seed={`svc-${service.slug}-c`}
            />
          </DecorLayer>
        }
      >
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {/*
            The wrapper reverses whatever direction ArrowIcon resolved to, so
            "back" points start-ward in both LTR and RTL.
          */}
          <span className="inline-flex -scale-x-100">
            <ArrowIcon className="size-4" />
          </span>
          {t('viewAll')}
        </Link>

        <Reveal className="mt-section-lg max-w-3xl">
          {/* The service's own hand-drawn icon, at hero scale. */}
          <Icon className="size-16" style={{ color: accent }} animate />
          <h1 className="mt-section-md text-4xl font-semibold text-balance sm:text-5xl ltr:tracking-tight">
            {/*
              The key word carries a marker swipe — DESIGN.md §2c. The `<mark>`
              is in the message itself, so which word is the key word is a
              translation decision per locale rather than a positional guess.
            */}
            {t.rich(`items.${key}.title`, {
              mark: (chunks) => <Highlight variant="marker">{chunks}</Highlight>,
            })}
          </h1>
          <p className="mt-section-sm text-lg font-medium" style={{ color: accent }}>
            {t(`items.${key}.tagline`)}
          </p>
          <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
            {t(`items.${key}.body`)}
          </p>
        </Reveal>
      </Section>

      {/* ── 2. What's included ──────────────────────────────────────────── */}
      <ServiceIncluded serviceSlug={service.slug} alt={isAlt('included')} />

      {/* ── 3. Process ──────────────────────────────────────────────────── */}
      <ProcessCompact alt={isAlt('process')} />

      {/* ── 4. Selected work ────────────────────────────────────────────── */}
      {hasWork && (
        <Section className={isAlt('work') ? 'section-alt' : ''}>
          <Reveal>
            <p className="text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
              {tWork('eyebrow')}
            </p>
            <h2 className="mt-section-xs text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
              {/* Same key and variant as the homepage Work section. */}
              {tWork.rich('title', {
                mark: (chunks) => <Highlight variant="block">{chunks}</Highlight>,
              })}
            </h2>
          </Reveal>

          {/*
            Real clients, real links — every card carries the client's actual
            name and a live URL from content/projects.ts. No placeholders.
          */}
          <ul className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
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
              {tWork('cta')}
              <ArrowIcon className="size-4" />
            </Link>
          </div>
        </Section>
      )}

      {/* ── 5. Pricing ──────────────────────────────────────────────────── */}
      <Pricing serviceSlug={service.slug} alt={isAlt('pricing')} />

      {/* ── 6. CTA — WhatsApp, plus the route through to the form ───────── */}
      <ContactCTA showFormLink />
    </main>
  )
}
