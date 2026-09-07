// Destination in repo: content/printProducts.ts
//
// The print price list, recovered from the old digex.agency shop
// (assets/backup/digex-content.json → shop.products).
//
// ⚠️  Same status as content/pricing.ts: these figures are real and were
//     published, but nobody has confirmed they still stand. They read through
//     `pricesConfirmed` from that file, so nothing shows until it is flipped —
//     one switch governs the packs, this list and the estimator together.
//
// Names and notes are the shop's own. Where a price varies by format or
// finish, the range is kept as a range rather than flattened to its floor: a
// flag is 7 000 to 25 000 depending on size, and printing only the lower
// number would be the kind of half-truth a price list exists to avoid.

import { pricesConfirmed } from './pricing'

export interface PrintProduct {
  /** i18n key under pricing.printProducts.<key> in messages/ */
  key: string
  priceMin: number
  /** Equal to `priceMin` for a fixed price. */
  priceMax: number
  /** How the price is counted. Omitted for a plain per-item price. */
  unit?: 'perSquareMetre'
}

export const printProducts: PrintProduct[] = [
  { key: 'rollUp', priceMin: 12500, priceMax: 12500 },
  { key: 'xBanner', priceMin: 7500, priceMax: 7500 },
  { key: 'backlight', priceMin: 16500, priceMax: 16500 },
  { key: 'flag', priceMin: 7000, priceMax: 25000 },
  { key: 'tarpaulin', priceMin: 16000, priceMax: 16000, unit: 'perSquareMetre' },
  { key: 'windowFilm', priceMin: 1500, priceMax: 2000, unit: 'perSquareMetre' },
  { key: 'flyer', priceMin: 60, priceMax: 60 },
  { key: 'notebook', priceMin: 700, priceMax: 700 },
]

/**
 * Use this rather than reading `priceMin`/`priceMax` directly — same contract
 * as `displayPrice` for the packs. Returns null while prices are unconfirmed,
 * so the UI falls back to the localised "on request" label.
 */
export const displayPrintPrice = (
  product: PrintProduct,
): { min: number; max: number } | null =>
  pricesConfirmed ? { min: product.priceMin, max: product.priceMax } : null
