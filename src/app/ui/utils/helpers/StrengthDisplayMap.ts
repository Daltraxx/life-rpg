import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";

/**
 * Maps attribute strength values to their display string representations.
 *
 * @remarks
 * This map provides a convenient way to convert AttributeStrength enum values
 * into user-friendly display strings for the UI.
 *
 * @example
 * ```ts
 * const displayText = strengthDisplayMap['plus']; // Returns "+"
 * ```
 */
export const strengthDisplayMap: Record<AttributeStrength, string> = {
  normal: "normal",
  plus: "+",
  plusPlus: "++",
};

const NORMAL_STRENGTH: AttributeStrength = "normal";

/**
 * Converts an AttributeStrength value to its display string.
 * @param strength - The attribute strength to display
 * @param hideNormal - If true, returns empty string for normal strength
 * @returns The display string for the given strength, or empty string if hideNormal is true and strength is normal
 */
export function getStrengthDisplay(
  strength: AttributeStrength,
  hideNormal: boolean = false
): string {
  const display = strengthDisplayMap[strength];
  return hideNormal && strength === NORMAL_STRENGTH ? "" : display;
}
