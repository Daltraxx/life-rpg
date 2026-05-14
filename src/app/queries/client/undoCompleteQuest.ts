import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default async function undoCompleteQuest(questId: number): Promise<void> { 
  const supabase = createSupabaseBrowserClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("quest_completions")
    .delete()
    .eq("quest_id", questId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error undoing quest completion:", error);
    throw new Error(error.message);
  }
}