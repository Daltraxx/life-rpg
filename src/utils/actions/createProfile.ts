"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import {
  ProfileCreationSchema,
  ProfileCreationState,
  ProfileCreationFormData,
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
 * Creates a user profile with associated quests and attributes.
 *
 * This server action handles the complete profile creation flow including:
 * - Authentication verification
 * - Input validation against the ProfileCreationSchema
 * - Data transformation for database insertion
 * - Atomic transaction execution via Supabase RPC
 *
 * @param prevState - The previous state from the form action
 * @param formData - The form data containing userId, quests, and attributes
 * @param formData.userId - The ID of the user creating the profile (must match authenticated user)
 * @param formData.quests - Array of quest objects with name, experiencePointValue, order, and affectedAttributes
 * @param formData.attributes - Array of attribute objects with name and order
 *
 * @returns A Promise resolving to either:
 * - void on successful profile creation (redirects to /dashboard)
 * - ProfileCreationState object with error message or field errors on failure
 *
 * @throws Redirects to /dashboard on successful creation
 *
 * @example
 * const [state, formAction] = useActionState(
     createProfile,
     INITIAL_PROFILE_CREATION_STATE
   );
 *
 * return (
 *   <form action={formAction}>
 *     <input type="hidden" name="userId" value={userId} />
 *     <input type="text" name="quests" />
 *     <input type="text" name="attributes" />
 *     <button type="submit">Create Profile</button>
 *     {state?.message && <p>{state.message}</p>}
 *   </form>
 * );
 */
export default async function createProfile(
  prevState: ProfileCreationState | void,
  formData: FormData
): Promise<ProfileCreationState | void> {
  const supabase = await createSupabaseServerClient();
  // Verify the userId matches the authenticated user
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
  rawFormData.userId = user.id;

  // Validate input data
  const validatedInput = ProfileCreationSchema.safeParse(rawFormData);

  // TODO: Test with nested field errors like AffectedAttributes
  // Consider more granular error handling/logging (treeify the zod errors?)
  if (!validatedInput.success) {
    return {
      errors: z.flattenError(validatedInput.error).fieldErrors,
      message: "Fields not valid. Failed to create profile.",
    };
  }

  // Prepare data for insertion into "attributes", "quests", and "quests_attributes" tables
  const {
    userId: validatedUserId,
    quests: validatedQuests,
    attributes: validatedAttributes,
  } = validatedInput.data;

  const attributesData: CreateProfileTransactionAttributes[] =
    validatedAttributes.map((attribute) => ({
      name: attribute.name,
      position: attribute.order,
    }));

  const questsData: CreateProfileTransactionQuests[] = [];
  const questsAttributesData: CreateProfileTransactionQuestsAttributes[] = [];
  for (const quest of validatedQuests) {
    questsData.push({
      name: quest.name,
      experience_share: quest.experiencePointValue,
      position: quest.order,
    });
    for (const affectedAttribute of quest.affectedAttributes) {
      const attributePower = strengthToIntMap[affectedAttribute.strength];
      if (attributePower === undefined) {
        return {
          message: `Invalid strength value: ${affectedAttribute.strength}`,
        };
      }
      // Duplicate names are restricted by DB constraints and validation schema
      questsAttributesData.push({
        quest_name: quest.name,
        attribute_name: affectedAttribute.name,
        attribute_power: attributePower,
      });
    }
  }

  // Insert data into the database within a transaction
  const { error } = await supabase.rpc("create_profile_transaction", {
    p_user_id: validatedUserId,
    p_attributes: attributesData,
    p_quests: questsData,
    p_quests_attributes: questsAttributesData,
  });

  if (error) {
    // TODO: Consider structured logging solution
    // TODO: Differentiate between different error types (e.g. constraint violations)
    console.error("Error in profile creation transaction:", error);
    return {
      message: "Failed to create profile. Please try again.",
    };
  }

  // Redirect to dashboard upon successful profile creation
  redirect("/dashboard"); // TODO: Create page
}
