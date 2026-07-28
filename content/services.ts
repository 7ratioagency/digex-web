// Destination in repo: content/services.ts
//
// Structure only. All human-readable copy lives in messages/{ar,fr,en}.json
// under `services.items.<key>` so translators never touch code.

import type { ComponentType, SVGProps } from 'react'
import type { ProjectCategory } from './projects'
import {
  DevelopmentIcon,
  BrandIcon,
  MarketingIcon,
  ProductionIcon,
  PrintIcon,
} from '@/components/icons'

export type ServiceKey =
  | 'development'
  | 'brand'
  | 'marketing'
  | 'production'
  | 'print'

export interface Service {
  key: ServiceKey
  /** URL segment: /services/<slug> */
  slug: string
  Icon: ComponentType<SVGProps<SVGSVGElement> & { animate?: boolean }>
  /** Sub-pages under this service, if any */
  children?: { slug: string; key: string }[]
  /** Accent colour token from globals.css */
  accent: string
  /**
   * Portfolio category whose projects evidence this service, used to show real
   * related work on /services/<slug>. Omitted where no such category exists.
   */
  projectCategory?: ProjectCategory
}

export const services: Service[] = [
  {
    key: 'development',
    slug: 'development',
    Icon: DevelopmentIcon,
    accent: 'var(--accent-blue)',
    children: [{ slug: 'ecommerce', key: 'ecommerce' }],
    projectCategory: 'websites',
  },
  {
    key: 'brand',
    slug: 'brand',
    Icon: BrandIcon,
    accent: 'var(--accent-violet)',
    projectCategory: 'branding',
  },
  {
    // No 'marketing' portfolio category exists yet, so no related work block.
    key: 'marketing',
    slug: 'marketing',
    Icon: MarketingIcon,
    accent: 'var(--accent-cyan)',
  },
  {
    key: 'production',
    slug: 'production',
    Icon: ProductionIcon,
    accent: 'var(--accent-amber)',
    children: [{ slug: 'marketing-videos', key: 'marketingVideos' }],
    projectCategory: 'video',
  },
  {
    key: 'print',
    slug: 'print',
    Icon: PrintIcon,
    accent: 'var(--accent-rose)',
    projectCategory: 'print',
  },
]

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug)

/** Business contact details — single source of truth. */
export const contactDetails = {
  phones: ['+213662560998', '+213773007662'],
  email: 'contact@digex.agency',
  whatsapp: '213662560998',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61565742478008',
    instagram: 'https://www.instagram.com/digex.agency',
    behance: 'https://www.behance.net/digexagencyD',
    youtube: 'https://www.youtube.com/@digex_agency',
    tiktok: 'https://tiktok.com/@digex_agency',
  },
  parfio: {
    page: '/parfio',
    telegram: 'https://t.me/+NQSwq4qwpuE3Zjg0',
  },
} as const