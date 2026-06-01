import {
  intToStrengthMap,
  isStrengthKey,
} from "@/utils/helpers/strengthToIntMap";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { DailyQuest } from "@/utils/types/DailyQuest";
import isQuestCompletedToday from "./helpers/isQuestCompletedToday";
import getQuestBonusPoints from "@/utils/helpers/getQuestBonusPoints";

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
      completed_at,
      is_resolved
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
    throw new Error(error.message);
  }

  const quests = await Promise.all(
    (data ?? []).map(async (quest) => {
      const isCompleted = await isQuestCompletedToday({
        userId,
        latestCompletion: quest.latestCompletion[0] ?? null,
      });
      const completionStatus: DailyQuest["isCompleted"] = isCompleted
        ? "true"
        : "false";
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
        affectedAttributes:
          quest.affectedAttributes?.map((questAttr) => {
            // Ternary to handle both array and single object cases for attributes
            // due to the way Supabase returns related data when using .select with nested relationships
            const attribute = Array.isArray(questAttr.attributes)
              ? questAttr.attributes[0]
              : questAttr.attributes;

            if (!attribute) {
              throw new Error(
                `Missing attribute data for quest ID ${quest.id}`,
              );
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
    }),
  );
  // TODO: Remove this log after confirming quests are being fetched with correct attributes in development environment
  if (process.env.NODE_ENV === "development") {
    console.log("Fetched quests with attributes:", quests);
  }
  return quests;
}
