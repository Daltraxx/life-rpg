// Contains data shapes used in data preparation for the create_profile_transaction supabase function.

export interface CreateProfileTransactionAttributes {
  name: string;
  position: number;
}

export interface CreateProfileTransactionQuests {
  name: string;
  experience_share: number;
  position: number;
}

export interface CreateProfileTransactionQuestsAttributes {
  quest_name: string;
  attribute_name: string;
  attribute_power: number;
}
