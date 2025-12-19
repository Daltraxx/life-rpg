import { AffectedAttribute } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

/**
 * Sorts an array of affected attributes by strength and name.
 * 
 * The sorting order prioritizes attributes by their strength in descending order:
 * 1. "plusPlus" - highest priority
 * 2. "plus" - medium priority
 * 3. "normal" - lowest priority
 * 
 * When two attributes have the same strength, they are sorted alphabetically by name.
 * 
 * @param affectedAttributes - The array of affected attributes to sort
 * @returns A new sorted array of affected attributes (does not modify the original array)
 * 
 * @example
 * ```typescript
 * const attributes = [
 *   { name: "Strength", strength: "normal" },
 *   { name: "Agility", strength: "plusPlus" },
 *   { name: "Intelligence", strength: "plus" }
 * ];
 * const sorted = sortAffectedAttributes(attributes);
 * // Returns: [Agility (plusPlus), Intelligence (plus), Strength (normal)]
 * ```
 */
export const sortAffectedAttributes = (affectedAttributes: AffectedAttribute[]) => {
  const sortedAttributes = affectedAttributes.toSorted((a, b) => {
    if (a.strength === b.strength) {
      return a.name.localeCompare(b.name);
    } else if (a.strength === "plusPlus") {
      return -1;
    } else if (a.strength === "plus" && b.strength === "normal") {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedAttributes;
};