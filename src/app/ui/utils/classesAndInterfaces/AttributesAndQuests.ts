import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";

/**
 * Represents an attribute with a name and display order.
 *
 * @interface Attribute
 * @property {string} name - The name of the attribute.
 * @property {number} order - The display order or priority of the attribute.
 */
export interface Attribute {
  name: string;
  order: number;
}

/**
 * Creates a new Attribute object with the specified name and order.
 *
 * @param name - The name of the attribute. Must be a non-empty string after trimming whitespace.
 * @param order - The numeric order/position of the attribute.
 * @returns A new Attribute object containing the provided name and order.
 * @throws {Error} Throws an error if the name parameter is empty, null, undefined, or contains only whitespace
 */
export function createAttribute(name: string, order: number): Attribute {
  if (!name?.trim()) {
    throw new Error("Attribute name cannot be empty");
  }
  if (Number.isFinite(order)) {
    throw new Error("Attribute order must be a finite number");
  }
  return { name, order };
}

/**
 * Represents an attribute that is affected by a quest.
 *
 * @interface AffectedAttribute
 * @property {string} name - The name of the affected attribute.
 * @property {AttributeStrength} strength - The strength or intensity of the attribute's effect.
 */
export interface AffectedAttribute {
  name: string;
  strength: AttributeStrength;
}

/**
 * Creates an affected attribute object with validation.
 *
 * @param name - The name of the attribute. Must not be empty or contain only whitespace.
 * @param strength - The strength level of the attribute effect.
 * @returns An object representing the affected attribute.
 * @throws {Error} If the attribute name is empty or contains only whitespace.
 *
 * @example
 * const affected = createAffectedAttribute('Health', AttributeStrength.Major);
 */
export function createAffectedAttribute(
  name: string,
  strength: AttributeStrength
): AffectedAttribute {
  if (!name?.trim()) {
    throw new Error("Attribute name cannot be empty");
  }
  return { name, strength };
}

/**
 * Represents a quest in the Life RPG system.
 *
 * @interface Quest
 * @property {string} name - The name or title of the quest.
 * @property {AffectedAttribute[]} affectedAttributes - An array of attributes that are affected by completing this quest.
 * @property {number} order - The sequence or priority order of the quest, used for sorting or determining quest progression.
 */
export interface Quest {
  name: string;
  affectedAttributes: AffectedAttribute[];
  order: number;
}

/**
 * Creates a new quest with the specified name and affected attributes.
 *
 * @param name - The name of the quest. It must not be empty or consist only of whitespace.
 * @param affectedAttributes - An array of attributes that are affected by the quest.
 * @param order - Number determining where quest appears in a list.
 * @throws {Error} Throws an error if the quest name is empty or only whitespace.
 * @returns A Quest object containing the name and affected attributes.
 */
export function createQuest(
  name: string,
  affectedAttributes: AffectedAttribute[],
  order: number
): Quest {
  if (!name?.trim()) {
    throw new Error("Quest name cannot be empty");
  }
  return { name, affectedAttributes, order };
}
