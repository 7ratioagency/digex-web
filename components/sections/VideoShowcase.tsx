import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { VideoGrid } from '@/components/ui/VideoGrid'
import { videos } from '@/content/videos'

/**
 * The agency's video work, wherever it is worth showing.
 *
 * Deliberately not gated to one service the way <PrintPrices> and
 * <ServiceStrategy> are: this is real published work, and the two places it
 * belongs are the photo & video service page and the portfolio index. The
 * caller says which.
 *
 * Labels are resolved here so <VideoGrid>, which has to be a Client Component
 * to swap a thumbnail for a player, receives finished strings and never pulls
 * the message catalogue into the bundle.
 */
export async function VideoShowcase({
  alt = false,
  headingLevel = 'h2',
}: {
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
  headingLevel?: 'h2' | 'h3'
}) {
  if (videos.length === 0) return null

  const t = await getTranslations('work')
  const Heading = headingLevel

  return (
    <Section
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // Required by the glass recipe — the cards are backdrop-filter, with
        // nothing to blur without colour behind them. DESIGN.md §2f rule 5.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="colour-field colour-field-blue top-[16%] inset-e-[-4%] size-120" />
          <div className="colour-field colour-field-violet bottom-[-6%] inset-s-[-4%] size-112" />
        </div>
      }
    >
      <Reveal className="max-w-3xl">
        {/* The catalogue's rule, as on every heading of this kind. */}
        <span
          aria-hidden="true"
          className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
        />
        <Heading className="mt-section-sm text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
          {t('videosTitle')}
        </Heading>
        <p className="mt-section-md text-base leading-relaxed text-pretty text-muted-foreground">
          {t('videosLead')}
        </p>
      </Reveal>

      <VideoGrid
        labels={{ play: t('playVideo'), watchOn: t('viewVideo') }}
      />
    </Section>
  )
}
