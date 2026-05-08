import type { SetupQuest } from "@/utils/types/accountSetup/SetupAttributesAndQuests";
import type { CreateProfileTransactionQuests } from "@/utils/types/accountSetup/profile_transaction/createProfileTransactionDataShapes";

/**
 * Prepares an array of quests for database insertion by mapping them to a transaction-compatible format.
 *
 * @param quests - An array of SetupQuest objects to be prepared for insertion
 * @returns An array of CreateProfileTransactionQuests objects with normalized fields and positional ordering
 *
 * @example
 * ```typescript
 * const quests = [
 *   { name: 'Slay the dragon', experienceShare: 100 },
 *   { name: 'Find the treasure', experienceShare: 50 }
 * ];
 * const prepared = prepareQuestsForDBInsertion(quests);
 * // Returns:
 * // [
 * //   { name: 'Slay the dragon', experience_share: 100, position: 0 },
 * //   { name: 'Find the treasure', experience_share: 50, position: 1 }
 * // ]
 * ```
 */
export const prepareQuestsForDBInsertion = (
  quests: SetupQuest[],
): CreateProfileTransactionQuests[] => {
  return quests.map((quest, index) => ({
    name: quest.name,
    experience_share: quest.experienceShare,
    position: index,
  }));
};
