/**
 * Valid values for attribute strength levels.
 */
export const AttributeStrengthValues = ["normal", "plus", "plusPlus"] as const;

/**
 * Represents internal representation of strength level of an attribute.
 */
export type AttributeStrength = (typeof AttributeStrengthValues)[number];
