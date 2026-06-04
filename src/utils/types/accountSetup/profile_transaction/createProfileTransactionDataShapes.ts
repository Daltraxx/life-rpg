// Contains data shapes used in data preparation for the create_profile_transaction supabase function.

/**
 * Represents the complete data shape for the create_profile_transaction rpc call.
 * @param p_user_id - The id of the user for which the profile is being created.
 * @param p_attributes - An array of attribute objects representing the attributes to be created for the profile.
 * @param p_quests - An array of quest objects representing the quests to be created for the profile.
 * @param p_quests_attributes - An array of quest-attribute relationship objects representing the relationships between quests and attributes for the profile.
 */
export interface CreateProfileTransactionDataShapes {
  p_user_id: string;
  p_attributes: CreateProfileTransactionAttributes[];
  p_quests: CreateProfileTransactionQuests[];
  p_quests_attributes: CreateProfileTransactionQuestsAttributes[];
}

/**
 * Represents attribute data necessary for a profile transaction rpc call.
 * @param name - The name of the attribute.
 * @param position - The 0-indexed position of the attribute in the ordered list.
 */
export interface CreateProfileTransactionAttributes {
  name: string;
  position: number;
}
/**
 * Represents quest data necessary for a profile transaction rpc call.
 * @param name - The name of the quest.
 * @param experience_share - The share (integer between 0-100 inclusive) of daily possible experience points allocated to the quest.
 * @param position - The 0-indexed position of the quest in the ordered list.
 */
export interface CreateProfileTransactionQuests {
  name: string;
  experience_share: number;
  position: number;
}

/**
 * Represents quest-attribute relationship data necessary for a profile transaction rpc call.
 * @param quest_name - The name of the quest.
 * @param attribute_name - The name of the attribute.
 * @param attribute_power - The integer indicator (1-3) of the experience points given to the attribute upon the associated quests completion.
 */
  export interface CreateProfileTransactionQuestsAttributes {
  quest_name: string;
  attribute_name: string;
  attribute_power: number;
}
