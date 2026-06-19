import { Json } from "@/utils/generatedTypes/supabase";

export interface EditProfileTransactionDataShape {
  p_user_id: string;
  p_quest_inserts: Json;
  p_quest_updates: Json;
  p_attribute_inserts: Json;
  p_attribute_updates: Json;
  p_quests_attributes: Json;
  p_deleted_quest_ids: Json;
  p_deleted_attribute_ids: Json;
  p_deleted_affected_attribute_ids: Json;
}

export interface EditProfileTransactionQuestInsert {
  [key: string]: Json;
  name: string;
  experience_share: number;
  position: number;
}

export interface EditProfileTransactionQuestUpdate {
  [key: string]: Json;
  id: number;
  name: string;
  experience_share: number;
  position: number;
}

export interface EditProfileTransactionAttributeInsert {
  [key: string]: Json;
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
 * Represents the mapping of quests to their affected attributes 
 * for profile updates in the edit_profile_transaction rpc call.
 * Each object in the array represents a single quest-attribute relationship, 
 * including the IDs and names of the quest and attribute, as well as the attribute power.
 * The id field represents the existing relationship ID in the database (if it exists), 
 * while quest_id and attribute_id represent the IDs of the associated quest and attribute (if they exist).
 * This structure allows for both the creation of new relationships (with null IDs) 
 * and the updating of existing relationships (with valid IDs).
 * @property {number | null} id - The ID of the existing quest-attribute relationship in the database, or null if this is a new relationship to be created.
 * @property {number | null} quest_id - The ID of the associated quest, or null if the quest is new and does not have an ID yet.
 * @property {string} quest_name - The name of the associated quest.
 * @property {number | null} attribute_id - The ID of the associated attribute, or null if the attribute is new and does not have an ID yet.
 * @property {string} attribute_name - The name of the associated attribute.
 * @property {number} attribute_power - The power level of the attribute in relation to the quest (e.g., how much experience it grants).
 */
export interface EditProfileTransactionQuestAttributeMapping {
  [key: string]: Json;
  id: number | null;
  quest_id: number | null;
  quest_name: string;
  attribute_id: number | null;
  attribute_name: string;
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

export interface EditProfileTransactionDeletedAffectedAttributeIds {
  [key: string]: Json;
  id: number;
}