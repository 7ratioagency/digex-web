import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Highlight } from "@/components/ui/Highlight";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { ServicesMesh } from "@/components/sections/ServicesMesh";
import { DecorLayer, GlassBubble, SpiralOrb } from "@/components/ui/Decor";
import { ArrowIcon } from "@/components/icons";
import { services } from "@/content/services";

/**
 * The services index, laid out as the client's catalogue lays it out (p6).
 *
 * That page is a single column of rows: the service's own line-art icon on the
 * reading-start side, the title beside it in indigo, and a second line under
 * the title in near-black. No cards, no dividers, nothing revealed on hover —
 * the whole list is legible at once. It replaces the hover slider this section
 * used to be, where eight of nine services showed a title and nothing else
 * until you pointed at them.
 *
 * One deliberate difference. The catalogue's second line is the Arabic title,
 * because the book is bilingual on every page; here it is the service's own
 * tagline, resolved per locale. Printing French over Arabic would read as the
 * catalogue at /ar and as a mistake at /en, whereas the tagline keeps the
 * two-line rhythm the layout is built on and says something in every locale.
 *
 * Server Component throughout, which the hover slider could not be: with no
 * hover state to track there is no client boundary here at all, so every
 * service title, tagline and icon stays out of the browser bundle.
 */
export async function Services() {
  const t = await getTranslations("services");

  return (
    /*
      The panel behind this section grows to full bleed as the section scrolls
      in (`.panel-grow`, globals.css) — the "everything under one roof" claim
      arrives as a slab rather than fading in like the sections around it. It
      is also the closest thing the site has to the catalogue's own device: p6
      sets its list on a grey panel inset from the page.

      `isolate` keeps the panel's negative z-index from escaping behind the
      page; `panel-grow-scope` is what declares the view timeline the panel
      reads its progress from.
    */
    <Section
      id="services"
      // `section-alt` (globals.css) — a navy beat in the paper rhythm, DESIGN.md
      // §3 rule 1. Background/token flip only; nothing inside changes.
      className="isolate panel-grow-scope section-alt"
      backdrop={
        <div aria-hidden="true" className="panel-grow overflow-hidden">
          <ServicesMesh />
          {/*
            Poster composition — DESIGN.md §2a/§2b. Two elements only, both on
            the reading-end side: the list is capped at `max-w-3xl` on the
            reading-start side, exactly as the catalogue's own column is, so
            the decor has the open half of the section to itself.

            `zIndex=""` rather than the default `-z-10`: this renders inside
            `.panel-grow`, which is itself `z-index: -1` with its own fill —
            going negative again would drop the decor behind that fill and it
            would never be seen.
          */}
          <DecorLayer zIndex="">
            <GlassBubble
              size={300}
              position="bottom-[-13%] inset-e-[-6%]"
              seed="svc-a"
            />
            <SpiralOrb
              size={190}
              position="top-[7%] inset-e-[9%]"
              opacity={0.7}
              seed="svc-b"
            />
          </DecorLayer>
        </div>
      }
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", {
          mark: (chunks) => <Highlight variant="block">{chunks}</Highlight>,
        })}
        lead={t("lead")}
      />

      {/*
        Staggered by row rather than revealed as one block. Nine rows arriving
        together is a lot of movement at once; 0.08s apart (the house interval,
        set in lib/motion) reads as the list assembling itself. StaggerItem
        handles reduced motion.
      */}
      <StaggerGroup
        as="ul"
        className="mt-section-xl flex max-w-3xl flex-col gap-section-xs"
      >
        {services.map((service) => {
          const { key, slug, Icon } = service;

          return (
            <StaggerItem as="li" key={key}>
              <Link
                href={`/services/${slug}`}
                /*
                  `-mx-3 px-3` pulls the row's own padding out past the text
                  column, so the hover tint reads as a band while the type
                  stays aligned with the header above it. The row is ~64px
                  tall, comfortably past the 44px touch target, without the
                  dividers the previous layout needed to create a hit area —
                  the catalogue has none and does not need them.
                */
                className="group -mx-3 flex items-center gap-section-md rounded-2xl px-3 py-3 transition-colors duration-200 hover:bg-surface/60 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
              >
                {/*
                  40px, matching the catalogue's icon scale on p6 — large
                  enough that the drawing reads, small enough that the title
                  still leads the row. `animate` draws the paths in on scroll;
                  the icons handle reduced motion themselves inside IconShell.
                */}
                <Icon className="size-10 shrink-0 text-accent-blue" animate />

                <div className="min-w-0">
                  {/*
                    Indigo and bold, as the catalogue sets every service title.
                    `text-accent-blue` rather than the raw `--blue-500`: that
                    step measures 2.6:1 on navy and is unusable for type in
                    dark mode, and the token already resolves to the light ramp
                    step there.

                    `t.markup` resolves away the `<mark>` these titles carry for
                    the service page's own headline — `t()` throws
                    FORMATTING_ERROR on an unhandled tag, and a marker swipe at
                    this size would fight the icon beside it.
                  */}
                  <p className="text-lg font-semibold text-balance text-accent-blue sm:text-xl">
                    {t.markup(`items.${key}.title`, {
                      mark: (chunks) => chunks,
                    })}
                  </p>
                  <p className="mt-0.5 text-base text-pretty text-muted-foreground">
                    {t(`items.${key}.tagline`)}
                  </p>
                </div>

                {/*
                  `ms-auto` pushes it to the inline-end under either direction;
                  ArrowIcon flips itself. Hidden until the row is pointed at or
                  focused on desktop, always visible below `lg` where there is
                  no hover to reveal it — the same rule this section has carried
                  since the arrows were first made unconditional on mobile.
                */}
                <ArrowIcon
                  aria-hidden="true"
                  className="ms-auto size-5 shrink-0 text-accent-blue opacity-0 transition-opacity duration-200 max-lg:opacity-100 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                />
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <div className="mt-section-lg">
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
        >
          {t("viewAll")}
          <ArrowIcon className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
