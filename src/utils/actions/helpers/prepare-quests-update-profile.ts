import type {
  EditProfileTransactionQuestInsert,
  EditProfileTransactionQuestUpdate,
  EditProfileTransactionQuestAttributeInsert,
  EditProfileTransactionQuestAttributeUpdate,
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
  questAttributesInserts: EditProfileTransactionQuestAttributeInsert[];
  questAttributesUpdates: EditProfileTransactionQuestAttributeUpdate[];
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
  attributeNameToClientKeyMap: Record<string, string>,
): PreparedQuestUpdates => {
  const questInserts: EditProfileTransactionQuestInsert[] = [];
  const questUpdates: EditProfileTransactionQuestUpdate[] = [];
  const questAttributesInserts: EditProfileTransactionQuestAttributeInsert[] =
    [];
  const questAttributesUpdates: EditProfileTransactionQuestAttributeUpdate[] =
    [];

  quests.forEach((quest, index) => {
    const existingQuest = typeof quest.id === "number";
    if (existingQuest) {
      const questId = quest.id as number;
      questUpdates.push({
        id: questId,
        name: quest.name,
        description: quest.description,
        experience_share: quest.experienceShare,
        frequency: quest.frequency,
        rest_frequency: quest.restFrequency,
        position: index,
      });
    } else {
      questInserts.push({
        client_key: quest.id as string, // Use the temporary client-side ID as the client_key for mapping after insertion
        name: quest.name,
        description: quest.description,
        experience_share: quest.experienceShare,
        frequency: quest.frequency,
        rest_frequency: quest.restFrequency,
        position: index,
      });
    }

    quest.affectedAttributes.forEach((affectedAttribute) => {
      const existingAffectedAttribute =
        typeof affectedAttribute.id === "number";
      const attributeId: number | null = attributeNameToIdMap[affectedAttribute.name] ?? null;
      const attributeClientKey: string | null = attributeNameToClientKeyMap[affectedAttribute.name] ?? null;
      if (
        (existingAffectedAttribute && attributeId === null) ||
        (existingAffectedAttribute && !existingQuest)
      ) {
        throw new Error(
          `Affected attribute "${affectedAttribute.name}" has an preexisting ID but no corresponding attribute ID found in the mapping.`,
        );
      }
      if (existingAffectedAttribute) {
        questAttributesUpdates.push({
          id: affectedAttribute.id as number,
          quest_id: quest.id as number,
          attribute_id: attributeId,
          attribute_power: strengthToIntMap[affectedAttribute.strength],
        });
      } else {
        questAttributesInserts.push({
          quest_id: existingQuest ? (quest.id as number) : null,
          quest_client_key: !existingQuest ? (quest.id as string) : null,
          attribute_id: attributeId,
          attribute_client_key: attributeClientKey,
          attribute_power: strengthToIntMap[affectedAttribute.strength],
        });
      }
    });
  });

  return {
    questInserts,
    questUpdates,
    questAttributesInserts,
    questAttributesUpdates,
  };
};
