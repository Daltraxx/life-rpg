"use server";

import z from "zod";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ProfileEditState } from "@/utils/validations/profile-edit/profile-edit";
import { ProfileEditSchema } from "@/utils/validations/profile-edit/profile-edit";
import { prepareQuestsAndAffectedAttributesForProfileUpdate } from "./helpers/prepare-quests-update-profile";
import { prepareAttributesForProfileUpdate } from "./helpers/prepare-attributes-update-profile";
import { EditProfileTransactionDataShape } from "../types/edit-profile-transaction";
import { redirect } from "next/navigation";
import { ROUTES } from "../constants/routes";

export default async function updateProfile(
  prevState: ProfileEditState | void,
  formData: FormData,
): Promise<ProfileEditState | void> {
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
    if (typeof rawFormData.deletedQuestIds === "string")
      rawFormData.deletedQuestIds = JSON.parse(rawFormData.deletedQuestIds);
    if (typeof rawFormData.deletedAttributeIds === "string")
      rawFormData.deletedAttributeIds = JSON.parse(
        rawFormData.deletedAttributeIds,
      );
    if (typeof rawFormData.deletedAffectedAttributeIds === "string")
      rawFormData.deletedAffectedAttributeIds = JSON.parse(
        rawFormData.deletedAffectedAttributeIds,
      );
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
  const attributeNameToClientKeyMap: Record<string, string> = {};

  // Create a mapping of attribute names to their IDs for all attributes being updated,
  // which will be used to link affected attributes to the correct attribute IDs in the database.
  attributeUpdates.forEach((attr) => {
    attributeNameToIdMap[attr.name] = attr.id;
  });

  attributeInserts.forEach((attr) => {
    attributeNameToClientKeyMap[attr.name] = attr.client_key;
  });

  try {
    const {
      questInserts,
      questUpdates,
      questAttributesInserts,
      questAttributesUpdates,
    } = prepareQuestsAndAffectedAttributesForProfileUpdate(
      validatedQuests,
      attributeNameToIdMap,
      attributeNameToClientKeyMap,
    );

    const editProfileTransactionData: EditProfileTransactionDataShape = {
      p_user_id: user.id,
      p_quests_inserts: questInserts,
      p_quests_updates: questUpdates,
      p_attributes_inserts: attributeInserts,
      p_attributes_updates: attributeUpdates,
      p_quests_attributes_inserts: questAttributesInserts,
      p_quests_attributes_updates: questAttributesUpdates,
      p_quests_deletes: deletedQuestIds,
      p_attributes_deletes: deletedAttributeIds,
      p_quests_attributes_deletes: deletedAffectedAttributeIds,
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
  } catch (error) {
    console.error("Error preparing quest data for update:", error);
    return {
      message:
        "An error occurred while processing quest data. Please try again.",
    };
  }

  // Redirect to profile page after successful update
  redirect(ROUTES.PROFILE);
}
