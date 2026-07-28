import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { ArrowIcon } from '@/components/icons'

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="px-6 pt-section-2xl pb-section-xl lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
            {t('eyebrow')}
          </p>

          <h1 className="mt-section-sm text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl ltr:tracking-tight">
            {t('headline')}{' '}
            <span className="text-accent-blue">{t('headlineAccent')}</span>
          </h1>

          <p className="mt-section-md max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t('sub')}
          </p>

          <div className="mt-section-lg flex flex-col gap-section-sm sm:flex-row sm:items-center">
            <Button href="/#contact">
              {t('ctaPrimary')}
              <ArrowIcon className="size-4" />
            </Button>
            <Button href="/#work" variant="secondary">
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
