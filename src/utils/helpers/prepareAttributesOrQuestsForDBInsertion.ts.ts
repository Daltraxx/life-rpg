import type {
  Attribute,
  Quest,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import type {
  CreateProfileTransactionAttributes,
  CreateProfileTransactionQuests,
} from "@/utils/types/profile_transaction/createProfileTransactionDataShapes";

/**
 * Prepares an array of Attributes or Quests for database insertion by adding positional indices.
 *
 * @param objects - An array of Attribute or Quest objects to be prepared for insertion
 * @returns An array of objects with the same properties plus a `position` field indicating their index
 *
 * @example
 * ```typescript
 * const attributes = [{ name: 'Strength' }, { name: 'Dexterity' }];
 * const prepared = prepareAttributesOrQuestsForDBInsertion(attributes);
 * // Result: [{ name: 'Strength', position: 0 }, { name: 'Dexterity', position: 1 }]
 * ```
 */
export const prepareAttributesOrQuestsForDBInsertion = (
  objects: Attribute[] | Quest[]
): CreateProfileTransactionAttributes[] | CreateProfileTransactionQuests[] => {
  return objects.map((obj, index) => ({
    ...obj,
    position: index,
  }));
};
