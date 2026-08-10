import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Highlight } from '@/components/ui/Highlight'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import type { ProcessStep } from '@/components/sections/ProcessStack'

/**
 * The same five stages as the homepage, at a scale that fits inside a longer
 * page.
 *
 * Reads the identical `process.*` messages `<Process>` does — same eyebrow,
 * same marked title, same five steps — so there is one source of truth for
 * how Digex works and nothing here is service-specific copy that would have
 * had to be invented.
 *
 * What differs is only the presentation. `<ProcessStack>` gives each stage a
 * pinned, full-viewport panel: right for the homepage, where the sequence is
 * the section, but on a service page it would spend five screens between
 * "what's included" and the work that proves it, burying everything below.
 * This renders the same content as a card row instead — the step number keeps
 * the `--gradient-signature` treatment from the stack so the two read as the
 * same thing at two sizes.
 */
export async function ProcessCompact({ alt = false }: { alt?: boolean }) {
  const t = await getTranslations('process')
  const steps = t.raw('steps') as ProcessStep[]

  return (
    <Section
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // `overflow-hidden` — the fields sit on negative insets so they bleed
        // in from off-section; unclipped they extend the document and produce
        // a horizontal scrollbar. Same clip `DecorLayer` applies.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Colour behind the glass — DESIGN.md §2f (a). */}
          <div className="colour-field colour-field-blue top-[10%] inset-s-[-6%] size-120" />
          <div className="colour-field colour-field-violet bottom-[-10%] inset-e-[2%] size-112" />
        </div>
      }
    >
      <SectionHeader
        eyebrow={t('eyebrow')}
        // Same key and same variant as the homepage's Process header.
        title={t.rich('title', {
          mark: (chunks) => <Highlight variant="underline">{chunks}</Highlight>,
        })}
        lead={t('lead')}
      />

      <StaggerGroup
        as="ol"
        className="mt-section-xl grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-3"
      >
        {steps.map((step) => (
          <StaggerItem
            key={step.step}
            as="li"
            className="glass flex h-full flex-col p-section-md"
          >
            {/*
              `--gradient-signature` (DESIGN.md §1/§7 — "the one signature
              gradient... never a second one"), the same treatment the pinned
              stack gives its step numbers, just at card scale.
            */}
            <span
              className="bg-clip-text font-display text-4xl leading-none font-bold tabular-nums text-transparent"
              style={{ backgroundImage: 'var(--gradient-signature)' }}
            >
              {step.step}
            </span>
            <h3 className="mt-section-md text-lg font-semibold text-balance">
              {step.title}
            </h3>
            <p className="mt-section-xs leading-relaxed text-pretty text-muted-foreground">
              {step.body}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  )
}
