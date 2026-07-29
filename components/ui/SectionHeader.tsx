import { Reveal } from '@/components/ui/Reveal'

type SectionHeaderProps = {
  eyebrow: string
  title: string
  lead?: string
  /** Centre the header (used by the closing CTA sections) */
  centered?: boolean
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
}: SectionHeaderProps) {
  return (
    <Reveal
      className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      <p className="text-sm font-medium uppercase text-muted-foreground ltr:tracking-wide">
        {eyebrow}
      </p>
      <h2 className="mt-section-xs text-3xl font-semibold text-balance sm:text-4xl ltr:tracking-tight">
        {title}
      </h2>
      {lead && (
        <p className="mt-section-sm text-base leading-relaxed text-pretty text-muted-foreground">
          {lead}
        </p>
      )}
    </Reveal>
  )
}
