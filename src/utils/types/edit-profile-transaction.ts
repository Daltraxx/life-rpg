import { Json } from "@/utils/generatedTypes/supabase";

export interface EditProfileTransactionDataShape {
  p_user_id: string;
  p_quest_inserts: Json;
  p_quest_updates: Json;
  p_attribute_inserts: Json;
  p_attribute_updates: Json;
  p_deleted_quest_ids: Json;
  p_deleted_attribute_ids: Json;
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

export interface EditProfileTransactionDeletedQuestIds {
  [key: string]: Json;
  id: number;
}

export interface EditProfileTransactionDeletedAttributeIds {
  [key: string]: Json;
  id: number;
}