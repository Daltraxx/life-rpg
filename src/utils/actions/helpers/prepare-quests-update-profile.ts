import {
  EditProfileTransactionQuestInsert,
  EditProfileTransactionQuestUpdate,
} from "@/utils/types/edit-profile-transaction";
import { TransactionQuest } from "@/utils/validations/profile-edit/transaction-quest";

/**
 * Represents the prepared quest updates separated into inserts and updates.
 * @property {EditProfileTransactionQuestInsert[]} questInserts - An array of quests to be inserted
 * @property {EditProfileTransactionQuestUpdate[]} questUpdates - An array of quests to be updated
 */
interface PreparedQuestUpdates {
  questInserts: EditProfileTransactionQuestInsert[];
  questUpdates: EditProfileTransactionQuestUpdate[];
}

/**
 * Prepares quests for profile update by separating them into insert and update operations.
 * New quests are determined by the absence of a numeric id, 
 * while existing quests with numeric ids are prepared for update.
 *
 * @param quests - Array of transaction quests to be processed
 * @returns Object containing separated questInserts and questUpdates arrays
 * @example
 * const quests = [
 *   { id: 1, name: 'Quest 1', experienceShare: 100 },
 *   { id: "abc-123", name: 'Quest 2', experienceShare: 50 }
 * ];
 * const { questInserts, questUpdates } = prepareQuestsForProfileUpdate(quests);
 */
export const prepareQuestsForProfileUpdate = (
  quests: TransactionQuest[],
): PreparedQuestUpdates => {
  const questInserts: EditProfileTransactionQuestInsert[] = [];
  const questUpdates: EditProfileTransactionQuestUpdate[] = [];
  quests.forEach((quest, index) => {
    if (typeof quest.id === "number") {
      questUpdates.push({
        id: quest.id,
        name: quest.name,
        experience_share: quest.experienceShare,
        position: index,
      });
    } else {
      questInserts.push({
        name: quest.name,
        experience_share: quest.experienceShare,
        position: index,
      });
    }
  });

  return { questInserts, questUpdates };
};
