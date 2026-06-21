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
 * Prepares quests and their affected attributes for profile update transactions.
 * Separates new quests and attributes from existing ones, categorizing them into
 * inserts and updates for database operations.
 *
 * @param quests - Array of quests to process, each containing affected attributes
 * @param attributeNameToIdMap - Map of attribute names to their database IDs
 * @param attributeNameToClientKeyMap - Map of attribute names to their client keys
 * @returns Prepared quest updates separated into inserts and updates for both quests and attributes
 * @throws Error if an affected attribute has a preexisting ID but no corresponding ID in the mapping
 * @throws Error if ID and client key validation fails for new quest or attribute records
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
    const questId = typeof quest.id === "number" ? quest.id : null;
    const questClientKey = typeof quest.id === "string" ? quest.id : null;
    const existingQuest = questId !== null;

    // Determine if the quest is new (insert) or existing (update) based on the presence of a numeric ID.
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

    // Process affected attributes for the quest,
    // determining inserts vs updates based on the presence of a numeric ID for the affected attribute.
    quest.affectedAttributes.forEach((affectedAttribute) => {
      const existingAffectedAttribute =
        typeof affectedAttribute.id === "number";

      // Determine the referenced attribute ID and client key from the provided mappings,
      // which will be used for both inserts and updates of quest-attribute relationships.
      const attributeId: number | null =
        attributeNameToIdMap[affectedAttribute.name] ?? null;
      const attributeClientKey: string | null =
        attributeNameToClientKeyMap[affectedAttribute.name] ?? null;
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
        try {
          validateIdClientKeyPair(questId, questClientKey, "quest");
          validateIdClientKeyPair(attributeId, attributeClientKey, "attribute");
        } catch (error) {
          console.error(
            `Error validating ID and client key pair for quest "${quest.name}" and attribute "${affectedAttribute.name}":`,
            error,
          );
          throw error; // Re-throw the error after logging
        }
        questAttributesInserts.push({
          quest_id: questId,
          quest_client_key: questClientKey,
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

/**
 * Validates that exactly one of ID or client key is provided for an entity.
 * This is used to ensure that new records have a client key for mapping after insertion,
 * while existing records have an ID for updates, but not both or neither (indicative of logic errors).
 * @param id - The database ID of the entity, or null if not yet persisted
 * @param clientKey - The temporary client-side key for the entity, or null if already persisted
 * @param entityType - The type of entity being validated ("quest" or "attribute")
 * @throws Error if both ID and client key are null
 * @throws Error if both ID and client key are provided
 */
const validateIdClientKeyPair = (
  id: number | null,
  clientKey: string | null,
  entityType: "quest" | "attribute",
): void => {
  if (id === null && clientKey === null) {
    throw new Error(
      `Both ID and client key are null for ${entityType}. Exactly one must be provided.`,
    );
  }
  if (id !== null && clientKey !== null) {
    throw new Error(
      `Both ID and client key are provided for ${entityType}. Only one must be provided.`,
    );
  }
};
