// Destination in repo: content/pricing.ts
//
// ⚠️  ALL PRICES BELOW ARE PLACEHOLDERS INVENTED FOR LAYOUT PURPOSES.
//     They are NOT real Digex rates. Replace every `price` value before launch.
//
//     The `pricesConfirmed` flag below is a safety switch: while it is false,
//     the UI must render "على الطلب / Sur devis / On request" instead of the
//     number. Flip to true ONLY after every price has been reviewed and
//     replaced with a real figure.
//
//     Package CONTENTS (the feature lists) are real — taken from the agency's
//     own Instagram posts. Only the numbers are placeholder.

export const pricesConfirmed = false as boolean

export type Currency = 'DZD'

export interface PricingTier {
  key: string
  /** PLACEHOLDER — replace with real figure. null = always quote-only. */
  price: number | null
  currency: Currency
  /** true = show "starting from" prefix */
  from: boolean
  /** 'once' | 'monthly' | 'perUnit' */
  billing: 'once' | 'monthly' | 'perUnit'
  /** Highlight as the recommended tier */
  featured?: boolean
  /** i18n key under pricing.tiers.<key> in messages/ */
  featureKeys: string[]
}

export interface ServicePricing {
  serviceSlug: string
  tiers: PricingTier[]
}

export const pricing: ServicePricing[] = [
  {
    serviceSlug: 'development',
    tiers: [
      {
        key: 'vitrine',
        price: 90000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'once',
        // Real package contents, from the agency's Instagram post
        featureKeys: [
          'pages5',
          'bilingual',
          'responsive',
          'domain',
          'emails5',
          'contactForm',
          'basicSeo',
        ],
      },
      {
        key: 'ecommerce',
        price: 180000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'once',
        featured: true,
        featureKeys: [
          'everythingVitrine',
          'productCatalogue',
          'cashOnDelivery',
          'courierIntegration',
          'adminDashboard',
          'orderManagement',
          'stockTracking',
        ],
      },
      {
        key: 'custom',
        price: null, // quote-only by design
        currency: 'DZD',
        from: false,
        billing: 'once',
        featureKeys: [
          'customPlatform',
          'apiIntegrations',
          'dedicatedSupport',
          'scalableArchitecture',
        ],
      },
    ],
  },
  {
    serviceSlug: 'brand',
    tiers: [
      {
        key: 'logo',
        price: 35000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'once',
        featureKeys: ['logoConcepts', 'colourPalette', 'typography', 'fileFormats'],
      },
      {
        key: 'identity',
        price: 85000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'once',
        featured: true,
        featureKeys: [
          'everythingLogo',
          'brandGuidelines',
          'packaging',
          'socialTemplates',
          'stationery',
        ],
      },
    ],
  },
  {
    serviceSlug: 'marketing',
    tiers: [
      {
        key: 'starter',
        price: 35000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'monthly',
        featureKeys: ['campaignSetup', 'wilayaTargeting', 'monthlyReport', 'adCreatives4'],
      },
      {
        key: 'growth',
        price: 70000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'monthly',
        featured: true,
        featureKeys: [
          'everythingStarter',
          'multiPlatform',
          'weeklyReport',
          'adCreatives12',
          'abTesting',
        ],
      },
    ],
  },
  {
    serviceSlug: 'production',
    tiers: [
      {
        key: 'photoPack',
        price: 25000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'perUnit',
        featureKeys: ['productShots20', 'retouching', 'webReady'],
      },
      {
        key: 'videoPack',
        price: 45000, // PLACEHOLDER
        currency: 'DZD',
        from: true,
        billing: 'perUnit',
        featured: true,
        featureKeys: ['shortFormVideo', 'editing', 'subtitles', 'platformFormats'],
      },
    ],
  },
  {
    serviceSlug: 'print',
    tiers: [
      {
        key: 'printQuote',
        price: null, // genuinely quote-based — depends on run size and material
        currency: 'DZD',
        from: false,
        billing: 'once',
        featureKeys: ['packaging', 'signage', 'businessCards', 'largeFormat', 'qualityControl'],
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