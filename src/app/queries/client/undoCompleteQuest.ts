import { createSupabaseBrowserClient } from "@/utils/supabase/client";

/**
 * Undoes the completion of a quest by deleting the associated quest completion record.
 * @param completedQuestId - The ID of the quest completion record to delete
 * @throws {Error} If the user is not authenticated
 * @throws {Error} If the delete operation fails
 */
export default async function undoCompleteQuest(completedQuestId: number): Promise<void> { 
  const supabase = createSupabaseBrowserClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Ensure quest being undone is from the current date by comparing the completion timestamp with the user's timezone.
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Start of today in UTC
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  // User ownership is ensured through RLS policies.
  const { error } = await supabase
    .from("quest_completions")
    .delete()
    .eq("id", completedQuestId)
    .eq("is_resolved", false) // Only allow undoing if the quest completion has not been resolved (i.e. not yet processed for experience)
    .gte("completed_at", today.toISOString())
    .lt("completed_at", tomorrow.toISOString());

  if (error) {
    console.error("Error undoing quest completion:", error);
    throw new Error(error.message);
  }
}