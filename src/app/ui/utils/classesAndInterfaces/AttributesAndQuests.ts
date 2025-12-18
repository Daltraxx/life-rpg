import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";

/**
 * Represents an attribute that a user can possess.
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
  return { name, order };
}


/**
 * Represents an attribute as it is affected by a quest.
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
 * Represents a quest in the game that can affect certain attributes.
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
