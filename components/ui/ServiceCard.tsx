import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { ArrowIcon } from '@/components/icons'
import type { Service } from '@/content/services'

/**
 * Renders a <div> — callers supply their own wrapper (an <li>, or a
 * <StaggerItem as="li">), so the grid can stagger cards in.
 */
export async function ServiceCard({ service }: { service: Service }) {
  const t = await getTranslations('services')
  const { key, slug, Icon, accent } = service

  return (
    <>
      <Link
        href={`/services/${slug}`}
        /*
         * `glass` replaces the old `rounded-2xl border border-border` —
         * DESIGN.md §2's actual recipe (blur, border, layered shadow) instead
         * of a bare outline. `hover:bg-surface` is gone with it: a flat
         * colour swap doesn't compose with a translucent surface the way it
         * did with a solid one, and the lift + accent glow below replace it
         * as the hover affordance.
         *
         * `--service-accent` is a plain CSS custom property, not a Motion
         * value — this stays a Server Component precisely so `ServiceCard`'s
         * copy and icon never enter the client bundle (see Services.tsx), and
         * hover here is native `:hover`, which needs no JS at all. It cascades
         * to every descendant, including the icon below, so it only needs
         * setting once, here.
         *
         * `transition-[transform,box-shadow]`, never `transition-all`: this
         * card sits inside a `.panel-grow` ancestor whose own `scale` is
         * mid-animation on first scroll-in, and animating `all` would fight
         * that. Only the two properties this component itself owns transition.
         */
        style={
          {
            '--service-accent': accent,
            backgroundImage: `radial-gradient(140% 120% at 20% -10%, color-mix(in srgb, ${accent} 14%, transparent), transparent 60%)`,
          } as React.CSSProperties
        }
        className="group glass relative flex h-full flex-col p-section-md transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--glass-shadow),0_20px_45px_-20px_var(--service-accent)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
      >
        {/*
          accent comes from the token declared in content/services.ts.
          `animate` draws the icon's paths in on scroll — the icons handle
          reduced motion themselves inside IconShell. The drop-shadow glow on
          hover is the same accent as the resting stroke colour, just made to
          bloom — `group-hover` rather than its own hover means it always
          tracks the card, never the icon's own (much smaller) hit area.
        */}
        <Icon
          className="size-7 transition-[filter] duration-300 group-hover:drop-shadow-[0_0_10px_var(--service-accent)] motion-reduce:transition-none"
          style={{ color: accent }}
          animate
        />

        <h3 className="mt-section-md text-lg font-semibold">
          {t(`items.${key}.title`)}
        </h3>
        <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
          {t(`items.${key}.tagline`)}
        </p>
        <p className="mt-section-sm flex-1 text-sm leading-relaxed text-pretty text-muted-foreground">
          {t(`items.${key}.body`)}
        </p>

        <span className="mt-section-md inline-flex items-center gap-section-xs text-sm font-medium">
          {t('cta')}
          <ArrowIcon className="size-4" />
        </span>
      </Link>
    </>
  )
}
