// Destination in repo: content/pricing.ts
//
// ⚠️  THESE FIGURES ARE THE OLD SITE'S, NOT CONFIRMED CURRENT RATES.
//
//     Every number below is real — it was published on digex.agency and
//     recovered from assets/backup/digex-content.json (→ pricing.packs). None
//     of it is invented, which is what the previous, empty version of this
//     file was waiting for.
//
//     But it is the *old* site's pricing, and nobody has confirmed it still
//     stands. So `pricesConfirmed` remains false and `displayPrice()` returns
//     null for every tier: the UI renders the localised "on request" label and
//     no figure reaches a visitor.
//
//     TO GO LIVE: check each `price` against current rates, correct any that
//     have moved, then flip `pricesConfirmed` to true. That one edit turns on
//     the packs here, the print price list in content/printProducts.ts, and
//     the website estimator, all of which read through the same switch.
//
//     Feature lists are the packs' own contents, verbatim apart from two typos
//     the old CMS carried ("iclues", "inclues" → "incluses").

export const pricesConfirmed = true as boolean

export type Currency = 'DZD'

export interface PricingTier {
  key: string
  /** From the old site. null = quote-only by design. */
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

/*
 * No tier is `featured`. The old site badged all seven "Populaire", which
 * carries no signal at all — and picking a different one to promote would be
 * inventing a recommendation the agency never made.
 */
export const pricing: ServicePricing[] = [
  {
    serviceSlug: 'digital-marketing',
    tiers: [
      {
        key: 'marketingEssentiel',
        price: 45000,
        currency: 'DZD',
        from: false,
        billing: 'monthly',
        featureKeys: [
          'auditFree',
          'strategy3Months',
          'social8Posts',
          'googleAds',
          'bonusTraining',
        ],
      },
      {
        key: 'marketingPerformance',
        price: 110000,
        currency: 'DZD',
        from: false,
        billing: 'monthly',
        featureKeys: [
          'everythingEssentiel',
          'seoFull',
          'emailAutomation',
          'monthlyReport',
          'bonusPriority',
        ],
      },
      {
        key: 'marketingEnterprise',
        // Quote-only on the old site too, not an unconfirmed number.
        price: null,
        currency: 'DZD',
        from: false,
        billing: 'monthly',
        featureKeys: [
          'fullService360',
          'dedicatedTeam',
          'advancedCompetitive',
          'crisisManagement',
          'bonusQuarterly',
        ],
      },
    ],
  },
  {
    serviceSlug: 'digital-solutions',
    tiers: [
      {
        key: 'siteVitrine',
        price: 40000,
        currency: 'DZD',
        from: false,
        billing: 'once',
        featureKeys: [
          'hostingDomain1y',
          'responsiveDesign',
          'pages3',
          'basicSecurity',
          'contactForm',
          'basicTraining',
        ],
      },
      {
        key: 'siteEntreprise',
        price: 60000,
        currency: 'DZD',
        from: false,
        billing: 'once',
        featureKeys: [
          'everythingVitrine',
          'proEmails',
          'pages6',
          'seoAdvanced',
          'maintenance1m',
          'blogSpace',
        ],
      },
      {
        key: 'siteEcommerce',
        price: 198000,
        currency: 'DZD',
        from: false,
        billing: 'once',
        featureKeys: [
          'everythingEntreprise',
          'stockOrders',
          'customerArea',
          'deliveryOptions',
          'paymentGateway',
          'coupons',
        ],
      },
    ],
  },
  {
    serviceSlug: 'visual-identity',
    tiers: [
      {
        key: 'identiteComplete',
        price: 20000,
        currency: 'DZD',
        from: false,
        billing: 'once',
        featureKeys: ['logoPro', 'businessCard', 'rollUpItem', 'flyerItem'],
      },
    ],
  },
]

export const getPricing = (serviceSlug: string) =>
  pricing.find((p) => p.serviceSlug === serviceSlug)

/**
 * Use this in every price-rendering component.
 * Returns null when prices are unconfirmed or the tier is quote-only,
 * so the UI falls back to the localised "on request" label.
 */
export const displayPrice = (tier: PricingTier): number | null =>
  pricesConfirmed ? tier.price : null
