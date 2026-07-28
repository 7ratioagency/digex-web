import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { services, contactDetails } from '@/content/services'
import {
  ArrowUpIcon,
  BehanceIcon,
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@/components/icons'

const socialLinks = [
  { name: 'Facebook', href: contactDetails.social.facebook, Icon: FacebookIcon },
  { name: 'Instagram', href: contactDetails.social.instagram, Icon: InstagramIcon },
  { name: 'Behance', href: contactDetails.social.behance, Icon: BehanceIcon },
  { name: 'YouTube', href: contactDetails.social.youtube, Icon: YoutubeIcon },
  { name: 'TikTok', href: contactDetails.social.tiktok, Icon: TiktokIcon },
] as const

export async function Footer() {
  const t = await getTranslations('footer')
  const tNav = await getTranslations('nav')
  const tServices = await getTranslations('services.items')
  const tContact = await getTranslations('contact')

  const quickLinks = [
    { href: '/', label: tNav('home') },
    { href: '/#services', label: tNav('services') },
    { href: '/#work', label: tNav('work') },
    { href: '/#contact', label: tNav('contact') },
  ]

  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-section-3xl lg:px-8">
        <div className="grid grid-cols-1 gap-section-2xl sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Digex
            </Link>
            <p className="mt-section-sm max-w-xs text-sm text-muted-foreground">
              {t('tagline')}
            </p>
            <div className="mt-section-lg flex items-center gap-section-sm">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label={t('quickLinks')}>
            <h3 className="text-sm font-semibold">{t('quickLinks')}</h3>
            <ul className="mt-section-md space-y-section-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label={t('servicesTitle')}>
            <h3 className="text-sm font-semibold">{t('servicesTitle')}</h3>
            <ul className="mt-section-md space-y-section-sm">
              {services.map((service) => (
                <li key={service.key}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tServices(`${service.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">{t('contactTitle')}</h3>
            <ul className="mt-section-md space-y-section-sm text-sm text-muted-foreground">
              <li>
                {/* dir="ltr" keeps the leading "+" attached to the number at /ar */}
                <a
                  href={`tel:${contactDetails.phones[0]}`}
                  dir="ltr"
                  className="inline-block text-start transition-colors hover:text-foreground"
                >
                  {contactDetails.phones[0]}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {contactDetails.email}
                </a>
              </li>
              <li>{tContact('locationValue')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-section-2xl flex flex-col items-center justify-between gap-section-md border-t border-border pt-section-lg sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Digex — {t('rights')}
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-section-xs text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('backToTop')}
            <ArrowUpIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
