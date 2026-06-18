import type { AttributeStrength } from "@/utils/types/AttributeStrength";
import { Attribute } from "../types/attribute";
import { AffectedAttribute } from "../types/AffectedAttribute";
import { Quest } from "../types/Quest";

/**
 * Creates a new Attribute object with the specified name.
 *
 * @param name - The name of the attribute. Must be a non-empty string after trimming whitespace.
 * @returns A new Attribute object containing the provided name.
 * @throws {Error} Throws an error if the name parameter is empty, null, undefined, or contains only whitespace
 */
export function createAttribute(name: string): Attribute {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Attribute name cannot be empty");
  }
  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    experience: 0,
    level: 1,
    position: 0,
  };
}

/**
 * Creates a new AffectedAttribute object with the specified name and strength.
 *
 * @param name - The name of the attribute. Must not be empty or contain only whitespace.
 * @param strength - The strength level of the attribute effect.
 * @returns A new AffectedAttribute object containing the provided name and strength.
 * @throws {Error} If the attribute name is empty or contains only whitespace.
 *
 * @example
 * const affected = createAffectedAttribute('Health', AttributeStrength.Major);
 */
export function createAffectedAttribute(
  name: string,
  strength: AttributeStrength,
): AffectedAttribute {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Attribute name cannot be empty");
  }
  return { id: crypto.randomUUID(), name: trimmedName, strength };
}

/**
 * Creates a new quest with the specified name and affected attributes.
 *
 * @param name - The name of the quest. It must not be empty or consist only of whitespace.
 * @param affectedAttributes - An array of attributes that are affected by the quest.
 * @param position - The order in which the quest is displayed in the UI.
 * @param frequency - The frequency at which the quest can be completed (e.g., daily, weekly). Defaults to 1.
 * @param restFrequency - The frequency at which the quest can be completed after a rest period. Defaults to 0.
 * @param streak - The current streak of consecutive completions for this quest. Defaults to 0.
 * @param experienceShare - The percentage of experience points awarded for completing the quest. Defaults to 0.
 * @param description - A brief description of the quest. Defaults to null.
 * @throws {Error} Throws an error if the quest name is empty or only whitespace.
 * @returns A new Quest object.
 */
export function createQuest(
  name: string,
  affectedAttributes: AffectedAttribute[],
  position: number,
  frequency: number = 1,
  restFrequency: number = 0,
  streak: number = 0,
  experienceShare: number = 0,
  description: string | null = null,
): Quest {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Quest name cannot be empty");
  } else if (!Number.isFinite(experienceShare)) {
    throw new Error("Experience share must be a finite number");
  } else if (!Number.isInteger(experienceShare)) {
    throw new Error("Experience share must be an integer");
  } else if (experienceShare < 0) {
    throw new Error("Experience share cannot be negative");
  } else if (experienceShare > 100) {
    throw new Error("Experience share cannot exceed 100");
  }
  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    affectedAttributes,
    experienceShare,
    description,
    frequency,
    restFrequency,
    streak,
    strengthPoints: 0,
    strengthLevel: "E",
    position,
  };
}
