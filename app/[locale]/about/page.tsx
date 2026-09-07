import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Highlight } from '@/components/ui/Highlight'
import { Reveal } from '@/components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { DecorLayer, GlassBubble, SpiralOrb } from '@/components/ui/Decor'
import { ContactCTA } from '@/components/sections/ContactCTA'
import {
  MarketingIcon,
  DevelopmentIcon,
  BrandingIcon,
  PrintIcon,
  ProductionIcon,
} from '@/components/icons'

/**
 * The five things the agency says it does, from the old site's About page
 * (assets/backup/digex-content.json → about.pillars).
 *
 * Keyed rather than positional, and paired here with the icons the services
 * already use — the pillars and the nine services are two descriptions of the
 * same practice, so reusing the drawings is what makes that legible instead of
 * introducing five more marks.
 */
const pillars = [
  { key: 'marketing', Icon: MarketingIcon },
  { key: 'web', Icon: DevelopmentIcon },
  { key: 'branding', Icon: BrandingIcon },
  { key: 'print', Icon: PrintIcon },
  { key: 'photo', Icon: ProductionIcon },
] as const

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return buildMetadata({
    locale,
    path: '/about',
    // `t.markup`, not `t()`: the title carries a `<mark>`, and `t()` throws
    // FORMATTING_ERROR on an unhandled tag. Metadata takes a plain string.
    title: `${t.markup('title', { mark: (chunks) => chunks })} — Digex`,
    description: t('story'),
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  return (
    <main className="flex flex-1 flex-col">
      {/* ── 1. Who we are ────────────────────────────────────────────────── */}
      <Section
        className="isolate"
        backdrop={
          /*
            Poster composition — DESIGN.md §2a/§2b. Three elements, the ceiling:
            a large bubble cropped by the reading-end corner, a small
            counterpoint, and a spiral orb opposite. All on logical insets, so
            the arrangement mirrors at /ar.
          */
          <DecorLayer>
            <GlassBubble size={300} position="top-[-14%] inset-e-[-6%]" seed="about-a" />
            <GlassBubble
              size={104}
              position="bottom-[16%] inset-e-[14%]"
              opacity={0.8}
              seed="about-b"
            />
            <SpiralOrb
              size={200}
              position="bottom-[-16%] inset-s-[-5%]"
              opacity={0.6}
              seed="about-c"
            />
          </DecorLayer>
        }
      >
        <SectionHeader
          as="h1"
          eyebrow={t('eyebrow')}
          title={t.rich('title', {
            mark: (chunks) => <Highlight variant="marker">{chunks}</Highlight>,
          })}
          lead={t('lead')}
        />
      </Section>

      {/* ── 2. Story and mission, side by side ───────────────────────────── */}
      <Section className="section-alt">
        <div className="grid grid-cols-1 gap-section-xl lg:grid-cols-2 lg:gap-section-2xl">
          <Reveal>
            <span
              aria-hidden="true"
              className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
            />
            <h2 className="mt-section-sm text-2xl font-semibold text-balance sm:text-3xl ltr:tracking-tight">
              {t('storyTitle')}
            </h2>
            <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
              {t('story')}
            </p>
          </Reveal>

          <Reveal>
            <span
              aria-hidden="true"
              className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
            />
            <h2 className="mt-section-sm text-2xl font-semibold text-balance sm:text-3xl ltr:tracking-tight">
              {t('missionTitle')}
            </h2>
            <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
              {t('mission')}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── 3. The five pillars ──────────────────────────────────────────── */}
      <Section
        className="isolate"
        backdrop={
          // Required by the glass recipe, not decoration — the pillar cards are
          // `backdrop-filter`, which has nothing to blur without colour behind
          // it. DESIGN.md §2f rule 5.
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="colour-field colour-field-blue top-[24%] inset-s-[-4%] size-120" />
            <div className="colour-field colour-field-violet bottom-[-4%] inset-e-[-2%] size-112" />
          </div>
        }
      >
        <Reveal>
          <h2 className="text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
            {t('pillarsTitle')}
          </h2>
        </Reveal>

        <StaggerGroup
          as="ul"
          className="mt-section-xl grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-3"
        >
          {pillars.map(({ key, Icon }) => (
            <StaggerItem
              as="li"
              key={key}
              className="glass flex h-full flex-col p-section-md"
            >
              <Icon className="size-8 text-accent-blue" animate />
              <h3 className="mt-section-md text-lg font-semibold text-balance">
                {t(`pillars.${key}.title`)}
              </h3>
              <p className="mt-section-sm text-sm leading-relaxed text-pretty text-muted-foreground">
                {t(`pillars.${key}.text`)}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* ── 4. Your vision, our concern ──────────────────────────────────── */}
      <Section className="section-alt">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto block h-1.5 w-10 rounded-full bg-highlight-yellow"
          />
          <h2 className="mt-section-sm text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
            {t('visionTitle')}
          </h2>
          <p className="mt-section-md text-lg leading-relaxed text-pretty text-muted-foreground">
            {t('vision')}
          </p>
        </Reveal>
      </Section>

      <ContactCTA showFormLink />
    </main>
  )
}
