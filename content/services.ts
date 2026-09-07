// Destination in repo: content/services.ts
//
// Structure only. All human-readable copy lives in messages/{ar,fr,en}.json
// under `services.items.<key>` so translators never touch code.
//
// The nine services below are the client's own catalogue (catalogue digex
// new.pdf). Eight of them are listed identically on its contents page and its
// services index; that replaced an earlier set of five, since the catalogue
// splits Branding from Identité Visuelle, splits Packaging from Impression,
// and adds Intérieur & extérieur Design, which had no equivalent here at all.
//
// The ninth, trademark registration, appears on neither list — it sits on a
// page of its own between Packaging and Intérieur, written only in Arabic, and
// the client confirmed it is a service and not an aside. Its page is a
// five-step strip (LOGO → INAPI → DESIGN PACKAGING → GS1 → CLICHÉ), which is
// where its deliverables come from.

import type { ComponentType, SVGProps } from 'react'
import type { ProjectCategory } from './projects'
import {
  BrandingIcon,
  VisualIdentityIcon,
  MarketingIcon,
  DevelopmentIcon,
  PrintIcon,
  PackagingIcon,
  TrademarkIcon,
  InteriorIcon,
  ProductionIcon,
} from '@/components/icons'

export type ServiceKey =
  | 'branding'
  | 'visualIdentity'
  | 'digitalMarketing'
  | 'digitalSolutions'
  | 'printing'
  | 'packaging'
  | 'trademark'
  | 'interiorExterior'
  | 'photoVideo'

export interface Service {
  key: ServiceKey
  /** URL segment: /services/<slug> */
  slug: string
  Icon: ComponentType<SVGProps<SVGSVGElement> & { animate?: boolean }>
  /** Accent colour token from globals.css */
  accent: string
  /**
   * Portfolio category whose projects evidence this service, used to show real
   * related work on /services/<slug>. Omitted where no such category exists.
   */
  projectCategory?: ProjectCategory
  /**
   * What this service delivers, straight from the catalogue's own copy — the
   * bolded terms in its running text and the bulleted lists under Solution
   * Numérique and Impression. Labels live in messages under
   * `services.deliverables.<key>`.
   *
   * These used to be read out of content/pricing.ts, because that file's
   * feature lists were the only place real deliverables existed. The catalogue
   * is now the source for them, which also decouples them from pricing —
   * pricing is empty until the client sends real figures, and "what's
   * included" should not disappear in the meantime.
   */
  deliverableKeys: string[]
}

/**
 * Order follows the catalogue's own listing, not a re-prioritisation: brand
 * first, then the digital services, then the production ones.
 *
 * Every service carries the same `--accent-blue`. That is the catalogue's
 * choice, not a shortcut — its services index draws every icon and every title
 * in the one indigo. Giving each a different accent would have meant inventing
 * eight colours the brand does not use.
 */
export const services: Service[] = [
  {
    key: 'branding',
    slug: 'branding',
    Icon: BrandingIcon,
    accent: 'var(--accent-blue)',
    projectCategory: 'branding',
    deliverableKeys: [
      'marketStudy',
      'targetAudience',
      'positioning',
      'customerExperience',
      'visionValues',
      'strategicPlanning',
      'competitorAnalysis',
    ],
  },
  {
    key: 'visualIdentity',
    slug: 'visual-identity',
    Icon: VisualIdentityIcon,
    accent: 'var(--accent-blue)',
    projectCategory: 'branding',
    deliverableKeys: ['logoDesign', 'graphicElements', 'brandUniverse'],
  },
  {
    key: 'digitalMarketing',
    slug: 'digital-marketing',
    Icon: MarketingIcon,
    accent: 'var(--accent-blue)',
    // No marketing category exists in content/projects.ts, so no related work.
    deliverableKeys: [
      'dataDrivenStrategy',
      'highValueContent',
      'channelManagement',
      'adCampaigns',
    ],
  },
  {
    key: 'digitalSolutions',
    slug: 'digital-solutions',
    Icon: DevelopmentIcon,
    accent: 'var(--accent-blue)',
    projectCategory: 'websites',
    deliverableKeys: [
      'showcaseSites',
      'ecommerceSeo',
      'landingPages',
      'erp',
      'cloudStorage',
      'dataProtection',
      'hostingSupport',
      'dailyBackups',
      'sslSecurity',
      'bilingualSite',
    ],
  },
  {
    key: 'printing',
    slug: 'printing',
    Icon: PrintIcon,
    accent: 'var(--accent-blue)',
    deliverableKeys: [
      'rollUps',
      'banners',
      'largePosters',
      'advertisingTarps',
      'businessCards',
      'flyers',
      'brochures',
      'catalogues',
      'microperfStickers',
      'transparentMirror',
      'customDesks',
      'customStickers',
      'loyaltyCards',
    ],
  },
  {
    key: 'packaging',
    slug: 'packaging',
    Icon: PackagingIcon,
    accent: 'var(--accent-blue)',
    deliverableKeys: ['packagingDesign', 'labels', 'shelfReady', 'dieCuts'],
  },
  {
    key: 'trademark',
    slug: 'trademark-registration',
    Icon: TrademarkIcon,
    accent: 'var(--accent-blue)',
    // Nothing in the portfolio evidences a filing, so no related work.
    deliverableKeys: [
      'logoDesign',
      'inapiFiling',
      'packagingDesign',
      'gs1Barcode',
      'clicheFile',
      'renewalProtection',
    ],
  },
  {
    key: 'interiorExterior',
    slug: 'interior-exterior',
    Icon: InteriorIcon,
    accent: 'var(--accent-blue)',
    // Storefront signage and vitrine work — filed under 'design' because it is
    // the closest bucket the portfolio has: not a website, not a brand system,
    // and not a print run, but the designed-and-installed space itself.
    projectCategory: 'design',
    deliverableKeys: [
      'exteriorSignage',
      'storefronts',
      'spacePlanning',
      'furniture',
      'lighting',
      'renders3d',
    ],
  },
  {
    key: 'photoVideo',
    slug: 'photo-video',
    Icon: ProductionIcon,
    accent: 'var(--accent-blue)',
    // 'video' exists as a category but no project currently uses it, so this
    // resolves to an empty list and the related-work block omits itself.
    projectCategory: 'video',
    deliverableKeys: [
      'productPhotography',
      'socialVideo',
      'promoVideos',
      'reels',
      'artDirection',
    ],
  },
]

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug)

/** Business contact details — single source of truth. */
export const contactDetails = {
  /*
   * Two mobiles and the Batna landline. The landline came off the old
   * digex.agency contact block (public/backup/digex-content.json → contact),
   * where it was published as 033 24 96 98; it is written here in E.164 like
   * the others so `tel:` links and the LocalBusiness schema in lib/seo.ts
   * both work without a per-number special case.
   */
  phones: ['+213662560998', '+213773007662', '+21333249698'],
  email: 'contact@digex.agency',
  whatsapp: '213662560998',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61565742478008',
    instagram: 'https://www.instagram.com/digex.agency',
    behance: 'https://www.behance.net/digexagencyD',
    youtube: 'https://www.youtube.com/@digex_agency',
    tiktok: 'https://tiktok.com/@digex_agency',
  },
} as const
