import { getLocale, getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { CheckIcon } from '@/components/icons'
import { getPricing, displayPrice, type PricingTier } from '@/content/pricing'
import { whatsappUrl } from '@/lib/whatsapp'

/**
 * Grid shape by tier count. Static full class strings, never interpolated —
 * Tailwind scans source text, so a computed `sm:grid-cols-${n}` would be
 * scanned as literal and the utility would never be generated.
 *
 * One tier (print, which is genuinely quote-only) gets a width cap instead of
 * a column count: a single card stretched across a 1280px grid reads as a
 * banner, not a package. Capped and left at the reading-start edge it stays
 * aligned with the heading above it.
 */
function gridFor(count: number) {
  if (count <= 1) return 'max-w-md'
  if (count === 2) return 'sm:grid-cols-2'
  return 'sm:grid-cols-2 lg:grid-cols-3'
}

/**
 * One package. Server-rendered — no hooks, no events, so the tier data and
 * every feature string stay out of the client bundle, and `Intl.NumberFormat`
 * below runs exactly once on the server rather than again at hydration.
 */
function TierCard({
  tier,
  name,
  features,
  labels,
  ctaHref,
  formatNumber,
}: {
  tier: PricingTier
  name: string
  features: string[]
  labels: {
    onRequest: string
    from: string
    monthly: string
    perUnit: string
    currency: string
    featured: string
    cta: string
  }
  ctaHref: string
  formatNumber: (n: number) => string
}) {
  /*
   * The ONLY price path in this file.
   *
   * `displayPrice()` — never `tier.price` — because `pricesConfirmed` is
   * currently false and every number in content/pricing.ts is a placeholder
   * invented for layout. While the flag is off this returns null for every
   * tier and the card renders the localised "on request" label instead, so a
   * placeholder figure cannot reach a visitor. It also returns null for the
   * genuinely quote-only tiers (`price: null`), which is why the null branch
   * is the real, designed state and not just a fallback.
   */
  const amount = displayPrice(tier)

  return (
    <StaggerItem
      as="li"
      /*
       * `.glass` (DESIGN.md §2f) with the colour fields behind this section
       * supplying what it blurs — rule 5: glass is a material, not a colour,
       * and needs something behind it or it is an invisible white rectangle.
       * It inverts per mode on its own, so this same markup is a paper card
       * on paper and a lit card on navy without a `dark:` variant here.
       *
       * `h-full` + the grid's default stretch keeps every card in a row the
       * same height regardless of how many features it lists, so the CTAs
       * line up along the bottom (`mt-auto` on the footer below).
       */
      className={`glass relative flex h-full flex-col p-section-md ${
        tier.featured
          ? // DESIGN.md §1: `--blue-500` is the punch colour. Colour-only
            // border (still 1px) plus a deeper blue-tinted lift — the same
            // shadow recipe ServiceCard uses for its accent glow — so the
            // featured card elevates without a border-width change that
            // would shift its content a pixel out of line with its siblings.
            'border-blue-500 shadow-[var(--glass-shadow),0_18px_50px_-18px_var(--blue-500)]'
          : ''
      }`}
    >
      <div className="flex items-center gap-section-sm">
        <h3 className="text-lg font-semibold">{name}</h3>
        {tier.featured && (
          /*
            `ms-auto`, not `ml-auto` — pushes to the inline-end so the badge
            sits opposite the name in both directions. White on `--blue-500`
            measures 5.91:1, the same pairing `Highlight variant="block"`
            already ships.
          */
          <span className="ms-auto rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
            {labels.featured}
          </span>
        )}
      </div>

      <p className="mt-section-md text-3xl font-semibold ltr:tracking-tight">
        {amount === null ? (
          labels.onRequest
        ) : (
          <>
            {tier.from && (
              <span className="me-1 text-base font-medium text-muted-foreground">
                {labels.from}
              </span>
            )}
            {formatNumber(amount)}
            <span className="ms-1 text-base font-medium text-muted-foreground">
              {labels.currency}
              {tier.billing === 'monthly' && ` ${labels.monthly}`}
              {tier.billing === 'perUnit' && ` ${labels.perUnit}`}
            </span>
          </>
        )}
      </p>

      <ul className="mt-section-md flex flex-1 flex-col gap-section-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-section-sm text-sm">
            {/*
              `shrink-0` so a feature that wraps to two lines doesn't squash
              the tick into an ellipse. `mt-0.5` optically centres a 16px icon
              against the first line of 14px text rather than its box.
            */}
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent-blue" />
            <span className="leading-relaxed text-pretty text-muted-foreground">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* `mt-auto` pins the CTA to the card's foot, so CTAs align across a row. */}
      <div className="mt-section-lg">
        <Button
          href={ctaHref}
          variant={tier.featured ? 'primary' : 'secondary'}
          className="w-full"
        >
          {labels.cta}
        </Button>
      </div>
    </StaggerItem>
  )
}

/**
 * Pricing packages for one service — DESIGN.md §2f.
 *
 * Renders nothing when the service has no entry in content/pricing.ts, so a
 * service without packages simply has no pricing block rather than an empty
 * one.
 */
export async function Pricing({
  serviceSlug,
  alt = false,
}: {
  serviceSlug: string
  /** Paint the alternating section tone (`--paper-warm` / `--navy-900`). */
  alt?: boolean
}) {
  const servicePricing = getPricing(serviceSlug)
  if (!servicePricing) return null

  const t = await getTranslations('pricing')
  const tContact = await getTranslations('contact')
  const locale = await getLocale()

  /*
   * Grouping locale, chosen per rendering rather than passed through, and
   * deliberately not the content locale at /ar:
   *
   *   - `ar` / `ar-DZ` renders Arabic-Indic digits (٩٠٬٠٠٠) — wrong here,
   *     because every other number in the Arabic copy (phone numbers, the
   *     proof stats, the process step numbers) is Western.
   *   - `ar-DZ-u-nu-latn` fixes the digits but groups with a dot: "90.000".
   *     A dot reads as a decimal separator to a lot of people, so a 90,000 DA
   *     package can look like 90 DA. Not a risk worth taking on a price.
   *
   * `fr-DZ` gives Latin digits and a space separator — how prices are actually
   * printed in Algeria — and makes /ar and /fr render identically, which is
   * correct for a single national price. Server-only, so `Intl` resolves once
   * here and the formatted string ships as HTML; there is no client pass to
   * disagree with it.
   */
  const formatter = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-DZ')
  const formatNumber = (n: number) => formatter.format(n)

  const labels = {
    onRequest: t('onRequest'),
    from: t('from'),
    monthly: t('monthly'),
    perUnit: t('perUnit'),
    currency: t('currency'),
    featured: t('featured'),
    cta: t('cta'),
  }

  // Same deep link as every other WhatsApp CTA on the site: the number comes
  // from `contactDetails`, the message from the visitor's own locale.
  const ctaHref = whatsappUrl(tContact('whatsappPrefill'))

  return (
    <Section
      // `isolate` scopes the colour fields' `-z-10` to this section — without
      // it they escape behind the page background. DESIGN.md §2f (a).
      className={`isolate ${alt ? 'section-alt' : ''}`}
      backdrop={
        // `overflow-hidden` — the fields sit on negative insets so they bleed
        // in from off-section; unclipped they extend the document and produce
        // a horizontal scrollbar. Same clip `DecorLayer` applies.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/*
            Required, not decorative: these are what the cards' `backdrop-filter`
            has to blur and what its `saturate(180%)` pulls colour from. Placed
            to sit partly behind the card row rather than beside it.
          */}
          <div className="colour-field colour-field-blue top-[18%] inset-s-[-8%] size-120" />
          <div className="colour-field colour-field-violet bottom-[-6%] inset-e-[-4%] size-112" />
        </div>
      }
    >
      <Reveal>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-section-sm max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          {t('lead')}
        </p>
      </Reveal>

      <StaggerGroup
        as="ul"
        className={`mt-section-xl grid grid-cols-1 items-stretch gap-section-md ${gridFor(
          servicePricing.tiers.length,
        )}`}
      >
        {servicePricing.tiers.map((tier) => (
          <TierCard
            key={tier.key}
            tier={tier}
            name={t(`tiers.${tier.key}`)}
            features={tier.featureKeys.map((k) => t(`features.${k}`))}
            labels={labels}
            ctaHref={ctaHref}
            formatNumber={formatNumber}
          />
        ))}
      </StaggerGroup>
    </Section>
  )
}
