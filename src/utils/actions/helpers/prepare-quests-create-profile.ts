import type { CreateProfileTransactionQuests } from "@/utils/types/create-profile-transaction";
import type { TransactionQuest } from "../validations/profile-creation/transaction-quest";

/**
 * Prepares an array of quests for database insertion by mapping them to a transaction-compatible format.
 *
 * @param quests - An array of TransactionQuest objects to be prepared for insertion
 * @returns An array of CreateProfileTransactionQuests objects with normalized fields and positional ordering
 *
 * @example
 * ```typescript
 * const quests: TransactionQuest[] = [
 *   { name: 'Slay the dragon', experienceShare: 100, affectedAttributes: [...] },
 *   { name: 'Find the treasure', experienceShare: 50, affectedAttributes: [...] }
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
  quests: TransactionQuest[],
): CreateProfileTransactionQuests[] => {
  return quests.map((quest, index) => ({
    name: quest.name,
    experience_share: quest.experienceShare,
    position: index,
  }));
};
