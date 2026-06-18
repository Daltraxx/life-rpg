import { AttributeStrength } from "./AttributeStrength";

/**
 * Represents an attribute that is affected by a quest, including its unique identifier from the database.
 * @property {number | string} id - A unique identifier for the affected attribute, which can be either a number (for database IDs) or a string (for temporary or client-side IDs).
 * @property {string} name - The name of the affected attribute (e.g., "Strength", "Intelligence").
 * @property {AttributeStrength} strength - The strength level of the attribute effect, indicating how significantly the quest impacts this attribute.
 */
export interface AffectedAttribute {
  id: number | string;
  name: string;
  strength: AttributeStrength;
};
