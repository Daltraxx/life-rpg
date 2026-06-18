/**
 * Represents an attribute for a user.
 * @property {number | string} id - A unique identifier for the attribute. 
 * Can be either a number (for database IDs) or a string (for temporary or client-side IDs).
 * @property {string} name - The name of the attribute (e.g., "Strength", "Intelligence").
 * @property {number} experience - The total experience points accumulated for this attribute.
 * @property {number} level - The current level of the attribute based on the accumulated experience.
 * @property {number} position - The order in which the attribute is displayed in the UI.
 */
export interface Attribute {
  id: number | string;
  name: string;
  experience: number;
  level: number;
  position: number;
}