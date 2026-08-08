import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'
import { ServicesMesh } from '@/components/sections/ServicesMesh'
import {
  HoverSlider,
  HoverSliderPanel,
  HoverSliderPanels,
  HoverSliderTrigger,
  HoverSliderTriggerList,
} from '@/components/ui/HoverSlider'
import { ArrowIcon } from '@/components/icons'
import { services } from '@/content/services'

export async function Services() {
  const t = await getTranslations('services')
  const locale = await getLocale()

  /*
   * Arabic is cursive, so its labels are split on whitespace rather than on
   * letters — a per-letter split severs the joins and the word falls apart.
   * See the note on `SegmentMode` in HoverSlider. Latin scripts keep the
   * reference's per-character ripple.
   *
   * Decided here, on the server, from the request locale: it has to be the
   * same value on both sides of hydration, and reading `dir` after mount would
   * change the markup once the client caught up.
   */
  const segmentBy = locale === 'ar' ? 'word' : 'grapheme'

  return (
    /*
      The panel behind this section grows to full bleed as the section scrolls
      in (`.panel-grow`, globals.css) — the "everything under one roof" claim
      arrives as a slab rather than fading in like the sections around it.

      `isolate` keeps the panel's negative z-index from escaping behind the
      page; `panel-grow-scope` is what declares the view timeline the panel
      reads its progress from.
    */
    <Section
      id="services"
      // `on-navy` (globals.css) — a navy beat in the paper rhythm, DESIGN.md
      // §3 rule 1. Background/token flip only; nothing inside changes.
      className="isolate panel-grow-scope on-navy"
      backdrop={
        <div aria-hidden="true" className="panel-grow overflow-hidden">
          <ServicesMesh />
        </div>
      }
    >
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      {/*
        Names on the reading-start side, the matching card on the reading-end
        side — the reference's layout with its image swapped for the card the
        section already had. Both columns are laid out logically, so /ar mirrors
        the whole arrangement without a direction-specific rule.

        The card content is untouched: `ServiceCard` is passed in whole, still
        rendered on the server, so its copy and its icon never enter the client
        bundle.

        Wrapped as one `<Reveal>` block rather than staggering the five rows in
        individually — matching `SectionHeader`'s own reasoning immediately
        above it ("one movement per section reads as deliberate; staggered ones
        read as fussy"). This is also the only place a stagger *could* attach
        without editing `HoverSlider.tsx`: `HoverSliderTrigger` renders straight
        to a `<button>` with no per-item wrapper, and touching that shared
        primitive to add one would reach outside this section for a single
        entrance flourish.
      */}
      <Reveal className="mt-section-xl">
        {/*
          The card is centred against the list rather than stretched to match
          it. Stretching did align the column edges, but `ServiceCard`'s body is
          `flex-1`, so it absorbed every spare pixel and opened ~250px between
          the copy and the CTA. Since the card's own content is fixed, letting
          it keep its designed proportions and sit optically centred reads far
          better than a tidy edge with a hollow middle.
        */}
        <HoverSlider className="grid gap-section-xl lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-section-2xl">
          {/*
            Read as a navigable index, not a stack of loose headings. Each row
            is a divider plus real vertical padding, which takes the optical
            separation between titles from 16px to 48px — the gap was the whole
            complaint, and at this type size 16px had the rows almost touching.
            The divider also gives every row a consistent hit area rather than
            leaving the target the exact height of its glyphs.
          */}
          <HoverSliderTriggerList
            label={t('eyebrow')}
            className="flex flex-col"
          >
            {services.map((service, index) => (
              <HoverSliderTrigger
                key={service.key}
                index={index}
                text={t(`items.${service.key}.title`)}
                segmentBy={segmentBy}
                className="py-4 text-3xl font-semibold text-balance leading-none sm:text-4xl lg:text-5xl ltr:tracking-tight"
                trailing={
                  /*
                    The selected row needs an affordance beyond a colour shift —
                    colour alone is not a reliable indicator. Only opacity
                    animates: a horizontal nudge would need mirroring at /ar,
                    and the arrow already flips direction on its own.
                  */
                  <ArrowIcon
                    aria-hidden="true"
                    className="size-5 text-accent-blue opacity-0 transition-opacity duration-200 group-data-[active=true]:opacity-100 motion-reduce:transition-none"
                  />
                }
              />
            ))}
          </HoverSliderTriggerList>

          {/*
            The panels share one grid cell, so the stack is as tall as the
            longest card and every card fills that height — the panel never
            resizes as you move between services, which is what stops the
            layout twitching mid-swap.
          */}
          <HoverSliderPanels>
            {services.map((service, index) => (
              <HoverSliderPanel key={service.key} index={index}>
                <ServiceCard service={service} />
              </HoverSliderPanel>
            ))}
          </HoverSliderPanels>
        </HoverSlider>
      </Reveal>

      <div className="mt-section-lg">
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('viewAll')}
          <ArrowIcon className="size-4" />
        </Link>
      </div>
    </Section>
  )
}
