import { contactDetails } from '@/content/services'

/** wa.me deep link with the localised message pre-filled for the visitor. */
export function whatsappUrl(prefill: string) {
  return `https://wa.me/${contactDetails.whatsapp}?text=${encodeURIComponent(prefill)}`
}
