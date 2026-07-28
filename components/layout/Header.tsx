import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
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
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-section-sm lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          Digex
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
