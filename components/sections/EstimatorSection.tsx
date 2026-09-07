import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { WebsiteEstimator } from '@/components/sections/WebsiteEstimator'
import { estimatorEnabled } from '@/content/estimator'
import type { ServiceKey } from '@/content/services'

/**
 * The website estimator, on the digital solutions page and nowhere else.
 *
 * Two gates, both here so the service page stays a single template and the
 * client component below never has to know why it might not be wanted:
 *
 *   - the service, as with <ServiceStrategy> and <PrintPrices>;
 *   - `estimatorEnabled`, which is `pricesConfirmed` from content/pricing.ts.
 *     While that is false this renders nothing at all. An estimator whose
 *     total reads "on request" is worse than no estimator: it asks people to
 *     make five choices and then refuses to answer.
 *
 * Every label is resolved here, on the server, and handed down as plain
 * strings — so the message catalogue never crosses into the client bundle even
 * though the total has to be computed there.
 */
export async function EstimatorSection({
  serviceKey,
  alt = false,
}: {
  serviceKey: ServiceKey
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
}) {
  if (serviceKey !== 'digitalSolutions' || !estimatorEnabled) return null

  const t = await getTranslations('pricing')

  const labels = {
    title: t('estimator.title'),
    lead: t('estimator.lead'),
    websiteType: t('estimator.websiteType'),
    customDesign: t('estimator.customDesign'),
    customDesignHint: t('estimator.customDesignHint'),
    pages: t('estimator.pages'),
    pagesHint: t('estimator.pagesHint'),
    hosting: t('estimator.hosting'),
    hostingHint: t('estimator.hostingHint'),
    proEmail: t('estimator.proEmail'),
    proEmailHint: t('estimator.proEmailHint'),
    included: t('estimator.included'),
    total: t('estimator.total'),
    currency: t('currency'),
    disclaimer: t('estimator.disclaimer'),
    choices: {
      landingPage: t('estimator.choices.landingPage'),
      professionalSite: t('estimator.choices.professionalSite'),
      ecommerce: t('estimator.choices.ecommerce'),
      basicHosting: t('estimator.choices.basicHosting'),
      proHosting: t('estimator.choices.proHosting'),
    },
  }

  return (
    <Section
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // Required by the glass recipe — the controls and the total panel are
        // backdrop-filter, with nothing to blur without colour behind them.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="colour-field colour-field-blue top-[18%] inset-e-[-4%] size-120" />
          <div className="colour-field colour-field-violet bottom-[-4%] inset-s-[-6%] size-112" />
        </div>
      }
    >
      <Reveal className="max-w-3xl">
        <span
          aria-hidden="true"
          className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
        />
        <h2 className="mt-section-sm text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
          {labels.title}
        </h2>
        <p className="mt-section-md text-base leading-relaxed text-pretty text-muted-foreground">
          {labels.lead}
        </p>
      </Reveal>

      <WebsiteEstimator labels={labels} />
    </Section>
  )
}
