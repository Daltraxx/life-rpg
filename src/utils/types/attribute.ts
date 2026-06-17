/**
 * Represents an attribute for a user.
 * @property {number} id - A unique identifier for the attribute.
 * @property {string} name - The name of the attribute (e.g., "Strength", "Intelligence").
 * @property {number} experience - The total experience points accumulated for this attribute.
 * @property {number} level - The current level of the attribute based on the accumulated experience.
 */
export interface Attribute {
  id: number;
  name: string;
  experience: number;
  level: number;
}