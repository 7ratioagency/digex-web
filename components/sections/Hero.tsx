import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SplitText } from '@/components/ui/SplitText'
import { HeroBackdrop } from '@/components/sections/HeroBackdrop'
import { FloatingLogos } from '@/components/sections/FloatingLogos'
import { DecorLayer, GlassBubble, SpiralOrb } from '@/components/ui/Decor'
import { ArrowIcon } from '@/components/icons'

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    /*
     * `isolate` gives the backdrop's -z-10 a local stacking context, so it
     * layers behind this section's content without escaping behind the page.
     *
     * `-mt-[78px] pt-[174px]` (instead of plain `pt-section-2xl` / 96px):
     * the sticky nav pill is a sibling *before* this section, not inside it,
     * so without this the section's own box — and every `inset-0` decor
     * layer scoped to it (HeroBackdrop, FloatingLogos, DecorLayer) — started
     * only below the header's reserved 78px, leaving a flat, undecorated
     * `--paper`/`--navy` strip behind and above the pill instead of the
     * hero's mesh/bubbles/orbs.
     *
     * Pulling the section up by exactly the header's own measured outer
     * height (78px at every locale and breakpoint — the pill never wraps to
     * a second line) puts its top, and therefore its decor layers, at the
     * true top of the page. Padding-top grows by that same 78px so the
     * headline lands at the identical pixel position as before; the two
     * changes cancel exactly, so nothing after this section shifts either.
     * The header keeps its own unchanged `z-index: 50` in `.nav-pill`, so it
     * still paints over this section's background, not the other way round.
     */
    <section className="relative isolate -mt-19.5 overflow-hidden px-6 pt-43.5 pb-section-xl lg:px-8">
      <HeroBackdrop />
      {/*
        No z-index utility here on purpose: DOM order alone puts this above
        HeroBackdrop's -z-10 mesh and below the content div that follows it.
      */}
      <FloatingLogos />

      {/*
        Poster composition — DESIGN.md §2a/§2b: one large bubble cropped by a
        corner, a small one as counterpoint, and a spiral orb on the opposite
        side for balance.

        Everything is placed on logical `inset-s`/`inset-e`, so the whole
        arrangement mirrors at /ar and the large bubble stays on the reading-
        start corner in both directions rather than jumping sides.

        Kept to the vertical extremes on purpose: the middle of this section
        is the headline, and decor belongs around it, not behind it.

        `zIndex=""` instead of the default `-z-10`, and placed after
        `FloatingLogos` rather than before it. At `-z-10` the bubbles rendered
        beneath that component's `.contrast-scrim` — a ~94%-opaque band
        protecting the headline — which washed them to almost nothing, while
        the same components read cleanly in Parfio and Contact where no scrim
        sits over them. Ordering them after it instead lets them paint at
        full strength; the content div that follows is `relative`, so DOM
        order still keeps every bubble below the copy. Headline contrast was
        re-measured after the change rather than assumed.
      */}
      <DecorLayer zIndex="">
        <GlassBubble size={320} position="top-[-9%] inset-s-[-7%]" seed="hero-a" />
        <GlassBubble
          size={104}
          position="bottom-[9%] inset-s-[14%]"
          opacity={0.85}
          seed="hero-b"
        />
        <SpiralOrb
          size={250}
          position="top-[4%] inset-e-[-5%]"
          opacity={0.75}
          seed="hero-c"
        />
      </DecorLayer>

      {/*
        `relative` here is load-bearing, not decorative.
        `FloatingLogos` is `position: absolute`, i.e. *positioned*. Per the
        CSS stacking spec (CSS 2.1 Appendix E), any positioned element —
        even at the default `z-index: auto` — paints above every
        non-positioned in-flow sibling, regardless of DOM order: static
        content is painted in an earlier stacking step than positioned
        content. Without `relative` this div was `position: static`, so
        FloatingLogos' `.contrast-scrim` (a ~94%-opaque background fill,
        by design — see FloatingLogos.tsx) painted *over* the headline
        instead of behind it, and the whole hero read as washed-out text.
        Measured directly: the pixel at the headline's own text color
        went from rgb(5,6,13) to rgb(231,233,240) — a 94/6 blend with the
        scrim — the instant this wrapper lost `relative`.
        `relative` promotes it into the same positioned/z-auto stacking
        step as FloatingLogos, where DOM order (this div comes after)
        correctly puts it on top again.
      */}
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
            {t('eyebrow')}
          </p>

          {/*
            The headline still goes through SplitText (for the per-word inline
            box + `dir="auto"` bidi fix, see that component), but with
            `revealOnScroll={false}`: this is above the fold, already in view
            at first paint, and the whole point is not to make anyone wait to
            read it. Every other bit of hero copy is a bare static tag for the
            same reason — nothing here should spend real time below full
            opacity on load.

            Type comes from the DESIGN.md §4 tokens: `font-display` follows the
            locale (Latin display face, or IBM Plex Sans Arabic at /ar), and
            `tracking-display` resolves to 0 under RTL because negative tracking
            severs Arabic joins.
          */}
          <h1 className="mt-section-sm font-display text-display text-balance tracking-display">
            <SplitText text={t('headline')} revealOnScroll={false} />{' '}
            <SplitText
              text={t('headlineAccent')}
              className="text-accent-blue"
              revealOnScroll={false}
            />
          </h1>

          <p className="mx-auto mt-section-md max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t('sub')}
          </p>

          {/*
            DOM order stays primary-then-secondary; `flex-row` already follows
            the logical (start-to-end) direction, so it mirrors correctly under
            RTL without a `flex-row-reverse` — no direction-specific class needed.
          */}
          <div className="mt-section-lg flex flex-col items-center gap-section-sm sm:flex-row sm:items-center sm:justify-center">
            <MagneticButton>
              <Button href="/#contact">
                {t('ctaPrimary')}
                <ArrowIcon className="size-4" />
              </Button>
            </MagneticButton>
            <Button href="/#work" variant="secondary">
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
