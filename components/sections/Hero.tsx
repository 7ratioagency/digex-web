import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SplitText } from '@/components/ui/SplitText'
import { HeroBackdrop } from '@/components/sections/HeroBackdrop'
import { FloatingLogos } from '@/components/sections/FloatingLogos'
import { ArrowIcon } from '@/components/icons'

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    // `isolate` gives the backdrop's -z-10 a local stacking context, so it
    // layers behind this section's content without escaping behind the page.
    <section className="relative isolate overflow-hidden px-6 pt-section-2xl pb-section-xl lg:px-8">
      <HeroBackdrop />
      {/*
        No z-index utility here on purpose: DOM order alone puts this above
        HeroBackdrop's -z-10 mesh and below the content div that follows it.
      */}
      <FloatingLogos />

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
