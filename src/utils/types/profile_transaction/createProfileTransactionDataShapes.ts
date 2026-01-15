// Contains data shapes used in data preparation for the create_profile_transaction supabase function.

/**
 * Represents the complete data shape for the create_profile_transaction rpc call.
 */
export interface CreateProfileTransactionDataShapes {
  attributes: CreateProfileTransactionAttributes[];
  quests: CreateProfileTransactionQuests[];
  quests_attributes: CreateProfileTransactionQuestsAttributes[];
}

/**
 * Represents attribute data necessary for a profile transaction rpc call.
 */
export interface CreateProfileTransactionAttributes {
  /**
   * The name of the attribute.
   */
  name: string;
  /**
   * The 0-indexed position of the attribute in the ordered list.
   */
  position: number;
}
/**
 * Represents quest data necessary for a profile transaction rpc call.
 */
export interface CreateProfileTransactionQuests {
  /**
   * The name of the quest.
   */
  name: string;
  /**
   * The share (0-100) of daily possible experience points allocated to the quest.
   */
  experience_share: number;
  /**
   * The 0-indexed position of the quest in the ordered list.
   */
  position: number;
}

/**
 * Represents quest-attribute relationship data necessary for a profile transaction rpc call
 */
export interface CreateProfileTransactionQuestsAttributes {
  /**
   * The name of the quest.
   */
  quest_name: string;
  /**
   * The name of the attribute.
   */
  attribute_name: string;
  /**
   * The integer indicator (1-3) of the experience points given to the attribute upon the associated quests completion.
   */
  attribute_power: number;
}

/**
 * Represents the complete data shape for the create_profile_transaction rpc call.
 */
export interface CreateProfileTransactionDataShapes {
  attributes: CreateProfileTransactionAttributes[];
  quests: CreateProfileTransactionQuests[];
  quests_attributes: CreateProfileTransactionQuestsAttributes[];
}
