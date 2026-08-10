import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Highlight } from "@/components/ui/Highlight";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/icons";
import { DecorLayer, GlassBubble } from "@/components/ui/Decor";
import { contactDetails } from "@/content/services";
import { whatsappUrl } from "@/lib/whatsapp";

export async function ContactCTA({
  /**
   * Add a link through to the full contact form.
   *
   * Off by default, and deliberately opt-in rather than always-on: on the
   * homepage and on /contact itself this section already sits in a page that
   * reaches the form (or *is* it), so an extra link would be redundant. The
   * service pages close on this section with no other route to the form,
   * which is the case it exists for.
   */
  showFormLink = false,
}: { showFormLink?: boolean } = {}) {
  const t = await getTranslations("contact");

  const waUrl = whatsappUrl(t("whatsappPrefill"));

  const details = [
    { label: t("locationLabel"), value: t("locationValue") },
    { label: t("hoursLabel"), value: t("hoursValue") },
  ];

  return (
    // `section-alt` (globals.css) — a navy beat in the paper rhythm, DESIGN.md
    // §3 rule 1. Background/token flip only; nothing inside changes.
    <Section
      id="contact"
      className="isolate section-alt"
      backdrop={
        // Poster composition — DESIGN.md §2a/§2b. Two bubbles, no orb: this is
        // the closing section and the WhatsApp glass card is the thing that
        // should hold attention, so the decor stays quieter than Hero's.
        <DecorLayer>
          <GlassBubble
            size={310}
            position="bottom-[-15%] inset-s-[-7%]"
            seed="contact-a"
          />
          <GlassBubble
            size={112}
            position="top-[12%] inset-e-[11%]"
            opacity={0.8}
            seed="contact-b"
          />

          {/*
            Colour behind the glass — DESIGN.md §2f (a), rule 5: "never ship
            glass with nothing behind it." The WhatsApp card below is the
            first `.glass` surface in this section, and it sits on the
            reading-end side of the two-column grid, so these are placed
            there (`inset-e`, mirrors at /ar for free) rather than centred
            with the rest of the section's decor.
          */}
          <div className="colour-field colour-field-blue top-[34%] inset-e-[6%] size-120" />
          <div className="colour-field colour-field-violet bottom-[8%] inset-e-[20%] size-96" />
        </DecorLayer>
      }
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", {
          mark: (chunks) => <Highlight variant="block">{chunks}</Highlight>,
        })}
        lead={t("lead")}
      />

      <div className="mt-section-xl grid grid-cols-1 gap-section-lg lg:grid-cols-2">
        <dl className="grid grid-cols-1 gap-section-md sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              {t("phoneLabel")}
            </dt>
            {contactDetails.phones.map((phone) => (
              <dd key={phone} className="mt-1">
                {/*
                  dir="ltr" keeps the leading "+" attached to the number — in an
                  RTL paragraph bidi renders "+213…" as "213…+".
                */}
                <a
                  href={`tel:${phone}`}
                  dir="ltr"
                  className="inline-block text-start transition-colors hover:text-accent-blue"
                >
                  {phone}
                </a>
              </dd>
            ))}
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              {t("emailLabel")}
            </dt>
            <dd className="mt-1">
              <a
                href={`mailto:${contactDetails.email}`}
                dir="ltr"
                className="inline-block text-start transition-colors hover:text-accent-blue"
              >
                {contactDetails.email}
              </a>
            </dd>
          </div>

          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-sm font-medium text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="mt-1">{detail.value}</dd>
            </div>
          ))}
        </dl>

        {/*
          `.glass` (DESIGN.md §2f) replaces the flat bordered box this used to
          be — the colour fields added to the backdrop above are what make it
          read as glass rather than an invisible white rectangle on paper.
          `saturate(180%)` inside `.glass` is what pulls their colour through.
        */}
        <div className="glass relative flex flex-col p-section-md">
          <h3 className="text-lg font-semibold">{t("whatsappTitle")}</h3>
          <p className="mt-section-xs text-sm leading-relaxed text-muted-foreground">
            {t("whatsappBody")}
          </p>
          <div className="mt-section-md flex flex-wrap items-center gap-section-md">
            <Button href={waUrl}>
              {t("whatsappCta")}
              <ArrowIcon className="size-4" />
            </Button>
            {showFormLink && (
              /*
                Secondary to WhatsApp on purpose — a text link, not a second
                button. WhatsApp is how this audience actually gets in touch;
                the form is the alternative for people who'd rather write.
                Label is the form's own heading, so the link names its
                destination in the visitor's language without new copy.
              */
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-section-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
              >
                {t("formTitle")}
                <ArrowIcon className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
