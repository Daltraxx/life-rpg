"use server";
import type {
  Attribute,
  Quest,
  AffectedAttribute,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import {
  ProfileCreationSchema,
  ProfileCreationState,
} from "@/utils/validations/profileCreation/profileCreation";
import { z } from "zod";
import { redirect } from "next/navigation";
import type {
  CreateProfileTransactionAttributes,
  CreateProfileTransactionQuests,
  CreateProfileTransactionQuestsAttributes,
} from "@/utils/types/profile_transaction/createProfileTransactionDataShapes";
import { strengthToIntMap } from "@/utils/helpers/strengthToIntMap";

/**
 * Creates a new user profile by validating input data and inserting attributes, quests,
 * and their relationships into the database using a transactional RPC call.
 *
 * @param userId - The unique identifier of the user for whom the profile is being created.
 * @param quests - An array of Quest objects representing the quests to associate with the profile.
 * @param attributes - An array of Attribute objects representing the attributes to associate with the profile.
 * @returns A promise that resolves to a ProfileCreationState object containing errors or a message if validation or database insertion fails,
 *          or void if the profile is created successfully and the user is redirected.
 *
 * @remarks
 * - Validates the input using `ProfileCreationSchema`.
 * - Prepares and maps the input data for insertion into the "attributes", "quests", and "quests_attributes" tables.
 * - Executes a transactional RPC call to insert the data.
 * - Handles and logs errors, returning appropriate messages.
 * - Redirects to the dashboard upon successful profile creation.
 */
export default async function createProfile(
  userId: string,
  quests: Quest[],
  attributes: Attribute[]
): Promise<ProfileCreationState | void> {
  const supabase = await createSupabaseServerClient();
  // Verify the userId matches the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.id !== userId) {
    return {
      message: "Unauthorized action. Cannot create profile for another user.",
    };
  }

  // Validate input data
  const validatedInput = ProfileCreationSchema.safeParse({
    userId,
    quests,
    attributes,
  });

  if (!validatedInput.success) {
    return {
      errors: z.flattenError(validatedInput.error).fieldErrors,
      message: "Fields not valid. Failed to create profile.",
    };
  }

  // Prepare data for insertion into "attributes", "quests", and "quests_attributes" tables
  const { quests: validatedQuests, attributes: validatedAttributes } =
    validatedInput.data;

  const attributesData: CreateProfileTransactionAttributes[] =
    validatedAttributes.map((attribute) => ({
      name: attribute.name,
      position: attribute.order,
    }));

  const questsData: CreateProfileTransactionQuests[] = [];
  const questsAttributesData: CreateProfileTransactionQuestsAttributes[] = [];
  validatedQuests.forEach((quest) => {
    questsData.push({
      name: quest.name,
      experience_share: quest.experiencePointValue,
      position: quest.order,
    });
    quest.affectedAttributes.forEach((affectedAttribute: AffectedAttribute) => {
      const attributePower = strengthToIntMap[affectedAttribute.strength];
      if (attributePower === undefined) {
        throw new Error(`Invalid strength value: ${affectedAttribute.strength}`);
      }
      questsAttributesData.push({
        quest_name: quest.name,
        attribute_name: affectedAttribute.name,
        attribute_power: attributePower,
      });
    });
  });

  // Insert data into the database within a transaction
  const { error } = await supabase.rpc("create_profile_transaction", {
    p_user_id: userId,
    p_attributes: attributesData,
    p_quests: questsData,
    p_quests_attributes: questsAttributesData,
  });

  if (error) {
    console.error("Error in profile creation transaction:", error);
    return {
      message: "Failed to create profile. Please try again.",
    };
  }

  // Redirect to dashboard upon successful profile creation
  redirect("/dashboard"); // TODO: Create page
}
