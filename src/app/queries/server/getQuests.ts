import { createSupabaseServerClient } from "@/utils/supabase/server";
import type { Quest } from "@/utils/types/Quest";
import {
  intToStrengthMap,
  isStrengthKey,
} from "@/utils/helpers/strengthToIntMap";

/**
 * Fetches all quests for the authenticated user from the database.
 *
 * @returns A promise that resolves to an array of Quest objects with their affected attributes,
 *          ordered by position in ascending order.
 * @throws Error if the user is not authenticated or if there's an error fetching quests from the database.
 * @example
 * const quests = await getQuests();
 */
export default async function getQuests(): Promise<Quest[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("quests")
    .select(
      `
    id,
    name,
    description,
    experienceShare:experience_share,
    frequency,
    restFrequency:rest_frequency,
    streak,
    strengthPoints:strength_points,
    strengthLevel:strength_level,
    lastCompletedDate:last_completed_date,
    position,
    updated_at,

    affectedAttributes:quests_attributes (
      strength:attribute_power,
      attributes (
        id,
        name,
        level,
        experience
      )
    )
  `,
    )
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching quests:", error);
    throw new Error(error.message);
  }

  const quests = (data ?? []).map((quest) => ({
    id: quest.id,
    name: quest.name,
    description: quest.description,
    experienceShare: quest.experienceShare,
    frequency: quest.frequency,
    restFrequency: quest.restFrequency,
    streak: quest.streak,
    strengthPoints: quest.strengthPoints,
    strengthLevel: quest.strengthLevel,
    position: quest.position,
    affectedAttributes:
      quest.affectedAttributes?.map((questAttr) => {
        // Ternary to handle both array and single object cases for attributes
        // due to the way Supabase returns related data when using .select with nested relationships
        const attribute = Array.isArray(questAttr.attributes)
          ? questAttr.attributes[0]
          : questAttr.attributes;

        const { strength } = questAttr;
        if (!isStrengthKey(strength)) {
          throw new Error(
            `Invalid strength value for quest attribute: ${strength}`,
          );
        }
        return {
          id: Number(attribute.id),
          name: attribute.name,
          strength: intToStrengthMap[strength],
        };
      }) ?? [],
  }));
  return quests;
}
