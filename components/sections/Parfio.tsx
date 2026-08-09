import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Highlight } from "@/components/ui/Highlight";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/icons";
import { DecorLayer, GlassBubble, SpiralOrb } from "@/components/ui/Decor";
import { contactDetails } from "@/content/services";

type Feature = { title: string; body: string };

export async function Parfio() {
  const t = await getTranslations("parfio");
  const features = t.raw("features") as Feature[];

  return (
    <Section
      // `isolate` scopes the decor layer's `-z-10` to this section.
      className="isolate"
      backdrop={
        // Poster composition — DESIGN.md §2a/§2b: large bubble cropped by the
        // end corner, orb opposite on the start side. Logical insets, so it
        // mirrors at /ar. Both sit clear of the heading and the feature grid.
        <DecorLayer>
          <GlassBubble
            size={288}
            position="top-[-11%] inset-e-[-6%]"
            seed="parfio-a"
          />
          {/*
            Cropped hard by the bottom edge rather than floating clear of it.
            At `bottom-[4%]` the rings landed directly on the CTA row — not a
            contrast failure (the primary button is solid ink) but it read as
            an accident rather than a composition. Sinking it so only the top
            arc rises into the section's lower padding keeps the balance
            against the top-end bubble while leaving the buttons clean.
          */}
          <SpiralOrb
            size={172}
            position="bottom-[-17%] inset-s-[4%]"
            opacity={0.6}
            seed="parfio-b"
          />
        </DecorLayer>
      }
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", {
          mark: (chunks) => <Highlight variant="underline">{chunks}</Highlight>,
        })}
        lead={t("lead")}
      />

      <StaggerGroup
        as="ul"
        className="mt-section-xl grid grid-cols-1 gap-section-lg sm:grid-cols-3"
      >
        {features.map((feature) => (
          <StaggerItem
            key={feature.title}
            as="li"
            className="border-t border-border pt-section-md"
          >
            <h3 className="text-lg font-semibold text-balance">
              {feature.title}
            </h3>
            <p className="mt-section-xs leading-relaxed text-pretty text-muted-foreground">
              {feature.body}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-section-lg flex flex-col gap-section-sm sm:flex-row sm:items-center">
        <Button href={contactDetails.parfio.page}>
          {t("ctaPrimary")}
          <ArrowIcon className="size-4" />
        </Button>
        <Button href={contactDetails.parfio.telegram} variant="secondary">
          {t("ctaSecondary")}
        </Button>
      </div>
    </Section>
  );
}
