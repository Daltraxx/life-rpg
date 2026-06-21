import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function setUserTimezone(userId: string, timezone: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users")
    .update({ timezone })
    .eq("id", userId);
  
  if (error) {
    console.error("Error updating user timezone:", error);
  }
}