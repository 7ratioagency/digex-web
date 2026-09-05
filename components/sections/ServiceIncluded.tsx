import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { CheckIcon } from '@/components/icons'
import { getService } from '@/content/services'

/**
 * "What's included" — the service's deliverables as cards.
 *
 * The list comes from `deliverableKeys` in content/services.ts, which holds
 * the catalogue's own wording: the bolded terms in its running text and the
 * bulleted lists under Solution Numérique and Impression.
 *
 * It used to be flattened out of content/pricing.ts instead, because that
 * file's tier `featureKeys` were the only place real deliverables existed.
 * That tied a service's capabilities to its having a price — and pricing is
 * now empty until the client sends real figures, which would have deleted
 * this section from every page. What a service delivers and what it costs are
 * separate facts, so they now live apart.
 *
 * Renders nothing when a service declares no deliverables, so such a service
 * gets no section rather than a hollow one.
 */
export async function ServiceIncluded({
  serviceSlug,
  alt = false,
}: {
  serviceSlug: string
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
}) {
  const keys = getService(serviceSlug)?.deliverableKeys ?? []
  if (keys.length === 0) return null

  const t = await getTranslations('services')

  return (
    <Section
      // `isolate` scopes the colour fields' `-z-10` to this section.
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // `overflow-hidden` is load-bearing, not tidiness: the fields are
        // deliberately positioned past the section's edges (`inset-e-[-6%]`)
        // so they bleed in from outside, and without clipping that negative
        // inset extends the document — measured 1526px of scrollWidth in a
        // 1440px viewport, i.e. a horizontal scrollbar on every service page
        // in both directions. `DecorLayer` carries the same clip for the same
        // reason.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/*
            Required by the glass recipe, not decoration — DESIGN.md §2f (a)
            and rule 5: the cards below are `backdrop-filter`, which has
            nothing to blur without colour behind it.
          */}
          <div className="colour-field colour-field-violet top-[12%] inset-e-[-6%] size-120" />
          <div className="colour-field colour-field-blue bottom-[-8%] inset-s-[-4%] size-112" />
        </div>
      }
    >
      <Reveal>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
          {t('included')}
        </h2>
      </Reveal>

      <StaggerGroup
        as="ul"
        className="mt-section-xl grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-3"
      >
        {keys.map((key) => (
          <StaggerItem
            key={key}
            as="li"
            className="glass flex items-start gap-section-sm p-section-md"
          >
            {/*
              `shrink-0` so a two-line deliverable doesn't squash the tick into
              an ellipse; `mt-0.5` optically centres it against the first line
              rather than the text box.
            */}
            <CheckIcon className="mt-0.5 size-5 shrink-0 text-accent-blue" />
            <span className="leading-relaxed text-pretty">
              {t(`deliverables.${key}`)}
            </span>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  )
}
