import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isValidTimezone } from "@/utils/validations/timezone";

/**
 * Updates the timezone for a user in the database.
 * @param userId - The unique identifier of the user
 * @param timezone - The timezone string to set for the user (e.g., "America/New_York")
 * @returns A promise that resolves when the update is complete
 * @throws An error if the update fails, with the original error as the cause
 */
export default async function setUserTimezone(
  userId: string,
  timezone: string,
): Promise<void> {
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
  
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("users")
    .update({ timezone })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user timezone:", error);
    throw new Error("Failed to update user timezone", { cause: error });
  }
}
