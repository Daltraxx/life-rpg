import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import getUserTimezone from "./getUserTimezone";
import getBeginningAndEndOfDayUTC from "@/utils/helpers/getBeginningAndEndOfDayUTC";

/**
 * Undoes a completed quest by deleting its completion record from the database.
 *
 * This function validates that:
 * - The user is authenticated
 * - The quest completion occurred on the current day (in the user's timezone)
 * - The quest completion has not been resolved (i.e., experience not yet processed)
 *
 * @param completedQuestId - The ID of the quest completion record to undo
 * @returns A promise that resolves when the quest completion has been deleted
 * @throws {Error} If the user is not authenticated or if the database operation fails
 * @remarks
 * - User ownership of the quest completion record is enforced through RLS policies in the database.
 * - The function checks the completion timestamp against the user's timezone to ensure only today's quests can be undone.
 * - Only quest completions that have not been resolved (i.e., experience not yet awarded) can be undone to prevent inconsistencies in experience points.
 * - If no row exists that matches the criteria (e.g., already resolved, not from today, or does not belong to the user), 
 * - the function will complete without error but no changes will be made to the database.
 */
export default async function undoCompleteQuest(
  completedQuestId: number,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Ensure quest being undone is from the current date by comparing the completion timestamp with the user's timezone.
  const userTimezone = await getUserTimezone(user.id);
  const { beginningOfDayUTC, endOfDayUTC } =
    getBeginningAndEndOfDayUTC(userTimezone);

  // User ownership is ensured through RLS policies.
  const { error } = await supabase
    .from("quest_completions")
    .delete()
    .eq("id", completedQuestId)
    .eq("is_resolved", false) // Only allow undoing if the quest completion has not been resolved (i.e. not yet processed for experience)
    .gte("completed_at", beginningOfDayUTC)
    .lt("completed_at", endOfDayUTC);

  if (error) {
    console.error("Error undoing quest completion:", error);
    throw new Error(error.message);
  }
}
