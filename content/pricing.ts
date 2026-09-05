// Destination in repo: content/pricing.ts
//
// ⚠️  NO PRICES YET — the array below is deliberately empty.
//
//     Every figure this file used to carry was a placeholder invented for
//     layout, and the client's catalogue (the source the eight services were
//     rebuilt from) prints no prices at all. Rather than keep inventing
//     numbers, there is nothing here until the client sends real rates.
//
//     While the array is empty, `getPricing()` returns undefined for every
//     slug and <Pricing> renders nothing — no empty block, no "from 0 DA".
//
//     To bring pricing back: add one ServicePricing entry per slug (slugs live
//     in content/services.ts), restore the tier and feature strings under
//     `pricing.tiers.*` / `pricing.features.*` in messages/{ar,fr,en}.json, and
//     flip `pricesConfirmed` to true ONLY once every figure has been reviewed.
//
//     Deliverables no longer live here. "What's included" used to flatten each
//     tier's `featureKeys`, which tied a service's capabilities to its having
//     a price — so emptying this file would have silently deleted that section
//     from every service page. They now come from `deliverableKeys` in
//     content/services.ts, straight out of the catalogue.

export const pricesConfirmed = false as boolean

export type Currency = 'DZD'

export interface PricingTier {
  key: string
  /** null = always quote-only. */
  price: number | null
  currency: Currency
  /** true = show "starting from" prefix */
  from: boolean
  /** 'once' | 'monthly' | 'perUnit' */
  billing: 'once' | 'monthly' | 'perUnit'
  /** Highlight as the recommended tier */
  featured?: boolean
  /** i18n key under pricing.features.<key> in messages/ */
  featureKeys: string[]
}

export interface ServicePricing {
  serviceSlug: string
  tiers: PricingTier[]
}

/** Empty until the client sends real rates — see the note at the top. */
export const pricing: ServicePricing[] = []

export const getPricing = (serviceSlug: string) =>
  pricing.find((p) => p.serviceSlug === serviceSlug)

/**
 * Use this in every price-rendering component.
 * Returns null when prices are unconfirmed or the tier is quote-only,
 * so the UI falls back to the localised "on request" label.
 */
export const displayPrice = (tier: PricingTier): number | null =>
  pricesConfirmed ? tier.price : null
