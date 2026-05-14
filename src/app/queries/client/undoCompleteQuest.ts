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

  // Add additional check that completed quest record is from the current date
  // User ownership is ensured through RLS policies.
  const { error } = await supabase
    .from("quest_completions")
    .delete()
    .eq("id", completedQuestId);

  if (error) {
    console.error("Error undoing quest completion:", error);
    throw new Error(error.message);
  }
}