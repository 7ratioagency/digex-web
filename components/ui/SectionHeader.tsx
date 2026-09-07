import { Reveal } from '@/components/ui/Reveal'

type SectionHeaderProps = {
  eyebrow: string
  /**
   * `ReactNode`, not `string`, so a section can pass `t.rich(...)` and mark
   * one word with `<Highlight>` (DESIGN.md §2c). Plain strings still work
   * unchanged — this only widens what's accepted.
   */
  title: React.ReactNode
  lead?: string
  /** Centre the header (used by the closing CTA sections) */
  centered?: boolean
  /**
   * Heading level. `h2` is right for a section inside a page that already has
   * an `h1` elsewhere — which is every homepage section, and why it is the
   * default. A standalone page whose header IS the page title passes `h1`, so
   * the document has exactly one and the outline is not missing its top level.
   */
  as?: 'h1' | 'h2'
}

/**
 * Eyebrow + h2 + lead, shared by every homepage section.
 *
 * Letter-spacing is scoped to `ltr:` on purpose — Arabic is a cursive script and
 * tracking pulls the joined glyphs apart, so it must never apply at /ar.
 *
 * The whole header rises as one block rather than per line — one movement per
 * section reads as deliberate; three staggered ones read as fussy.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  centered = false,
  as: Heading = 'h2',
}: SectionHeaderProps) {
  return (
    <Reveal
      className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      {/*
        `text-eyebrow` / `text-section` (globals.css) replace the fixed
        `text-sm` and the stepped `text-3xl sm:text-4xl`. Size only — font,
        weight, colour, tracking, alignment and the `<Highlight>` treatment
        the title may carry are all unchanged. `text-section` also carries its
        own 1.25 line-height, which is what keeps Arabic descenders clear at
        the larger size; see the token's note for why that matters here.
      */}
      <p className="text-eyebrow font-medium uppercase text-muted-foreground ltr:tracking-wide">
        {eyebrow}
      </p>
      {/*
        `leading-[1.25] rtl:leading-[1.45]` — two standalone utilities, not a
        line-height bundled into `text-section`, so the RTL variant reliably
        wins at /ar (same arrangement as the services list's
        `leading-none rtl:leading-tight`).

        1.45 rather than Latin's 1.25 because of a collision these headings
        only have in Arabic, and only once they wrap: `ج` carries a far deeper
        descender than the ~0.125em the script averages, and `Highlight`'s
        block variant bleeds 0.08em above its own line. At 1.25 the gap
        between lines was 0.25em, so a `ج` on one line landed underneath the
        next line's highlight block and was painted over — legible letters,
        covered by a blue rectangle. 1.45 opens the gap to 0.45em, which
        clears it. Latin keeps 1.25: no descender there is deep enough to
        reach, and the looser value would read as slack at this size.
      */}
      <Heading className="mt-section-xs text-section font-semibold leading-[1.25] text-balance rtl:leading-[1.45] ltr:tracking-tight">
        {title}
      </Heading>
      {lead && (
        <p className="mt-section-sm text-base leading-relaxed text-pretty text-muted-foreground">
          {lead}
        </p>
      )}
    </Reveal>
  )
}
