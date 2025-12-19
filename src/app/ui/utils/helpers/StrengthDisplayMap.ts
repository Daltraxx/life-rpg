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

/**
 * Enum representing different strength display levels for UI rendering. Displays "normal" for base strength.
 * 
 * @remarks
 * This enum is used to display strength modifiers in a normalized format,
 * where different values represent increasing levels of strength.
 * 
 * @enum {string}
 * 
 * @property {string} normal - Represents the base/normal strength level with no modifier
 * @property {string} plus - Represents a single level increase in strength, displayed as "+"
 * @property {string} plusPlus - Represents a double level increase in strength, displayed as "++"
 */
export enum StrengthDisplayEnumShowNormal {
  normal = "normal",
  plus = "+",
  plusPlus = "++",
}

/**
 * Enum representing different strength display levels with their corresponding display symbols.
 * The 'normal' level is hidden (empty string) for UI displays 
 * where normal strength is represented as lacking a symbol, 
 * while enhanced levels show plus symbols.
 * 
 * @enum {string}
 * @property {string} normal - Normal strength level, displayed as empty string (hidden)
 * @property {string} plus - Enhanced strength level, displayed as "+"
 * @property {string} plusPlus - Maximum strength level, displayed as "++"
 */
export enum StrengthDisplayEnumHideNormal {
  normal = "",
  plus = "+",
  plusPlus = "++",
}
