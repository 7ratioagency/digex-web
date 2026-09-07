import { getLocale, getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { printProducts, displayPrintPrice } from '@/content/printProducts'
import type { ServiceKey } from '@/content/services'

/**
 * The print price list, from the old digex.agency shop.
 *
 * One service only — printing — for the same reason <ServiceStrategy> is
 * marketing-only: this is a rate card for one trade, not a site-wide feature.
 * The gate lives here so the service page stays a single template.
 *
 * ⚠️  Every figure goes through `displayPrintPrice`, never `priceMin` directly.
 *     While `pricesConfirmed` is false in content/pricing.ts that returns null
 *     for every product and the card shows the localised "on request" label —
 *     these are the *old* site's rates and nobody has confirmed they still
 *     stand. One switch governs this list, the packs and the estimator.
 */
export async function PrintPrices({
  serviceKey,
  alt = false,
}: {
  serviceKey: ServiceKey
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
}) {
  if (serviceKey !== 'printing') return null

  const t = await getTranslations('pricing')
  const locale = await getLocale()

  /*
   * Grouping locale, chosen per rendering and deliberately not the content
   * locale at /ar — the same reasoning as <Pricing>: `ar` renders
   * Arabic-Indic digits, which nothing else in the Arabic copy uses, and
   * `ar-DZ-u-nu-latn` groups with a dot, so 16 000 DA reads as 16. `fr-DZ`
   * gives Latin digits and a space, which is how prices are printed in
   * Algeria.
   */
  const formatter = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-DZ')

  return (
    <Section
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // Required by the glass recipe — the cards below are backdrop-filter,
        // which has nothing to blur without colour behind it. DESIGN.md §2f.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="colour-field colour-field-blue top-[20%] inset-s-[-6%] size-120" />
          <div className="colour-field colour-field-violet bottom-[-6%] inset-e-[-4%] size-112" />
        </div>
      }
    >
      <Reveal className="max-w-3xl">
        <span
          aria-hidden="true"
          className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
        />
        <h2 className="mt-section-sm text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
          {t('print.title')}
        </h2>
        <p className="mt-section-md text-base leading-relaxed text-pretty text-muted-foreground">
          {t('print.lead')}
        </p>
      </Reveal>

      <StaggerGroup
        as="ul"
        className="mt-section-xl grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-4"
      >
        {printProducts.map((product) => {
          const price = displayPrintPrice(product)
          const note = t(`print.products.${product.key}.note`)

          return (
            <StaggerItem
              as="li"
              key={product.key}
              className="glass flex h-full flex-col p-section-md"
            >
              <h3 className="text-base font-semibold">
                {t(`print.products.${product.key}.name`)}
              </h3>

              {/*
                `dir="ltr"` on the figure: bidi would otherwise reorder a range
                like "7 000 – 25 000" against the Arabic around it, and put the
                currency on the wrong end.
              */}
              <p
                dir="ltr"
                className="mt-section-sm text-2xl font-semibold tabular-nums text-start ltr:tracking-tight"
              >
                {price === null ? (
                  <span className="text-lg font-medium text-muted-foreground">
                    {t('onRequest')}
                  </span>
                ) : (
                  <>
                    {price.min === price.max
                      ? formatter.format(price.min)
                      : `${formatter.format(price.min)} – ${formatter.format(price.max)}`}
                    <span className="ms-1 text-sm font-medium text-muted-foreground">
                      {t('currency')}
                      {product.unit === 'perSquareMetre' &&
                        ` ${t('print.perSquareMetre')}`}
                    </span>
                  </>
                )}
              </p>

              {/* Several products carry no note; those render nothing. */}
              {note && (
                <p className="mt-section-sm text-xs leading-relaxed text-pretty text-muted-foreground">
                  {note}
                </p>
              )}
            </StaggerItem>
          )
        })}
      </StaggerGroup>
    </Section>
  )
}
