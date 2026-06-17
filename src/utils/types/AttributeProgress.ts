/**
 * Represents the progress of a specific attribute for a user, 
 * including the current level, experience points, and the experience 
 * required for the current and next levels.
 * @property {number} id - A unique identifier for the attribute.
 * @property {string} name - The name of the attribute (e.g., "Strength", "Intelligence").
 * @property {number} experience - The total experience points accumulated for this attribute.
 * @property {number} level - The current level of the attribute based on the accumulated experience.
 * @property {number} levelStart - The experience points required to reach the current level.
 * @property {number} levelEnd - The experience points required to reach the next level.
 */
export interface AttributeProgress {
  id: number;
  name: string;
  experience: number;
  level: number;
  levelStart: number;
  levelEnd: number;
}
