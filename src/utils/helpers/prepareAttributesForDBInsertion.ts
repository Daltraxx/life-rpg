import type { Attribute } from "@/utils/types/AttributesAndQuests";
import type { CreateProfileTransactionAttributes } from "@/utils/types/profile_transaction/createProfileTransactionDataShapes";

/**
 * Transforms an array of attributes into a format suitable for database insertion.
 * Each attribute is mapped to include its name and position (index) in the array.
 *
 * @param attributes - An array of {@link Attribute} objects to be prepared for insertion
 * @returns An array of {@link CreateProfileTransactionAttributes} objects with name and position properties
 *
 * @example
 * const attributes = [
 *   { name: 'Strength' },
 *   { name: 'Dexterity' },
 *   { name: 'Intelligence' }
 * ];
 * const prepared = prepareAttributesForDBInsertion(attributes);
 * // Result:
 * // [
 * //   { name: 'Strength', position: 0 },
 * //   { name: 'Dexterity', position: 1 },
 * //   { name: 'Intelligence', position: 2 }
 * // ]
 */
export const prepareAttributesForDBInsertion = (
  attributes: Attribute[]
): CreateProfileTransactionAttributes[] => {
  return attributes.map((attr, index) => ({
    name: attr.name,
    position: index,
  }));
};
