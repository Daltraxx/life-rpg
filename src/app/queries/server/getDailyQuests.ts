import {
  intToStrengthMap,
  isStrengthKey,
} from "@/utils/helpers/strengthToIntMap";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { DailyQuest } from "@/utils/types/DailyQuest";

/**
 * Fetches all daily quests for the authenticated user from the Supabase database.
 *
 * @returns {Promise<DailyQuest[]>} An array of daily quests with their associated attributes and completion status.
 * @throws {Error} If the user is not authenticated or if there is an error fetching quests from the database.
 *
 * @example
 * const quests = await getDailyQuests();
 * console.log(quests); // Array of DailyQuest objects
 */
export default async function getDailyQuests(): Promise<DailyQuest[]> {
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
    ),
    latestCompletion:quest_completions (
      id,
      completed_at
    )
  `,
    )
    .eq("user_id", user.id)
    .order("position", { ascending: true })
    .order("completed_at", {
      ascending: false,
      referencedTable: "quest_completions",
    })
    .limit(1, { referencedTable: "quest_completions" });

  if (error) {
    console.error("Error fetching quests:", error);
    throw new Error(error.message);
  }

  const isCompletedToday = (completedAt: string | null): boolean => {
    // TODO: Use the user's timezone (possibly stored in their profile)
    // to determine if the quest was completed "today" rather than relying on server time.
    // This will likely involve fetching the user's timezone from their profile and using a library like `date-fns-tz`
    if (!completedAt) return false;
    const completedDate = new Date(completedAt);
    const today = new Date();
    return (
      completedDate.getFullYear() === today.getFullYear() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getDate() === today.getDate()
    );
  };

  const quests = (data ?? []).map((quest) => {
    const isCompleted = isCompletedToday(quest.latestCompletion[0]?.completed_at ?? null);
    return {
      id: quest.id,
      name: quest.name,
      description: quest.description,
      isCompleted: isCompleted,
      completedQuestId: isCompleted ? quest.latestCompletion[0]?.id ?? null : null,
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

          if (!attribute) {
            throw new Error(`Missing attribute data for quest ID ${quest.id}`);
          }

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
    };
  });
  // TODO: Remove this log after confirming quests are being fetched with correct attributes in development environment
  if (process.env.NODE_ENV === "development") {
    console.log("Fetched quests with attributes:", quests);
  }
  return quests;
}
