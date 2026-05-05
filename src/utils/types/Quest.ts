import type { AffectedAttribute } from "@/utils/types/accountSetup/AttributesAndQuests";

export interface Quest {
  name: string;
  affectedAttributes: AffectedAttribute[];
  experienceShare: number;
  frequency: number;
  restFrequency: number;
  streak: number;
  strengthPoints: number;
  strengthLevel: QuestStrengthLevel;
  position: number;
}

export type QuestStrengthLevel = "S" | "A" | "B" | "C" | "D" | "E";