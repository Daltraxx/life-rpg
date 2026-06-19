"use server";

import z from "zod";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ProfileCreationState } from "@/utils/validations/profile-creation/profile-creation";
import { ProfileEditSchema } from "@/utils/validations/profile-edit/profile-edit";
import { prepareQuestsAndAffectedAttributesForProfileUpdate } from "./helpers/prepare-quests-update-profile";
import { prepareAttributesForProfileUpdate } from "./helpers/prepare-attributes-update-profile";
import { EditProfileTransactionDataShape } from "../types/edit-profile-transaction";
import { redirect } from "next/navigation";
import { ROUTES } from "../constants/routes";

export default async function updateProfile(
  prevState: ProfileCreationState | void,
  formData: FormData,
): Promise<ProfileCreationState | void> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      message: "Unauthorized action.",
    };
  }

  const rawFormData = Object.fromEntries(formData);
  // Parse JSON fields if they're sent as stringified JSON
  try {
    if (typeof rawFormData.quests === "string")
      rawFormData.quests = JSON.parse(rawFormData.quests);
    if (typeof rawFormData.attributes === "string")
      rawFormData.attributes = JSON.parse(rawFormData.attributes);
  } catch {
    return {
      message: "Invalid JSON format in form data.",
    };
  }

  // Validate input data
  const validatedInput = ProfileEditSchema.safeParse(rawFormData);

  // TODO: Test with nested field errors like AffectedAttributes
  // Consider more granular error handling/logging (treeify the zod errors?)
  if (!validatedInput.success) {
    console.warn("Profile edit input validation failed:", validatedInput.error);
    return {
      errors: z.flattenError(validatedInput.error).fieldErrors,
      message: "Fields not valid. Failed to update profile.",
    };
  }

  const {
    quests: validatedQuests,
    attributes: validatedAttributes,
    deletedQuestIds,
    deletedAttributeIds,
    deletedAffectedAttributeIds,
  } = validatedInput.data;

  const { attributeInserts, attributeUpdates } =
    prepareAttributesForProfileUpdate(validatedAttributes);

  const attributeNameToIdMap: Record<string, number> = {};

  // Create a mapping of attribute names to their IDs for all attributes being updated,
  // which will be used to link affected attributes to the correct attribute IDs in the database.
  attributeUpdates.forEach((attr) => {
    attributeNameToIdMap[attr.name] = attr.id;
  });

  const { questInserts, questUpdates, questsAttributesData } =
    prepareQuestsAndAffectedAttributesForProfileUpdate(
      validatedQuests,
      attributeNameToIdMap,
    );

  const editProfileTransactionData: EditProfileTransactionDataShape = {
    p_user_id: user.id,
    p_quest_inserts: questInserts,
    p_quest_updates: questUpdates,
    p_attribute_inserts: attributeInserts,
    p_attribute_updates: attributeUpdates,
    p_quests_attributes: questsAttributesData,
    p_deleted_quest_ids: deletedQuestIds,
    p_deleted_attribute_ids: deletedAttributeIds,
    p_deleted_affected_attribute_ids: deletedAffectedAttributeIds,
  };

  const { error } = await supabase.rpc(
    "edit_profile_transaction",
    editProfileTransactionData,
  );

  if (error) {
    console.error("Error executing profile update transaction:", error);
    return {
      message:
        "An error occurred while updating the profile. Please try again.",
    };
  }

  // Redirect to profile page after successful update
  redirect(ROUTES.PROFILE);
}
