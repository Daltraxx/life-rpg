import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function getQuestCompletionStatus(
  questId: string,
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("quest_completions")
    .select("completed_at")
    .eq("quest_id", questId)
    .order("completed_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching quest completion status:", error);
    return false;
  }

  const today = new Date();
  if (data.length > 0) {
    const lastCompletionDate = new Date(data[0].completed_at);
    // Check if the last completion date is today    
    if (
      lastCompletionDate.getFullYear() === today.getFullYear() &&
      lastCompletionDate.getMonth() === today.getMonth() &&
      lastCompletionDate.getDate() === today.getDate()
    ) {
      return true;
    }
  }

  return false;
}
