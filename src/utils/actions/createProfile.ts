"use server";
import type {
  Attribute,
  Quest,
  AffectedAttribute,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function createProfile(
  userId: string,
  quests: Quest[],
  attributes: Attribute[]
): Promise<void> {
  const supabase = await createSupabaseServerClient();

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
    return;
  } else if (!insertedAttributes) {
    console.error("No attributes were inserted.");
    return;
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
    return;
  } else if (!insertedQuests) {
    console.error("No quests were inserted.");
    return;
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

  // Link inserted quests to inserted attributes in "task_attributes" table
  for (const quest of quests) {
    const questId = questNameToIdMap.get(quest.name);
    const affectedAttributes: AffectedAttribute[] = quest.affectedAttributes;

    affectedAttributes.forEach(async ({ name, strength }) => {
      const attributeId = attributeToIdMap.get(name);

      const { error: taskAttrError } = await supabase
        .from("task_attributes")
        .insert({
          user_id: userId,
          task_id: questId,
          attribute_id: attributeId,
          attribute_power: strength,
        });
      if (taskAttrError) {
        console.error(
          `Error linking quest "${quest.name}" to attribute "${name}":`,
          taskAttrError
        );
        return;
      }
    });
  }
}
