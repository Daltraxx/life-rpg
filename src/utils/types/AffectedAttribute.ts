import type { SetupAffectedAttribute } from "@/utils/types/accountSetup/SetupAttributesAndQuests";

/**
 * Represents an attribute that is affected by a quest, including its unique identifier from the database.
 * @shape
 * - `id`: number - Unique identifier for the affected attribute (from the database)
 * - `name`: string - The name of the affected attribute
 * - `strength`: AttributeStrength - The strength or intensity of the attribute's effect
 */
export type AffectedAttribute = SetupAffectedAttribute & {
  id: number;
};
