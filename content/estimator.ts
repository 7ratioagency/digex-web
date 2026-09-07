// Destination in repo: content/estimator.ts
//
// The website pricing calculator from the old digex.agency
// (assets/backup/digex-content.json → website_calculator), where it ran as a
// WordPress plugin with the formula
//
//   radio_field_id_0 + toggle_field_id_1 + range_field_id_2
//     + dropDown_field_id_3 + toggle_field_id_4
//
// i.e. a plain sum of the selected options, with the page count multiplied by
// its unit price. That is reproduced exactly in `estimateTotal` below.
//
// ⚠️  Same status as content/pricing.ts, and it reads the same switch: these
//     are the *old* rates. While `pricesConfirmed` is false the estimator does
//     not render at all — an estimator that cannot show a number is worse than
//     no estimator, so it withholds itself rather than displaying "on request"
//     where a total belongs.

import { pricesConfirmed } from './pricing'

export interface EstimatorChoice {
  /** i18n key under pricing.estimator.choices.<key> */
  key: string
  price: number
}

export const websiteTypes: EstimatorChoice[] = [
  { key: 'landingPage', price: 5000 },
  { key: 'professionalSite', price: 30000 },
  { key: 'ecommerce', price: 100000 },
]

export const hostingOptions: EstimatorChoice[] = [
  { key: 'basicHosting', price: 6000 },
  { key: 'proHosting', price: 30000 },
]

/** Custom design, as a single priced toggle. */
export const customDesignPrice = 25000

/** Per page, on top of the base. */
export const pagePrice = 5000
export const pageDefault = 10
export const pageMin = 1
export const pageMax = 30

/**
 * Professional email was a toggle worth 0 on the old calculator — offered, and
 * free. Kept as a toggle so the estimate says so out loud rather than leaving
 * people to wonder whether it costs extra.
 */
export const proEmailPrice = 0

export interface EstimatorSelection {
  websiteType: string
  customDesign: boolean
  pages: number
  hosting: string
  proEmail: boolean
}

/** The old plugin's formula, unchanged: a sum, with pages multiplied out. */
export function estimateTotal(selection: EstimatorSelection): number {
  const type = websiteTypes.find((t) => t.key === selection.websiteType)
  const hosting = hostingOptions.find((h) => h.key === selection.hosting)

  return (
    (type?.price ?? 0) +
    (selection.customDesign ? customDesignPrice : 0) +
    selection.pages * pagePrice +
    (hosting?.price ?? 0) +
    (selection.proEmail ? proEmailPrice : 0)
  )
}

/** Whether the estimator may render at all. See the note at the top. */
export const estimatorEnabled = pricesConfirmed
