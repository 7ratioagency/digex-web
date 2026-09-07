import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import { testimonials } from '@/content/testimonials'
import type { Locale } from '@/content/projects'

/**
 * What clients actually said, in their own words.
 *
 * Every quote here is real — recovered from the old digex.agency site, where
 * the agency published them. The site had none before this: inventing them was
 * never an option, so the trust section could only ever show numbers and a row
 * of names.
 *
 * Laid out as a masonry-ish column flow rather than a carousel. Seven quotes
 * of uneven length in a row grid would leave four cards padded with air to
 * match the tallest; `columns` lets each keep its own height, and nothing here
 * needs to be swiped through to be found. It also costs no JavaScript, which a
 * carousel does.
 *
 * The catalogue's pull-quote treatment (p20, p24) is the reference for the
 * mark: a yellow rule over the quote, the client's name under it. Its own
 * version uses big yellow curly quotes; at this size, seven times over, that
 * would be a page of punctuation.
 */
export async function TestimonialWall() {
  const t = await getTranslations('proof')
  const locale = (await getLocale()) as Locale

  return (
    <div className="mt-section-xl border-t border-border pt-section-lg">
      <h3 className="text-lg font-semibold">{t('testimonialsTitle')}</h3>

      {/*
        `columns-*` with `break-inside-avoid` on each card. Reading order runs
        down each column and then across, which is what a wall of independent
        quotes wants — there is no sequence to preserve between them.
      */}
      <StaggerGroup
        as="ul"
        className="mt-section-lg gap-section-md sm:columns-2 lg:columns-3"
      >
        {testimonials.map((testimonial) => (
          <StaggerItem
            as="li"
            key={testimonial.client}
            className="mb-section-md break-inside-avoid"
          >
            <figure className="glass flex h-full flex-col p-section-md">
              {/* The catalogue's rule, above the quote it introduces. */}
              <span
                aria-hidden="true"
                className="block h-1 w-8 shrink-0 rounded-full bg-highlight-yellow"
              />

              <blockquote className="mt-section-md text-sm leading-relaxed text-pretty">
                {testimonial.quote[locale]}
              </blockquote>

              <figcaption className="mt-section-md">
                {/*
                  Links through to the work the quote is about, where that
                  client has a project entry — four of the seven do. The rest
                  are named plainly rather than linked somewhere they aren't.
                */}
                {testimonial.projectSlug ? (
                  <Link
                    href={`/work/${testimonial.projectSlug}`}
                    className="text-sm font-semibold transition-colors hover:text-accent-blue motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                  >
                    {testimonial.client}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold">{testimonial.client}</p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {testimonial.role[locale]}
                </p>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  )
}
