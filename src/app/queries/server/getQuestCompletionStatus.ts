import { createSupabaseServerClient } from "@/utils/supabase/server";
import isQuestCompletedToday from "./helpers/isQuestCompletedToday";

/**
 * Retrieves the completion status of a quest for the current user (server-side).
 *
 * @param questId - The ID of the quest to check
 * @param userId - The ID of the authenticated user
 * @returns A promise that resolves to `true` if the quest was completed today, `false` otherwise
 * @throws Will throw an error if there's an issue fetching quest completion data or if the user is not authenticated
 */
export default async function getQuestCompletionStatus(
  questId: number,
  userId: string,
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  // User ownership of quest is enforced via Supabase RLS policy
  const { data, error } = await supabase
    .from("quest_completions")
    .select("completed_at, is_resolved")
    .eq("quest_id", questId)
    .order("completed_at", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error("Error fetching quest completion status: " + error.message);
  }

  const isCompletedToday = await isQuestCompletedToday({
    userId,
    latestCompletion: data?.[0] ?? null,
  });

  return isCompletedToday;
}
