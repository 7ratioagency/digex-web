import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ar', 'fr', 'en'],
  defaultLocale: 'ar',
  /*
   * Off, not left to infer from `Accept-Language`/the `NEXT_LOCALE` cookie.
   * Arabic is the brand's true default (CLAUDE.md) — a first-time visitor on
   * an English or French browser must still land on `/ar`, not have the
   * middleware guess a different locale for them. This only affects the
   * unprefixed "/" entry point: explicit navigation to `/en` or `/fr` (via
   * the language switcher or a direct link) is untouched, and every internal
   * link already carries the current locale forward via `Link` from
   * `lib/i18n/navigation`, so a visitor who does switch stays on their
   * chosen locale for the rest of that session regardless of this flag.
   */
  localeDetection: false,
})

export type AppLocale = (typeof routing.locales)[number]
