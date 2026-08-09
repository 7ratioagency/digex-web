import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Highlight } from "@/components/ui/Highlight";
import {
  ProcessStack,
  type ProcessStep,
} from "@/components/sections/ProcessStack";

export async function Process() {
  const t = await getTranslations("process");
  const steps = t.raw("steps") as ProcessStep[];

  return (
    <ProcessStack
      steps={steps}
      // Rendered here so the header stays server-rendered even though the
      // sequence itself has to be a Client Component.
      header={
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", {
            mark: (chunks) => (
              <Highlight variant="underline">{chunks}</Highlight>
            ),
          })}
          lead={t("lead")}
        />
      }
    />
  );
}
