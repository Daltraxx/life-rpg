import {
  EditProfileTransactionQuestAttributeMapping,
  EditProfileTransactionQuestInsert,
  EditProfileTransactionQuestUpdate,
} from "@/utils/types/edit-profile-transaction";
import { TransactionQuest } from "@/utils/validations/profile-edit/transaction-quest";
import { strengthToIntMap } from "@/utils/helpers/strengthToIntMap";

/**
 * Represents the prepared quest updates separated into inserts and updates.
 * @property {EditProfileTransactionQuestInsert[]} questInserts - An array of quests to be inserted
 * @property {EditProfileTransactionQuestUpdate[]} questUpdates - An array of quests to be updated
 */
interface PreparedQuestUpdates {
  questInserts: EditProfileTransactionQuestInsert[];
  questUpdates: EditProfileTransactionQuestUpdate[];
  questsAttributesData: EditProfileTransactionQuestAttributeMapping[];
}

/**
 * Prepares quests and their affected attributes for profile updates.
 * 
 * Separates quests into insert and update operations based on whether they have an existing ID.
 * Also processes all affected attributes for each quest, mapping attribute names to their IDs.
 * 
 * @param quests - Array of quests to process with their attributes
 * @param attributeNameToIdMap - Map of attribute names to their corresponding IDs
 * @returns PreparedQuestUpdates object containing arrays of quest inserts, updates, and attribute mappings
 * @throws Does not throw, but may produce null values for unmapped attributes
 * 
 * @example
 * ```typescript
 * const result = prepareQuestsAndAffectedAttributesForProfileUpdate(quests, attributeMap);
 * // result.questInserts contains new quests
 * // result.questUpdates contains existing quests to update
 * // result.questsAttributesData contains all attribute mappings
 * ```
 */
export const prepareQuestsAndAffectedAttributesForProfileUpdate = (
  quests: TransactionQuest[],
  attributeNameToIdMap: Record<string, number>,
): PreparedQuestUpdates => {
  const questInserts: EditProfileTransactionQuestInsert[] = [];
  const questUpdates: EditProfileTransactionQuestUpdate[] = [];
  const questsAttributesData: EditProfileTransactionQuestAttributeMapping[] = [];
  quests.forEach((quest, index) => {
    const existingQuest = typeof quest.id === "number";
    if (existingQuest) {
      const questId = quest.id as number;
      questUpdates.push({
        id: questId,
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

    quest.affectedAttributes.forEach((affectedAttribute) => {
      questsAttributesData.push({
        id: typeof affectedAttribute.id === "number" ? (affectedAttribute.id as number) : null,
        quest_id: existingQuest ? quest.id as number : null,
        quest_name: quest.name,
        attribute_id: attributeNameToIdMap[affectedAttribute.name] ?? null,
        attribute_name: affectedAttribute.name,
        attribute_power: strengthToIntMap[affectedAttribute.strength],
      });
    })
  });

  return { questInserts, questUpdates, questsAttributesData };
};
