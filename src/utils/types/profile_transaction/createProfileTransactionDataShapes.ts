// Contains data shapes used in data preparation for the create_profile_transaction supabase function.

/**
 * Represents attribute data necessary for a profile transaction rpc call.
 */
export interface CreateProfileTransactionAttributes {
  name: string;
  position: number;
}
/**
 * Represents quest data necessary for a profile transaction rpc call.
 */
export interface CreateProfileTransactionQuests {
  name: string;
  experience_share: number;
  position: number;
}

/** Represents quest-attribute relationship data necessary for a profile transaction rpc call.
 */
export interface CreateProfileTransactionQuestsAttributes {
  quest_name: string;
  attribute_name: string;
  attribute_power: number;
}
