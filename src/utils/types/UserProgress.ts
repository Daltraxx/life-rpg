import { AttributeProgress } from "./AttributeProgress";

/**
 * Represents the progression state of a user in the RPG system.
 * Tracks level, experience, purpose, and attribute progression data.
 * @property {number} level - The current level of the user.
 * @property {number} experience - The total experience points of the user.
 * @property {string} purpose - The user's defined purpose statement.
 * @property {AttributeProgress[]} attributes - An array of the user's attribute progression data.
 * @property {number} levelStart - The experience points required to reach the current level.
 * @property {number} levelEnd - The experience points required to reach the next level.
 */
export interface UserProgress {
  level: number;
  userId: string;
  experience: number;
  purpose: string;
  attributes: AttributeProgress[];
  levelStart: number;
  levelEnd: number;
}
