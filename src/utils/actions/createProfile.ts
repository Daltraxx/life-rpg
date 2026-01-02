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

export default async function createProfile(
  userId: string,
  quests: Quest[],
  attributes: Attribute[]
): Promise<ProfileCreationState> {
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

  //TODO: consider breaking this up into smaller functions for readability and testability
  //TODO: return errors to caller instead of just logging them

  // Insert attributes into "attributes" table
  const { data: insertedAttributes, error: attributesError } = await supabase
    .from("attributes")
    .insert(
      attributes.map((attribute) => ({
        user_id: userId,
        name: attribute.name,
        position: attribute.order,
      }))
    )
    .select("name, id"); // select inserted rows to get their IDs

  if (attributesError) {
    console.error("Error inserting attributes:", attributesError);
    return {
      message: "Error inserting attributes. Failed to create profile.",
    };
  } else if (!insertedAttributes) {
    console.error("No attributes were inserted.");
    return {
      message: "No attributes were inserted. Failed to create profile.",
    };
  }
  console.log("Inserted attributes:", insertedAttributes);

  // Insert quests into "tasks" table
  const { data: insertedQuests, error: questsError } = await supabase
    .from("tasks")
    .insert(
      quests.map((quest) => ({
        user_id: userId,
        name: quest.name,
        experience_share: quest.experiencePointValue,
        position: quest.order,
      }))
    )
    .select("name, id"); // select inserted rows to get their IDs
  if (questsError) {
    console.error("Error inserting quests:", questsError);
    return {
      message: "Error inserting quests. Profile completion incomplete.",
    };
  } else if (!insertedQuests) {
    console.error("No quests were inserted.");
    return {
      message: "No quests were inserted. Profile completion incomplete.",
    };
  }
  console.log("Inserted quests:", insertedQuests);

  // Create maps from names to IDs for inserted attributes and quests
  const attributeToIdMap: Map<string, number> = new Map();
  insertedAttributes.forEach((attr) => {
    attributeToIdMap.set(attr.name, attr.id);
  });

  const questNameToIdMap: Map<string, number> = new Map();
  insertedQuests.forEach((quest) => {
    questNameToIdMap.set(quest.name, quest.id);
  });

  // Prepare data for inserting into "task_attributes" table
  const tasksAttributesInserts = [];
  for (const quest of quests) {
    const questId = questNameToIdMap.get(quest.name);
    if (!questId) {
      console.error(`No quest ID found for quest "${quest.name}".`);
      return {
        message: `No quest ID found for quest "${quest.name}". Profile completion incomplete.`,
      };
    }
    const affectedAttributes: AffectedAttribute[] = quest.affectedAttributes;
    for (const { name, strength } of affectedAttributes) {
      const attributeId = attributeToIdMap.get(name);
      if (!attributeId) {
        console.error(`No attribute ID found for attribute "${name}".`);
        return {
          message: `No attribute ID found for attribute "${name}". Profile completion incomplete.`,
        };
      }
      tasksAttributesInserts.push({
        user_id: userId,
        task_id: questId,
        attribute_id: attributeId,
        attribute_power: strength,
      });
    }
  }

  // Link inserted quests to inserted attributes in "task_attributes" table
  const { error: taskAttributesError } = await supabase
    .from("task_attributes")
    .insert(tasksAttributesInserts);
  if (taskAttributesError) {
    console.error("Error inserting task-attribute links:", taskAttributesError);
    return {
      message:
        "Error inserting task-attribute links. Profile completion incomplete.",
    };
  }

  // Redirect to dashboard upon successful profile creation
  redirect("/dashboard"); // TODO: Create page
}
