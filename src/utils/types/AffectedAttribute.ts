import type { SetupAffectedAttribute } from "@/utils/types/accountSetup/SetupAttributesAndQuests";

export type AffectedAttribute = SetupAffectedAttribute & {
  id: string;
};
