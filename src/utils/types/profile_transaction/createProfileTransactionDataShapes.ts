// Contains data shapes used in data preparation for the create_profile_transaction supabase function.

/**
 * Represents attribute data necessary for a profile transaction rpc call.
 * Position is zero-based index indicating the order of the attribute.
 * Order matters and must be preserved.
 */
export interface CreateProfileTransactionAttributes {
  name: string;
  position: number;
}
/**
 * Represents quest data necessary for a profile transaction rpc call.
 * Experience share is a percentage (0-100) of experience points allocated to the quest.
 * Position is zero-based index indicating the order of the quest.
 * Order matters and must be preserved.
 */
export interface CreateProfileTransactionQuests {
  name: string;
  experience_share: number;
  position: number;
}

/**
 * Represents quest-attribute relationship data necessary for a profile transaction rpc call.
 * Attribute name refers to an attribute that gains experience from the quest.
 * Attribute power indicates how much experience is given to that attribute upon quest completion (see strengthToIntMap.ts).
 */
export interface CreateProfileTransactionQuestsAttributes {
  quest_name: string;
  attribute_name: string;
  attribute_power: number;
}
