import { AffectedAttribute } from "./AffectedAttribute";

export interface Quest {
  id: string;
  name: string;
  description: string | null;
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
