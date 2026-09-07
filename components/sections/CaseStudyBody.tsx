import { getLocale, getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { CheckIcon } from '@/components/icons'
import { testimonialFor } from '@/content/testimonials'
import type { Locale, Project } from '@/content/projects'

/** Yellow rule over a heading — the catalogue's mark, on every section here. */
function RuledHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <span
        aria-hidden="true"
        className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
      />
      <h2 className="mt-section-sm text-2xl font-semibold text-balance sm:text-3xl ltr:tracking-tight">
        {children}
      </h2>
    </div>
  )
}

/**
 * The long form of a project: the client, what the work set out to do, how it
 * was approached, and what came of it.
 *
 * Renders nothing for a project without a written case study, which is most of
 * them — the archive held two. A project without one still has its summary,
 * deliverables and link on the page above.
 *
 * Every heading takes the catalogue's yellow rule, and the solution steps take
 * its numbered-strip treatment (the same device its trademark page uses for
 * LOGO → INAPI → GS1 → CLICHÉ). The results are set as the loudest thing on
 * the page on purpose: "0 to 30,500 followers in six months" is the reason the
 * page exists, and it had been sitting in a dead WordPress database.
 */
export async function CaseStudyBody({
  project,
  alt = false,
}: {
  project: Project
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
}) {
  const study = project.caseStudy
  if (!study) return null

  const t = await getTranslations('work')
  const locale = (await getLocale()) as Locale
  const testimonial = testimonialFor(project.slug)

  return (
    <Section
      // `isolate` scopes the colour fields' `-z-10` to this section.
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // `overflow-hidden`: the fields sit on negative insets so they bleed in
        // from off-section; unclipped they extend the document and produce a
        // horizontal scrollbar.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/*
            Required by the glass recipe, not decoration — DESIGN.md §2f rule
            5. Placed inside the section rather than on its edges, because the
            cards that need something to blur sit in the middle of it.
          */}
          <div className="colour-field colour-field-blue top-[26%] inset-e-[4%] size-120" />
          <div className="colour-field colour-field-violet bottom-[10%] inset-s-[2%] size-112" />
        </div>
      }
    >
      {/* ── The client ───────────────────────────────────────────────────── */}
      <Reveal className="max-w-3xl">
        <RuledHeading>{t('caseAbout')}</RuledHeading>
        <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
          {study.about[locale]}
        </p>
      </Reveal>

      {/* ── Objectives ───────────────────────────────────────────────────── */}
      <Reveal className="mt-section-2xl">
        <RuledHeading>{t('caseObjectives')}</RuledHeading>
      </Reveal>
      <StaggerGroup
        as="ul"
        className="mt-section-lg grid max-w-4xl grid-cols-1 gap-section-sm sm:grid-cols-2"
      >
        {study.objectives[locale].map((objective) => (
          <StaggerItem
            as="li"
            key={objective}
            className="flex items-start gap-section-sm"
          >
            {/*
              `shrink-0` so a two-line objective doesn't squash the tick into
              an ellipse; `mt-0.5` optically centres it against the first line.
            */}
            <CheckIcon className="mt-0.5 size-5 shrink-0 text-accent-blue" />
            <span className="leading-relaxed text-pretty">{objective}</span>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* ── Solution ─────────────────────────────────────────────────────── */}
      <Reveal className="mt-section-2xl">
        <RuledHeading>{t('caseSolution')}</RuledHeading>
      </Reveal>
      <StaggerGroup
        as="ol"
        className="mt-section-lg grid grid-cols-1 gap-section-md sm:grid-cols-2"
      >
        {study.solution.map((step, index) => (
          <StaggerItem
            as="li"
            key={step.title[locale]}
            className="glass flex flex-col p-section-md"
          >
            {/*
              `dir="ltr"` on the ordinal: bidi would otherwise reorder "01"
              against the Arabic beside it. Same treatment the Process section
              gives its own step numbers.
            */}
            <span
              dir="ltr"
              aria-hidden="true"
              className="text-sm font-semibold tabular-nums text-accent-blue"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-section-xs text-lg font-semibold text-balance">
              {step.title[locale]}
            </h3>
            <ul className="mt-section-sm flex flex-col gap-section-xs">
              {step.points[locale].map((point) => (
                <li
                  key={point}
                  className="text-sm leading-relaxed text-pretty text-muted-foreground"
                >
                  {point}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <Reveal className="mt-section-2xl">
        <RuledHeading>{t('caseResults')}</RuledHeading>
      </Reveal>
      <StaggerGroup
        as="ul"
        className="mt-section-lg grid grid-cols-1 gap-section-md sm:grid-cols-2"
      >
        {study.results[locale].map((result) => (
          <StaggerItem
            as="li"
            key={result}
            /*
              A blue rule on the reading-start edge rather than a tick: these
              are outcomes, not a checklist, and the border-inline-start reads
              as emphasis without adding a fifth icon to the page.
            */
            className="border-s-2 border-accent-blue ps-section-md"
          >
            <p className="text-base leading-relaxed text-pretty">{result}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* ── What the client said ─────────────────────────────────────────── */}
      {testimonial && (
        <Reveal className="mt-section-2xl">
          <figure className="glass mx-auto max-w-3xl p-section-lg text-center">
            {/*
              The catalogue's pull-quote (p20, p24) sets big yellow quote marks
              around the line. One quote on a page can carry them; the
              testimonial wall on the homepage, seven at a time, could not.
            */}
            <span
              aria-hidden="true"
              className="block font-display text-5xl leading-none text-highlight-yellow"
            >
              &ldquo;
            </span>
            <blockquote className="mt-section-sm text-lg leading-relaxed text-pretty">
              {testimonial.quote[locale]}
            </blockquote>
            <figcaption className="mt-section-md text-sm font-semibold">
              {testimonial.client}
              <span className="mt-0.5 block font-normal text-muted-foreground">
                {testimonial.role[locale]}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      )}
    </Section>
  )
}
