import type { AttributeStrength } from "@/utils/types/AttributeStrength";

/**
 * Represents an attribute with a name.
 *
 * @interface Attribute
 * @property {string} name - The name of the attribute.
 */
export interface SetupAttribute {
  name: string;
}

/**
 * Creates a new Attribute object with the specified name.
 *
 * @param name - The name of the attribute. Must be a non-empty string after trimming whitespace.
 * @returns A new Attribute object containing the provided name.
 * @throws {Error} Throws an error if the name parameter is empty, null, undefined, or contains only whitespace
 */
export function createSetupAttribute(name: string): SetupAttribute {
  if (!name?.trim()) {
    throw new Error("Attribute name cannot be empty");
  }
  return { name };
}

/**
 * Represents an attribute that is affected by a quest.
 *
 * @interface SetupAffectedAttribute
 * @property {string} name - The name of the affected attribute.
 * @property {AttributeStrength} strength - The strength or intensity of the attribute's effect.
 */
export interface SetupAffectedAttribute {
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
 * const affected = createSetupAffectedAttribute('Health', AttributeStrength.Major);
 */
export function createSetupAffectedAttribute(
  name: string,
  strength: AttributeStrength,
): SetupAffectedAttribute {
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
 * @property {SetupAffectedAttribute[]} affectedAttributes - An array of attributes that are affected by completing this quest.
 * @property {number} experienceShare - The percentage of experience points awarded for completing the quest.
 */
export interface SetupQuest {
  name: string;
  affectedAttributes: SetupAffectedAttribute[];
  experienceShare: number;
}

/**
 * Creates a new quest with the specified name and affected attributes.
 *
 * @param name - The name of the quest. It must not be empty or consist only of whitespace.
 * @param affectedAttributes - An array of attributes that are affected by the quest.
 * @param experienceShare - The percentage of experience points awarded for completing the quest. Defaults to 0.
 * @throws {Error} Throws an error if the quest name is empty or only whitespace.
 * @returns A SetupQuest object containing the name and affected attributes.
 */
export function createSetupQuest(
  name: string,
  affectedAttributes: SetupAffectedAttribute[],
  experienceShare: number = 0,
): SetupQuest {
  if (!name?.trim()) {
    throw new Error("Quest name cannot be empty");
  }
  if (!Number.isFinite(experienceShare)) {
    throw new Error("Experience share must be a finite number");
  }
  if (experienceShare < 0) {
    throw new Error("Experience share cannot be negative");
  }
  return { name, affectedAttributes, experienceShare };
}
