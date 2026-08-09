import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Highlight } from "@/components/ui/Highlight";
import {
  ProblemCycle,
  type ProblemItem,
} from "@/components/sections/ProblemCycle";

/**
 * Stays a Server Component: it reads the messages and hands the finished header
 * down as a prop, so no copy crosses into the client bundle as a string literal
 * and `next-intl/server` keeps doing the translating.
 *
 * The four problems are the section's own content, which is why they cycle here
 * rather than the service titles — those are the answers, and they belong to the
 * Services section further down the page.
 */
export async function Problem() {
  const t = await getTranslations("problem");
  const items = t.raw("items") as ProblemItem[];

  return (
    <ProblemCycle
      items={items}
      header={
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", {
            mark: (chunks) => <Highlight variant="marker">{chunks}</Highlight>,
          })}
          lead={t("lead")}
        />
      }
    />
  );
}
