import { AffectedAttribute } from "./AffectedAttribute";
import { QUEST_STRENGTH_LEVELS } from "@/utils/constants/gameConstants";

/**
 * Represents a quest in the life RPG system.
 *
 * @property {number | string} id - A unique identifier for the quest, which can be either a number (for database IDs) or a string (for temporary or client-side IDs).
 * @property {string} name - The name or title of the quest.
 * @property {string | null} description - A brief description of the quest, which may be null if not provided.
 * @property {AffectedAttribute[]} affectedAttributes - An array of attributes that are affected by completing this quest.
 * @property {number} experienceShare - The percentage of experience points awarded for completing the quest.
 * @property {number} frequency - The frequency at which the quest can be completed (e.g., daily, weekly).
 * @property {number} restFrequency - The frequency at which the quest can be completed after a rest period.
 * @property {number} streak - The current streak of consecutive completions for this quest.
 * @property {number} strengthPoints - The total strength points associated with this quest, which may influence the experience multiplier.
 * @property {QuestStrengthLevel} strengthLevel - The strength level of the quest, which affects the experience multiplier.
 * @property {number} position - The order in which the quest is displayed in the UI.
 */
export interface Quest {
  id: number | string;
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

/** Strength levels for quests which affect experience multiplier */
export type QuestStrengthLevel = typeof QUEST_STRENGTH_LEVELS[number];
