// Contains data shapes used in data preparation for the create_profile_transaction supabase function.

import { Json } from "@/utils/generatedTypes/supabase";

/**
 * Represents the complete data shape for the create_profile_transaction rpc call.
 * @property {string} p_user_id - The id of the user for which the profile is being created.
 * @property {Json} p_attributes - An array of attribute objects representing the attributes to be created for the profile.
 * @property {Json} p_quests - An array of quest objects representing the quests to be created for the profile.
 * @property {Json} p_quests_attributes - An array of quest-attribute relationship objects representing the relationships between quests and attributes for the profile.
 */
export interface CreateProfileTransactionDataShape {
  p_user_id: string;
  p_attributes: Json;
  p_quests: Json;
  p_quests_attributes: Json;
}

/**
 * Represents attribute data necessary for a profile transaction rpc call.
 * @property {string} name - The name of the attribute.
 * @property {number} position - The 0-indexed position of the attribute in the ordered list.
 */
export interface CreateProfileTransactionAttributes {
  [key: string]: Json;
  name: string;
  position: number;
}
/**
 * Represents quest data necessary for a profile transaction rpc call.
 * @property {string} name - The name of the quest.
 * @property {number} experience_share - The share (integer between 0-100 inclusive) of daily possible experience points allocated to the quest.
 * @property {number} position - The 0-indexed position of the quest in the ordered list.
 */
export interface CreateProfileTransactionQuests {
  [key: string]: Json;
  name: string;
  experience_share: number;
  position: number;
}

/**
 * Represents quest-attribute relationship data necessary for a profile transaction rpc call.
 * @property {string} quest_name - The name of the quest.
 * @property {string} attribute_name - The name of the attribute.
 * @property {number} attribute_power - The integer indicator (1-3) of the experience points given to the attribute upon the associated quests completion.
 */
export interface CreateProfileTransactionQuestsAttributes {
  [key: string]: Json;
  quest_name: string;
  attribute_name: string;
  attribute_power: number;
}
