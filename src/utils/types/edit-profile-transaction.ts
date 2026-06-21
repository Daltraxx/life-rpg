import { Json } from "@/utils/generatedTypes/supabase";

export interface EditProfileTransactionDataShape {
  p_user_id: string;
  p_quests_inserts: Json;
  p_quests_updates: Json;
  p_attributes_inserts: Json;
  p_attributes_updates: Json;
  p_quests_attributes_inserts: Json;
  p_quests_attributes_updates: Json;
  p_quests_deletes: Json;
  p_attributes_deletes: Json;
  p_quests_attributes_deletes: Json;
}

export interface EditProfileTransactionQuestInsert {
  [key: string]: Json;
  client_key: string; // Temporary key for database mapping to newly generated quest IDs
  name: string;
  description: string | null;
  experience_share: number;
  frequency: number;
  rest_frequency: number;
  position: number;
}

export interface EditProfileTransactionQuestUpdate {
  [key: string]: Json;
  id: number;
  name: string;
  description: string | null;
  experience_share: number;
  frequency: number;
  rest_frequency: number;
  position: number;
}

export interface EditProfileTransactionAttributeInsert {
  [key: string]: Json;
  client_key: string; // Temporary key for database mapping to newly generated attribute IDs
  name: string;
  position: number;
}

export interface EditProfileTransactionAttributeUpdate {
  [key: string]: Json;
  id: number;
  name: string;
  position: number;
}

/**
 * Represents the data structure for inserting a new quest-attribute relationship in the edit_profile_transaction rpc call.
 * Because this is for inserts, the id field is not included, and both quest_id and attribute_id can be null
 * in case the quest or attribute is new and does not have an ID yet.
 * The quest_name and attribute_name fields are included to provide the necessary information for creating the relationship, and attribute_power indicates the strength of the attribute in relation to the quest.
 * @property {number | null} quest_id - The ID of the associated quest, or null if the quest is new and does not have an ID yet.
 * @property {string} quest_name - The name of the associated quest.
 * @property {number | null} attribute_id - The ID of the associated attribute, or null if the attribute is new and does not have an ID yet.
 * @property {string} attribute_name - The name of the associated attribute.
 * @property {number} attribute_power - The power level of the attribute in relation to the quest (e.g., how much experience it grants).
 */
export interface EditProfileTransactionQuestAttributeInsert {
  [key: string]: Json;
  quest_id: number | null;
  quest_client_key: string | null; // Temporary key for database mapping to newly generated quest IDs for new quests
  attribute_id: number | null;
  attribute_client_key: string | null; // Temporary key for database mapping to newly generated attribute IDs for new attributes
  attribute_power: number;
}

/**
 * Represents the data structure for updating an existing quest-attribute relationship in the edit_profile_transaction rpc call.
 * quest_id and attribute_id are required to verify the relationship being updated,
 * and id is required to identify the specific relationship in the database.
 * The attribute_power is the only field that can be updated.
 * Other updates require deleting the existing relationship and creating a new one.
 */
export interface EditProfileTransactionQuestAttributeUpdate {
  [key: string]: Json;
  id: number;
  quest_id: number;
  attribute_id: number;
  attribute_power: number;
}

export interface EditProfileTransactionDeletedQuestIds {
  [key: string]: Json;
  id: number;
}

export interface EditProfileTransactionDeletedAttributeIds {
  [key: string]: Json;
  id: number;
}

export interface EditProfileTransactionDeletedQuestAttributesIds {
  [key: string]: Json;
  id: number;
}
