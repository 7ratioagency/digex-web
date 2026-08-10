import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { SITE_NAME } from '@/lib/seo'
import { HeaderShell } from './HeaderShell'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

export async function Header() {
  const t = await getTranslations('nav')

  const links = [
    { href: '/', label: t('home') },
    { href: '/#services', label: t('services') },
    { href: '/#work', label: t('work') },
    { href: '/#contact', label: t('contact') },
  ]

  return (
    <HeaderShell>
      {/*
        `relative` stays: the mobile dropdown positions against this box.
        No padding here — `.nav-pill` (globals.css) owns the pill's own
        12px/24px padding directly now, so this is just the internal
        row layout.
      */}
      <div className="relative flex items-center justify-between gap-section-md">
        {/*
          The wordmark is a proper noun, not copy — it is not translated in any
          locale, so it comes from the SITE_NAME constant rather than messages/.
        */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          {SITE_NAME}
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-section-lg">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-section-md md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-section-xs md:hidden">
          <ThemeToggle />
          <MobileMenu links={links} />
        </div>
      </div>
    </HeaderShell>
  )
}
