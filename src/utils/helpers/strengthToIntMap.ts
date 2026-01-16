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
