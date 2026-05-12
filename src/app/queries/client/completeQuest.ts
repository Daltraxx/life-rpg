import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import getExperienceEarned from "@/utils/helpers/getExperienceEarned";

/**
 * Completes a quest for the authenticated user.
 *
 * Fetches the quest details, calculates experience earned based on the quest's
 * experience share and strength level multiplier, and inserts a completion record
 * into the database.
 *
 * @param questId - The ID of the quest to complete
 * @throws {Error} If user is not authenticated
 * @throws {Error} If quest data cannot be fetched
 * @throws {Error} If the completion record cannot be inserted
 * @returns Promise that resolves when the quest completion is recorded
 */
export default async function completeQuest(questId: number): Promise<void> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("User authentication error:", authError);
    throw new Error("User not authenticated");
  }

  // Get quest info for calculating experience gain, streak
  const { data: questData, error: questError } = await supabase
    .from("quests")
    .select(
      `
      experience_share,
      streak,
      strength_level,
      strength_levels (
        multiplier
      )`,
    )
    .eq("id", questId)
    .single();

  if (questError || !questData) {
    console.error("Error fetching quest data:", questError);
    throw new Error(questError ? questError.message : "Quest not found");
  }

  // Calculate experience earned
  const experienceEarned = getExperienceEarned(
    questData.experience_share,
    questData.strength_levels.multiplier,
  );

  // Insert completion record
  const { error } = await supabase.from("quest_completions").insert({
    quest_id: questId,
    completed_at: new Date().toISOString(),
    streak: questData.streak,
    experience_earned: experienceEarned,
  });
  if (error) {
    console.error("Error inserting quest completion:", error);
    throw new Error(error.message);
  }
}
