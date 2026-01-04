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

export default async function createProfile(
  userId: string,
  quests: Quest[],
  attributes: Attribute[]
): Promise<ProfileCreationState | void> {
  const supabase = await createSupabaseServerClient();

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
  const attributesData: CreateProfileTransactionAttributes[] = attributes.map(
    (attribute) => ({
      name: attribute.name,
      position: attribute.order,
    })
  );

  const questsData: CreateProfileTransactionQuests[] = [];
  const questsAttributesData: CreateProfileTransactionQuestsAttributes[] = [];
  quests.forEach((quest) => {
    questsData.push({
      name: quest.name,
      experience_share: quest.experiencePointValue,
      position: quest.order,
    });
    quest.affectedAttributes.forEach((affectedAttribute: AffectedAttribute) => {
      questsAttributesData.push({
        quest_name: quest.name,
        attribute_name: affectedAttribute.name,
        attribute_power: strengthToIntMap[affectedAttribute.strength],
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
