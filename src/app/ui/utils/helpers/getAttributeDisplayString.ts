import { AffectedAttribute } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import { StrengthDisplayEnumHideNormal } from "./StrengthDisplayMap";

/**
 * Generates a display string for an attribute by combining its name with a strength indicator.
 *
 * @param attribute - The affected attribute object containing name and strength properties
 * @param attribute.name - The name of the attribute to display
 * @param attribute.strength - The strength level of the attribute
 * @returns A formatted string combining the attribute name and its strength display value
 *
 * @example
 * ```ts
 * const attr = { name: "Stamina", strength: "plusPlus" };
 * getAttributeDisplayString(attr); // Returns "Stamina++" or similar based on StrengthDisplayEnumHideNormal mapping
 *
 * const attr2 = { name: "Intelligence", strength: "normal" };
 * getAttributeDisplayString(attr2); // Returns "Intelligence"
 * ```
 */
export const getAttributeDisplayString = (
  attribute: AffectedAttribute
): string => {
  const { name, strength } = attribute;
  return `${name}${StrengthDisplayEnumHideNormal[strength]}`;
};
