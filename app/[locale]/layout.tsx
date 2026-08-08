import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { buildMetadata, localBusinessJsonLd, SITE_URL } from '@/lib/seo'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
})

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  // 700 is deliberately absent: nothing uses `font-bold`. Every weight here is
  // a separate ~35KB file, so an unused one is pure download.
  weight: ['400', '500', '600'],
  variable: '--font-arabic',
  display: 'swap',
  /*
   * Preload stays ON, deliberately.
   *
   * Instantiating a font loader emits a preload for every route in this layout,
   * so /en and /fr fetch ~101KB of Arabic they never render. `preload: false`
   * removes exactly that (measured: /en fonts 150KB -> 47KB) — but it also
   * strips the preload from /ar, where the font *is* the body text, and LCP
   * there degraded from ~136ms to a bimodal ~868ms median. Arabic is the
   * default locale, so protecting it wins. Removing the /en + /fr overhead
   * without that cost means self-hosting this family and emitting the preload
   * link only on /ar; see the note in the audit.
   */
})

/**
 * Sets `dark` on <html> before first paint, but ONLY when the visitor has
 * explicitly chosen it. DESIGN.md §3 rule 1: light is the default — the
 * brand is paper-based, so the OS preference no longer decides. The navy
 * variant is the exception, reached through the toggle.
 */
const themeInitScript = `(function(){try{document.documentElement.classList.toggle('dark',localStorage.getItem('theme')==='dark')}catch(e){}})()`

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    // Lets every nested page express its own URLs relatively if it wants to.
    metadataBase: new URL(SITE_URL),
    ...buildMetadata({
      locale,
      path: '',
      title: t('title'),
      description: t('description'),
    }),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const tMeta = await getTranslations({ locale, namespace: 'meta' })
  const tContact = await getTranslations({ locale, namespace: 'contact' })
  const jsonLd = localBusinessJsonLd({
    locale,
    description: tMeta('description'),
    areaServed: tContact('locationValue'),
  })

  return (
    <html
      lang={locale}
      dir={dir}
      /*
       * Both variables are applied. Scoping them per locale saves nothing —
       * next/font preloads by module, not by className, so the Arabic family
       * ships either way — and applying it means the "ع" in the language
       * switcher renders in the real face rather than a system fallback.
       */
      className={`${inter.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/*
          Animated elements ship as opacity:0 and are revealed by JS. If JS
          never runs they'd stay invisible, so without it we opt out of the
          animation entirely rather than hide the content.
        */}
        <noscript>
          <style>{`[data-reduce-safe]{opacity:1!important;transform:none!important;translate:none!important}`}</style>
        </noscript>
        {/*
          LocalBusiness schema. `</` is escaped so a value containing "</script>"
          could never terminate the tag early.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <NextIntlClientProvider>
          <LenisProvider>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
