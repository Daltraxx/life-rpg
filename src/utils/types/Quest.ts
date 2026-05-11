import { SetupQuest } from "./accountSetup/SetupAttributesAndQuests";

/**
 * Represents a quest in the life RPG system.
 *
 * @shape
 * - `id`: number - Unique identifier
 * - `name`: string - Quest name
 * - `description`: string | null - Optional description
 * - `affectedAttributes`: AffectedAttribute[] - Attributes modified by quest
 * - `experienceShare`: number - Experience percentage (0-100)
 * - `frequency`: number - Completion frequency
 * - `restFrequency`: number - Rest period between completions
 * - `streak`: number - Current completion streak
 * - `strengthPoints`: number - Points earned
 * - `strengthLevel`: QuestStrengthLevel - Difficulty level (S-E)
 * - `position`: number - Display position
 */
export type Quest = SetupQuest & {
  id: number;
  description: string | null;
  frequency: number;
  restFrequency: number;
  streak: number;
  strengthPoints: number;
  strengthLevel: QuestStrengthLevel;
  position: number;
}

/** Strength levels for quests which affect experience multiplier */
export type QuestStrengthLevel = "S" | "A" | "B" | "C" | "D" | "E";
