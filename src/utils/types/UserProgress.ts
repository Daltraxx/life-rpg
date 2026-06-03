import { AttributeProgress } from "./AttributeProgress";

/**
 * Represents the progression state of a user in the RPG system.
 * Tracks level, experience, purpose, and attribute progression data.
 * @property {number} level - The current level of the user.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} username - The username of the user.
 * @property {number} experience - The total experience points of the user.
 * @property {string | null} purpose - The user's defined purpose statement, which can be null.
 * @property {AttributeProgress[]} attributes - An array of the user's attribute progression data.
 * @property {number} levelStart - The experience points required to reach the current level.
 * @property {number} levelEnd - The experience points required to reach the next level.
 */
export interface UserProgress {
  level: number;
  userId: string;
  username: string;
  experience: number;
  purpose: string | null;
  attributes: AttributeProgress[];
  levelStart: number;
  levelEnd: number;
}
