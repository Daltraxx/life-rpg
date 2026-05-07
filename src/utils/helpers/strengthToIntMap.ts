import type { AttributeStrength } from "@/utils/types/AttributeStrength";

/**
 * Maps each `AttributeStrength` value to its corresponding integer representation.
 * Useful for storage in db (where affected attributes' "power" levels are represented as integers)
 * or for calculations that require numeric values.
 *
 * - `normal` maps to `1`
 * - `plus` maps to `2`
 * - `plusPlus` maps to `3`
 */
export const strengthToIntMap = {
  normal: 1,
  plus: 2,
  plusPlus: 3,
} as const satisfies Record<AttributeStrength, number>;

/**
 * Reverse mapping from integer to `AttributeStrength`.
 */
export const intToStrengthMap = {
  1: "normal",
  2: "plus",
  3: "plusPlus",
} as const satisfies Record<
  (typeof strengthToIntMap)[AttributeStrength],
  AttributeStrength
>;

/**
 * Type representing valid strength keys (1, 2, or 3).
 */
export type StrengthKey = keyof typeof intToStrengthMap;

/**
 * Type guard to check if a value is a valid `StrengthKey`.
 * Ensures the value is a number and exists in the `intToStrengthMap`.
 *
 * @param strength - The value to check
 * @returns `true` if the value is a valid strength key (1, 2, or 3), `false` otherwise
 *
 * @example
 * isStrengthKey(2) // true
 * isStrengthKey(5) // false
 * isStrengthKey("2") // false
 */
export const isStrengthKey = (strength: unknown): strength is StrengthKey => {
  return typeof strength === "number" && strength in intToStrengthMap;
};
