import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import type { ServiceKey } from '@/content/services'

type Step = { title: string; text: string }

/**
 * The agency's eight-step method for building a brand, recovered from the old
 * digex.agency marketing page (assets/backup/digex-content.json →
 * marketing_page.strategy_steps).
 *
 * One service only. This is deliberately not on every service page and not on
 * the homepage: it is how digital marketing is *practised*, which is a
 * different claim from the site's five-stage Process, which is how any project
 * *runs*. Putting both on one page would read as two competing methodologies.
 *
 * The gate is `serviceKey`, checked here rather than by the caller, so the
 * service page stays a single template and this component owns the one fact
 * about where it belongs.
 */
export async function ServiceStrategy({
  serviceKey,
  alt = false,
}: {
  serviceKey: ServiceKey
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
}) {
  if (serviceKey !== 'digitalMarketing') return null

  const t = await getTranslations('services.strategy')
  const steps = t.raw('steps') as Step[]

  return (
    <Section className={alt ? 'section-alt' : ''}>
      <Reveal className="max-w-3xl">
        {/* The catalogue's rule, as on every other heading of this kind. */}
        <span
          aria-hidden="true"
          className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
        />
        <h2 className="mt-section-sm text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
          {t('lead')}
        </p>
      </Reveal>

      {/*
        Eight steps in a four-column grid: two rows of four on a large screen,
        which keeps the sequence readable as two halves rather than one very
        long ladder. `<ol>` because the order is the method.
      */}
      <StaggerGroup
        as="ol"
        className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((step, index) => (
          <StaggerItem
            as="li"
            key={step.title}
            className="border-t border-border pt-section-md"
          >
            {/*
              `dir="ltr"` on the ordinal: bidi would otherwise reorder "01"
              against the Arabic beside it. Same treatment the Process section
              gives its own numbers.
            */}
            <span
              dir="ltr"
              aria-hidden="true"
              className="block text-sm font-semibold tabular-nums text-accent-blue"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-section-xs text-base font-semibold text-balance">
              {step.title}
            </h3>
            <p className="mt-section-xs text-sm leading-relaxed text-pretty text-muted-foreground">
              {step.text}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  )
}
