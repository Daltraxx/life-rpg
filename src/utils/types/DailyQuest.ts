import { Quest } from "./Quest";

/**
 * Represents a quest for viewing on the daily quest board in the life RPG system.
 *
 * @shape
 * - `id`: number - Unique identifier
 * - `name`: string - Quest name
 * - `isCompleted`: "true" | "false" | "pending" - Whether the quest is completed for the day
 * - `description`: string | null - Optional description
 * - `affectedAttributes`: AffectedAttribute[] - Attributes modified by quest
 * - `experienceShare`: number - Experience percentage (0-100)
 * - `frequency`: number - Completion frequency
 * - `restFrequency`: number - Rest period between completions
 * - `streak`: number - Current completion streak
 * - `strengthPoints`: number - Points earned
 * - `strengthLevel`: QuestStrengthLevel - Difficulty level (S-E)
 * - `position`: number - Display position
 * - `completedQuestId`: number | null - ID of the quest completion record if completed, otherwise null
 */
export type DailyQuest = Quest & {
  isCompleted: "true" | "false" | "pending";
  completedQuestId: number | null;
};
