import { AffectedAttribute } from "@/utils/types/AttributesAndQuests";
import { getStrengthDisplay } from "@/utils/helpers/StrengthDisplayMap";

/**
 * Generates a display string for an attribute by combining its name with a strength indicator.
 * Attributes with 'normal' strength will not have any additional indicator.
 *
 * @param attribute - The affected attribute object containing name and strength properties
 * @param attribute.name - The name of the attribute to display
 * @param attribute.strength - The strength level of the attribute
 * @returns A formatted string combining the attribute name and its strength display value
 *
 * @example
 * ```ts
 * const attr = { name: "Stamina", strength: "plusPlus" };
 * getAttributeDisplayString(attr); // Returns "Stamina++"
 *
 * const attr2 = { name: "Intelligence", strength: "normal" };
 * getAttributeDisplayString(attr2); // Returns "Intelligence"
 * ```
 */
export const getAttributeDisplayString = (
  attribute: AffectedAttribute
): string => {
  const { name, strength } = attribute;
  // true = hide "normal" strength indicator
  return `${name}${getStrengthDisplay(strength, true)}`;
};
