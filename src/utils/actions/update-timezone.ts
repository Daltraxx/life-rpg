"use server";

import setUserTimezone from "@/app/queries/server/set-user-timezone";
import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Updates the timezone for the authenticated user in the database.
 * @param timezone - The timezone string to set for the user
 * @throws An error if the update fails, with the original error as the cause
 */
export async function updateTimezone(timezone: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Unauthorized action: ", authError);
    return;
  }


  try {
    await setUserTimezone(user.id, timezone);
  } catch (error) {
    console.error("Error updating user timezone:", error);
    throw new Error("Failed to update user timezone", { cause: error });
  }
}
