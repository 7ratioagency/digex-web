import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { ArrowIcon } from '@/components/icons'
import { ServiceWorkStrip } from '@/components/ui/ServiceWorkStrip'
import { projectsByCategory } from '@/content/projects'
import type { Service } from '@/content/services'

/**
 * Renders a <div> — callers supply their own wrapper (an <li>, or a
 * <StaggerItem as="li">), so the grid can stagger cards in.
 */
export async function ServiceCard({ service }: { service: Service }) {
  const t = await getTranslations('services')
  const { key, slug, Icon, accent, projectCategory } = service

  /*
   * Real work for this service, from content/projects.ts via the category the
   * service already declares. Five of the eight have no category that
   * evidences them, and `video` currently holds no projects — for those this
   * is empty and <ServiceWorkStrip> renders nothing at all, which is the
   * instruction: no empty state, no "coming soon".
   */
  const work = projectCategory ? projectsByCategory(projectCategory) : []

  return (
    /*
     * A <div> with a stretched link inside, not a <Link> wrapping everything.
     * The card now contains its own links out to real client sites, and an
     * anchor inside an anchor is invalid HTML — browsers silently close the
     * outer one and the markup falls apart. The service link below covers the
     * card with an `::after` overlay instead, so the whole card is still one
     * click target, and the work chips sit above it on `z-10`.
     *
     * `glass` (DESIGN.md §2) rather than a bare outline: blur, border, layered
     * shadow. `--service-accent` is a plain CSS custom property, not a Motion
     * value — this stays a Server Component precisely so the copy and icon
     * never enter the client bundle (see Services.tsx), and hover here is
     * native `:hover`, needing no JS at all. It cascades to every descendant,
     * including the icon, so it is set once here.
     *
     * `transition-[transform,box-shadow]`, never `transition-all`: this card
     * sits inside a `.panel-grow` ancestor whose own `scale` is mid-animation
     * on first scroll-in, and animating `all` would fight that.
     *
     * The focus ring is on the card but keyed to the service link specifically
     * (`has-[[data-card-link]:focus-visible]`), so tabbing to the card outlines
     * the card — while a work chip inside keeps its own smaller ring rather
     * than lighting up the whole box.
     */
    <div
      style={
        {
          '--service-accent': accent,
          backgroundImage: `radial-gradient(140% 120% at 20% -10%, color-mix(in srgb, ${accent} 14%, transparent), transparent 60%)`,
        } as React.CSSProperties
      }
      className="group glass relative flex h-full flex-col p-section-md transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--glass-shadow),0_20px_45px_-20px_var(--service-accent)] motion-reduce:transition-none has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-2 has-[[data-card-link]:focus-visible]:outline-accent-blue"
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

      {/*
        `t.markup` resolves the `<mark>` these titles carry away to plain
        text. The highlight is for the service page's own h1, where the
        title is the headline; at this size, inside a card that already has
        an accent icon and an accent tagline under it, a marker swipe would
        be the third accent competing in one box.
      */}
      <h3 className="mt-section-md text-lg font-semibold">
        {t.markup(`items.${key}.title`, { mark: (chunks) => chunks })}
      </h3>
      <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
        {t(`items.${key}.tagline`)}
      </p>
      <p className="mt-section-sm flex-1 text-sm leading-relaxed text-pretty text-muted-foreground">
        {t(`items.${key}.body`)}
      </p>

      <Link
        href={`/services/${slug}`}
        data-card-link=""
        // `after:` is what makes the whole card clickable; the ring lives on
        // the card itself, so this link needs no outline of its own.
        className="mt-section-md inline-flex items-center gap-section-xs text-sm font-medium after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
      >
        {t('cta')}
        <ArrowIcon className="size-4" />
      </Link>

      <ServiceWorkStrip projects={work} />
    </div>
  )
}
