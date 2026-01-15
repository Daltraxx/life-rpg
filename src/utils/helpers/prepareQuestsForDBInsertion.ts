import type { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import type { CreateProfileTransactionQuests } from "@/utils/types/profile_transaction/createProfileTransactionDataShapes";

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
export const prepareQuestsForDBInsertion = (
  quests: Quest[]
): CreateProfileTransactionQuests[] => {
  return quests.map((quest, index) => ({
    name: quest.name,
    experience_share: quest.experiencePointValue,
    position: index,
  }));
};