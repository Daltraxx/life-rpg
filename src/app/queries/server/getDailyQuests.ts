import { createSupabaseServerClient } from "@/utils/supabase/server";
import { DailyQuest } from "@/utils/types/DailyQuest";
import isQuestCompletedToday from "./helpers/isQuestCompletedToday";
import getQuestBonusPoints from "@/utils/helpers/getQuestBonusPoints";
import mapAffectedAttributes from "./helpers/mapAffectedAttributes";

/**
 * Fetches all daily quests for the specified user.
 *
 * @param {string} userId - The ID of the user whose daily quests to fetch.
 * @returns {Promise<DailyQuest[]>} An array of daily quests with their completion status and affected attributes.
 *
 * @throws {Error} If there is an error fetching quests from the database.
 * @throws {Error} If quest attribute data is missing or contains invalid strength values.
 *
 * @remarks
 * - Quests are ordered by position ascending, then by completion date descending.
 * - Completion status is determined by checking if the latest completion occurred today in the user's timezone.
 * - Affected attributes are mapped with their strength levels.
 * - In development mode, fetched quests are logged to the console.
 */
export default async function getDailyQuests(
  userId: string,
): Promise<DailyQuest[]> {
  const supabase = await createSupabaseServerClient();

  // RLS policies further restrict access to only quests belonging to the authenticated user, 
  // so combined with this function only being called on the server, 
  // we can be confident that users cannot access quests that don't belong to them.
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
      id,
      strength:attribute_power,
      attributes (
        id,
        name
      )
    ),
    latestCompletion:quest_completions (
      id,
      completed_at,
      processed_at
    ),
    strength_levels (
      multiplier
    )
  `,
    )
    .eq("user_id", userId)
    .order("position", { ascending: true })
    .order("completed_at", {
      ascending: false,
      referencedTable: "quest_completions",
    })
    .limit(1, { referencedTable: "quest_completions" });

  if (error) {
    console.error("Error fetching quests:", error);
    throw new Error("Failed to fetch daily quests", { cause: error });
  }

  const quests = await Promise.all(
    (data ?? []).map(async (quest) => {
      const isCompleted = await isQuestCompletedToday({
        userId,
        latestCompletion: quest.latestCompletion[0] ?? null,
      });
      const completionStatus: DailyQuest["isCompleted"] = isCompleted
        ? "completed"
        : "incomplete";
      if (!quest.strength_levels) {
        throw new Error(
          `Missing strength_levels data for quest ID ${quest.id}`,
        );
      }
      const bonusExperiencePoints = getQuestBonusPoints(
        quest.experienceShare,
        quest.strength_levels.multiplier,
      );

      return {
        id: quest.id,
        name: quest.name,
        description: quest.description,
        isCompleted: completionStatus,
        completedQuestId: isCompleted
          ? (quest.latestCompletion[0]?.id ?? null)
          : null,
        experienceShare: quest.experienceShare,
        frequency: quest.frequency,
        restFrequency: quest.restFrequency,
        streak: quest.streak,
        strengthPoints: quest.strengthPoints,
        strengthLevel: quest.strengthLevel,
        bonusExperiencePoints: bonusExperiencePoints,
        position: quest.position,
        affectedAttributes: mapAffectedAttributes(
          quest.id,
          quest.affectedAttributes,
        ),
      };
    }),
  );
  
  return quests;
}
