import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Link } from '@/lib/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { ArrowIcon } from '@/components/icons'
import {
  projects,
  getProject,
  type Locale,
  type ProjectLinkKind,
} from '@/content/projects'

const linkLabelKey: Record<ProjectLinkKind, string> = {
  live: 'viewLive',
  behance: 'viewBehance',
  youtube: 'viewVideo',
}

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  return buildMetadata({
    locale,
    path: `/work/${project.slug}`,
    title: `${project.client} — Digex`,
    description: project.summary[locale as Locale],
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = getProject(slug)
  if (!project) notFound()

  const t = await getTranslations('work')
  const activeLocale = (await getLocale()) as Locale

  return (
    <main className="flex flex-1 flex-col">
      <Section>
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {/* Wrapper reverses ArrowIcon so "back" points start-ward in both directions. */}
          <span className="inline-flex -scale-x-100">
            <ArrowIcon className="size-4" />
          </span>
          {t('cta')}
        </Link>

        <div className="mt-section-lg max-w-3xl">
          <p className="text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
            {t(`filters.${project.category}`)}
          </p>
          <h1 className="mt-section-xs text-4xl font-semibold text-balance sm:text-5xl ltr:tracking-tight">
            {project.client}
          </h1>
          <p className="mt-section-sm text-lg leading-relaxed text-pretty text-muted-foreground">
            {project.summary[activeLocale]}
          </p>
        </div>

        {/*
          A 16:9 plate either way, so a project gaining its photograph does not
          move the rest of the page. `priority` because this is the page's LCP
          element on every case study that has one.
        */}
        <div className="relative mt-section-lg flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
          {project.cover ? (
            <Image
              src={project.cover}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="px-section-md text-center text-sm font-medium text-muted-foreground">
              {project.client}
            </span>
          )}
        </div>

        <div className="mt-section-lg grid grid-cols-1 gap-section-lg lg:grid-cols-3">
          <dl className="lg:col-span-2 grid grid-cols-1 gap-section-md sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                {t('sector')}
              </dt>
              <dd className="mt-1">{project.sector[activeLocale]}</dd>
            </div>
            {/*
              `project.year` is intentionally not surfaced: messages/ has no
              label key for it, and inventing one would break the copy rule.
              Add `work.yearLabel` and it can render here.
            */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('delivered')}
              </dt>
              <dd>
                <ul className="mt-section-xs flex flex-wrap gap-section-xs">
                  {project.delivered[activeLocale].map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {/*
            The point of the page: send people to the real, live result — where
            there is one to send them to. Signage and printed work have no
            online destination, and the photographs above are the result, so
            the whole panel is omitted rather than shown with a dead button.
          */}
          {project.link && (
            <div className="rounded-2xl border border-border bg-surface p-section-md">
              <p className="text-sm text-muted-foreground">{project.client}</p>
              <div className="mt-section-md">
                <Button href={project.link.url}>
                  {t(linkLabelKey[project.link.kind])}
                  <ArrowIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Only projects with real photographs carry a gallery. */}
      {project.gallery.length > 0 && (
        <Section className="bg-surface">
          <ul className="grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((image) => (
              <li
                key={image}
                className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-border bg-background"
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ContactCTA />
    </main>
  )
}
