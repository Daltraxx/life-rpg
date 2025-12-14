import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";

/**
 * Represents an attribute that can be affected in the game.
 */
export interface AffectedAttribute {
  name: string;
  strength: AttributeStrength;
}

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
}

export function createQuest(
  name: string,
  affectedAttributes: AffectedAttribute[]
): Quest {
  if (!name?.trim()) { 
    throw new Error("Quest name cannot be empty");
  }
  return { name, affectedAttributes };
}
