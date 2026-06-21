import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Updates the timezone for a user in the database.
 * @param userId - The unique identifier of the user
 * @param timezone - The timezone string to set for the user (e.g., "America/New_York")
 * @returns A promise that resolves when the update is complete
 * @throws Logs an error to console if the database update fails
 */
export default async function setUserTimezone(
  userId: string,
  timezone: string,
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("users")
    .update({ timezone })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user timezone:", error);
  }

  // console.log(`Timezone for user ${userId} updated to: ${timezone}`);
}
